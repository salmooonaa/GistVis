import {
  StructuredOutputParser,
  RegexParser,
  CombiningOutputParser
} from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import TransformData from "../transSpec";
import { z } from "zod";

const extrRank = async (model, textContent) => {
  // const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
  //   id: "unique id of text block",
  //   text: "original text provided by the user",
  //   entity1: "subject of rank, usually an entity",
  //   value1:
  //     "the ranking of the entity(already converted into numbers). If it does not exist, return NAN",
  //   pos: "The previous word in the recommended location",
  // });
  // const specParser = StructuredOutputParser.fromZodSchema(z.object({
  //   id: z.string().describe("unique id of text block"),
  //   context: z.string().describe("original text provided by the user"),
  //   spec: z.object({
  //     value1: z.string().describe("the ranking of the entity(already converted into numbers). If it does not exist, return NAN"),
  //     pos: z.string().describe("The previous word in the recommended location"),
  //   }),
  // }));
  const specParser = StructuredOutputParser.fromZodSchema(z.object({
    id: z.string().describe("unique id of text block"),
    context: z.string().describe("original text provided by the user"),
    dataSpec: z.array(z.object({
      categoryKey: z.string().describe("The category of the entity of the data item according to the context. If it does not exist, return an empty string"),
      categoryValue: z.string().describe("The entity of the data item. If it does not exist, return an empty string"),
      valueKey: z.string().describe("The definition of the value of the data item according to the context. If it does not exist or is uncertain, return an empty string"),
      valueValue: z.number().describe("The ranking of the entity(already converted into numbers). If it does not exist or is uncertain, return NAN"),
    })),
  }));
  const typeParser = new RegexParser(/insightType: (rank)/, ["insightType"], "noType");
  const parser = new CombiningOutputParser(specParser, typeParser);
  // console.log(textContent);
  const extrrankchain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
        You are a professional text preprocessing assistant specializing in text visualization. Please provide a well-structured response to the user's chunk of the text strictly according to rules, including the complete original text of the text chunk provided by user.
        You have to extract entities, numerical values, and other content from text blocks as required. 
        This sentence contains rank. Rank refers to sort the data attributes based on their values and show the position of selected data attributes. 
        First, you should extract the subject of rank, usually an entity. Next, extract rankings of identified entities and convert them into numbers as (value: 1). If the ranking is non-numeric, such as "great", prioritize them based on their qualitative level and convert them into numbers. 
        For 'value_key', specify the exact context of the value being compared, e.g., "the GDP growth rate" instead of just "value". But the 'category_key' of all data items should keep the same.
        The user intends to use a bar chart to represent the comparison. Please find the most suitable location for placing the bar chart and output the previous word in the recommended location.
        The user intends to use a bar chart to represent the rank. Please find the most suitable location for placing the bar chart and output the previous word in the recommended location.
        \n{format_instructions}\n{index}\n{insightType}\n{paragraph}
        `),
    model,
    parser,
  ]);

  const response = await extrrankchain.invoke({
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

  console.log(newResponse)
  return newResponse;
};


export default extrRank;