import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const ChartArea = ({ data, chartType, xKey, yKey, zKey, groupKey, treeNameKey, treeValueKey, treeParentKey,  treeHierarchyKeys}) => {
  const chartRef = useRef(null);
  const tooltipRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 400
  });

  useEffect(() => {
    const updateDimensions = () => {
      if (chartRef.current) {
        const containerWidth = chartRef.current.clientWidth;
        console.log("Container Width:", containerWidth);
        setDimensions({
          width: containerWidth,
          height: 400
        });
      }
    };
    
    // Use ResizeObserver instead of just measuring once
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (chartRef.current) {
      resizeObserver.observe(chartRef.current);
    }
    
    // Initial measurement (might still be 0)
    updateDimensions();
    
    // Also handle window resize
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      if (chartRef.current) resizeObserver.unobserve(chartRef.current);
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);
  

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0 || dimensions.width === 0) return;
  
    // Clear previous contents
    d3.select(chartRef.current).selectAll('*').remove();
  
    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const estimatedWidthPerItem = 50; // Adjust as needed for spacing
    const isScrollableChart = ['bar', 'column', 'line', 'area', 'scatter', 'bubble', 'stackedbar', 'stackedbar100'].includes(chartType);
    const virtualWidth = isScrollableChart
      ? Math.max(dimensions.width, data.length * estimatedWidthPerItem)
      : dimensions.width;
  
    const scrollWrapper = d3
      .select(chartRef.current)
      .append('div')
      .style('overflow-x', isScrollableChart ? 'auto' : 'visible')
      .style('width', '100%');
  
    const svg = scrollWrapper
      .append('svg')
      .attr('width', virtualWidth)
      .attr('height', dimensions.height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
  
    const chartTitle = getChartTitle(chartType);
  
    svg.append("text")
      .attr("x", virtualWidth / 2)
      .attr("y", -margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-family", "sans-serif")
      .style("font-weight", "bold")
      .text(chartTitle);
  
    drawChart(chartType, svg, virtualWidth - margin.left - margin.right, dimensions.height - margin.top - margin.bottom * 1.5, data, d3.select(tooltipRef.current), margin, {
      xKey, yKey, zKey, groupKey, treeHierarchyKeys, treeValueKey, treeNameKey, treeParentKey
    });
  }, [data, chartType, xKey, yKey, zKey, groupKey, treeHierarchyKeys, treeValueKey, treeNameKey, treeParentKey, dimensions.width]);
  
  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;
  
    const svgNode = d3.select(chartRef.current).select('svg').node();
    const g = d3.select(svgNode).select('g');
  
    const zoomBehavior = d3.zoom()
      .scaleExtent([0.5, 5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
  
    d3.select(svgNode).call(zoomBehavior);
  
    // Zoom in/out button handlers
    const handleZoomIn = () => {
      d3.select(svgNode).transition().call(zoomBehavior.scaleBy, 1.2);
    };
  
    const handleZoomOut = () => {
      d3.select(svgNode).transition().call(zoomBehavior.scaleBy, 0.8);
    };
  
    // Expose the handlers
    window.handleZoomIn = handleZoomIn;
    window.handleZoomOut = handleZoomOut;
  
  }, [data, chartType, dimensions.width]);
  

  const getChartTitle = (type) => {
    const titles = {
      'bar': 'Bar Chart',
      'groupbar': 'Grouped Bar Chart',
      'line': 'Line Chart',
      'area': 'Area Chart',
      'pie': 'Pie Chart',
      'doughnut': 'Doughnut Chart',
      'stackedbar': 'Stacked Bar Chart',
      'stackedbar100': 'Stacked Bar Chart 100',
      'scatter': 'Scatter Plot',
      'bubble': 'Bubble Chart',
      'histogram': 'Histogram', 
      'boxplot': 'Box Plot',
      'heatmap': 'Heat Map',
      'calendarheatmap': 'Calendar Heat Map',
      'radar': 'Radar Chart',
      'treemap': 'Treemap Chart',
      'sunburst': 'Sunburst Chart',
      'stepline': 'Step Line Chart',
      'slope': 'Slope Chart',
      'violinplot': 'Violin Plot'
    };
    return titles[type] || `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`;
  };

  const generateBarChart = (svg, width, height, data, tooltip, margin) => {
    const xKeyUsed = xKey || Object.keys(data[0])[0];
    const yKeyUsed = yKey || Object.keys(data[0])[1];

    const xValues = data.map(d => d[xKeyUsed]);
    const yValues = data.map(d => +d[yKeyUsed]);
    
    // Set up scales
    const xScale = d3.scaleBand()
      .domain(xValues)
      .range([0, width])
      .padding(0.2);
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(yValues) * 1.1]) // Add 10% padding at the top
      .range([height, 0]);
    
    // Create bars with animation
    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => xScale(d[xKeyUsed]))
      .attr('y', height) // Start from bottom for animation
      .attr('width', xScale.bandwidth())
      .attr('height', 0) // Start with height 0 for animation
      .attr('fill', '#4caf50')
      .attr('opacity', 0.8)
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('opacity', 1)
          .attr('stroke', '#388e3c')
          .attr('stroke-width', 2);
          
        tooltip
          .style('opacity', 1)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px')
          .html(`<strong>${d[xKeyUsed]}</strong><br>${yKeyUsed}: ${d[yKeyUsed]}`);
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('opacity', 0.8)
          .attr('stroke', 'none');
          
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(800)
      .attr('y', d => yScale(+d[yKeyUsed]))
      .attr('height', d => height - yScale(+d[yKeyUsed]));
    
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em');
    
    svg.append('text')
      .attr('class', 'axis-title')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .text(xKeyUsed);
    
    svg.append('g')
      .call(d3.axisLeft(yScale));
    
    svg.append('text')
      .attr('class', 'axis-title')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -margin.left + 15)
      .text(yKeyUsed);
  };

  const generateGroupedBarChart = (svg, width, height, data, tooltip, margin, xKey, yKey, groupKey) => {
    if (!groupKey) {
      // Fallback to normal bar chart if no groupKey is provided
      generateBarChart(svg, width, height, data, tooltip, margin);
      return;
    }
  
    const groupedData = d3.group(data, d => d[groupKey]);
    const groups = Array.from(groupedData.keys());
    const xValues = Array.from(new Set(data.map(d => d[xKey])));
    const yValues = data.map(d => +d[yKey]);
  
    const xScale = d3.scaleBand()
      .domain(xValues)
      .range([0, width])
      .padding(0.2);
  
    const groupScale = d3.scaleBand()
      .domain(groups)
      .range([0, xScale.bandwidth()])
      .padding(0.1);
  
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(yValues) * 1.1])
      .range([height, 0]);
  
    const color = d3.scaleOrdinal(d3.schemeCategory10).domain(groups);
  
    groups.forEach(group => {
      const groupData = groupedData.get(group);
  
      svg.selectAll(`.bar-${group}`)
        .data(groupData)
        .enter()
        .append('rect')
        .attr('class', `bar-${group}`)
        .attr('x', d => xScale(d[xKey]) + groupScale(group))
        .attr('y', d => yScale(+d[yKey]))
        .attr('width', groupScale.bandwidth())
        .attr('height', d => height - yScale(+d[yKey]))
        .attr('fill', color(group))
        .on('mouseover', function (event, d) {
          d3.select(this).attr('opacity', 0.8);
          tooltip
            .style('opacity', 1)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 28}px`)
            .html(`<strong>${groupKey}: ${d[groupKey]}</strong><br>${xKey}: ${d[xKey]}<br>${yKey}: ${d[yKey]}`);
        })
        .on('mouseout', function () {
          d3.select(this).attr('opacity', 1);
          tooltip.style('opacity', 0);
        });
    });
    
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em');

    svg.append('g')
      .call(d3.axisLeft(yScale));
  };

  const generateLineChart = (svg, width, height, data, tooltip, margin) => {
    const xKeyUsed = xKey || Object.keys(data[0])[0];
    const yKeyUsed = yKey || Object.keys(data[0])[1];

    const xValues = data.map(d => d[xKeyUsed]);
    const yValues = data.map(d => +d[yKeyUsed]);
    
    const xScale = d3.scalePoint()
      .domain(xValues)
      .range([0, width]);
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(yValues) * 1.1])
      .range([height, 0]);
    
    const line = d3.line()
      .x(d => xScale(d[xKeyUsed]))
      .y(d => yScale(+d[yKeyUsed]));
    
    const path = svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#4caf50')
      .attr('stroke-width', 2)
      .attr('d', line);
    
    const pathLength = path.node().getTotalLength();
    path
      .attr('stroke-dasharray', pathLength)
      .attr('stroke-dashoffset', pathLength)
      .transition()
      .duration(1000)
      .attr('stroke-dashoffset', 0);
    
    // Add data points with tooltips
    svg.selectAll('.data-point')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'data-point')
      .attr('cx', d => xScale(d[xKeyUsed]))
      .attr('cy', d => yScale(+d[yKeyUsed]))
      .attr('r', 5)
      .attr('fill', '#4caf50')
      .attr('opacity', 0)
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('r', 8)
          .attr('stroke', '#388e3c')
          .attr('stroke-width', 2);
          
        tooltip
          .style('opacity', 1)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px')
          .html(`<strong>${d[xKeyUsed]}</strong><br>${yKeyUsed}: ${d[yKeyUsed]}`);
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('r', 5)
          .attr('stroke', 'none');
          
        tooltip.style('opacity', 0);
      })
      .transition()
      .delay((d, i) => i * 100)
      .duration(500)
      .attr('opacity', 1);
    
    // Add x-axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em');

    // Add y-axis
    svg.append('g')
      .call(d3.axisLeft(yScale));
    
    // Add axis labels
    svg.append('text')
      .attr('class', 'axis-title')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .text(xKeyUsed);
    
    svg.append('text')
      .attr('class', 'axis-title')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -margin.left + 15)
      .text(yKeyUsed);
  };

  const generateAreaChart = (svg, width, height, data, tooltip, margin) => {
    const xKeyUsed = xKey || Object.keys(data[0])[0];
    const yKeyUsed = yKey || Object.keys(data[0])[1];

    const xValues = data.map(d => d[xKeyUsed]);
    const yValues = data.map(d => +d[yKeyUsed]);
    
    // Set up scales
    const xScale = d3.scalePoint()
      .domain(xValues)
      .range([0, width]);
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(yValues) * 1.1])
      .range([height, 0]);
    
    // Create area path
    const area = d3.area()
      .x(d => xScale(d[xKeyUsed]))
      .y0(height)
      .y1(d => yScale(+d[yKeyUsed]));
    
    // Add area with animation
    const areaPath = svg.append('path')
      .datum(data)
      .attr('fill', 'rgba(76, 175, 80, 0.3)')
      .attr('stroke', '#4caf50')
      .attr('stroke-width', 1.5)
      .attr('d', area);
    
    // Add animation
    const pathLength = areaPath.node().getTotalLength();
    areaPath
      .attr('stroke-dasharray', pathLength)
      .attr('stroke-dashoffset', pathLength)
      .transition()
      .duration(1000)
      .attr('stroke-dashoffset', 0);
    
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em');

    svg.append('g')
      .call(d3.axisLeft(yScale));
    
    svg.append('text')
      .attr('class', 'axis-title')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .text(xKeyUsed);
    
    svg.append('text')
      .attr('class', 'axis-title')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -margin.left + 15)
      .text(yKeyUsed);
  };

  const generatePieChart = (svg, width, height, data, tooltip, margin) => {
    const valueKey = yKey || Object.keys(data[0])[1]; 
    const categoryKey = xKey || Object.keys(data[0])[0];
    
    const values = data.map(d => +d[valueKey]);
    const categories = data.map(d => d[categoryKey]);
    
    const radius = Math.min(width, height) / 2;
    const color = d3.scaleOrdinal()
      .domain(categories)
      .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), categories.length).reverse());
    
    const pie = d3.pie()
      .value(d => d)
      (values);
      
    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius * 0.8);
    
    // For label positioning
    const outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);
    
    // Append group to hold pie chart
    const g = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Add slices with animation
    const slices = g.selectAll('path')
      .data(pie)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(categories[i]))
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 0.7)
      .on('mouseover', function(event, d) {
        const i = d.index;
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', 1)
          .attr('transform', `translate(${arc.centroid(d)[0] * 0.1}, ${arc.centroid(d)[1] * 0.1})`);
          
        tooltip
          .style('opacity', 1)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px')
          .html(`<strong>${categories[i]}</strong><br>${valueKey}: ${values[i]}`);
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', 0.7)
          .attr('transform', 'translate(0, 0)');
          
        tooltip.style('opacity', 0);
      });
    
    // Animation
    slices
      .transition()
      .duration(1000)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
        return function(t) {
          return arc(interpolate(t));
        };
      });

    // Add labels
    const text = g.selectAll('text')
      .data(pie)
      .enter()
      .append('text')
      .attr('transform', d => {
        const pos = outerArc.centroid(d);
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .attr('dy', '.35em')
      .style('text-anchor', d => {
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midangle < Math.PI ? 'start' : 'end';
      })
      .style('font-size', '12px')
      .style('opacity', 0)
      .text((d, i) => categories[i]);
    
    // Animation for labels
    text
      .transition()
      .delay(1000)
      .duration(500)
      .style('opacity', 1);
    
    // Add lines connecting slices to labels
    const polyline = g.selectAll('polyline')
      .data(pie)
      .enter()
      .append('polyline')
      .attr('points', d => {
        const pos = outerArc.centroid(d);
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1);
        return [arc.centroid(d), outerArc.centroid(d), pos];
      })
      .style('fill', 'none')
      .style('stroke', 'rgba(0,0,0,0.3)')
      .style('stroke-width', '1px')
      .style('opacity', 0);
    
    // Animation for polylines
    polyline
      .transition()
      .delay(1000)
      .duration(500)
      .style('opacity', 1);
  };

  const generateDonutChart = (svg, width, height, data, tooltip, margin) => {
    const valueKey = yKey || Object.keys(data[0])[1];
    const categoryKey = xKey || Object.keys(data[0])[0];
  
    const values = data.map(d => +d[valueKey]);
    const categories = data.map(d => d[categoryKey]);
  
    const radius = Math.min(width, height) / 2;
    const color = d3.scaleOrdinal()
      .domain(categories)
      .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), categories.length).reverse());
  
    const pie = d3.pie()
      .value(d => d)
      (values);
  
    const arc = d3.arc()
      .innerRadius(radius * 0.5) // Inner radius for donut
      .outerRadius(radius * 0.8);
  
    const outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);
  
    const g = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);
  
    // Add slices
    const slices = g.selectAll('path')
      .data(pie)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(categories[i]))
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 0.7)
      .on('mouseover', function(event, d) {
        const i = d.index;
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', 1)
          .attr('transform', `translate(${arc.centroid(d)[0] * 0.1}, ${arc.centroid(d)[1] * 0.1})`);
  
        tooltip
          .style('opacity', 1)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px')
          .html(`<strong>${categories[i]}</strong><br>${valueKey}: ${values[i]}`);
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', 0.7)
          .attr('transform', 'translate(0, 0)');
  
        tooltip.style('opacity', 0);
      });
  
    // Animation
    slices
      .transition()
      .duration(1000)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function(t) {
          return arc(interpolate(t));
        };
      });
  
    // Add labels
    const text = g.selectAll('text')
      .data(pie)
      .enter()
      .append('text')
      .attr('transform', d => {
        const pos = outerArc.centroid(d);
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .attr('dy', '.35em')
      .style('text-anchor', d => {
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midangle < Math.PI ? 'start' : 'end';
      })
      .style('font-size', '12px')
      .style('opacity', 0)
      .text((d, i) => categories[i]);
  
    text
      .transition()
      .delay(1000)
      .duration(500)
      .style('opacity', 1);
  
    // Add lines connecting slices to labels
    const polyline = g.selectAll('polyline')
      .data(pie)
      .enter()
      .append('polyline')
      .attr('points', d => {
        const pos = outerArc.centroid(d);
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1);
        return [arc.centroid(d), outerArc.centroid(d), pos];
      })
      .style('fill', 'none')
      .style('stroke', 'rgba(0,0,0,0.3)')
      .style('stroke-width', '1px')
      .style('opacity', 0);
  
    polyline
      .transition()
      .delay(1000)
      .duration(500)
      .style('opacity', 1);
  };

  const generateScatterPlot = (svg, width, height, data, tooltip, margin) => {
    const xKeyUsed = xKey || Object.keys(data[0])[0];
    const yKeyUsed = yKey || Object.keys(data[0])[1];

    const xValues = data.map(d => d[xKeyUsed]);
    const yValues = data.map(d => +d[yKeyUsed]);
    
    // Set up scales
    const xScale = d3.scaleLinear()
      .domain([d3.min(xValues) * 0.9, d3.max(xValues) * 1.1])
      .range([0, width]);
    const yScale = d3.scaleLinear()
      .domain([d3.min(yValues) * 0.9, d3.max(yValues) * 1.1])
      .range([height, 0]);
    
    // Add points with animation
    svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(+d[xKeyUsed]))
      .attr('cy', height) // Start from bottom for animation
      .attr('r', 0) // Start with radius 0 for animation
      .attr('fill', '#4caf50')
      .attr('opacity', 0.7)
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('r', 8)
          .attr('opacity', 1)
          .attr('stroke', '#388e3c')
          .attr('stroke-width', 2);
          
        tooltip
          .style('opacity', 1)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px')
          .html(`<strong>${xKeyUsed}: ${d[xKeyUsed]}</strong><br>${yKeyUsed}: ${d[yKeyUsed]}`);
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('r', 5)
          .attr('opacity', 0.7)
          .attr('stroke', 'none');
          
        tooltip.style('opacity', 0);
      })
      .transition()
      .delay((d, i) => i * 50)
      .duration(800)
      .attr('cy', d => yScale(+d[yKeyUsed]))
      .attr('r', 5);
    
    // Add x-axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));
    
    // Add y-axis
    svg.append('g')
      .call(d3.axisLeft(yScale));
    
    // Add axis labels
    svg.append('text')
      .attr('class', 'axis-title')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .text(xKeyUsed);
    
    svg.append('text')
      .attr('class', 'axis-title')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -margin.left + 15)
      .text(yKeyUsed);
  };

  const generateStackedBarChart = (svg, width, height, data, tooltip, margin) => {
    const keys = Object.keys(data[0]).slice(1);
    const xKeyUsed = xKey || Object.keys(data[0])[0];

    const x = d3.scaleBand()
      .domain(data.map(d => d[xKeyUsed]))
      .range([0, width])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d3.sum(keys, k => +d[k])) * 1.1])
      .range([height, 0]);

    const color = d3.scaleOrdinal(d3.schemeCategory10).domain(keys);

    const stackedData = d3.stack().keys(keys)(data);

    svg.append("g")
      .selectAll("g")
      .data(stackedData)
      .join("g")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      .data(d => d)
      .join("rect")
      .attr("x", d => x(d.data[xKeyUsed]))
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())
      .on("mouseover", function(event, d) {
        d3.select(this).attr("opacity", 1);
        tooltip.style("opacity", 1)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px")
          .html(`${d.data[xKeyUsed]}<br>Total: ${d3.sum(keys, k => d.data[k])}`);
      })
      .on("mouseout", function() {
        d3.select(this).attr("opacity", 0.8);
        tooltip.style("opacity", 0);
      })
      .attr("opacity", 0.8);

    // Add legend
    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - 100}, 20)`);

      keys.forEach((key, i) => {
      const row = legend.append("g").attr("transform", `translate(0, ${i * 20})`);
      row.append("rect").attr("width", 10).attr("height", 10).attr("fill", color(key));
      row.append("text").attr("x", 20).attr("y", 10).text(key).attr("text-anchor", "start");
      }); 


    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em');

    svg.append("g")
      .call(d3.axisLeft(y));
  }

  const generateStackedBar100Chart = (svg, width, height, data, tooltip, margin) => {
    const xKeyUsed = xKey || Object.keys(data[0])[0];
    const keys = Object.keys(data[0]).filter(k => k !== xKeyUsed);
  
    // Normalize values to 100%
    data.forEach(d => {
      const total = d3.sum(keys, k => +d[k]);
      keys.forEach(k => d[k] = (+d[k] / total) * 100);
    });
  
    const x = d3.scaleBand()
      .domain(data.map(d => d[xKeyUsed]))
      .range([0, width])
      .padding(0.2);
  
    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);
  
    const color = d3.scaleOrdinal(d3.schemeCategory10).domain(keys);
    const stackedData = d3.stack().keys(keys)(data);
  
    svg.append("g")
      .selectAll("g")
      .data(stackedData)
      .join("g")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      .data(d => d)
      .join("rect")
      .attr("x", d => x(d.data[xKeyUsed]))
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())
      .on("mouseover", function(event, d) {
        tooltip.style("opacity", 1)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`)
          .html(`${d.data[xKeyUsed]}<br>Segment %: ${(d[1] - d[0]).toFixed(2)}%`);
      })
      .on("mouseout", () => tooltip.style("opacity", 0));
    
    // Add legend
    const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${width - 100}, 20)`);

    keys.forEach((key, i) => {
    const row = legend.append("g").attr("transform", `translate(0, ${i * 20})`);
    row.append("rect").attr("width", 10).attr("height", 10).attr("fill", color(key));
    row.append("text").attr("x", 20).attr("y", 10).text(key).attr("text-anchor", "start");
    });

  
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em');
    svg.append("g").call(d3.axisLeft(y));
  };

  const generateBubbleChart = (svg, width, height, data, tooltip, margin) => {

    // Use zKey for bubble size instead of groupKey
    const xKeyUsed = xKey || Object.keys(data[0])[0];
    const yKeyUsed = yKey || Object.keys(data[0])[1];
    const sizeKey = zKey || Object.keys(data[0])[2]; // Use zKey for bubble size
    
    const xValues = data.map(d => +d[xKeyUsed]);
    const yValues = data.map(d => +d[yKeyUsed]);
    const sizeValues = data.map(d => +d[sizeKey]);
    
    // Set up scales
    const xScale = d3.scaleLinear()
      .domain([d3.min(xValues) * 0.9, d3.max(xValues) * 1.1])
      .range([0, width]);
    
    const yScale = d3.scaleLinear()
      .domain([d3.min(yValues) * 0.9, d3.max(yValues) * 1.1])
      .range([height, 0]);
    
    const sizeScale = d3.scaleSqrt()
      .domain([d3.min(sizeValues), d3.max(sizeValues)])
      .range([5, 30]);
    
    // Add bubbles with animation
    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(+d[xKeyUsed]))
      .attr("cy", height) // Start from bottom for animation
      .attr("r", 0) // Start with radius 0 for animation
      .attr("fill", "#4caf50")
      .attr("fill-opacity", 0.7)
      .attr("stroke", "#388e3c")
      .attr("stroke-width", 1)
      .on("mouseover", function(event, d) {
        d3.select(this)
          .attr("fill-opacity", 1)
          .attr("stroke-width", 2);
          
        tooltip
          .style("opacity", 1)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px")
          .html(`<strong>${xKeyUsed}: ${d[xKeyUsed]}</strong><br>${yKeyUsed}: ${d[yKeyUsed]}<br>${sizeKey}: ${d[sizeKey]}`);
      })
      .on("mouseout", function() {
        d3.select(this)
          .attr("fill-opacity", 0.7)
          .attr("stroke-width", 1);
          
        tooltip.style("opacity", 0);
      })
      .transition()
      .delay((d, i) => i * 50)
      .duration(800)
      .attr("cy", d => yScale(+d[yKeyUsed]))
      .attr("r", d => sizeScale(+d[sizeKey]));
    
    // Add x-axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));
    
    // Add y-axis
    svg.append("g")
      .call(d3.axisLeft(yScale));
    
    // Add axis labels
    svg.append("text")
      .attr("class", "axis-title")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .text(xKeyUsed);
    
    svg.append("text")
      .attr("class", "axis-title")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 15)
      .text(yKeyUsed);
};

  const generateHistogramChart = (svg, width, height, data, tooltip, margin) => {
    const valueKey = xKey || Object.keys(data[0])[1]; // Assume first numeric column
    const values = data.map(d => +d[valueKey]);
    
    // Set up the histogram bins
    const bins = d3.histogram()
      .domain([d3.min(values) * 0.95, d3.max(values) * 1.05])
      .thresholds(10)(values);
    
    // Set up scales
    const x = d3.scaleLinear()
      .domain([bins[0].x0, bins[bins.length - 1].x1])
      .range([0, width]);
    
    const y = d3.scaleLinear()
      .domain([0, d3.max(bins, d => d.length) * 1.1])
      .range([height, 0]);
    
    // Add bars with animation
    svg.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("x", d => x(d.x0) + 1)
      .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
      .attr("y", height) // Start from bottom for animation
      .attr("height", 0) // Start with height 0 for animation
      .attr("fill", "#4caf50")
      .attr("opacity", 0.8)
      .on("mouseover", function(event, d) {
        d3.select(this)
          .attr("opacity", 1)
          .attr("stroke", "#388e3c")
          .attr("stroke-width", 1);
          
        tooltip
          .style("opacity", 1)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px")
          .html(`Range: ${d.x0.toFixed(2)} - ${d.x1.toFixed(2)}<br>Count: ${d.length}`);
      })
      .on("mouseout", function() {
        d3.select(this)
          .attr("opacity", 0.8)
          .attr("stroke", "none");
          
        tooltip.style("opacity", 0);
      })
      .transition()
      .duration(800)
      .attr("y", d => y(d.length))
      .attr("height", d => height - y(d.length));
    
    // Add x-axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));
    
    // Add y-axis
    svg.append("g")
      .call(d3.axisLeft(y));
    
    // Add axis labels
    svg.append("text")
      .attr("class", "axis-title")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .text(valueKey);
    
    svg.append("text")
      .attr("class", "axis-title")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 15)
      .text("Frequency");
  }
  
  const generateBoxPlot = (svg, width, height, rawData, tooltip, margin) => {
    const valueKey = yKey || Object.keys(rawData[0])[1];
    const categoryKey = xKey || Object.keys(rawData[0])[0];
  
    // Clean and validate data
    const data = rawData.filter(d => d[valueKey] !== undefined && !isNaN(+d[valueKey]) && d[categoryKey] !== undefined);
  
    if (data.length === 0) {
      console.warn('No valid data available for box plot.');
      return;
    }
  
    // Group data
    const grouped = d3.group(data, d => String(d[categoryKey]));
  
    // Calculate statistics
    const stats = Array.from(grouped, ([key, values]) => {
      const numValues = values.map(d => +d[valueKey]).sort(d3.ascending);
      const q1 = d3.quantile(numValues, 0.25);
      const median = d3.quantile(numValues, 0.5);
      const q3 = d3.quantile(numValues, 0.75);
      const iqr = q3 - q1;
      const min = Math.max(d3.min(numValues), q1 - 1.5 * iqr);
      const max = Math.min(d3.max(numValues), q3 + 1.5 * iqr);
      const outliers = numValues.filter(d => d < min || d > max);
      return { key, min, q1, median, q3, max, outliers };
    });
  
    if (stats.length === 0) {
      console.warn('No groups available for box plot.');
      return;
    }
  
    // Scales
    const x = d3.scaleBand()
      .domain(stats.map(d => d.key))
      .range([0, width])
      .padding(0.2);
  
    const y = d3.scaleLinear()
      .domain([
        d3.min(stats, d => Math.min(d.min, ...(d.outliers.length ? d.outliers : [d.min]))),
        d3.max(stats, d => Math.max(d.max, ...(d.outliers.length ? d.outliers : [d.max])))
      ])
      .nice()
      .range([height, 0]);
  
    // Draw Boxes
    const boxes = svg.selectAll("g.box")
      .data(stats)
      .enter()
      .append("g")
      .attr("class", "box")
      .attr("transform", d => `translate(${x(d.key)},0)`);
  
    boxes.append("rect")
      .attr("x", 0)
      .attr("y", d => y(d.q3))
      .attr("width", x.bandwidth())
      .attr("height", d => y(d.q1) - y(d.q3))
      .attr("fill", "#4caf50")
      .attr("opacity", 0.8)
      .attr("stroke", "#388e3c");
  
    boxes.append("line")
      .attr("x1", 0)
      .attr("x2", x.bandwidth())
      .attr("y1", d => y(d.median))
      .attr("y2", d => y(d.median))
      .attr("stroke", "#333")
      .attr("stroke-width", 2);
  
    boxes.append("line")
      .attr("x1", x.bandwidth() / 2)
      .attr("x2", x.bandwidth() / 2)
      .attr("y1", d => y(d.min))
      .attr("y2", d => y(d.q1))
      .attr("stroke", "#333");
  
    boxes.append("line")
      .attr("x1", x.bandwidth() / 2)
      .attr("x2", x.bandwidth() / 2)
      .attr("y1", d => y(d.q3))
      .attr("y2", d => y(d.max))
      .attr("stroke", "#333");
  
    boxes.append("line")
      .attr("x1", x.bandwidth() * 0.25)
      .attr("x2", x.bandwidth() * 0.75)
      .attr("y1", d => y(d.min))
      .attr("y2", d => y(d.min))
      .attr("stroke", "#333");
  
    boxes.append("line")
      .attr("x1", x.bandwidth() * 0.25)
      .attr("x2", x.bandwidth() * 0.75)
      .attr("y1", d => y(d.max))
      .attr("y2", d => y(d.max))
      .attr("stroke", "#333");
  
    // Outliers
    stats.forEach((stat, i) => {
      svg.selectAll(".outlier" + i)
        .data(stat.outliers)
        .enter()
        .append("circle")
        .attr("cx", x(stat.key) + x.bandwidth() / 2)
        .attr("cy", d => y(d))
        .attr("r", 3)
        .attr("fill", "red")
        .attr("opacity", 0.6)
        .on("mouseover", function(event, d) {
          d3.select(this)
            .attr("r", 5)
            .attr("opacity", 1);
  
          tooltip
            .style("opacity", 1)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px")
            .html(`Outlier: ${d}`);
        })
        .on("mouseout", function() {
          d3.select(this)
            .attr("r", 3)
            .attr("opacity", 0.6);
  
          tooltip.style("opacity", 0);
        });
    });
  
    // X Axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));
  
    // Y Axis
    svg.append("g")
      .call(d3.axisLeft(y));
  
    // Axis Labels
    svg.append("text")
      .attr("class", "axis-title")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .text(categoryKey);
  
    svg.append("text")
      .attr("class", "axis-title")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 15)
      .text(valueKey);
  };
  
  
  const generateHeatmapChart = (svg, width, height, data, tooltip, margin) => {
    // Assuming data has three columns: x, y, and value
    const xKeyUsed = xKey || Object.keys(data[0])[0];
    const yKeyUsed = yKey || Object.keys(data[0])[1];
    const valueKey = Object.keys(data[0])[2];
    
    // Get unique x and y values
    const xValues = Array.from(new Set(data.map(d => d[xKeyUsed])));
    const yValues = Array.from(new Set(data.map(d => d[yKeyUsed])));
    
    // Set up scales
    const x = d3.scaleBand()
      .domain(xValues)
      .range([0, width])
      .padding(0.05);
    
    const y = d3.scaleBand()
      .domain(yValues)
      .range([0, height])
      .padding(0.05);
    
    // Set up color scale
    const values = data.map(d => +d[valueKey]);
    const colorScale = d3.scaleSequential()
      .interpolator(d3.interpolateViridis)
      .domain([d3.min(values), d3.max(values)]);
    
    // Add cells
    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => x(d[xKey]))
      .attr("y", d => y(d[yKeyUsed]))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("fill", d => colorScale(+d[valueKey]))
      .attr("opacity", 0) // Start transparent for animation
      .on("mouseover", function(event, d) {
        d3.select(this)
          .attr("stroke", "black")
          .attr("stroke-width", 2);
          
        tooltip
          .style("opacity", 1)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px")
          .html(`<strong>${xKey}: ${d[xKey]}</strong><br>${yKeyUsed}: ${d[yKeyUsed]}<br>${valueKey}: ${d[valueKey]}`);
      })
      .on("mouseout", function() {
        d3.select(this)
          .attr("stroke", "none");
          
        tooltip.style("opacity", 0);
      })
      .transition()
      .delay((d, i) => i * 10)
      .duration(500)
      .attr("opacity", 1);
    
    // Add x-axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em');
    
    // Add y-axis
    svg.append("g")
      .call(d3.axisLeft(y));
    
    // Add a color legend
    const legendWidth = 20;
    const legendHeight = height / 2;
    
    const legendScale = d3.scaleLinear()
      .domain([d3.min(values), d3.max(values)])
      .range([legendHeight, 0]);
    
    const legend = svg.append("g")
      .attr("transform", `translate(${width + margin.right / 2 - legendWidth}, ${height / 2 - legendHeight / 2})`);
    
    // Create gradient for legend
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "heatmap-gradient")
      .attr("x1", "0%")
      .attr("x2", "0%")
      .attr("y1", "0%")
      .attr("y2", "100%");
    
    // Add color stops to gradient
    const numStops = 10;
    for (let i = 0; i <= numStops; i++) {
      const offset = i / numStops;
      const value = d3.interpolateNumber(d3.max(values), d3.min(values))(offset);
      gradient.append("stop")
        .attr("offset", `${offset * 100}%`)
        .attr("stop-color", colorScale(value));
    }
    
    // Add rectangle with gradient
    legend.append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#heatmap-gradient)");
    
    // Add legend axis
    legend.append("g")
      .attr("transform", `translate(${legendWidth},0)`)
      .call(d3.axisRight(legendScale).ticks(5));
    
    // Add legend title
    legend.append("text")
      .attr("class", "legend-title")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(90)")
      .attr("x", legendHeight / 2)
      .attr("y", -legendWidth - 10)
      .text(valueKey);
  }

  const generateRadarChart = (svg, width, height, data, tooltip, margin, xKey, yKey) => {
    let radarData;
    let keys;
  
    // Handle rotated format
    if (
      xKey &&
      Array.isArray(yKey) &&
      yKey.every(k => k in data[0]) &&
      xKey in data[0]
    ) {
      radarData = yKey.map(key => {
        const row = { name: key };
        data.forEach(d => {
          row[d[xKey]] = d[key];
        });
        return row;
      });
      keys = data.map(d => d[xKey]);
    } else {
      // Handle normal format
      keys = Array.isArray(yKey) ? yKey : [yKey];
      const nameKey = xKey || Object.keys(data[0])[0];
      radarData = data.map(d => ({
        name: d[nameKey],
        ...d
      }));
    }
  
    // Clean previous SVG content
    svg.selectAll("*").remove();
  
    // Base config
    const radius = Math.min(width, height) / 2;
    const angleSlice = (2 * Math.PI) / keys.length;
  
    const rScale = d3.scaleLinear()
      .domain([0, d3.max(radarData, d => d3.max(keys, key => +d[key]))])
      .range([0, radius]);
  
    const g = svg.append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);
  
    // Draw circular grid
    const levels = 5;
    for (let level = 1; level <= levels; level++) {
      g.append("circle")
        .attr("class", "grid-circle")
        .attr("r", radius * (level / levels))
        .attr("fill", "none")
        .attr("stroke", "#CDCDCD")
        .attr("stroke-dasharray", "4,4");
    }
  
    // Draw axes
    const axis = g.selectAll(".axis")
      .data(keys)
      .enter()
      .append("g")
      .attr("class", "axis");
  
    axis.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d, i) => rScale(rScale.domain()[1]) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y2", (d, i) => rScale(rScale.domain()[1]) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr("stroke", "#CDCDCD")
      .attr("stroke-width", 1);
  
    axis.append("text")
      .attr("x", (d, i) => (radius + 20) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y", (d, i) => (radius + 20) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .attr("class", "axis-label")
      .text(d => d);
  
    // Radar line generator
    const radarLine = d3.lineRadial()
      .radius(d => rScale(d.value))
      .angle((d, i) => i * angleSlice);
  
    // Format data to radar chart shape and close each polygon
    const formattedData = radarData.map(d => {
      const values = keys.map((key, i) => ({
        axis: key,
        value: +d[key]
      }));
      values.push(values[0]); // close the shape
      return { name: d.name, values };
    });
  
    const color = d3.scaleOrdinal(d3.schemeCategory10);
  
    const blobs = g.selectAll(".radar-area")
      .data(formattedData)
      .enter()
      .append("g")
      .attr("class", "radar-area");
  
    blobs.append("path")
      .attr("class", "radar-path")
      .attr("d", d => radarLine(d.values))
      .attr("fill", (d, i) => color(i))
      .attr("fill-opacity", 0.1)
      .attr("stroke", (d, i) => color(i))
      .attr("stroke-width", 2)
      .on("mouseover", function (event, d) {
        d3.select(this)
          .attr("fill-opacity", 0.3)
          .attr("stroke-width", 3);
  
        tooltip
          .style("opacity", 1)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`)
          .html(`<strong>${d.name}</strong><br>` + d.values.map(v => `${v.axis}: ${v.value}`).join("<br>"));
      })
      .on("mouseout", function () {
        d3.select(this)
          .attr("fill-opacity", 0.1)
          .attr("stroke-width", 2);
        tooltip.style("opacity", 0);
      });
  
    // Add legend
    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - 120}, 20)`);
  
    formattedData.forEach((d, i) => {
      const row = legend.append("g")
        .attr("transform", `translate(0, ${i * 20})`);
  
      row.append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", color(i));
  
      row.append("text")
        .attr("x", 20)
        .attr("y", 10)
        .text(d.name);
    });
  };
  
  const generateCalendarHeatmap = (svg, width, height, data, tooltip, margin) => {  
    const dateKey = xKey || Object.keys(data[0])[0];
    const valueKey = yKey || Object.keys(data[0])[1];
  
    // Data processing with error handling
    const processedData = data.map(d => {
      const date = new Date(d[dateKey]);
      if (isNaN(date)) return null;
      
      return {
        date,
        value: +d[valueKey] || 0,
        original: d
      };
    }).filter(Boolean);
  
    if (processedData.length === 0) return;
  
    // Sort data by date for better grouping
    processedData.sort((a, b) => a.date - b.date);
  
    const years = d3.groups(processedData, d => d.date.getFullYear());
    const maxValue = d3.max(processedData, d => d.value);
    const minValue = d3.min(processedData, d => d.value);
  
    const cellSize = 15;
    const cellMargin = 1;
    const calendarHeight = (cellSize + cellMargin) * 8;
    const totalHeight = years.length * calendarHeight + margin.top + margin.bottom;
  
    svg.attr("height", totalHeight).attr("width", width);
  
    // Custom color scale with #027c68 as the max color
    const colorScale = d3.scaleLinear()
      .domain([minValue, maxValue])
      .range(["#e0f7f4", "#027c68"]);
  
    // Add background for better readability
    svg.append("rect")
      .attr("width", width)
      .attr("height", totalHeight)
      .attr("fill", "#f8f8f8");
  
    const calendar = svg.selectAll(".year-group")
      .data(years)
      .enter()
      .append("g")
      .attr("class", "year-group")
      .attr("transform", (d, i) => `translate(${margin.left}, ${i * calendarHeight + margin.top})`);
  
    // Improved year label
    calendar.append("text")
      .attr("x", -2)
      .attr("y", 5)
      .attr("class", "year-label")
      .text(d => d[0])
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("fill", "#333");
  
    calendar.each(function ([year, values]) {
      const g = d3.select(this);
      const valueMap = new Map(values.map(d => [d3.timeFormat("%Y-%m-%d")(d.date), d.value]));
      const days = d3.timeDays(new Date(year, 0, 1), new Date(year + 1, 0, 1));
  
      const monthData = d3.timeMonths(new Date(year, 0, 1), new Date(year + 1, 0, 1));
      
      g.selectAll(".month-label")
        .data(monthData)
        .enter()
        .append("text")
        .attr("class", "month-label")
        .attr("x", d => {
          const firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
          return d3.timeWeek.count(d3.timeYear(d), firstDay) * cellSize + 30 + cellSize / 2;
        })
        .attr("y", 10)
        .text(d => d3.timeFormat("%b")(d))
        .style("font-size", "10px")
        .style("fill", "#555")
        .style("text-anchor", "middle");
  
      g.selectAll("rect")
        .data(days)
        .enter()
        .append("rect")
        .attr("width", cellSize - cellMargin)
        .attr("height", cellSize - cellMargin)
        .attr("x", d => d3.timeWeek.count(d3.timeYear(d), d) * cellSize + 10)
        .attr("y", d => d.getDay() * cellSize + 15)
        .attr("fill", d => {
          const key = d3.timeFormat("%Y-%m-%d")(d);
          return valueMap.has(key) ? colorScale(valueMap.get(key)) : "#f0f0f0";
        })
        .attr("rx", 2) // Rounded corners
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.5)
        .on("mouseover", function (event, d) {
          const key = d3.timeFormat("%Y-%m-%d")(d);
          const val = valueMap.has(key) ? valueMap.get(key) : "No data";
          const originalData = values.find(v => d3.timeFormat("%Y-%m-%d")(v.date) === key)?.original;
  
          d3.select(this)
            .attr("stroke", "#000")
            .attr("stroke-width", 1.5)
            .raise();
  
          const tooltipContent = originalData 
            ? Object.entries(originalData).map(([k, v]) => `<strong>${k}:</strong> ${v}`).join("<br>")
            : `<strong>${d3.timeFormat("%b %d, %Y")(d)}</strong><br>${valueKey}: ${val}`;
  
          tooltip
            .style("opacity", 1)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 28}px`)
            .html(tooltipContent);
        })
        .on("mouseout", function () {
          d3.select(this)
            .attr("stroke", "#fff")
            .attr("stroke-width", 0.5);
          tooltip.style("opacity", 0);
        });
    });
  
    // Weekday labels with better positioning
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    svg.selectAll(".weekday-label")
      .data(days)
      .enter()
      .append("text")
      .attr("class", "weekday-label")
      .attr("x", margin.left - 5)
      .attr("y", (d, i) => margin.top + i * cellSize + cellSize / 2 + 15)
      .style("text-anchor", "end")
      .style("font-size", "10px")
      .style("fill", "#555")
      .text(d => d);
  
    // Improved legend
    const legendWidth = 120;
    const legendHeight = 12;
    const legendX = width - legendWidth - margin.right;
    const legendY = totalHeight - legendHeight - 10;
  
    const legend = svg.append("g")
      .attr("class", "calendar-legend")
      .attr("transform", `translate(${legendX}, ${legendY})`);
  
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "calendar-gradient")
      .attr("x1", "0%")
      .attr("x2", "100%");
  
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#e0f7f4");
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#027c68");
  
    legend.append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .attr("rx", 3) // Rounded corners
      .style("fill", "url(#calendar-gradient)")
      .style("stroke", "#ccc");
  
    const legendScale = d3.scaleLinear()
      .domain([minValue, maxValue])
      .range([0, legendWidth]);
  
    const legendAxis = d3.axisBottom(legendScale)
      .ticks(5)
      .tickSize(legendHeight)
      .tickFormat(d3.format(".2s"));
  
    legend.append("g")
      .attr("transform", `translate(0, ${legendHeight})`)
      .call(legendAxis)
      .select(".domain").remove();
  };

  // const flattenToHierarchy = (flatData, hierarchyKeys, valueKey) => {
  //   // Ensure it's an array
  //   if (!Array.isArray(hierarchyKeys)) {
  //     hierarchyKeys = typeof hierarchyKeys === 'string'
  //       ? [hierarchyKeys]
  //       : [];
  //   }
  
  //   const root = { name: "root", children: [] };
  
  //   flatData.forEach(row => {
  //     let currentLevel = root;
  
  //     hierarchyKeys.forEach((key, index) => {
  //       const nodeName = row[key];
  //       if (!currentLevel.children) currentLevel.children = [];
  
  //       let existingNode = currentLevel.children.find(child => child.name === nodeName);
  
  //       if (!existingNode) {
  //         existingNode = { name: nodeName };
  //         if (index === hierarchyKeys.length - 1) {
  //           existingNode.value = +row[valueKey];
  //         }
  //         currentLevel.children.push(existingNode);
  //       }
  
  //       currentLevel = existingNode;
  //     });
  //   });
  
  //   return root;
  // };
  
  
  // const generateSunburstChart = (svg, width, height, data, tooltip, margin, xKey, yKey, hierarchyKeys, valueKey) => {
  //   const hierarchyData = flattenToHierarchy(data, hierarchyKeys, valueKey);
  
  //   const root = d3.hierarchy(hierarchyData).sum(d => d.value || 0).sort((a, b) => b.value - a.value);
  //   const color = d3.scaleOrdinal(d3.schemeCategory10);
  //   const radius = Math.min(width, height) / 2;
  //   const partition = d3.partition().size([2 * Math.PI, radius]);
  //   partition(root);
  
  //   const arc = d3.arc()
  //     .startAngle(d => d.x0)
  //     .endAngle(d => d.x1)
  //     .innerRadius(d => d.y0)
  //     .outerRadius(d => d.y1);
  
  //   const g = svg.append("g").attr("transform", `translate(${width / 2},${height / 2})`);
  
  //   g.selectAll("path")
  //     .data(root.descendants().filter(d => d.depth))
  //     .enter()
  //     .append("path")
  //     .attr("d", arc)
  //     .style("fill", d => color(d.data.name))
  //     .style("stroke", "#fff")
  //     .style("opacity", 0.8)
  //     .on("mouseover", function (event, d) {
  //       const percent = (100 * d.value / root.value).toFixed(1);
  //       tooltip
  //         .style("opacity", 1)
  //         .style("left", `${event.pageX + 10}px`)
  //         .style("top", `${event.pageY - 28}px`)
  //         .html(`<strong>${d.ancestors().map(d => d.data.name).reverse().join(" > ")}</strong><br>Value: ${d.value}<br>Percentage: ${percent}%`);
  //     })
  //     .on("mouseout", () => tooltip.style("opacity", 0));
  // };
  
  // const generateTreemapChart = (svg, width, height, data, tooltip, margin, xKey, yKey, hierarchyKeys, valueKey) => {
  //   const hierarchyData = flattenToHierarchy(data, hierarchyKeys, valueKey);
  
  //   const root = d3.hierarchy(hierarchyData)
  //     .sum(d => +d.value)
  //     .sort((a, b) => b.value - a.value);
  
  //   d3.treemap().size([width, height]).padding(2).round(true)(root);
  
  //   const color = d3.scaleOrdinal(d3.schemeCategory10);
  
  //   const cell = svg.selectAll("g")
  //     .data(root.leaves())
  //     .enter()
  //     .append("g")
  //     .attr("transform", d => `translate(${d.x0},${d.y0})`);
  
  //   cell.append("rect")
  //     .attr("width", d => d.x1 - d.x0)
  //     .attr("height", d => d.y1 - d.y0)
  //     .attr("fill", d => color(d.data.name))
  //     .attr("opacity", 0.8)
  //     .on("mouseover", function (event, d) {
  //       d3.select(this).attr("opacity", 1).attr("stroke", "#000");
  //       tooltip
  //         .style("opacity", 1)
  //         .style("left", `${event.pageX + 10}px`)
  //         .style("top", `${event.pageY - 28}px`)
  //         .html(`<strong>${d.data.name}</strong><br>Value: ${d.data.value}`);
  //     })
  //     .on("mouseout", function () {
  //       d3.select(this).attr("opacity", 0.8).attr("stroke", "#fff");
  //       tooltip.style("opacity", 0);
  //     });
  
  //   cell.append("text")
  //     .attr("x", 4)
  //     .attr("y", 14)
  //     .text(d => d.data.name)
  //     .attr("font-size", d => {
  //       const w = d.x1 - d.x0;
  //       const h = d.y1 - d.y0;
  //       const len = d.data.name.length;
  //       return Math.min(14, Math.min(w / len * 1.5, h / 2)) + "px";
  //     })
  //     .each(function (d) {
  //       if (this.getComputedTextLength() > (d.x1 - d.x0 - 8)) d3.select(this).remove();
  //     });
  // };
  

  const generateStepLineChart = (svg, width, height, data, tooltip, margin, xKey, yKey) => {
    const xKeyUsed = xKey || Object.keys(data[0])[0];
    const yKeys = Array.isArray(yKey) ? yKey : [yKey || Object.keys(data[0])[1]];
  
    // Parse x-values
    let parseX;
    if (isNaN(+data[0][xKeyUsed])) {
      // Assume date if not number
      parseX = d => new Date(d);
    } else {
      parseX = d => +d;
    }
  
    data.forEach(d => {
      d.x = parseX(d[xKeyUsed]);
    });
  
    // Sort by x
    data.sort((a, b) => a.x - b.x);
  
    // Scales
    const xScale = typeof data[0].x === 'object'
      ? d3.scaleTime().domain(d3.extent(data, d => d.x)).range([0, width])
      : d3.scaleLinear().domain(d3.extent(data, d => d.x)).range([0, width]);
  
    const yValues = [];
    yKeys.forEach(key => data.forEach(d => yValues.push(+d[key])));
  
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(yValues) * 1.1])
      .range([height, 0]);
  
    // Step line generator
    const line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(+d.value))
      .curve(d3.curveStepAfter);
  
    const color = d3.scaleOrdinal(d3.schemeCategory10).domain(yKeys);
  
    yKeys.forEach((key, i) => {
      const lineData = data.map(d => ({ x: d.x, value: d[key] }));
  
      svg.append("path")
        .datum(lineData)
        .attr("fill", "none")
        .attr("stroke", color(key))
        .attr("stroke-width", 2)
        .attr("d", line)
        .attr("stroke-dasharray", function() {
          const length = this.getTotalLength();
          return `${length} ${length}`;
        })
        .attr("stroke-dashoffset", function() {
          return this.getTotalLength();
        })
        .transition()
        .duration(1500)
        .attr("stroke-dashoffset", 0);
  
      // Dots
      svg.selectAll(`.dot-${i}`)
        .data(lineData)
        .enter()
        .append("circle")
        .attr("class", `dot-${i}`)
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(+d.value))
        .attr("r", 4)
        .attr("fill", color(key))
        .attr("stroke", "#fff")
        .attr("stroke-width", 1)
        .style("opacity", 0)
        .on("mouseover", function(event, d) {
          d3.select(this)
            .attr("r", 6)
            .style("opacity", 1);
  
          tooltip
            .style("opacity", 1)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 28}px`)
            .html(`<strong>${key}</strong><br>${xKeyUsed}: ${d.x instanceof Date ? d3.timeFormat("%Y-%m-%d")(d.x) : d.x}<br>Value: ${d.value}`);
        })
        .on("mouseout", function() {
          d3.select(this).attr("r", 4).style("opacity", 0.8);
          tooltip.style("opacity", 0);
        })
        .transition()
        .delay((d, i) => i * 100)
        .duration(500)
        .style("opacity", 0.8);
    });
  
    // Axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em');
  
    svg.append("g").call(d3.axisLeft(yScale));

    // Add X-axis label
    svg.append("text")
      .attr("class", "axis-title")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .text(xKeyUsed);

    // Add Y-axis label
    svg.append("text")
      .attr("class", "axis-title")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 15)
      .text(yKeys.join(", "));
  
    // Legend
    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - 100}, 20)`);
  
    yKeys.forEach((key, i) => {
      const row = legend.append("g").attr("transform", `translate(0, ${i * 20})`);
      row.append("rect").attr("width", 10).attr("height", 10).attr("fill", color(key));
      row.append("text").attr("x", 20).attr("y", 10).text(key).attr("text-anchor", "start");
    });
  };
  

  const generateSlopeChart = (svg, width, height, data, tooltip, margin) => {
    const timePoints = Object.keys(data[0]).slice(1);
    if (timePoints.length < 2) {
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "red")
        .text("Slope chart requires at least 2 time points");
      return;
    }
    
    const nameKey = Object.keys(data[0])[0];
    
    // Get min and max values
    let minValue = Infinity;
    let maxValue = -Infinity;
    
    data.forEach(d => {
      timePoints.forEach(time => {
        const value = +d[time];
        if (value < minValue) minValue = value;
        if (value > maxValue) maxValue = value;
      });
    });
    
    // Add some padding to the range
    minValue = minValue * 0.9;
    maxValue = maxValue * 1.1;
    
    // Set up scales
    const xScale = d3.scalePoint()
      .domain(timePoints)
      .range([0, width]);
    
    const yScale = d3.scaleLinear()
      .domain([minValue, maxValue])
      .range([height, 0]);
    
    // Set up color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    
    // Draw slopes
    data.forEach((d, i) => {
      const lineData = timePoints.map(time => ({
        time: time,
        value: +d[time]
      }));
      
      svg.append("path")
        .datum(lineData)
        .attr("fill", "none")
        .attr("stroke", color(i))
        .attr("stroke-width", 2)
        .attr("opacity", 0.7)
        .attr("d", d3.line()
          .x(d => xScale(d.time))
          .y(d => yScale(d.value)))
        .on("mouseover", function(event) {
          d3.select(this)
            .attr("stroke-width", 3)
            .attr("opacity", 1);
          
          tooltip
            .style("opacity", 1)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px")
            .html(`<strong>${d[nameKey]}</strong><br>` +
                  timePoints.map(time => `${time}: ${d[time]}`).join("<br>"));
        })
        .on("mouseout", function() {
          d3.select(this)
            .attr("stroke-width", 2)
            .attr("opacity", 0.7);
          
          tooltip.style("opacity", 0);
        });
      
      // Add dots for each time point
      lineData.forEach(point => {
        svg.append("circle")
          .attr("cx", xScale(point.time))
          .attr("cy", yScale(point.value))
          .attr("r", 5)
          .attr("fill", color(i))
          .attr("stroke", "#fff")
          .attr("stroke-width", 1);
      });
      
      // Add labels for first and last points
      const firstPoint = lineData[0];
      const lastPoint = lineData[lineData.length - 1];
      
      // First point label
      svg.append("text")
        .attr("x", xScale(firstPoint.time) - 10)
        .attr("y", yScale(firstPoint.value))
        .attr("text-anchor", "end")
        .attr("alignment-baseline", "middle")
        .text(d[nameKey])
        .style("font-size", "12px");
      
      // Last point label
      svg.append("text")
        .attr("x", xScale(lastPoint.time) + 10)
        .attr("y", yScale(lastPoint.value))
        .attr("text-anchor", "start")
        .attr("alignment-baseline", "middle")
        .text(lastPoint.value)
        .style("font-size", "12px");
    });
    
    // Add axes
    timePoints.forEach(time => {
      svg.append("g")
        .attr("transform", `translate(${xScale(time)},0)`)
        .call(d3.axisLeft(yScale).tickSize(0).tickFormat(d => ""))
        .selectAll("line")
        .style("stroke-dasharray", "4,4");
      
      svg.append("text")
        .attr("x", xScale(time))
        .attr("y", height + 20)
        .attr("text-anchor", "middle")
        .text(time)
        .style("font-size", "14px");
    });
  }

  const generateViolinPlot = (svg, width, height, data, tooltip, margin, xKey, yKey) => {
    const xGroups = Array.from(new Set(data.map(d => d[xKey])));
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => +d[yKey])])
      .range([height, 0]);
    const x = d3.scaleBand().range([0, width]).domain(xGroups).padding(0.05);
    const color = d3.scaleOrdinal(d3.schemeCategory10);
  
    // KDE
    function kernelDensityEstimator(kernel, X) {
      return V => X.map(x => [x, d3.mean(V, v => kernel(x - v))]);
    }
    function epanechnikovKernel(b) {
      return v => Math.abs(v /= b) <= 1 ? .75 * (1 - v * v) / b : 0;
    }
  
    xGroups.forEach(group => {
      const groupData = data.filter(d => d[xKey] === group).map(d => +d[yKey]);
      const kde = kernelDensityEstimator(epanechnikovKernel(7), y.ticks(50));
      const density = kde(groupData);
      const maxD = d3.max(density, d => d[1]);
      const xNum = d3.scaleLinear().range([0, x.bandwidth()]).domain([-maxD, maxD]);
  
      svg.append("g")
        .append("path")
        .datum(density)
        .attr("transform", `translate(${x(group)},0)`)
        .attr("fill", color(group))
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("d", d3.line()
          .curve(d3.curveBasis)
          .x(d => xNum(d[1]))
          .y(d => y(d[0]))
        )
        .clone(true)
        .attr("d", d3.line()
          .curve(d3.curveBasis)
          .x(d => xNum(-d[1]))
          .y(d => y(d[0]))
        );
    });
  
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em');
    svg.append("g").call(d3.axisLeft(y));
  };
  

  function drawChart(type, svg, width, height, data, tooltip, margin, { xKey, yKey, zKey, groupKey }) {
    const chartFunctions = {
      bar: generateBarChart,
      groupedBar: generateGroupedBarChart,
      line: generateLineChart,
      area: generateAreaChart,
      pie: generatePieChart,
      doughnut: generateDonutChart,
      stackedBar: generateStackedBarChart,
      stackedBar100: generateStackedBar100Chart,
      scatter: generateScatterPlot,
      bubble: generateBubbleChart,
      histogram: generateHistogramChart,
      boxPlot: generateBoxPlot,
      heatmap: generateHeatmapChart,
      calendarHeatmap: generateCalendarHeatmap,
      radar: generateRadarChart,
      // treemap: generateTreemapChart,
      // sunburst: generateSunburstChart,
      stepLine: generateStepLineChart,
      slopeChart: generateSlopeChart,
      violinPlot: generateViolinPlot,
    };
  
    const chartFn = chartFunctions[type];
    if (chartFn) {
      chartFn(svg, width, height, data, tooltip, margin, xKey, yKey, groupKey);

    } else {
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("fill", "#666")
        .text(`Chart type "${type}" not implemented yet.`);
    }
  }

  return (
    <div 
      ref={chartRef} 
      className="chart-container" 
      style={{ 
        width: '100%', 
        height: `${dimensions.height}px`,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#f9f9f9',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '10px',
        left: '0',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="zoom-controls">
        <button onClick={() => window.handleZoomIn()} className="zoom-button">+</button>
        <button onClick={() => window.handleZoomOut()} className="zoom-button">-</button>
      </div>
    </div>
  );
};

export default ChartArea;