import {
  StructuredOutputParser,
  RegexParser,
  CombiningOutputParser
} from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI, ChatOpenAICallOptions } from "@langchain/openai";
import { GistFactTypeAnnotation } from "../types";
const runComparison = async (
  model: ChatOpenAI<ChatOpenAICallOptions>,
  textContent: string,
) => {
  const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
    id: "unique id of text block",
    text: "original text provided by the user",
  });
  const typeParser = new RegexParser(/Type: (comparison|)/, ["type"], "noType");
  const parser = new CombiningOutputParser(answerParser, typeParser);

  const compchain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
        As a professional text preprocessing assistant specializing in text visualization, your task is to provide a well-structured response to the user's text chunk, strictly adhering to certain rules. The user aims to generate corresponding charts based on your response. To accomplish this, you need to check if the user's text contains any comparative relationships. If included, the type is a comparison; if not included, the type is null.
        Comparison refers to the act of comparing two data attributes or comparing the target object with previous values, especially along a time series. Typically, comparisons involve two or more entities or values that exhibit significant differences. Comparative relationships are often expressed in phrases containing multiple entities or values that highlight notable disparities. 

        User: China on Wednesday posted a robust GDP growth of 5.2 percent for 2023, successfully beating the government's pre-set yearly target of around 5 percent.
        Assistant: """Type: comparison"""

        User: There are more blocked beds in the Royal London Hospital compared with the UK average.
        Assistant: """Type: comparison"""

        User: The little boy was careful enough to come first in the exam.
        Assistant: """Type: null"""

        \n{format_instructions}\n{paragraph}
        `),
    model,
    parser,
  ]);

  const response = await compchain.invoke({
    paragraph: "User:" + textContent,
    format_instructions: parser.getFormatInstructions(),
  });
  // console.log(response);
  // console.log(response.type);

  return response as GistFactTypeAnnotation;
};

export default runComparison;