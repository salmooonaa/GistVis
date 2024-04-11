import {
  StructuredOutputParser,
  ResponseSchema,
  RegexParser,
  CombiningOutputParser,
  CommaSeparatedListOutputParser,
  CustomListOutputParser,
} from "langchain/output_parsers";
import { PromptTemplate } from "langchain/prompts";
import { RunnableSequence } from "langchain/schema/runnable";
import { OpenAI } from "langchain/llms/openai";
// import getToken from "./generateToken";
import { API_KEY } from "../api_key.js";
import { ChatZhipuAI } from "@langchain/community/chat_models/zhipuai";
import { HumanMessage } from "@langchain/core/messages";
import React, { useEffect, useRef, useState } from "react";
import { type } from "@testing-library/user-event/dist/type";
import { z } from "zod";

const rundiv = async (model, textContent) => {
  // const parser = new XMLOutputParser();
  const parser = new CustomListOutputParser({ separator: "<section>" });
  // const parser = new CommaSeparatedListOutputParser();
  // const parser = StructuredOutputParser.fromNamesAndDescriptions({
  //     text: "sections of original text provided by the user",
  // });
  const divchain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
        Please separate the user-provided paragraphs into sections that group similar data and content, aiming for the shortest feasible lengths. Each section should limit its visual elements to a single type: comparisons, trends, rankings, proportions, association, anomalies, extremes or values. The objective is for the user to generate corresponding charts based on your output.
        Preserve the original text provided by the user, unaltered, including all punctuation marks, within each section of your response.
        Your response should be a list of sections separated by "<section>"
        \n{paragraph}`),
    model,
    parser,
  ]);

  console.log(parser.getFormatInstructions());

  const response = await divchain.invoke({
    paragraph: "User:" + textContent,
  });
  console.dir(response);
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

const runComparison = async (model, textContent, index) => {
  const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
    id: "unique id of text block",
    text: "original text provided by the user",
  });
  const typeParser = new RegexParser(/Type: (comparison|)/, ["type"], "noType");
  const parser = new CombiningOutputParser(answerParser, typeParser);

  const compchain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
        As a professional text preprocessing assistant specializing in text visualization, your task is to provide a well-structured response to the user's text chunk, strictly adhering to certain rules. The user aims to generate corresponding charts based on your response. To accomplish this, you need to check if the user's text contains any comparative relationships. If included, type is comparison; if not included, type is null.\n
        Comparison refers to the act of comparing two data attributes or comparing the target object with previous values, especially along a time series. Typically, comparisons involve two or more entities or values that exhibit significant differences. Comparative relationships are often expressed in phrases containing multiple entities or values that highlight notable disparities. (eg1: "China on Wednesday posted a robust GDP growth of 5.2 percent for 2023, successfully beating the government's pre-set yearly target of around 5 percent."; eg2:"There are more blocked beds in the Royal London Hospital compared with the UK average")
        \n{format_instructions}\n{index}\n{paragraph}
        `),
    model,
    parser,
  ]);

  const response = await compchain.invoke({
    index: "id:" + index,
    paragraph: "User:" + textContent,
    format_instructions: parser.getFormatInstructions(),
  });
  console.log(response);
  console.log(response.type);

  return response;
};

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
        please check if the text provided by the user contains trend relationships. If included, type is comparison; if not included, type is null.\n
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
  console.dir(response);

  return response;
};

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
  console.dir(response);

  return response;
};

