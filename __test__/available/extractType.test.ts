// Jest test for generateGistVisMarkup function
import dotenv from 'dotenv';
dotenv.config();
global.ReadableStream = require('stream').Readable;
global.localStorage = {
  getItem: jest.fn((key: string) => process.env[key] || null),
  setItem: jest.fn((key: string, value: string) => {
      process.env[key] = value;
  }),
  removeItem: jest.fn((key: string) => {
      delete process.env[key];
  }),
  clear: jest.fn(() => {
      for (const key in process.env) {
          delete process.env[key];
      }
  }),
  length: Object.keys(process.env).length,
  key: jest.fn((index: number) => Object.keys(process.env)[index] || null),
};

// import after global.localStorage is set
import { ChatOpenAI } from "@langchain/openai";
import { paragraphSpec, GistvisSpec } from '../../src/modules/visualizer/types';
import extrComp from '../../src/modules/llm/extractor/extractComparison';
import extrTrend from '../../src/modules/llm/extractor/extractTrend';
import extrRank from '../../src/modules/llm/extractor/extractRank';
import extrProp from '../../src/modules/llm/extractor/extractProportion';
import extrExtreme from '../../src/modules/llm/extractor/extractExtreme';
import extrValue from '../../src/modules/llm/extractor/extractValue';

const model = new ChatOpenAI({
    temperature: 0.7,
    topP: 1,
    n: 1,
    streaming: false,
    openAIApiKey: localStorage.getItem('REACT_APP_LLM_API_KEY')||process.env.REACT_APP_LLM_API_KEY||'',
    modelName: localStorage.getItem('REACT_APP_LLM_MODEL_NAME')||process.env.REACT_APP_LLM_MODEL_NAME||'',
    configuration: {
        apiKey: localStorage.getItem('REACT_APP_LLM_API_KEY')||process.env.REACT_APP_LLM_API_KEY||'',
        baseURL: localStorage.getItem('REACT_APP_LLM_URL_BASE')||process.env.REACT_APP_LLM_URL_BASE||'',
    },
    verbose: false,
});

describe('extrComp', () => {
    it('should process be finished', async () => {
        const result = await extrComp(
            model as any,
            {
                text: "China on Wednesday posted a robust GDP growth of 5.2 percent for 2023, successfully beating the government's pre-set yearly target of around 5 percent.",
                type: "comparison"
            }
        );
        expect(result).toBeDefined();
        console.log(result);
    }, 60 * 1000);
})

describe('extrTrend', () => {
    it('should process be finished', async () => {
        const result = await extrTrend(
            model as any,
            {
                text: "China's population decreased by 2.08 million people in 2023 to 1.40967 billion.",
                type: "trend"
            }
        );
        expect(result).toBeDefined();
        console.log(result);
    }, 60 * 1000);
})

describe('extrRank', () => {
    it('should process be finished', async () => {
        const result = await extrRank(
            model as any,
            {
                text: "The little boy was careful enough to come first in the exam.",
                type: "rank"
            }
        );
        expect(result).toBeDefined();
        console.log(result);
    }, 60 * 1000);
})

describe('extrProp', () => {
    it('should process be finished', async () => {
        const result = await extrProp(
            model as any,
            {
                text: "Traffic is one of the biggest sources of carbon pollution in the country and accounts for 28% of th",
                type: "proportion"
            }
        );
        expect(result).toBeDefined();
        console.log(result);
    }, 60 * 1000);
})

describe('extrExtreme', () => {
    it('should process be finished', async () => {
        const result = await extrExtreme(
            model as any,
            {
                text: "The character with the most epigrams in the collected dataset is Oscar Wilde himself, who has 12.",
                type: "extreme"
            }
        );
        expect(result).toBeDefined();
        console.log(result);
    }, 60 * 1000);
})

describe('extrValue', () => {
    it('should process be finished', async () => {
        const result = await extrValue(
            model as any,
            {
                text: "46 horses have won two out of three Triple Crown Races.",
                type: "value"
            }
        );
        expect(result).toBeDefined();
        console.log(result);
    }, 60 * 1000);
})