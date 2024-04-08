import { StructuredOutputParser, ResponseSchema, RegexParser, CombiningOutputParser, CommaSeparatedListOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "langchain/prompts";
import { RunnableSequence } from "langchain/schema/runnable";
import { OpenAI } from "langchain/llms/openai";
// import getToken from "./generateToken";
import { ChatZhipuAI } from "@langchain/community/chat_models/zhipuai";
import { HumanMessage } from "@langchain/core/messages";
import React, { useEffect, useRef, useState } from "react";

const rundiv = async (model, textContent) => {
    const parser = new CommaSeparatedListOutputParser();
    const divchain = RunnableSequence.from([
        PromptTemplate.fromTemplate( `
        Please divide the paragraphs provided by the user into sections that contain similar data and content, and try to divide them into the smallest 
        possible sections. This section should include at most one of the following visual relationships: comparisons, trends, ranks, promotions, 
        animations, and values. The user\'s goal is to generate corresponding charts based on your response. List these sections.
        \n{format_instructions}\n{paragraph}
        `),
        model,
        parser,
    ]);
    
    const response = await divchain.invoke({
        format_instructions: parser.getFormatInstructions(),
        paragraph: "User:" + textContent,
      });
    console.dir(response)

    return response
}

const runComparison = async (model, textContent, index) => {
    const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
        id: "unique id of text block",
        text: "original text provided by the user",
        });
    const typeParser = new RegexParser(
        /Type: (comparison|)/,
        "type",
        "noType"
        );
    const parser = new CombiningOutputParser(answerParser, typeParser);

    const compchain = RunnableSequence.from([
        PromptTemplate.fromTemplate( `
        As a professional text preprocessing assistant specializing in text visualization, your task is to provide a well-structured response to the user's 
        text chunk, strictly adhering to certain rules. The user aims to generate corresponding charts based on your response. To accomplish this, you 
        need to check if the user's text contains any comparative relationships.\n
        Comparison refers to the act of comparing two data attributes or comparing the target object with previous values, especially along a time series. 
        Typically, comparisons involve two or more entities or values that exhibit significant differences. Comparative relationships are often expressed 
        in phrases containing multiple entities or values that highlight notable disparities. (eg1: "China on Wednesday posted a robust GDP growth of 5.2 
        percent for 2023, successfully beating the government's pre-set yearly target of around 5 percent."; eg2:"There are more blocked beds in the Royal 
        London Hospital compared with the UK average")
        \n{format_instructions}\n{index}\n{paragraph}
        `),
        model,
        parser,
    ]);

    const response = await compchain.invoke({
        format_instructions: parser.getFormatInstructions(),
        index: "id:" + index,
        paragraph: "User:" + textContent,
      });
    console.dir(response)

    return response
}

const runTrend = async (model, textContent, index) => {
    const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
        id: "unique id of text block",
        text: "original text provided by the user",
        });
    const typeParser = new RegexParser(
        /Type: (trend|)/,
        "type",
        "noType"
        );
    const parser = new CombiningOutputParser(answerParser, typeParser);

    const trendchain = RunnableSequence.from([
        PromptTemplate.fromTemplate( `
        You are a professional text preprocessing assistant specializing in text visualization. Please provide a well-structured response to the user's 
        chunk of the text strictly according to rules,  The user's goal is to generate corresponding charts based on your response. To achieve this, 
        please check if the text provided by the user contains trend relationships.\n
        Trend presents a general tendency over a time segment. Temporal changes usually consists of an entity and a phrase with changing semantics such as 
        "increase","decrease" or "rise", sometimes with numerical values. (eg1: "China's population decreased by 2.08 million people in 2023 to 1.40967 
        billion."; eg2:"The budget for the Border Patrol Program has been rising from 1990 to 2013")
        \n{format_instructions}\n{index}\n{paragraph}
        `),
        model,
        parser,
    ]);

    const response = await trendchain.invoke({
        format_instructions: parser.getFormatInstructions(),
        index: "id:" + index,
        paragraph: "User:" + textContent,
      });
    console.dir(response)

    return response
}

