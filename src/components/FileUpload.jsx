import { useState } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import * as ExcelJS from 'exceljs';

const FileUpload = ({ onDataProcessed }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);

  const processFile = (file) => {
    setIsLoading(true);
    setError(null);

    const reader = new FileReader();

    reader.onload = async (e) => {
      const contents = e.target.result;
      let processedData;

      try {
        if (file.name.endsWith('.csv')) {
          processedData = d3.csvParse(contents);
          if (!processedData || processedData.length === 0) {
            throw new Error('CSV file appears to be empty or invalid');
          }
        } else if (file.name.endsWith('.json')) {
          const jsonData = JSON.parse(contents);
        
          if (Array.isArray(jsonData)) {
            processedData = jsonData;
          } else if (typeof jsonData === 'object' && jsonData !== null) {
            if (Array.isArray(jsonData.data)) {
              // 🛠 If a 'data' field exists, use it
              processedData = jsonData.data;
            } else {
              processedData = [jsonData]; // Treat as single object
            }
          } else {
            throw new Error('JSON file must contain an array of objects or an object with a "data" array');
          }        
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(e.target.result);
          const worksheet = workbook.worksheets[0];
          if (!worksheet || worksheet.rowCount <= 1) {
            throw new Error('Excel file has no data rows');
          }

          const headers = [];
          worksheet.getRow(1).eachCell((cell, colNumber) => {
            headers[colNumber - 1] = cell.value ? cell.value.toString().trim() : `Column_${colNumber}`;
          });

          const rawData = [];
          for (let rowIndex = 2; rowIndex <= worksheet.rowCount; rowIndex++) {
            const row = {};
            worksheet.getRow(rowIndex).eachCell((cell, colNumber) => {
              row[headers[colNumber - 1]] = cell.value || '';
            });
            rawData.push(row);
          }

          if (rawData.length === 0) {
            throw new Error('Excel file has no valid data rows');
          }

          processedData = rawData;
        } else {
          throw new Error('Unsupported file format');
        }

        if (!processedData || processedData.length === 0) {
          throw new Error('No valid data found in the file');
        }

        onDataProcessed(processedData);
      } catch (error) {
        console.error('File processing error:', error);
        setError(`Error processing file: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setError('Failed to read file');
      setIsLoading(false);
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
      setSelectedFile(file);
      processFile(file);
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

  return (
    <div className="file-upload">
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
          marginBottom: '10px',
          position: 'relative',
          minHeight: '100px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {isLoading ? (
          <div style={{ textAlign: 'center' }}>
            <motion.div
              variants={loaderVariants}
              initial="initial"
              animate="animate"
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                border: '3px solid var(--chart-item-active)',
                borderTopColor: 'transparent',
                margin: '0 auto 15px'
              }}
            />
            <p>Processing file...</p>
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
        />
      </motion.div>

      <div className="upload-info" style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.2' }}>
        <p>Upload a CSV, Excel, or JSON file to visualize your data.</p>
        <p>Supported formats: .csv, .xlsx, .xls, .json</p>
        {error && <p className="text-red-500 mt-2">Error: {error}</p>}
      </div>
    </div>
  );
};

export default FileUpload;