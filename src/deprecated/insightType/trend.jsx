import React from "react";
import { Sparkline, Trend } from "../widgets/sparkline";
import "../page.css";
import { Typography } from "antd";
const { Text } = Typography;

const TrendInsight = ({ index, info, text }) => {
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

  // console.dir(optionsDefault);

  const processedinfo = text.split(
    /<(N\d),\s+start_d=(.*?),\s+delta=(.*?),\s+end_d=(.*?)>(.*?)<\/\1>/
  );
  // console.log(processedinfo);
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
          // console.dir(part);
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
          return (
            <span className="text" key={index}>
              {part}
            </span>
          );
        }
      })}
    </span>
  );
};

export default TrendInsight;

