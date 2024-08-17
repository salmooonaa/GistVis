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
} from "./typeChecker/typeCheckerList";
import splitInsight from "./discoverer";
import {
  GistvisSpec,
  InsightType,
  paragraphSpec,
  UnitSegmentSpec,
} from "../visualizer/types";
import lodash from "lodash";
import runMatch from "./typeModerator";
import {
  specComparison,
  specExtreme,
  specProportion,
  specRank,
  specTrend,
  specValue,
} from "./extractor/specParsersList";
// import runMatch from "./typeModerator";
// import { transData } from './transData.js'

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

const generateGistVisMarkup = async (input: string) => {
  const paragraphList = removeHTML(input);
  // check if textContent is empty, if so, return null
  if (paragraphList.length === 0) {
    return [];
  }

  console.log("paragraphList", paragraphList);

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
    // frequency_penalty: 0.75,
    // presence_penalty: 0,
    n: 1,
    streaming: false,
    openAIApiKey: process.env.REACT_APP_LLM_API_KEY,
    modelName: process.env.REACT_APP_LLM_MODEL_NAME,
    configuration: {
      apiKey: process.env.REACT_APP_LLM_API_KEY,
      // modelName: process.env.REACT_APP_LLM_MODEL_NAME,
      baseURL: process.env.REACT_APP_LLM_URL_BASE,
    },
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

  async function factTypeAnnotator(model: ChatOpenAI, textContent: string) {
    const candidateTypeProposals = await Promise.all([
      runComparison(model, textContent),
      runExtreme(model, textContent),
      runProportion(model, textContent),
      runRank(model, textContent),
      runTrend(model, textContent),
      runValue(model, textContent),
    ]);

    // TODO: 1. error handling and interative request
    // TODO: 2. now the moderator is not working as intended!
    let candidateTypes = lodash.uniq(
      candidateTypeProposals.map((d: GistFactTypeAnnotation) => d.type)
    );
    candidateTypes = lodash.filter(candidateTypes, (d: string) => d !== "");

    if (candidateTypes.length > 1) {
      const modereatedType = await runMatch(
        model,
        textContent,
        candidateTypes as string[]
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

  console.log(typedParagraphSpecList)

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

  console.log(fullList)

  return fullList;
};

export default generateGistVisMarkup;



  // const llmoption = [];
  // console.log(typetextContent);
  // for (const part of typetextContent) {
  //   let llmoptio;
  //   switch (part.type) {
  //     case "comparison":
  //       // console.log(part);
  //       llmoptio = await specComparison(model, part);
  //       llmoption.push(llmoptio);
  //       break;
  //     case "trend":
  //       llmoptio = await specTrend(model, part);
  //       llmoption.push(llmoptio);
  //       break;
  //     // case "association":
  //     //   llmoptio = await specAssociation(model, part);
  //     //   llmoption.push(llmoptio);
  //     //   break;
  //     case "rank":
  //       llmoptio = await specRank(model, part);
  //       llmoption.push(llmoptio);
  //       break;
  //     case "proportion":
  //       llmoptio = await specProportion(model, part);
  //       llmoption.push(llmoptio);
  //       break;
  //     case "extreme":
  //       llmoptio = await specExtreme(model, part);
  //       llmoption.push(llmoptio);
  //       break;
  //     case "anomaly":
  //       llmoptio = await specAnomoly(model, part);
  //       llmoption.push(llmoptio);
  //       break;
  //     case "value":
  //       llmoptio = await specValue(model, part);
  //       llmoption.push(llmoptio);
  //       break;
  //     default:
  //       llmoptio = part;
  //       llmoption.push(llmoptio);
  //       break;
  //   }
  //   setTimeout(() => {
  //     // console.log("Resuming loop after 5 seconds.");
  //   }, 3000);
  // }
  // // console.log(llmoption);
  // const transLlmoption = transData(llmoption);
  // console.log(transLlmoption)
  // return transLlmoption;
