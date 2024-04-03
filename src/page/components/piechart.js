import * as d3 from 'd3'
import React, { useRef , useEffect } from 'react'

const Piechart = ({option, text, highLIndex}) => {
    const myRef = useRef(null);
	const margin = {top: 0, right: 0, bottom: 0, left: 0};
	const widthVis = option.width - margin.left - margin.right;
	const heightVis = option.height - margin.top - margin.bottom;
	const radius = Math.min(widthVis, heightVis) / 2;
    const newWidth = 2*radius

	const color = d3.scaleOrdinal()
    	.range(["#1f78b4","#a6cee3", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c"]);

	const newData = option.data;
	if (option.data.length > 6) {
		newData = option.data.slice(0,6);
	}

    console.log(newData)

    useEffect(() => {
        const arc = d3.arc()
            .outerRadius(radius - 2)
            .innerRadius(0);
    
        const pie = d3.pie()
            .sort(null)
            .value(function(d) { return d; });
        
        const sparkContainer = d3.select(myRef.current);
        sparkContainer.append('svg');
        
        const chart = sparkContainer.select('svg')
            .style('position', 'relative')
            .attr('width', newWidth)
            .attr('height', heightVis);
        
        const gChart = chart.append('g')
            .attr('transform', 'translate(' + newWidth / 2 + ',' + heightVis / 2 + ')');
        
        const g = gChart.selectAll('.arc')
            .data(pie(newData))
            .enter().append('g')
            .attr('class', 'arc');
        
        g.append('path')
            .attr('d', arc)
            .style("fill", function(d, i) { return color(i); });
        

    },[])

    return (
        <span>
          <span class='r_text'>{text}</span>
          <span style={{width: option.width, height:option.height }} ref={myRef}></span>
        </span>
    )
}

export default Piechart