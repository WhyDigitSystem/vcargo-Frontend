import React from "react";
import { Pencil, Plus, Trash2, Paperclip } from "lucide-react";

const ContractHistoryTable = ({ vendorDetailsRows, setVendorDetailsRows, errors = {} }) => {
  const addRow = () => {
    setVendorDetailsRows([
      ...vendorDetailsRows,
      {
        id: vendorDetailsRows.length + 1,
        effectiveFrom: "",
        effectioveTo: "",
        contractAttachment: null,
        backgroundVerification: null,
        securityCheck: null,
      },
    ]);
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...vendorDetailsRows];
    updated[index][field] = value;
    setVendorDetailsRows(updated);
  };

  const handleFileUpload = (index, field, file) => {
    const updated = [...vendorDetailsRows];
    updated[index][field] = file;
    setVendorDetailsRows(updated);
  };

  const handleEdit = (index) => {
    alert(`Editing row ${index + 1}`);
  };

  const handleDelete = (index) => {
    setVendorDetailsRows(vendorDetailsRows.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Contract History
      </h2>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 uppercase text-xs">
            <tr>
              <th className="px-3 py-3 w-8 text-center">
                <input type="checkbox" className="accent-blue-500" />
              </th>
              <th className="px-3 py-3 w-12">No.</th>
              <th className="px-3 py-3">
                Effective From <span className="text-red-500">*</span>
              </th>
              <th className="px-3 py-3">
                Effective To <span className="text-red-500">*</span>
              </th>
              <th className="px-3 py-3">Contract Attachment</th>
              <th className="px-3 py-3">Background Verification</th>
              <th className="px-3 py-3">Security Check</th>
              <th className="px-3 py-3 text-center w-24">Action</th>
            </tr>
          </thead>

          <tbody>
            {vendorDetailsRows.map((row, index) => {
              const rowErr = (errors && errors[index]) || {};
              return (
                <tr
                  key={index}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-3 py-2 text-center">
                    <input type="checkbox" className="accent-blue-500" />
                  </td>
                  <td className="px-3 py-2">{index + 1}</td>

                  <td className="px-3 py-2">
                    <input
                      type="date"
                      value={row.effectiveFrom}
                      onChange={(e) => handleInputChange(index, "effectiveFrom", e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm 
                      bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {rowErr.effectiveFrom && (
                      <p className="text-xs text-red-500 mt-1">{rowErr.effectiveFrom}</p>
                    )}
                  </td>

                  <td className="px-3 py-2">
                    <input
                      type="date"
                      value={row.effectioveTo}
                      onChange={(e) => handleInputChange(index, "effectioveTo", e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm 
                      bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {rowErr.effectioveTo && (
                      <p className="text-xs text-red-500 mt-1">{rowErr.effectioveTo}</p>
                    )}
                  </td>

                  <td className="px-3 py-2">
                    <label className="flex items-center justify-center w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm text-gray-700 dark:text-gray-200 transition-colors">
                      <Paperclip size={14} className="mr-1" />
                      Attach
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(index, "contractAttachment", e.target.files[0])
                        }
                      />
                    </label>
                    {row.contractAttachment && (
                      <p className="text-xs text-gray-500 mt-1 truncate">{row.contractAttachment.name}</p>
                    )}
                  </td>

                  <td className="px-3 py-2">
                    <label className="flex items-center justify-center w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm text-gray-700 dark:text-gray-200 transition-colors">
                      <Paperclip size={14} className="mr-1" />
                      Attach
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(index, "backgroundVerification", e.target.files[0])
                        }
                      />
                    </label>
                    {row.backgroundVerification && (
                      <p className="text-xs text-gray-500 mt-1 truncate">{row.backgroundVerification.name}</p>
                    )}
                  </td>

                  <td className="px-3 py-2">
                    <label className="flex items-center justify-center w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm text-gray-700 dark:text-gray-200 transition-colors">
                      <Paperclip size={14} className="mr-1" />
                      Attach
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(index, "securityCheck", e.target.files[0])
                        }
                      />
                    </label>
                    {row.securityCheck && (
                      <p className="text-xs text-gray-500 mt-1 truncate">{row.securityCheck.name}</p>
                    )}
                  </td>

                  <td className="px-3 py-2 text-center">
                    <div className="flex justify-center items-center space-x-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="p-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                      >
                        <Pencil size={16} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {vendorDetailsRows.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center text-gray-500 dark:text-gray-400 py-4">
                  No contract records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Row Button */}
      <button
        onClick={addRow}
        className="mt-4 flex items-center space-x-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors"
      >
        <Plus size={16} />
        <span>Add Row</span>
      </button>
    </div>
  );
};

export default ContractHistoryTable;