const runRank = async (model, textContent, index) => {
  const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
    id: "unique id of text block",
    text: "original text provided by the user",
  });
  const typeParser = new RegexParser(/Type: (rank|)/, ["type"], "noType");
  const parser = new CombiningOutputParser(answerParser, typeParser);

  const rankchain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
        You are a professional text preprocessing assistant specializing in text visualization. Please provide a well-structured response to the user's chunk of the text strictly according to rules,  The user's goal is to generate corresponding charts based on your response. To achieve this, please check if the text provided by the user contains rank relationships. If included, type is comparison; if not included, type is null.\n
        Rank refers to sort the data attributes based on their values and show the position of selected data attributes. Rank usually includes entities and their corresponding sorting, which can be numbers such as 1 and NO.2, as well as letters and words such as "great" and "A level". (eg1: "The little boy was careful enough to come first in the exam."; eg2:"The top reason for consumers to engage in showrooming is (the) price (is) better online")
        \n{format_instructions}\n{index}\n{paragraph}
        `),
    model,
    parser,
  ]);

  const response = await rankchain.invoke({
    format_instructions: parser.getFormatInstructions(),
    index: "id:" + index,
    paragraph: "User:" + textContent,
  });
  console.dir(response);

  return response;
};

const runProp = async (model, textContent, index) => {
  const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
    id: "unique id of text block",
    text: "original text provided by the user",
  });
  const typeParser = new RegexParser(/Type: (proportion|)/, ["type"], "noType");
  const parser = new CombiningOutputParser(answerParser, typeParser);

  const propchain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
        You are a professional text preprocessing assistant specializing in text visualization. Please provide a well-structured response to the user's 
        chunk of the text strictly according to rules,  The user's goal is to generate corresponding charts based on your response. To achieve this, 
        please check if the text provided by the user contains proportion relationships. If included, type is comparison; if not included, type is null.\n
        Proportion refers to measure the proportion of selected data attribute(s) within a specified set. Proportions are usually a ratio or a fraction of 
        one component compared to the whole, usually with phrases nearby that indicate proportion, such as "acount for".(eg1: "Traffic is one of the 
        biggest sources of carbon pollution in the country and accounts for 28% of the nation's greenhouse gas emissions"; eg2:"Protein takes 66% in the 
        diet on Sunday")
        \n{format_instructions}\n{index}\n{paragraph}
        `),
    model,
    parser,
  ]);

  const response = await propchain.invoke({
    format_instructions: parser.getFormatInstructions(),
    index: "id:" + index,
    paragraph: "User:" + textContent,
  });
  console.dir(response);

  return response;
};

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
  console.dir(response);

  return response;
};

const runAnomaly = async (model, textContent, index) => {
  const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
    id: "unique id of text block",
    text: "original text provided by the user",
  });
  const typeParser = new RegexParser(/Type: (anomaly|)/, ["type"], "noType");
  const parser = new CombiningOutputParser(answerParser, typeParser);

  const anochain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
        You are a professional text preprocessing assistant specializing in text visualization. Please provide a well-structured response to the user's chunk of the text strictly according to rules,  The user's goal is to generate corresponding charts based on your response. To achieve this, please check if the text provided by the user contains anomaly relationships. If included, type is comparison; if not included, type is null.\n
        Anomalies are usually data points that are significantly different from expected patterns, deviating from a general trend of growth or decline.(eg1: "Rocky Raccoon has the most unique words given the other songs from the Beatles" , eg2:"the recorded voltage suddenly spiked to 1000 volts, far exceeding the anticipated range")
        \n{format_instructions}\n{index}\n{paragraph}
        `),
    model,
    parser,
  ]);

  const response = await anochain.invoke({
    format_instructions: parser.getFormatInstructions(),
    index: "id:" + index,
    paragraph: "User:" + textContent,
  });
  console.dir(response);

  return response;
};

const runValue = async (model, textContent, index) => {
  const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
    id: "unique id of text block",
    text: "original text provided by the user",
  });
  const typeParser = new RegexParser(/Type: (value|)/, ["type"], "noType");
  const parser = new CombiningOutputParser(answerParser, typeParser);

  const valchain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
        You are a professional text preprocessing assistant specializing in text visualization. Please provide a well-structured response to the user's chunk of the text strictly according to rules,  The user's goal is to generate corresponding charts based on your response. To achieve this, please check if the text provided by the user contains value relationships. If included, type is comparison; if not included, type is null.\n
        Values are usually a numerical value with special meaning that have a significant impact on entities. (eg1:"40 cities and counties also are hiking their minimum wages"; eg2:"46 horses have won two out of tree Triple Crown Races")
        \n{format_instructions}\n{index}\n{paragraph}
        `),
    model,
    parser,
  ]);

  const response = await valchain.invoke({
    format_instructions: parser.getFormatInstructions(),
    index: "id:" + index,
    paragraph: "User:" + textContent,
  });
  console.dir(response);

  return response;
};

