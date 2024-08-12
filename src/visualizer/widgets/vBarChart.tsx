import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { SVG_WIDTH, SVG_HEIGHT, SVG_UNIT_WIDTH } from "../constants";
import { ChartProps, DataSpec, InsightType } from "../types";
import { Tooltip } from "antd";
import { HorizontalStackedBarProps } from "../props";

const VerticalBarChart = ({
  gistvisSpec,
  colorScale,
  selectedEntity,
  setSelectedEntity,
}: ChartProps) => {
  const dataSpec = gistvisSpec.dataSpec ?? [];

  const verticalBarChartWidth = SVG_UNIT_WIDTH * dataSpec.length;

  const datasetMap: { [key in InsightType]?: number[] } = {
    rank: dataSpec.map((d: DataSpec) => dataSpec.length + 1 - d.valueValue),
    comparison: dataSpec.map((d: DataSpec) => d.valueValue),
  };

  const dataset = datasetMap[gistvisSpec.unitSegmentSpec.insightType] ?? [];

  const xScale = d3
    .scaleLinear()
    .domain([0, dataset.length])
    .range([0, verticalBarChartWidth]);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset) ?? 1])
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
        y={yScale(dataset[i])}
        width={SVG_UNIT_WIDTH}
        height={SVG_HEIGHT - yScale(dataset[i])}
        fill={
          d.categoryValue !== "placeholder"
            ? colorScale(d.categoryValue)
            : "grey"
        }
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

  const getToolTipContent = () => {
    if (selectedEntity === "placeholder") {
      return (
        <div
          style={{
            lineHeight: 1.1,
            fontSize: "14px",
            color: "grey",
            fontWeight: "bold",
          }}
        >
          Rank
        </div>
      );
    } else if (gistvisSpec.unitSegmentSpec.insightType === "rank") {
      let rank = dataSpec.filter((d) => d.categoryValue === selectedEntity)[0]
        ?.valueValue;
      if (rank === undefined) {
        return (
          <div
            style={{
              lineHeight: 1.1,
              fontSize: "14px",
              color: "grey",
              fontWeight: "bold",
            }}
          >
            Rank
          </div>
        );
      }
      return (
        <div
          style={{
            lineHeight: 1.1,
            fontSize: "14px",
            color: colorScale(selectedEntity),
            fontWeight: "bold",
          }}
        >
          {"Rank " +
            dataSpec.filter((d) => d.categoryValue === selectedEntity)[0]
              ?.valueValue +
            ": " +
            selectedEntity}
        </div>
      );
    } else if (gistvisSpec.unitSegmentSpec.insightType === "comparison") {
      const refCase = dataSpec[0];
      const currentCase =
        dataSpec.find((d) => d.categoryValue === selectedEntity) ?? refCase;
      const diff = Math.abs(refCase.valueValue - currentCase.valueValue);
      return (
        <div
          style={{
            lineHeight: 1.1,
            fontSize: "14px",
            color: "black",
            fontWeight: "bold",
          }}
        >
          The difference between{" "}
          <span style={{ color: colorScale(refCase.categoryValue) }}>
            {refCase.categoryValue}
          </span>{" "}
          and {" "}
          <span style={{ color: colorScale(selectedEntity) }}>
            {selectedEntity}
          </span>{" "}
          is {diff}.
        </div>
      );
    }
  };

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
