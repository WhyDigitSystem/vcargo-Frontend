import { Plus, Trash2 } from "lucide-react";

const VerificationTab = ({
    verificationDetailsRows,
    setVerificationDetailsRows
}) => {

    const rows = Array.isArray(verificationDetailsRows)
        ? verificationDetailsRows
        : [];

    const addRow = () => {
        setVerificationDetailsRows(prev => [
            ...prev,
            { 
                id: Date.now() + Math.random(), // Better ID generation
                field: "", 
                value: "" 
            }
        ]);
    };

    const removeRow = (id) => {
        setVerificationDetailsRows((prev) => prev.filter((r) => r.id !== id));
    };

    const updateRow = (id, key, value) => {
        setVerificationDetailsRows((prev) =>
            prev.map((row) =>
                row.id === id ? { ...row, [key]: value } : row
            )
        );
    };

    return (
        <div className="space-y-6 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                DL Verification
            </h3>

            <div className="rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        <tr>
                            <th className="px-3 py-2 w-10 text-center">
                                <input type="checkbox" />
                            </th>
                            <th className="px-3 py-2 w-10">No.</th>
                            <th className="px-3 py-2">Field</th>
                            <th className="px-3 py-2">Value</th>
                            <th className="px-3 py-2 w-16 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {rows.map((row, index) => (
                            <tr
                                key={row.id}
                                className="border-t border-gray-200 dark:border-gray-700"
                            >
                                <td className="px-3 py-2 text-center">
                                    <input type="checkbox" />
                                </td>

                                <td className="px-3 py-2 dark:text-white">{index + 1}</td>

                                <td className="px-3 py-2 ">
                                    <input
                                        type="text"
                                        value={row.field}
                                        onChange={(e) => updateRow(row.id, "field", e.target.value)}
                                        className="w-full px-2 py-1 dark:border-gray-700 border rounded bg-white dark:bg-gray-900 dark:text-white"
                                        placeholder="Enter Field Name"
                                    />
                                </td>

                                <td className="px-3 py-2">
                                    <input
                                        type="text"
                                        value={row.value}
                                        onChange={(e) => updateRow(row.id, "value", e.target.value)}
                                        className="w-full px-2 py-1 border dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-white"
                                        placeholder="Enter Value"
                                    />
                                </td>

                                <td className="px-3 py-2 text-center">
                                    <button
                                        onClick={() => removeRow(row.id)}
                                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                                    >
                                        <Trash2 size={16} className="text-red-600" />
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {rows.length === 0 && (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="text-center py-4 text-gray-500 dark:text-gray-400"
                                >
                                    No verification data available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <button
                onClick={addRow}
                className="mt-3 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
                <Plus className="h-4 w-4" /> Add Row
            </button>
        </div>
    );
};

export default VerificationTab;