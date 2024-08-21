import {
  StructuredOutputParser,
  RegexParser,
  CombiningOutputParser,
} from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import TransformData from "../transSpec";
import { z } from "zod";

const extrTrend = async (model, textContent) => {
  // const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
  //   id: "unique id of text block",
  //   text: "original text provided by the user",
  //   entity1: "subject of trend, usually an entity",
  //   value1:
  //     "the start data point of the trend(already converted into numbers without units). If it does not exist, return NAN",
  //   value2:
  //     "the end data point of the trend(already converted into numbers without units). If it does not exist, return NAN",
  //   value3: "the delta of the trend. If it does not exist, return NAN",
  //   pos: "The previous word in the recommended location",
  // });
  const specParser = StructuredOutputParser.fromZodSchema(
    z.object({
      id: z.string().describe("unique id of text block"),
      context: z.string().describe("original text provided by the user"),
      dataSpec: z.array(
        z.object({
          categoryKey: z
            .string()
            .describe(
              "The category of the entity of the data item according to the context. If it does not exist, return an empty string"
            ),
          categoryValue: z
            .string()
            .describe(
              "The entity of the data item. Try to use phrases from the original text. If it does not exist, return an empty string"
            ),
          valueKey: z
            .string()
            .describe(
              "The definition of the value of the data item according to the context. If it does not exist or is uncertain, return an empty string"
            ),
          valueValue: z
            .union([z.number(), z.string()])
            .transform((value) => {
              if (typeof value === "string" && value.toUpperCase() === "NAN") {
                return NaN;
              }
              return parseFloat(value);
            })
            .describe(
              "The value of data point of the trend(already converted into numbers without units).  If it does not exist or is uncertain, return NAN"
            ),
        })
      ),
    })
  );
  // const specParser = StructuredOutputParser.fromZodSchema(z.object({
  //   id: z.string().describe("unique id of text block"),
  //   context: z.string().describe("original text provided by the user"),
  //   spec: z.object({
  //     entity1: z.string().describe("subject of trend, usually an entity"),
  //     value1: z.string().describe("the start data point of the trend(already converted into numbers without units). If it does not exist, return NAN"),
  //     value2: z.string().describe("the end data point of the trend(already converted into numbers without units). If it does not exist, return NAN"),
  //     value3: z.string().describe("the delta of the trend. If it does not exist, return NAN"),
  //     pos: z.string().describe("The previous word in the recommended location"),
  //     attribute: z.string().describe("positive|negative"),
  //   }),
  // }));
  const typeParser = new RegexParser(
    /insightType: (trend), attribute: (positive|negative)/,
    ["insightType", "attribute"],
    "noType"
  );
  const parser = new CombiningOutputParser(specParser, typeParser);

  const extrtrendchain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
        You are a professional text preprocessing assistant specializing in text visualization. Please provide a well-structured response to the user's chunk of the text strictly according to rules, including the complete original text of the text chunk provided by user.
        You have to extract entities, numerical values, and other content from text blocks as required. 
        This sentence contains trend. Trend presents a general tendency over a time segment. 
        First, you should extract the subject of trend, usually an entity. Then, you should also extract data points of this trend. If none, mark as NAN. Finally, indicate whether its attribute(sentiment polarity) is positive or negative or neutral.
        Specifically, for 'category_key', identify the subject of comparison with its context, e.g., "the category of GDP growth" instead of just "entity". But the 'value_key' of all data items should keep the same.
        For 'value_key', specify the exact context of the value being compared, e.g., "the GDP growth rate" instead of just "value". But the 'category_key' of all data items should keep the same.
        First, you should extract the subject of trend, usually an entity. Then, you should also extract data points of this trend. If none, mark as NAN. Finally, indicate whether its attribute(sentiment polarity) is positive or negative or neutral.
        Specifically, for 'category_key', identify the subject of comparison with its context, e.g., "the category of GDP growth" instead of just "entity". But the 'value_key' of all data items should keep the same.
        For 'value_key', specify the exact context of the value being compared, e.g., "the GDP growth rate" instead of just "value". But the 'category_key' of all data items should keep the same.
        The user intends to use a line chart to represent the trend. Please find the most suitable location for placing the line chart and output the previous word in the recommended location.
        \n{format_instructions}\n{index}\n{insightType}\n{paragraph}
        `),
    model,
    parser,
  ]);

  const response = await extrtrendchain.invoke({
    format_instructions: parser.getFormatInstructions(),
    index: "id:" + textContent.id,
    insightType: "insightType:" + textContent.type,
    paragraph: "User:" + textContent.text,
  });
  // console.dir(response);

  const newResponse = TransformData(response);
  // {
  //   ...response,
  //   dataspec: response.dataspec.map(
  //     ({ category_key, category_value, value_key, value_value }) => {
  //       return {
  //         [category_key]: category_value,
  //         [value_key]: value_value,
  //       };
  //     }
  //   ),
  // };
  console.log(newResponse);
  return newResponse;
};

export default extrTrend;
