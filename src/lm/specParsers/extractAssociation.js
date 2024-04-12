import {
  StructuredOutputParser,
  RegexParser,
  CombiningOutputParser
} from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

const extrAsso = async (model, textContent) => {
  const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
    id: "unique id of text block",
    text: "original text provided by the user",
    entity1: "subject of association, usually an entity",
    entity2: "subject of association, usually an entity",
    pos: "the phrase containing the association",
  });
  const typeParser = new RegexParser(
    /Type: (association), Attribute: (positive|negative)/,
    ["type", "attribute"],
    "noType"
  );
  const parser = new CombiningOutputParser(answerParser, typeParser);

  const extrAssochain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
        You are a professional text preprocessing assistant specializing in text visualization. Please provide a well-structured response to the user's chunk of the text strictly according to rules, including the complete original text of the text chunk provided by user.
        You have to extract entities, numerical values, and other content from text blocks as required. 
        This sentence contains association. Association refers to the useful relationship between two data attributes or among multiple attributes and can be categorized as positive, negative, or neutral sentiment. 
        First, you should extract the subject of association, usually an entity. Then indicate whether its attribute(sentiment polarity) is positive or negative.
        The user intends to highlight the entity. Please output the position of the entity.
        \n{format_instructions}\n{index}\n{type}\n{paragraph}
        `),
    model,
    parser,
  ]);

  const response = await extrAssochain.invoke({
    format_instructions: parser.getFormatInstructions(),
    index: "id:" + textContent.id,
    type: "type:" + textContent.type,
    paragraph: "User:" + textContent.text,
  });
  // console.dir(response);

  return response;
};

export default extrAsso;