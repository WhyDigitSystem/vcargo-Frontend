import { Plus, Trash2 } from "lucide-react";

const VendorResponse = ({
    vehicleDetailsRows,
    setVehicleDetailsRows
}) => {
    const rows = vehicleDetailsRows ?? [];

    const addRow = () => {
        setVehicleDetailsRows((prev) => [
            ...prev,
            { id: Date.now(), lrNumber: "", vehicleNumber: "", driverNumber: "", driverName: "" }
        ]);
    };

    const removeRow = (id) => {
        setVehicleDetailsRows((prev) => prev.filter((r) => r.id !== id));
    };

    const updateRow = (id, key, value) => {
        setVehicleDetailsRows((prev) =>
            prev.map((row) =>
                row.id === id ? { ...row, [key]: value } : row
            )
        );
    };

    return (
        <div className="space-y-6">
            {/* Vehicle Details */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Vehicle Details
                </h3>

                <div className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            <tr>
                                <th className="px-3 py-2 w-10">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                                    />
                                </th>
                                <th className="px-3 py-2 w-10">No.</th>
                                <th className="px-3 py-2">LR Number</th>
                                <th className="px-3 py-2">Vehicle Number</th>
                                <th className="px-3 py-2">Driver Number</th>
                                <th className="px-3 py-2">Driver Name</th>
                                <th className="px-3 py-2 w-16 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody className="bg-white dark:bg-gray-800">
                            {rows.map((row, index) => (
                                <tr
                                    key={row.id}
                                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                >
                                    <td className="px-3 py-2">
                                        <input 
                                            type="checkbox" 
                                            className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </td>

                                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{index + 1}</td>

                                    <td className="px-3 py-1">
                                        <input
                                            type="text"
                                            value={row.lrNumber}
                                            onChange={(e) => updateRow(row.id, "lrNumber", e.target.value)}
                                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter LR Number"
                                        />
                                    </td>

                                    <td className="px-3 py-1">
                                        <input
                                            type="text"
                                            value={row.vehicleNumber}
                                            onChange={(e) => updateRow(row.id, "vehicleNumber", e.target.value)}
                                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter Vehicle Number"
                                        />
                                    </td>

                                    <td className="px-3 py-1">
                                        <input
                                            type="text"
                                            value={row.driverNumber}
                                            onChange={(e) => updateRow(row.id, "driverNumber", e.target.value)}
                                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter Driver Number"
                                        />
                                    </td>

                                    <td className="px-3 py-1">
                                        <input
                                            type="text"
                                            value={row.driverName}
                                            onChange={(e) => updateRow(row.id, "driverName", e.target.value)}
                                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter Driver Name"
                                        />
                                    </td>

                                    <td className="px-3 py-2 text-center">
                                        <button
                                            onClick={() => removeRow(row.id)}
                                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/50 rounded transition-colors"
                                        >
                                            <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button
                    onClick={addRow}
                    className="mt-3 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-2 transition-colors"
                >
                    <Plus className="h-4 w-4" /> Add Row
                </button>
            </div>
        </div>
    );
};

export default VendorResponse;