import React, { useRef, useState, useEffect } from "react";
import { DataSpec, DisplaySpec, EntitySpec, GistvisSpec } from "../types";
import { SVG_HEIGHT, SVG_WIDTH } from "../constants";
import { fuzzySearch } from "../utils/fuzzySearch";
import * as d3 from "d3";
import _ from "lodash";
import HoverText from "../widgets/hoverText";
import { HorizontalStackedBarChart, VerticalBarChart } from "../widgets/chartList";
import {
  getEntityPos,
  getProductionVisSpec,
  getUniqueEntities,
} from "../utils/postProcess";

const ComparisonTextRenderer = ({
  gistvisSpec,
}: {
  gistvisSpec: GistvisSpec;
}) => {
  const [currentEntity, setCurrentEntity] = useState<string>("");

  // check entity counts in the dataSpec, if 2 and one valueValue is 0, transform data for better visualization
  let dataSpec: DataSpec[] = gistvisSpec.dataSpec ?? [];
  if (dataSpec.length < 2) {
    console.warn("Not enough data entities to perform transformation.");
  } else if (dataSpec.length === 2) {
    const hasZeroValue = dataSpec.some((d) => d.valueValue === 0);
    if (hasZeroValue) {
      const maxValue = Math.max(...dataSpec.map((d) => d.valueValue));
      dataSpec = dataSpec.map((d) => ({
        ...d,
        valueValue: maxValue + d.valueValue,
      }))
    }
  }

  const gistvisSpecForVis = {
    ...gistvisSpec,
    dataSpec: dataSpec,
  }

  const entityPos: EntitySpec[] = getEntityPos(gistvisSpec);
  const uniqueEntities = getUniqueEntities(entityPos);

  const vis = getProductionVisSpec(
    gistvisSpec.unitSegmentSpec.context,
    entityPos
  );

  const colorScale = d3
    .scaleOrdinal(d3.schemeCategory10)
    .domain(uniqueEntities);

  const rankVis = (
    <VerticalBarChart
      gistvisSpec={gistvisSpecForVis}
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
              {rankVis}
            </span>
          );
        }
      })}
    </span>
  );
};

export default ComparisonTextRenderer;
