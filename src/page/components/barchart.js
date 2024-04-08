import * as d3 from 'd3'
import React, { useRef , useEffect } from 'react'

const Barchart = ({option, text, highLIndex, rankrange}) =>{
  let className = 'pos_text'
  if (highLIndex===1) {className = 'neg_text'}
  const myRef = useRef(null);
  const barWidth = 6;
  const dataset = option.data;
  const newData = dataset;
  const newLength = Math.floor(option.width/barWidth);
  if (newLength < dataset.length) {
	  newData = dataset.slice(0,newLength);
  }
  const margin = {top: 0, right: 0, bottom: 0, left: 0};
  // const widthVis = options.width - margin.left - margin.right;
  const heightVis = option.height - margin.top - margin.bottom;
  const newWidth = newData.length*barWidth
  const highlightIndex = highLIndex !== undefined ? highLIndex : 0;

  useEffect(() => {
    const svg = d3.select(myRef.current)
      .append("svg")          
      .attr("width", newWidth)       
      .attr("height", heightVis)
      .style('position', 'relative')
      .attr('class', 'barChart')
      .style('overflow', 'visible');

    const yMin = d3.min(newData);
    const yMax = d3.max(newData);
    const yPadding = (yMax - yMin) * 0.25; 

    const y = d3.scaleLinear()
      .domain([yMin - yPadding, yMax + yPadding])
      .range([0, heightVis]);

    const bar = svg.selectAll('g.bar')
      .data(newData);

    // const gBar = bar.enter().append('g')
    //   .attr('class', 'bar')
    //   .attr('transform', function(d, i) { return 'translate(' + i * barWidth + ',' + (heightVis - y(d)) + ')'; });
      
    const gBar = bar.enter().append('g')
      .attr('class', function(d, i) { return i === highlightIndex ? 'bar highlight-bar' : 'bar'; })
      .attr('transform', function(d, i) { return 'translate(' + i * barWidth + ',' + (heightVis - y(d)) + ')'; });

    gBar.append('rect')
      .attr('width', barWidth - 2)
      .attr('height', function(d) { return y(d); })
      .style('fill', function(d, i) { return i === highlightIndex ? 'red' : 'black'; })
      // .style('fill', 'steelblue')
    
    gBar.append('text')
      .attr('x', (barWidth - 2) / 2)
      .attr('font-weight','bold')
      .attr('y', function(d) { return y(d) + 3; }) 
      .attr('dy', '.75em')
      .style('text-anchor', 'middle')
      .style('font-size', '12px') 
      .text(function(d, i) { 
        if (typeof rankrange !== 'undefined' && rankrange.length > 0 && i === highlightIndex) {
          return rankrange[i]; 
        } else {
          return ''; 
        }
      });
    
    if (highlightIndex < newData.length - 1) {
      const x1 = highlightIndex * barWidth + barWidth / 2;
      const y1 = heightVis - y(newData[highlightIndex]);
      const x2 = (highlightIndex + 1) * barWidth + barWidth / 2;
      const y2 = heightVis - y(newData[highlightIndex + 1]);

      svg.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .attr('marker-end', 'url(#arrowhead)');

      svg.append('marker')
        .attr('id', 'arrowhead')
        .attr('markerWidth', 10)
        .attr('markerHeight', 7)
        .attr('refX', 0)
        .attr('refY', 3.5)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,0 V7 L10,3.5 Z')
        .attr('fill', 'black');
    }

    bar.merge(gBar)
      .attr('transform', function(d, i) { return 'translate(' + i * barWidth + ',' + (heightVis - y(d)) + ')'; });

    bar.merge(gBar).select('rect')
      .attr('height', function(d) { return y(d); });
  
    bar.exit().remove();
    

  },[])

  return (
    <span>
      <span class={className}>{text}</span>
      <span style={{width: option.width, height:option.height }} ref={myRef}></span>
    </span>
  )
}

export default Barchart