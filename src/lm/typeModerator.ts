import {
  StructuredOutputParser,
  RegexParser,
  CombiningOutputParser,
  CustomListOutputParser,
} from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI, ChatOpenAICallOptions } from "@langchain/openai";
import { GistFactTypeAnnotation } from "./types";
import { SystemPrompt } from "./promptSnippets";
import { InsightType } from "../visualizer/types";

const gistFactDefinition: {[key in InsightType]?: string} = {
  comparison: "Comparison refers to the act of comparing two data attributes.",
  trend: "Trend presents a general tendency over a time segment.",
  // association:
  //   "Association refers to the useful relationship between two data attributes or among multiple attributes and can be categorized as positive, negative, or neutral sentiment.",
  rank: "Rank refers to sort the data attributes based on their values and show the breakdown of selected data attributes.",
  proportion:
    "Proportion refers to measure the proportion of selected data attribute(s) within a specified set, usually a ratio or a fraction less than or equal to 10.",
  extreme:
    "Extreme refers to the extreme data cases along with the data attributes or within a certain range, such as maximum and minimum.",
  // anomaly:
  //   "Anomalies are usually data points that are significantly different from expected patterns.",
  value:
    "Values are usually a numerical value with special meaning that have a significant impact on entities.",
};


const runMatch = async (
  model: ChatOpenAI<ChatOpenAICallOptions>,
  textContent: string,
  candidateTypes: string[]
) => {
  // console.log(textContent);
  const candidateTypesRegex = candidateTypes.join("|");
  const optionNums = candidateTypes.length;
  const candidateTypesDefinition = candidateTypes.map((type) => {
    return gistFactDefinition[type as InsightType];
  }).join("\n");

  const typeParser = new RegexParser(
    `/Type: (${candidateTypesRegex})/`,
    ["type"],
    "noType"
  );
  const parser = new CombiningOutputParser(typeParser);

  const matchain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
        ${SystemPrompt}

        You are given a text chunk with ${optionNums} possible types, and you need to choose only one most suitable type based on the following definitions and return it as the type.

        ${candidateTypesDefinition}

        \n{format_instructions}\n{paragraph}
        `),
    model,
    parser,
  ]);

  const response = await matchain.invoke({
    format_instructions: parser.getFormatInstructions(),
    paragraph: "User:" + textContent,
  });
  console.dir(response);

  return response as GistFactTypeAnnotation;
};

export default runMatch;
