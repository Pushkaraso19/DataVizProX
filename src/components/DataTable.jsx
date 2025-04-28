import { useState, useMemo, useEffect } from 'react';

const DataTable = ({ data, setData, searchTerm }) => {
  const [editedData, setEditedData] = useState(data || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const rowsPerPage = 20;

  useEffect(() => {
    setEditedData(data || []);
  }, [data]);

  const filteredData = useMemo(() => {
    let filtered = [...editedData];
    if (searchTerm) {
      filtered = filtered.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        const aNum = Number(aValue);
        const bNum = Number(bValue);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortConfig.direction === 'ascending' ? aNum - bNum : bNum - aNum;
        }
        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [editedData, searchTerm, sortConfig]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleCellChange = (rowIndex, key, value) => {
    const actualRowIndex = filteredData.indexOf(paginatedData[rowIndex]);
    if (actualRowIndex === -1) return;
    const updated = [...editedData];
    updated[actualRowIndex] = { ...updated[actualRowIndex], [key]: value };
    setEditedData(updated);
    setData(updated);
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <p className="text-gray-500 text-lg">No data available. Please upload a file to begin.</p>
      </div>
    );
  }

  const headers = Object.keys(data[0]);

  return (
    <div className="shadow overflow-hidden flex flex-col h-full">
      <div className="overflow-x-auto max-h-[calc(10*3rem)] overflow-y-auto">
        <table className="w-full text-lg border-collapse border border-[#388e3c]">
          <thead>
            <tr className="bg-[#c4fbcb]">
              {headers.map((header, index) => (
                <th
                  key={index}
                  onClick={() => requestSort(header)}
                  className="px-6 py-4 text-left font-medium text-[#1b5e20] cursor-pointer hover:bg-[#a5d6a7] transition-colors text-xl border border-[#388e3c]"
                >
                  <div className="flex items-center gap-2">
                    {header}
                    {sortConfig.key === header && (
                      <span className="text-[#1b5e20] text-lg">
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#555555]">
            {paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-[#FAF9F6]">
                {headers.map((header, cellIndex) => (
                  <td key={cellIndex} className="px-6 py-3 border border-[#388e3c]">
                    <input
                      type="text"
                      value={row[header] !== undefined && row[header] !== null ? row[header] : ''}
                      onChange={(e) => handleCellChange(rowIndex, header, e.target.value)}
                      className="w-full bg-transparent text-[#333333] outline-none text-xl"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between bg-[#FAF9F6] border-t border-[#388e3c]">
        <div className="text-lg text-[#555555] mb-2 sm:mb-0">
          Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length} entries
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#c4fbcb]"
          >
            Previous
          </button>

          <div className="flex items-center">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = i + 1;
              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 flex items-center justify-center rounded-md mx-1 text-lg ${
                    currentPage === pageNum ? 'bg-[#027c68] text-white' : 'hover:bg-[#c4fbcb] text-[#027c68]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#c4fbcb]"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;