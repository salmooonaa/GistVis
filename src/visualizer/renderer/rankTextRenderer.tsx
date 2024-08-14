import React, { useRef, useState, useEffect } from "react";
import { DataSpec, DisplaySpec, EntitySpec, ExtendedDataSpec, GistvisSpec } from "../types";
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

const RankTextRenderer = ({
  gistvisSpec,
}: {
  gistvisSpec: GistvisSpec;
}) => {
  const [currentEntity, setCurrentEntity] = useState<string>("");

  // check entity counts in the dataSpec, if less than 3, add dummy data
  let dataSpec: DataSpec[] = gistvisSpec.dataSpec ? gistvisSpec.dataSpec.map((item) => ({ ...item, entrySource: "extracted" })) : [];
  if (dataSpec.length < 3 && dataSpec.length > 0) {
    for (let i = dataSpec.length; i < 3; i++) {
      dataSpec.push({
        categoryKey: dataSpec[i - 1].categoryKey,
        categoryValue: "placeholder",
        valueKey: dataSpec[i - 1].valueKey,
        valueValue: i + 1, // rank
      })
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

export default RankTextRenderer;
