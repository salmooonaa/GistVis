import React, { useRef, useState, useEffect } from "react";
import {
  DataPoint,
  DataSpec,
  DisplaySpec,
  EntitySpec,
  GistvisSpec,
  TrendAttribute,
} from "../types";
import * as d3 from "d3";
import _ from "lodash";
import HoverText from "../widgets/hoverText";
import { LineChart } from "../wordScaleVis/chartList";
import {
  getHighlightPos,
  getProductionVisSpec,
  getUniqueEntities,
} from "../utils/postProcess";

const dummyDataMap: { [key in TrendAttribute]: DataSpec[] } = {
  positive: [
    {
      categoryKey: "positive values",
      categoryValue: "1",
      valueKey: "entry",
      valueValue: 1,
    },
    {
      categoryKey: "positive values",
      categoryValue: "1",
      valueKey: "entry",
      valueValue: 6,
    },
    {
      categoryKey: "positive values",
      categoryValue: "1",
      valueKey: "entry",
      valueValue: 20,
    },
    {
      categoryKey: "positive values",
      categoryValue: "1",
      valueKey: "entry",
      valueValue: 40,
    },
    {
      categoryKey: "positive values",
      categoryValue: "1",
      valueKey: "entry",
      valueValue: 80,
    },
  ],
  negative: [
    {
      categoryKey: "positive values",
      categoryValue: "1",
      valueKey: "entry",
      valueValue: 80,
    },
    {
      categoryKey: "positive values",
      categoryValue: "1",
      valueKey: "entry",
      valueValue: 40,
    },
    {
      categoryKey: "positive values",
      categoryValue: "1",
      valueKey: "entry",
      valueValue: 20,
    },
    {
      categoryKey: "positive values",
      categoryValue: "1",
      valueKey: "entry",
      valueValue: 6,
    },
    {
      categoryKey: "positive values",
      categoryValue: "1",
      valueKey: "entry",
      valueValue: 1,
    },
  ],
};

const TrendTextRenderer = ({ gistvisSpec }: { gistvisSpec: GistvisSpec }) => {
  const [currentEntity, setCurrentEntity] = useState<string>("");
  const dataSpec = gistvisSpec.dataSpec ?? [];
  const attribute = gistvisSpec.unitSegmentSpec.attribute as TrendAttribute ?? "";

  const entityPos: EntitySpec[] = getHighlightPos(gistvisSpec, "entity");
  const uniqueEntities = getUniqueEntities(entityPos);

  const vis = getProductionVisSpec(
    gistvisSpec.unitSegmentSpec.context,
    entityPos
  );

  const colorScale = d3
    .scaleOrdinal(d3.schemeCategory10)
    .domain(uniqueEntities);

  const hasNaN = dataSpec.some((d) => isNaN(d.valueValue));
  const numEntries = dataSpec.length;
  const validForNominalTrend =
    attribute === "negative" || attribute === "positive";
  const lineChartType = (validForNominalTrend && (hasNaN || numEntries < 2)) ? "nominal" : "actual";

  const transformData = (): DataSpec[] => {
    if (lineChartType === "nominal") {
      return dummyDataMap[attribute];
    } else {
      return dataSpec;
    }
  };

  const dataset = transformData();
  gistvisSpec.dataSpec = dataset;

  const lineVis = (
    <LineChart
      gistvisSpec={gistvisSpec}
      type={lineChartType}
      colorScale={colorScale}
      selectedEntity={currentEntity}
      setSelectedEntity={setCurrentEntity}
    />
  );

  return (
    <span>
      {vis.map((content, index) => {
        if (content.displayType === "text") {
          return <span key={index}>{content.content}</span>;
        } else if (content.displayType === "entity") {
          return (
            <HoverText
              key={index}
              text={content.content}
              isHovered={content.entity === currentEntity}
              color={colorScale(content.entity ?? "grey")}
              onMouseOver={() => {
                setCurrentEntity(content.entity ?? "");
              }}
              onMouseOut={() => {
                setCurrentEntity("");
              }}
            />
          );
        } else if (content.displayType === "word-scale-vis") {
          return (
            <span key={index}>
              {content.content}
              {lineVis}
            </span>
          );
        }
      })}
    </span>
  );
};

export default TrendTextRenderer;
