import {
  ConfigProvider,
  Layout,
  Space,
  Typography,
  Row,
  Col,
  Divider,
  Button,
  Input
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import React, { useEffect, useRef, useState } from "react";
import { Sparkline, Trend } from "./components/sparkline";
import Barchart from "./components/barchart";
import Piechart from "./components/piechart";
import "./page.css";

const { TextArea } = Input;
const { Text } = Typography;

const useOption = () => {
  const [options, setOptions] = useState({
    position: "top",
    width: 75,
    height: 30,
    data: [20, 20, 25, 40, 45, 40, 46, 50, 60, 80, 85, 92, 99],
    paddingWidth: true,
    paddingHeight: false,
    stackingOrder: "front",
    hoverInteraction: false,
    renderer: function () {},
  });
  return {
    options,
    setOptions,
  };
};

// const LLMlink = () => {
//   const api_key = ''
//   const preprompt = ''
//   useEffect = () => {
//     const llmjson = fetch ()
//       .then(res => res.json)

//   },[];
// }

const ArticleEditor = ({ changeArticle }) => {
  // const myRef = useRef(null);
  const [inputText, setInputText] = useState("");
  const [userInput, setUserInput] = useState("");
  // const handleInputChange = (event) => {
  //   setInputText(event.target.value);
  // };
  const submitInputchange = (inputText) => {
    changeArticle(inputText);
    // setInputText("");
    // myRef.current.focus();
  };

  const updateInputText = (e) => {
    setInputText(e.target.value);
  }

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={20}>
          <Text>The TextArea should only be used for testing llm output.
            When functionality of LLM is in this frontend application, use the editor instead!
          </Text>
          <TextArea size="large" rows={6} onChange={updateInputText} />

          <Text>Remember to update the button click funtion when switching to editor.
            The editor is a markdown editor that basically uses HTML format. So its as close as 
            it can get to the real html rendered webpages.
          </Text>
          <ReactQuill theme="snow" style={{height: "350px"}}value={userInput} onChange={setUserInput} />
        </Col>

        {/* <input
        type="text"
        placeholder="Enter your text here"
        value={inputText}
        class="input"
        ref={myRef}
        onChange={handleInputChange}
      /> */}
        <Col span={2}>
          <Button
            shape="circle"
            size="large"
            onClick={() => submitInputchange(inputText)}
          >
            <FontAwesomeIcon icon={faWandMagicSparkles} />
          </Button>
        </Col>
      </Row>
    </div>
  );
};

const ArticleWithImage = ({ article }) => {
  const myarticle = article;
  console.log(myarticle);
  const textParts = myarticle.split(/<([STERAVDP]\d*?)(?:,(.*?))?>(.*?)<\/\1>/);
  // const textParts = myarticle.split(/<\/?[STRAVDP]\d*(?:,.*?)?>/);
  console.log(textParts);
  const processedParts = [];
  for (let i = 0; i < textParts.length; i += 4) {
    processedParts.push(textParts[i]);
    if (i + 1 < textParts.length) {
      const caption = {
        type: textParts[i + 1].substring(0, 1),
        index: textParts[i + 1],
        info: textParts[i + 2],
        text: textParts[i + 3],
      };
      processedParts.push(caption);
    }
  }

  return (
    <Text>
      {processedParts.map((part, index) => {
        if (index % 2 === 1) {
          return (
            <ElementWithChart
              type={part.type}
              index={part.index}
              info={part.info}
              text={part.text.trim()}
            />
          );
        } else {
          return (
            <span key={index} class="text">
              {part}
            </span>
          );
        }
      })}
    </Text>
  );
};

