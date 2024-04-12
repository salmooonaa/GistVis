import {
  StructuredOutputParser,
  RegexParser,
  CombiningOutputParser
} from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

const extrComp = async (model, textContent) => {
  const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
    id: "unique id of text block",
    text: "original text provided by the user",
    entity1:
      "The subject of comparison with a higher value, usually an entity. If it does not exist, return an empty string",
    entity2:
      "The subject of comparison with a lower value, usually an entity. If it does not exist, return an empty string",
    value1:
      "the higher value in the comparison(already converted into numbers or percentages). If it does not exist or is uncertain, return NAN",
    value2:
      "the lower value in the comparison(already converted into numbers or percentages). If it does not exist or is uncertain, return NAN",
    value3:
      "the delta in the comparison(already converted into numbers). If it does not exist, return NAN",
    pos: "The previous word in the recommended location",
  });
  const typeParser = new RegexParser(/Type: (comparison)/, ["type"], "noType");
  const parser = new CombiningOutputParser(answerParser, typeParser);

  const extrcompchain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
        You are a professional text preprocessing assistant specializing in text visualization. Please provide a well-structured response to the user's chunk of the text strictly according to rules, including the complete original text of the text chunk provided by user.
        You have to extract entities, numerical values, and other content from text blocks as required. 
        This sentence contains comparison. Comparison refers to the act of comparing two data attributes or comparing the target object with previous values, especially along a time series. 
        First, you should extract the object of comparison, usually an entity. Then you should determine whether the entity is the higher or lower numerical value in the comparison based on semantics, as entity1(higher one) or entity2 (lower one). If the corresponding numerical values of the entities in comparison exist and the delta between the two entities is available(delta only represents the difference between two entities), convert extracted them into numbers.
        The user intends to use a bar chart to represent the comparison. Please find the most suitable location for placing the bar chart and output the previous word in the recommended location.
        \n{format_instructions}\n{index}\n{type}\n{paragraph}
        `),
    model,
    parser,
  ]);

  const response = await extrcompchain.invoke({
    format_instructions: parser.getFormatInstructions(),
    index: "id:" + textContent.id,
    type: "type:" + textContent.type,
    paragraph: "User:" + textContent.text,
  });
  // console.dir(response);

  return response;
};

export default extrComp;