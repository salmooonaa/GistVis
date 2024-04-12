import {
  StructuredOutputParser,
  RegexParser,
  CombiningOutputParser
} from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

const extrRank = async (model, textContent) => {
  const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
    id: "unique id of text block",
    text: "original text provided by the user",
    entity1: "subject of rank, usually an entity",
    value1:
      "the ranking of the entity(already converted into numbers). If it does not exist, return NAN",
    pos: "The previous word in the recommended location",
  });
  const typeParser = new RegexParser(/Type: (rank)/, ["type"], "noType");
  const parser = new CombiningOutputParser(answerParser, typeParser);
  // console.log(textContent);
  const extrrankchain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
        You are a professional text preprocessing assistant specializing in text visualization. Please provide a well-structured response to the user's chunk of the text strictly according to rules, including the complete original text of the text chunk provided by user.
        You have to extract entities, numerical values, and other content from text blocks as required. 
        This sentence contains rank. Rank refers to sort the data attributes based on their values and show the position of selected data attributes. 
        First, you should extract the subject of rank, usually an entity. Next, extract rankings of identified entities and convert them into numbers as (value: 1). If the ranking is non-numeric, such as "great", prioritize them based on their qualitative level and convert them into numbers. 
        The user intends to use a bar chart to represent the rank. Please find the most suitable location for placing the bar chart and output the previous word in the recommended location.
        \n{format_instructions}\n{index}\n{type}\n{paragraph}
        `),
    model,
    parser,
  ]);

  const response = await extrrankchain.invoke({
    format_instructions: parser.getFormatInstructions(),
    index: "id:" + textContent.id,
    type: "type:" + textContent.type,
    paragraph: "User:" + textContent.text,
  });
  // console.dir(response);

  return response;
};


export default extrRank;