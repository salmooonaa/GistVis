import {
  StructuredOutputParser,
  RegexParser,
  CombiningOutputParser
} from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";
import TransformData from "../transSpec";

const extrProp = async (model, textContent) => {
  // const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
  //   id: "unique id of text block",
  //   text: "original text provided by the user",
  //   value1:
  //     "the value of proportion(already converted into decimals). If it does not exist, return NAN",
  //   pos: "The previous word in the recommended location",
  // });
  const specParser = StructuredOutputParser.fromZodSchema(z.object({
    id: z.string().describe("unique id of text block"),
    context: z.string().describe("original text provided by the user"),
    dataSpec: z.array(z.object({
      categoryKey: z.string().describe("The category of the entity of the data item according to the context. If it does not exist, return an empty string"),
      categoryValue: z.string().describe("The entity of the data item(must be the original context). If it does not exist, return an empty string"),
      valueKey: z.string().describe("The definition of the value of the data item according to the context. If it does not exist or is uncertain, return an empty string"),
      valueValue: z.number().describe("The value of proportion(already converted into decimals). If it does not exist or is uncertain, return NAN"),
    })),
  }));
  // const specParser = StructuredOutputParser.fromZodSchema(z.object({
  //   id: z.string().describe("unique id of text block"),
  //   context: z.string().describe("original text provided by the user"),
  //   spec: z.object({
  //     value1: z.string().describe("the value of proportion(already converted into decimals). If it does not exist, return NAN"),
  //     pos: z.string().describe("The previous word in the recommended location"),
  //   }),
  // }));
  const typeParser = new RegexParser(/insightType: (proportion)/, ["insightType"], "noType");
  const parser = new CombiningOutputParser(specParser, typeParser);

  const extrpropchain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
        You are a professional text preprocessing assistant specializing in text visualization. Please provide a well-structured response to the user's chunk of the text strictly according to rules, including the complete original text of the text chunk provided by user.
        You have to extract entities, numerical values, and other content from text blocks as required. 
        This sentence contains proportion. First, you should extract the proportion. Then you should extract the value of proportion and convert percentages and other forms into decimals.
        Specifically, for 'category_key', identify the subject of comparison with its context, e.g., "the category of GDP growth" instead of just "entity". But the 'value_key' of all data items should keep the same.
        For 'value_key', specify the exact context of the value being compared, e.g., "the GDP growth rate" instead of just "value". But the 'category_key' of all data items should keep the same.
        Specifically, for 'category_key', identify the subject of comparison with its context, e.g., "the category of GDP growth" instead of just "entity". But the 'value_key' of all data items should keep the same.
        For 'value_key', specify the exact context of the value being compared, e.g., "the GDP growth rate" instead of just "value". But the 'category_key' of all data items should keep the same.
        The user intends to use a pie chart to represent the proportion. Please find the most suitable location for placing the pie chart and output it.
        \n{format_instructions}\n{index}\n{insightType}\n{paragraph}
        `),
    model,
    parser,
  ]);

  const response = await extrpropchain.invoke({
    format_instructions: parser.getFormatInstructions(),
    index: "id:" + textContent.id,
    insightType: "insightType:" + textContent.type,
    paragraph: "User:" + textContent.text,
  });
  // console.dir(response);

  const newResponse = TransformData(response);
  // {
  //   ...response,
  //   dataSpec: response.dataSpec.map(({ categoryKey, categoryValue, valueKey, valueValue }) => {
  //     return {
  //       [category_key]: category_value,
  //       [value_key]: value_value
  //     };
  //   })
  // };
  console.log(newResponse)
  return newResponse;
};

export default extrProp;