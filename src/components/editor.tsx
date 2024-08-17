import React, { useState } from "react";
import { Row, Col, Button, Typography, Input } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import generateGistVisMarkup from "../lm/llm";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { paragraphSpec } from "../visualizer/types";

const { Text } = Typography;
const { TextArea } = Input;

interface EditorProps {
  changeLlmArticle: React.Dispatch<React.SetStateAction<paragraphSpec[]>>;
}

const Editor = ({ changeLlmArticle }: EditorProps) => {
  // const myRef = useRef(null);
  // const [inputText, setInputText] = useState("");
  const [userInput, setUserInput] = useState("");
  const changeUserInput = (userInput: string) => {
    setUserInput(userInput);
  };
  const submitUserInput = () => {
    // const input = {userInput}.userInput
    generateGistVisMarkup(userInput).then((message) => {
      // console.log(message);
      changeLlmArticle(message);
    });
  };
  // console.dir(userInput);
  // const handleInputChange = (event) => {
  //   setInputText(event.target.value);
  // };
  // const submitInputchange = (inputText: string) => {
  //   changeArticle(inputText);
  //   // setInputText("");
  //   // myRef.current.focus();
  // };

  // const updateInputText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   setInputText(e.target.value);
  // };

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          {/* <Text>
            The TextArea should only be used for testing llm output. When
            functionality of LLM is in this frontend application, use the editor
            instead!
          </Text>
          <TextArea size="large" rows={6} onChange={updateInputText} />

          <Text>
            Remember to update the button click funtion when switching to
            editor. The editor is a markdown editor that basically uses HTML
            format. So its as close as it can get to the real html rendered
            webpages.
          </Text> */}
          <ReactQuill
            theme="snow"
            style={{ height: "350px" }}
            value={userInput}
            onChange={changeUserInput}
          />
          <Button shape="circle" size="large" onClick={() => submitUserInput()}>
            <FontAwesomeIcon icon={faWandMagicSparkles} />
          </Button>
        </Col>

        {/* <Col span={2}>
          <Button
            shape="circle"
            size="large"
            onClick={() => submitInputchange(inputText)}
          >
            <FontAwesomeIcon icon={faWandMagicSparkles} />
          </Button>
        </Col> */}
      </Row>
    </div>
  );
};

export default Editor;