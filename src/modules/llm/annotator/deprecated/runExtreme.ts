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
const runExtreme = async (
  model: ChatOpenAI<ChatOpenAICallOptions>,
  textContent: string,
) => {
  const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
    id: "unique id of text block",
    text: "original text provided by the user",
  });
  const typeParser = new RegexParser(/Type: (extreme|)/, ["type"], "noType");
  const parser = new CombiningOutputParser(answerParser, typeParser);

  const extrchain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
      ${SystemInstruction}
      To achieve this, please check if the text provided by the user contains extreme relationships. If included, the type is extreme; if not included, type is null.\n
      Extreme refers to the extreme data cases along with the data attributes or within a certain range, usually maximum and minimum. Notice that anomalies are individual data points and do not include trends such as "increase". 

      User: The character with the most epigrams in the collected dataset is Oscar Wilde himself, who has 12.
      Assistant: """Type: extreme"""

      User: The minimum wage is just $7.25.
      Assistant: """Type: extreme"""

      User: The little boy was careful enough to come first in the exam.
      Assistant: """Type: null"""

      \n{format_instructions}\n{paragraph}
      `),
    model,
    parser,
  ]);

  const response = await extrchain.invoke({
    format_instructions: parser.getFormatInstructions(),
    paragraph: "User:" + textContent,
  });
  // console.dir(response);

  return response as GistFactTypeAnnotation;
};

export default runExtreme;