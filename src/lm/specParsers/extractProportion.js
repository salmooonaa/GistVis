import {
  StructuredOutputParser,
  RegexParser,
  CombiningOutputParser
} from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

const extrProp = async (model, textContent) => {
  const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
    id: "unique id of text block",
    text: "original text provided by the user",
    value1:
      "the value of proportion(already converted into decimals). If it does not exist, return NAN",
    pos: "The previous word in the recommended location",
  });
  const typeParser = new RegexParser(/Type: (proportion)/, ["type"], "noType");
  const parser = new CombiningOutputParser(answerParser, typeParser);

  const extrpropchain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
        You are a professional text preprocessing assistant specializing in text visualization. Please provide a well-structured response to the user's chunk of the text strictly according to rules, including the complete original text of the text chunk provided by user.
        You have to extract entities, numerical values, and other content from text blocks as required. 
        This sentence contains proportion. First, you should extract the proportion. Then you should extract the value of proportion and convert percentages and other forms into decimals.
        The user intends to use a pie chart to represent the proportion. Please find the most suitable location for placing the pie chart and output it.
        \n{format_instructions}\n{index}\n{type}\n{paragraph}
        `),
    model,
    parser,
  ]);

  const response = await extrpropchain.invoke({
    format_instructions: parser.getFormatInstructions(),
    index: "id:" + textContent.id,
    type: "type:" + textContent.type,
    paragraph: "User:" + textContent.text,
  });
  // console.dir(response);

  return response;
};

export default extrProp;