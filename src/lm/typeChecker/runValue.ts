
import {
  StructuredOutputParser,
  RegexParser,
  CombiningOutputParser
} from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI, ChatOpenAICallOptions } from "@langchain/openai";
import { GistFactTypeAnnotation } from "../types";

const runValue = async (
  model: ChatOpenAI<ChatOpenAICallOptions>,
  textContent: string,
) => {
  const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
    id: "unique id of text block",
    text: "original text provided by the user",
  });
  const typeParser = new RegexParser(/Type: (value|)/, ["type"], "noType");
  const parser = new CombiningOutputParser(answerParser, typeParser);

  const valchain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
      You are a professional text preprocessing assistant specializing in text visualization. Please provide a well-structured response to the user's chunk of the text strictly according to the rules,  The user's goal is to generate corresponding charts based on your response. To achieve this, please check if the text provided by the user contains value relationships. If included, type is value; if not included, type is null.\n
      Values are usually numerical values with special meanings that have a significant impact on entities. 

      User: 40 cities and counties also are hiking their minimum wages.
      Assistant: """Type: value"""

      User: 46 horses have won two out of three Triple Crown Races.
      Assistant: """Type: value"""

      User: The little boy was careful enough to come first in the exam.
      Assistant: """Type: null"""

      \n{format_instructions}\n{paragraph}
      `),
    model,
    parser,
  ]);

  const response = await valchain.invoke({
    format_instructions: parser.getFormatInstructions(),
    paragraph: "User:" + textContent,
  });
  // console.dir(response);

  return response as GistFactTypeAnnotation;
};

export default runValue;