const CompProcessinfo = ({ index, text }) => {
  let optionsDefault = {
    width: 75,
    height: 30,
    data: [20, 20, 25, 40, 45, 40, 46, 50, 60, 80, 85, 92, 99],
  };
  let highLIndex = 0;
  const newdataset = [100, 20];
  const processedinfo = text.split(
    /<(N\d),\s+([HL]),\s+value=(.*?)>(.*?)<\/\1>/
  );
  console.log(processedinfo);
  const processedCPinfo = [];

  for (let i = 0; i < processedinfo.length; i += 5) {
    processedCPinfo.push(processedinfo[i]);
    if (i + 1 < processedinfo.length) {
      const compentity = {
        index: processedinfo[i + 1],
        level: processedinfo[i + 2],
        value: processedinfo[i + 3],
        entity: processedinfo[i + 4],
      };
      processedCPinfo.push(compentity);
    }
  }

  processedCPinfo.forEach((part, index) => {
    if (index % 2 === 1) {
      if (part.value !== "null") {
        if (part.level === "L") {
          newdataset[1] = parseFloat(part.value);
        } else {
          newdataset[0] = parseFloat(part.value);
        }
      }
    }
  });

  if (newdataset[0] === 100 && newdataset[1] !== 20) {
    newdataset[0] = (100 / 20) * newdataset[1];
  } else if (newdataset[1] === 20 && newdataset[0] !== 100) {
    newdataset[1] = (20 / 100) * newdataset[0];
  }

  optionsDefault = {
    ...optionsDefault,
    data: newdataset,
  };
  console.dir(optionsDefault);

  return (
    <span key={index}>
      {processedCPinfo.map((part, index) => {
        if (index % 2 === 1) {
          console.dir(part);
          if (part.level === "L") {
            highLIndex = 1;
          }
          return (
            <span key={part.index}>
              <Barchart
                option={optionsDefault}
                text={part.entity}
                highLIndex={highLIndex}
              />
            </span>
          );
        } else {
          return <span class="text">{part}</span>;
        }
      })}
    </span>
  );
};

const TrendProcessinfo = ({ index, info, text }) => {
  let optionsDefault = {
    width: 75,
    height: 30,
    data: [0, 100, 50, 150, 100, 300],
  };
  const regex = /N/;
  let newData = [0, 100, 50, 150, 100, 300];
  let type = "positive-trend";
  let centerValue = undefined;
  if (regex.test(info)) {
    newData = [300, 100, 150, 50, 100, 0];
    type = "negative-trend";
  }

  optionsDefault = {
    ...optionsDefault,
    data: newData,
  };

  console.dir(optionsDefault);

  const processedinfo = text.split(
    /<(N\d),\s+start_d=(.*?),\s+delta=(.*?),\s+end_d=(.*?)>(.*?)<\/\1>/
  );
  console.log(processedinfo);
  const processedTDinfo = [];

  for (let i = 0; i < processedinfo.length; i += 6) {
    processedTDinfo.push(processedinfo[i]);
    if (i + 1 < processedinfo.length) {
      const compentity = {
        index: processedinfo[i + 1],
        start: processedinfo[i + 2],
        delta: processedinfo[i + 3],
        end: processedinfo[i + 4],
        entity: processedinfo[i + 5],
      };
      processedTDinfo.push(compentity);
    }
  }

  processedTDinfo.forEach((part, index) => {
    if (index % 2 === 1) {
      if (part.delta === "null") {
        if (part.start !== "null" && part.end !== "null") {
          centerValue = Math.abs(parseFloat(part.start) - parseFloat(part.end));
        }
      } else {
        centerValue = part.delta;
      }
    }
  });

  return (
    <span key={index}>
      {processedTDinfo.map((part, index) => {
        if (index % 2 === 1) {
          console.dir(part);
          return (
            <span key={part.index}>
              <Trend
                options={optionsDefault}
                text={part.entity}
                type={type}
                centerValue={centerValue}
              />
            </span>
          );
        } else {
          return <span class="text">{part}</span>;
        }
      })}
    </span>
  );
};

const EMOTrendProcessinfo = ({ index, info, text }) => {
  const regex = /N/;
  let className = "";
  if (regex.test(info)) {
    className = "neg_text";
  } else {
    className = "pos_text";
  }

  const processedinfo = text.split(/<(N\d)>(.*?)<\/\1>/);
  const processedETinfo = [];

  for (let i = 0; i < processedinfo.length; i += 3) {
    processedETinfo.push(processedinfo[i]);
    if (i + 1 < processedinfo.length) {
      const compentity = {
        index: processedinfo[i + 1],
        entity: processedinfo[i + 2],
      };
      processedETinfo.push(compentity);
    }
  }

  return (
    <span key={index}>
      {processedETinfo.map((part, index) => {
        if (index % 2 === 1) {
          return (
            <span key={part.index} class={className}>
              {part.entity}
            </span>
          );
        } else {
          return <span class="text">{part}</span>;
        }
      })}
    </span>
  );
};

