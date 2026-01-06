import { useEffect, useState } from "react";
import { ArrowLeft, Save, RotateCcw } from "lucide-react";
import InputField from "../UI/InputField";
import { useNavigate } from "react-router-dom";
import { toast } from "../../utils/toast";
import { chargeTypeAPI } from "../../api/chargeTypeAPI";
import { useSelector } from "react-redux";

const ChargeTypeMaster = ({ setIsListView, editId }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    chargeType: "",
    unit: "",
    active: "Active",
    branch: "",
    branchCode: "",
    orgId: 0,
    createdBy: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const orgId = user.orgId;

  // Get user info from localStorage
  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const userName = userData?.name || "";
  const userOrgId = userData?.orgId || 0;
  const userBranch = userData?.branch || "";
  const userBranchCode = userData?.branchCode || "";

  useEffect(() => {
    // Set default values from user data
    setFormData(prev => ({
      ...prev,
      orgId: userOrgId,
      branch: userBranch,
      branchCode: userBranchCode,
      createdBy: userName,
    }));

    if (editId) {
      getChargeTypeDetailsById(editId);
    }
  }, [editId]);

  const getChargeTypeDetailsById = async (id) => {
    try {
      setLoading(true);
      const response = await chargeTypeAPI.getChargeTypeById(id);
      console.log("Charge Type Edit API Response:", response);

      const data = response?.paramObjectsMap?.chargeTypeVO;

      if (data) {
        setFormData({
          id: data.id || null,
          chargeType: data.chargeType || "",
          unit: data.unit || "",
          active: data.active === 'Active' ? "Active" : "Inactive",
          branch: data.branch || userBranch,
          branchCode: data.branchCode || userBranchCode,
          orgId: data.orgId || userOrgId,
          createdBy: data.createdBy || userName,
        });
      } else {
        toast.error("Charge type data not found");
      }

    } catch (error) {
      console.error("Error fetching charge type details:", error);
      toast.error("Failed to load charge type details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleClear = () => {
    setFormData({
      chargeType: "",
      unit: "",
      active: "Active",
      branch: userBranch,
      branchCode: userBranchCode,
      orgId: userOrgId,
      createdBy: userName,
    });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.chargeType.trim()) {
      newErrors.chargeType = "Charge Type is required";
    }

    if (!formData.unit.trim()) {
      newErrors.unit = "Unit is required";
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
      setLoading(true);

      const payload = {
        chargeType: formData.chargeType.trim(),
        unit: formData.unit.trim(),
        active: formData.active === "Active",   // convert to boolean
        orgId: orgId,
        branch: formData.branch,
        branchCode: formData.branchCode,
        createdBy: formData.createdBy
      };

      console.log("SAVE PAYLOAD:", payload);

      if (formData.id) {
        payload.id = formData.id;
      }

      const response = await chargeTypeAPI.createUpdateChargeType(payload);

      if (response?.status === true) {
        toast.success(
          formData.id
            ? "Charge Type updated successfully!"
            : "Charge Type created successfully!"
        );
        handleClear();
        setIsListView(true);
      } else {
        toast.error(response?.message || "Charge Type operation failed");
      }

    } catch (error) {
      console.error("Error saving Charge Type:", error);
      toast.error("Failed to save Charge Type");
    } finally {
      setLoading(false);
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
              disabled={loading}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {formData.id ? "Edit Charge Type" : "New Charge Type"}
            </h1>
            {loading && (
              <div className="text-sm text-blue-500 animate-pulse">Loading...</div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" />
            Clear Form
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <InputField
            label="Charge Type"
            name="chargeType"
            value={formData.chargeType}
            onChange={handleChange}
            placeholder="Enter Charge Type"
            error={errors.chargeType}
            required
            disabled={loading}
          />
        </div>

        <div>
          <InputField
            label="Unit"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            placeholder="Enter Unit"
            error={errors.unit}
            required
            disabled={loading}
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <select
            name="active"
            value={formData.active}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition disabled:opacity-50"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

      </div>
    </div>
  );
}

export default ChargeTypeMaster;