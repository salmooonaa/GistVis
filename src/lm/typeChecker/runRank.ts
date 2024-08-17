import {
  StructuredOutputParser,
  RegexParser,
  CombiningOutputParser
} from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI, ChatOpenAICallOptions } from "@langchain/openai";
import { GistFactTypeAnnotation } from "../types";
const runRank = async (
  model: ChatOpenAI<ChatOpenAICallOptions>,
  textContent: string,
) => {
  const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
    id: "unique id of text block",
    text: "original text provided by the user",
  });
  const typeParser = new RegexParser(/Type: (rank|)/, ["type"], "noType");
  const parser = new CombiningOutputParser(answerParser, typeParser);

  const rankchain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
      You are a professional text preprocessing assistant specializing in text visualization. Please provide a well-structured response to the user's chunk of the text strictly according to the rules,  The user's goal is to generate corresponding charts based on your response. To achieve this, please check if the text provided by the user contains rank relationships. If included, the type is rank; if not included, the type is null.\n
      Rank refers to sorting the data attributes based on their values and showing the position of selected data attributes. Rank usually includes entities and their corresponding sorting, which can be numbers such as 1 and NO.2, as well as letters and words such as "great" and "A level".

      User: The little boy was careful enough to come first in the exam.
      Assistant: """Type: rank"""

      User: The top reason for consumers to engage in showrooming is (the) price (is) better online.
      Assistant: """Type: rank"""

      User: China's population decreased by 2.08 million people in 2023 to 1.40967 billion.
      Assistant: """Type: null"""

      \n{format_instructions}\n{paragraph}
      `),
    model,
    parser,
  ]);

  const response = await rankchain.invoke({
    format_instructions: parser.getFormatInstructions(),
    paragraph: "User:" + textContent,
  });
  // console.dir(response);

  return response as GistFactTypeAnnotation;
};

export default runRank;