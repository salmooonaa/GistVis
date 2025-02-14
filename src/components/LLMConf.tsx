import React, { useState, useEffect } from "react";
import { ChatOpenAI } from "@langchain/openai";
import "./LLMConf.css";
import { ConfigProvider, Layout, Typography, Button, Flex, Divider,Row,Tooltip } from "antd";
import THEME from "../style/theme";

const { Header, Content } = Layout;
const { Text } = Typography;

const LLMConfigurationPage = () => {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [envVariables, setEnvVariables] = useState<{ REACT_APP_LLM_URL_BASE?: string; REACT_APP_LLM_API_KEY?: string; REACT_APP_LLM_MODEL_NAME?: string }>({});
  const [langchainMessages, setLangchainMessages] = useState<string[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const [useFetch, setUseFetch] = useState(true);
  const [useLangchain, setUseLangchain] = useState(true);
  const [chatState, setChatState] = useState(0);
  const FETCH_FLAG = 1;
  const LANGCHIAN_FLAG = 10;

  useEffect(() => {
    const storedEnvVariables = localStorage.getItem("envVariables");
    if (storedEnvVariables) {
      setEnvVariables(JSON.parse(storedEnvVariables));
    } else {
      setEnvVariables({
        REACT_APP_LLM_URL_BASE: process.env.REACT_APP_LLM_URL_BASE,
        REACT_APP_LLM_API_KEY: process.env.REACT_APP_LLM_API_KEY,
        REACT_APP_LLM_MODEL_NAME: process.env.REACT_APP_LLM_MODEL_NAME
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("envVariables", JSON.stringify(envVariables));
  }, [envVariables]);
  
  const chat = ()=>{return envVariables.REACT_APP_LLM_API_KEY && envVariables.REACT_APP_LLM_MODEL_NAME ? new ChatOpenAI({
    modelName: envVariables.REACT_APP_LLM_MODEL_NAME,
    openAIApiKey: envVariables.REACT_APP_LLM_API_KEY,
    configuration: {
      apiKey: envVariables.REACT_APP_LLM_API_KEY,
      baseURL: envVariables.REACT_APP_LLM_URL_BASE
    },
  }) : null;}
  const handleSendMessage = async () => {
    if(chatInput.trim() == ""){
      return;
    }
    const inp = chatInput.trim();
    setChatInput("");
    const res = sendMessageToBoth(inp);
    const fetchRes = await res[0];
    const langchainRes = await res[1];
    setChatState(fetchRes + langchainRes);
  }
  const sendMessageToBoth = (inp:string) => {
    // same time
    const fetchRes = handleSendFetchMessage(FETCH_FLAG,inp);
    const langchainRes = handleLangchainSendMessage(LANGCHIAN_FLAG,inp);
    return [fetchRes,langchainRes];
  }
  const handleSendFetchMessage = async (flag:number,inp:string) => {
    if (!useFetch){return 0}
    const newMessages = [...messages, inp];
    setMessages(newMessages);
    // call LLM API to get AI reply
    if (!envVariables.REACT_APP_LLM_URL_BASE) {
      console.error("REACT_APP_LLM_URL_BASE is not defined");
      return -flag;
    }

    try {
      const url = envVariables.REACT_APP_LLM_URL_BASE + `/chat/completions`;
      console.log(`url=${url}`);
  
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${envVariables.REACT_APP_LLM_API_KEY}`
        },
        body: JSON.stringify({
          model: envVariables.REACT_APP_LLM_MODEL_NAME,
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant."
            },
            {
              role: "user",
              content: inp
            }
          ]
        })
      });
  
      const data = await response.json();
      console.log(`response.json:`);
      console.log(data);
      const aiReply = data.choices[0].message.content.trim();
  
      setMessages([...newMessages, aiReply]);
      return flag;
    } catch (error) {
      console.error("Failed:", error);
      setMessages([...newMessages, "[ERROR] FAILED TO FETCH"]);
      return -flag;
    }
  };

  const handleLangchainSendMessage = async (flag:number,inp:string) => {
    if (!useLangchain){return 0}
    if (!chat){return -flag}
    const newMessages = [...langchainMessages, inp];
    setLangchainMessages(newMessages);

    // call langchain API to get AI reply
    try {
      const response = await chat()?.invoke(inp);
      console.log("response gotten");
      if(response == null){
        throw new Error("response is null");
      }
      const aiReply = response.text.trim();
      setLangchainMessages([...newMessages, aiReply]);
      return flag;
    } catch (error) {
      console.error("Failed:", error);
      setLangchainMessages([...newMessages, "[ERROR] FAILED TO FETCH"]);
      return -flag;
    }
  };

  const handleEnvChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    console.log(1);
    
    setEnvVariables({
      ...envVariables,
      [key]: e.target.value
    });

  };

  const handleLoadEnvVariables = () => {
    try {
      const newEnvVariables = {
        REACT_APP_LLM_URL_BASE: process.env.REACT_APP_LLM_URL_BASE,
        REACT_APP_LLM_API_KEY: process.env.REACT_APP_LLM_API_KEY,
        REACT_APP_LLM_MODEL_NAME: process.env.REACT_APP_LLM_MODEL_NAME
      };
      setEnvVariables(newEnvVariables);
      localStorage.setItem("envVariables", JSON.stringify(newEnvVariables));
      alert("Loaded from .env");
    } catch (error) {
      alert("Failed to load from .env");
    }
  };

  const handleClearMessages = () => {
    setMessages([]);
    setLangchainMessages([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleToggleFetch = () => {
    setUseFetch(!useFetch);
  };

  const handleToggleLangchain = () => {
    setUseLangchain(!useLangchain);
  };

  return (
      <ConfigProvider theme={THEME}>
    <div className="llm-config-page">
        <Header>
          <Flex align="center" justify="space-between">
            <Text
              style={{ fontSize: "24px", padding: "2%", fontWeight: "bold" }}
            >
              GistVis
            </Text>
            <div>
              <Button href="/" type="link">Home</Button>
              <Button href="/interactive" type="link">User study interface</Button>
              <Button href="/llm_setting" type="link">Setting</Button>
            </div>
          </Flex>
        </Header>
      <div className="llm-config-page-content">
        <Layout dir="verticle">
          <Text style={{ fontSize: "20px", fontWeight: "bold" }}>
            Sample Paragraph
            </Text>
            <Text style={{ fontSize: "16px", fontStyle: "italic" }}>
            {
              useFetch?
                (useLangchain?
                  // 1,1
                  (
                    chatState === + FETCH_FLAG + LANGCHIAN_FLAG ? "(Both Suceess)":
                    chatState === - FETCH_FLAG - LANGCHIAN_FLAG ? "(Both Failed)":
                    chatState === + FETCH_FLAG - LANGCHIAN_FLAG ? "(Fetch ✔, Langchain ✘)":
                    chatState === + FETCH_FLAG - LANGCHIAN_FLAG ? "(Fetch ✘, Langchain ✔)":
                    "ready"//first time
                  ):
                  // 1,0
                  (
                    chatState === + FETCH_FLAG ? "(Fetch Suceess)":
                    chatState === - FETCH_FLAG ? "(Fetch Failed)":
                    ""//first time
                  )
                ):
                (useLangchain?
                  // 0,1
                  (
                    chatState === + LANGCHIAN_FLAG ? "(Langchain Suceess)":
                    chatState === - LANGCHIAN_FLAG ? "(Langchain Failed)":
                    ""//first time
                  ):
                  // 0,0
                  (
                    ""
                  )
                )
            }
          </Text>
          <Divider style={{ margin: "0 0 0 0" }} />
        </Layout>
        <Content style={{ padding: "2%", margin: "0 auto" }}>
        <div className="chat-container">
          <div className="chat-box">
            <button
              className={`toggle-button ${useFetch ? "" : "off"}`}
              onClick={handleToggleFetch}
            >
              Chat using Fetch
            </button>
            <Text className="chat-box-label">Check API Available</Text>
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className="chat-message">{msg}</div>
              ))}
            </div>
          </div>
          <div className="chat-box">
            <button
              className={`toggle-button ${useLangchain ? "" : "off"}`}
              onClick={handleToggleLangchain}
            >
              Chat using Langchain
            </button>
            <Text className="chat-box-label">Check Langchain Supportable</Text>
            <div className="chat-messages">
              {langchainMessages.map((msg, index) => (
                <div key={index} className="chat-message">{msg}</div>
              ))}
            </div>
          </div>
        </div>
        <div className="env-dialog">
          <Row>
          <Tooltip 
            title={
              <div style={{ lineHeight: 1.5 }}>
                Load from .env if you are first time to use this page.
                <br />
                Your modifications will be saved in local storage and load automatically next time.
                <br />
                Any changes will be applied immediately.
              </div>
            }
            overlayStyle={{ fontSize: "14px", color: "blue" }}
          >
            <Text 
              style={{ fontSize: "22px", fontWeight: "bold", margin: "10px", cursor: "pointer", alignContent: "center" }}
            >
              ENV CONFIGURATION
            </Text>
          </Tooltip>
          <Tooltip 
            title={
              <div style={{ lineHeight: 1.5 }}>
                Reset the configuration to the default values from .env.
              </div>
            }
            overlayStyle={{ fontSize: "14px", color: "blue" }}
          >
            <Button 
              onClick={handleLoadEnvVariables}
              title="Load from .env"
              style={{ margin: "10px", alignContent: "center" }}
            >
              Load .env
            </Button>
          </Tooltip>
          </Row>
          {Object.keys(envVariables).map((key) => (
            <div key={key} className="env-variable">
              <Text>{key === 'REACT_APP_LLM_URL_BASE' ? 'Base Url (with the suffix /v1)' : key === 'REACT_APP_LLM_MODEL_NAME' ? 'Model Name' : key === 'REACT_APP_LLM_API_KEY' ? 'Api Key (without the prefix Bearer)' : key}</Text>
              <input
                type="text"
                value={envVariables[key as keyof typeof envVariables] ?? ""}
                onChange={(e) => handleEnvChange(e, key)}
                className="env-input"
              />
            </div>
          ))}
        </div>
        {Array.from({ length: 10 }).map((_, index) => (
          <br key={index} />
        ))}
        </Content>
        <div className="input-container">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your word..."
            className="chat-input"
          />
          <div className="input-bottom-area">
            <div></div>
            <div className="button-container" onMouseLeave={handleMouseLeave}>
              <button
                onClick={handleSendMessage}
                className="send-button"
                onMouseEnter={handleMouseEnter}
                data-hover-text="Send"
              >
                ▷
              </button>
              <button
                onClick={handleClearMessages}
                className="clear-button"
                data-hover-text="Clear"
              >
                X
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ConfigProvider>
  );
};

export default LLMConfigurationPage;
