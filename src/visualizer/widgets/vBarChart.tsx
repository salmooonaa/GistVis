import React from "react";
import * as d3 from "d3";
import { SVG_WIDTH, SVG_HEIGHT, SVG_UNIT_WIDTH } from "../constants";
import { ChartProps, DataSpec } from "../types";
import { Tooltip } from "antd";
import { HorizontalStackedBarProps } from "../props";

const VerticalBarChart = ({
  gistvisSpec,
  colorScale,
  selectedEntity,
  setSelectedEntity,
}: ChartProps) => {
  const dataSpec = gistvisSpec.dataSpec ?? []

  const verticalBarChartWidth = SVG_UNIT_WIDTH * dataSpec.length;

  const dummyRankData = dataSpec.map((d: DataSpec) => (dataSpec.length + 1 - d.valueValue))
  
  const xScale = d3.scaleLinear()
    .domain([0, dummyRankData.length]).range([0, verticalBarChartWidth]);
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(dummyRankData) ?? 1])
    .range([SVG_HEIGHT, 0]);

  const knownCategories = dataSpec.map((d: DataSpec, i: number) => {
    const hoverStyle = {
      opacity: d.categoryValue === selectedEntity ? 1 : 0.5,
      transition: "opacity 0.3s",
    };
  return (
    <rect
      key={d.categoryValue}
      x={xScale(i)}
      y={yScale(dummyRankData[i])}
      width={SVG_UNIT_WIDTH}
      height={SVG_HEIGHT - yScale(dummyRankData[i])}
      fill={colorScale(d.categoryValue)}
      style={hoverStyle}
      onMouseOver={() => {
        setSelectedEntity(d.categoryValue);
      }}
      onMouseOut={() => {
        setSelectedEntity("");
      }}
    />
  );
  });

  const getToolTipContent = () => (
    <div style={{ lineHeight: 1.1, fontSize: "14px" }}>
      <div style={{ color: colorScale(selectedEntity), fontWeight: "bold" }}>
        {"Rank " + dataSpec.filter((d) => d.categoryValue === selectedEntity)[0]?.valueValue + ": " + selectedEntity}
      </div>
    </div>
  );

  const visElement = (
    <Tooltip title={getToolTipContent()} placement="bottom" color="#ffffff">
      <svg height={SVG_HEIGHT} width={verticalBarChartWidth}>
        {knownCategories && [...knownCategories]}
      </svg>
    </Tooltip>
  );

  return <>{visElement}</>;
};

export default VerticalBarChart;
