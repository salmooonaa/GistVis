import {
  StructuredOutputParser,
  RegexParser,
  CombiningOutputParser,
} from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";
import { ExtractOutputParser } from "./constants";
import { ChatOpenAI, ChatOpenAICallOptions } from "@langchain/openai";
// import TransformData from "../transSpec";
import { ExtractorType, GistFactTypeAnnotation } from "../types";
import { ExtractorSystemInstruction } from "../promptSnippets";
import { getZodFormatting } from "./utils";

const extrProp = async (
  model: ChatOpenAI<ChatOpenAICallOptions>,
  textContent: GistFactTypeAnnotation
) => {
  const specParser = StructuredOutputParser.fromZodSchema(
    getZodFormatting(textContent.type)
  );
  const typeParser = new RegexParser(
    /insightType: (proportion)/,
    ["insightType"],
    "noType"
  );
  const parser = new CombiningOutputParser(specParser, typeParser);

  const extrpropchain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
        You are a professional text preprocessing assistant specializing in text visualization. Please provide a well-structured response to the user's chunk of the text strictly according to rules, including the complete original text of the text chunk provided by user.
        ${ExtractorSystemInstruction}
        This sentence contains proportion. First, you should extract the proportion. Then you should extract the value of proportion and convert percentages and other forms into decimals.
        Specifically, for 'category_key', identify the subject of comparison with its context, e.g., "the category of GDP growth" instead of just "entity". But the 'value_key' of all data items should keep the same.
        For 'value_key', specify the exact context of the value being compared, e.g., "the GDP growth rate" instead of just "value". But the 'category_key' of all data items should keep the same.
        Specifically, for 'category_key', identify the subject of comparison with its context, e.g., "the category of GDP growth" instead of just "entity". But the 'value_key' of all data items should keep the same.

        The user intends to use a pie chart to represent the proportion. Please find the most suitable location for placing the pie chart and output it.
        \n{format_instructions}\n{insightType}\n{paragraph}
        `),
    model,
    parser,
  ]);

  const response = await extrpropchain.invoke({
    format_instructions: parser.getFormatInstructions(),
    insightType: "insightType:" + textContent.type,
    paragraph: "User:" + textContent.text,
  });
  // console.dir(response);
  return response as ExtractorType;
  // const newResponse = TransformData(response);
  // {
  //   ...response,
  //   dataSpec: response.dataSpec.map(({ categoryKey, categoryValue, valueKey, valueValue }) => {
  //     return {
  //       [category_key]: category_value,
  //       [value_key]: value_value
  //     };
  //   })
  // };
  // console.log(newResponse);
// return newResponse;
};

export default extrProp;
