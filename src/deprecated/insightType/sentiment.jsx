

const Sentiment = ({ index, info, text }) => {
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
            <span key={part.index} className={className}>
              {part.entity}
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

export default Sentiment;
