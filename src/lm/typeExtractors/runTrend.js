import {
  StructuredOutputParser,
  RegexParser,
  CombiningOutputParser
} from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

const runTrend = async (model, textContent, index) => {
  const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
    id: "unique id of text block",
    text: "original text provided by the user",
  });
  const typeParser = new RegexParser(/Type: (trend|)/, ["type"], "noType");
  const parser = new CombiningOutputParser(answerParser, typeParser);

  const trendchain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
        You are a professional text preprocessing assistant specializing in text visualization. Please provide a well-structured response to the user's 
        chunk of the text strictly according to rules,  The user's goal is to generate corresponding charts based on your response. To achieve this, 
        please check if the text provided by the user contains trend relationships. If included, type is trend; if not included, type is null.\n
        Trend presents a general tendency over a time segment. Temporal changes usually consists of an entity and a phrase with changing semantics such as 
        "increase","decrease" or "rise", sometimes with numerical values. (eg1: "China's population decreased by 2.08 million people in 2023 to 1.40967 
        billion."; eg2:"The budget for the Border Patrol Program has been rising from 1990 to 2013")
        \n{format_instructions}\n{index}\n{paragraph}
        `),
    model,
    parser,
  ]);

  const response = await trendchain.invoke({
    index: "id:" + index,
    paragraph: "User:" + textContent,
    format_instructions: parser.getFormatInstructions(),
  });
  // console.dir(response);

  return response;
};

export default runTrend;
