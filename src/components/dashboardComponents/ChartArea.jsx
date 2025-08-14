import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import * as d3 from 'd3';
import './ChartArea.css';
import chartUtils from '../../utils/chartUtils';


const ChartArea = forwardRef(({ data, chartType, xKey, yKey, zKey, groupKey, treeNameKey, treeValueKey, treeParentKey, treeHierarchyKeys, toolMode: propToolMode, chartColors }, ref) => {
  const chartRef = useRef(null);
  const tooltipRef = useRef(null);
  const svgRef = useRef(null);
  const gRef = useRef(null);
  const zoomRef = useRef(null);
  
  const [toolMode, setToolMode] = useState('pointer');
  const [crosshairX, setCrosshairX] = useState(null);
  const [crosshairY, setCrosshairY] = useState(null);
  const [crosshairData, setCrosshairData] = useState(null);
  const [zoomTransform, setZoomTransform] = useState(d3.zoomIdentity); 
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 400
  });
  const [isLargeDataset, setIsLargeDataset] = useState(false);
  const [sampledData, setSampledData] = useState(null);
  
  // Constants for performance optimization
  const MAX_CHART_POINTS = 5000; // Maximum points to render in charts
  const SAMPLING_THRESHOLD = 10000; // Start sampling above this many points
  
  // Update toolMode when prop changes
  useEffect(() => {
    if (propToolMode) {
      setToolMode(propToolMode);
    }
  }, [propToolMode]);
  
  // Data sampling for large datasets
  useEffect(() => {
    if (!data || data.length === 0) {
      setSampledData(null);
      setIsLargeDataset(false);
      return;
    }
    
    const isLarge = data.length > SAMPLING_THRESHOLD;
    setIsLargeDataset(isLarge);
    
    if (isLarge) {
      // Use systematic sampling to maintain data distribution
      const step = Math.ceil(data.length / MAX_CHART_POINTS);
      const sampled = data.filter((_, index) => index % step === 0);
      setSampledData(sampled);
    } else {
      setSampledData(data);
    }
  }, [data]);
  
  // Use sampled data for chart rendering
  const chartData = sampledData || data;
  
  // Color utility function - generate gradient colors based on primary color
  const generateColorGradient = (baseColor, steps) => {
    const colors = [];
    
    // Provide fallback color if baseColor is invalid
    const defaultColor = '#4caf50';
    const validBaseColor = baseColor || defaultColor;
    const base = d3.color(validBaseColor);
    
    // If color is still invalid, use a predefined palette
    if (!base) {
      const defaultPalette = ['#4caf50', '#2196f3', '#ff9800', '#e91e63', '#9c27b0', '#607d8b', '#795548', '#ff5722'];
      return defaultPalette.slice(0, steps);
    }
    
    for (let i = 0; i < steps; i++) {
      const factor = i / (steps - 1);
      // Create lighter and darker variations
      const lightness = 0.3 + (0.7 * (1 - factor)); // From light to dark
      const color = d3.hsl(base.h, base.s, lightness);
      colors.push(color.toString());
    }
    
    return colors;
  };

  // Convert hex to rgba - utility function
  const hexToRgba = (hex, opacity) => {
    if (!hex || typeof hex !== 'string') {
      hex = '#4caf50'; // Default color
    }
    const r = parseInt(hex.slice(1, 3), 16) || 76;
    const g = parseInt(hex.slice(3, 5), 16) || 175;
    const b = parseInt(hex.slice(5, 7), 16) || 80;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Create a dynamic color scale based on primary color
  const createColorScale = (domain, chartColors) => {
    // Extract primary color with fallback
    const primaryColor = chartColors?.primary || '#4caf50';
    const gradientColors = generateColorGradient(primaryColor, Math.max(domain.length, 3));
    return d3.scaleOrdinal(gradientColors).domain(domain);
  };

  // Create a sequential color scale for value-based coloring
  const createSequentialScale = (extent, chartColors) => {
    const primaryColor = chartColors?.primary || '#4caf50';
    const base = d3.color(primaryColor);
    
    if (!base) {
      // Fallback to a simple blue scale
      return d3.scaleSequential(d3.interpolateBlues).domain(extent);
    }
    
    const lightColor = d3.hsl(base.h, base.s * 0.3, 0.9).toString();
    const darkColor = d3.hsl(base.h, base.s * 1.2, 0.3).toString();
    
    return d3.scaleSequential()
      .domain(extent)
      .interpolator(d3.interpolate(lightColor, darkColor));
  };

  // Add legend function
  const addLegend = (svg, colorScale, legendData, chartColors) => {
    // Remove existing legend
    svg.selectAll('.legend').remove();
    
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', 'translate(20, 20)');

    const legendItems = legend.selectAll('.legend-item')
      .data(legendData)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 25})`);

    legendItems.append('rect')
      .attr('width', 18)
      .attr('height', 18)
      .attr('fill', d => colorScale(d))
      .attr('stroke', chartColors.axis || '#666666')
      .attr('stroke-width', 1);

    legendItems.append('text')
      .attr('x', 25)
      .attr('y', 14)
      .style('font-size', '12px')
      .style('fill', chartColors.text || '#333333')
      .text(d => d);
  };

  // Style axes with custom colors
  const styleAxes = (svg, chartColors) => {
    svg.selectAll('.tick text')
      .style('fill', chartColors.text || '#333333');
    
    svg.selectAll('.tick line')
      .style('stroke', chartColors.axis || '#666666');
    
    svg.selectAll('.domain')
      .style('stroke', chartColors.axis || '#666666');
    
    svg.selectAll('.axis-title')
      .style('fill', chartColors.text || '#333333')
      .style('font-weight', 'bold')
      .style('font-size', '14px');
  };
  
  // Enhanced zoom controls
  const zoomIn = () => {
    if (svgRef.current && zoomRef.current) {
      const newTransform = zoomTransform.scale(1.4);
      setZoomTransform(newTransform);
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomRef.current.transform, newTransform);
    }
  };

  const zoomOut = () => {
    if (svgRef.current && zoomRef.current) {
      const newTransform = zoomTransform.scale(0.7);
      setZoomTransform(newTransform);
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomRef.current.transform, newTransform);
    }
  };

  const resetZoom = () => {
    if (svgRef.current && zoomRef.current) {
      setZoomTransform(d3.zoomIdentity);
      d3.select(svgRef.current)
        .transition()
        .duration(500)
        .call(zoomRef.current.transform, d3.zoomIdentity);
    }
  };

  // Expose zoom functions to parent via ref
  useImperativeHandle(ref, () => ({
    zoomIn,
    zoomOut,
    resetZoom
  }), []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case '+':
          case '=':
            event.preventDefault();
            zoomIn();
            break;
          case '-':
            event.preventDefault();
            zoomOut();
            break;
          case '0':
            event.preventDefault();
            resetZoom();
            break;
        }
      } else {
        switch (event.key.toLowerCase()) {
          case 'p':
            event.preventDefault();
            setToolMode('pointer');
            break;
          case 'h':
            event.preventDefault();
            setToolMode('pan');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Enhanced crosshair for pointer mode
  useEffect(() => {
    if (!chartRef.current || toolMode !== 'pointer') {
      setCrosshairX(null);
      setCrosshairY(null);
      setCrosshairData(null);
      return;
    }

    const handleMouseMove = (event) => {
      const rect = chartRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      setCrosshairX(x);
      setCrosshairY(y);
      
      // Find closest data point for display
      if (data && data.length > 0) {
        const svg = d3.select(svgRef.current);
        const chartWidth = svg.attr('width') || rect.width;
        const chartHeight = svg.attr('height') || rect.height;
        
        // Simple data interpolation based on position
        const xRatio = (x - 12) / (chartWidth - 24); // Account for padding
        const dataIndex = Math.round(xRatio * (data.length - 1));
        
        if (dataIndex >= 0 && dataIndex < data.length) {
          const point = data[dataIndex];
          setCrosshairData({
            x: point[xKey] || 'N/A',
            y: point[yKey] || 'N/A',
            index: dataIndex
          });
        }
      }
    };

    const handleMouseLeave = () => {
      setCrosshairX(null);
      setCrosshairY(null);
      setCrosshairData(null);
    };

    chartRef.current.addEventListener('mousemove', handleMouseMove);
    chartRef.current.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (chartRef.current) {
        chartRef.current.removeEventListener('mousemove', handleMouseMove);
        chartRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [toolMode, data, xKey, yKey]);

  useEffect(() => {
    const updateDimensions = () => {
      if (chartRef.current) {
        const containerWidth = chartRef.current.clientWidth;
        setDimensions({
          width: containerWidth,
          height: 400
        });
      }
    };
    
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (chartRef.current) {
      resizeObserver.observe(chartRef.current);
    }
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      if (chartRef.current) resizeObserver.unobserve(chartRef.current);
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  useEffect(() => {
    if (!svgRef.current || !chartData || chartData.length === 0 || dimensions.width === 0) return;

    // Clear previous contents
    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const estimatedWidthPerItem = 50;
    const isScrollableChart = ['bar', 'column', 'line', 'area', 'scatter', 'bubble', 'stackedbar', 'stackedbar100'].includes(chartType);
    const virtualWidth = isScrollableChart
      ? Math.max(dimensions.width - 20, chartData.length * estimatedWidthPerItem) // Account for padding
      : dimensions.width - 20;

    // Set SVG dimensions
    d3.select(svgRef.current)
      .attr('width', virtualWidth)
      .attr('height', dimensions.height);

    // Create main group with margins
    const svg = d3.select(svgRef.current)
      .append('g')
      .attr('class', 'chart-content')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Store reference for zoom
    gRef.current = svg.node();

    // Setup zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.3, 8])
      .on('start', (event) => {
        if (toolMode === 'pan') {
          d3.select(svgRef.current.parentNode).style('cursor', 'grabbing');
        } else if (toolMode === 'pointer') {
          d3.select(svgRef.current.parentNode).style('cursor', 'crosshair');
        } else {
          d3.select(svgRef.current.parentNode).style('cursor', 'default');
        }
      })
      .on('zoom', (event) => {
        const { transform } = event;
        setZoomTransform(transform); // Store zoom state
        // Apply zoom transformation
        svg.attr('transform', `translate(${margin.left},${margin.top}) ${transform}`);
      })
      .on('end', (event) => {
        if (toolMode === 'pan') {
          d3.select(svgRef.current.parentNode).style('cursor', 'grab');
        } else if (toolMode === 'pointer') {
          d3.select(svgRef.current.parentNode).style('cursor', 'crosshair');
        } else {
          d3.select(svgRef.current.parentNode).style('cursor', 'default');
        }
      });

    zoomRef.current = zoom;

    // Apply zoom behavior based on mode and restore previous zoom state
    if (toolMode === 'pan') {
      // Enable full zoom and pan functionality
      d3.select(svgRef.current)
        .call(zoom)
        .call(zoom.transform, zoomTransform); // Restore previous zoom
    } else {
      // In pointer mode, enable zoom but disable pan dragging
      d3.select(svgRef.current)
        .call(zoom)
        .call(zoom.transform, zoomTransform) // Restore previous zoom
        .on('mousedown.zoom', null) // Disable pan dragging
        .on('touchstart.zoom', null); // Disable touch pan
    }

    // Add chart title
    const chartTitle = getChartTitle(chartType);
    svg.append("text")
      .attr("x", (virtualWidth - margin.left - margin.right) / 2)
      .attr("y", -margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-family", "sans-serif")
      .style("font-weight", "bold")
      .text(chartTitle);

    // Draw the chart
    drawChart(
      chartType, 
      svg, 
      virtualWidth - margin.left - margin.right, 
      dimensions.height - margin.top - margin.bottom, 
      chartData, 
      d3.select(tooltipRef.current), 
      margin, 
      { xKey, yKey, zKey, groupKey, treeHierarchyKeys, treeValueKey, treeNameKey, treeParentKey }
    );
  }, [chartData, chartType, xKey, yKey, zKey, groupKey, treeHierarchyKeys, treeValueKey, treeNameKey, treeParentKey, dimensions.width, toolMode, chartColors]);
  


  const getChartTitle = (type) => {
    const titles = {
      'bar': 'Bar Chart',
      'groupbar': 'Grouped Bar Chart',
      'line': 'Line Chart',
      'area': 'Area Chart',
      'pie': 'Pie Chart',
      'stackedbar': 'Stacked Bar Chart',
      'stackedbar100': 'Stacked Bar Chart 100',
      'scatter': 'Scatter Plot',
      'bubble': 'Bubble Chart',
      'histogram': 'Histogram', 
      'boxplot': 'Box Plot',
      'heatmap': 'Heat Map',
      'calendarheatmap': 'Calendar Heat Map',
      'radar': 'Radar Chart',
      'sunburst': 'Sunburst Chart',
      'stepline': 'Step Line Chart',
      'slope': 'Slope Chart',
      'violinplot': 'Violin Plot'
    };
    return titles[type] || `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`;
  };

  const generateBarChart = (svg, width, height, data, tooltip, margin, xKey, yKey, groupKey, chartColors) => {
    try {
      // Validate data
      chartUtils.validateData(data);
      
      // Determine keys with fallbacks
      const xKeyUsed = xKey || Object.keys(data[0])[0];
      const yKeyUsed = yKey || Object.keys(data[0])[1];
      
      // Process data
      const processedData = data.map(d => ({
        ...d,
        [xKeyUsed]: d[xKeyUsed],
        [yKeyUsed]: parseFloat(d[yKeyUsed]) || 0
      })).filter(d => !isNaN(d[yKeyUsed]));
      
      if (processedData.length === 0) {
        throw new Error('No valid numeric data found');
      }
      
      const xValues = processedData.map(d => d[xKeyUsed]);
      const yValues = processedData.map(d => d[yKeyUsed]);
      
      // Create optimal scales
      const xScale = d3.scaleBand()
        .domain(xValues)
        .range([0, width])
        .padding(0.2);
        
      const yScaleConfig = chartUtils.createOptimalScale(yValues, 'linear', 0.1);
      const yScale = d3.scaleLinear()
        .domain(yScaleConfig.domain)
        .range([height, 0])
        .nice();
      
      // Create color scale
      const colorScale = chartUtils.createSequentialColorScale([d3.min(yValues), d3.max(yValues)], chartColors.primary);
      
      // Create bars with enhanced animation
      const bars = svg.selectAll('rect')
        .data(processedData)
        .enter()
        .append('rect')
        .attr('x', d => xScale(d[xKeyUsed]))
        .attr('y', height)
        .attr('width', xScale.bandwidth())
        .attr('height', 0)
        .attr('fill', d => colorScale(d[yKeyUsed]))
        .attr('stroke', chartColors.axis || '#666')
        .attr('stroke-width', 0.5)
        .attr('opacity', 0.8)
        .style('cursor', 'pointer');
      
      // Enhanced hover interactions
      bars
        .on('mouseover', function(event, d) {
          if (toolMode !== 'pointer') return;
          
          d3.select(this)
            .transition()
            .duration(200)
            .attr('opacity', 1)
            .attr('stroke', d3.color(chartColors.primary).darker(1))
            .attr('stroke-width', 2);
            
          const tooltipContent = `
            <div style="font-weight: bold; margin-bottom: 5px;">${d[xKeyUsed]}</div>
            <div>${yKeyUsed}: <strong>${d[yKeyUsed].toLocaleString()}</strong></div>
          `;
          
          chartUtils.showTooltip(tooltip, tooltipContent, event.pageX, event.pageY);
        })
        .on('mouseout', function() {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('opacity', 0.8)
            .attr('stroke', chartColors.axis || '#666')
            .attr('stroke-width', 0.5);
            
          chartUtils.hideTooltip(tooltip);
        });
      
      // Animate bars
      bars
        .transition()
        .duration(800)
        .delay((d, i) => i * 50)
        .attr('y', d => yScale(d[yKeyUsed]))
        .attr('height', d => Math.max(0, height - yScale(d[yKeyUsed])));
      
      // Add axes with improved styling
      const xAxis = svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale));
      
      const yAxis = svg.append('g')
        .call(d3.axisLeft(yScale).tickFormat(d3.format('.2s')));
      
      // Add axis labels
      svg.append('text')
        .attr('class', 'axis-title')
        .attr('text-anchor', 'middle')
        .attr('x', width / 2)
        .attr('y', height + margin.bottom - 10)
        .style('font-size', '14px')
        .style('font-weight', 'bold')
        .style('fill', chartColors.text || '#333')
        .text(xKeyUsed);
      
      svg.append('text')
        .attr('class', 'axis-title')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -margin.left + 15)
        .style('font-size', '14px')
        .style('font-weight', 'bold')
        .style('fill', chartColors.text || '#333')
        .text(yKeyUsed);

      // Apply custom styling to axes
      styleAxes(svg, chartColors);

      // Add value range legend
      const valueRanges = ['Low', 'Medium', 'High'];
      const legendColorScale = d3.scaleOrdinal()
        .domain(valueRanges)
        .range([
          colorScale(d3.min(yValues)),
          colorScale(d3.mean(yValues)),
          colorScale(d3.max(yValues))
        ]);
      
      addLegend(svg, legendColorScale, valueRanges, chartColors);
      
    } catch (error) {
      console.error('Error generating bar chart:', error);
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("fill", "#ff4444")
        .text(`Error: ${error.message}`);
    }
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

  const generateLineChart = (svg, width, height, data, tooltip, margin, xKey, yKey, groupKey, chartColors) => {
    try {
      // Validate data
      chartUtils.validateData(data);
      
      const xKeyUsed = xKey || Object.keys(data[0])[0];
      const yKeyUsed = yKey || Object.keys(data[0])[1];

      // Process data with proper type conversion and sorting
      const processedData = data.map(d => ({
        ...d,
        [xKeyUsed]: d[xKeyUsed],
        [yKeyUsed]: parseFloat(d[yKeyUsed]) || 0
      })).filter(d => !isNaN(d[yKeyUsed]));
      
      if (processedData.length === 0) {
        throw new Error('No valid numeric data found');
      }
      
      // Sort data if x-axis contains dates or numbers
      const firstXValue = processedData[0][xKeyUsed];
      const isDate = !isNaN(Date.parse(firstXValue));
      const isNumeric = !isNaN(parseFloat(firstXValue));
      
      if (isDate) {
        processedData.sort((a, b) => new Date(a[xKeyUsed]) - new Date(b[xKeyUsed]));
      } else if (isNumeric) {
        processedData.sort((a, b) => parseFloat(a[xKeyUsed]) - parseFloat(b[xKeyUsed]));
      }

      const xValues = processedData.map(d => d[xKeyUsed]);
      const yValues = processedData.map(d => d[yKeyUsed]);
      
      // Create scales
      let xScale;
      if (isDate) {
        xScale = d3.scaleTime()
          .domain(d3.extent(xValues, d => new Date(d)))
          .range([0, width]);
      } else if (isNumeric) {
        xScale = d3.scaleLinear()
          .domain(d3.extent(xValues, d => parseFloat(d)))
          .range([0, width]);
      } else {
        xScale = d3.scalePoint()
          .domain(xValues)
          .range([0, width])
          .padding(0.1);
      }
      
      const yScaleConfig = chartUtils.createOptimalScale(yValues, 'linear', 0.1);
      const yScale = d3.scaleLinear()
        .domain(yScaleConfig.domain)
        .range([height, 0])
        .nice();
      
      // Create line generator
      const line = d3.line()
        .x(d => xScale(isDate ? new Date(d[xKeyUsed]) : (isNumeric ? parseFloat(d[xKeyUsed]) : d[xKeyUsed])))
        .y(d => yScale(d[yKeyUsed]))
        .curve(d3.curveMonotoneX); // Smooth curve
      
      // Add gradient definition
      const gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "line-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0).attr("y1", height)
        .attr("x2", 0).attr("y2", 0);
      
      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", d3.color(chartColors.primary).brighter(1))
        .attr("stop-opacity", 0.1);
      
      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", chartColors.primary)
        .attr("stop-opacity", 0.8);
      
      // Draw line with animation
      const path = svg.append('path')
        .datum(processedData)
        .attr('fill', 'none')
        .attr('stroke', chartColors.primary)
        .attr('stroke-width', 3)
        .attr('stroke-linecap', 'round')
        .attr('stroke-linejoin', 'round')
        .attr('d', line);
      
      // Animate line drawing
      const pathLength = path.node().getTotalLength();
      path
        .attr('stroke-dasharray', pathLength)
        .attr('stroke-dashoffset', pathLength)
        .transition()
        .duration(1500)
        .ease(d3.easeQuadInOut)
        .attr('stroke-dashoffset', 0);
      
      // Add data points with enhanced interactions
      const circles = svg.selectAll('.data-point')
        .data(processedData)
        .enter()
        .append('circle')
        .attr('class', 'data-point')
        .attr('cx', d => xScale(isDate ? new Date(d[xKeyUsed]) : (isNumeric ? parseFloat(d[xKeyUsed]) : d[xKeyUsed])))
        .attr('cy', d => yScale(d[yKeyUsed]))
        .attr('r', 0)
        .attr('fill', chartColors.primary)
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer');
      
      // Enhanced hover interactions
      circles
        .on('mouseover', function(event, d) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('r', 8)
            .attr('stroke', d3.color(chartColors.primary).darker(1))
            .attr('stroke-width', 3);
            
          const tooltipContent = `
            <div style="font-weight: bold; margin-bottom: 5px;">${d[xKeyUsed]}</div>
            <div>${yKeyUsed}: <strong>${d[yKeyUsed].toLocaleString()}</strong></div>
          `;
          
          chartUtils.showTooltip(tooltip, tooltipContent, event.pageX, event.pageY);
          
          // Add hover line
          svg.append('line')
            .attr('class', 'hover-line')
            .attr('x1', xScale(isDate ? new Date(d[xKeyUsed]) : (isNumeric ? parseFloat(d[xKeyUsed]) : d[xKeyUsed])))
            .attr('x2', xScale(isDate ? new Date(d[xKeyUsed]) : (isNumeric ? parseFloat(d[xKeyUsed]) : d[xKeyUsed])))
            .attr('y1', 0)
            .attr('y2', height)
            .attr('stroke', chartColors.primary)
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '3,3')
            .attr('opacity', 0.7);
        })
        .on('mouseout', function() {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('r', 5)
            .attr('stroke', 'white')
            .attr('stroke-width', 2);
            
          chartUtils.hideTooltip(tooltip);
          svg.selectAll('.hover-line').remove();
        });
      
      // Animate circles
      circles
        .transition()
        .delay((d, i) => i * 100 + 1000)
        .duration(500)
        .attr('r', 5);
      
      // Add axes with improved formatting
      const xAxis = svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(isDate ? d3.axisBottom(xScale).tickFormat(d3.timeFormat('%b %d')) : 
              isNumeric ? d3.axisBottom(xScale).tickFormat(d3.format('.2s')) : 
              d3.axisBottom(xScale));

      const yAxis = svg.append('g')
        .call(d3.axisLeft(yScale).tickFormat(d3.format('.2s')));
      
      // Add axis labels
      svg.append('text')
        .attr('class', 'axis-title')
        .attr('text-anchor', 'middle')
        .attr('x', width / 2)
        .attr('y', height + margin.bottom - 10)
        .style('font-size', '14px')
        .style('font-weight', 'bold')
        .style('fill', chartColors.text || '#333')
        .text(xKeyUsed);
      
      svg.append('text')
        .attr('class', 'axis-title')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -margin.left + 15)
        .style('font-size', '14px')
        .style('font-weight', 'bold')
        .style('fill', chartColors.text || '#333')
        .text(yKeyUsed);

      // Apply custom styling
      styleAxes(svg, chartColors);
      
    } catch (error) {
      console.error('Error generating line chart:', error);
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("fill", "#ff4444")
        .text(`Error: ${error.message}`);
    }
  };

  const generateAreaChart = (svg, width, height, data, tooltip, margin, xKey, yKey, groupKey, chartColors) => {
    try {
      // Validate data
      chartUtils.validateData(data);
      
      const xKeyUsed = xKey || Object.keys(data[0])[0];
      const yKeyUsed = yKey || Object.keys(data[0])[1];

      // Process data with proper type conversion and sorting
      const processedData = data.map(d => ({
        ...d,
        [xKeyUsed]: d[xKeyUsed],
        [yKeyUsed]: parseFloat(d[yKeyUsed]) || 0
      })).filter(d => !isNaN(d[yKeyUsed]));
      
      if (processedData.length === 0) {
        throw new Error('No valid numeric data found');
      }
      
      // Sort data if x-axis contains dates or numbers
      const firstXValue = processedData[0][xKeyUsed];
      const isDate = !isNaN(Date.parse(firstXValue));
      const isNumeric = !isNaN(parseFloat(firstXValue));
      
      if (isDate) {
        processedData.sort((a, b) => new Date(a[xKeyUsed]) - new Date(b[xKeyUsed]));
      } else if (isNumeric) {
        processedData.sort((a, b) => parseFloat(a[xKeyUsed]) - parseFloat(b[xKeyUsed]));
      }

      const xValues = processedData.map(d => d[xKeyUsed]);
      const yValues = processedData.map(d => d[yKeyUsed]);
      
      // Create scales
      let xScale;
      if (isDate) {
        xScale = d3.scaleTime()
          .domain(d3.extent(xValues, d => new Date(d)))
          .range([0, width]);
      } else if (isNumeric) {
        xScale = d3.scaleLinear()
          .domain(d3.extent(xValues, d => parseFloat(d)))
          .range([0, width]);
      } else {
        xScale = d3.scalePoint()
          .domain(xValues)
          .range([0, width])
          .padding(0.1);
      }
      
      const yScaleConfig = chartUtils.createOptimalScale(yValues, 'linear', 0.1);
      const yScale = d3.scaleLinear()
        .domain(yScaleConfig.domain)
        .range([height, 0])
        .nice();
      
      // Create gradient definition
      const gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "area-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0).attr("y1", height)
        .attr("x2", 0).attr("y2", 0);
      
      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", chartColors.primary)
        .attr("stop-opacity", 0.1);
      
      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", chartColors.primary)
        .attr("stop-opacity", 0.8);
      
      // Create area generator
      const area = d3.area()
        .x(d => xScale(isDate ? new Date(d[xKeyUsed]) : (isNumeric ? parseFloat(d[xKeyUsed]) : d[xKeyUsed])))
        .y0(height)
        .y1(d => yScale(d[yKeyUsed]))
        .curve(d3.curveMonotoneX);
      
      // Create line generator for top border
      const line = d3.line()
        .x(d => xScale(isDate ? new Date(d[xKeyUsed]) : (isNumeric ? parseFloat(d[xKeyUsed]) : d[xKeyUsed])))
        .y(d => yScale(d[yKeyUsed]))
        .curve(d3.curveMonotoneX);
      
      // Add area with animation
      const areaPath = svg.append('path')
        .datum(processedData)
        .attr('fill', 'url(#area-gradient)')
        .attr('stroke', 'none')
        .attr('d', area);
      
      // Add line border
      const linePath = svg.append('path')
        .datum(processedData)
        .attr('fill', 'none')
        .attr('stroke', chartColors.primary)
        .attr('stroke-width', 3)
        .attr('stroke-linecap', 'round')
        .attr('d', line);
      
      // Animate area and line
      const pathLength = linePath.node().getTotalLength();
      linePath
        .attr('stroke-dasharray', pathLength)
        .attr('stroke-dashoffset', pathLength)
        .transition()
        .duration(1500)
        .ease(d3.easeQuadInOut)
        .attr('stroke-dashoffset', 0);
      
      // Animate area fill
      areaPath
        .style('opacity', 0)
        .transition()
        .delay(500)
        .duration(1000)
        .style('opacity', 1);
      
      // Add data points
      const circles = svg.selectAll('.data-point')
        .data(processedData)
        .enter()
        .append('circle')
        .attr('class', 'data-point')
        .attr('cx', d => xScale(isDate ? new Date(d[xKeyUsed]) : (isNumeric ? parseFloat(d[xKeyUsed]) : d[xKeyUsed])))
        .attr('cy', d => yScale(d[yKeyUsed]))
        .attr('r', 0)
        .attr('fill', chartColors.primary)
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer');
      
      // Enhanced hover interactions
      circles
        .on('mouseover', function(event, d) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('r', 8)
            .attr('stroke', d3.color(chartColors.primary).darker(1))
            .attr('stroke-width', 3);
            
          const tooltipContent = `
            <div style="font-weight: bold; margin-bottom: 5px;">${d[xKeyUsed]}</div>
            <div>${yKeyUsed}: <strong>${d[yKeyUsed].toLocaleString()}</strong></div>
          `;
          
          chartUtils.showTooltip(tooltip, tooltipContent, event.pageX, event.pageY);
          
          // Add hover line
          svg.append('line')
            .attr('class', 'hover-line')
            .attr('x1', xScale(isDate ? new Date(d[xKeyUsed]) : (isNumeric ? parseFloat(d[xKeyUsed]) : d[xKeyUsed])))
            .attr('x2', xScale(isDate ? new Date(d[xKeyUsed]) : (isNumeric ? parseFloat(d[xKeyUsed]) : d[xKeyUsed])))
            .attr('y1', 0)
            .attr('y2', height)
            .attr('stroke', chartColors.primary)
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '3,3')
            .attr('opacity', 0.7);
        })
        .on('mouseout', function() {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('r', 4)
            .attr('stroke', 'white')
            .attr('stroke-width', 2);
            
          chartUtils.hideTooltip(tooltip);
          svg.selectAll('.hover-line').remove();
        });
      
      // Animate circles
      circles
        .transition()
        .delay((d, i) => i * 100 + 1000)
        .duration(500)
        .attr('r', 4);
      
      // Add axes with improved formatting
      const xAxis = svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(isDate ? d3.axisBottom(xScale).tickFormat(d3.timeFormat('%b %d')) : 
              isNumeric ? d3.axisBottom(xScale).tickFormat(d3.format('.2s')) : 
              d3.axisBottom(xScale));

      const yAxis = svg.append('g')
        .call(d3.axisLeft(yScale).tickFormat(d3.format('.2s')));
      
      // Add axis labels
      svg.append('text')
        .attr('class', 'axis-title')
        .attr('text-anchor', 'middle')
        .attr('x', width / 2)
        .attr('y', height + margin.bottom - 10)
        .style('font-size', '14px')
        .style('font-weight', 'bold')
        .style('fill', chartColors.text || '#333')
        .text(xKeyUsed);
      
      svg.append('text')
        .attr('class', 'axis-title')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -margin.left + 15)
        .style('font-size', '14px')
        .style('font-weight', 'bold')
        .style('fill', chartColors.text || '#333')
        .text(yKeyUsed);

      // Apply custom styling
      styleAxes(svg, chartColors);
      
    } catch (error) {
      console.error('Error generating area chart:', error);
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("fill", "#ff4444")
        .text(`Error: ${error.message}`);
    }
  };

  const generatePieChart = (svg, width, height, data, tooltip, margin, xKey, yKey, groupKey, chartColors) => {
    try {
      // Validate data
      chartUtils.validateData(data);
      
      const valueKey = yKey || Object.keys(data[0])[1]; 
      const categoryKey = xKey || Object.keys(data[0])[0];
      
      // Process data - aggregate if necessary
      const processedData = chartUtils.aggregateData(data, categoryKey, valueKey, 'sum');
      
      if (processedData.length === 0) {
        throw new Error('No valid data found for pie chart');
      }
      
      const values = processedData.map(d => Math.abs(parseFloat(d[valueKey]) || 0));
      const categories = processedData.map(d => d[categoryKey]);
      
      // Filter out zero values
      const validData = processedData
        .map((d, i) => ({ category: categories[i], value: values[i], originalData: d }))
        .filter(d => d.value > 0);
      
      if (validData.length === 0) {
        throw new Error('No positive values found for pie chart');
      }
      
      const radius = Math.min(width, height) / 2 - 10;
      const colorScale = chartUtils.createCategoricalColorScale(validData.map(d => d.category), chartColors.primary);
      
      const pie = d3.pie()
        .value(d => d.value)
        .sort((a, b) => b.value - a.value); // Sort by value descending
        
      const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius * 0.8);
      
      // For label positioning
      const outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);
      
      // Center the pie chart
      const g = svg.append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

      // Create pie data
      const pieData = pie(validData);

      // Add slices with enhanced animation
      const slices = g.selectAll('.pie-slice')
        .data(pieData)
        .enter()
        .append('path')
        .attr('class', 'pie-slice')
        .attr('fill', d => colorScale(d.data.category))
        .attr('stroke', 'white')
        .style('stroke-width', '2px')
        .style('opacity', 0.9)
        .style('cursor', 'pointer')
        .on('mouseover', function(event, d) {
          d3.select(this)
            .transition()
            .duration(200)
            .style('opacity', 1)
            .attr('transform', () => {
              const centroid = arc.centroid(d);
              return `translate(${centroid[0] * 0.1}, ${centroid[1] * 0.1})`;
            });
            
          const percentage = ((d.data.value / d3.sum(validData, dd => dd.value)) * 100).toFixed(1);
          const tooltipContent = `
            <div style="font-weight: bold; margin-bottom: 5px;">${d.data.category}</div>
            <div>Value: <strong>${d.data.value.toLocaleString()}</strong></div>
            <div>Percentage: <strong>${percentage}%</strong></div>
          `;
          
          chartUtils.showTooltip(tooltip, tooltipContent, event.pageX, event.pageY);
        })
        .on('mouseout', function(event, d) {
          d3.select(this)
            .transition()
            .duration(200)
            .style('opacity', 0.9)
            .attr('transform', 'translate(0, 0)');
            
          chartUtils.hideTooltip(tooltip);
        });
      
      // Animate slice appearance
      slices
        .attr('d', d => {
          const startAngle = d.startAngle;
          return arc({ ...d, endAngle: startAngle });
        })
        .transition()
        .duration(1000)
        .delay((d, i) => i * 100)
        .attrTween('d', function(d) {
          const interpolate = d3.interpolate({ ...d, endAngle: d.startAngle }, d);
          return function(t) {
            return arc(interpolate(t));
          };
        });

      // Add labels with leader lines for better readability
      const labels = g.selectAll('.pie-label')
        .data(pieData)
        .enter()
        .append('g')
        .attr('class', 'pie-label');

      // Add leader lines
      labels.append('polyline')
        .attr('fill', 'none')
        .attr('stroke', chartColors.text || '#333')
        .attr('stroke-width', 1)
        .attr('opacity', 0)
        .attr('points', d => {
          const centroid = arc.centroid(d);
          const outerCentroid = outerArc.centroid(d);
          const labelPos = [outerCentroid[0] * 1.2, outerCentroid[1] * 1.2];
          return [centroid, outerCentroid, labelPos];
        })
        .transition()
        .delay(1500)
        .duration(500)
        .attr('opacity', 0.6);

      // Add text labels
      labels.append('text')
        .attr('transform', d => {
          const centroid = outerArc.centroid(d);
          const x = centroid[0] * 1.2;
          const y = centroid[1] * 1.2;
          return `translate(${x}, ${y})`;
        })
        .attr('text-anchor', d => {
          const centroid = outerArc.centroid(d);
          return centroid[0] > 0 ? 'start' : 'end';
        })
        .style('font-size', '12px')
        .style('fill', chartColors.text || '#333')
        .style('font-weight', '500')
        .style('opacity', 0)
        .text(d => {
          const percentage = ((d.data.value / d3.sum(validData, dd => dd.value)) * 100).toFixed(1);
          return `${d.data.category} (${percentage}%)`;
        })
        .transition()
        .delay(2000)
        .duration(500)
        .style('opacity', 1);

      // Add center total value
      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '-0.5em')
        .style('font-size', '18px')
        .style('font-weight', 'bold')
        .style('fill', chartColors.text || '#333')
        .style('opacity', 0)
        .text('Total')
        .transition()
        .delay(2500)
        .duration(500)
        .style('opacity', 1);

      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '1em')
        .style('font-size', '16px')
        .style('fill', chartColors.text || '#333')
        .style('opacity', 0)
        .text(d3.sum(validData, d => d.value).toLocaleString())
        .transition()
        .delay(2500)
        .duration(500)
        .style('opacity', 1);

      // Add legend
      const legendData = validData.map(d => d.category);
      addLegend(svg, colorScale, legendData, chartColors);
      
    } catch (error) {
      console.error('Error generating pie chart:', error);
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("fill", "#ff4444")
        .text(`Error: ${error.message}`);
    }
  };

  const generateScatterPlot = (svg, width, height, data, tooltip, margin, xKey, yKey, groupKey, chartColors) => {
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
      .attr('fill', chartColors.primary)
      .attr('opacity', 0.7)
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('r', 8)
          .attr('opacity', 1)
          .attr('stroke', d3.color(chartColors.primary).darker(1))
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

    // Apply custom styling to axes
    styleAxes(svg, chartColors);
  };

  const generateStackedBarChart = (svg, width, height, data, tooltip, margin, xKey, yKey, groupKey, chartColors) => {
    const keys = Object.keys(data[0]).slice(1);
    const xKeyUsed = xKey || Object.keys(data[0])[0];

    const x = d3.scaleBand()
      .domain(data.map(d => d[xKeyUsed]))
      .range([0, width])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d3.sum(keys, k => +d[k])) * 1.1])
      .range([height, 0]);

    const color = createColorScale(keys, chartColors);
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
    addLegend(svg, color, keys, chartColors);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em');

    svg.append("g")
      .call(d3.axisLeft(y));
    styleAxes(svg, chartColors);
  }

  const generateStackedBar100Chart = (svg, width, height, data, tooltip, margin, xKey, yKey, groupKey, chartColors) => {
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

    const color = createColorScale(keys, chartColors);
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
    addLegend(svg, color, keys, chartColors);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em');
    svg.append("g").call(d3.axisLeft(y));
    styleAxes(svg, chartColors);
  };

  const generateBubbleChart = (svg, width, height, data, tooltip, margin, xKey, yKey, groupKey, chartColors) => {

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

  const generateHistogramChart = (svg, width, height, data, tooltip, margin, xKey, yKey, groupKey, chartColors) => {
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
    
    // Color scale for bubbles
    const color = createColorScale(data.map(d => d[xKeyUsed]), chartColors);

    // Add bubbles with animation
    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(+d[xKeyUsed]))
      .attr("cy", height) // Start from bottom for animation
      .attr("r", 0) // Start with radius 0 for animation
      .attr("fill", d => color(d[xKeyUsed]))
      .attr("fill-opacity", 0.7)
      .attr("stroke", d3.color(chartColors.primary).darker(1))
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
      .duration(800)
      .attr("cy", d => yScale(+d[yKeyUsed]))
      .attr("r", d => sizeScale(+d[sizeKey]));

    // Add axes
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));
    svg.append("g")
      .call(d3.axisLeft(yScale));
    styleAxes(svg, chartColors);
    // Add legend for bubble size
    const legendData = [d3.min(sizeValues), d3.mean(sizeValues), d3.max(sizeValues)];
    const legendColorScale = d3.scaleOrdinal()
      .domain(legendData)
      .range(legendData.map(() => chartColors.primary));
    addLegend(svg, legendColorScale, legendData.map(v => `${sizeKey}: ${v}`), chartColors);
  };

  const generateBoxPlot = (svg, width, height, rawData, tooltip, margin, xKey, yKey, groupKey, chartColors) => {
    const categoryKey = xKey || Object.keys(rawData[0])[0];
    const valueKey = yKey || Object.keys(rawData[0])[1];
    
    // Group data by category
    const groupedData = d3.group(rawData, d => d[categoryKey]);
    
    // Calculate statistics for each group
    const stats = [];
    groupedData.forEach((values, key) => {
      const numericValues = values.map(d => +d[valueKey]).sort(d3.ascending);
      const q1 = d3.quantile(numericValues, 0.25);
      const median = d3.quantile(numericValues, 0.5);
      const q3 = d3.quantile(numericValues, 0.75);
      const iqr = q3 - q1;
      const min = Math.max(d3.min(numericValues), q1 - 1.5 * iqr);
      const max = Math.min(d3.max(numericValues), q3 + 1.5 * iqr);
      const outliers = numericValues.filter(d => d < min || d > max);
      
      stats.push({ key, q1, median, q3, min, max, outliers });
    });
    
    // Set up scales
    const x = d3.scaleBand()
      .domain(stats.map(d => d.key))
      .range([0, width])
      .padding(0.2);
    
    const y = d3.scaleLinear()
      .domain([d3.min(stats, d => d.min), d3.max(stats, d => d.max)])
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
      .attr("fill", hexToRgba(chartColors.primary, 0.8))
      .attr("stroke", chartColors.primary);
  
    boxes.append("line")
      .attr("x1", 0)
      .attr("x2", x.bandwidth())
      .attr("y1", d => y(d.median))
      .attr("y2", d => y(d.median))
      .attr("stroke", chartColors.text || "#333")
      .attr("stroke-width", 2);
  
    boxes.append("line")
      .attr("x1", x.bandwidth() / 2)
      .attr("x2", x.bandwidth() / 2)
      .attr("y1", d => y(d.min))
      .attr("y2", d => y(d.q1))
      .attr("stroke", chartColors.text || "#333");
  
    boxes.append("line")
      .attr("x1", x.bandwidth() / 2)
      .attr("x2", x.bandwidth() / 2)
      .attr("y1", d => y(d.q3))
      .attr("y2", d => y(d.max))
      .attr("stroke", chartColors.text || "#333");
  
    boxes.append("line")
      .attr("x1", x.bandwidth() * 0.25)
      .attr("x2", x.bandwidth() * 0.75)
      .attr("y1", d => y(d.min))
      .attr("y2", d => y(d.min))
      .attr("stroke", chartColors.text || "#333");
  
    boxes.append("line")
      .attr("x1", x.bandwidth() * 0.25)
      .attr("x2", x.bandwidth() * 0.75)
      .attr("y1", d => y(d.max))
      .attr("y2", d => y(d.max))
      .attr("stroke", chartColors.text || "#333");
  
    // Outliers
    stats.forEach((stat, i) => {
      svg.selectAll(".outlier" + i)
        .data(stat.outliers)
        .enter()
        .append("circle")
        .attr("cx", x(stat.key) + x.bandwidth() / 2)
        .attr("cy", d => y(d))
        .attr("r", 3)
        .attr("fill", d3.color(chartColors.primary).darker(2))
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

    // Apply custom styling to axes
    styleAxes(svg, chartColors);
  };

  const generateHeatmapChart = (svg, width, height, data, tooltip, margin, xKey, yKey, groupKey, chartColors) => {
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
    
    // Set up color scale using chartColors
    const values = data.map(d => +d[valueKey]);
    const colorScale = createSequentialScale(values, chartColors);
    
    // Add cells
    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => x(d[xKeyUsed]))
      .attr("y", d => y(d[yKeyUsed]))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("fill", d => colorScale(+d[valueKey]))
      .attr("opacity", 0) // Start transparent for animation
      .on("mouseover", function(event, d) {
        d3.select(this)
          .attr("stroke", chartColors.axis || "#333")
          .attr("stroke-width", 2);
          
        tooltip
          .style("opacity", 1)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px")
          .html(`<strong>${xKeyUsed}: ${d[xKeyUsed]}</strong><br>${yKeyUsed}: ${d[yKeyUsed]}<br>${valueKey}: ${d[valueKey]}`);
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

  const generateRadarChart = (svg, width, height, data, tooltip, margin, xKey, yKey, groupKey, chartColors) => {
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
  
  const generateCalendarHeatmap = (svg, width, height, data, tooltip, margin, xKey, yKey, groupKey, chartColors) => {  
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
  

  const generateStepLineChart = (svg, width, height, data, tooltip, margin, xKey, yKey, groupKey, chartColors) => {
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
  

  const generateSlopeChart = (svg, width, height, data, tooltip, margin, xKey, yKey, groupKey, chartColors) => {
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

  const generateViolinPlot = (svg, width, height, data, tooltip, margin, xKey, yKey, groupKey, chartColors) => {
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
    try {
      // Validate input parameters
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('No valid data provided');
      }
      
      if (width <= 0 || height <= 0) {
        throw new Error('Invalid chart dimensions');
      }
      
      // Sample data for performance if dataset is very large
      const sampledData = chartUtils.sampleData(data, 5000);
      if (sampledData.length < data.length) {
        console.warn(`Data sampled from ${data.length} to ${sampledData.length} points for performance`);
      }
      
      const chartFunctions = {
        bar: generateBarChart,
        groupedBar: generateGroupedBarChart,
        line: generateLineChart,
        area: generateAreaChart,
        pie: generatePieChart,
        stackedBar: generateStackedBarChart,
        stackedBar100: generateStackedBar100Chart,
        scatter: generateScatterPlot,
        bubble: generateBubbleChart,
        histogram: generateHistogramChart,
        boxPlot: generateBoxPlot,
        heatmap: generateHeatmapChart,
        calendarHeatmap: generateCalendarHeatmap,
        radar: generateRadarChart,
        stepLine: generateStepLineChart,
        slopeChart: generateSlopeChart,
        violinPlot: generateViolinPlot,
      };
    
      const chartFn = chartFunctions[type];
      if (chartFn) {
        // Call chart function with proper error boundary
        try {
          chartFn(svg, width, height, sampledData, tooltip, margin, xKey, yKey, groupKey, chartColors);
        } catch (chartError) {
          console.error(`Error in ${type} chart generation:`, chartError);
          throw new Error(`Failed to generate ${type} chart: ${chartError.message}`);
        }
      } else {
        svg.append("text")
          .attr("x", width / 2)
          .attr("y", height / 2)
          .attr("text-anchor", "middle")
          .style("font-size", "16px")
          .style("fill", chartColors?.text || "#666")
          .text(`Chart type "${type}" not implemented yet.`);
      }
      
    } catch (error) {
      console.error('Error in drawChart:', error);
      svg.selectAll('*').remove(); // Clear any partial renders
      
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2 - 20)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("fill", "#ff4444")
        .style("font-weight", "bold")
        .text("Chart Generation Error");
        
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2 + 10)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("fill", "#666")
        .text(error.message || "An unexpected error occurred");
        
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2 + 35)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", "#999")
        .text("Please check your data format and try again");
    }
  }
  const buttonStyle = {
    padding: '6px 10px',
    fontSize: '16px',
    background: '#2d3748',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background 0.3s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
  };


  return (
    <div 
      className="chart-area" 
      style={{ 
        position: 'relative',
          cursor: toolMode === 'pan' ? 'grab' : (toolMode === 'pointer' ? 'crosshair' : 'default'),
        userSelect: 'none'
      }}
    >
      {/* Performance indicator for large datasets */}
      {isLargeDataset && (
        <div 
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'rgba(245, 158, 11, 0.9)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 'bold',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span>⚡</span>
          <span>Optimized: {chartData?.length || 0}/{data?.length || 0} points</span>
        </div>
      )}
      
      <div
        ref={chartRef}
        className="chart-container"
        style={{
          width: '100%',
          height: `${dimensions.height}px`,
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1)',
          cursor: toolMode === 'pan' ? 'grab' : (toolMode === 'pointer' ? 'crosshair' : 'default'),
          transition: 'all 0.3s ease'
        }}
      >
        {/* React-managed SVG */}
        <div 
          className="chart-scroll-container"
          style={{ 
            width: '100%', 
            height: '100%', 
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollbarWidth: 'thin',
            scrollbarColor: '#81c784 transparent'
          }}
        >
          <svg 
            ref={svgRef}
            style={{ 
              display: 'block',
              minWidth: '100%',
              height: '100%'
            }}
          />
        </div>

        {/* Clean Crosshairs without trails */}
        {toolMode === 'pointer' && crosshairX !== null && crosshairY !== null && (
          <>
            {/* Crosshair lines */}
            <div
              style={{
                position: 'absolute',
                top: crosshairY,
                left: '12px',
                right: '12px',
                height: '1px',
                background: 'rgba(16, 185, 129, 0.6)',
                pointerEvents: 'none',
                zIndex: 15
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: crosshairX,
                top: '12px',
                bottom: '12px',
                width: '1px',
                background: 'rgba(16, 185, 129, 0.6)',
                pointerEvents: 'none',
                zIndex: 15
              }}
            />
            
            {/* Center point */}
            <div
              style={{
                position: 'absolute',
                top: crosshairY - 3,
                left: crosshairX - 3,
                width: '6px',
                height: '6px',
                background: 'rgba(16, 185, 129, 0.9)',
                borderRadius: '50%',
                border: '1px solid white',
                pointerEvents: 'none',
                zIndex: 16
              }}
            />
            
            {/* Data Display Tooltip */}
            {crosshairData && (
              <div
                style={{
                  position: 'absolute',
                  top: crosshairY - 60,
                  left: crosshairX + 20,
                  background: 'rgba(16, 185, 129, 0.95)',
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  pointerEvents: 'none',
                  zIndex: 20,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(8px)',
                  minWidth: '120px'
                }}
              >
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                  Data Point #{crosshairData.index + 1}
                </div>
                <div style={{ fontSize: '11px', opacity: 0.9 }}>
                  <div>{xKey}: <strong>{crosshairData.x}</strong></div>
                  <div>{yKey}: <strong>{crosshairData.y}</strong></div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Enhanced Tooltip */}
        <div
          ref={tooltipRef}
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(30, 30, 30, 0.9))',
            color: '#fff',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            opacity: 0,
            zIndex: 20,
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        />
      </div>
    </div>
  );
});

ChartArea.displayName = 'ChartArea';
export default ChartArea;