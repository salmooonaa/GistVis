import {
  StructuredOutputParser,
  RegexParser,
  CombiningOutputParser
} from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

const runAsso = async (model, textContent, index) => {
  const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
    id: "unique id of text block",
    text: "original text provided by the user",
  });
  const typeParser = new RegexParser(
    /Type: (association|)/,
    ["type"],
    "noType"
  );
  const parser = new CombiningOutputParser(answerParser, typeParser);

  const assochain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
        You are a professional text preprocessing assistant specializing in text visualization. Please provide a well-structured response to the user's 
        chunk of the text strictly according to rules,  The user's goal is to generate corresponding charts based on your response. To achieve this, please 
        check if the text provided by the user contains association relationships. If included, type is comparison; if not included, type is null.\n
        Association refers to y the useful relationship between two data attributes or among multiple attributes and can be categorized as positive, 
        negative, or neutral sentiment. Association are usually phrases with positive and negative semantics such as "smooth" or "hard".(eg1: "But the EV 
        market has nevertheless become a major disappointment."; eg2:"There is a negative correlation between the number of quality food and the distance 
        between the vendor city and the eastern market")
        \n{format_instructions}\n{index}\n{paragraph}
        `),
    model,
    parser,
  ]);

  const response = await assochain.invoke({
    format_instructions: parser.getFormatInstructions(),
    index: "id:" + index,
    paragraph: "User:" + textContent,
  });
  // console.dir(response);

  return response;
};

export default runAsso;