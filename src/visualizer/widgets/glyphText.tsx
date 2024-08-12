import React from "react";
import * as d3 from "d3";
import { SVG_WIDTH, SVG_HEIGHT, SVG_UNIT_WIDTH } from "../constants";
import { ChartProps, DataSpec, ExtremeAttribute } from "../types";
import { Tooltip } from "antd";
import { HorizontalStackedBarProps } from "../props";

const GlyphText = ({
  gistvisSpec,
  colorScale,
  selectedEntity,
  setSelectedEntity,
}: ChartProps) => {
  const dataSpec = gistvisSpec.dataSpec ?? [];
  const highlightEntity = gistvisSpec.unitSegmentSpec.inSituPosition ?? [];

  const mainElement = highlightEntity
    .map((d: string, i: number) => {
      const hoverStyle = {
        opacity: d === selectedEntity ? 1 : 0.5,
        transition: "opacity 0.3s",
      };
      return (
        <span>{d}</span>
      );
    });

  const toolTipContent = (
    <div
      style={{
        lineHeight: 1.1,
        fontSize: "14px",
        color: "orange",
        fontWeight: "bold",
      }}
    >
      {dataSpec.find((d: DataSpec) => d.categoryValue === selectedEntity)?.categoryValue}
    </div>
  );

  const visElement = (
    <></>
    // <Tooltip title={toolTipContent} placement="bottom" color="#ffffff">
    //   <svg height={SVG_HEIGHT} width={SVG_UNIT_WIDTH}>
    //     {mainElement}
    //   </svg>
    // </Tooltip>
  );

  return <>{visElement}</>;
};

export default GlyphText;
