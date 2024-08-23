import React from "react";
// import { Sparkline, Trend } from "./widgets/sparkline";
// import Barchart from "./widgets/barchart";
// import Piechart from "./widgets/piechart";
// import Extremechart from "./widgets/maxmin";
// import { demo2_1 } from "../demo/demo2_1";
import "./page.css";
import { GistvisSpec, InsightType, paragraphSpec } from "../visualizer/types";
import {
  ComparisonTextRenderer,
  ExtremeTextRenderer,
  PlainTextRenderer,
  ProportionTextRenderer,
  RankTextRenderer,
  ValueTextRenderer,
  TrendTextRenderer,
} from "../visualizer/renderer/rendererList";
import { recommendValidTypes } from "../visualizer/utils/utils";
import FallBackCase from "../visualizer/widgets/fallbackVis";

const ArtcleProcess = ({llmarticle}: {llmarticle: paragraphSpec[]}) => {
  const renderMap = {
    noType: (item: GistvisSpec) => <PlainTextRenderer gistvisSpec={item} />,
    trend: (item: GistvisSpec) => <TrendTextRenderer gistvisSpec={item} />,
    rank: (item: GistvisSpec) => <RankTextRenderer gistvisSpec={item} />,
    proportion: (item: GistvisSpec) => (
      <ProportionTextRenderer gistvisSpec={item} />
    ),
    comparison: (item: GistvisSpec) => (
      <ComparisonTextRenderer gistvisSpec={item} />
    ),
    extreme: (item: GistvisSpec) => <ExtremeTextRenderer gistvisSpec={item} />,
    value: (item: GistvisSpec) => <ValueTextRenderer gistvisSpec={item} />,
    fallback: (item: GistvisSpec) => <FallBackCase gistvisSpec={item} />,
  };

  return (
    <div>
      {llmarticle.map((para) => {
        return (
          <p key={para.paragraphIdx}>
            {para.paragraphContent.map((item) => {
              const recommendedTypes = recommendValidTypes(item)
              const renderType = recommendedTypes.includes(
                item.unitSegmentSpec.insightType
              )
                ? item.unitSegmentSpec.insightType
                : "fallback";
              const renderFunction =
                renderMap[renderType];
              return renderFunction ? renderFunction(item) : null;
            })}
          </p>
        );
      })}
    </div>
  );
};