const RankProcessinfo = ({ index, text }) => {
  let optionsDefault = {
    width: 75,
    height: 30,
    data: [20, 20, 25, 40, 45, 40, 46, 50, 60, 80, 85, 92, 99],
  };
  let highLIndex = 0;
  const newdataset = [100, 66, 33];
  const processedinfo = text.split(/<(N\d),\s+rank=(\d+)>(.*?)<\/\1>/);
  console.log(processedinfo);
  const processedRKinfo = [];

  for (let i = 0; i < processedinfo.length; i += 4) {
    processedRKinfo.push(processedinfo[i]);
    if (i + 1 < processedinfo.length) {
      const compentity = {
        index: processedinfo[i + 1],
        rank: processedinfo[i + 2],
        entity: processedinfo[i + 3],
      };
      processedRKinfo.push(compentity);
    }
  }

  const rankrange = [1, 2, 3];
  processedRKinfo.forEach((part, index) => {
    if (index % 2 === 1) {
      part.rank = parseInt(part.rank);
      if (part.rank > 3) {
        rankrange.push(part.rank);
      }
    }
  });
  rankrange.sort();
  const ranklength = Math.max(rankrange);
  if (ranklength > 3) {
    const increment = Math.round(100 / ranklength);
    const result = [];
    for (let i = 0; i < ranklength; i++) {
      result.push(increment * (i + 1));
    }
    newdataset = result;
  }

  optionsDefault = {
    ...optionsDefault,
    data: newdataset,
  };
  console.dir(optionsDefault);

  return (
    <span key={index}>
      {processedRKinfo.map((part, index) => {
        if (index % 2 === 1) {
          console.dir(part);
          highLIndex = part.rank - 1;
          return (
            <span key={part.index}>
              <Barchart
                option={optionsDefault}
                text={part.entity}
                highLIndex={highLIndex}
                rankrange={rankrange}
              />
            </span>
          );
        } else {
          return <span class="text">{part}</span>;
        }
      })}
    </span>
  );
};

const PropProcessinfo = ({ index, info, text }) => {
  let optionsDefault = {
    width: 75,
    height: 30,
    data: [20, 20, 25, 40, 45, 40, 46, 50, 60, 80, 85, 92, 99],
  };
  let highLIndex = 0;
  const newdataset = [0.35, 0.65];
  const processedinfo = info.split(/\s+value=(\d+(\.\d+)?)/);
  console.log(processedinfo);
  newdataset[0] = parseFloat(processedinfo[1]);
  newdataset[1] = 1 - parseFloat(processedinfo[1]);

  optionsDefault = {
    ...optionsDefault,
    data: newdataset,
  };
  console.dir(optionsDefault);

  return (
    <span key={index}>
      <Piechart highLIndex={highLIndex} text={text} option={optionsDefault} />
    </span>
  );
};

const ANProcessinfo = ({ index, info, text }) => {};

const VAProcessinfo = ({ index, text }) => {
  return (
    <span key={index}>
      <span class="spec_value">{text}</span>
    </span>
  );
};

const ElementWithChart = ({ type, index, info, options, text }) => {
  switch (type) {
    case "sparkline":
      return <Sparkline options={options} text={text} />;
    case "barchart":
      return <Barchart options={options} text={text} />;
    case "S":
      return <CompProcessinfo index={index} text={text} />;
    case "T":
      return <TrendProcessinfo options={options} info={info} text={text} />;
    case "E":
      return <EMOTrendProcessinfo options={options} info={info} text={text} />;
    case "D":
    case "R":
      return <RankProcessinfo index={index} info={info} text={text} />;
    case "P":
      return <PropProcessinfo index={index} info={info} text={text} />;
    case "A":
      return <ANProcessinfo index={index} info={info} text={text} />;
    case "V":
      return <VAProcessinfo index={index} info={info} text={text} />;
    default:
      return null;
  }
};

export { ArticleWithImage, ArticleEditor };
