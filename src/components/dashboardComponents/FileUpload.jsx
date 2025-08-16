import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import * as ExcelJS from 'exceljs';

const FileUpload = ({ onDataProcessed, onSheetModalChange }) => {
  const fileInputRef = useRef();

  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [excelSheets, setExcelSheets] = useState([]);
  const [showSheetSelection, setShowSheetSelection] = useState(false);
  const [selectedSheets, setSelectedSheets] = useState([]);
  const [currentWorkbook, setCurrentWorkbook] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');
  
  // Constants for large file handling
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
  const CHUNK_SIZE = 1000; // Process data in chunks of 1000 rows
  const MAX_DISPLAY_ROWS = 10000; // Limit display for performance

  // Handle body scroll lock when modal is open
  useEffect(() => {
    if (showSheetSelection) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showSheetSelection]);

  useEffect(() => {
    if (onSheetModalChange) {
      onSheetModalChange(showSheetSelection);
    }
  }, [showSheetSelection, onSheetModalChange]);

  const processExcelSheet = (worksheet) => {
    const headers = [];
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell, colNumber) => {
      headers[colNumber - 1] = cell.value ? cell.value.toString().trim() : `Column_${colNumber}`;
    });

    const rawData = [];
    const totalRows = Math.min(worksheet.rowCount, MAX_DISPLAY_ROWS + 1); // Limit rows for performance
    
    for (let rowIndex = 2; rowIndex <= totalRows; rowIndex++) {
      const currentRow = worksheet.getRow(rowIndex);
      const row = {};
      let hasData = false;
      
      for (let colIndex = 0; colIndex < headers.length; colIndex++) {
        const cell = currentRow.getCell(colIndex + 1);
        const value = cell.value !== null && cell.value !== undefined ? String(cell.value).trim() : '';
        row[headers[colIndex]] = value;
        if (value !== '') hasData = true;
      }
      
      if (hasData) {
        rawData.push(row);
      }
    }

    if (rawData.length === 0) {
      throw new Error(`Sheet '${worksheet.name}' has no valid data rows`);
    }

    // If we hit the row limit, add a warning
    if (worksheet.rowCount > MAX_DISPLAY_ROWS + 1) {
      console.warn(`Large dataset detected. Showing first ${MAX_DISPLAY_ROWS} rows for performance.`);
    }

    return rawData;
  };

  // Optimized CSV processing for large files
  const processCSVChunked = async (csvText) => {
    const lines = csvText.split('\n');
    const totalLines = lines.length;
    
    if (totalLines === 0) throw new Error('CSV file is empty');
    
    // Process headers
    const headerLine = lines[0].trim();
    const headers = headerLine.split(',').map(header => header.replace(/"/g, '').trim());
    
    const processedData = [];
    const maxRows = Math.min(totalLines - 1, MAX_DISPLAY_ROWS);
    
    // Process in chunks to prevent UI blocking
    for (let i = 1; i <= maxRows; i += CHUNK_SIZE) {
      const chunkEnd = Math.min(i + CHUNK_SIZE, maxRows + 1);
      const chunkLines = lines.slice(i, chunkEnd);
      
      // Update progress
      const progress = Math.round((i / maxRows) * 100);
      setUploadProgress(progress);
      setLoadingMessage(`Processing data... ${progress}%`);
      
      // Process chunk
      for (const line of chunkLines) {
        if (line.trim()) {
          const values = line.split(',').map(value => value.replace(/"/g, '').trim());
          const row = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          processedData.push(row);
        }
      }
      
      // Allow UI to update
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    if (totalLines > MAX_DISPLAY_ROWS + 1) {
      console.warn(`Large dataset detected. Showing first ${MAX_DISPLAY_ROWS} rows for performance.`);
    }
    
    return processedData;
  };

  const handleSheetSelection = () => {
    if (!currentWorkbook || selectedSheets.length === 0) {
      setError('Please select at least one sheet');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let combinedData = [];

      if (selectedSheets.length === 1) {
        const sheet = currentWorkbook.worksheets.find(ws => ws.id === selectedSheets[0]);
        combinedData = processExcelSheet(sheet);
      } else {
        for (const sheetId of selectedSheets) {
          const sheet = currentWorkbook.worksheets.find(ws => ws.id === sheetId);
          const sheetData = processExcelSheet(sheet);
          
          const dataWithSheetName = sheetData.map(row => ({
            Sheet: sheet.name,
            ...row
          }));
          
          combinedData = [...combinedData, ...dataWithSheetName];
        }
      }

      onDataProcessed(combinedData);
      setShowSheetSelection(false);
      setExcelSheets([]);
      setSelectedSheets([]);
      setCurrentWorkbook(null);
    } catch (error) {
      console.error('Sheet processing error:', error);
      setError(`Error processing sheets: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSheetSelection = (sheetId) => {
    setSelectedSheets(prev => 
      prev.includes(sheetId) 
        ? prev.filter(id => id !== sheetId)
        : [...prev, sheetId]
    );
  };

  const selectAllSheets = () => {
    setSelectedSheets(excelSheets.map(sheet => sheet.id));
  };

  const clearSheetSelection = () => {
    setSelectedSheets([]);
  };

  const processFile = async (file) => {
    // File size validation
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setUploadProgress(0);
    setLoadingMessage('Reading file...');

    const reader = new FileReader();

    reader.onload = async (e) => {
      const contents = e.target.result;
      let processedData;

      try {
        setLoadingMessage('Processing data...');
        
        if (file.name.endsWith('.csv')) {
          // Use optimized CSV processing for large files
          if (file.size > 5 * 1024 * 1024) { // 5MB+
            processedData = await processCSVChunked(contents);
          } else {
            processedData = d3.csvParse(contents);
          }
          
          if (!processedData || processedData.length === 0) {
            throw new Error('CSV file appears to be empty or invalid');
          }
        } else if (file.name.endsWith('.json')) {
          setLoadingMessage('Parsing JSON...');
          const jsonData = JSON.parse(contents);
        
          if (Array.isArray(jsonData)) {
            // Limit JSON array size for performance
            processedData = jsonData.slice(0, MAX_DISPLAY_ROWS);
            if (jsonData.length > MAX_DISPLAY_ROWS) {
              console.warn(`Large JSON dataset detected. Showing first ${MAX_DISPLAY_ROWS} rows for performance.`);
            }
          } else if (typeof jsonData === 'object' && jsonData !== null) {
            if (Array.isArray(jsonData.data)) {
              processedData = jsonData.data.slice(0, MAX_DISPLAY_ROWS);
              if (jsonData.data.length > MAX_DISPLAY_ROWS) {
                console.warn(`Large JSON dataset detected. Showing first ${MAX_DISPLAY_ROWS} rows for performance.`);
              }
            } else {
              processedData = [jsonData];
            }
          } else {
            throw new Error('JSON file must contain an array of objects or an object with a "data" array');
          }        
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          setLoadingMessage('Loading Excel file...');
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(e.target.result);
          
          setLoadingMessage('Reading Excel sheets...');
          // Get all worksheets with data
          const sheets = workbook.worksheets.filter(sheet => sheet.rowCount > 1);
          
          if (sheets.length === 0) {
            throw new Error('Excel file has no sheets with data');
          }
          
          // If multiple sheets, show selection interface
          if (sheets.length > 1) {
            const sheetOptions = sheets.map(sheet => ({
              id: sheet.id,
              name: sheet.name,
              rowCount: Math.min(sheet.rowCount - 1, MAX_DISPLAY_ROWS) // Show limited row count
            }));
            
            setExcelSheets(sheetOptions);
            setCurrentWorkbook(workbook);
            setShowSheetSelection(true);
            setIsLoading(false);
            setUploadProgress(100);
            return;
          }
          
          // Single sheet - process directly
          setLoadingMessage('Processing Excel data...');
          const worksheet = sheets[0];
          processedData = processExcelSheet(worksheet);
        } else {
          throw new Error('Unsupported file format. Please upload CSV, Excel, or JSON files.');
        }

        if (!processedData || processedData.length === 0) {
          throw new Error('No valid data found in the file');
        }

        setUploadProgress(100);
        setLoadingMessage('Data processed successfully!');
        
        // Small delay to show completion message
        await new Promise(resolve => setTimeout(resolve, 500));
        
        onDataProcessed(processedData);
      } catch (error) {
        console.error('File processing error:', error);
        setError(`Error processing file: ${error.message}`);
      } finally {
        setIsLoading(false);
        setUploadProgress(0);
        setLoadingMessage('');
      }
    };

    reader.onerror = () => {
      setError('Failed to read file');
      setIsLoading(false);
      setUploadProgress(0);
      setLoadingMessage('');
    };

    // Add progress tracking for file reading
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const progress = Math.round((e.loaded / e.total) * 50); // First 50% for reading
        setUploadProgress(progress);
      }
    };

    if (file.name.endsWith('.csv') || file.name.endsWith('.json')) {
      reader.readAsText(file);
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      reader.readAsArrayBuffer(file);
    } else {
      setError('Unsupported file format. Please upload a CSV, Excel, or JSON file.');
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      resetModalAndFile();
      setSelectedFile(file);
      processFile(file);
      // Reset the input value so uploading the same file again triggers onChange
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      resetModalAndFile();
      setSelectedFile(file);
      processFile(file);
    }
  };

  const dropzoneVariants = {
    idle: {
      backgroundColor: "var(--feature-background)",
      border: "1px dashed var(--input-border-color)"
    },
    dragging: {
      backgroundColor: "var(--chart-item-hover)",
      border: "1px dashed var(--button-primary-background)",
      scale: 1.02
    },
    loading: {
      borderColor: "var(--button-primary-background)",
      boxShadow: "0 0 0 2px rgba(76, 175, 80, 0.2)"
    },
    error: {
      borderColor: "#f44336",
      boxShadow: "0 0 0 2px rgba(244, 67, 54, 0.2)"
    }
  };

  const loaderVariants = {
    initial: { rotate: 0 },
    animate: {
      rotate: 360,
      transition: {
        repeat: Infinity,
        duration: 1,
        ease: "linear"
      }
    }
  };

  const resetModalAndFile = () => {
    setShowSheetSelection(false);
    setExcelSheets([]);
    setSelectedSheets([]);
    setCurrentWorkbook(null);
    setSelectedFile(null);
    setError(null);
    setIsLoading(false);
    setUploadProgress(0);
    setLoadingMessage('');
  };

  return (
    <div className="file-upload">
      {/* Sheet Selection Modal */}
      {showSheetSelection && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="modal-overlay"
          onClick={(e) => {
            // Close modal if clicking on backdrop
            if (e.target === e.currentTarget) {
              resetModalAndFile();
            }
          }}
        >
            {/* Modal Container */}
            <div className="flex items-center justify-center min-h-full p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="modal-container bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col relative"
                onClick={(e) => e.stopPropagation()}
              >
            {/* Header */}
            <div className="mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xxl font-bold text-gray-900 mb-1">
                    Select Excel Sheets
                  </h3>
                  <p className="text-lg text-gray-600">
                    This file contains multiple sheets. Choose which ones to load:
                  </p>
                </div>
                <button
                  onClick={resetModalAndFile}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-4 flex gap-2">
              <button
                onClick={selectAllSheets}
                className="px-4 py-2 text-lg font-medium bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-200"
              >
                ✓ Select All
              </button>
              <button
                onClick={clearSheetSelection}
                className="px-4 py-2 text-lg font-medium bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
              >
                ✗ Clear All
              </button>
              <div className="flex-1"></div>
              <div className="text-lg text-gray-500 flex items-center">
                {selectedSheets.length} of {excelSheets.length} selected
              </div>
            </div>

            {/* Sheets List */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-6 max-h-60">
              {excelSheets.map((sheet, index) => (
                <motion.label
                  key={sheet.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center p-4 rounded-xl border-2 cursor-pointer ${
                    selectedSheets.includes(sheet.id)
                      ? "border-emerald-300 bg-emerald-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <div className="relative mr-4">
                    <input
                      type="checkbox"
                      checked={selectedSheets.includes(sheet.id)}
                      onChange={() => toggleSheetSelection(sheet.id)}
                      className="sr-only"
                    />
                    <div
                      onClick={() => toggleSheetSelection(sheet.id)}
                      className={`w-6 h-6 border-2 rounded-md cursor-pointer transition-all duration-200 flex items-center justify-center ${
                        selectedSheets.includes(sheet.id)
                          ? 'bg-emerald-600 border-emerald-600 shadow-md'
                          : 'bg-white border-emerald-300 hover:border-emerald-500'
                      }`}
                    >
                      {selectedSheets.includes(sheet.id) && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1 flex items-center">
                      📄 {sheet.name}
                    </div>
                    <div className="text-lg text-gray-600 flex items-center">
                      {sheet.rowCount.toLocaleString()} rows of data
                    </div>
                  </div>
                  {selectedSheets.includes(sheet.id) && (
                    <div className="ml-2 text-emerald-600">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </motion.label>
              ))}
            </div>

            {/* Multi-sheet Notice */}
            {selectedSheets.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 border border-emerald-500 bg-emerald-50/50 shadow-md rounded-lg"
              >
                <div className="flex items-start">
                  <div className="mr-2 text-emerald-600">
                    <svg className="w-6 h-6 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xl font-medium text-emerald-800 mb-1">Multiple Sheets Selected</p>
                    <p className="text-lg text-emerald-800">
                      All selected sheets will be combined into one dataset with a "Sheet" column to identify the source.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleSheetSelection}
                disabled={selectedSheets.length === 0 || isLoading}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    Load Selected ({selectedSheets.length})
                  </>
                )}
              </button>
              <button
                onClick={resetModalAndFile}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="flex items-start">
                  <div className="mr-2 text-red-500">
                    <svg className="w-5 h-5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
            </div>
        </motion.div>
      )}

      <motion.div
        className={`dropzone ${isDragging ? 'dragging' : ''} ${error ? 'error' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        variants={dropzoneVariants}
        animate={error ? "error" : isLoading ? "loading" : isDragging ? "dragging" : "idle"}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
        style={{
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          cursor: 'pointer',
          position: 'relative',
          minHeight: '100px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '0'
        }}
      >
        {isLoading ? (
          <div style={{ textAlign: 'center', width: '100%' }}>
            <motion.div
              variants={loaderVariants}
              initial="initial"
              animate="animate"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '4px solid var(--chart-item-active)',
                borderTopColor: 'var(--button-primary-background)',
                margin: '0 auto 20px'
              }}
            />
            
            {/* Progress Bar */}
            {uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <motion.div
                  className="bg-emerald-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}
            
            {/* Loading Message */}
            <p className="text-lg font-medium text-gray-700 mb-2">
              {loadingMessage || 'Processing file...'}
            </p>
            
            {/* Progress Percentage */}
            {uploadProgress > 0 && (
              <p className="text-sm text-gray-500">
                {uploadProgress}% complete
              </p>
            )}
            
            {/* File Size Info for Large Files */}
            {selectedFile && selectedFile.size > 10 * 1024 * 1024 && (
              <p className="text-sm text-amber-600 mt-2">
                Processing large file ({(selectedFile.size / 1024 / 1024).toFixed(1)}MB)...
              </p>
            )}
          </div>
        ) : (
          <>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {error ? (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f44336" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              ) : (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className='text-gray-500'>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              )}
            </motion.div>

            {error ? (
              <div className="text-red-500 mt-2">{error}</div>
            ) : (
              <>
                <p className='text-gray-500'>Drag and drop a file here or click to browse</p>
                {selectedFile && <span className="file-name">Selected: {selectedFile.name}</span>}
              </>
            )}
          </>
        )}

        <input
          type="file"
          onChange={handleFileChange}
          accept=".csv,.json,.xlsx,.xls"
          style={{ opacity: 0, position: 'absolute', top: 0, left: 0, bottom: 0, width: '100%', height: '100%', cursor: 'pointer' }}
          title="Upload file"
          ref={fileInputRef}
        />
      </motion.div>

      <div className="upload-info" style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.2' }}>
        <p>Upload a CSV, Excel, or JSON file to visualize your data.</p>
        <p>Supported formats: .csv, .xlsx, .xls, .json</p>
        <p>Maximum file size: 100MB.</p>
        {error && <p className="text-red-500 mt-2">Error: {error}</p>}
      </div>
    </div>
  );
};

export default FileUpload;