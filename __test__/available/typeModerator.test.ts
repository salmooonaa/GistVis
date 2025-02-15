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
import runMatch from '../../src/modules/llm/annotator/typeModerator';
import { paragraphSpec, GistvisSpec } from '../../src/modules/visualizer/types';

describe('runTypeCheck', () => {
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

        const result = await runMatch(model as any, "Electric cars manufactures are competing hard in the global market.", ["trend","comparison"]);
        expect(result).toBeDefined();

        console.log(result);
    }, 5 * 60 * 1000);
})