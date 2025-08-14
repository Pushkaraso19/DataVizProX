import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChartTypes from '../components/dashboardComponents/ChartTypes'
import FileUpload from '../components/dashboardComponents/FileUpload';
import ChartArea from '../components/dashboardComponents/ChartArea';
import DataTable from '../components/dashboardComponents/DataTable';
import ExcelJS from 'exceljs'
import { Download, FileJson, FileText, FileImage, Image, Code2, ChevronDown } from 'lucide-react';
import './Dashboard.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [chartType, setChartType] = useState('area');
  const [toolMode, setToolMode] = useState('default');
  const chartAreaRef = useRef(null);
  const [chartColors, setChartColors] = useState({
    primary: '#4caf50',
    text: '#333333',
    axis: '#666666'
  });
  const [searchQueryChartSelection, setSearchQueryChartSelection] = useState('');
  const [searchQueryDataTable, setSearchQueryDataTable] = useState('');
  const [xKey, setXKey] = useState('');
  const [zKey, setZKey] = useState('');
  const [yKey, setYKey] = useState('');
  const [groupKey, setGroupKey] = useState('');
  const [colorMap, setColorMap] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const menuRef = useRef(null);
  const exportDropdownRef = useRef(null);
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
  const [treeValueSearch, setTreeValueSearch] = useState('');
  const [treeValueDropdownOpen, setTreeValueDropdownOpen] = useState(false);
  const [treeParentKey, setTreeParentKey] = useState(null);
  const [treeHierarchyKeys, setTreeHierarchyKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sheetModalOpen, setSheetModalOpen] = useState(false);
  

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Handle export dropdown
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      
      // Handle other dropdowns
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setXAxisDropdownOpen(false);
        setYAxisDropdownOpen(false);
        setGroupDropdownOpen(false);
        setZAxisDropdownOpen(false);
        setTreeValueDropdownOpen(false);
      }
    };

    const handleKeyPress = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setXAxisDropdownOpen(false);
        setYAxisDropdownOpen(false);
        setGroupDropdownOpen(false);
        setZAxisDropdownOpen(false);
        setTreeValueDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);
  
  const handleDataProcessed = (processedData) => {
    if (processedData && processedData.length > 0) {
      try {
        // Validate data structure
        const headers = Object.keys(processedData[0]);
        console.log('Data headers:', headers);
        console.log(`Dataset size: ${processedData.length} rows, ${headers.length} columns`);
        
        // Performance warning for very large datasets
        if (processedData.length > 50000) {
          console.warn('Large dataset detected. Performance optimizations are active.');
        }
        
        // Set simple default selections
        setXKey(headers[0] || '');
        setYKey(headers[1] || '');
        setXAxisSearch(''); 
        setYAxisSearch('');
        
        setData(processedData);
        
      } catch (error) {
        console.error('Error processing data:', error);
        alert('Error processing data: ' + error.message);
      }
    }
  };
  


  const filteredChartTypes = Object.entries(ChartTypes).filter(([key, details]) =>
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
        <h2 className="text-3xl font-bold mb-6" style={{ color: '#000' }}>
          <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Dashboard</span> Controls
        </h2>

        <div className="control-section">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-emerald-200">
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Data</span> Source
          </h3>
          <FileUpload onDataProcessed={handleDataProcessed} onSheetModalChange={setSheetModalOpen} />
        </div>

        {/* Customization Section  */}
        {data && (
          <motion.div
            className="control-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-2xl font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-emerald-200">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Chart</span> Customization
            </h3>            
            <div className="space-y-4">

              {/* Data Mapping */}
              <div className="space-y-3">
                <h4 className="font-semibold text-xl text-gray-700 mb-3">
                  Data <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Mapping</span>
                </h4>

                {/* X-Axis Selection */}
                <div className="mb-4 relative">
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    {(() => {
                      if (['pie'].includes(chartType)) return "Category";
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
                      className="w-full p-2 border border-gray-300 rounded pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    />
                    <ChevronDown
                      size={16}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    />
                  </div>

                  {xAxisDropdownOpen && (
                    <div className="absolute z-10 bg-white border border-gray-200 rounded-xl w-full max-h-64 overflow-y-auto mt-1 shadow-lg ring-1 ring-black ring-opacity-5"
                         style={{ animation: 'fadeIn 0.2s ease-out' }}>
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
                            className="p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium text-gray-900 text-base">{key}</div>
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
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                      {(() => {
                        if (['pie'].includes(chartType)) return "Value";
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
                        className="w-full p-2 border border-gray-300 rounded pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                      />
                      <ChevronDown
                        size={16}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                      />
                    </div>

                    {yAxisDropdownOpen && (
                      <div className="absolute z-10 bg-white border border-gray-200 rounded-xl w-full max-h-64 overflow-y-auto mt-1 shadow-lg ring-1 ring-black ring-opacity-5"
                           style={{ animation: 'fadeIn 0.2s ease-out' }}>
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
                              className="p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                            >
                              <div className="flex items-center space-x-3">
                                {['radar', 'stackedBar', 'stackedBar100', 'groupedBar'].includes(chartType) && (
                                  <input
                                    type="checkbox"
                                    checked={Array.isArray(yKey) && yKey.includes(key)}
                                    readOnly
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                  />
                                )}
                                <div className="font-medium text-gray-900 text-base">{key}</div>
                              </div>
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
                    <label className="block text-lg font-semibold text-gray-700 mb-2">Size</label>
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
                        className="w-full p-2 border border-gray-300 rounded pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                      />
                      <ChevronDown
                        size={16}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                      />
                    </div>

                    {zAxisDropdownOpen && (
                      <div className="absolute z-10 bg-white border border-gray-200 rounded-xl w-full max-h-64 overflow-y-auto mt-1 shadow-lg ring-1 ring-black ring-opacity-5"
                           style={{ animation: 'fadeIn 0.2s ease-out' }}>
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
                              className="p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium text-gray-900 text-base">{key}</div>
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
                    <label className="block text-lg font-semibold text-gray-700 mb-2">Group By</label>
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
                        className="w-full p-2 border border-gray-300 rounded pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                      />
                      <ChevronDown
                        size={16}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                      />
                    </div>

                    {groupDropdownOpen && (
                      <div className="absolute z-10 bg-white border border-gray-200 rounded-xl w-full max-h-64 overflow-y-auto mt-1 shadow-lg ring-1 ring-black ring-opacity-5"
                           style={{ animation: 'fadeIn 0.2s ease-out' }}>
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
                              className="p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium text-gray-900 text-base">{key}</div>
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

                {['sunburst'].includes(chartType) && (
                  <>
                    {/* Tree Levels Mapping */}
                    <div className="mb-4 relative">
                      <label className="block text-lg font-semibold text-gray-700 mb-2">Hierarchy Levels (Top to Bottom)</label>
                      <div className="space-y-2 max-h-48 overflow-y-auto p-3 border border-gray-200 rounded-xl bg-gray-50">
                        {Object.keys(data[0] || {}).map(key => {
                          const isSelected = treeHierarchyKeys.includes(key);
                          
                          return (
                            <div
                              key={key}
                              onClick={() => {
                                if (isSelected) {
                                  setTreeHierarchyKeys(treeHierarchyKeys.filter(k => k !== key));
                                } else {
                                  setTreeHierarchyKeys([...treeHierarchyKeys, key]);
                                }
                              }}
                              className={`p-3 cursor-pointer transition-all duration-200 border-2 rounded-lg ${
                                isSelected 
                                  ? 'border-blue-400 bg-blue-50 shadow-sm' 
                                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="font-medium text-gray-900 text-base">{key}</div>
                                {isSelected && (
                                  <div className="text-blue-500 font-bold text-lg">✓</div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Tree Value Mapping */}
                    <div className="mb-4 relative">
                      <label className="block text-lg font-semibold text-gray-700 mb-2">Node Value Field</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Select Value Field..."
                          value={treeValueSearch || treeValueKey}
                          onFocus={() => setTreeValueDropdownOpen(true)}
                          onBlur={() => setTimeout(() => setTreeValueDropdownOpen(false), 150)}
                          onChange={(e) => {
                            const value = e.target.value;
                            setTreeValueSearch(value);
                            setTreeValueDropdownOpen(true);
                            if (value.trim() === "") {
                              setTreeValueKey("");
                            }
                          }}
                          className="w-full p-3 border border-gray-300 rounded-lg pr-10 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                        />
                        <ChevronDown
                          size={16}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                        />
                      </div>

                      {treeValueDropdownOpen && (
                        <div className="absolute z-10 bg-white border border-gray-200 rounded-xl w-full max-h-64 overflow-y-auto mt-1 shadow-lg ring-1 ring-black ring-opacity-5"
                             style={{ animation: 'fadeIn 0.2s ease-out' }}>
                          {Object.keys(data[0] || {})
                            .filter((key) => key.toLowerCase().includes((treeValueSearch || '').toLowerCase()))
                            .map((key) => (
                              <div
                                key={key}
                                onMouseDown={() => {
                                  setTreeValueKey(key);
                                  setTreeValueSearch('');
                                  setTreeValueDropdownOpen(false);
                                }}
                                className="p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                              >
                                <div className="font-medium text-gray-900 text-base">{key}</div>
                              </div>
                            ))}
                        </div>
                      )}
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
          <h3 className="text-2xl font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-emerald-200">
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Chart</span> Selection
          </h3>
          
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
        {!data && !sheetModalOpen && (
          <motion.div 
            className="header"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight relative mb-4">
                Transform Your <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Data</span> into Beautiful <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Visualizations</span>
              </h1>
            </div>
            <p className="text-xl text-gray-600 leading-relaxed">
              Upload your data to get started with creating stunning visualizations that tell your story
            </p>
          </motion.div>
        )}
        <motion.div
          className="chart-section mb-8"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {data && data.length > 0 && (
            <>
              {data.length > 10000 && (
                <>
                  
                  {/* Dataset Info Bar */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        
                        {/* Performance indicators */}
                        {data.length > 10000 && (
                          <div className="flex items-center gap-2 text-amber-700 bg-amber-100 px-2 py-1 rounded">
                            <span className="text-sm font-medium">Performance optimizations active</span>
                          </div>
                        )}
                        
                        {data.length > 50000 && (
                          <div className="flex items-center gap-2 text-red-700 bg-red-100 px-2 py-1 rounded">
                            <span className="text-sm font-medium">Large dataset - data sampling enabled</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
              
              <div className="flex justify-end items-center gap-6 mb-6" ref={menuRef}>
                {/* Enhanced Chart Controls with Premium Glass Morphism */}
                <div className="flex items-center gap-6 bg-white/90 backdrop-blur-lg rounded-3xl p-2 shadow-2xl border border-white/20 ring-1 ring-emerald-100/30 hover:shadow-emerald-100/20 transition-all duration-500">
                  
                  {/* Zoom Controls Section */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent tracking-wide">
                        Zoom Control
                      </span>
                    </div>
                    <div className="flex gap-2 bg-gradient-to-r from-gray-50/90 to-gray-100/90 backdrop-blur-sm rounded-2xl p-3 border border-white/40 shadow-inner">
                      <motion.button
                        title="Zoom In (Ctrl + +)"
                        onClick={() => chartAreaRef.current?.zoomIn()}
                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50/80 to-emerald-100/80 hover:from-emerald-100 hover:to-emerald-200 text-emerald-700 hover:text-emerald-800  shadow-lg hover:shadow-emerald-200/50 border border-emerald-200/50 hover:border-emerald-300 group backdrop-blur-sm"
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <i className="fa-solid fa-plus text-base group-hover:scale-125 transition-transform"></i>
                      </motion.button>
                      <motion.button
                        title="Zoom Out (Ctrl + -)"
                        onClick={() => chartAreaRef.current?.zoomOut()}
                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50/80 to-emerald-100/80 hover:from-emerald-100 hover:to-emerald-200 text-emerald-700 hover:text-emerald-800  shadow-lg hover:shadow-emerald-200/50 border border-emerald-200/50 hover:border-emerald-300 group backdrop-blur-sm"
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <i className="fa-solid fa-minus text-base group-hover:scale-125 transition-transform "></i>
                      </motion.button>
                      <motion.button
                        title="Reset Zoom (Ctrl + 0)"
                        onClick={() => chartAreaRef.current?.resetZoom()}
                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50/80 to-emerald-100/80 hover:from-emerald-100 hover:to-emerald-200 text-emerald-700 hover:text-emerald-800  shadow-lg hover:shadow-emerald-200/50 border border-emerald-200/50 hover:border-emerald-300 group backdrop-blur-sm"
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <i className="fa-solid fa-expand text-base group-hover:scale-125 transition-transform "></i>
                      </motion.button>
                    </div>
                  </div>
                  
                  {/* Enhanced Separator with Gradient */}
                  <div className="relative h-12 w-px">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-300/60 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 via-emerald-200/40 to-transparent blur-sm"></div>
                  </div>
                  
                  {/* Tool Mode Controls */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold bg-gradient-to-r from-teal-600 via-emerald-500 to-emerald-600 bg-clip-text text-transparent tracking-wide">
                        Tool Mode
                      </span>
                    </div>
                    <div className="flex gap-2 bg-gradient-to-r from-gray-50/90 to-gray-100/90 backdrop-blur-sm rounded-2xl p-3 border border-white/40 shadow-inner">
                      <motion.button
                        title="Default Cursor"
                        onClick={() => setToolMode('default')}
                        className={`w-12 h-12 flex items-center justify-center rounded-xl backdrop-blur-sm ${
                          toolMode === 'default'
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-300/30 scale-95 ring-emerald-300/50'
                            : 'bg-gradient-to-br from-white/80 to-gray-50/80 hover:from-emerald-50 hover:to-emerald-100 text-gray-600 hover:text-emerald-700 border border-gray-200/60 hover:border-emerald-300/60 shadow-md hover:shadow-emerald-100/30'
                        }`}
                        whileHover={{ scale: toolMode === 'default' ? 0.9 : 1.15 }}
                        whileTap={{ scale: 0.85 }}
                      >
                        <i className={`fa-solid fa-arrow-pointer text-base ${toolMode === 'default' ? 'scale-110' : ''}`}></i>
                      </motion.button>
                      <motion.button
                        title="Pan Mode - Click and drag to navigate"
                        onClick={() => setToolMode('pan')}
                        className={`w-12 h-12 flex items-center justify-center rounded-xl  backdrop-blur-sm ${
                          toolMode === 'pan' 
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-300/30 scale-95  ring-emerald-300/50 ' 
                            : 'bg-gradient-to-br from-white/80 to-gray-50/80 hover:from-emerald-50 hover:to-emerald-100 text-gray-600 hover:text-emerald-700 border border-gray-200/60 hover:border-emerald-300/60 shadow-md hover:shadow-emerald-100/30'
                        }`}
                        whileHover={{ scale: toolMode === 'pan' ? 0.9 : 1.15 }}
                        whileTap={{ scale: 0.85 }}
                      >
                        <i className={`fa-solid fa-hand text-base  ${toolMode === 'pan' ? 'scale-110' : ''}`}></i>
                      </motion.button>
                      <motion.button
                        title="Pointer Mode - Precise selection and interaction"
                        onClick={() => setToolMode('pointer')}
                        className={`w-12 h-12 flex items-center justify-center rounded-xl  backdrop-blur-sm ${
                          toolMode === 'pointer' 
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-300/30 scale-95  ring-emerald-300/50 ' 
                            : 'bg-gradient-to-br from-white/80 to-gray-50/80 hover:from-emerald-50 hover:to-emerald-100 text-gray-600 hover:text-emerald-700 border border-gray-200/60 hover:border-emerald-300/60 shadow-md hover:shadow-emerald-100/30'
                        }`}
                        whileHover={{ scale: toolMode === 'pointer' ? 0.9 : 1.15 }}
                        whileTap={{ scale: 0.85 }}
                      >
                        <i className={`fa-solid fa-crosshairs text-base ${toolMode === 'pointer' ? 'scale-110' : ''}`}></i>
                      </motion.button>
                    </div>
                  </div>
                  
                  {/* Enhanced Separator with Gradient */}
                  <div className="relative h-12 w-px">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-300/60 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 via-emerald-200/40 to-transparent blur-sm"></div>
                  </div>
                  
                  {/* Premium Color Customization */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold bg-gradient-to-r from-teal-600 via-emerald-500 to-emerald-600 bg-clip-text text-transparent tracking-wide">
                        Color Palette
                      </span>
                    </div>
                    <div className="flex items-center gap-3 bg-gradient-to-r from-gray-50/90 to-gray-100/90 backdrop-blur-sm rounded-2xl p-2 border border-white/40 shadow-inner">
                      <div className="relative group">
                        <motion.div
                          className="relative p-1 rounded-xl border-2 border-white/80 shadow-xl hover:shadow-2xl bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <input
                            type="color"
                            value={chartColors.primary}
                            onChange={(e) => setChartColors(prev => ({ ...prev, primary: e.target.value }))}
                            className="w-10 h-10 rounded-lg cursor-pointer appearance-none border-none shadow-lg"
                            title="Primary Chart Color"
                          />
                          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
                        </motion.div>
                        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-lg font-semibold text-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-xl border border-gray-200/60 ring-1 ring-emerald-100/30">
                          Chart Color
                        </div>
                      </div>
                      <div className="relative group">
                        <motion.div
                          className="relative p-1 rounded-xl border-2 border-white/80 shadow-xl hover:shadow-2xl bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <input
                            type="color"
                            value={chartColors.text}
                            onChange={(e) => setChartColors(prev => ({ ...prev, text: e.target.value }))}
                            className="w-10 h-10 rounded-lg cursor-pointer appearance-none border-none shadow-lg"
                            title="Text Color"
                          />
                          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
                        </motion.div>
                        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-lg font-semibold text-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-xl border border-gray-200/60 ring-1 ring-emerald-100/30">
                          Text Color
                        </div>
                      </div>
                      <div className="relative group">
                        <motion.div
                          className="relative p-1 rounded-xl border-2 border-white/80 shadow-xl hover:shadow-2xl bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <input
                            type="color"
                            value={chartColors.axis}
                            onChange={(e) => setChartColors(prev => ({ ...prev, axis: e.target.value }))}
                            className="w-10 h-10 rounded-lg cursor-pointer appearance-none border-none shadow-lg"
                            title="Axis Color"
                          />
                          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
                        </motion.div>
                        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-lg font-semibold text-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-xl border border-gray-200/60 ring-1 ring-emerald-100/30">
                          Axis Color
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Premium Export Button */}
                <div className="relative inline-block text-left" ref={exportDropdownRef}>
                  <motion.button
                    className="relative bg-gradient-to-br from-emerald-600/95 via-emerald-500/95 to-teal-500/95 hover:from-emerald-500 hover:via-teal-500 hover:to-emerald-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-emerald-300/30 border border-emerald-400/30 backdrop-blur-sm overflow-hidden min-h-[48px] min-w-[100px]"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Download size={20} className="drop-shadow-md" />
                    <span className="font-bold text-lg">Export</span>
                    <motion.i 
                      className="fa-solid fa-chevron-down text-base ml-1"
                      animate={{ rotate: isMenuOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>

                  <AnimatePresence>
                    {isMenuOpen && (
                      <motion.div
                        className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-lg border border-white/20 rounded-xl shadow-xl z-30 overflow-hidden ring-1 ring-emerald-100/30"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <div className="p-3">
                          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest px-4 py-3 mb-2 border-b border-gray-200/50 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 rounded-2xl">
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent tracking-wide">
                                Export Options
                              </span>
                            </div>
                          </div>
                          {exportOptions.map(({ type, label, icon }, index) => (
                            <motion.button
                              key={type}
                              onClick={() => {
                                exportChart(type);
                                setIsMenuOpen(false);
                              }}
                              className="flex items-center gap-4 w-full text-left px-4 py-4 text-base font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50/80 hover:via-teal-50/60 hover:to-emerald-50/80 hover:text-emerald-700 rounded-2xl transition-all duration-300 group backdrop-blur-sm border border-transparent hover:border-emerald-200/30 shadow-lg hover:shadow-emerald-200/50 mb-2"
                              initial={{ opacity: 0, x: 0 }}
                              animate={{ opacity: 1, x: 0 }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              role="menuitem"
                            >
                              <span className="text-emerald-600 group-hover:text-emerald-700 group-hover:scale-115 transition-all w-6 flex justify-center">
                                {icon}
                              </span>
                              <span className="flex-1 tracking-wide text-lg">{label}</span>
                              <i className="fa-solid fa-arrow-right text-sm opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-emerald-600"></i>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </>
          )}
          
          {/* Chart container with the ChartArea component */}
            {data ? (
              <ChartArea
                ref={chartAreaRef}
                data={data}
                chartType={chartType}
                xKey={xKey}
                yKey={yKey}
                zKey={zKey}
                groupKey={groupKey}
                treeNameKey={treeNameKey} 
                treeValueKey={treeValueKey}
                treeParentKey={treeParentKey} 
                treeHierarchyKeys={treeHierarchyKeys}
                toolMode={toolMode}
                chartColors={chartColors}
              />
             
            ) : (
              <div className="flex flex-col items-center justify-center p-12 ml-4 text-center bg-white rounded-lg shadow-md">
                <div className="text-gray-400 mb-4">
                  {ChartTypes[chartType].icon && React.cloneElement(ChartTypes[chartType].icon, { size: 48 })}
                </div>
                <p className="text-gray-500 text-lg">
                  Upload data to generate a {ChartTypes[chartType].label}
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
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Data</span> Table
            </h2>
            <div className="border-b border-emerald-100 flex flex-col sm:flex-row justify-between items-start gap-6">
            {/* Search and Stats Section */}
            {data && data.length > 0 && (
              <div className="flex flex-col gap-4 flex-1">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-md">
                    <input
                      type="text"
                      placeholder="Search data..."
                      value={searchQueryDataTable}
                      onChange={(e) => setSearchQueryDataTable(e.target.value)}
                      className="w-full pl-12 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-base"
                    />
                    <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  </div>
                  
                    <div className="items-center gap-3 px-6 py-3 text-gray-600 bg-gray-50 rounded-lg border">
                      <span className="font-bold">{data.length}</span> total records
                    </div>
                </div>
              </div>
            )}
            
            {/* Export Buttons Section */}
            {data && data.length > 0 && (
              <div className="flex flex-wrap gap-3 items-center">
                <motion.button
                  onClick={exportToCSV}
                  className="flex items-center gap-3 px-6 py-3  hover:to-teal-100 border-2 border-emerald-200 hover:border-emerald-300 rounded-xl text-emerald-700 hover:text-emerald-800 text-base font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                >
                  <FileText size={20} className="transition-transform duration-300" />
                  <span>Export CSV</span>
                  {loading && <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />}
                </motion.button>
                
                <motion.button
                  onClick={exportToJSON}
                  className="flex items-center gap-3 px-6 py-3  hover:to-teal-100 border-2 border-emerald-200 hover:border-emerald-300 rounded-xl text-emerald-700 hover:text-emerald-800 text-base font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 group"
                  whileHover={{ scale: 1.05}}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                >
                  <FileJson size={20} className="transition-transform duration-300" />
                  <span>Export JSON</span>
                  {loading && <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />}
                </motion.button>
                
                <motion.button
                  onClick={exportToExcel}
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-600/95 to-teal-500/95 hover:to-emerald-400 rounded-xl text-white text-base font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 group border-2 border-green-500/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                >
                  <Download size={20} className="transition-transform duration-300" />
                  <span>Export Excel</span>
                  {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                </motion.button>
              </div>
            )}
            </div>
          </div>
          <div className="table-wrapper">
            <DataTable data={data} setData={setData} searchTerm={searchQueryDataTable} />
          </div>
        </motion.div>
      </motion.main>
    </div>
);
};

export default Dashboard;