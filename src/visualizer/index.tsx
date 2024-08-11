import { ConfigProvider, Layout, Typography, Row, Col, Divider } from "antd";
import React, { useRef, useState } from "react";
import { GistvisSpec, InsightType, paragraphSpec } from "./types";
import {
  PlainTextRenderer,
  ProportionTextRenderer,
} from "./renderer/rendererList";
import TrendTextRenderer from "./renderer/trendTextRenderer";

const renderMap: { [key in InsightType]: (item: GistvisSpec) => JSX.Element } =
  {
    noType: (item: GistvisSpec) => <PlainTextRenderer gistvisSpec={item} />,
    comparison: (item: GistvisSpec) => <PlainTextRenderer gistvisSpec={item} />,
    trend: (item: GistvisSpec) => <TrendTextRenderer gistvisSpec={item} />,
    rank: (item: GistvisSpec) => <PlainTextRenderer gistvisSpec={item} />,
    proportion: (item: GistvisSpec) => (
      <ProportionTextRenderer gistvisSpec={item} />
    ),
    anomoly: (item: GistvisSpec) => <PlainTextRenderer gistvisSpec={item} />,
    extreme: (item: GistvisSpec) => <PlainTextRenderer gistvisSpec={item} />,
    value: (item: GistvisSpec) => <PlainTextRenderer gistvisSpec={item} />,
  };

export const DesignSpace = () => {
  const sampleArticle: paragraphSpec[] = [
    {
      paragraphIdx: 0,
      paragraphContent: [
        {
          id: "1",
          unitSegmentSpec: {
            insightType: "noType",
            paragraphIdx: 1,
            segmentIdx: 1,
            context:
              "Electric cars manufactures are competing hard in the global market.",
          },
        },
      ],
    },
    {
      paragraphIdx: 2,
      paragraphContent: [
        {
          id: "2",
          unitSegmentSpec: {
            insightType: "proportion",
            paragraphIdx: 2,
            segmentIdx: 1,
            context:
              "The percentage of the sales of BYD is 30%, while the rest of the top 5 companies only consist of 25%.",
          },
          dataSpec: [
            {
              categoryKey: "the category of sales",
              categoryValue: "BYD",
              valueKey: "the sales percentage",
              valueValue: 0.3,
            },
            {
              categoryKey: "the category of sales",
              categoryValue: "the rest of the top 5 companies",
              valueKey: "the sales percentage",
              valueValue: 0.25,
            },
          ],
        },
        {
          id: "3",
          unitSegmentSpec: {
            insightType: "trend",
            paragraphIdx: 2,
            segmentIdx: 2,
            context:
              "The sales of BYD have been steadily increasing over the past 5 years.",
            attribute: "positive",
          },
          dataSpec: [
            {
              categoryKey: "the category of sales",
              categoryValue: "BYD",
              valueKey: "the sales volumn",
              valueValue: NaN,
            },
          ],
        },
        {
          id: "4",
          unitSegmentSpec: {
            insightType: "trend",
            paragraphIdx: 2,
            segmentIdx: 3,
            context:
              "Specifically, the sales of BYD was 10k, 5k, 30k, 80k, and 50k respectively.",
            attribute: "positive",
          },
          dataSpec: [
            {
              categoryKey: "the category of sales",
              categoryValue: "BYD",
              valueKey: "the sales volumn",
              valueValue: 10000,
            },
            {
              categoryKey: "the category of sales",
              categoryValue: "BYD",
              valueKey: "the sales volumn",
              valueValue: 5000,
            },
            {
              categoryKey: "the category of sales",
              categoryValue: "BYD",
              valueKey: "the sales volumn",
              valueValue: 30000,
            },
            {
              categoryKey: "the category of sales",
              categoryValue: "BYD",
              valueKey: "the sales volumn",
              valueValue: 80000,
            },
            {
              categoryKey: "the category of sales",
              categoryValue: "BYD",
              valueKey: "the sales volumn",
              valueValue: 50000,
            },
          ],
        },
      ],
    },
    {
      paragraphIdx: 3,
      paragraphContent: [
        {
          id: "5",
          unitSegmentSpec: {
            insightType: "rank",
            paragraphIdx: 3,
            segmentIdx: 1,
            context:
              "Conversly, the top 5 seller for traditional NCE vehicles are Toyota, VW, Stellantis, Nissan and Geely.",
          },
          dataSpec: [
            {
              categoryKey: "seller",
              categoryValue: "Toyota",
              valueKey: "rank in top 5 sellers for traditional NCE vehicles",
              valueValue: 1,
            },
            {
              categoryKey: "seller",
              categoryValue: "VW",
              valueKey: "rank in top 5 sellers for traditional NCE vehicles",
              valueValue: 2,
            },
            {
              categoryKey: "seller",
              categoryValue: "Stellantis",
              valueKey: "rank in top 5 sellers for traditional NCE vehicles",
              valueValue: 3,
            },
            {
              categoryKey: "seller",
              categoryValue: "Nisssan",
              valueKey: "rank in top 5 sellers for traditional NCE vehicles",
              valueValue: 4,
            },
            {
              categoryKey: "seller",
              categoryValue: "Geely",
              valueKey: "rank in top 5 sellers for traditional NCE vehicles",
              valueValue: 5,
            },
          ],
        },
      ],
    },
  ];

  return (
    <div>
      {sampleArticle.map((para) => {
        return (
          <p key={para.paragraphIdx}>
            {para.paragraphContent.map((item) => {
              const renderFunction =
                renderMap[item.unitSegmentSpec.insightType as InsightType];
              return renderFunction ? renderFunction(item) : null;
            })}
          </p>
        );
      })}
    </div>
  );
};
