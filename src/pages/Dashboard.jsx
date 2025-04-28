import React from 'react';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FileUpload from '../components/FileUpload';
import ChartArea from '../components/ChartArea';
import DataTable from '../components/DataTable';
import ExcelJS from 'exceljs'
import { Download, FileJson, FileText, FileImage, Image, Search, Code2, ChevronDown } from 'lucide-react';
import './Dashboard.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// SVG chart icons
const ChartIcons = {
  bar: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <rect x="3" y="10" width="3" height="10" />
      <rect x="8" y="4" width="3" height="16" />
      <rect x="13" y="7" width="3" height="13" />
      <rect x="18" y="12" width="3" height="8" />
    </svg>
  ),
  groupedBar: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <rect x="3" y="14" width="2" height="6" fill="currentColor" />
      <rect x="6" y="12" width="2" height="8" fill="currentColor" />
      <rect x="9" y="10" width="2" height="10" fill="currentColor" />
      <rect x="12" y="8" width="2" height="12" fill="currentColor" />
      <rect x="15" y="14" width="2" height="6" fill="currentColor" fill-opacity="0.6" />
      <rect x="18" y="12" width="2" height="8" fill="currentColor" fill-opacity="0.6" />
      <rect x="21" y="10" width="2" height="10" fill="currentColor" fill-opacity="0.6" />
    </svg>
  ),
  line: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3,17 9,11 14,13 21,5" />
      <circle cx="3" cy="17" r="1.5" fill="currentColor" />
      <circle cx="9" cy="11" r="1.5" fill="currentColor" />
      <circle cx="14" cy="13" r="1.5" fill="currentColor" />
      <circle cx="21" cy="5" r="1.5" fill="currentColor" />
    </svg>
  ),
  area: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M3,17 L9,11 L14,13 L21,5 L21,20 L3,20 Z" fillOpacity="0.6" />
      <polyline points="3,17 9,11 14,13 21,5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  pie: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path d="M12,2 A10,10 0 0,1 22,12 L12,12 Z" fill="currentColor" />
      <path d="M12,12 L12,22 A10,10 0 0,1 4,6 Z" fill="currentColor" fillOpacity="0.7" />
      <path d="M12,12 L4,6 A10,10 0 0,1 12,2 Z" fill="currentColor" fillOpacity="0.4" />
    </svg>
  ),
  doughnut: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path d="M12,2 A10,10 0 0,1 22,12 L18,12 A6,6 0 0,0 12,6 Z" fill="currentColor" />
      <path d="M12,12 L12,18 A6,6 0 0,1 6,12 Z" fill="currentColor" fillOpacity="0.5" />
      <path d="M12,12 L6,12 A6,6 0 0,1 12,6 Z" fill="currentColor" fillOpacity="0.7" />
      <circle cx="12" cy="12" r="4" fill="white" />
    </svg>
  ),
  stackedBar: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <rect x="3" y="14" width="3" height="6" fill="currentColor" />
      <rect x="3" y="8" width="3" height="6" fill="currentColor" fillOpacity="0.6" />
      <rect x="8" y="12" width="3" height="8" fill="currentColor" />
      <rect x="8" y="4" width="3" height="8" fill="currentColor" fillOpacity="0.6" />
      <rect x="13" y="10" width="3" height="10" fill="currentColor" />
      <rect x="13" y="5" width="3" height="5" fill="currentColor" fillOpacity="0.6" />
      <rect x="18" y="16" width="3" height="4" fill="currentColor" />
      <rect x="18" y="9" width="3" height="7" fill="currentColor" fillOpacity="0.6" />
    </svg>
  ),
  stackedBar100: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <rect x="3" y="4" width="3" height="6" fill="currentColor" fillOpacity="0.3" />
      <rect x="3" y="10" width="3" height="6" fill="currentColor" fillOpacity="0.6" />
      <rect x="3" y="16" width="3" height="4" fill="currentColor" />
      <rect x="8" y="4" width="3" height="8" fill="currentColor" fillOpacity="0.3" />
      <rect x="8" y="12" width="3" height="5" fill="currentColor" fillOpacity="0.6" />
      <rect x="8" y="17" width="3" height="3" fill="currentColor" />
      <rect x="13" y="4" width="3" height="4" fill="currentColor" fillOpacity="0.3" />
      <rect x="13" y="8" width="3" height="8" fill="currentColor" fillOpacity="0.6" />
      <rect x="13" y="16" width="3" height="4" fill="currentColor" />
      <rect x="18" y="4" width="3" height="5" fill="currentColor" fillOpacity="0.3" />
      <rect x="18" y="9" width="3" height="7" fill="currentColor" fillOpacity="0.6" />
      <rect x="18" y="16" width="3" height="4" fill="currentColor" />
    </svg>
  ),
  scatter: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <circle cx="5" cy="18" r="1.5" />
      <circle cx="8" cy="12" r="1.5" />
      <circle cx="11" cy="17" r="1.5" />
      <circle cx="14" cy="9" r="1.5" />
      <circle cx="17" cy="14" r="1.5" />
      <circle cx="20" cy="6" r="1.5" />
    </svg>
  ),
  bubble: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <circle cx="5" cy="18" r="1" />
      <circle cx="8" cy="12" r="2" />
      <circle cx="12" cy="17" r="1.5" />
      <circle cx="14" cy="9" r="3" />
      <circle cx="19" cy="14" r="2" />
    </svg>
  ),
  histogram: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <rect x="2" y="16" width="2" height="4" />
      <rect x="5" y="12" width="2" height="8" />
      <rect x="8" y="14" width="2" height="6" />
      <rect x="11" y="8" width="2" height="12" />
      <rect x="14" y="10" width="2" height="10" />
      <rect x="17" y="16" width="2" height="4" />
      <rect x="20" y="18" width="2" height="2" />
    </svg>
  ),
  boxPlot: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" fill="none">
      <line x1="6" y1="4" x2="6" y2="8" />
      <line x1="6" y1="20" x2="6" y2="16" />
      <line x1="4" y1="4" x2="8" y2="4" />
      <line x1="4" y1="20" x2="8" y2="20" />
      <rect x="4" y="8" width="4" height="8" fill="currentColor" fillOpacity="0.2" />
      <line x1="4" y1="12" x2="8" y2="12" stroke="currentColor" strokeWidth="1.5" />
      
      <line x1="18" y1="6" x2="18" y2="10" />
      <line x1="18" y1="18" x2="18" y2="14" />
      <line x1="16" y1="6" x2="20" y2="6" />
      <line x1="16" y1="18" x2="20" y2="18" />
      <rect x="16" y="10" width="4" height="4" fill="currentColor" fillOpacity="0.2" />
      <line x1="16" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  heatmap: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <rect x="3" y="3" width="3" height="3" fill="currentColor" fillOpacity="0.2" />
      <rect x="7" y="3" width="3" height="3" fill="currentColor" fillOpacity="0.6" />
      <rect x="11" y="3" width="3" height="3" fill="currentColor" fillOpacity="0.8" />
      <rect x="15" y="3" width="3" height="3" fill="currentColor" fillOpacity="0.4" />
      <rect x="19" y="3" width="3" height="3" fill="currentColor" fillOpacity="0.1" />
      
      <rect x="3" y="7" width="3" height="3" fill="currentColor" fillOpacity="0.7" />
      <rect x="7" y="7" width="3" height="3" fill="currentColor" fillOpacity="0.9" />
      <rect x="11" y="7" width="3" height="3" fill="currentColor" />
      <rect x="15" y="7" width="3" height="3" fill="currentColor" fillOpacity="0.5" />
      <rect x="19" y="7" width="3" height="3" fill="currentColor" fillOpacity="0.3" />
      
      <rect x="3" y="11" width="3" height="3" fill="currentColor" fillOpacity="0.5" />
      <rect x="7" y="11" width="3" height="3" fill="currentColor" fillOpacity="0.7" />
      <rect x="11" y="11" width="3" height="3" fill="currentColor" fillOpacity="0.3" />
      <rect x="15" y="11" width="3" height="3" fill="currentColor" fillOpacity="0.2" />
      <rect x="19" y="11" width="3" height="3" fill="currentColor" fillOpacity="0.6" />
      
      <rect x="3" y="15" width="3" height="3" fill="currentColor" fillOpacity="0.3" />
      <rect x="7" y="15" width="3" height="3" fill="currentColor" fillOpacity="0.2" />
      <rect x="11" y="15" width="3" height="3" fill="currentColor" fillOpacity="0.4" />
      <rect x="15" y="15" width="3" height="3" fill="currentColor" fillOpacity="0.9" />
      <rect x="19" y="15" width="3" height="3" fill="currentColor" fillOpacity="0.8" />
    </svg>
  ),
  calendarHeatmap: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <rect x="3" y="3" width="2" height="2" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="0.5" />
      <rect x="6" y="3" width="2" height="2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="0.5" />
      <rect x="9" y="3" width="2" height="2" fill="currentColor" fillOpacity="0.7" stroke="currentColor" strokeWidth="0.5" />
      <rect x="12" y="3" width="2" height="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="0.5" />
      <rect x="15" y="3" width="2" height="2" fill="currentColor" fillOpacity="0.5" stroke="currentColor" strokeWidth="0.5" />
      
      <rect x="3" y="6" width="2" height="2" fill="currentColor" fillOpacity="0.6" stroke="currentColor" strokeWidth="0.5" />
      <rect x="6" y="6" width="2" height="2" fill="currentColor" fillOpacity="0.9" stroke="currentColor" strokeWidth="0.5" />
      <rect x="9" y="6" width="2" height="2" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="0.5" />
      <rect x="12" y="6" width="2" height="2" fill="currentColor" fillOpacity="0.8" stroke="currentColor" strokeWidth="0.5" />
      <rect x="15" y="6" width="2" height="2" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="0.5" />
      
      <rect x="3" y="9" width="2" height="2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="0.5" />
      <rect x="6" y="9" width="2" height="2" fill="currentColor" fillOpacity="0.7" stroke="currentColor" strokeWidth="0.5" />
      <rect x="9" y="9" width="2" height="2" fill="currentColor" stroke="currentColor" strokeWidth="0.5" />
      <rect x="12" y="9" width="2" height="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="0.5" />
      <rect x="15" y="9" width="2" height="2" fill="currentColor" fillOpacity="0.5" stroke="currentColor" strokeWidth="0.5" />
      
      <rect x="18" y="3" width="2" height="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="0.5" />
      <rect x="18" y="6" width="2" height="2" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="0.5" />
      <rect x="18" y="9" width="2" height="2" fill="currentColor" fillOpacity="0.6" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  ),
  radar: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <circle cx="12" cy="12" r="6" fill="none" />
      <circle cx="12" cy="12" r="10" fill="none" />
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="4" y1="4" x2="20" y2="20" />
      <line x1="20" y1="4" x2="4" y2="20" />
      <path d="M12,12 L18,8 L16,15 L8,18 L6,10 Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" />
    </svg>
  ),
  treemap: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <rect x="3" y="3" width="10" height="10" fill="currentColor" fillOpacity="0.7" stroke="currentColor" />
      <rect x="14" y="3" width="7" height="5" fill="currentColor" fillOpacity="0.5" stroke="currentColor" />
      <rect x="14" y="9" width="7" height="4" fill="currentColor" fillOpacity="0.3" stroke="currentColor" />
      <rect x="3" y="14" width="7" height="7" fill="currentColor" fillOpacity="0.6" stroke="currentColor" />
      <rect x="11" y="14" width="10" height="7" fill="currentColor" fillOpacity="0.4" stroke="currentColor" />
    </svg>
  ),
  sunburst: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <path d="M12,9 A3,3 0 0,1 15,12 L12,12 Z" fill="currentColor" fillOpacity="0.8" stroke="currentColor" strokeWidth="0.5" />
      <path d="M12,9 A3,3 0 0,0 9,12 L12,12 Z" fill="currentColor" fillOpacity="0.6" stroke="currentColor" strokeWidth="0.5" />
      <path d="M15,12 A3,3 0 0,1 12,15 L12,12 Z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="0.5" />
      <path d="M12,15 A3,3 0 0,1 9,12 L12,12 Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="0.5" />
      
      <path d="M12,6 A6,6 0 0,1 18,12 L15,12 A3,3 0 0,0 12,9 Z" fill="currentColor" fillOpacity="0.7" stroke="currentColor" strokeWidth="0.5" />
      <path d="M12,6 A6,6 0 0,0 6,12 L9,12 A3,3 0 0,1 12,9 Z" fill="currentColor" fillOpacity="0.5" stroke="currentColor" strokeWidth="0.5" />
      <path d="M18,12 A6,6 0 0,1 12,18 L12,15 A3,3 0 0,0 15,12 Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="0.5" />
      <path d="M12,18 A6,6 0 0,1 6,12 L9,12 A3,3 0 0,0 12,15 Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  ),
  stepLine: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3,17 7,17 7,13 12,13 12,8 17,8 17,5 21,5" />
      <circle cx="3" cy="17" r="1.5" fill="currentColor" />
      <circle cx="7" cy="17" r="1.5" fill="currentColor" />
      <circle cx="7" cy="13" r="1.5" fill="currentColor" />
      <circle cx="12" cy="13" r="1.5" fill="currentColor" />
      <circle cx="12" cy="8" r="1.5" fill="currentColor" />
      <circle cx="17" cy="8" r="1.5" fill="currentColor" />
      <circle cx="17" cy="5" r="1.5" fill="currentColor" />
      <circle cx="21" cy="5" r="1.5" fill="currentColor" />
    </svg>
  ),
  slopeChart: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="6" y1="5" x2="18" y2="8" />
      <line x1="6" y1="10" x2="18" y2="15" />
      <line x1="6" y1="17" x2="18" y2="20" />
      <circle cx="6" cy="5" r="1.5" fill="currentColor" />
      <circle cx="18" cy="8" r="1.5" fill="currentColor" />
      <circle cx="6" cy="10" r="1.5" fill="currentColor" />
      <circle cx="18" cy="15" r="1.5" fill="currentColor" />
      <circle cx="6" cy="17" r="1.5" fill="currentColor" />
      <circle cx="18" cy="20" r="1.5" fill="currentColor" />
    </svg>
  ),
  violinPlot: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path d="M6,4 C8,4 8,12 6,12 C4,12 4,4 6,4 Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1" />
      <path d="M6,12 C8,12 8,20 6,20 C4,20 4,12 6,12 Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1" />
      <line x1="6" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="1" />
      <line x1="5" y1="10" x2="7" y2="10" stroke="currentColor" strokeWidth="1" />
      <line x1="5" y1="14" x2="7" y2="14" stroke="currentColor" strokeWidth="1" />
      
      <path d="M18,4 C20,4 20,12 18,12 C16,12 16,4 18,4 Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1" />
      <path d="M18,12 C20,12 20,20 18,20 C16,20 16,12 18,12 Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1" />
      <line x1="18" y1="8" x2="18" y2="16" stroke="currentColor" strokeWidth="1" />
      <line x1="17" y1="10" x2="19" y2="10" stroke="currentColor" strokeWidth="1" />
      <line x1="17" y1="14" x2="19" y2="14" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
};

