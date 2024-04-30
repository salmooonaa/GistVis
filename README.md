# GistVis: A Framework for Automatic Generation of Word-scale Visualizations from Data-Rich Documents using Large Language Models

## Usage

### Step1: Get a ChatGLM API key

* Go to [ZHIPU.AI Open Platform](https://open.bigmodel.cn/) and register an account.
* You can find the API key from this page: [API Key](https://open.bigmodel.cn/usercenter/apikeys).
* Clone this project, and create a file `api_key.js` at the root directory.
* Paste the following code in `api_key.js` file: `export const API_KEY = "";`, and fill your API key inside the quotes.

### Step2: Run the frontend application

* Prequisite: Node.js (We recommend Node.js v16 or higher, and yarn as package manager).
* Run `yarn install` or `npm install` to install the dependencies of the project.
* Run `yarn start` or `npm start` to run the application on localhost.

### Step3: Test the generation

* Paste any data-rich paragraph in the editor on the left.
* Click the `Magic Wand` icon, which will call LLM's API if everything is set up properly.
* The rendered result will be shown on the right.
* (We suggest you not to enter a whole passage or long paragraphs. The LLM API runs relatively slow, so it is recommended to enter a paragraph with a length of 100-200 words. Please wait for about 30 seconds for the result to be shown.)

## Additional Info

Due to the rapid development of LLM technology and its ever changing capabilities, we cannot guarantee that the functionality of this project will be stable in the future (Last tested: 30/4/2024). The prompt design and API will be subjective to change.

Besides, we use third-party service to test our workflow. We cannot ensure the reliability of the generated content and do not expect to hold any responsibility for any results generated that might be inaccurate or biased.