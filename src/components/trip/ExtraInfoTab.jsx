import { useNavigate } from "react-router-dom";
import { vehicleTypeAPI } from "../../api/vehicleType";
import InputField from "../UI/InputField";
import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { useSelector } from "react-redux";

const ExtraInfoTab = ({ form, setForm, handleChange, errors = {} }) => {
    const navigate = useNavigate();
    const vehicleTypeRef = useRef(null);
     

    const [vehicleTypeSearch, setVehicleTypeSearch] = useState("");
    const [showVehicleTypeDropdown, setShowVehicleTypeDropdown] = useState(false);

    const [vehicleTypeList, setVehicleTypeList] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user } = useSelector((state) => state.auth);
    const orgId = user.orgId;

    useEffect(() => {
        getVehicleTypeList();
    }, []);

    const filteredVehicleType = vehicleTypeList.filter((v) =>
        v.vehicleType?.toLowerCase().includes(vehicleTypeSearch.toLowerCase())
    );

    const handleVehicleTypeSelect = (type) => {
        setForm((prev) => ({
            ...prev,
            vehicleType: type.vehicleType,
            vehicleTonnageCapacity: type.vehicleTonnageCapacity || "",
            vehicleSqftCapacity: type.vehicleSqftCapacity || ""
        }));

        setVehicleTypeSearch(""); // Clear search term
        setShowVehicleTypeDropdown(false);
    };

    const handleCreateNewVehicleType = () => {
        navigate("/vehicle-type");
    };

    useEffect(() => {
        const handler = (e) => {
            if (vehicleTypeRef.current && !vehicleTypeRef.current.contains(e.target)) {
                setShowVehicleTypeDropdown(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const getVehicleTypeList = async () => {
        try {
            setLoading(true);

            const response = await vehicleTypeAPI.getAllVehicleTypeList({
                page: 1,
                count: 100,
                search: "",
                orgId
            });

            console.log("Vehicle API Response:", response);

            const data = response?.paramObjectsMap?.vehicleTypeData?.data || [];

            setVehicleTypeList(Array.isArray(data) ? data : []);

        } catch (error) {
            console.error("Error fetching vehicle type:", error);
            setVehicleTypeList([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                    label="Material Type"
                    name="materialType"
                    value={form.materialType}
                    onChange={handleChange}
                    placeholder="Enter Material Type"
                />
                <div className="relative" ref={vehicleTypeRef}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Vehicle Type <span className="text-red-500">*</span>
                    </label>

                    <input
                        type="text"
                        value={vehicleTypeSearch || form.vehicleType}
                        onChange={(e) => {
                            setVehicleTypeSearch(e.target.value);
                            setShowVehicleTypeDropdown(true);
                        }}
                        onFocus={() => setShowVehicleTypeDropdown(true)}
                        placeholder="Search Vehicle Type..."
                        className="w-full px-3 h-9 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.vehicleType && <p className="text-xs text-red-500 mt-1">{errors.vehicleType}</p>}

                    {showVehicleTypeDropdown && (
                        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                            <div className="max-h-52 overflow-y-auto p-2">
                                {filteredVehicleType.length > 0 ? (
                                    filteredVehicleType.map((veh, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleVehicleTypeSelect(veh)}
                                            className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                                        >
                                            <p className="font-medium text-gray-700 dark:text-gray-200">
                                                {veh.vehicleType}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 px-3 py-2">
                                        No Vehicle Type found
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={handleCreateNewVehicleType}
                                className="w-full flex items-center gap-2 px-3 py-2 border-t border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-800 rounded-b-xl text-sm"
                            >
                                <Plus className="h-4 w-4" />
                                Add New Vehicle Type
                            </button>
                        </div>
                    )}
                </div>
                <InputField
                    label="Vehicle Tonnage Capacity"
                    name="vehicleTonnageCapacity"
                    value={form.vehicleTonnageCapacity}
                    onChange={handleChange}
                    placeholder="Enter Capacity"
                />
                <InputField
                    label="Vehicle Sqft Capacity"
                    name="vehicleSqftCapacity"
                    value={form.vehicleSqftCapacity}
                    onChange={handleChange}
                    placeholder="Enter Sqft Capacity"
                />
                <InputField
                    label="Material Sq.FT"
                    name="materialSqft"
                    value={form.materialSqft}
                    onChange={handleChange}
                    placeholder="Enter Sqft"
                />
                <InputField
                    label="Weight (Ton)"
                    name="weightTon"
                    value={form.weightTon}
                    onChange={handleChange}
                    placeholder="Enter Weight in Ton"
                />
            </div>
        </div>
    );
}

export default ExtraInfoTab;