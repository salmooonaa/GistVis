## Running the demonstration page

- Prerequisite: Node.js (We recommend Node.js v18 or higher and yarn as a package manager).
- Run `yarn install` or `npm install` to install the project's dependencies.
- Run `yarn start` or `npm start` to run the application on localhost.
- You can access the following information through the demo page:
  - A sample paragraph to demonstrate the functionality of the application;
  - Six sample augmented articles using content obtained from [Pew Research Center](https://www.pewresearch.org/);
  - You can click the `User study interface` button to access the study interface. You can find both the articles and the questions there.

## For developers

- Go to the [Deepseek Platform](https://platform.deepseek.com/) and register an account.
- Create an API on this page: [API Key](https://platform.deepseek.com/api_keys).
- Reference the `.env.SAMPLE`, create a `.env` file, and paste the API key in this variable `REACT_APP_LLM_API_KEY = ""`
- You can then reference the `README.md` file in the `modules` folder for further information on the project structure.

> Note: Theoretically, this project also supports using the OpenAI API key. You can specify to use OpenAI API through the `.env` file by replacing the URL and the model name.
