import { useEffect, useState } from "react";
import { ArrowLeft, Save, RotateCcw } from "lucide-react";
import InputField from "../../UI/InputField";
import { useNavigate } from "react-router-dom";
import { vehicleTypeAPI } from "../../../api/vehicleType";
import { toast } from "../../../utils/toast";
import { useSelector } from "react-redux";

const VehicleTypeMaster = ({ setIsListView, editId }) => {
    const navigate = useNavigate();

    const userName = JSON.parse(localStorage.getItem("user"))?.name || "";
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        vehicleType: "",
        mileage: "",
        status: "Active",
        unit: "",
        height: "",
        width: "",
        length: "",
        sqftCapacity: "",
        tonnageCapacity: "",
        branch: null,
        branchCode: null
    });

    const { user } = useSelector((state) => state.auth);
    const orgId = user.orgId;

    useEffect(() => {
        if (editId) {
            getVehicleTypeById(editId);
        }
    }, [editId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        // Number-only validation for all numeric fields
        const numericFields = [
            "mileage",
            "height",
            "width",
            "length",
            "sqftCapacity",
            "tonnageCapacity",
        ];

        if (numericFields.includes(name)) {
            newValue = newValue.replace(/[^0-9.]/g, "");  // allow only digits + dot
        }

        setFormData((prev) => ({ ...prev, [name]: newValue }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        let newErrors = {};

        if (!formData.vehicleType.trim())
            newErrors.vehicleType = "Vehicle Type is required";

        const numericCheck = (val) =>
            val !== "" && (isNaN(val) || Number(val) < 0);

        if (numericCheck(formData.mileage))
            newErrors.mileage = "Mileage must be a valid positive number";

        if (numericCheck(formData.height))
            newErrors.height = "Height must be a valid positive number";

        if (numericCheck(formData.width))
            newErrors.width = "Width must be a valid positive number";

        if (numericCheck(formData.length))
            newErrors.length = "Length must be a valid positive number";

        if (numericCheck(formData.sqftCapacity))
            newErrors.sqftCapacity = "Sqft capacity must be a valid number";

        if (numericCheck(formData.tonnageCapacity))
            newErrors.tonnageCapacity = "Tonnage capacity must be a valid number";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleClearForm = () => {
        setFormData({
            vehicleType: "",
            mileage: "",
            status: "Active",
            unit: "",
            height: "",
            width: "",
            length: "",
            sqftCapacity: "",
            tonnageCapacity: "",
        });
        setErrors({});
    };

    const getVehicleTypeById = async (id) => {
        try {
            const response = await vehicleTypeAPI.getVehicleTypeListById(id);
            console.log("Edit API Response:", response);

            const data = response?.paramObjectsMap?.VehicleType;

            if (data) {
                setFormData({
                    id: data.id || null,
                    vehicleType: data.vehicleType || "",
                    mileage: data.mileage || "",
                    status: data.status === "ACTIVE" ? "Active" : "Inactive",
                    unit: data.unit || "",
                    height: data.hight || "",
                    width: data.width || "",
                    length: data.length || "",
                    sqftCapacity: data.vehicleSqftCapacity || "",
                    tonnageCapacity: data.vehicleTonnageCapacity || "",
                    branch: data.branch || "",
                    branchCode: data.branchCode || "",
                    orgId: data.orgId || 0
                });
            }
        } catch (error) {
            console.error("Error fetching vehicle type:", error);
            alert("Error loading vehicle type data");
        }
    };

    const handleSave = async () => {
        if (!validateForm()) {
            toast.error("Please fill required fields");
            return;
        }

        try {
            const payload = {
                branch: formData.branch || "",
                branchCode: formData.branchCode || "",
                createdBy: userName || "",
                orgId: orgId,
                vehicleType: formData.vehicleType,
                mileage: Number(formData.mileage) || 0,
                status: formData.status === "Active" ? "ACTIVE" : "INACTIVE",
                unit: formData.unit,
                hight: Number(formData.height) || 0,
                width: Number(formData.width) || 0,
                length: Number(formData.length) || 0,
                vehicleSqftCapacity: Number(formData.sqftCapacity) || 0,
                vehicleTonnageCapacity: Number(formData.tonnageCapacity) || 0,
            };

            if (formData.id) {
                payload.id = formData.id;
            }

            console.log("Final Payload:", payload);

            const response = await vehicleTypeAPI.createUpdateVehicleType(payload);

            if (response?.status) {
                toast.success(
                    formData.id
                        ? "Vehicle Type updated successfully!"
                        : "Vehicle Type created successfully!"
                );
                setIsListView(true);
            } else {
                toast.error("Failed to save Vehicle Type");
            }

        } catch (error) {
            console.error("Error saving Vehicle Type:", error);
            toast.error("Error saving vehicle type");
        }
    };

    return (
        <div className="max-w-6xl mx-auto mt-6 p-6 bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-700">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsListView(true)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    </button>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        New Vehicle Type
                    </h2>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleClearForm}
                        className="px-4 py-1 bg-gray-100 text-gray-700 dark:bg-gray-800 
                       dark:text-gray-200 rounded-lg hover:bg-gray-200 
                       dark:hover:bg-gray-700 transition"
                    >
                        Clear
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            </div>

            {/* Form Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">

                <div>
                    <InputField
                        label="Vehicle Type"
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleChange}
                        required
                        placeholder="Enter Vehicle Type"
                        className="h-10"
                    />
                    {errors.vehicleType && <p className="text-red-500 text-xs">{errors.vehicleType}</p>}
                </div>

                <div>
                    <InputField
                        label="Mileage"
                        name="mileage"
                        value={formData.mileage}
                        onChange={handleChange}
                        placeholder="Enter Mileage"
                        className="h-10"
                    />
                </div>

                {/* Status Dropdown */}
                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Status
                    </label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full h-10 px-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                        focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

            </div>

            {/* Dimensions */}
            <div className="mb-6">
                <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Vehicle Dimensions
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Unit
                        </label>
                        <select
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="mm">mm</option>
                            <option value="cm">cm</option>
                            <option value="m">m</option>
                            <option value="in">in</option>
                            <option value="ft">ft</option>
                        </select>
                    </div>

                    <div>
                        <InputField
                            label="Height"
                            name="height"
                            value={formData.height}
                            onChange={handleChange}
                            placeholder="Enter Height"
                            className="h-10"
                        />
                        {errors.height && <p className="text-red-500 text-xs">{errors.height}</p>}
                    </div>

                    <div>
                        <InputField
                            label="Width"
                            name="width"
                            value={formData.width}
                            onChange={handleChange}
                            placeholder="Enter Width"
                            className="h-10"
                        />
                        {errors.width && <p className="text-red-500 text-xs">{errors.width}</p>}
                    </div>

                    <div>
                        <InputField
                            label="Length"
                            name="length"
                            value={formData.length}
                            onChange={handleChange}
                            placeholder="Enter Length"
                            className="h-10"
                        />
                        {errors.length && <p className="text-red-500 text-xs">{errors.length}</p>}
                    </div>

                </div>
            </div>

            {/* Capacity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div>
                    <InputField
                        label="Vehicle Sqft Capacity"
                        name="sqftCapacity"
                        value={formData.sqftCapacity}
                        onChange={handleChange}
                        required
                        placeholder="Enter Vehicle Sqft Capacity"
                        className="h-10"
                    />
                    {errors.sqftCapacity && <p className="text-red-500 text-xs">{errors.sqftCapacity}</p>}
                </div>

                <div>
                    <InputField
                        label="Vehicle Tonnage Capacity"
                        name="tonnageCapacity"
                        value={formData.tonnageCapacity}
                        onChange={handleChange}
                        placeholder="Enter Vehicle Tonnage Capacity"
                        className="h-10"
                    />
                    {errors.tonnageCapacity && <p className="text-red-500 text-xs">{errors.tonnageCapacity}</p>}
                </div>

            </div>

        </div>
    );
}

export default VehicleTypeMaster;