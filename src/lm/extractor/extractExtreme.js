import {
  StructuredOutputParser,
  RegexParser,
  CombiningOutputParser
} from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";

const extrExtreme = async (model, textContent) => {
  // const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
  //   id: "unique id of text block",
  //   text: "original text provided by the user",
  //   value1:
  //     "the extreme(already converted into numbers). If it does not exist, return NAN",
  //   pos: "the words containing the value of extreme",
  // });
  // const specParser = StructuredOutputParser.fromZodSchema(z.object({
  //   id: z.string().describe("unique id of text block"),
  //   context: z.string().describe("original text provided by the user"),
  //   spec: z.object({
  //     value1: z.string().describe("the extreme(already converted into numbers). If it does not exist, return NAN"),
  //     pos: z.string().describe("the words containing the value of extreme"),
  //   }),
  // }));
  const specParser = StructuredOutputParser.fromZodSchema(z.object({
    id: z.string().describe("unique id of text block"),
    context: z.string().describe("original text provided by the user"),
    pos: z.string().describe("The words containing the value of extreme"),

    dataspec: z.array(z.object({
      category_key: z.string().describe("The category of the entity of the data item according to the context. If it does not exist, return an empty string"),
      category_value: z.string().describe("The entity of the data item. If it does not exist, return an empty string"),
      value_key: z.string().describe("The definition of the value of the data item according to the context. If it does not exist or is uncertain, return an empty string"),
      value_value: z.number().describe("The extreme(already converted into numbers).  If it does not exist or is uncertain, return NAN"),
    })),
  }));
  const typeParser = new RegexParser(
    /Type: (extreme),attribute: (maximum|minimum)/,
    ["type","attribute"],
    "noType"
  );
  const parser = new CombiningOutputParser(specParser, typeParser);

  const extrextrechain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
        You are a professional text preprocessing assistant specializing in text visualization. Please provide a well-structured response to the user's chunk of the text strictly according to rules, including the complete original text of the text chunk provided by user.
        You have to extract entities, numerical values, and other content from text blocks as required. 
        This sentence contains extreme. Extreme refers to the extreme data cases along with the data attributes or within a certain range, such as maximum and minimum. 
        First, you should extract the value of extreme. Then you should convert it into numbers. Finally, you need to indicate whether this extreme is the maximum or minimum value.
        Specifically, for 'category_key', identify the subject of comparison with its context, e.g., "the category of GDP growth" instead of just "entity". But the 'value_key' of all data items should keep the same.
        For 'value_key', specify the exact context of the value being compared, e.g., "the GDP growth rate" instead of just "value". But the 'category_key' of all data items should keep the same.
        The user intends to highlight the value of extreme. Please output the position of the extreme.
        \n{format_instructions}\n{index}\n{type}\n{paragraph}
        `),
    model,
    parser,
  ]);

  const response = await extrextrechain.invoke({
    format_instructions: parser.getFormatInstructions(),
    index: "id:" + textContent.id,
    type: "type:" + textContent.type,
    paragraph: "User:" + textContent.text,
  });
  // console.dir(response);
  
  const newResponse = {
    ...response,
    dataspec: response.dataspec.map(({ category_key, category_value, value_key, value_value }) => {
      return {
        [category_key]: category_value,
        [value_key]: value_value
      };
    })
  };
  console.log(newResponse)
  return newResponse;
};

export default extrExtreme;