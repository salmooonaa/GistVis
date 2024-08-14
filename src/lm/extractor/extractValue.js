import {
  StructuredOutputParser,
  RegexParser,
  CombiningOutputParser
} from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import TransformData from "../transSpec";
import { z } from "zod";

const extrVal = async (model, textContent) => {
  // const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
  //   id: "unique id of text block",
  //   text: "original text provided by the user",
  //   value1:
  //     "the value(already converted into numbers). If it does not exist, return NAN",
  //   pos: "the numeric word(value)",
  // });
  const specParser = StructuredOutputParser.fromZodSchema(z.object({
    id: z.string().describe("unique id of text block"),
    context: z.string().describe("original text provided by the user"),
    dataSpec: z.array(z.object({
      categoryKey: z.string().describe("The category of the entity of the data item according to the context. If it does not exist, return an empty string"),
      categoryValue: z.string().describe("The entity of the data item. If it does not exist, return an empty string"),
      valueKey: z.string().describe("The definition of the value of the data item according to the context. If it does not exist or is uncertain, return an empty string"),
      valueValue: z.number().describe("The numeric word(value). If it does not exist or is uncertain, return an empty string"),
    })),
  }));
  // const specParser = StructuredOutputParser.fromZodSchema(z.object({
  //   id: z.string().describe("unique id of text block"),
  //   context: z.string().describe("original text provided by the user"),
  //   spec: z.object({
  //     value1: z.string().describe("the value(already converted into numbers). If it does not exist, return NAN"),
  //     pos: z.string().describe("the numeric word(value)"),
  //   }),
  // }));
  const typeParser = new RegexParser(/insightType: (value)/, ["insightType"], "noType");
  const parser = new CombiningOutputParser(specParser, typeParser);

  const extrvalchain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
        You are a professional text preprocessing assistant specializing in text visualization. Please provide a well-structured response to the user's chunk of the text strictly according to rules, including the complete original text of the text chunk provided by user.
        You have to extract entities, numerical values, and other content from text blocks as required. 
        This sentence contains value. Values are usually a numerical value with special meaning that have a significant impact on entities. 
        First, you should extract the value. Then you should convert it into numbers.
        The user intends to highlight the value. Please output the position of the value.
        Specifically, for 'category_key', identify the subject of comparison with its context, e.g., "the category of GDP growth" instead of just "entity". But the 'value_key' of all data items should keep the same.
        For 'value_key', specify the exact context of the value being compared, e.g., "the GDP growth rate" instead of just "value". But the 'category_key' of all data items should keep the same.
        \n{format_instructions}\n{index}\n{insightType}\n{paragraph}
        `),
    model,
    parser,
  ]);

  const response = await extrvalchain.invoke({
    format_instructions: parser.getFormatInstructions(),
    index: "id:" + textContent.id,
    insightType: "insightType:" + textContent.type,
    paragraph: "User:" + textContent.text,
  });
  // console.dir(response);
  const newResponse = TransformData(response);
  // {
  //   ...response,
  //   dataspec: response.dataspec.map(({ category_key, category_value, value_key, value_value }) => {
  //     return {
  //       [category_key]: category_value,
  //       [value_key]: value_value
  //     };
  //   })
  // };

  console.dir(newResponse);
  return newResponse;
};

export default extrVal;