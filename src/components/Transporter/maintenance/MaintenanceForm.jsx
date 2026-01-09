import {
  Calendar,
  IndianRupee,
  Loader2,
  Plus,
  Save,
  Trash2,
  Wrench,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { maintananceAPI } from "../../../api/maintananceAPI";

export const MaintenanceForm = ({
  record = null,
  vehicles = [],
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    vehicleId: "",
    type: "preventive",
    status: "pending",
    priority: "medium",
    scheduledDate: new Date().toISOString().split("T")[0],
    completedDate: "",
    odometerReading: "",
    cost: "",
    estimatedCost: "",
    serviceCenter: "",
    mechanic: "",
    description: "",
    notes: "",
    parts: [{ name: "", quantity: 1, cost: "" }],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Organization ID - should come from context
  const orgId = "1000000001";
  const branchCode = "BLR";
  const branchName = "Bangalore";
  const createdBy = "Justin"; // Should come from user context

  useEffect(() => {
    if (record) {
      setFormData({
        title: record.title || "",
        vehicleId: record.vehicleId || "",
        type: record.type || "preventive",
        status: record.status || "pending",
        priority: record.priority || "medium",
        scheduledDate:
          record.scheduledDate || new Date().toISOString().split("T")[0],
        completedDate: record.completedDate || "",
        odometerReading: record.odometerReading || "",
        cost: record.cost || "",
        estimatedCost: record.estimatedCost || "",
        serviceCenter: record.serviceCenter || "",
        mechanic: record.mechanic || "",
        description: record.description || "",
        notes: record.notes || "",
        parts:
          record.parts && record.parts.length > 0
            ? record.parts.map((part) => ({
                name: part.name || "",
                quantity: part.quantity || 1,
                cost: part.cost || "",
              }))
            : [{ name: "", quantity: 1, cost: "" }],
      });
    }
  }, [record]);

  console.log("vehicles==>", vehicles);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.vehicleId) newErrors.vehicleId = "Vehicle is required";
    if (!formData.scheduledDate)
      newErrors.scheduledDate = "Scheduled date is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.type) newErrors.type = "Maintenance type is required";
    if (!formData.status) newErrors.status = "Status is required";
    if (!formData.priority) newErrors.priority = "Priority is required";

    // Validate parts
    formData.parts.forEach((part, index) => {
      if (part.name.trim() && (!part.cost || parseFloat(part.cost) <= 0)) {
        newErrors[`part_${index}_cost`] = "Valid cost is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    try {
      // Prepare API payload
      const totalCost = calculateTotal();
      const estimatedCost = parseFloat(formData.estimatedCost) || totalCost;

      const apiPayload = {
        // If editing existing record, include id
        ...(record && { id: record.id }),

        // Required fields
        title: formData.title.trim(),
        vehicleId: formData.vehicleId,
        type: formData.type,
        status: formData.status,
        priority: formData.priority,
        scheduledDate: formData.scheduledDate,
        completedDate: formData.completedDate || null,
        odometerReading: parseFloat(formData.odometerReading) || 0,
        estimatedCost: estimatedCost,
        serviceCenter: formData.serviceCenter.trim() || "Not specified",
        mechanic: formData.mechanic.trim() || "Not assigned",
        description: formData.description.trim(),
        notes: formData.notes.trim() || "",

        // Filter out empty parts and format them
        parts: formData.parts
          .filter((part) => part.name.trim() !== "")
          .map((part) => ({
            name: part.name.trim(),
            quantity: parseInt(part.quantity) || 1,
            cost: parseFloat(part.cost) || 0,
          })),

        // Organization and user info
        orgId: orgId,
        branchCode: branchCode,
        branchName: branchName,
        createdBy: createdBy,

        // Optional: Include vehicle name for reference
        vehicle:
          vehicles.find((v) => v.id === formData.vehicleId)
            ?.registrationNumber || "",
      };

      console.log("Submitting maintenance data:", apiPayload);

      // Call API using your service
      // Since we need to use the same endpoint for create and update,
      // we'll make a direct API call or extend the service
      const response = await maintananceAPI.createUpdateMaintenance(apiPayload);

      console.log("Submitting maintenance data==>", response);

      if (response.success) {
        const message = record
          ? "Maintenance record updated successfully!"
          : "Maintenance record created successfully!";

        // toast.success(message);

        // Call parent onSave callback with the response data
        if (onSave) {
          onSave({
            ...apiPayload,
            id: record ? record.id : response.data?.id,
            cost: totalCost,
            vehicleName: apiPayload.vehicle,
          });
        }
      } else {
        throw new Error(
          response.paramObjectsMap?.message || "Operation failed"
        );
      }
    } catch (error) {
      console.error("Error saving maintenance record:", error);

      // Show detailed error message
      const errorMessage =
        error.response?.data?.paramObjectsMap?.message ||
        error.message ||
        "Failed to save maintenance record. Please try again.";

      toast.error(errorMessage);

      // Highlight specific field errors if available
      if (error.response?.data?.errors) {
        const apiErrors = error.response.data.errors;
        setErrors((prev) => ({ ...prev, ...apiErrors }));
      }
    } finally {
      setLoading(false);
    }
  };

  // Direct API call function for create/update

  // Alternative: If you want to add this to your maintenanceService
  // Add this method to your maintenanceService.js:
  /*
  createUpdateMaintenance: async (maintenanceData) => {
    try {
      const response = await apiClient.put(
        "/api/maintenance/createUpdateMaintenance",
        maintenanceData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating/updating maintenance:", error);
      throw error;
    }
  },
  */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePartChange = (index, field, value) => {
    const updatedParts = [...formData.parts];
    updatedParts[index] = { ...updatedParts[index], [field]: value };
    setFormData((prev) => ({ ...prev, parts: updatedParts }));

    // Clear part cost error if exists
    const errorKey = `part_${index}_cost`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: "" }));
    }
  };

  const addPart = () => {
    setFormData((prev) => ({
      ...prev,
      parts: [...prev.parts, { name: "", quantity: 1, cost: "" }],
    }));
  };

  const removePart = (index) => {
    if (formData.parts.length > 1) {
      const updatedParts = formData.parts.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, parts: updatedParts }));

      // Clear any errors for this part
      const errorKey = `part_${index}_cost`;
      if (errors[errorKey]) {
        const newErrors = { ...errors };
        delete newErrors[errorKey];
        setErrors(newErrors);
      }
    } else {
      // Clear the single remaining part instead of removing it
      setFormData((prev) => ({
        ...prev,
        parts: [{ name: "", quantity: 1, cost: "" }],
      }));
    }
  };

  const typeOptions = [
    {
      id: "preventive",
      name: "Preventive",
      icon: "🛡️",
      color: "text-emerald-600",
    },
    {
      id: "corrective",
      name: "Corrective",
      icon: "🔧",
      color: "text-blue-600",
    },
    { id: "emergency", name: "Emergency", icon: "🚨", color: "text-red-600" },
    { id: "routine", name: "Routine", icon: "🔄", color: "text-amber-600" },
  ];

  const statusOptions = [
    { id: "pending", name: "Pending", color: "text-amber-600" },
    { id: "scheduled", name: "Scheduled", color: "text-cyan-600" },
    { id: "in_progress", name: "In Progress", color: "text-blue-600" },
    { id: "completed", name: "Completed", color: "text-emerald-600" },
    { id: "cancelled", name: "Cancelled", color: "text-gray-600" },
  ];

  const priorityOptions = [
    { id: "low", name: "Low", color: "text-blue-600" },
    { id: "medium", name: "Medium", color: "text-amber-600" },
    { id: "high", name: "High", color: "text-orange-600" },
    { id: "urgent", name: "Urgent", color: "text-red-600" },
  ];

  const calculateTotal = () => {
    return formData.parts.reduce((sum, part) => {
      const quantity = parseInt(part.quantity) || 1;
      const cost = parseFloat(part.cost) || 0;
      return sum + cost * quantity;
    }, 0);
  };

  // Auto-fill completed date when status is "completed"
  useEffect(() => {
    if (formData.status === "completed" && !formData.completedDate) {
      const today = new Date().toISOString().split("T")[0];
      setFormData((prev) => ({ ...prev, completedDate: today }));
    }
  }, [formData.status]);

  // Get selected vehicle details
  const selectedVehicle = "";

  return (
    <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {record ? "Edit Maintenance Record" : "New Maintenance Record"}
              </h2>
              <p className="text-blue-100 text-sm">
                {record
                  ? "Update maintenance details"
                  : "Create a new maintenance record"}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            disabled={loading}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                  errors.title
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-700"
                }`}
                placeholder="e.g., Engine Oil Change"
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Vehicle *
                {selectedVehicle && (
                  <span className="ml-2 text-sm text-green-600 dark:text-green-400">
                    ({selectedVehicle.make} {selectedVehicle.model})
                  </span>
                )}
              </label>
              <select
                name="vehicleId"
                value={formData.vehicleId}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                  errors.vehicleId
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-700"
                }`}
              >
                <option value="" className="text-gray-500 dark:text-gray-400">
                  Select Vehicle
                </option>
                {vehicles.map((vehicle) => (
                  <option
                    key={vehicle.id}
                    value={vehicle.id}
                    className="text-gray-900 dark:text-gray-100"
                  >
                    {vehicle.registrationNumber} - {vehicle.make}{" "}
                    {vehicle.model}
                  </option>
                ))}
              </select>
              {errors.vehicleId && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.vehicleId}
                </p>
              )}
            </div>
          </div>

          {/* Type, Status & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Maintenance Type *
              </label>
              <div className="space-y-2">
                {typeOptions.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, type: type.id }))
                    }
                    disabled={loading}
                    className={`flex items-center gap-3 w-full p-3 rounded-xl border transition-all disabled:opacity-50 ${
                      formData.type === type.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <span className="text-lg">{type.icon}</span>
                    <span className={`font-medium ${type.color}`}>
                      {type.name}
                    </span>
                  </button>
                ))}
              </div>
              {errors.type && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.type}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Status *
              </label>
              <div className="space-y-2">
                {statusOptions.map((status) => (
                  <button
                    key={status.id}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, status: status.id }))
                    }
                    disabled={loading}
                    className={`flex items-center gap-3 w-full p-3 rounded-xl border transition-all disabled:opacity-50 ${
                      formData.status === status.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${
                        status.id === "completed"
                          ? "bg-emerald-500"
                          : status.id === "in_progress"
                          ? "bg-blue-500"
                          : status.id === "pending"
                          ? "bg-amber-500"
                          : status.id === "scheduled"
                          ? "bg-cyan-500"
                          : "bg-gray-500"
                      }`}
                    />
                    <span className={`font-medium ${status.color}`}>
                      {status.name}
                    </span>
                  </button>
                ))}
              </div>
              {errors.status && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.status}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Priority *
              </label>
              <div className="space-y-2">
                {priorityOptions.map((priority) => (
                  <button
                    key={priority.id}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        priority: priority.id,
                      }))
                    }
                    disabled={loading}
                    className={`flex items-center gap-3 w-full p-3 rounded-xl border transition-all disabled:opacity-50 ${
                      formData.priority === priority.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${
                        priority.id === "urgent"
                          ? "bg-red-500"
                          : priority.id === "high"
                          ? "bg-orange-500"
                          : priority.id === "medium"
                          ? "bg-amber-500"
                          : "bg-blue-500"
                      }`}
                    />
                    <span className={`font-medium ${priority.color}`}>
                      {priority.name}
                    </span>
                  </button>
                ))}
              </div>
              {errors.priority && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.priority}
                </p>
              )}
            </div>
          </div>

          {/* Dates & Odometer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Scheduled Date *
                </span>
              </label>
              <input
                type="date"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                  errors.scheduledDate
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-700"
                }`}
              />
              {errors.scheduledDate && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.scheduledDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Completed Date
                </span>
              </label>
              <input
                type="date"
                name="completedDate"
                value={formData.completedDate}
                onChange={handleChange}
                disabled={loading || formData.status !== "completed"}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              {formData.status === "completed" && !formData.completedDate && (
                <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                  Auto-filled with today's date
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Odometer Reading (km)
              </label>
              <input
                type="number"
                name="odometerReading"
                value={formData.odometerReading}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                placeholder="e.g., 15000"
                min="0"
                step="1"
              />
            </div>
          </div>

          {/* Service Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Service Center
              </label>
              <input
                type="text"
                name="serviceCenter"
                value={formData.serviceCenter}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                placeholder="AutoCare Service Center"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mechanic / Technician
              </label>
              <input
                type="text"
                name="mechanic"
                value={formData.mechanic}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                placeholder="Rajesh Kumar"
              />
            </div>
          </div>

          {/* Estimated Cost */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estimated Cost (₹)
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <input
                type="number"
                name="estimatedCost"
                value={formData.estimatedCost}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              disabled={loading}
              className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-50 ${
                errors.description
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              }`}
              placeholder="Detailed description of the maintenance work..."
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.description}
              </p>
            )}
          </div>

          {/* Parts & Cost */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Parts & Cost Breakdown
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Add individual parts with their costs
                </p>
              </div>
              <button
                type="button"
                onClick={addPart}
                disabled={loading}
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                Add Part
              </button>
            </div>

            <div className="space-y-4">
              {formData.parts.map((part, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
                >
                  <div className="md:col-span-5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Part Name
                    </label>
                    <input
                      type="text"
                      value={part.name}
                      onChange={(e) =>
                        handlePartChange(index, "name", e.target.value)
                      }
                      disabled={loading}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      placeholder="e.g., Engine Oil, Brake Pads"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={part.quantity}
                      onChange={(e) =>
                        handlePartChange(index, "quantity", e.target.value)
                      }
                      min="1"
                      disabled={loading}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cost (₹) *
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <input
                        type="number"
                        value={part.cost}
                        onChange={(e) =>
                          handlePartChange(index, "cost", e.target.value)
                        }
                        disabled={loading}
                        className={`w-full px-4 py-3 pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                          errors[`part_${index}_cost`]
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-700"
                        }`}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    {errors[`part_${index}_cost`] && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                        {errors[`part_${index}_cost`]}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-1">
                    <button
                      type="button"
                      onClick={() => removePart(index)}
                      disabled={loading || formData.parts.length === 1}
                      className="w-full p-3 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Cost */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    Total Cost
                  </span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Sum of all parts
                  </p>
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  ₹{calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              disabled={loading}
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-50"
              placeholder="Any additional notes, observations, or recommendations..."
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {record ? "Updating..." : "Saving..."}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {record ? "Update Record" : "Save Record"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
