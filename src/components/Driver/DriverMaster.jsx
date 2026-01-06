import { useEffect, useState } from "react";
import { ArrowLeft, Save, RotateCcw } from "lucide-react";
import InputField from "../UI/InputField";
import { useNavigate } from "react-router-dom";
import { driverAPI } from "../../api/driverAPI";
import { toast } from "../../utils/toast";
import { useSelector } from "react-redux";

export default function DriverMaster({ setIsListView, editId }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    driverName: "",
    driverNumber: "",
    active: "Active",
  });
  const userName = JSON.parse(localStorage.getItem("user"))?.name || "";
  const [errors, setErrors] = useState({});
  const { user } = useSelector((state) => state.auth);
  const orgId = user.orgId;

  useEffect(() => {
    if (editId) {
      getDriverDetailsById(editId);
    }
  }, [editId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "driverNumber") {
      newValue = newValue.replace(/[^0-9]/g, "");
      newValue = newValue.slice(0, 10);
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleClear = () => {
    setFormData({ driverName: "", driverNumber: "", active: "Active" });
  };

  const getDriverDetailsById = async (id) => {
    try {
      const response = await driverAPI.getDriverById(id);
      console.log("Driver Edit API Response:", response);

      const data = response?.paramObjectsMap?.driver;

      setFormData({
        id: data.id || null,
        driverName: data.driverName || "",
        driverNumber: data.driverNumber || "",
        active: data.active === 'Active' ? "Active" : "Inactive",
        branch: data.branch || "",
        branchCode: data.branchCode || "",
        orgId: data.orgId || "",
        createdBy: data.createdBy || "",
      });

    } catch (error) {
      console.error("Error fetching driver details:", error);
      toast.error("Failed to load driver details");
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.driverName.trim()) {
      newErrors.driverName = "Driver name is required";
    }

    if (formData.driverName && !/^[A-Za-z ]+$/.test(formData.driverName)) {
      newErrors.driverName = "Driver name can contain only letters";
    }

    if (!formData.driverNumber.trim()) {
      newErrors.driverNumber = "Driver mobile number is required";
    }

    if (formData.driverNumber && !/^\d+$/.test(formData.driverNumber)) {
      newErrors.driverNumber = "Driver number must contain only digits";
    }

    if (formData.driverNumber && formData.driverNumber.length !== 10) {
      newErrors.driverNumber = "Driver number must be exactly 10 digits";
    }

    setErrors(newErrors);

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
        driverName: formData.driverName,
        driverNumber: formData.driverNumber,
      };

      if (formData.id) {
        payload.id = formData.id;
      }

      console.log("SAVE PAYLOAD:", payload);

      const response = await driverAPI.createUpdateDriver(payload);

      if (response?.status) {
        toast.success(
          formData.id
            ? "Driver updated successfully!"
            : "Driver created successfully!"
        );
        setIsListView(true);
      } else {
        toast.error("Driver Creation Failed");
      }

    } catch (error) {
      console.error("Error saving Driver:", error);
      toast.error("Failed to save Driver");
    }
  };

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
              New Driver
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
            Save
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <InputField
            label="Driver Name"
            name="driverName"
            value={formData.driverName}
            onChange={handleChange}
            required
            placeholder="Enter driver's full name"
          />
          {errors.driverName && (
            <p className="text-red-500 text-xs mt-1">{errors.driverName}</p>
          )}
        </div>

        <div>
          <InputField
            label="Driver Number"
            name="driverNumber"
            value={formData.driverNumber}
            onChange={handleChange}
            placeholder="Enter driver mobile number"
            required
          />
          {errors.driverNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.driverNumber}</p>
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
