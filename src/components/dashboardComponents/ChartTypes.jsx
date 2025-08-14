import ChartIcons from './ChartIcons'

const ChartTypes = {
    area: { 
      label: 'Area Chart', 
      icon: ChartIcons.area,
      description: 'Show cumulative change over time'
    },
    bar: { 
      label: 'Bar Chart', 
      icon: ChartIcons.bar,
      description: 'Compare values across categories'
    },
    boxPlot: { 
      label: 'Box Plot', 
      icon: ChartIcons.boxPlot,
      description: 'Show data distribution and outliers'
    },
    bubble: { 
      label: 'Bubble Chart', 
      icon: ChartIcons.bubble,
      description: 'Add third dimension (via bubble size)'
    },
    calendarHeatmap: { 
      label: 'Calendar Heatmap', 
      icon: ChartIcons.calendarHeatmap,
      description: 'Daily/monthly activity patterns (like GitHub)'
    },
    groupedBar: { 
      label: 'Grouped Bar Chart', 
      icon: ChartIcons.groupedBar,
      description: 'Compare multiple categories across groups'
    },
    heatmap: { 
      label: 'Heatmap', 
      icon: ChartIcons.heatmap,
      description: 'Visualize correlations, intensity, patterns'
    },
    histogram: { 
      label: 'Histogram', 
      icon: ChartIcons.histogram,
      description: 'Frequency distribution of a single variable'
    },
    line: { 
      label: 'Line Chart', 
      icon: ChartIcons.line,
      description: 'Show trends and time series'
    },
    pie: { 
      label: 'Pie Chart', 
      icon: ChartIcons.pie,
      description: 'Show parts of a whole (simple proportions)'
    },
    radar: { 
      label: 'Radar/Spider Chart', 
      icon: ChartIcons.radar,
      description: 'Multi-variable comparison (e.g. skills)'
    },
    scatter: { 
      label: 'Scatter Plot', 
      icon: ChartIcons.scatter,
      description: 'Show relationships between 2 variables'
    },
    slopeChart: { 
      label: 'Slope Chart', 
      icon: ChartIcons.slopeChart,
      description: 'Show changes between two points clearly'
    },
    stackedBar: { 
      label: 'Stacked Bar Chart', 
      icon: ChartIcons.stackedBar,
      description: 'Compare parts of a whole + totals'
    },
    stackedBar100: { 
      label: '100% Stacked Bar', 
      icon: ChartIcons.stackedBar100,
      description: 'Compare % contribution in each category'
    },
    stepLine: { 
      label: 'Step Line Chart', 
      icon: ChartIcons.stepLine,
      description: 'Shows changes that happen at irregular intervals'
    },
    // sunburst: { 
    //   label: 'Sunburst Chart', 
    //   icon: ChartIcons.sunburst,
    //   description: 'Hierarchical data visualization'
    // },
    violinPlot: { 
      label: 'Violin Plot', 
      icon: ChartIcons.violinPlot,
      description: 'Advanced distribution + density view'
    }
  };

  export default ChartTypes;