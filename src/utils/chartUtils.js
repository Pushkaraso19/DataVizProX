import * as d3 from 'd3';

// Data validation utilities
export const validateData = (data, requiredKeys = []) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    throw new Error('Data must be a non-empty array');
  }
  
  if (requiredKeys.length > 0) {
    const firstItem = data[0];
    const missingKeys = requiredKeys.filter(key => !(key in firstItem));
    if (missingKeys.length > 0) {
      throw new Error(`Missing required data keys: ${missingKeys.join(', ')}`);
    }
  }
  
  return true;
};

// Data transformation utilities
export const processNumericData = (data, key) => {
  return data.map(d => {
    const value = d[key];
    const numValue = parseFloat(value);
    return isNaN(numValue) ? 0 : numValue;
  });
};

export const processDateData = (data, key) => {
  return data.map(d => {
    const date = new Date(d[key]);
    return isNaN(date.getTime()) ? new Date() : date;
  });
};

export const groupDataBy = (data, groupKey) => {
  return d3.group(data, d => d[groupKey]);
};

export const aggregateData = (data, groupKey, valueKey, aggregationMethod = 'sum') => {
  const grouped = groupDataBy(data, groupKey);
  const result = [];
  
  grouped.forEach((values, key) => {
    let aggregatedValue;
    const numericValues = values.map(d => parseFloat(d[valueKey])).filter(v => !isNaN(v));
    
    switch (aggregationMethod) {
      case 'sum':
        aggregatedValue = d3.sum(numericValues);
        break;
      case 'mean':
        aggregatedValue = d3.mean(numericValues);
        break;
      case 'median':
        aggregatedValue = d3.median(numericValues);
        break;
      case 'max':
        aggregatedValue = d3.max(numericValues);
        break;
      case 'min':
        aggregatedValue = d3.min(numericValues);
        break;
      case 'count':
        aggregatedValue = values.length;
        break;
      default:
        aggregatedValue = d3.sum(numericValues);
    }
    
    result.push({
      [groupKey]: key,
      [valueKey]: aggregatedValue
    });
  });
  
  return result;
};

// Color management utilities
export const createColorPalette = (baseColor, count = 10) => {
  const colors = [];
  const hslBase = d3.hsl(baseColor);
  
  for (let i = 0; i < count; i++) {
    const hue = (hslBase.h + (i * 360 / count)) % 360;
    const saturation = Math.max(0.3, hslBase.s - (i * 0.1));
    const lightness = Math.max(0.3, Math.min(0.8, hslBase.l + ((i % 2) * 0.2 - 0.1)));
    
    colors.push(d3.hsl(hue, saturation, lightness).toString());
  }
  
  return colors;
};

export const createSequentialColorScale = (domain, baseColor) => {
  const hslBase = d3.hsl(baseColor);
  const lightColor = d3.hsl(hslBase.h, hslBase.s * 0.3, 0.9).toString();
  const darkColor = d3.hsl(hslBase.h, hslBase.s * 1.2, 0.3).toString();
  
  return d3.scaleSequential()
    .domain(domain)
    .interpolator(d3.interpolate(lightColor, darkColor));
};

export const createCategoricalColorScale = (domain, baseColor) => {
  const palette = createColorPalette(baseColor, domain.length);
  return d3.scaleOrdinal(palette).domain(domain);
};

// Scale utilities
export const createOptimalScale = (data, type = 'linear', padding = 0.1) => {
  const extent = d3.extent(data);
  const range = extent[1] - extent[0];
  const paddingValue = range * padding;
  
  switch (type) {
    case 'linear':
      return {
        domain: [
          Math.max(0, extent[0] - paddingValue),
          extent[1] + paddingValue
        ],
        nice: true
      };
    case 'log':
      const minValue = Math.max(1, extent[0]);
      return {
        domain: [minValue, extent[1]],
        nice: false
      };
    case 'sqrt':
      return {
        domain: [
          Math.max(0, extent[0]),
          extent[1]
        ],
        nice: true
      };
    default:
      return {
        domain: extent,
        nice: true
      };
  }
};

// Animation utilities
export const animateChart = (selection, animationType = 'fadeIn', duration = 800) => {
  switch (animationType) {
    case 'fadeIn':
      return selection
        .style('opacity', 0)
        .transition()
        .duration(duration)
        .style('opacity', 1);
        
    case 'slideUp':
      return selection
        .attr('transform', 'translate(0, 50)')
        .style('opacity', 0)
        .transition()
        .duration(duration)
        .attr('transform', 'translate(0, 0)')
        .style('opacity', 1);
        
    case 'scaleIn':
      return selection
        .attr('transform', 'scale(0)')
        .transition()
        .duration(duration)
        .attr('transform', 'scale(1)');
        
    default:
      return selection;
  }
};

