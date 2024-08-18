import { InsightType, VisInsightType } from "../visualizer/types";
import { GistFactKnowledgeBase } from "./types";
import lodash from "lodash";

export const SystemInstruction = `You are a professional text preprocessing assistant specializing in text visualization.
  Please provide a well-structured response to the user's chunk of the text strictly according to rules. 
  The user's goal is to generate corresponding charts based on your response.\n
  `;

export const ExtractorSystemInstruction = `
  You must extract entities, numerical values, and other content from text blocks as requested.
  `;

export function getTypeCheckerSystemInstruction(type: InsightType) {
  const gistType = type as string;
  const prompt = `To achieve this, please check if the text provided by the user contains ${gistType} relationship.
      If included, type is ${gistType}; if not included, type is null.\n`;
  return prompt;
}

// not used because it is not producing effective few-shot examples (for some reason)
export function generateFewShotExample(
  type: VisInsightType,
  positiveExample: number = 2,
  nullExample: number = 1,
  isRandomSample: boolean = false
) {
  const getExample = (sentence: string, type: string) => {
    return `User: ${sentence}
    Assistant: """Type: ${type}"""`;
  };

  const positiveExamples = lodash
    .sampleSize(gistKB[type].examples || [], positiveExample)
    .map((sentence) => getExample(sentence, type as string));

  let nullExamples: string[] = [];
  if (!isRandomSample) {
    nullExamples = lodash
      .sampleSize(gistKB[type]?.negativeExamples || [])
      .map((sentence) => getExample(sentence, "null"));
  } else {
    const otherTypes = Object.keys(gistKB).filter((key) => key !== type);
    nullExamples = lodash
      .sampleSize(
        lodash.flatten(
          otherTypes.map((key) => gistKB[key as VisInsightType]?.examples || [])
        ),
        nullExample
      )
      .map((sentence) => getExample(sentence, "null"));
  }

  const fewShotPrompt = [...positiveExamples, ...nullExamples].join("\n");
  // console.log(fewShotPrompt);
  return fewShotPrompt;
}

export const gistKB: { [key in VisInsightType]: GistFactKnowledgeBase } = {
  comparison: {
    definition: `Comparison refers to the act of comparing two data attributes. 
      Typically, comparisons involve two or more entities or values that exhibit significant differences. 
      Comparative relationships are often expressed in phrases containing multiple entities or values that highlight notable disparities.`,
    examples: [
      `China on Wednesday posted a robust GDP growth of 5.2 percent for 2023, successfully beating the government's pre-set yearly target of around 5 percent.`,
      `There are more blocked beds in the Royal London Hospital compared with the UK average.`,
    ],
    negativeExamples: [
      `The little boy was careful enough to come first in the exam.`,
    ],
  },
  trend: {
    definition: `Trend presents a general tendency over a time segment. 
      Temporal changes usually consist of an entity and a phrase with changing semantics such as "increase", "decrease" or "rise", sometimes with numerical values.`,
    examples: [
      `China's population decreased by 2.08 million people in 2023 to 1.40967 billion.`,
      `The budget for the Border Patrol Program has been rising from 1990 to 2013.`,
    ],
    negativeExamples: [
      `The little boy was careful enough to come first in the exam.`,
    ],
  },
  // association:
  //   "Association refers to the useful relationship between two data attributes or among multiple attributes and can be categorized as positive, negative, or neutral sentiment.",
  rank: {
    definition: `Rank refers to sorting the data attributes based on their values and showing the position of selected data attributes. 
      Rank usually includes entities and their corresponding sorting, which can be numbers such as 1 and NO.2, as well as letters and words such as "great" and "A level".`,
    examples: [
      `The little boy was careful enough to come first in the exam.`,
      `The top reason for consumers to engage in showrooming is (the) price (is) better online.`,
    ],
    negativeExamples: [
      `China's population decreased by 2.08 million people in 2023 to 1.40967 billion.`,
    ],
  },
  proportion: {
    definition: `Proportion refers to measuring the proportion of selected data attribute(s) within a specified set. Proportions are usually a ratio or a fraction of one component compared to the whole, usually with phrases nearby that indicate proportion, such as "account for".`,
    examples: [
      `Traffic is one of the biggest sources of carbon pollution in the country and accounts for 28% of the nation's greenhouse gas emissions.`,
      `Protein takes 66% of the diet on Sunday.`,
    ],
    negativeExamples: [
      `The little boy was careful enough to come first in the exam.`,
    ],
  },
  extreme: {
    definition: `Extreme refers to the extreme data cases along with the data attributes or within a certain range, usually maximum and minimum. Notice that anomalies are individual data points and do not include trends such as "increase".`,
    examples: [
      `The character with the most epigrams in the collected dataset is Oscar Wilde himself, who has 12.`,
      `The minimum wage is just $7.25.`,
    ],
    negativeExamples: [
      `The little boy was careful enough to come first in the exam.`,
    ],
  },
  // anomaly:
  //   "Anomalies are usually data points that are significantly different from expected patterns.",
  value: {
    definition: `Values are usually numerical values with special meanings that have a significant impact on entities.`,
    examples: [
      `46 horses have won two out of three Triple Crown Races.`,
      `40 cities and counties also are hiking their minimum wages.`,
    ],
    negativeExamples: [
      `The little boy was careful enough to come first in the exam.`,
    ],
  },
};
