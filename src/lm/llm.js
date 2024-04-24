import { convert } from "html-to-text";
import { API_KEY } from "../api_key.js";
import { ChatZhipuAI } from "@langchain/community/chat_models/zhipuai";
import {
  runValue,
  runComparison,
  runProportion,
  runTrend,
  runAsso,
  runRank,
  runExtreme,
  runAnomaly,
} from "./typeExtractors/extractorsList.js";
import splitInsight from "./splitInsight.js";
import {
  specAnomoly,
  specAssociation,
  specComparison,
  specExtreme,
  specProportion,
  specRank,
  specTrend,
  specValue,
} from "./specParsers/specParsersList.js";
import runMatch from "./combineType.js";

const removeHTML = (input) => {
  const plainText = convert(input, {
    wordwrap: false,
    ignoreHref: true,
    ignoreImage: true,
    preserveNewlines: true,
  });

  // split by \n
  const textContent = plainText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");

  return textContent;
};

const generateGistVisMarkup = async (input) => {
  const textContent = removeHTML(input);

  const model = new ChatZhipuAI({
    modelName: "glm-3-turbo", // Available models:
    temperature: 0.01,
    zhipuAIApiKey: API_KEY, // In Node.js defaults to process.env.ZHIPUAI_API_KEY
    verbose: true,
  });

  const divtextContent = [];
  async function processTextContent() {
    for (const part of textContent) {
      const result = await splitInsight(model, part);
      divtextContent.push(result);
    }
    console.log(divtextContent);
  }

  await processTextContent();

  const typetextContent = [];
  for (let i = 0; i < divtextContent.length; i++) {
    for (let j = 0; j < divtextContent[i].length; j++) {
      const id = `p${i}s${j}`;
      const value = divtextContent[i][j];
      const item = { id: id, text: value, type: [] };
      const models = [
        runComparison,
        runTrend,
        runRank,
        runProportion,
        runExtreme,
        runAnomaly,
        runValue,
      ];
      for (const runModel of models) {
        try {
          const current = await runModel(model, value, id);
          console.log(current);
          if (current.type) {
            item.type.push(current.type);
          }
        } catch (error) {
          console.error("An error occurred:", error);
          continue;
        }
      }
      // console.log(item.type);
      let newitem;
      if (item.type.length > 1) {
        newitem = await runMatch(model, item);
      } else {
        newitem = {
          ...item,
          type: item.type[0],
        };
      }
      typetextContent.push(newitem);
      setTimeout(() => {
        // console.log("Resuming loop after 5 seconds.");
      }, 3000);
    }
  }
  // console.log(typetextContent);

  const llmoption = [];
  for (const part of typetextContent) {
    let llmoptio;
    switch (part.type) {
      case "comparison":
        // console.log(part);
        llmoptio = await specComparison(model, part);
        llmoption.push(llmoptio);
        break;
      case "trend":
        llmoptio = await specTrend(model, part);
        llmoption.push(llmoptio);
        break;
      // case "association":
      //   llmoptio = await specAssociation(model, part);
      //   llmoption.push(llmoptio);
      //   break;
      case "rank":
        llmoptio = await specRank(model, part);
        llmoption.push(llmoptio);
        break;
      case "proportion":
        llmoptio = await specProportion(model, part);
        llmoption.push(llmoptio);
        break;
      case "extreme":
        llmoptio = await specExtreme(model, part);
        llmoption.push(llmoptio);
        break;
      case "anomaly":
        llmoptio = await specAnomoly(model, part);
        llmoption.push(llmoptio);
        break;
      case "value":
        llmoptio = await specValue(model, part);
        llmoption.push(llmoptio);
        break;
      default:
        llmoptio = part;
        llmoption.push(llmoptio);
        break;
    }
    setTimeout(() => {
      // console.log("Resuming loop after 5 seconds.");
    }, 3000);
  }
  // console.log(llmoption);

  return llmoption;
};

export default generateGistVisMarkup;
