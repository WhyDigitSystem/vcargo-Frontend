import { useEffect, useState } from "react";
import { ArrowLeft, Save, RotateCcw, Plus, Trash2 } from "lucide-react";
import InputField from "../UI/InputField";
import { useNavigate } from "react-router-dom";
import { toast } from "../../utils/toast";
import { useSelector } from "react-redux";
import { listOfValuesAPI } from "../../api/listOfValues";

const ListOfValuesMaster = ({ setIsListView, editId }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        listCode: "",
        listDescription: "",
        active: true,
    });

    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);

    const userName = JSON.parse(localStorage.getItem("user"))?.name || "";
    const [errors, setErrors] = useState({});
    const { user } = useSelector((state) => state.auth);
    const orgId = user.orgId;

    useEffect(() => {
        if (editId) {
            getListOfValuesById(editId);
        } else {
            // Initialize with one empty row for new entry
            setTableData([{
                id: Date.now(),
                valueCode: "",
                valueDescription: "",
                active: true,
            }]);
        }
    }, [editId]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "active") {
            setFormData(prev => ({ ...prev, [name]: value === "true" }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }

        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleTableChange = (id, field, value) => {
        setTableData((prev) =>
            prev.map((row) =>
                row.id === id ? { ...row, [field]: value } : row
            )
        );
    };

    const handleAddRow = () => {
        const newId = Date.now(); // Using timestamp for unique ID
        setTableData([
            ...tableData,
            {
                id: newId,
                valueCode: "",
                valueDescription: "",
                active: true,
            },
        ]);
    };

    const removeTableRow = (id) => {
        if (tableData.length > 1) {
            setTableData((prev) => prev.filter((row) => row.id !== id));
        } else {
            toast.warning("At least one value is required");
        }
    };

    const handleClear = () => {
        setFormData({
            listCode: "",
            listDescription: "",
            active: true
        });
        setTableData([{
            id: Date.now(),
            valueCode: "",
            valueDescription: "",
            active: true,
        }]);
        setErrors({});
    };

    const getListOfValuesById = async (id) => {
        try {
            setLoading(true);
            const response = await listOfValuesAPI.getListOfValuesById(id);

            // The response has listOfValuesVO as an ARRAY, take the first item
            const dataArray = response?.paramObjectsMap?.listOfValuesVO || [];
            const data = dataArray[0] || {};

            console.log("Edit API Response:", response);
            console.log("Edit Data:", data);

            // Set form data
            setFormData({
                id: data.id || null,
                listCode: data.listCode || "",
                listDescription: data.listDescription || "",
                active: data.active !== false, // Default to true if undefined
                orgId: data.orgId || orgId,
                createdBy: data.createdBy || userName,
            });

            // Set table data from listOfValues1VO array
            const valuesData = data.listOfValues1VO || [];

            console.log("Values Data:", valuesData); // Debug log

            if (valuesData && valuesData.length > 0) {
                const formattedTableData = valuesData.map((item, index) => ({
                    id: item.id || Date.now() + index,
                    valueCode: item.valueCode || "",
                    valueDescription: item.valueDescription || "",
                    active: item.active !== false,
                }));
                setTableData(formattedTableData);
            } else {
                // If no values, set one empty row
                setTableData([{
                    id: Date.now(),
                    valueCode: "",
                    valueDescription: "",
                    active: true,
                }]);
            }

        } catch (error) {
            console.error("Error fetching list details:", error);
            toast.error("Failed to load list details");
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        let newErrors = {};

        if (!formData.listCode.trim()) {
            newErrors.listCode = "List code is required";
        }

        if (!formData.listDescription.trim()) {
            newErrors.listDescription = "List description is required";
        }

        // Validate table rows
        tableData.forEach((row, index) => {
            if (!row.valueCode.trim()) {
                newErrors[`valueCode_${row.id}`] = `Value code is required for row ${index + 1}`;
            }
            if (!row.valueDescription.trim()) {
                newErrors[`valueDescription_${row.id}`] = `Value description is required for row ${index + 1}`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            const payload = {
                orgId: orgId,
                listCode: formData.listCode.trim(),
                listDescription: formData.listDescription.trim(),
                createdBy: userName || "",
                active: formData.active,
                listOfValues1DTO: tableData.map((row, index) => ({
                    sno: index + 1,
                    valueCode: row.valueCode.trim(),
                    valueDescription: row.valueDescription.trim(),
                    active: row.active,
                })),
            };

            // Add ID for update
            if (formData.id) {
                payload.id = formData.id;
            }

            console.log("SAVE PAYLOAD:", payload);

            const response = await listOfValuesAPI.createUpdateListOfValues(payload);

            if (response?.status) {
                toast.success(
                    formData.id
                        ? "List Of Values updated successfully!"
                        : "List Of Values created successfully!"
                );
                setIsListView(true);
            } else {
                toast.error(response?.message || "List Of Values Creation Failed");
            }

        } catch (error) {
            console.error("Error saving List:", error);
            toast.error("Failed to save List");
        }
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto mt-6 p-6 bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-pulse text-gray-500">Loading list details...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto mt-6 p-6 bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-700 transition-all duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsListView(true)}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                        </button>
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {editId ? "Edit List Of Values" : "List Of Values Master"}
                        </h1>
                        <span className="text-xs text-red-500">● Not Saved</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleClear}
                        className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Clear Form
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                        <Save className="h-4 w-4" />
                        {editId ? "Update" : "Save"}
                    </button>
                </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                    <InputField
                        label="List Code"
                        name="listCode"
                        value={formData.listCode}
                        onChange={handleChange}
                        required
                        placeholder="Enter list code"
                        disabled={!!editId} // Disable editing of list code for existing records
                    />
                    {errors.listCode && (
                        <p className="text-red-500 text-xs mt-1">{errors.listCode}</p>
                    )}
                </div>

                <div>
                    <InputField
                        label="List Description"
                        name="listDescription"
                        value={formData.listDescription}
                        onChange={handleChange}
                        placeholder="Enter list description"
                        required
                    />
                    {errors.listDescription && (
                        <p className="text-red-500 text-xs mt-1">{errors.listDescription}</p>
                    )}
                </div>

                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Status
                    </label>
                    <select
                        name="active"
                        value={formData.active ? "true" : "false"}
                        onChange={handleChange}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition"
                    >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Table Section */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Values
                </h3>

                <div className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            <tr>
                                <th className="px-3 py-2 w-10">S.No</th>
                                <th className="px-3 py-2">Value Code</th>
                                <th className="px-3 py-2">Value Description</th>
                                <th className="px-3 py-2">Active</th>
                                <th className="px-3 py-2 w-16 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody className="bg-white dark:bg-gray-800">
                            {tableData.map((row, index) => (
                                <tr
                                    key={row.id}
                                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                >
                                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{index + 1}</td>

                                    <td className="px-3 py-1">
                                        <input
                                            type="text"
                                            value={row.valueCode}
                                            onChange={(e) => handleTableChange(row.id, "valueCode", e.target.value)}
                                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter value code"
                                        />
                                        {errors[`valueCode_${row.id}`] && (
                                            <p className="text-red-500 text-xs mt-1">{errors[`valueCode_${row.id}`]}</p>
                                        )}
                                    </td>

                                    <td className="px-3 py-1">
                                        <input
                                            type="text"
                                            value={row.valueDescription}
                                            onChange={(e) => handleTableChange(row.id, "valueDescription", e.target.value)}
                                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter value description"
                                        />
                                        {errors[`valueDescription_${row.id}`] && (
                                            <p className="text-red-500 text-xs mt-1">{errors[`valueDescription_${row.id}`]}</p>
                                        )}
                                    </td>

                                    <td className="px-3 py-1">
                                        <select
                                            value={row.active ? "Active" : "Inactive"}
                                            onChange={(e) => handleTableChange(row.id, "active", e.target.value === "Active")}
                                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </td>

                                    <td className="px-3 py-2 text-center">
                                        <button
                                            onClick={() => removeTableRow(row.id)}
                                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/50 rounded transition-colors"
                                            disabled={tableData.length === 1}
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
                    onClick={handleAddRow}
                    className="mt-3 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-2 transition-colors"
                >
                    <Plus className="h-4 w-4" /> Add Row
                </button>
            </div>
        </div>
    );
}

export default ListOfValuesMaster;