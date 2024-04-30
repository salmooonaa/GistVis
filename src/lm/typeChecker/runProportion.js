import {
  StructuredOutputParser,
  RegexParser,
  CombiningOutputParser
} from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

const runProp = async (model, textContent, index) => {
  const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
    id: "unique id of text block",
    text: "original text provided by the user",
  });
  const typeParser = new RegexParser(/Type: (proportion|)/, ["type"], "noType");
  const parser = new CombiningOutputParser(answerParser, typeParser);

  const propchain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
      You are a professional text preprocessing assistant specializing in text visualization. Please provide a well-structured response to the user's chunk of the text strictly according to the rules,  The user's goal is to generate corresponding charts based on your response. To achieve this, please check if the text provided by the user contains proportion relationships. If included, the type is proportion; if not included, the type is null.
      Proportion refers to measuring the proportion of selected data attribute(s) within a specified set. Proportions are usually a ratio or a fraction of one component compared to the whole, usually with phrases nearby that indicate proportion, such as "account for".
      
      User: Traffic is one of the biggest sources of carbon pollution in the country and accounts for 28% of the nation's greenhouse gas emissions.
      Assistant: """Type: proportion"""

      User: Protein takes 66% of the diet on Sunday.
      Assistant: """Type: proportion"""

      User: The little boy was careful enough to come first in the exam.
      Assistant: """Type: null"""
      
      \n{format_instructions}\n{index}\n{paragraph}
      `),
    model,
    parser,
  ]);

  const response = await propchain.invoke({
    format_instructions: parser.getFormatInstructions(),
    index: "id:" + index,
    paragraph: "User:" + textContent,
  });
  // console.dir(response);

  return response;
};

export default runProp;