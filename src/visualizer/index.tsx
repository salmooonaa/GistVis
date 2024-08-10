import { ConfigProvider, Layout, Typography, Row, Col, Divider } from "antd";
import React, { useRef, useState } from "react";
import { GistvisSpec, InsightType } from "./types";
import { PlainTextRenderer, ProportionTextRenderer } from './renderer/rendererList'
import HoverText from "./widgets/hoverText";


const renderMap: { [key in InsightType]: (item: GistvisSpec) => JSX.Element } =
  {
    noType: (item: GistvisSpec) => <PlainTextRenderer gistvisSpec={item} />,
    comparison: (item: GistvisSpec) => <PlainTextRenderer gistvisSpec={item} />,
    trend: (item: GistvisSpec) => <PlainTextRenderer gistvisSpec={item} />,
    rank: (item: GistvisSpec) => <PlainTextRenderer gistvisSpec={item} />,
    proportion: (item: GistvisSpec) => (
      <ProportionTextRenderer gistvisSpec={item} />
    ),
    anomoly: (item: GistvisSpec) => <PlainTextRenderer gistvisSpec={item} />,
    extreme: (item: GistvisSpec) => <PlainTextRenderer gistvisSpec={item} />,
    value: (item: GistvisSpec) => <PlainTextRenderer gistvisSpec={item} />,
  };

export const DesignSpace = () => {
  const sampleArticle: GistvisSpec[] = [
    {
      id: "1",
      paragraphSpec: {
        insightType: "noType",
        paragraphIdx: 1,
        segmentIdx: 1,
        context: "This is a sample paragraph.",
      },
    },
    {
      id: "2",
      paragraphSpec: {
        insightType: "proportion",
        paragraphIdx: 2,
        segmentIdx: 1,
        context: "The percentage of the sales of BYD is 30%, while the rest of the top 5 companies only consist of 25%.",
      },
      dataSpec: [{
        categoryKey: "the category of sales",
        categoryValue: "BYD",
        valueKey: "the sales percentage",
        valueValue: 0.3,
      },{
        categoryKey: "the category of sales",
        categoryValue: "the rest of the top 5 companies",
        valueKey: "the sales percentage",
        valueValue: 0.25,
      }]
    },
  ];

  return (
    <div>
      {sampleArticle.map((item) => {
        const renderFunction =
          renderMap[item.paragraphSpec.insightType as InsightType];
        return renderFunction ? renderFunction(item) : null;
      })}
    </div>
  );
};