const runAsso = async (model, textContent, index) => {
    const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
        id: "unique id of text block",
        text: "original text provided by the user",
        });
    const typeParser = new RegexParser(
        /Type: (association|)/,
        "type",
        "noType"
        );
    const parser = new CombiningOutputParser(answerParser, typeParser);

    const assochain = RunnableSequence.from([
        PromptTemplate.fromTemplate( `
        You are a professional text preprocessing assistant specializing in text visualization. Please provide a well-structured response to the user's 
        chunk of the text strictly according to rules,  The user's goal is to generate corresponding charts based on your response. To achieve this, please 
        check if the text provided by the user contains association relationships.\n
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
    console.dir(response)

    return response
}

const runRank = async (model, textContent, index) => {
    const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
        id: "unique id of text block",
        text: "original text provided by the user",
        });
    const typeParser = new RegexParser(
        /Type: (rank|)/,
        "type",
        "noType"
        );
    const parser = new CombiningOutputParser(answerParser, typeParser);

    const rankchain = RunnableSequence.from([
        PromptTemplate.fromTemplate( `
        You are a professional text preprocessing assistant specializing in text visualization. Please provide a well-structured response to the user's 
        chunk of the text strictly according to rules,  The user's goal is to generate corresponding charts based on your response. To achieve this, 
        please check if the text provided by the user contains rank relationships.\n
        Rank refers to sort the data attributes based on their values and show the breakdown of selected data attributes. Rank usually includes entities 
        and their corresponding sorting, which can be numbers such as 1 and NO.2, as well as letters and words such as "great" and "A level". (eg1: "The 
        little boy was careful enough to come first in the exam."; eg2:"The top reason for consumers to engage in showrooming is (the) price (is) better 
        online")
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
    console.dir(response)

    return response
}

const runProp = async (model, textContent, index) => {
    const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
        id: "unique id of text block",
        text: "original text provided by the user",
        });
    const typeParser = new RegexParser(
        /Type: (proportion|)/,
        "type",
        "noType"
        );
    const parser = new CombiningOutputParser(answerParser, typeParser);

    const propchain = RunnableSequence.from([
        PromptTemplate.fromTemplate( `
        You are a professional text preprocessing assistant specializing in text visualization. Please provide a well-structured response to the user's 
        chunk of the text strictly according to rules,  The user's goal is to generate corresponding charts based on your response. To achieve this, 
        please check if the text provided by the user contains proportion relationships.\n
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
    console.dir(response)

    return response
}

const runExtreme = async (model, textContent, index) => {
    const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
        id: "unique id of text block",
        text: "original text provided by the user",
        });
    const typeParser = new RegexParser(
        /Type: (extreme|)/,
        "type",
        "noType"
        );
    const parser = new CombiningOutputParser(answerParser, typeParser);

    const extrchain = RunnableSequence.from([
        PromptTemplate.fromTemplate( `
        You are a professional text preprocessing assistant specializing in text visualization. Please provide a well-structured response to the user's 
        chunk of the text strictly according to rules,  The user's goal is to generate corresponding charts based on your response. To achieve this, 
        please check if the text provided by the user contains extreme relationships.\n
        Extreme refers to the extreme data cases along with the data attributes or within a certain range, such as maximum and minimum. Notice that 
        anomalies are individual data points and do not include trends such as "increase". (eg1:"The character with the most epigrams in the collected 
        dataset is Oscar Wilde himself, who has 12", eg2:"where the minimum wage is just $7.25")
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
    console.dir(response)

    return response
}

const runAnomaly = async (model, textContent, index) => {
    const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
        id: "unique id of text block",
        text: "original text provided by the user",
        });
    const typeParser = new RegexParser(
        /Type: (anomaly|)/,
        "type",
        "noType"
        );
    const parser = new CombiningOutputParser(answerParser, typeParser);

    const anochain = RunnableSequence.from([
        PromptTemplate.fromTemplate( `
        You are a professional text preprocessing assistant specializing in text visualization. Please provide a well-structured response to the user's 
        chunk of the text strictly according to rules,  The user's goal is to generate corresponding charts based on your response. To achieve this, 
        please check if the text provided by the user contains anomaly relationships.\n
        Anomalies are usually data points that are significantly different from expected patterns. (eg1: "Rocky Raccoon has the most unique words given 
        the other songs from the Beatles" , eg2:"the recorded voltage suddenly spiked to 1000 volts, far exceeding the anticipated range")
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
    console.dir(response)

    return response
}

const runValue = async (model, textContent, index) => {
    const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
        id: "unique id of text block",
        text: "original text provided by the user",
        });
    const typeParser = new RegexParser(
        /Type: (value|)/,
        "type",
        "noType"
        );
    const parser = new CombiningOutputParser(answerParser, typeParser);

    const valchain = RunnableSequence.from([
        PromptTemplate.fromTemplate( `
        You are a professional text preprocessing assistant specializing in text visualization. Please provide a well-structured response to the user's 
        chunk of the text strictly according to rules,  The user's goal is to generate corresponding charts based on your response. To achieve this, 
        please check if the text provided by the user contains value relationships.\n
        Values are usually a numerical value with special meaning that have a significant impact on entities. (eg1:"40 cities and counties also are hiking 
        their minimum wages"; eg2:"46 horses have won two out of tree Triple Crown Races")
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
    console.dir(response)

    return response
}

const runMatch = async (model, textContent) => {
    const answerParser = StructuredOutputParser.fromNamesAndDescriptions({
        id: "unique id of text block",
        text: "original text provided by the user",
        });
    const typeParser = new RegexParser(
        /Type: (comparison|trend|association|rank|proportion|extreme|anomaly|value)/,
        "type",
        "noType"
        );
    const parser = new CombiningOutputParser(answerParser, typeParser);

    const matchain = RunnableSequence.from([
        PromptTemplate.fromTemplate( `
        You are a professional text preprocessing assistant specializing in text visualization. Please provide a well-structured response to the user's chunk of the text strictly according to rules. The user's goal is to generate corresponding charts based on your response. 
        The text chunk provided by the user is matched with two or more types, and you need to choose the most suitable type based on the following definitions.
        Comparison refers to the act of comparing two data attributes or comparing the target object with previous values, especially along a time series.
        Trend presents a general tendency over a time segment.
        Association refers to y the useful relationship between two data attributes or among multiple attributes and can be categorized as positive, negative, or neutral sentiment. 
        Rank refers to sort the data attributes based on their values and show the breakdown of selected data attributes. 
        Proportion refers to measure the proportion of selected data attribute(s) within a specified set.
        Extreme refers to the extreme data cases along with the data attributes or within a certain range, such as maximum and minimum. 
        Anomalies are usually data points that are significantly different from expected patterns. 
        Values are usually a numerical value with special meaning that have a significant impact on entities. 
        \n{format_instructions}\n{index}\n{paragraph}
        `),
        model,
        parser,
    ]);

    const response = await matchain.invoke({
        format_instructions: parser.getFormatInstructions(),
        paragraph: "User:" + textContent,
      });
    console.dir(response)

    return response
}


const LlmLink = (userInput) => {
    const  htmlContent = userInput.userInput
    const selectors = ['p', 'h1', 'h2', 'h3']; 
    const textContent = [];
    const regex = new RegExp(`<[^>]+>(.*?)<\/?[^>]+>`, 'g');
    const matches = htmlContent.match(regex);
    if (matches) {
        matches.forEach(match => {
        const text = match.replace(/<\/?[^>]+>/g, '');
        if (text.trim() !== '') {
            textContent.push(text);
        }
    });
    }
    console.log(textContent)           
   
    // const tools = [
    //     new SerpAPI('你的SerpAPI的key', {
    //         location: "Austin,Texas,United States",
    //         hl: "en",
    //         gl: "us",
    //     }),
    //     new Calculator(),
    // ];
    
    // const token = getToken();

    const model = new ChatZhipuAI({
      modelName: "glm-3-turbo", // Available models:
      temperature: 0.01,
      zhipuAIApiKey: "4c64c9bef6ad9c3b04b0116c4313cfff.ca1pDnEjpNzXQFou", // In Node.js defaults to process.env.ZHIPUAI_API_KEY
    });
    // const model = new OpenAI({
    //     model_name:"glm-3-turbo",
    //     openai_api_base: "https://open.bigmodel.cn/api/paas/v4",
    //     openai_api_key: token,
    //     streaming: false,
    //     temperature: 0.01,
    // });

    const divtextContent = []
    textContent.forEach((part)=>{ divtextContent.push(rundiv(model, part)) });
    const typetextContent = []
    for (let i = 0; i < divtextContent.length; i++) {
        for (let j = 0; j < divtextContent[i].length; j++) {
            const id = `p${i}s${j}`;
            const type = []
            const value = divtextContent[i][j];
            const models = [runComparison, runTrend, runAsso, runRank, runProp, runExtreme, runAnomaly, runValue];
            for (const runModel of models) {
                const current = runModel(model, value, id);
                if (current.type.length > 0) {
                    type.push(current.type);
                }
            }
            const item = {id:id, text:value, type:type}
            if (item.type.length > 1) {item = runMatch(model, item)};
            typetextContent.push(item);
    }}; 


    // const response_schemas = [
    //     ResponseSchema(type="string", name="bad_string", description="This a poorly formatted user input string"),
    //     ResponseSchema(type="string", name="good_string", description="This is your response, a reformatted response")
    // ]
   

    return (
        <span/>
    )
}

export default LlmLink;