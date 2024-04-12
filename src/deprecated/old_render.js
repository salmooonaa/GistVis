// deprecated code in page.js
import {
  ComparisonInsight,
  SentimentInsight,
  TrendInsight,
} from "./insightType/index";

const ArticleWithImage = ({ article }) => {
  const myarticle = article;
  // console.log(myarticle);
  const textParts = myarticle.split(/<([STERAVDP]\d*?)(?:,(.*?))?>(.*?)<\/\1>/);
  // const textParts = myarticle.split(/<\/?[STRAVDP]\d*(?:,.*?)?>/);
  // console.log(textParts);
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
              key={index}
              type={part.type}
              index={part.index}
              info={part.info}
              text={part.text.trim()}
            />
          );
        } else {
          return (
            <span key={index} className="text">
              {part}
            </span>
          );
        }
      })}
    </Text>
  );
};

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

const ElementWithChart = ({ type, index, info, options, text }) => {
  switch (type) {
    case "sparkline":
      return <Sparkline options={options} text={text} />;
    case "barchart":
      return <Barchart options={options} text={text} />;
    case "S":
      return <ComparisonInsight index={index} text={text} />;
    case "T":
      return <TrendInsight options={options} info={info} text={text} />;
    case "E":
      return <SentimentInsight options={options} info={info} text={text} />;
    case "D":
    // Is this left here on purpose?
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

const ANProcessinfo = ({ index, info, text }) => {};

const VAProcessinfo = ({ index, text }) => {
  return (
    <span key={index}>
      <span className="spec_value">{text}</span>
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
  // console.log(processedinfo);
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
  // console.dir(optionsDefault);

  return (
    <span key={index}>
      {processedRKinfo.map((part, index) => {
        if (index % 2 === 1) {
          // console.dir(part);
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

const PropProcessinfo = ({ index, info, text }) => {
  let optionsDefault = {
    width: 75,
    height: 30,
    data: [20, 20, 25, 40, 45, 40, 46, 50, 60, 80, 85, 92, 99],
  };
  let highLIndex = 0;
  const newdataset = [0.35, 0.65];
  const processedinfo = info.split(/\s+value=(\d+(\.\d+)?)/);
  // console.log(processedinfo);
  newdataset[0] = parseFloat(processedinfo[1]);
  newdataset[1] = 1 - parseFloat(processedinfo[1]);

  optionsDefault = {
    ...optionsDefault,
    data: newdataset,
  };
  // console.dir(optionsDefault);

  return (
    <span key={index}>
      <Piechart highLIndex={highLIndex} text={text} option={optionsDefault} />
    </span>
  );
};