const runMatch = async (model, textContent) => {
  console.log(textContent);
  const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
    id: "unique id of text block",
    text: "original text provided by the user",
  });
  const typeParser = new RegexParser(
    /Type: (comparison|trend|association|rank|proportion|extreme|anomaly|value)/,
    ["type"],
    "noType"
  );
  const parser = new CombiningOutputParser(answerParser, typeParser);

  const matchain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
        You are a professional text preprocessing assistant specializing in text visualization. Please provide a well-structured response to the user's chunk of the text strictly according to rules. The user's goal is to generate corresponding charts based on your response. 
        The text chunk provided by the user is matched with two or more types, and you need to choose the most suitable type based on the following definitions.
        Comparison refers to the act of comparing two data attributes.
        Trend presents a general tendency over a time segment.
        Association refers to y the useful relationship between two data attributes or among multiple attributes and can be categorized as positive, negative, or neutral sentiment. 
        Rank refers to sort the data attributes based on their values and show the breakdown of selected data attributes. 
        Proportion refers to measure the proportion of selected data attribute(s) within a specified set.
        Extreme refers to the extreme data cases along with the data attributes or within a certain range, such as maximum and minimum. 
        Anomalies are usually data points that are significantly different from expected patterns. 
        Values are usually a numerical value with special meaning that have a significant impact on entities. 
        \n{format_instructions}\n{index}\n{type}\n{paragraph}
        `),
    model,
    parser,
  ]);

  const response = await matchain.invoke({
    format_instructions: parser.getFormatInstructions(),
    index: "id:" + textContent.id,
    type: "type:" + textContent.type,
    paragraph: "User:" + textContent.text,
  });
  console.dir(response);

  return response;
};

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
  console.dir(response);

  return response;
};

const extrTrend = async (model, textContent) => {
  const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
    id: "unique id of text block",
    text: "original text provided by the user",
    entity1: "subject of trend, usually an entity",
    value1:
      "the start data point of the trend(already converted into numbers without units). If it does not exist, return NAN",
    value2:
      "the end data point of the trend(already converted into numbers without units). If it does not exist, return NAN",
    value3: "the delta of the trend. If it does not exist, return NAN",
    pos: "The previous word in the recommended location",
  });
  const typeParser = new RegexParser(
    /Type: (trend), Attribute: (positive|negative|neutral)/,
    ["type", "attribute"],
    "noType"
  );
  const parser = new CombiningOutputParser(answerParser, typeParser);

  const extrtrendchain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
        You are a professional text preprocessing assistant specializing in text visualization. Please provide a well-structured response to the user's chunk of the text strictly according to rules, including the complete original text of the text chunk provided by user.
        You have to extract entities, numerical values, and other content from text blocks as required. 
        This sentence contains trend. Trend presents a general tendency over a time segment. 
        First, you should extract the subject of trend, usually an entity. Then, you should also extract the start and end data points and delta of this trend as value:[start_d=1, delta=1, end_d=2] If none, mark as (start_d=NAN). Finally, indicate whether its attribute(sentiment polarity) is positive or negative or neutral.
        The user intends to use a line chart to represent the trend. Please find the most suitable location for placing the line chart and output the previous word in the recommended location.
        \n{format_instructions}\n{index}\n{type}\n{paragraph}
        `),
    model,
    parser,
  ]);

  const response = await extrtrendchain.invoke({
    format_instructions: parser.getFormatInstructions(),
    index: "id:" + textContent.id,
    type: "type:" + textContent.type,
    paragraph: "User:" + textContent.text,
  });
  console.dir(response);

  return response;
};

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
  console.dir(response);

  return response;
};

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
  console.log(textContent);
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
  console.dir(response);

  return response;
};

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
  console.dir(response);

  return response;
};

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
  console.dir(response);

  return response;
};

const extrAnomaly = async (model, textContent) => {
  const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
    id: "unique id of text block",
    text: "original text provided by the user",
    value1:
      "the anomaly(already converted into numbers). If it does not exist, return NAN",
    pos: "the words containing the value of anomaly",
  });
  const typeParser = new RegexParser(/Type: (anomaly)/, ["type"], "noType");
  const parser = new CombiningOutputParser(answerParser, typeParser);

  const extrAnochain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
        You are a professional text preprocessing assistant specializing in text visualization. Please provide a well-structured response to the user's chunk of the text strictly according to rules, including the complete original text of the text chunk provided by user.
        You have to extract entities, numerical values, and other content from text blocks as required. 
        This sentence contains anomaly. Anomalies are usually data points that are significantly different from expected patterns.
        First, you should extract the value of anomaly. Then you should convert anomaly into numbers.
        The user intends to highlight the anomaly. Please output the position of the anomaly.
        \n{format_instructions}\n{index}\n{type}\n{paragraph}
        `),
    model,
    parser,
  ]);
  const response = await extrAnochain.invoke({
    format_instructions: parser.getFormatInstructions(),
    index: "id:" + textContent.id,
    type: "type:" + textContent.type,
    paragraph: "User:" + textContent.text,
  });
  console.dir(response);

  return response;
};

const extrVal = async (model, textContent) => {
  const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
    id: "unique id of text block",
    text: "original text provided by the user",
    value1:
      "the value(already converted into numbers). If it does not exist, return NAN",
    pos: "the numeric word(value)",
  });
  const typeParser = new RegexParser(/Type: (value)/, ["type"], "noType");
  const parser = new CombiningOutputParser(answerParser, typeParser);

  const extrvalchain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
        You are a professional text preprocessing assistant specializing in text visualization. Please provide a well-structured response to the user's chunk of the text strictly according to rules, including the complete original text of the text chunk provided by user.
        You have to extract entities, numerical values, and other content from text blocks as required. 
        This sentence contains value. Values are usually a numerical value with special meaning that have a significant impact on entities. 
        First, you should extract the value. Then you should convert it into numbers.
        The user intends to highlight the value. Please output the position of the value.
        \n{format_instructions}\n{index}\n{type}\n{paragraph}
        `),
    model,
    parser,
  ]);

  const response = await extrvalchain.invoke({
    format_instructions: parser.getFormatInstructions(),
    index: "id:" + textContent.id,
    type: "type:" + textContent.type,
    paragraph: "User:" + textContent.text,
  });
  console.dir(response);

  return response;
};

