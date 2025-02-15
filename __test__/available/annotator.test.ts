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
import { processParagraphs } from '../../src/modules/llm/annotator/annotator';
import { paragraphSpec, GistvisSpec } from '../../src/modules/visualizer/types';

describe('processParagraphs', () => {
    it('should return an empty array when input is empty', async () => {
        const model = {};
        const gistParagraphSpecList: paragraphSpec[] = [];
        const result = await processParagraphs(gistParagraphSpecList, model as any);
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

        const gistParagraphSpecList: paragraphSpec[] = [
            {
                paragraphIdx: 0,
                paragraphContent: [
                    {
                        unitSegmentSpec: {
                            segmentIdx: 0,
                            insightType: "noType",
                            context: "Electric cars manufactures are competing hard in the global market."
                        }
                    } as GistvisSpec
                ]
            },
            {
                paragraphIdx: 1,
                paragraphContent: [
                    {
                        unitSegmentSpec: {
                            segmentIdx: 0,
                            insightType: "noType",
                            context: "The percentage of the sales of BYD is 30%, while the rest of the top 5 companies only consist of 25%."
                        }
                    } as GistvisSpec,
                    {
                        unitSegmentSpec: {
                            segmentIdx: 0,
                            insightType: "noType",
                            context: "The sales of BYD have been steadily increasing over the past 5 years."
                        }
                    } as GistvisSpec,
                    {
                        unitSegmentSpec: {
                            segmentIdx: 0,
                            insightType: "noType",
                            context: "Specifically, the sales of BYD was 10k, 5k, 30k, 80k, and 50k respectively."
                        }
                    } as GistvisSpec
                ]
            }
        ];

        const result = await processParagraphs(gistParagraphSpecList, model as any);
        expect(result).toBeDefined();

        console.log(result);
        result.forEach((paragraphSpec) => {
            paragraphSpec.paragraphContent.forEach((gistvisSpec) => {
                // expect(gistvisSpec.unitSegmentSpec.insightType).not.toBe("noType");
                console.log(gistvisSpec.unitSegmentSpec.insightType);
            });
        });
    }, 5 * 60 * 1000);
});