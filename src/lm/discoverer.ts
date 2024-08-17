import {
  StructuredOutputParser,
  RegexParser,
  CombiningOutputParser,
  CustomListOutputParser,
} from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI, ChatOpenAICallOptions } from "@langchain/openai";

const splitInsight = async (model: ChatOpenAI<ChatOpenAICallOptions>, textContent: string) => {
  // const parser = new XMLOutputParser();
  const parser = new CustomListOutputParser({ separator: "<section>" });
  // const parser = new CommaSeparatedListOutputParser();
  // const parser = StructuredOutputParser.fromNamesAndDescriptions({
  //     text: "sections of original text provided by the user",
  // });
  const divchain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
        Please separate the user-provided paragraphs into sections that group similar data and content, aiming for the shortest feasible lengths. Each section should limit its visual elements to a single type: comparisons, trends, rankings, proportions, association, anomalies, extremes or values. The objective is for the user to generate corresponding charts based on your output.

        The sections in your response should contain complete original text provided by user without any modification. Preserve original punctuation marks and line breaks.

        Please enclose the sections in <seciton></section> tags.

        \n{paragraph}`),
    model,
    parser,
  ]);

  // console.log(parser.getFormatInstructions());

  const response = await divchain.invoke({
    paragraph: "User:" + textContent,
  });
  // console.dir(response);
  const updatedResponse1 = response.filter(
    (paragraph) => paragraph.trim() !== ""
  );
  const updatedResponse = updatedResponse1.map((paragraph) =>
    paragraph.replace("</section>", "")
  );
  // const updatedResponse = response.map(paragraph => paragraph.replace("original_text:", ""));
  return updatedResponse;
  // return response
};

export default splitInsight;