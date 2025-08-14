import { useState, useMemo, useEffect, useCallback } from 'react';

const DataTable = ({ data, setData, searchTerm }) => {
  const [editedData, setEditedData] = useState(data || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [isLargeDataset, setIsLargeDataset] = useState(false);

  // Check if dataset is large and adjust settings accordingly
  useEffect(() => {
    const isLarge = data && data.length > 5000;
    setIsLargeDataset(isLarge);
    
    // Increase rows per page for large datasets to reduce pagination
    if (isLarge && rowsPerPage < 50) {
      setRowsPerPage(50);
    }
  }, [data, rowsPerPage]);

  useEffect(() => {
    setEditedData(data || []);
    setCurrentPage(1);
  }, [data]);

  // Memoized filtering and sorting for better performance
  const filteredData = useMemo(() => {
    if (!editedData.length) return [];
    
    let filtered = [...editedData];
    
    // Search filtering
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(row =>
        Object.values(row).some(value => {
          const stringValue = String(value);
          return stringValue.toLowerCase().includes(searchLower);
        })
      );
    }
    
    // Sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        // Handle numeric sorting
        const aNum = Number(aValue);
        const bNum = Number(bValue);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortConfig.direction === 'ascending' ? aNum - bNum : bNum - aNum;
        }
        
        // Handle string sorting
        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();
        if (aStr < bStr) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aStr > bStr) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    
    return filtered;
  }, [editedData, searchTerm, sortConfig]);

  const paginatedData = useMemo(() => {
    if (rowsPerPage === -1) return filteredData;
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const totalPages = useMemo(() => {
    if (rowsPerPage === -1) return 1;
    return Math.ceil(filteredData.length / rowsPerPage);
  }, [filteredData.length, rowsPerPage]);

  // Optimized cell change handler
  const handleCellChange = useCallback((rowIndex, key, value) => {
    const actualRowIndex = filteredData.indexOf(paginatedData[rowIndex]);
    if (actualRowIndex === -1) return;
    
    const updated = [...editedData];
    updated[actualRowIndex] = { ...updated[actualRowIndex], [key]: value };
    setEditedData(updated);
    setData(updated);
  }, [filteredData, paginatedData, editedData, setData]);

  // Optimized sort handler
  const requestSort = useCallback((key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  }, [sortConfig]);

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center rounded-xl border animate-fadeIn">
        <div className="w-16 h-16 bg-emerald-100 shadow-inner rounded-xl flex items-center justify-center mb-4">
          <i className="fa-solid fa-database text-3xl text-emerald-600"></i>
        </div>
        <h3 className="text-lg font-bold text-emerald-800 mb-1">No Data Available</h3>
        <p className="text-emerald-600">
          Upload a file to start exploring and visualizing your data in real time.
        </p>
      </div>
    );
  }

  const headers = Object.keys(data[0]);

  return (
    <div className="shadow-lg overflow-hidden flex flex-col h-full rounded-xl border border-emerald-200 bg-white">
      {/* Performance Info for Large Datasets */}
      {isLargeDataset && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2">
          <div className="flex items-center justify-between text-lg">
            <div className="flex items-center text-amber-700">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Large dataset detected ({data.length.toLocaleString()} rows)
            </div>
            <div className="text-amber-600">
              Showing {rowsPerPage} rows per page for optimal performance
            </div>
          </div>
        </div>
      )}
      
      {/* Table */}
      <div className="overflow-x-auto max-h-[calc(10*3rem)] overflow-y-auto">
        <table className="w-full text-xl border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-emerald-600 to-teal-500 border-b border-emerald-200 sticky top-0 z-10">
              {headers.map((header, index) => (
                <th
                  key={index}
                  onClick={() => requestSort(header)}
                  className="px-4 py-3 text-left font-semibold text-white cursor-pointer border-r border-emerald-100 last:border-r-0 select-none transition-colors duration-150"
                >
                  <div className="flex items-center gap-2">
                    <span>{header}</span>
                    {sortConfig.key === header ? (
                      <span className="text-white">
                        {sortConfig.direction === "ascending" ? "↑" : "↓"}
                      </span>
                    ) : (
                      <span className="text-white">↕</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-emerald-100">
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-emerald-50 transition-colors duration-150"
              >
                {headers.map((header, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-3 border-r border-emerald-50 last:border-r-0"
                  >
                    <input
                      type="text"
                      value={row[header] ?? ""}
                      onChange={(e) =>
                        handleCellChange(rowIndex, header, e.target.value)
                      }
                      className="w-full bg-transparent text-gray-700 outline-none text-xl focus:ring-2 focus:ring-emerald-400 focus:bg-emerald-50 rounded px-2 py-1 transition-colors duration-150"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="px-4 py-3 flex flex-col sm:flex-row items-center justify-between  border-t border-emerald-200">
        <div className="flex items-center gap-4 mb-2 sm:mb-0">
          <div className="text-xl text-emerald-700">
            Showing {filteredData.length === 0 ? 0 : (rowsPerPage === -1 ? 1 : (currentPage - 1) * rowsPerPage + 1)}
            {" "}to{" "}
            <span className="font-semibold">
              {rowsPerPage === -1 ? filteredData.length : Math.min(currentPage * rowsPerPage, filteredData.length)}
            </span>{" "}
            of <span className="font-semibold">{filteredData.length}</span> entries
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xl text-emerald-600 font-semibold">Show:</span>
            <div className="relative">
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="appearance-none px-4 py-2 border border-emerald-300 rounded-lg bg-white text-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-sm transition-all"
                style={{ minWidth: 90, cursor: "pointer" }}
              >
                <option value={10}>10 rows</option>
                <option value={20}>20 rows</option>
                <option value={50}>50 rows</option>
                <option value={100}>100 rows</option>
                {isLargeDataset ? (
                  <>
                    <option value={200}>200 rows</option>
                    <option value={500}>500 rows</option>
                  </>
                ) : (
                  <option value={-1}>All rows</option>  
                )}
              </select>
              {/* Custom dropdown arrow */}
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 text-lg">
                ▼
              </span>
            </div>
            <span className="text-xl text-emerald-600 font-semibold">per page</span>
          </div>
          
          {/* Performance tip for large datasets */}
          {isLargeDataset && filteredData.length > 1000 && (
            <div className="text-lg text-amber-600 mt-1 sm:mt-0">
              💡 Tip: Use search to filter data for better performance
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="w-12 h-12 px-3 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="First page"
          >
            <i className="fa-solid fa-angles-left"></i>
          </button>

          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-12 h-12 px-3 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else {
                if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-12 h-12 flex items-center justify-center rounded-lg text-xl border border-emerald-300 transition-colors ${
                    currentPage === pageNum
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white text-emerald-700 hover:bg-emerald-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-12 h-12 px-3 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>

          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="w-12 h-12 px-3 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Last page"
          >
            <i className="fa-solid fa-angles-right"></i>
          </button>
        </div>
      </div>
    </div>
  );

};

export default DataTable;