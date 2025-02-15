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
import splitInsight from '../../src/modules/llm/discoverer/discoverer';

describe('splitInsight', () => {
    it('should return an empty array when input is empty', async () => {
        const model = {}; // mock model
        const paragraphList: string[] = [];
        const result = await splitInsight(model as any, paragraphList);
        expect(result).toEqual([]);
    });

    it('should process be finished', async () => {
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
        const paragraphList = [
            "Electric cars manufactures are competing hard in the global market.",
            "The percentage of the sales of BYD is 30%, while the rest of the top 5 companies only consist of 25%. The sales of BYD have been steadily increasing over the past 5 years. Specifically, the sales of BYD was 10k, 5k, 30k, 80k, and 50k respectively. The top seller for BYD, Qin series, could do a maximum range of 2000 kilometers, making it the longest ranged plug-in hybrid you can buy on the market."
        ];
        const result = await splitInsight(model as any, paragraphList);
        expect(result).toBeDefined();
        expect(result.length).toBe(2);
        expect(result[0].paragraphContent.length).toBeGreaterThan(0);
        expect(result[1].paragraphContent.length).toBeGreaterThan(0);
        console.log(result[0].paragraphContent);
        console.log(result[1].paragraphContent);
    },5*60*1000);
});
