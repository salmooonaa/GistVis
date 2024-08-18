import { convert } from "html-to-text";
import { ChatZhipuAI } from "@langchain/community/chat_models/zhipuai";
import { ChatOpenAI } from "@langchain/openai";
import { OpenAI } from "@langchain/openai";
import { GistFactTypeAnnotation } from "./types";
import {
  runValue,
  runComparison,
  runProportion,
  runTrend,
  runRank,
  runExtreme,
} from "./annotator/deprecated/typeCheckerList";
import splitInsight from "./discoverer";
import {
  GistvisSpec,
  InsightType,
  paragraphSpec,
  UnitSegmentSpec,
  VisInsightType,
} from "../visualizer/types";
import lodash from "lodash";
import runMatch from "./annotator/typeModerator";
import {
  specComparison,
  specExtreme,
  specProportion,
  specRank,
  specTrend,
  specValue,
} from "./extractor/specParsersList";
import { gistKB } from "./visKB";
import runTypeCheck from "./annotator/runTypeCheck";

const removeHTML = (input: string) => {
  const plainText = convert(input, {
    wordwrap: false,
    // ignoreHref: true,
    // ignoreImage: true,
    preserveNewlines: true,
  });

  // split by \n
  const textContent = plainText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");

  return textContent;
};

const generateGistVisMarkup = async (input: string, setStage: any) => {
  const paragraphList = removeHTML(input);
  // check if textContent is empty, if so, return null
  if (paragraphList.length === 0) {
    return [];
  }

  // Step 0: Initialize LLM (of choice)

  // const model = new ChatZhipuAI({
  //   modelName: "glm-3-turbo", // Available models:
  //   temperature: 0.01,
  //   zhipuAIApiKey: API_KEY, // In Node.js defaults to process.env.ZHIPUAI_API_KEY
  //   verbose: true,
  // });

  const model = new ChatOpenAI({
    temperature: 0.7,
    topP: 1,
    n: 1,
    streaming: false,
    openAIApiKey: process.env.REACT_APP_LLM_API_KEY,
    modelName: process.env.REACT_APP_LLM_MODEL_NAME,
    configuration: {
      apiKey: process.env.REACT_APP_LLM_API_KEY,
      baseURL: process.env.REACT_APP_LLM_URL_BASE,
    },
    verbose: false,
  });

  // const model_json = model.bind({
  //   response_format: {
  //     type: "json_object",
  //   },
  // });

  // Step 1: Discoverer
  async function processTextContent(paragraphList: string[]) {
    const segmentationResult = await Promise.all(
      paragraphList.map(async (part: string) => {
        return await splitInsight(model, part);
      })
    );
    return segmentationResult;
  }

  const divtextContent = await processTextContent(paragraphList);

  const gistParagraphSpecList: paragraphSpec[] = divtextContent.map(
    (item: string[], paragraphIdx: number) => {
      return {
        paragraphIdx: paragraphIdx,
        paragraphContent: item.map((sentence: string, segmentIdx: number) => {
          return {
            id: `p${paragraphIdx}s${segmentIdx}`,
            unitSegmentSpec: {
              insightType: "noType",
              segmentIdx: segmentIdx,
              context: sentence.trim(),
            } as UnitSegmentSpec,
          } as GistvisSpec;
        }),
      } as paragraphSpec;
    }
  );
  // Stage 1 complete
  setStage(1);

  async function factTypeAnnotator(model: ChatOpenAI, textContent: string) {
    const gistTypes = Object.keys(gistKB)
    // Promise loop call LLM for each gistType
    const candidateTypeProposals = await Promise.all(
      gistTypes.map(async (type: string) => {
        console.log(`Running type check for ${type}`);
        return runTypeCheck(model, textContent, type as VisInsightType);
      })
    )
    // const candidateTypeProposals = await Promise.all([
    //   runComparison(model, textContent),
    //   runExtreme(model, textContent),
    //   runProportion(model, textContent),
    //   runRank(model, textContent),
    //   runTrend(model, textContent),
    //   runValue(model, textContent),
    // ]);

    // TODO: error handling and interative request
    let candidateTypes = lodash.uniq(
      candidateTypeProposals.map((d: GistFactTypeAnnotation) => d.type)
    );
    candidateTypes = lodash.filter(candidateTypes, (d: string) => d !== "");

    if (candidateTypes.length > 1) {
      const modereatedType = await runMatch(
        model,
        textContent,
        candidateTypes as string[],
      );
      return modereatedType.type;
    } else if (candidateTypes.length === 1) {
      return candidateTypes[0];
    } else {
      return "noType";
    }
  }

  const typedParagraphSpecList = await Promise.all(
    gistParagraphSpecList.map(async (paragraphSpec: paragraphSpec) => {
      const paragraphContentPromises = paragraphSpec.paragraphContent.map(
        async (gistvisSpec: GistvisSpec) => {
          const moderatedGistType = await factTypeAnnotator(
            model,
            gistvisSpec.unitSegmentSpec.context
          );
          return {
            ...gistvisSpec,
            unitSegmentSpec: {
              ...gistvisSpec.unitSegmentSpec,
              insightType: moderatedGistType,
            } as UnitSegmentSpec,
          } as GistvisSpec;
        }
      );

      const paragraphContent = await Promise.all(paragraphContentPromises);

      return {
        ...paragraphSpec,
        paragraphContent: paragraphContent,
      } as paragraphSpec;
    })
  );

  // stage 2 complete
  setStage(2);
  // console.log(typedParagraphSpecList)

  const extractorMap = {
    comparison: specComparison,
    trend: specTrend,
    rank: specRank,
    proportion: specProportion,
    extreme: specExtreme,
    value: specValue,
  };

  const fullList = await Promise.all(
    typedParagraphSpecList.map(async (paragraphSpec: paragraphSpec) => {
      const paragraphContentPromises = paragraphSpec.paragraphContent.map(
        async (gistvisSpec: GistvisSpec) => {
          if (gistvisSpec.unitSegmentSpec.insightType !== "noType") {
            const extractor =
              extractorMap[gistvisSpec.unitSegmentSpec.insightType];
            const input: GistFactTypeAnnotation = {
              text: gistvisSpec.unitSegmentSpec.context,
              type: gistvisSpec.unitSegmentSpec.insightType,
            };
            const result = await extractor(model, input);
            console.log(result);
            return {
              ...gistvisSpec,
              dataSpec: result.dataSpec ? result.dataSpec: [],
              unitSegmentSpec: {
                ...gistvisSpec.unitSegmentSpec,
                inSituPosition: result.pos ?? [],
                attribute: result.attribute ?? undefined,
              }
            };
          } else {
            return gistvisSpec;
          }
        }
      );

      const paragraphContent = await Promise.all(paragraphContentPromises);

      return {
        ...paragraphSpec,
        paragraphContent: paragraphContent,
      } as paragraphSpec;
    })
  );
  // stage 3 complete
  setStage(3)
  console.log(fullList)

  return fullList;
};

export default generateGistVisMarkup;