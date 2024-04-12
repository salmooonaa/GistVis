import * as d3 from "d3";
import React, { useRef, useEffect } from "react";

const line = ({ options, myRef, type, centerValue }) => {
  const circleRadius = 3;
  const dataset = options.data;
  const margin = { top: 0, right: 0, bottom: 0, left: 0 };
  const widthVis =
    type === "sparkline" ? options.width - margin.left - margin.right : 50;
  const heightVis = options.height - margin.top - margin.bottom;

  const svg = d3
    .select(myRef.current)
    .append("svg")
    .attr("width", widthVis)
    .attr("height", heightVis)
    .style("position", "relative")
    .style("overflow", "visible");

  const x = d3
    .scaleLinear()
    .domain([0, dataset.length - 1])
    .range([0, widthVis - circleRadius]);

  const y = d3
    .scaleLinear()
    .domain([d3.min(dataset, (d) => d), d3.max(dataset, (d) => d)])
    .range([heightVis - circleRadius, circleRadius]);

  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y);

  const line = d3
    .line()
    .x((d, i) => x(i))
    .y((d) => y(d));

  const gChart = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  gChart
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + heightVis + ")");

  gChart.append("g").attr("class", "y axis");

  if (type === "sparkline") {
    gChart
      .append("path")
      .datum(dataset)
      .attr("class", "sparkline")
      .attr("d", line)
      .style("fill", "none")
      .style("stroke", "grey")
      .style("stroke-width", "2px");

    gChart
      .append("circle")
      .style("fill", "red")
      .attr("r", circleRadius)
      .attr("cx", x(dataset.length - 1))
      .attr("cy", y(dataset[dataset.length - 1]));
  } else {
    gChart
      .append("svg:defs")
      .append("svg:marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 8)
      .attr("markerWidth", 4)
      .attr("markerHeight", 4)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .style("fill", "red");

    gChart
      .append("path")
      .datum(dataset)
      .attr("class", "sparkline")
      .attr("d", line)
      .attr("font-weight", "bold")
      .style("fill", "none")
      .style("stroke", "grey")
      .style("stroke-width", "2px")
      .attr("marker-end", "url(#arrow)");

    if (centerValue !== undefined) {
      gChart
        .append("text")
        .attr("class", "center-text")
        .attr("x", widthVis / 2)
        .attr("y", 35)
        .attr("dy", "0.35em")
        .style("font-size", "12px")
        .style("text-anchor", "middle")
        .text(centerValue);
    }
  }
};

const Sparkline = ({ options, text }) => {
  const myRef = useRef(null);

  useEffect(() => {
    line({ options, myRef, type: "sparkline" });
  }, []);

  return (
    <span>
      <span className="r_text">{text}</span>
      <span
        style={{ width: options.width, height: options.height }}
        ref={myRef}
      ></span>
    </span>
  );
};

const Trend = ({ options, text, type, centerValue }) => {
  const myRef = useRef(null);
  let className = "pos_text";
  if (type === "negative-trend") {
    className = "neg_text";
  }
  useEffect(() => {
    line({ options, myRef, type, centerValue });
  }, []);

  return (
    <span>
      <span className={className}>{text}</span>
      <span
        style={{ width: options.width, height: options.height }}
        ref={myRef}
      ></span>
    </span>
  );
};

export { Sparkline, Trend };
