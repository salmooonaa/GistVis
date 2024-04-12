import {
  StructuredOutputParser,
  RegexParser,
  CombiningOutputParser
} from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

const extrTrend = async (model, textContent) => {
  const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
    id: "unique id of text block",
    text: "original text provided by the user",
    entity1: "subject of trend, usually an entity",
    value1:
      "the start data point of the trend(already converted into numbers without units). If it does not exist, return NAN",
    value2:
      "the end data point of the trend(already converted into numbers without units). If it does not exist, return NAN",
    value3: "the delta of the trend. If it does not exist, return NAN",
    pos: "The previous word in the recommended location",
  });
  const typeParser = new RegexParser(
    /Type: (trend), Attribute: (positive|negative|neutral)/,
    ["type", "attribute"],
    "noType"
  );
  const parser = new CombiningOutputParser(answerParser, typeParser);

  const extrtrendchain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
        You are a professional text preprocessing assistant specializing in text visualization. Please provide a well-structured response to the user's chunk of the text strictly according to rules, including the complete original text of the text chunk provided by user.
        You have to extract entities, numerical values, and other content from text blocks as required. 
        This sentence contains trend. Trend presents a general tendency over a time segment. 
        First, you should extract the subject of trend, usually an entity. Then, you should also extract the start and end data points and delta of this trend as value:[start_d=1, delta=1, end_d=2] If none, mark as (start_d=NAN). Finally, indicate whether its attribute(sentiment polarity) is positive or negative or neutral.
        The user intends to use a line chart to represent the trend. Please find the most suitable location for placing the line chart and output the previous word in the recommended location.
        \n{format_instructions}\n{index}\n{type}\n{paragraph}
        `),
    model,
    parser,
  ]);

  const response = await extrtrendchain.invoke({
    format_instructions: parser.getFormatInstructions(),
    index: "id:" + textContent.id,
    type: "type:" + textContent.type,
    paragraph: "User:" + textContent.text,
  });
  // console.dir(response);

  return response;
};

export default extrTrend;