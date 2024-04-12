import * as d3 from "d3";
import React, { useRef, useEffect } from "react";

const Extremechart = ({ option, attribute }) => {
  const myRef = useRef(null);
  const margin = { top: 0, right: 0, bottom: 0, left: 0 };
  const heightVis = option.height - margin.top - margin.bottom;
  const widthVis = 40;

  useEffect(() => {
    const svg = d3
      .select(myRef.current)
      .append("svg")
      .attr("width", widthVis)
      .attr("height", heightVis)
      .style("position", "relative")
      .attr("class", "extremeChart")
      .style("overflow", "visible");

    if (attribute === "maximum") {
      svg
        .append("path")
        .attr("d", "M 5 25 L 10 10 L 15 25 Z")
        .style("fill", "red");

      svg
        .append("line")
        .attr("x1", 2)
        .attr("y1", 10)
        .attr("x2", 18)
        .attr("y2", 10)
        .style("stroke", "red")
        .style("stroke-width", 2);

      svg
        .append("line")
        .attr("x1", 10)
        .attr("y1", 10)
        .attr("x2", 10)
        .attr("y2", 35)
        .style("stroke", "red")
        .style("stroke-width", 2);

      svg
        .append("text")
        .attr("x", 15)
        .attr("y", 35)
        .style("font-size", "12px")
        .style("fill", "red")
        .style("font-weight", "bold")
        .text("max");
    }

    if (attribute === "minimum") {
      svg
        .append("path")
        .attr("d", "M 5 20 L 10 35 L 15 20 Z")
        .style("fill", "green");

      svg
        .append("line")
        .attr("x1", 2)
        .attr("y1", 35)
        .attr("x2", 18)
        .attr("y2", 35)
        .style("stroke", "green")
        .style("stroke-width", 2);

      svg
        .append("line")
        .attr("x1", 10)
        .attr("y1", 10)
        .attr("x2", 10)
        .attr("y2", 35)
        .style("stroke", "green")
        .style("stroke-width", 2);

      svg
        .append("text")
        .attr("x", 15)
        .attr("y", 15)
        .style("font-size", "12px")
        .style("fill", "green")
        .style("font-weight", "bold")
        .text("min");
    }
  }, []);

  return (
    <span
      style={{ width: option.width, height: option.height }}
      ref={myRef}
    ></span>
  );
};

export default Extremechart;