// Chart-specific data processors
export const processHierarchicalData = (data, hierarchyKeys, valueKey) => {
  const root = { name: 'root', children: [] };
  const nodeMap = new Map();
  nodeMap.set('root', root);
  
  data.forEach(item => {
    let currentPath = 'root';
    let currentNode = root;
    
    hierarchyKeys.forEach((key, index) => {
      const value = item[key];
      const nodePath = `${currentPath}/${value}`;
      
      if (!nodeMap.has(nodePath)) {
        const newNode = {
          name: value,
          path: nodePath,
          level: index + 1,
          children: index === hierarchyKeys.length - 1 ? undefined : []
        };
        
        if (index === hierarchyKeys.length - 1) {
          newNode.value = parseFloat(item[valueKey]) || 0;
        }
        
        nodeMap.set(nodePath, newNode);
        currentNode.children.push(newNode);
      }
      
      currentNode = nodeMap.get(nodePath);
      currentPath = nodePath;
    });
  });
  
  return root;
};

export const processTimeSeriesData = (data, dateKey, valueKey) => {
  return data
    .map(d => ({
      date: new Date(d[dateKey]),
      value: parseFloat(d[valueKey]) || 0,
      original: d
    }))
    .filter(d => !isNaN(d.date.getTime()))
    .sort((a, b) => a.date - b.date);
};

// Statistical utilities
export const calculateStats = (values) => {
  const sortedValues = values.slice().sort(d3.ascending);
  const q1 = d3.quantile(sortedValues, 0.25);
  const median = d3.quantile(sortedValues, 0.5);
  const q3 = d3.quantile(sortedValues, 0.75);
  const iqr = q3 - q1;
  const min = d3.min(sortedValues);
  const max = d3.max(sortedValues);
  
  return {
    min,
    max,
    q1,
    median,
    q3,
    iqr,
    mean: d3.mean(values),
    std: d3.deviation(values),
    outliers: sortedValues.filter(v => v < q1 - 1.5 * iqr || v > q3 + 1.5 * iqr)
  };
};

// Tooltip utilities
export const createTooltip = (container) => {
  return d3.select(container)
    .append('div')
    .attr('class', 'chart-tooltip')
    .style('position', 'absolute')
    .style('visibility', 'hidden')
    .style('background', 'rgba(0, 0, 0, 0.9)')
    .style('color', 'white')
    .style('padding', '10px')
    .style('border-radius', '8px')
    .style('font-size', '12px')
    .style('pointer-events', 'none')
    .style('z-index', '1000')
    .style('box-shadow', '0 4px 8px rgba(0, 0, 0, 0.3)');
};

export const showTooltip = (tooltip, content, x, y) => {
  tooltip
    .style('visibility', 'visible')
    .html(content)
    .style('left', `${x + 10}px`)
    .style('top', `${y - 10}px`);
};

export const hideTooltip = (tooltip) => {
  tooltip.style('visibility', 'hidden');
};

// Legend utilities
export const createLegend = (svg, colorScale, data, position = { x: 20, y: 20 }) => {
  const legend = svg.append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(${position.x}, ${position.y})`);

  const legendItems = legend.selectAll('.legend-item')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'legend-item')
    .attr('transform', (d, i) => `translate(0, ${i * 25})`);

  legendItems.append('rect')
    .attr('width', 18)
    .attr('height', 18)
    .attr('fill', d => colorScale(d))
    .attr('stroke', '#333')
    .attr('stroke-width', 1);

  legendItems.append('text')
    .attr('x', 25)
    .attr('y', 14)
    .style('font-size', '12px')
    .style('fill', '#333')
    .text(d => d);

  return legend;
};

// Performance optimization utilities
export const sampleData = (data, maxPoints = 1000) => {
  if (data.length <= maxPoints) {
    return data;
  }
  
  const step = Math.ceil(data.length / maxPoints);
  return data.filter((d, i) => i % step === 0);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Export all utilities as default object
export default {
  validateData,
  processNumericData,
  processDateData,
  groupDataBy,
  aggregateData,
  createColorPalette,
  createSequentialColorScale,
  createCategoricalColorScale,
  createOptimalScale,
  animateChart,
  processHierarchicalData,
  processTimeSeriesData,
  calculateStats,
  createTooltip,
  showTooltip,
  hideTooltip,
  createLegend,
  sampleData,
  debounce
};