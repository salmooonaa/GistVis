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
const runProp = async (
  model: ChatOpenAI<ChatOpenAICallOptions>,
  textContent: string,
) => {
  const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
    id: "unique id of text block",
    text: "original text provided by the user",
  });
  const typeParser = new RegexParser(/Type: (proportion|)/, ["type"], "noType");
  const parser = new CombiningOutputParser(answerParser, typeParser);

  const propchain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
      ${SystemInstruction}
      To achieve this, please check if the text provided by the user contains proportion relationships. If included, the type is proportion; if not included, the type is null.
      Proportion refers to measuring the proportion of selected data attribute(s) within a specified set. Proportions are usually a ratio or a fraction of one component compared to the whole, usually with phrases nearby that indicate proportion, such as "account for".
      
      User: Traffic is one of the biggest sources of carbon pollution in the country and accounts for 28% of the nation's greenhouse gas emissions.
      Assistant: """Type: proportion"""

      User: Protein takes 66% of the diet on Sunday.
      Assistant: """Type: proportion"""

      User: The little boy was careful enough to come first in the exam.
      Assistant: """Type: null"""
      
      \n{format_instructions}\n{paragraph}
      `),
    model,
    parser,
  ]);

  const response = await propchain.invoke({
    format_instructions: parser.getFormatInstructions(),
    paragraph: "User:" + textContent,
  });
  // console.dir(response);

  return response as GistFactTypeAnnotation;
};

export default runProp;