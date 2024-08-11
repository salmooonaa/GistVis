import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import {
  SVG_WIDTH,
  SVG_HEIGHT,
  SVG_PADDING,
  SCALE_CONST,
  SVG_UNIT_WIDTH,
} from "../constants";
import { ChartProps, DataPoint, DataSpec, GistvisSpec, TrendAttribute } from "../types";
import { Tooltip } from "antd";
import { capitalizeFirstLetter } from "../utils/helpers";

const Line = ({
  gistvisSpec,
  colorScale,
  selectedEntity,
  setSelectedEntity,
}: ChartProps) => {
  const dataSpec = gistvisSpec.dataSpec ?? [];
  const direction =
    (gistvisSpec.unitSegmentSpec.attribute as TrendAttribute) ?? "";
  // check is there is NaN in dataSpec valueValue
  const hasNaN = dataSpec.some((d) => isNaN(d.valueValue));
  const svgRef = React.useRef<SVGSVGElement>(null);
  const lineChartWidth = hasNaN
    ? SVG_UNIT_WIDTH * 5
    : SVG_UNIT_WIDTH * dataSpec.length;
  const lineChartHeight = SVG_HEIGHT;

  const transformData = (): DataPoint[] => {
    if (hasNaN) {
      const dummyDataMap: { [key in TrendAttribute]: DataPoint[] } = {
        positive: [
          { x: 1, y: 1 },
          { x: 2, y: 6 },
          { x: 3, y: 20 },
          { x: 4, y: 40 },
          { x: 5, y: 80 },
        ],
        negative: [
          { x: 1, y: 80 },
          { x: 2, y: 40 },
          { x: 3, y: 20 },
          { x: 4, y: 6 },
          { x: 5, y: 1 },
        ],
      };
      return dummyDataMap[direction];
    } else {
      return dataSpec.map((d, i) => ({ x: i, y: d.valueValue } as DataPoint));
    }
  };

  const dataset = transformData();

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, (d) => d.x) as [number, number])
    .range([SVG_PADDING, lineChartWidth - SVG_PADDING]);
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, (d) => d.y) as [number, number])
    .range([lineChartHeight - SVG_PADDING, SVG_PADDING]);

  const lineGenerator = d3
    .line<{ x: number; y: number }>()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y));

  const areaGenerator = d3
    .area<{ x: number; y: number }>()
    .x((d) => xScale(d.x))
    .y1((d) => yScale(d.y))
    .y0(yScale(0));

  const getTooltipContnet = (selectionVal: number | null) => {
    if (hasNaN) {
      return (
        <div
          style={{ lineHeight: 1.1, fontSize: "14px", color: `${lineColor}`, fontWeight: "bold" }}
        >
          {gistvisSpec.unitSegmentSpec.attribute === "positive"
            ? "↗ increasing"
            : "↘ decreasing"}
        </div>
      );
    } else {
      return (
        <div
          style={{
            lineHeight: 1.1,
            fontSize: "14px",
            color: `${lineColor}`,
            fontWeight: "bold",
          }}
        >
          {capitalizeFirstLetter(dataSpec[0].valueKey) +
            " of " +
            dataSpec[0].categoryValue +
            ": " +
            selectionVal}
        </div>
      );
    }
  };

  const [tooltip, setTooltip] = useState<any>(null);

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;

    // Calculate the position of the mouse relative to the SVG
    const rect = svg.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find the closest data point based on the x position
    const bisect = d3.bisector((d: DataPoint) => xScale(d.x)).center;
    const index = bisect(dataset, x);

    const closestPoint = dataset[index];
    setTooltip({
      x: xScale(closestPoint.x),
      y: yScale(closestPoint.y),
      value: closestPoint.y,
    });
  };

  const handleMouseOut = () => {
    setTooltip(null);
  };

  const zoomedStyle = {
    zoomedIn: {
      transform: `scale(${SCALE_CONST})`,
      transition: "transform 0.5s ease-in-out",
      transformOrigin: "top left",
      backgroundColor: "white",
    },
    normal: {
      transform: "scale(1)",
      transition: "transform 0.5s ease-in-out",
      transformOrigin: "top left",
    },
  };

  const [zoomedIn, setZoomedIn] = useState(false);

  const handleZoomIn = () => {
    setZoomedIn(true);
  };

  const handleZoomOut = () => {
    setZoomedIn(false);
  };

  const lineColor = hasNaN
    ? gistvisSpec.unitSegmentSpec.attribute === "positive"
      ? "green"
      : "red"
    : colorScale(dataSpec[0].categoryValue);

  return (
    <Tooltip
      title={tooltip != null ? getTooltipContnet(tooltip.value): ""}
      placement="bottom"
      color="#ffffff"
    >
      <svg
        ref={svgRef}
        width={lineChartWidth}
        height={SVG_HEIGHT}
        // style={zoomedIn ? zoomedStyle.zoomedIn : zoomedStyle.normal}
        // onMouseEnter={handleZoomIn}
        // onMouseLeave={handleZoomOut}
        onMouseMove={handleMouseMove}
        onMouseOut={handleMouseOut}
      >
        <path
          d={areaGenerator(dataset) || undefined}
          fill={`url(#${gistvisSpec.id}-areaGradient`}
        />
        <path
          d={lineGenerator(dataset) || undefined}
          fill="none"
          strokeWidth={1.5}
        />
        <defs>
          <linearGradient
            id={`${gistvisSpec.id}-areaGradient`}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0.2" />
          </linearGradient>
        </defs>

        <path
          d={lineGenerator(dataset) || undefined}
          fill="none"
          stroke={lineColor}
          strokeWidth={1}
        />
        {tooltip && (
          <circle
            cx={tooltip.x}
            cy={tooltip.y}
            r={2}
            fill="black"
            opacity={0.9}
          />
        )}
      </svg>
    </Tooltip>
  );
  // return <>{visElement}</>;
};

export default Line;
