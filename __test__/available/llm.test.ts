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
import generateGistVisMarkup from '../../src/modules/llm/llm';

describe('generateGistVisMarkup', () => {
    it('should return an empty array when input is empty', async () => {
        const input = '';
        const setStage = jest.fn();
        const result = await generateGistVisMarkup(input, setStage);
        expect(result).toEqual([]);
    });

    // banned due to long processing time and high token cost
    // it is too easy to hit the rate limit of the API (self-made API from the web-chat interface)

    // it('should process be finished', async () => {
    //     const input = '<p>Electric cars manufactures are competing hard in the global market.</p><p>The percentage of the sales of BYD is 30%, while the rest of the top 5 companies only consist of 25% . The sales of BYD have been steadily increasing over the past 5 years.</p>';
    //     const setStage = jest.fn();
    //     const result = await generateGistVisMarkup(input, setStage);
    //     expect(result).toBeDefined();
    // }, 20 * 60 * 1000);
});
