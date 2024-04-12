import {
  StructuredOutputParser,
  RegexParser,
  CombiningOutputParser
} from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

const extrExtreme = async (model, textContent) => {
  const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
    id: "unique id of text block",
    text: "original text provided by the user",
    value1:
      "the extreme(already converted into numbers). If it does not exist, return NAN",
    pos: "the words containing the value of extreme",
  });
  const typeParser = new RegexParser(
    /Type: (extreme), Attribute: (maximum|minimum)/,
    ["type", "attribute"],
    "noType"
  );
  const parser = new CombiningOutputParser(answerParser, typeParser);

  const extrextrechain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
        You are a professional text preprocessing assistant specializing in text visualization. Please provide a well-structured response to the user's chunk of the text strictly according to rules, including the complete original text of the text chunk provided by user.
        You have to extract entities, numerical values, and other content from text blocks as required. 
        This sentence contains extreme. Extreme refers to the extreme data cases along with the data attributes or within a certain range, such as maximum and minimum. 
        First, you should extract the value of extreme. Then you should convert it into numbers. Finally, you need to indicate whether this extreme is the maximum or minimum value.
        The user intends to highlight the value of extreme. Please output the position of the extreme.
        \n{format_instructions}\n{index}\n{type}\n{paragraph}
        `),
    model,
    parser,
  ]);

  const response = await extrextrechain.invoke({
    format_instructions: parser.getFormatInstructions(),
    index: "id:" + textContent.id,
    type: "type:" + textContent.type,
    paragraph: "User:" + textContent.text,
  });
  // console.dir(response);

  return response;
};

export default extrExtreme;