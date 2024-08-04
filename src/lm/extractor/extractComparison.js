import {
  StructuredOutputParser,
  RegexParser,
  CombiningOutputParser
} from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";

const extrComp = async (model, textContent) => {
  // const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
  //   id: "unique id of text block",
  //   text: "original text provided by the user",
  //   entity1:
  //     "The subject of comparison with a higher value, usually an entity. If it does not exist, return an empty string",
  //   entity2:
  //     "The subject of comparison with a lower value, usually an entity. If it does not exist, return an empty string",
  //   value1:
  //     "the higher value in the comparison(already converted into numbers or percentages). If it does not exist or is uncertain, return NAN",
  //   value2:
  //     "the lower value in the comparison(already converted into numbers or percentages). If it does not exist or is uncertain, return NAN",
  //   value3:
  //     "the delta in the comparison(already converted into numbers). If it does not exist, return NAN",
  //   pos: "The previous word in the recommended location",
  // });

  const specParser = StructuredOutputParser.fromZodSchema(z.object({
    id: z.string().describe("unique id of text block"),
    context: z.string().describe("original text provided by the user"),
    dataspec: z.array(z.object({
      category_key: z.string().describe("The category of the entity of the data item according to the context. If it does not exist, return an empty string"),
      category_value: z.string().describe("The entity of the data item. If it does not exist, return an empty string"),
      value_key: z.string().describe("The definition of the value of the data item according to the context. If it does not exist or is uncertain, return an empty string"),
      value_value: z.number().describe("The value(only numbers) of the value of the data item. If it does not exist or is uncertain, return NAN"),
    })),
  }));
  const typeParser = new RegexParser(/Type: (comparison)/, ["type"], "noType");
  const parser = new CombiningOutputParser(specParser, typeParser);

  const extrcompchain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
        You are a professional text preprocessing assistant specializing in text visualization. Please provide a well-structured response to the user's chunk of the text strictly according to rules, including the complete original text of the text chunk provided by user.
        You have to extract entities, numerical values, and other content with detailed context from text blocks as required. based on context.
        This sentence contains comparison. Comparison refers to the act of comparing two or more data attributes or comparing the target object with previous values, especially along a time series. 
        First, you should extract the object of comparison, usually an entity. Then convert the data into numbers.        
        Specifically, for 'category_key', identify the subject of comparison with its context, e.g., "the category of GDP growth" instead of just "entity". But the 'value_key' of all data items should keep the same.
        For 'value_key', specify the exact context of the value being compared, e.g., "the GDP growth rate" instead of just "value". But the 'category_key' of all data items should keep the same.
        The user intends to use a bar chart to represent the comparison. Please find the most suitable location for placing the bar chart and output the previous word in the recommended location.
        \n{format_instructions}\n{index}\n{type}\n{paragraph}
        `),
    model,
    parser,
  ]);
        // Categorize all data entities and data values  Extract dynamic key-value pairs representing objectives and their corresponding values with detailed content from the text blocks as required.

  const response = await extrcompchain.invoke({
    format_instructions: parser.getFormatInstructions(),
    index: "id:" + textContent.id,
    type: "type:" + textContent.type,
    paragraph: "User:" + textContent.text,
  });
  console.log(response);

  const newResponse = {
    ...response,
    dataspec: response.dataspec.map(({ category_key, category_value, value_key, value_value }) => {
      return {
        [category_key]: category_value,
        [value_key]: value_value
      };
    })
  };

  return newResponse;
};

export default extrComp;