const Dashboard = () => {
  // Define the chartTypes that map to the descriptions provided
  const chartTypes = {
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
    doughnut: { 
      label: 'Doughnut Chart', 
      icon: ChartIcons.doughnut,
      description: 'Like Pie, but with better label space'
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
    //   description: 'Radial version of a Treemap (hierarchies)'
    // },
    // treemap: { 
    //   label: 'Treemap', 
    //   icon: ChartIcons.treemap,
    //   description: 'Visualize hierarchical data with proportions'
    // },
    violinPlot: { 
      label: 'Violin Plot', 
      icon: ChartIcons.violinPlot,
      description: 'Advanced distribution + density view'
    }
  };

  const [data, setData] = useState(null);
  const [chartType, setChartType] = useState('area');
  const [searchQueryChartSelection, setSearchQueryChartSelection] = useState('');
  const [searchQueryDataTable, setSearchQueryDataTable] = useState('');
  const [xKey, setXKey] = useState('');
  const [zKey, setZKey] = useState('');
  const [yKey, setYKey] = useState('');
  const [groupKey, setGroupKey] = useState('');
  const [colorMap, setColorMap] = useState({});
  const [showNotification, setShowNotification] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const menuRef = useRef(null);
  const [xAxisSearch, setXAxisSearch] = useState('');
  const [yAxisSearch, setYAxisSearch] = useState('');
  const [xAxisDropdownOpen, setXAxisDropdownOpen] = useState(false);
  const [yAxisDropdownOpen, setYAxisDropdownOpen] = useState(false);
  const [xInputFocused, setXInputFocused] = useState(false);
  const [yInputFocused, setYInputFocused] = useState(false);
  const [groupSearch, setGroupSearch] = useState('');
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);
  const [zAxisSearch, setZAxisSearch] = useState('');
  const [zAxisDropdownOpen, setZAxisDropdownOpen] = useState(false);
  const [treeNameKey, setTreeNameKey] = useState('');
  const [treeValueKey, setTreeValueKey] = useState('');
  const [treeParentKey, setTreeParentKey] = useState(null);
  const [treeHierarchyKeys, setTreeHierarchyKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        setXAxisDropdownOpen(false);
        setYAxisDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);
  
  const handleDataProcessed = (processedData) => {
    if (processedData && processedData.length > 0) {
      const headers = Object.keys(processedData[0]);
      console.log(headers)
      setXKey(headers[0] || '');
      setYKey(headers[1] || '');
      setXAxisSearch(''); // Reset input
      setYAxisSearch('');
      setChartType(chartType);
      
    setData(processedData);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);// Ensure the chart type is set
    }
  };  

  // Filter chart types based on search query
  const filteredChartTypes = Object.entries(chartTypes).filter(([key, details]) =>
    details.label.toLowerCase().includes(searchQueryChartSelection.toLowerCase()) ||
    details.description.toLowerCase().includes(searchQueryChartSelection.toLowerCase())
  );

  const sidebarVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        duration: 0.5 
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5, delay: 0.2 }
    }
  };

  const chartButtonVariants = {
    initial: { 
      backgroundColor: "#fff",
      border: "1px solid var(--input-border-color)" 
    },
    hover: { 
      backgroundColor: "var(--chart-item-hover)",
      border: "1px solid var(--button-success-background)",
      y: -2,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20
      }
    },
    selected: {
      backgroundColor: "var(--chart-item-hover)",
      border: "1px solid var(--button-success-background)",
      scale: 1.0
      
    }
  };

  const notificationVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300 }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  const exportToCSV = () => {
    if (!data || data.length === 0) return;
    setLoading(true);
    const csvContent = [Object.keys(data[0]).join(',')]
      .concat(data.map(row => Object.values(row).join(',')))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${chartType}_data.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    setLoading(false);
  };
  
  const exportToJSON = () => {
    if (!data || data.length === 0) return;
    setLoading(true);
    const json = JSON.stringify({ data }, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${chartType}_data.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    setLoading(false);
  };
  
  const exportToExcel = async () => {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }
  
    setLoading(true); // Show loader
  
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Sheet 1');
  
      // Add headers
      const headers = Object.keys(data[0]);
      worksheet.addRow(headers);
  
      // Add data rows in batches for better performance
      const batchSize = 100; // Process 100 rows at a time
      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        batch.forEach(row => {
          worksheet.addRow(headers.map(key => row[key]));
        });
      }
  
      // Apply styling (optional)
      worksheet.columns.forEach(col => {
        col.width = 20; // Set column width
      });
  
      // Convert workbook to buffer
      const buffer = await workbook.xlsx.writeBuffer();
  
      // Create a Blob and trigger download
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
  
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${chartType}_data.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('An error occurred while exporting to Excel. Please try again.');
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const exportChart = async (type) => {
    const chart = document.querySelector('.chart-container svg')?.parentElement;

    if (!chart) return;
    setLoading(true);
    try {
      const canvas = await html2canvas(chart);
      const imgData = canvas.toDataURL(`image/${type === 'jpg' ? 'jpeg' : 'png'}`);
    
      if (type === 'pdf') {
        const pdf = new jsPDF();
        const props = pdf.getImageProperties(imgData);
        const width = pdf.internal.pageSize.getWidth();
        const height = (props.height * width) / props.width;
        pdf.addImage(imgData, 'PNG', 0, 0, width, height);
        pdf.save(`${chartType}_chart.pdf`);
      } else if (type === 'svg') {
        const svg = chart.querySelector('svg');
        if (svg) {
          const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${chartType}_chart.svg`;
          link.click();
          URL.revokeObjectURL(url);
        }
      } else {
        const link = document.createElement('a');
        link.href = imgData;
        link.download = `${chartType}_chart.${type}`;
        link.click();
        URL.revokeObjectURL(link.href);
      }
    } catch (error) {
      console.error("Error exporting chart:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const exportOptions = [
    { type: 'png', label: 'PNG Image', icon: <Image size={16} /> },
    { type: 'jpg', label: 'JPG Image', icon: <FileImage size={16} /> },
    { type: 'pdf', label: 'PDF Document', icon: <FileText size={16} /> },
    { type: 'svg', label: 'SVG Vector', icon: <Code2 size={16} /> }
  ];

  return (
    <div className="dashboard-container">
      {loading && (
        <div className="small-loader-container">
          <div className="small-spinner"></div>
          <p className="loader-text">Exporting... Please wait.</p>
        </div>
      )}
      {/* Sidebar with animations */}
      <motion.aside 
        className="sidebar"
        initial="hidden"
        animate="visible"
        variants={sidebarVariants}
      >
        <h2 className="sidebar-title">Dashboard Controls</h2>

        <div className="control-section">
          <h3 className="section-title underline">Data Source</h3>
          <FileUpload onDataProcessed={handleDataProcessed} />
        </div>

        {/* Customization Section  */}
        {data && (
          <motion.div
            className="control-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="section-title underline">Chart Customization</h3>            
            <div className="space-y-4">

              {/* Data Mapping */}
              <div className="space-y-3">
                <h4 className="font-medium text-2xl text-gray-700">Data Mapping</h4>

                {/* X-Axis Selection */}
                <div className="mb-4 relative">
                  <label className="block text-xl font-medium mb-1">
                    {(() => {
                      if (['pie', 'doughnut'].includes(chartType)) return "Category";
                      if (['stackedBar', 'stackedBar100', 'boxPlot', 'heatmap', 'radar', 'calendarHeatmap', 'violinPlot', 'groupedBar'].includes(chartType)) return "Category";
                      if (chartType === 'histogram') return "Value";
                      return chartType === "calendarHeatmap" ? "Date" : "X-Axis";
                    })()}
                  </label>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder={`Select ${chartType === "calendarHeatmap" ? "Date" : "X-Axis"}...`}
                      value={xAxisSearch || xKey}
                      onFocus={() => {
                        setXInputFocused(true);
                        setXAxisDropdownOpen(true);
                      }}
                      onBlur={() => {
                        setTimeout(() => setXAxisDropdownOpen(false), 150);
                      }}
                      onChange={(e) => {
                        const value = e.target.value;
                        setXAxisSearch(value);
                        setXAxisDropdownOpen(true);
                        if (value.trim() === "") {
                          setXKey("");
                        }
                      }}
                      className="w-full p-2 border border-gray-300 rounded pr-8"
                    />
                    <ChevronDown
                      size={16}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    />
                  </div>

                  {xAxisDropdownOpen && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded w-full max-h-48 overflow-y-auto mt-1 shadow">
                      {Object.keys(data[0] || {})
                        .filter((key) => key.toLowerCase().includes((xAxisSearch || '').toLowerCase()))
                        .map((key) => (
                          <div
                            key={key}
                            onMouseDown={() => {
                              setXKey(key);
                              setXAxisSearch('');
                              setXAxisDropdownOpen(false);
                            }}
                            className="p-2 hover:bg-gray-100 cursor-pointer text-2xl"
                          >
                            {key}
                          </div>
                        ))}
                      {Object.keys(data[0] || {}).filter((key) =>
                        key.toLowerCase().includes((xAxisSearch || "").toLowerCase())
                      ).length === 0 && (
                        <div className="p-2 text-gray-500 text-center italic">No matching label found</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Y-Axis Selection */}
                {chartType !== 'histogram' && (
                  <div className="mb-4 relative">
                    <label className="block text-xl font-medium mb-1">
                      {(() => {
                        if (['pie', 'doughnut'].includes(chartType)) return "Value";
                        if (['stackedBar', 'stackedBar100', 'groupedBar'].includes(chartType)) return "Select Data to Stack";
                        if (['boxPlot', 'heatmap', 'radar', 'calendarHeatmap', 'violinPlot'].includes(chartType)) return "Value";
                        return "Y-Axis";
                      })()}
                    </label>

                    <div className="relative">
                      <input
                        type="text"
                        placeholder={`Select ${['stackedBar', 'stackedBar100', 'groupedBar'].includes(chartType) ? "Data to Stack" : "Y-Axis"}...`}
                        value={
                          ['radar', 'stackedBar', 'stackedBar100', 'groupedBar'].includes(chartType)
                            ? (Array.isArray(yKey) ? yKey.join(', ') : '')
                            : (yAxisSearch || yKey)
                        }
                        onFocus={() => {
                          setYInputFocused(true);
                          setYAxisDropdownOpen(true);
                        }}
                        onBlur={() => {
                          setTimeout(() => setYAxisDropdownOpen(false), 150);
                        }}
                        onChange={(e) => {
                          const value = e.target.value;
                          setYAxisSearch(value);
                          setYAxisDropdownOpen(true);
                          if (value.trim() === "") {
                            setYKey("");
                          }
                        }}
                        className="w-full p-2 border border-gray-300 rounded pr-8"
                      />
                      <ChevronDown
                        size={16}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                      />
                    </div>

                    {yAxisDropdownOpen && (
                      <div className="absolute z-10 bg-white border border-gray-300 rounded w-full max-h-48 overflow-y-auto mt-1 shadow">
                        {Object.keys(data[0] || {})
                          .filter((key) => {
                            if (!key.toLowerCase().includes((yAxisSearch || '').toLowerCase())) return false;
                            if (['boxPlot', 'heatmap', 'calendarHeatmap', 'radar', 'violinPlot'].includes(chartType)) {
                              return !isNaN(parseFloat(data[0][key]));
                            }
                            return true;
                          })
                          .map((key) => (
                            <div
                              key={key}
                              onMouseDown={() => {
                                if (['radar', 'stackedBar', 'stackedBar100', 'groupedBar'].includes(chartType)) {
                                  setYKey(prev => {
                                    const selected = Array.isArray(prev) ? prev : [];
                                    return selected.includes(key)
                                      ? selected.filter(k => k !== key)
                                      : [...selected, key];
                                  });
                                } else {
                                  setYKey(key);
                                  setYAxisSearch('');
                                  setYAxisDropdownOpen(false);
                                }
                              }}
                              className="p-2 hover:bg-gray-100 cursor-pointer text-2xl flex items-center"
                            >
                              {['radar', 'stackedBar', 'stackedBar100', 'groupedBar'].includes(chartType) && (
                                <input
                                  type="checkbox"
                                  checked={Array.isArray(yKey) && yKey.includes(key)}
                                  readOnly
                                  className="mr-2"
                                />
                              )}
                              {key}
                            </div>
                          ))}
                        {Object.keys(data[0] || {}).filter((key) =>
                          key.toLowerCase().includes((yAxisSearch || "").toLowerCase())
                        ).length === 0 && (
                          <div className="p-2 text-gray-500 text-center italic">No matching label found</div>
                        )}
                      </div>
                    )}
                  </div>
                )}


                {/* Z-Axis Selection for Bubble Chart */}
                {chartType === 'bubble' && (
                  <div className="mb-4 relative">
                    <label className="block text-xl font-medium mb-1">Size</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Select Z-Axis..."
                        value={zAxisSearch || zKey}
                        onFocus={() => setZAxisDropdownOpen(true)}
                        onBlur={() => setTimeout(() => setZAxisDropdownOpen(false), 150)}
                        onChange={(e) => {
                          const value = e.target.value;
                          setZAxisSearch(value);
                          setZAxisDropdownOpen(true);
                          if (value.trim() === "") {
                            setZKey("");
                          }
                        }}
                        className="w-full p-2 border border-gray-300 rounded pr-8"
                      />
                      <ChevronDown
                        size={16}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                      />
                    </div>

                    {zAxisDropdownOpen && (
                      <div className="absolute z-10 bg-white border border-gray-300 rounded w-full max-h-48 overflow-y-auto mt-1 shadow">
                        {Object.keys(data[0] || {})
                          .filter((key) => key.toLowerCase().includes((zAxisSearch || '').toLowerCase()))
                          .map((key) => (
                            <div
                              key={key}
                              onMouseDown={() => {
                                setZKey(key);
                                setZAxisSearch('');
                                setZAxisDropdownOpen(false);
                              }}
                              className="p-2 hover:bg-gray-100 cursor-pointer text-2xl"
                            >
                              {key}
                            </div>
                          ))}
                          {Object.keys(data[0] || {}).filter((key) =>
                            key.toLowerCase().includes((zAxisSearch || "").toLowerCase())
                          ).length === 0 && (
                            <div className="p-2 text-gray-500 text-center italic">No matching label found</div>
                          )}
                      </div>
                    )}
                  </div>
                )}


                {/* Group By Selection */}
                {['stackedBar', 'stackedBar100', 'bubble', 'scatter', 'groupedBar'].includes(chartType) && (
                  <div className="mb-4 relative">
                    <label className="block text-xl font-medium mb-1">Group By</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Select Group Key..."
                        value={groupSearch || groupKey}
                        onFocus={() => setGroupDropdownOpen(true)}
                        onBlur={() => setTimeout(() => setGroupDropdownOpen(false), 150)}
                        onChange={(e) => {
                          const value = e.target.value;
                          setGroupSearch(value);
                          setGroupDropdownOpen(true);
                          if (value.trim() === "") {
                            setGroupKey("");
                          }
                        }}
                        className="w-full p-2 border border-gray-300 rounded pr-8"
                      />
                      <ChevronDown
                        size={16}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                      />
                    </div>

                    {groupDropdownOpen && (
                      <div className="absolute z-10 bg-white border border-gray-300 rounded w-full max-h-48 overflow-y-auto mt-1 shadow">
                        {Object.keys(data[0] || {})
                          .filter((key) => key.toLowerCase().includes((groupSearch || '').toLowerCase()))
                          .map((key) => (
                            <div
                              key={key}
                              onMouseDown={() => {
                                setGroupKey(key);
                                setGroupSearch('');
                                setGroupDropdownOpen(false);
                              }}
                              className="p-2 hover:bg-gray-100 cursor-pointer text-2xl"
                            >
                              {key}
                            </div>
                          ))}
                          {Object.keys(data[0] || {}).filter((key) =>
                              key.toLowerCase().includes((groupSearch || "").toLowerCase())
                            ).length === 0 && (
                              <div className="p-2 text-gray-500 text-center italic">No matching label found</div>
                          )}  
                      </div>
                    )}
                  </div>
                )}

                {['sunburst', 'treemap'].includes(chartType) && (
                  <>
                    {/* Tree Levels Mapping */}
                    <div className="mb-4 relative">
                      <label className="block text-xl font-medium mb-1">Hierarchy Levels (Top to Bottom)</label>
                      <select
                        multiple
                        value={treeHierarchyKeys}
                        onChange={(e) => setTreeHierarchyKeys([...e.target.selectedOptions].map(o => o.value))}
                        className="w-full p-2 border border-gray-300 rounded h-40"
                      >
                        {Object.keys(data[0] || {}).map(key => (
                          <option key={key} value={key}>{key}</option>
                        ))}
                      </select>
                    </div>

                    {/* Tree Value Mapping */}
                    <div className="mb-4 relative">
                      <label className="block text-xl font-medium mb-1">Node Value Field</label>
                      <select
                        value={treeValueKey}
                        onChange={(e) => setTreeValueKey(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                      >
                        {Object.keys(data[0] || {}).map(key => (
                          <option key={key} value={key}>{key}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}



              </div>
            </div>
        </motion.div>
      )}

        <motion.div 
          className="control-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="section-title underline">Chart Selection</h3>
          <motion.input
            type="text"
            className="search-input"
            placeholder="Search charts..."
            value={searchQueryChartSelection}
            onChange={(e) => setSearchQueryChartSelection(e.target.value)}
            whileFocus={{ boxShadow: "0 0 0 2px rgba(76, 175, 80, 0.4)" }}
            transition={{ duration: 0.2 }}
          />
          
          <div className="chart-type-grid">
            <AnimatePresence>
              {filteredChartTypes.length > 0 ? (
                filteredChartTypes.map(([type, details], index) => (
                  <motion.button
                    key={type}
                    onClick={() => setChartType(type)}
                    className={`chart-type-button ${chartType === type ? 'active' : ''}`}
                    variants={chartButtonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    animate={chartType === type ? "selected" : "initial"}
                    custom={index}
                    layout
                    transition={{ 
                      layout: { duration: 0.3 },
                      delay: index * 0.05
                    }}
                  >
                    <span className="chart-icon">{details.icon}</span>
                    <span className="chart-label">{details.label}</span>
                  </motion.button>
                ))
              ) : (
                <motion.div
                  className="no-chart-message text-gray-500 text-lg italic"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  This chart is yet to be implemented
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.aside>

      <motion.main 
        className="main-content"
        initial="hidden"
        animate="visible"
        variants={contentVariants}
      >
        <motion.div 
          className="header"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="page-title">Advanced Data Visualization</h1>
          <p className="page-description">
            {data
              ? `Showing ${chartTypes[chartType].label} visualization of your data`
              : 'Upload data to get started with visualization'}
          </p>
        </motion.div>
        <motion.div
          className="chart-section mb-8"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {data && data.length > 0 && (
            <div className="flex justify-end mb-4" ref={menuRef}>
              <div className="relative inline-block text-left">
                <motion.button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-md transition flex items-center gap-2 shadow-sm"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Download size={18} />
                  <span>Export Chart</span>
                </motion.button>

                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 overflow-hidden"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {exportOptions.map(({ type, label, icon }) => (
                        <motion.button
                          key={type}
                          onClick={() => {
                            exportChart(type);
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                          whileHover={{ backgroundColor: "#f3f4f6" }}
                          role="menuitem"
                        >
                          <span className="text-emerald-600">{icon}</span>
                          <span>{label}</span>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
          
          {/* Chart container with the ChartArea component */}
            {data ? (
              <ChartArea
                data={data}
                chartType={chartType}
                xKey={xKey}
                yKey={yKey}
                zKey={zKey}
                groupKey={groupKey}
                treeNameKey={treeNameKey} // optional if needed
                treeValueKey={treeValueKey}
                treeParentKey={treeParentKey} // optional for parent-based trees
                treeHierarchyKeys={treeHierarchyKeys}
              />
             
            ) : (
              <div className="flex flex-col items-center justify-center p-12 ml-4 text-center bg-white rounded-lg shadow-md">
                <div className="text-gray-400 mb-4">
                  {chartTypes[chartType].icon && React.cloneElement(chartTypes[chartType].icon, { size: 48 })}
                </div>
                <p className="text-gray-500 text-lg">
                  Upload data to generate a {chartTypes[chartType].label}
                </p>
              </div>
            )}
        </motion.div>

        {/* Data Table Section */}
        <motion.div
          className="bg-white rounded-lg ml-4 shadow-md p-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="table-header mb-2">
            <h2 className="text-3xl font-semibold mb-2">Data Table</h2>
            <div className="p-2 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            {data && data.length > 0 && (
              <div className="flex gap-3">
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-3 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-lg font-medium transition-colors"
                >
                  <FileText size={18} />
                  CSV
                </button>
                <button
                  onClick={exportToJSON}
                  className="flex items-center gap-3 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-lg font-medium transition-colors"
                >
                  <FileJson size={18} />
                  JSON
                </button>
                <button
                  onClick={exportToExcel}
                  className="flex items-center gap-3 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white text-lg font-medium transition-colors"
                >
                  <Download size={18} />
                  Excel
                </button>
              </div>
            )}
            </div>
          </div>
          <div className="table-wrapper">
            <DataTable data={data} setData={setData} searchTerm={searchQueryDataTable} />
          </div>
        </motion.div>
      </motion.main>

      {/* Notification Animation */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            className="upload-notification success"
            variants={notificationVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            Data successfully processed and ready for visualization!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
);
};

export default Dashboard;