import React, { useRef, useState, useEffect } from "react";
import { DataSpec, GistvisSpec } from "../types";
import { fuzzySearch } from "../utils/fuzzySearch";
import * as d3 from "d3";
import _ from "lodash";
import HoverText from "../widgets/hoverText";

type TextPosition = {
  start: number;
  end: number;
};

interface EntitySpec {
  entity: string;
  postion: TextPosition;
}

type DisplayType = "text" | "entity" | "word-scale-vis";
type DisplayPosition = "in-situ" | "overlay" | "right" | "none";

interface DisplaySpec {
  displayType: DisplayType;
  content: string;
  entity?: string;
  displayPosition?: DisplayPosition;
}

const ProportionTextRenderer = ({
  gistvisSpec,
}: {
  gistvisSpec: GistvisSpec;
}) => {
  const [currentEntity, setCurrentEntity] = useState<string>("");
  const [hoverIndex, setHoverIndex] = useState<number>(-1);

  const dataSpec = gistvisSpec.dataSpec ?? [];
  const entityPos: EntitySpec[] = dataSpec
    .map((d: DataSpec) => {
      const pos = fuzzySearch(
        d.categoryValue,
        gistvisSpec.paragraphSpec.context,
        false
      );
      // if position is multiple, then map
      const posArray = pos.map((p) => {
        return {
          entity: d.categoryValue,
          postion: {
            start: p[0],
            end: p[1],
          },
        };
      });
      return posArray;
    })
    .flat();

  const uniqueEntities = _.uniqBy(
    entityPos.map((d) => d.entity),
    "entity"
  );

  const svgWidth = 80;
  const svgHeight = 15;
  const xScale = d3.scaleLinear().domain([0, 1]).range([0, svgWidth]);
  const colorScale = d3
    .scaleOrdinal(d3.schemeCategory10)
    .domain(uniqueEntities);

  let curSum = 0;
  const knownCategories = dataSpec.map((d: DataSpec, i: number) => {
    let thisPos = xScale(curSum);
    curSum += d.valueValue;
    const hoverStyle = {
      opacity: d.categoryValue === currentEntity ? 1 : 0.5,
      transition: "opacity 0.3s",
    };
    return (
      <rect
        key={d.categoryValue}
        x={thisPos}
        y={0}
        width={xScale(d.valueValue)}
        height={svgHeight}
        fill={colorScale(d.categoryValue)}
        style={hoverStyle}
        // onClick={() => setCurrentEntity(d.categoryValue)}
        onMouseOver={() => {
          setCurrentEntity(d.categoryValue);
          setHoverIndex(i);
        }}
        onMouseOut={() => {
          setCurrentEntity("");
          setHoverIndex(-1);
        }}
      />
    );
  });

  const unknownCategories = (
    <rect
      x={xScale(curSum)}
      y={0}
      width={svgWidth - xScale(curSum)}
      height={svgHeight}
      style={{ opacity: 0.5 }}
      fill="grey"
      // onClick={() => setCurrentEntity("unknown")}
    />
  );

  const visElement = (
    <svg height={svgHeight} width={svgWidth}>
      {knownCategories && [...knownCategories, unknownCategories]}
    </svg>
  );

  const splitContent = (text: string, entityPos: EntitySpec[]) => {
    // Sort entityPos by start position using lodash
    const sortedEntityPos = _.sortBy(entityPos, ["postion.start"]);
    // Filter out overlapping entities using reduce
    const nonOverlappingEntities = sortedEntityPos.reduce(
      (acc: EntitySpec[], entity: EntitySpec) => {
        if (
          acc.length === 0 ||
          entity.postion.start >= acc[acc.length - 1].postion.end
        ) {
          return [...acc, entity];
        }
        return acc;
      },
      []
    );

    const contentArray: DisplaySpec[] = [];
    let lastEnd = 0;
    nonOverlappingEntities.forEach((entity) => {
      if (entity.postion.start > lastEnd) {
        contentArray.push({
          displayType: "text",
          content: text.slice(lastEnd, entity.postion.start),
        });
      }
      contentArray.push({
        displayType: "entity",
        content: text.slice(entity.postion.start, entity.postion.end + 1),
        entity: entity.entity,
      });
      lastEnd = entity.postion.end;
    });

    if (lastEnd < text.length) {
      contentArray.push({
        displayType: "text",
        content: text.slice(lastEnd, text.length - 1),
      });
      contentArray.push({
        displayType: "word-scale-vis",
        content: " ",
      });
      contentArray.push({
        displayType: "text",
        content: text.slice(text.length - 1),
      });
    }
    return contentArray;
  };

  const vis = splitContent(gistvisSpec.paragraphSpec.context, entityPos);

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
              color={colorScale(content.entity?? "grey")}
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
              {visElement}
            </span>
          );
        }
      })}
    </span>
  );
};

export default ProportionTextRenderer;