export default ArtcleProcess;

  // let optionsDefault = {
  //   width: 75,
  //   height: 30,
  //   data: [20, 20, 25, 40, 45, 40, 46, 50, 60, 80, 85, 92, 99],
  // };

  // console.log(llmarticle);
  // const llm = llmarticle.llmarticle;
  // console.log(llm);
  // const renderParts = () => {
  //   console.log(llmarticle.llmarticle)
  //   // llmarticle.llmarticle.map((para) => {
  //   lllmarticle.map((para) => {
  //     if(para.paragraphIdx) {
  //       return (
  //         <p key={para.paragraphIdx}>
  //           {para.paragraphContent.map((item) => {
  //             const renderFunction =
  //               renderMap[item.unitSegmentSpec.insightType.trim()];
  //             return renderFunction ? renderFunction(item) : null;
  //           })}
  //         </p>
  //       );
  //     } else {
  //       return null;
  //     }
  //   })
  //   return llmarticle.llmarticle.map((part, index) => {
  //     // return demo1_1.map((part, index) => {
  //     if (!part.paragraphSpec) {
  //       return (
  //         <span key={part.id}>
  //           {/s0/.test(part.id) && <br />}
  //           <span key={index} className="text">
  //             {part.context}
  //           </span>
  //         </span>

  //       );
  //     } else {
  //       switch (part.paragraphSpec.insightType.trim()) {
  //         case "comparison":
  //           // console.log("运行到compl");
  //           let newdataset
  //           const secondKeyValues = part.dataSpec.reduce((accumulator, item, index) => {
  //             // const keys = Object.keys(item);
  //             // if (keys.length < 2) {
  //             //    return accumulator;
  //             // }
  //             // const secondKey = keys[1];
  //             const value = item.valueValue;
  //             if (value === undefined || value === "NAN" || isNaN(value)) {
  //               // console.error(`Invalid or empty value encountered for the second key "${secondKey}" at index ${index}:`, value);
  //               return accumulator;
  //             }
  //             // console.log(value)
  //             accumulator.push(value);
  //             return accumulator;
  //           }, []);
  //           let delta1;
  //           if (secondKeyValues.length > 1) {
  //             newdataset = secondKeyValues;
  //             delta1 = Math.abs(Math.max(...secondKeyValues) - Math.min(...secondKeyValues));
  //           } else {
  //             newdataset = [100, 20];
  //             delta1 = undefined;
  //           }
  //           delta1 = parseFloat(delta1.toFixed(2));
  //           const newoptionsDefault = {
  //             ...optionsDefault,
  //             data: newdataset,
  //             delta: delta1,
  //           };
  //           console.log(secondKeyValues)
  //           return (
  //             <span key={part.id}>
  //               {/s0/.test(part.id) && <br />}
  //               <span className="text">{part.paragraphSpec.context}</span>
  //               <Barchart key={part.id + "-chart"} option={newoptionsDefault} delta = {"true"} />
  //             </span>
  //           );
  //         case "trend":
  //           const trendvalues = part.dataspec.reduce((accumulator, item, index) => {
  //             const keys = Object.keys(item);
  //             if (keys.length < 2) {
  //               // console.error(`Object at index ${index} does not have a second key.`);
  //               return accumulator;
  //             }
  //             const secondKey = keys[1];
  //             const value = item[secondKey];
  //             if (value === undefined || value === "NAN" || isNaN(value)) {
  //               // console.error(`Invalid or empty value encountered for the second key "${secondKey}" at index ${index}:`, value);
  //               return accumulator;
  //             }
  //             // console.log(value)
  //             accumulator.push(value);
  //             return accumulator;
  //           }, []);
  //           let newData5 = [0, 100, 50, 150, 100, 300];
  //           let type = "positive-trend";
  //           let centerValue = undefined;
  //           if (part.attribute === "negative") {
  //             newData5 = [300, 100, 150, 50, 100, 0];
  //             type = "negative-trend";
  //           }

  //           const newoptionsDefault6 = {
  //             ...optionsDefault,
  //             data: newData5,
  //           };
  //           if (trendvalues.length>1) {
  //             centerValue = Math.max(...trendvalues) - Math.min(...trendvalues)
  //           }
  //           // console.dir(newoptionsDefault6);
  //           // if (part.spec.value3 === "NAN") {
  //           //   if (part.spec.value1 !== "NAN" && part.spec.value2 !== "NAN") {
  //           //     centerValue = Math.abs(
  //           //       parseFloat(part.spec.value1) - parseFloat(part.spec.value2)
  //           //     );
  //           //   }
  //           // } else {
  //           //   centerValue = part.spec.value3;
  //           // }
  //           return (
  //             <span key={part.id}>
  //               {/s0/.test(part.id) && <br />}
  //               <span className="text">{part.context}</span>
  //               <Trend
  //                 options={newoptionsDefault6}
  //                 type={type}
  //                 centerValue={centerValue}
  //               />
  //             </span>
  //           );
  //         // case "association":
  //         //   const regex3 = new RegExp("(" + part.pos + ")", "g");
  //         //   const parts3 = part.text.split(regex3);
  //         //   const attribute1 = part.attribute;
  //         //   let classna = "pos_text";
  //         //   if (attribute1 === "negative") {
  //         //     classna = "neg_text";
  //         //   }
  //         //   return (
  //         //     <span key={part.id}>
  //         //       {parts3.map((item, index) => {
  //         //         if (index % 2 === 1) {
  //         //           return (
  //         //             <span key={index} className={classna}>
  //         //               {item}
  //         //             </span>
  //         //           );
  //         //         } else {
  //         //           return (
  //         //             <span key={index} className="text">
  //         //               {item}
  //         //             </span>
  //         //           );
  //         //         }
  //         //       })}
  //         //     </span>
  //         //   );
  //         case "rank":
  //           const rankvalues = part.dataspec.reduce((accumulator, item, index) => {
  //             const keys = Object.keys(item);
  //             if (keys.length < 2) {
  //               // console.error(`Object at index ${index} does not have a second key.`);
  //               return accumulator;
  //             }
  //             const secondKey = keys[1];
  //             const value = item[secondKey];
  //             if (value === undefined || value === "NAN" || isNaN(value)) {
  //               // console.error(`Invalid or empty value encountered for the second key "${secondKey}" at index ${index}:`, value);
  //               return accumulator;
  //             }
  //             // console.log(value)
  //             accumulator.push(value);
  //             return accumulator;
  //           }, []);
  //           let highLIndex1 = 0;
  //           const value2 = parseInt(Math.max(...rankvalues));
  //           highLIndex1 = rankvalues[rankvalues.length - 1] - 1;
  //           let newdataset4 = [100, 66, 33];
  //           let rankrange = [1, 2, 3];
  //           if (value2 > 3) {
  //             rankrange.push(value2);
  //           }
  //           const ranklength = Math.max(...rankrange);
  //           function range(start, end, step = 1) {
  //             const result = [];
  //             for (let i = start; i <= end; i += step) {
  //               result.push(i);
  //             }
  //             return result;
  //           }
  //           if (ranklength > 3) {
  //             rankrange = range(1, ranklength);
  //           }
  //           if (ranklength > 3) {
  //             const increment = Math.round(100 / ranklength);
  //             const result = [];
  //             for (let i = 0; i < ranklength; i++) {
  //               result.push(increment * (i + 1));
  //             }
  //             newdataset4 = result;
  //           }
  //           console.log(newdataset4)

  //           const newoptionsDefault4 = {
  //             ...optionsDefault,
  //             data: newdataset4,
  //           };
  //           // console.dir(newoptionsDefault4);

  //           return (
  //             <span key={part.id}>
  //               {/s0/.test(part.id) && <br />}
  //               <span className="text">{part.context}</span>
  //               <Barchart
  //                 option={newoptionsDefault4}
  //                 highLIndex={highLIndex1}
  //                 rankrange={rankrange}
  //               />
  //             </span>
  //           );
  //         case "proportion":
  //           // const propvalues = part.dataSpec.reduce((accumulator, item, index) => {
  //           //   const keys = Object.keys(item);
  //           //   if (keys.length < 2) {
  //           //     return accumulator;
  //           //   }
  //           //   const secondKey = keys[1];
  //           //   const value = item[secondKey];
  //           //   if (value === undefined || value === "NAN" || isNaN(value)) {
  //           //     return accumulator;
  //           //   }
  //           //   accumulator.push(value);
  //           //   return accumulator;
  //           // }, []);
  //           // let highLIndex = 0;
  //           // let value = parseFloat(propvalues[0]);
  //           // const pieCharts = [];
  //           // while (value > 1) {
  //           //   const percentage1 = Math.min(value, 1);
  //           //   const percentage2 = 1 - percentage1;
  //           //   const newDataset2 = [percentage1, percentage2];
  //           //   pieCharts.push(newDataset2);
  //           //   value -= 1;
  //           // }
  //           // if (value <= 1) {
  //           //   const sum = propvalues.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  //           //   const newDataset3 = [...propvalues, 1 - sum];
  //           //   pieCharts.push(newDataset3);
  //           // }pieCharts.map((dataset, index) => (
  //           // const renderPieCharts = () => {
  //           //   return (
  //           //     // <Piechart
  //           //     //   key={part.id + "-pie-" + index}
  //           //     //   highLIndex={highLIndex}
  //           //     //   option={{ ...optionsDefault, data: dataset }}
  //           //     // />
  //           //     <ProportionTextRenderer gistvisSpec={part} />
  //           //   );
  //           // };
  //           // <span key={part.id}>
  //               {/* {/s0/.test(part.id) && <br />}
  //               <span className="text">{part.context}</span> */}
  //               // {renderPieCharts()}
  //             // </span>
  //           return (
  //             <ProportionTextRenderer gistvisSpec={part}/>
  //           );
  //         case "extreme":
  //           const extrevalues = part.dataspec.reduce((accumulator, item, index) => {
  //             const keys = Object.keys(item);
  //             if (keys.length < 2) {
  //               return accumulator;
  //             }
  //             const secondKey = keys[1];
  //             const value = item[secondKey];
  //             if (value === undefined || value === "NAN" || isNaN(value)) {
  //               return accumulator;
  //             }
  //             accumulator.push(value);
  //             return accumulator;
  //           }, []);
  //           const regex2 = new RegExp("(" + part.pos + ")", "g");
  //           const parts2 = part.context.split(regex2);
  //           const attribute = part.attribute;
  //           // const newdataset5 = extrevalues;
  //           const newoptionsDefault5 = {
  //             ...optionsDefault,
  //             data: extrevalues,
  //           };
  //           let classn = "max_value";
  //           if (attribute === "minimum") {
  //             classn = "min_value";
  //           }
  //           return (
  //             <span key={part.id}>
  //               {/s0/.test(part.id) && <br />}
  //               {parts2.map((item, index) => {
  //                 if (index % 2 === 1) {
  //                   return (
  //                     <span>
  //                       <Extremechart
  //                         option={newoptionsDefault5}
  //                         attribute={attribute}
  //                       />
  //                       <span key={index} className={classn}>
  //                         {item}
  //                       </span>
  //                     </span>
  //                   );
  //                 } else {
  //                   return (
  //                     <span key={index} className="text">
  //                       {item}
  //                     </span>
  //                   );
  //                 }
  //               })}
  //             </span>
  //           );
  //         case "anomaly":
  //           const splitPoints = part.dataspec.reduce((accumulator, item, index) => {
  //             const keys = Object.keys(item);
  //             if (keys.length < 2) {
  //               // console.error(`Object at index ${index} does not have a second key.`);
  //               return accumulator;
  //             }
  //             const secondKey = keys[1];
  //             const value = item[secondKey];
  //             if (value === undefined || value === "NAN" || isNaN(value)) {
  //               // console.error(`Invalid or empty value encountered for the second key "${secondKey}" at index ${index}:`, value);
  //               return accumulator;
  //             }
  //             accumulator.push(value);
  //             return accumulator;
  //           }, []);
  //           // const regex1 = new RegExp("(" + part.pos + ")", "g");
  //           const regex1 = new RegExp(splitPoints.join("|"), "g");
  //           const parts1 = part.context.split(regex1);
  //           // console.log(parts1);
  //           return (
  //             <span key={part.id}>
  //               {/s0/.test(part.id) && <br />}
  //               {parts1.map((item, index) => {
  //                 if (index % 2 === 1) {
  //                   return (
  //                     <span key={index} className="ano_value">
  //                       {item}
  //                     </span>
  //                   );
  //                 } else {
  //                   return (
  //                     <span key={index} className="text">
  //                       {item}
  //                     </span>
  //                   );
  //                 }
  //               })}
  //             </span>
  //           );
  //         case "value":
  //           const splitPoints1 = part.dataspec.reduce((accumulator, item, index) => {
  //             const keys = Object.keys(item);
  //             if (keys.length < 2) {
  //               // console.error(`Object at index ${index} does not have a second key.`);
  //               return accumulator;
  //             }
  //             const secondKey = keys[1];
  //             const value = item[secondKey];
  //             if (value === undefined || value === "NAN" || isNaN(value)) {
  //               // console.error(`Invalid or empty value encountered for the second key "${secondKey}" at index ${index}:`, value);
  //               return accumulator;
  //             }
  //             accumulator.push(value);
  //             return accumulator;
  //           }, []);
  //           const regex = new RegExp(splitPoints1.join("|"), "g");
  //           // const regex = new RegExp("(" + part.spec.pos + ")", "g");
  //           const parts = part.context.split(regex);
  //           // console.log(parts);
  //           return (
  //             <span key={part.id}>
  //               {/s0/.test(part.id) && <br />}
  //               {parts.map((item, index) => {
  //                 if (index % 2 === 1) {
  //                   return (
  //                     <span key={index} className="spec_value">
  //                       {item}
  //                     </span>
  //                   );
  //                 } else {
  //                   return (
  //                     <span key={index} className="text">
  //                       {item}
  //                     </span>
  //                   );
  //                 }
  //               })}
  //             </span>
  //           );
  //         default:
  //           return (
  //             <span key={index} className="text">
  //               {part.paragraphSpec.context}
  //             </span>
  //           );
  //       }
  //     }
  //   });
  // };
  // {/* renderParts() */}