const LlmLink = async (input) => {
  const htmlContent = input;
  const selectors = ["p", "h1", "h2", "h3"];
  const textContent = [];
  const regex = new RegExp(`<[^>]+>(.*?)<\/[^>]+>`, "g");
  const matches = htmlContent.match(regex);
  if (matches) {
    matches.forEach((match) => {
      const text1 = match.replace(/<\/?[^>]+>/g, "");
      const text = text1.replace(/&nbsp;/g, "");
      if (text.trim() !== "") {
        textContent.push(text);
      }
    });
  }
  console.log(textContent);

  // const tools = [
  //     new SerpAPI('你的SerpAPI的key', {
  //         location: "Austin,Texas,United States",
  //         hl: "en",
  //         gl: "us",
  //     }),s
  //     new Calculator(),
  // ];

  // const token = getToken();

  const model = new ChatZhipuAI({
    modelName: "glm-3-turbo", // Available models:
    temperature: 0.01,
    zhipuAIApiKey: API_KEY, // In Node.js defaults to process.env.ZHIPUAI_API_KEY
    verbose: true,
  });

  // const model = new OpenAI({
  //     model_name:"glm-3-turbo",
  //     openai_api_base: "https://open.bigmodel.cn/api/paas/v4",
  //     openai_api_key: token,
  //     streaming: false,
  //     temperature: 0.01,
  // });

  const divtextContent = [];
  // const divtextContent = [["Thousands of junior doctors in South Korea are a week into a labor boycott in protest of the government's push to recruit more medical students to cope with the country's fast-aging population"]]
  async function processTextContent() {
    for (const part of textContent) {
      const result = await rundiv(model, part);
      divtextContent.push(result);
    }
    console.log(divtextContent);
  }

  await processTextContent();

  const typetextContent = [];
  for (let i = 0; i < divtextContent.length; i++) {
    for (let j = 0; j < divtextContent[i].length; j++) {
      const id = `p${i}s${j}`;
      const value = divtextContent[i][j];
      const item = { id: id, text: value, type: [] };
      const models = [
        runComparison,
        runTrend,
        runAsso,
        runRank,
        runProp,
        runExtreme,
        runAnomaly,
        runValue,
      ];
      for (const runModel of models) {
        try {
          const current = await runModel(model, value, id);
          console.log(current);
          if (current.type) {
            item.type.push(current.type);
          }
        } catch (error) {
          console.error("An error occurred:", error);
          continue;
        }
      }
      console.log(item.type);
      let newitem;
      if (item.type.length > 1) {
        newitem = await runMatch(model, item);
      } else {
        newitem = {
          ...item,
          type: item.type[0],
        };
      }
      typetextContent.push(newitem);
      setTimeout(() => {
        console.log("Resuming loop after 5 seconds.");
      }, 3000);
    }
  }
  console.log(typetextContent);

  const llmoption = [];
  for (const part of typetextContent) {
    let llmoptio;
    switch (part.type) {
      case "comparison":
        console.log(part);
        llmoptio = await extrComp(model, part);
        llmoption.push(llmoptio);
        break;
      case "trend":
        llmoptio = await extrTrend(model, part);
        llmoption.push(llmoptio);
        break;
      case "association":
        llmoptio = await extrAsso(model, part);
        llmoption.push(llmoptio);
        break;
      case "rank":
        llmoptio = await extrRank(model, part);
        llmoption.push(llmoptio);
        break;
      case "proportion":
        llmoptio = await extrProp(model, part);
        llmoption.push(llmoptio);
        break;
      case "extreme":
        llmoptio = await extrExtreme(model, part);
        llmoption.push(llmoptio);
        break;
      case "anomaly":
        llmoptio = await extrAnomaly(model, part);
        llmoption.push(llmoptio);
        break;
      case "value":
        llmoptio = await extrVal(model, part);
        llmoption.push(llmoptio);
        break;
      default:
        llmoptio = part;
        llmoption.push(llmoptio);
        break;
    }
    setTimeout(() => {
      console.log("Resuming loop after 5 seconds.");
    }, 3000);
  }
  console.log(llmoption);

  return llmoption;
};

export default LlmLink;
