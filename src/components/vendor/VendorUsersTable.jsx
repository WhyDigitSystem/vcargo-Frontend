import React from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

const VendorUsersTable = ({ vendorUserRows, setVendorUserRows, errors = {} }) => {

  const addRow = () => {
    setVendorUserRows([...vendorUserRows, { id: vendorUserRows.length + 1, users: "" }]);
  };

  const handleUserChange = (e, index) => {
    const updated = [...vendorUserRows];
    updated[index].users = e.target.value;
    setVendorUserRows(updated);
  };

  const handleDelete = (index) => {
    setVendorUserRows(vendorUserRows.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Vendor Users
      </h2>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 uppercase text-xs">
            <tr>
              <th className="px-3 py-3 w-8 text-center">
                <input type="checkbox" className="accent-blue-500" />
              </th>
              <th className="px-3 py-3 w-12">No.</th>
              <th className="px-3 py-3">User</th>
              <th className="px-3 py-3 text-center w-24">Action</th>
            </tr>
          </thead>

          <tbody>
            {vendorUserRows.map((row, index) => {
              const rowErr = (errors && errors[index]) || null;
              return (
                <tr
                  key={index}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-3 py-2 text-center">
                    <input type="checkbox" className="accent-blue-500" />
                  </td>

                  <td className="px-3 py-2">{index + 1}</td>

                  <td className="px-3 py-2 w-[300px] max-w-[300px]">
                    <input
                      type="text"
                      value={row.users}
                      onChange={(e) => handleUserChange(e, index)}
                      placeholder="Enter User Email"
                      className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    {rowErr && (
                      <p className="text-xs text-red-500 mt-1">{rowErr}</p>
                    )}
                  </td>

                  <td className="px-3 py-2 text-center">
                    <div className="flex justify-center items-center space-x-2">
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

            {vendorUserRows.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 dark:text-gray-400 py-4">
                  No users added.
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

export default VendorUsersTable;
