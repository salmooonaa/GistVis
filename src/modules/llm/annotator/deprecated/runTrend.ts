import {
  StructuredOutputParser,
  RegexParser,
  CombiningOutputParser
} from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI, ChatOpenAICallOptions } from "@langchain/openai";
import { GistFactTypeAnnotation } from "../../types";
import { SystemInstruction } from "../../visKB";

const runTrend = async (
  model: ChatOpenAI<ChatOpenAICallOptions>,
  textContent: string,
) => {
  const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
    id: "unique id of text block",
    text: "original text provided by the user",
  });
  const typeParser = new RegexParser(/Type: (trend|)/, ["type"], "noType");
  const parser = new CombiningOutputParser(answerParser, typeParser);

  const trendchain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
      ${SystemInstruction}
      To achieve this, please check if the text provided by the user contains trend relationships. If included, the type is a trend; if not included, the type is null.
      Trend presents a general tendency over a time segment. Temporal changes usually consist of an entity and a phrase with changing semantics such as "increase", "decrease" or "rise", sometimes with numerical values.

      User: China's population decreased by 2.08 million people in 2023 to 1.40967 billion.
      Assistant: """Type: trend"""

      User: The budget for the Border Patrol Program has been rising from 1990 to 2013.
      Assistant: """Type: trend"""

      User: The little boy was careful enough to come first in the exam.
      Assistant: """Type: null"""

      \n{format_instructions}\n{paragraph}
      `),
    model,
    parser,
  ]);

  const response = await trendchain.invoke({
    paragraph: "User:" + textContent,
    format_instructions: parser.getFormatInstructions(),
  });
  // console.dir(response);

  return response as GistFactTypeAnnotation;
};

export default runTrend;
