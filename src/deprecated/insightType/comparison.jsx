import Barchart from "../../components/widgets/barchart";

const ComparisonInsight = ({ index, text }) => {
  let optionsDefault = {
    width: 75,
    height: 30,
    data: [20, 20, 25, 40, 45, 40, 46, 50, 60, 80, 85, 92, 99],
    delta: "225",
  };
  let highLIndex = 0;
  const newdataset = [100, 20];
  const processedinfo = text.split(
    /<(N\d),\s+([HL]),\s+value=(.*?)>(.*?)<\/\1>/
  );
  // console.log(processedinfo);
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
  // console.dir(optionsDefault);

  return (
    <span key={index}>
      {processedCPinfo.map((part, index) => {
        if (index % 2 === 1) {
          // console.dir(part);
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

export default ComparisonInsight;
