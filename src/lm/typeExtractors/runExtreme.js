import {
  StructuredOutputParser,
  RegexParser,
  CombiningOutputParser
} from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

const runExtreme = async (model, textContent, index) => {
  const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
    id: "unique id of text block",
    text: "original text provided by the user",
  });
  const typeParser = new RegexParser(/Type: (extreme|)/, ["type"], "noType");
  const parser = new CombiningOutputParser(answerParser, typeParser);

  const extrchain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
        You are a professional text preprocessing assistant specializing in text visualization. Please provide a well-structured response to the user's chunk of the text strictly according to rules,  The user's goal is to generate corresponding charts based on your response. To achieve this, please check if the text provided by the user contains extreme relationships. If included, type is comparison; if not included, type is null.\n
        Extreme refers to the extreme data cases along with the data attributes or within a certain range, usually maximum and minimum. Notice that anomalies are individual data points and do not include trends such as "increase". (eg1:"The character with the most epigrams in the collected dataset is Oscar Wilde himself, who has 12", eg2:"where the minimum wage is just $7.25")
        \n{format_instructions}\n{index}\n{paragraph}
        `),
    model,
    parser,
  ]);

  const response = await extrchain.invoke({
    format_instructions: parser.getFormatInstructions(),
    index: "id:" + index,
    paragraph: "User:" + textContent,
  });
  // console.dir(response);

  return response;
};

export default runExtreme;