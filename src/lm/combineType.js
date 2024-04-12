import {
  StructuredOutputParser,
  RegexParser,
  CombiningOutputParser,
  CustomListOutputParser,
} from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

const runMatch = async (model, textContent) => {
  // console.log(textContent);
  const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
    id: "unique id of text block",
    text: "original text provided by the user",
  });
  const typeParser = new RegexParser(
    /Type: (comparison|trend|association|rank|proportion|extreme|anomaly|value)/,
    ["type"],
    "noType"
  );
  const parser = new CombiningOutputParser(answerParser, typeParser);

  const matchain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
        You are a professional text preprocessing assistant specializing in text visualization. Please provide a well-structured response to the user's chunk of the text strictly according to rules. The user's goal is to generate corresponding charts based on your response. 
        The text chunk provided by the user is matched with two or more types, and you need to choose the most suitable type based on the following definitions.
        Comparison refers to the act of comparing two data attributes.
        Trend presents a general tendency over a time segment.
        Association refers to y the useful relationship between two data attributes or among multiple attributes and can be categorized as positive, negative, or neutral sentiment. 
        Rank refers to sort the data attributes based on their values and show the breakdown of selected data attributes. 
        Proportion refers to measure the proportion of selected data attribute(s) within a specified set.
        Extreme refers to the extreme data cases along with the data attributes or within a certain range, such as maximum and minimum. 
        Anomalies are usually data points that are significantly different from expected patterns. 
        Values are usually a numerical value with special meaning that have a significant impact on entities. 
        \n{format_instructions}\n{index}\n{type}\n{paragraph}
        `),
    model,
    parser,
  ]);

  const response = await matchain.invoke({
    format_instructions: parser.getFormatInstructions(),
    index: "id:" + textContent.id,
    type: "type:" + textContent.type,
    paragraph: "User:" + textContent.text,
  });
  // console.dir(response);

  return response;
};

export default runMatch;
