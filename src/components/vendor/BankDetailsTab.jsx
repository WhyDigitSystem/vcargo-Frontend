import React from "react";
import { Plus, Trash2 } from "lucide-react";

const BankDetailsTab = ({ formData, setFormData, bankRows, setBankRows, onFormChange, errors = {} }) => {

  React.useEffect(() => {
    if (bankRows.length > 0) {
      const firstRow = bankRows[0];
      onFormChange("accountNumber", firstRow.accountNumber);
      onFormChange("ifsc", firstRow.ifsc);
      onFormChange("accountHolderName", firstRow.accountHolderName);
      onFormChange("backName", firstRow.backName);
    }
  }, [bankRows]);

  // Handle input changes with validation
  const handleRowChange = (id, field, value) => {
    let cleanedValue = value;

    // Apply field-specific validation
    if (field === "accountNumber") {
      cleanedValue = value.replace(/[^0-9]/g, "");
      cleanedValue = cleanedValue.slice(0, 18);
    } else if (field === "ifsc") {
      cleanedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
      cleanedValue = cleanedValue.slice(0, 11);
    }

    setBankRows(prev =>
      prev.map(row =>
        row.id === id ? { ...row, [field]: cleanedValue } : row
      )
    );
  };

  // Add new row
  const handleAddRow = () => {
    setBankRows(prev => [
      ...prev,
      { id: Date.now(), accountNumber: "", ifsc: "", accountHolderName: "", backName: "" }
    ]);
  };

  // Remove row
  const handleRemoveRow = (id) => {
    if (bankRows.length > 1) {
      setBankRows(prev => prev.filter(row => row.id !== id));
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-b-xl transition-colors duration-300">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        Bank Details
      </h2>

      {/* Bank Details Table Section */}
      <div className="mt-6 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-3 py-2 w-10"></th>
              <th className="px-3 py-2 w-10">No.</th>
              <th className="px-3 py-2">Account Number</th>
              <th className="px-3 py-2">IFSC</th>
              <th className="px-3 py-2">Account Holder Name</th>
              <th className="px-3 py-2">Bank Name</th>
              <th className="px-3 py-2 w-16 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-800">
            {bankRows.map((row, index) => (
              <tr 
                key={row.id} 
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <td className="px-3 py-2"></td>

                <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
                  {index + 1}
                </td>

                <td className="px-3 py-1">
                  <input
                    type="text"
                    value={row.accountNumber}
                    onChange={(e) =>
                      handleRowChange(row.id, "accountNumber", e.target.value)
                    }
                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                      placeholder-gray-500 dark:placeholder-gray-400 
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter account number"
                  />
                  {errors.accountNumber && index === 0 && (
                    <p className="text-xs text-red-500 mt-1">{errors.accountNumber}</p>
                  )}
                </td>

                <td className="px-3 py-1">
                  <input
                    type="text"
                    value={row.ifsc}
                    onChange={(e) =>
                      handleRowChange(row.id, "ifsc", e.target.value)
                    }
                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                      placeholder-gray-500 dark:placeholder-gray-400 
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter IFSC code"
                  />
                  {errors.ifsc && index === 0 && (
                    <p className="text-xs text-red-500 mt-1">{errors.ifsc}</p>
                  )}
                </td>

                <td className="px-3 py-1">
                  <input
                    type="text"
                    value={row.accountHolderName}
                    onChange={(e) =>
                      handleRowChange(row.id, "accountHolderName", e.target.value)
                    }
                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                      placeholder-gray-500 dark:placeholder-gray-400 
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter account holder name"
                  />
                  {errors.accountHolderName && index === 0 && (
                    <p className="text-xs text-red-500 mt-1">{errors.accountHolderName}</p>
                  )}
                </td>

                <td className="px-3 py-1">
                  <input
                    type="text"
                    value={row.backName}
                    onChange={(e) =>
                      handleRowChange(row.id, "backName", e.target.value)
                    }
                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                      placeholder-gray-500 dark:placeholder-gray-400 
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter bank name"
                  />
                  {errors.backName && index === 0 && (
                    <p className="text-xs text-red-500 mt-1">{errors.backName}</p>
                  )}
                </td>

                <td className="px-3 py-2 text-center">
                  <button
                    onClick={() => handleRemoveRow(row.id)}
                    disabled={bankRows.length === 1}
                    className={`p-1 rounded transition-colors ${
                      bankRows.length === 1 
                        ? "opacity-50 cursor-not-allowed" 
                        : "hover:bg-red-100 dark:hover:bg-red-900/50"
                    }`}
                  >
                    <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Row Button */}
      <button
        onClick={handleAddRow}
        className="mt-3 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md 
          flex items-center gap-2 transition-colors duration-200"
      >
        <Plus className="h-4 w-4" /> Add Bank Account
      </button>

      {/* Display errors for the entire bank details if needed */}
      {errors.bankDetails && (
        <p className="mt-2 text-xs text-red-500">{errors.bankDetails}</p>
      )}
    </div>
  );
};

export default BankDetailsTab;