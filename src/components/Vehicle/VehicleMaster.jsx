import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Save, RotateCcw, Plus } from "lucide-react";
import InputField from "../UI/InputField";
import { useNavigate } from "react-router-dom";
import { vehicleTypeAPI } from "../../api/vehicleType";
import { vehicleAPI } from "../../api/vehicleAPI";
import { toast } from "../../utils/toast";
import { useSelector } from "react-redux";

const VehicleMaster = ({ setIsListView, editId }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    vehicle: "",
    active: "Active",
    vehicleType: "",
  });

  const userName = JSON.parse(localStorage.getItem("user"))?.name || "";
  const [vehicleTypeList, setVehicleTypeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [vehicleTypeSearch, setVehicleTypeSearch] = useState("");
  const [selectedVehicleType, setSelectedVehicleType] = useState("");
  const [showVehicleTypeDropdown, setShowVehicleTypeDropdown] = useState(false);

  const vehicleTypeRef = useRef(null);
   

  const { user } = useSelector((state) => state.auth);
  const orgId = user.orgId;

  useEffect(() => {
    getVehicleType();
  }, []);

  useEffect(() => {
    if (editId) {
      getVehicleDetailsById(editId);
    }
  }, [editId]);

  const filteredVehicleTypes = vehicleTypeList.filter((v) =>
    v.vehicleType?.toLowerCase().includes(vehicleTypeSearch.toLowerCase())
  );

  const handleVehicleTypeSelect = (vehicle) => {
    setSelectedVehicleType(vehicle.vehicleType);
    setFormData(prev => ({ ...prev, vehicleType: vehicle.vehicleType }));
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearForm = () => {
    setFormData({
      vehicle: "",
      active: "Active",
      vehicleType: "",
    });
    setSelectedVehicleType('');
  };

  const getVehicleType = async () => {
    try {
      setLoading(true);

      const response = await vehicleTypeAPI.getVehicleType({ orgId });
      console.log('API Response:', response);

      const data = response?.paramObjectsMap?.vehicleTypeVO || [];

      if (Array.isArray(data)) {
        setVehicleTypeList(data);
      } else {
        setVehicleTypeList([]);
      }

    } catch (error) {
      console.error("Error fetching customers:", error);
      setVehicleTypeList([]);
    } finally {
      setLoading(false);
    }
  };

  const getVehicleDetailsById = async (id) => {
    try {
      const response = await vehicleAPI.getVehicleById(id);
      console.log("Vehicle Edit API Response:", response);

      const data = response?.paramObjectsMap?.vehicle;

      setFormData({
        id: data.id || null,
        vehicle: data.vehicleNumber || "",
        vehicleType: data.vehicleType || "",
        active: data.active === 'Active' ? "Active" : "Inactive",
        branch: data.branch || "",
        branchCode: data.branchCode || "",
        orgId: data.orgId || "",
        createdBy: data.createdBy || "",
      });

      setSelectedVehicleType(data.vehicleType || "");

    } catch (error) {
      console.error("Error fetching vehicle details:", error);
      toast.error("Failed to load vehicle details");
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.vehicle.trim()) {
      newErrors.vehicle = "Vehicle field is required";
    }

    const vehiclePattern = /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/i;
    if (formData.vehicle && !vehiclePattern.test(formData.vehicle.replace(/\s+/g, ""))) {
      newErrors.vehicle = "Enter a valid vehicle number (e.g., MH12AB1234)";
    }

    if (!formData.vehicleType) {
      newErrors.vehicleType = "Vehicle Type is required";
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fill required fields");
      return;
    }
    try {
      const payload = {
        orgId: orgId,
        branch: formData.branch || '',
        branchCode: formData.branchCode || '',
        createdBy: userName || '',
        active: formData.active === "Active",
        vehicleNumber: formData.vehicle,
        vehicleType: formData.vehicleType,
      };

      if (formData.id) {
        payload.id = formData.id;
      }

      console.log("SAVE PAYLOAD:", payload);

      const response = await vehicleAPI.createUpdateVehicle(payload);

      if (response?.status) {
        toast.success(
          formData.id
            ? "Vehicle updated successfully!"
            : "Vehicle created successfully!"
        );
        setIsListView(true);
      } else {
        toast.error("Vehicle Creation Failed");
      }

    } catch (error) {
      console.error("Error saving Vehicle:", error);
      toast.error("Failed to save Vehicle");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-6 p-6 bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-700 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsListView(true)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            New Vehicle
          </h1>
          <span className="text-xs text-red-500">● Not Saved</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleClearForm}
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
            Save
          </button>
        </div>
      </div>

      {/* Form Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <InputField
            label="Vehicle"
            name="vehicle"
            value={formData.vehicle}
            onChange={handleChange}
            required
            placeholder="Enter vehicle number or name"
          />
          {errors.vehicle && (
            <p className="text-red-500 text-xs mt-1">{errors.vehicle}</p>
          )}
        </div>

        <div className="relative" ref={vehicleTypeRef}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Vehicle Type <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            value={selectedVehicleType || vehicleTypeSearch}
            onChange={(e) => {
              setSelectedVehicleType("");
              setVehicleTypeSearch(e.target.value);
              setShowVehicleTypeDropdown(true);
            }}
            onFocus={() => setShowVehicleTypeDropdown(true)}
            placeholder="Search Vehicle Type..."
            className="w-full px-3 h-9 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
          {errors.vehicleType && (
            <p className="text-red-500 text-xs mt-1">{errors.vehicleType}</p>
          )}

          {showVehicleTypeDropdown && (
            <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 p-2">

              {filteredVehicleTypes.length > 0 ? (
                filteredVehicleTypes.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => handleVehicleTypeSelect(v)}
                    className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                  >
                    <p className="font-medium text-gray-700 dark:text-gray-200">
                      {v.vehicleType}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 px-3 py-2">No vehicle types found</p>
              )}

              <button
                onClick={handleCreateNewVehicleType}
                className="w-full flex items-center gap-2 px-3 py-2 mt-1 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-800 rounded-md text-sm"
              >
                <Plus className="h-4 w-4" />
                Create New Vehicle Type
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <select
            name="active"
            value={formData.active}
            onChange={handleChange}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>


      </div>
    </div>
  );
}

export default VehicleMaster;