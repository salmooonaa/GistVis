import React from "react";
import * as d3 from "d3";
import { SVG_WIDTH, SVG_HEIGHT } from "../constants";
import { DataSpec } from "../types";
import { Tooltip } from "antd";
import { HorizontalStackedBarProps } from "../props";

const HorizontalStackedBar = ({
  dataSpec,
  colorScale,
  selectedEntity,
  setSelectedEntity,
}: HorizontalStackedBarProps) => {
  const xScale = d3.scaleLinear().domain([0, 1]).range([0, SVG_WIDTH]);
  let curSum = 0;
  const knownCategories = dataSpec.map((d: DataSpec, i: number) => {
    let thisPos = xScale(curSum);
    curSum += d.valueValue;
    const hoverStyle = {
      opacity: d.categoryValue === selectedEntity ? 1 : 0.5,
      transition: "opacity 0.3s",
    };
    return (
      <rect
        key={d.categoryValue}
        x={thisPos}
        y={SVG_HEIGHT * 0.2}
        width={xScale(d.valueValue)}
        height={SVG_HEIGHT * 0.8}
        fill={colorScale(d.categoryValue)}
        style={hoverStyle}
        // onClick={() => setCurrentEntity(d.categoryValue)}
        onMouseOver={() => {
          setSelectedEntity(d.categoryValue);
        }}
        onMouseOut={() => {
          setSelectedEntity("");
        }}
      />
    );
  });

  const unknownCategories = (
    <rect
      x={xScale(curSum)}
      y={SVG_HEIGHT * 0.2}
      width={SVG_WIDTH - xScale(curSum)}
      height={SVG_HEIGHT * 0.8}
      style={{ opacity: 0.5 }}
      fill="grey"
      // onClick={() => setCurrentEntity("unknown")}
    />
  );

  const toolTipContent = (
    <div style={{ lineHeight: 1.1, fontSize: "14px" }}>
      <div style={{ color: "#000000", fontWeight: "bold" }}>
        {dataSpec[0].categoryKey.charAt(0).toUpperCase() +
          dataSpec[0].categoryKey.slice(1)}
      </div>

      {dataSpec.map((d: DataSpec) => (
        <div
          key={d.categoryValue}
          style={{
            color: colorScale(d.categoryValue),
            fontSize: "14px",
          }}
        >
          ● {d.valueValue.toFixed(2)}
        </div>
      ))}
      <div
        key={"rest"}
        style={{
          color: "grey",
          fontSize: "14px",
        }}
      >
        ● {(1 - curSum).toFixed(2)}
      </div>
    </div>
  );

  const visElement = (
    <Tooltip title={toolTipContent} placement="bottom" color="#ffffff">
      <svg height={SVG_HEIGHT} width={SVG_WIDTH}>
        {knownCategories && [...knownCategories, unknownCategories]}
      </svg>
    </Tooltip>
  );

  return <>{visElement}</>;
};

export default HorizontalStackedBar;