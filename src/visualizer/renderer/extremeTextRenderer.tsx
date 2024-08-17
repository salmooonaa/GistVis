import React, { useRef, useState, useEffect } from "react";
import { DataSpec, DisplaySpec, EntitySpec, GistvisSpec } from "../types";
import { SVG_HEIGHT, SVG_WIDTH } from "../constants";
import { fuzzySearch } from "../utils/fuzzySearch";
import * as d3 from "d3";
import _ from "lodash";
import HoverText from "../widgets/hoverText";
import { GlyphMaxMin, HorizontalStackedBarChart } from "../widgets/chartList";
import {
  getEntityPos,
  getInsituPos,
  getProductionVisSpec,
  getUniqueEntities,
} from "../utils/postProcess";

const ExtremeTextRenderer = ({
  gistvisSpec,
}: {
  gistvisSpec: GistvisSpec;
}) => {
  const [currentEntity, setCurrentEntity] = useState<string>("");
  const dataSpec = gistvisSpec.dataSpec ?? [];

  console.log(gistvisSpec);

  const inSituPos: EntitySpec[] = getInsituPos(gistvisSpec);
  const entityPos: EntitySpec[] = getEntityPos(gistvisSpec);
  const uniqueEntities = getUniqueEntities(entityPos);

  const vis = getProductionVisSpec(
    gistvisSpec.unitSegmentSpec.context,
    inSituPos,
    "right"
  );

  const colorScale = d3
    .scaleOrdinal(d3.schemeCategory10)
    .domain(uniqueEntities);

  const proportionVis = (
    <GlyphMaxMin
      gistvisSpec={gistvisSpec}
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
              {proportionVis}
            </span>
          );
        }
      })}
    </span>
  );
};

export default ExtremeTextRenderer;
