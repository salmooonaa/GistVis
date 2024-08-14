import * as d3 from "d3";
import React, { useRef, useEffect } from "react";

const Barchart = ({ option, text, highLIndex, rankrange, delta }) => {
  let className = "text";
  if (highLIndex === 1) {
    className = "neg_text";
  }
  if (highLIndex === 0) {
    className = "pos_text";
  }
  const myRef = useRef(null);
  const barWidth = 6;
  const dataset = option.data;
  const newData = dataset;
  const newLength = Math.floor(option.width / barWidth);
  if (newLength < dataset.length) {
    newData = dataset.slice(0, newLength);
  }
  const margin = { top: 0, right: 0, bottom: 0, left: 0 };
  // const widthVis = options.width - margin.left - margin.right;
  const heightVis = option.height - margin.top - margin.bottom;
  const newWidth =
    typeof delta === "undefined"
      ? newData.length * barWidth
      : newData.length * barWidth + 25;
  const highlightIndex = highLIndex;

  useEffect(() => {
    const svg = d3
      .select(myRef.current)
      .append("svg")
      .attr("width", newWidth)
      .attr("height", heightVis)
      .style("position", "relative")
      .attr("class", "barChart")
      .style("overflow", "visible");

    const yMin = d3.min(newData);
    const yMax = d3.max(newData);
    const yPadding = (yMax - yMin) * 0.25;

    const y = d3
      .scaleLinear()
      .domain([yMin - yPadding, yMax + yPadding])
      .range([0, heightVis]);

    const bar = svg.selectAll("g.bar").data(newData);

    // const gBar = bar.enter().append('g')
    //   .attr('class', 'bar')
    //   .attr('transform', function(d, i) { return 'translate(' + i * barWidth + ',' + (heightVis - y(d)) + ')'; });

    const gBar = bar
      .enter()
      .append("g")
      .attr("class", function (d, i) {
        return highlightIndex !== undefined && i === highlightIndex
          ? "bar highlight-bar"
          : "bar";
      })
      .attr("transform", function (d, i) {
        return "translate(" + i * barWidth + "," + (heightVis - y(d)) + ")";
      });

    gBar
      .append("rect")
      .attr("width", barWidth - 2)
      .attr("height", function (d) {
        return y(d);
      })
      .style("fill", function (d, i) {
        return highlightIndex !== undefined && i === highlightIndex
          ? "red"
          : "black";
      });
    // .style('fill', 'steelblue')

    gBar
      .append("text")
      .attr("x", (barWidth - 2) / 2)
      .attr("font-weight", "bold")
      .attr("y", function (d) {
        return y(d) + 3;
      })
      .attr("dy", ".75em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text(function (d, i) {
        if (
          highlightIndex !== undefined &&
          typeof rankrange !== "undefined" &&
          rankrange.length > 0 &&
          i === highlightIndex
        ) {
          return rankrange[i];
        } else {
          return "";
        }
      });

    if (typeof delta !== "undefined") {
      const x_right = (newData.length - 1) * barWidth + barWidth / 2;
      const maxIndex = newData.indexOf(Math.max(...newData));
      const minIndex = newData.indexOf(Math.min(...newData));
      const x1 = (maxIndex-1) * barWidth + barWidth / 2;
      const y1 = heightVis - y(Math.max(...newData));
      const x2 = (minIndex - 1) * barWidth + barWidth / 2;
      const y2 = heightVis - y(Math.min(...newData));
      svg
        .append("line")
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x_right + 5)
        .attr("y2", y1)
        .attr("stroke", "black")
        .attr("stroke-width", 0.5);

      svg
        .append("line")
        .attr("x1", x2)
        .attr("y1", y2)
        .attr("x2", x_right + 5)
        .attr("y2", y2)
        .attr("stroke", "black")
        .attr("stroke-width", 0.5);

      const centerX = (x1 + x2) / 2;
      const centerY = (y1 + y2) / 2;

      svg
        .append("defs")
        .append("marker")
        .attr("id", "arrowhead-top")
        .attr("markerWidth", 6)
        .attr("markerHeight", 4)
        .attr("refX", 1)
        .attr("refY", 2)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,2 L6,4 L6,0 Z")
        .attr("fill", "red");

      svg
        .append("defs")
        .append("marker")
        .attr("id", "arrowhead-bottom")
        .attr("markerWidth", 6)
        .attr("markerHeight", 4)
        .attr("refX", 5)
        .attr("refY", 2)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,0 L0,4 L6,2 Z")
        .attr("fill", "red");

      svg
        .append("line")
        .attr("x1", x_right + 4)
        .attr("y1", y1)
        .attr("x2", x_right + 4)
        .attr("y2", y2)
        .attr("stroke", "red")
        .attr("stroke-width", 1)
        .attr("marker-start", "url(#arrowhead-top)")
        .attr("marker-end", "url(#arrowhead-bottom)");
      svg
        .append("text")
        .attr("x", x_right + 8)
        .attr("y", centerY + 5)
        .style("font-size", "12px")
        .style("fill", "red")
        .style("font-weight", "bold")
        .text(option.delta);
    }

    bar.merge(gBar).attr("transform", function (d, i) {
      return "translate(" + i * barWidth + "," + (heightVis - y(d)) + ")";
    });

    bar
      .merge(gBar)
      .select("rect")
      .attr("height", function (d) {
        return y(d);
      });

    bar.exit().remove();
  }, []);
  const newtext = text !== undefined ? text : "";
  return (
    <span>
      <span className={className}>{text}</span>
      <span
        style={{ width: option.width, height: option.height }}
        ref={myRef}
      ></span>
    </span>
  );
};

export default Barchart;
