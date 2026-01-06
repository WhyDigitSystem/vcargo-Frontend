import { 
  X, 
  Save, 
  Wrench, 
  Calendar,
  Car,
  IndianRupee,
  AlertTriangle,
  Clock,
  Plus,
  Trash2,
  FileText
} from "lucide-react";
import { useState, useEffect } from "react";

export const MaintenanceForm = ({ 
  record = null, 
  vehicles = [], 
  onSave, 
  onCancel 
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

  useEffect(() => {
    if (record) {
      setFormData({
        title: record.title || "",
        vehicleId: record.vehicleId || "",
        type: record.type || "preventive",
        status: record.status || "pending",
        priority: record.priority || "medium",
        scheduledDate: record.scheduledDate || new Date().toISOString().split("T")[0],
        completedDate: record.completedDate || "",
        odometerReading: record.odometerReading || "",
        cost: record.cost || "",
        estimatedCost: record.estimatedCost || "",
        serviceCenter: record.serviceCenter || "",
        mechanic: record.mechanic || "",
        description: record.description || "",
        notes: record.notes || "",
        parts: record.parts || [{ name: "", quantity: 1, cost: "" }],
      });
    }
  }, [record]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.vehicleId) newErrors.vehicleId = "Vehicle is required";
    if (!formData.scheduledDate) newErrors.scheduledDate = "Scheduled date is required";
    if (!formData.description) newErrors.description = "Description is required";

    // Validate parts
    formData.parts.forEach((part, index) => {
      if (part.name && (!part.cost || parseFloat(part.cost) <= 0)) {
        newErrors[`part_${index}_cost`] = "Valid cost is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const totalCost = formData.parts.reduce((sum, part) => 
      sum + (parseFloat(part.cost) || 0), 0
    );

    onSave({
      ...formData,
      odometerReading: parseFloat(formData.odometerReading) || 0,
      cost: totalCost || parseFloat(formData.cost) || 0,
      estimatedCost: parseFloat(formData.estimatedCost) || 0,
      parts: formData.parts.filter(part => part.name.trim() !== ""),
      vehicleName: vehicles.find(v => v.id === formData.vehicleId)?.registrationNumber || "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handlePartChange = (index, field, value) => {
    const updatedParts = [...formData.parts];
    updatedParts[index] = { ...updatedParts[index], [field]: value };
    setFormData(prev => ({ ...prev, parts: updatedParts }));
  };

  const addPart = () => {
    setFormData(prev => ({
      ...prev,
      parts: [...prev.parts, { name: "", quantity: 1, cost: "" }]
    }));
  };

  const removePart = (index) => {
    if (formData.parts.length > 1) {
      const updatedParts = formData.parts.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, parts: updatedParts }));
    }
  };

  const typeOptions = [
    { id: "preventive", name: "Preventive", icon: "🛡️", color: "text-emerald-600" },
    { id: "corrective", name: "Corrective", icon: "🔧", color: "text-blue-600" },
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
    return formData.parts.reduce((sum, part) => 
      sum + ((parseFloat(part.cost) || 0) * (parseInt(part.quantity) || 1)), 0
    );
  };

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
                {record ? "Update maintenance details" : "Create a new maintenance record"}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
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
                className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? "border-red-500" : "border-gray-300 dark:border-gray-700"
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
              </label>
              <select
                name="vehicleId"
                value={formData.vehicleId}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.vehicleId ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                }`}
              >
                <option value="" className="text-gray-500 dark:text-gray-400">Select Vehicle</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id} className="text-gray-900 dark:text-gray-100">
                    {vehicle.registrationNumber} - {vehicle.make} {vehicle.model}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Type, Status & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Maintenance Type
              </label>
              <div className="space-y-2">
                {typeOptions.map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: type.id }))}
                    className={`flex items-center gap-3 w-full p-3 rounded-xl border transition-all ${
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Status
              </label>
              <div className="space-y-2">
                {statusOptions.map(status => (
                  <button
                    key={status.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, status: status.id }))}
                    className={`flex items-center gap-3 w-full p-3 rounded-xl border transition-all ${
                      formData.status === status.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full ${
                      status.id === 'completed' ? 'bg-emerald-500' :
                      status.id === 'in_progress' ? 'bg-blue-500' :
                      status.id === 'pending' ? 'bg-amber-500' :
                      status.id === 'scheduled' ? 'bg-cyan-500' :
                      'bg-gray-500'
                    }`} />
                    <span className={`font-medium ${status.color}`}>
                      {status.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Priority
              </label>
              <div className="space-y-2">
                {priorityOptions.map(priority => (
                  <button
                    key={priority.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, priority: priority.id }))}
                    className={`flex items-center gap-3 w-full p-3 rounded-xl border transition-all ${
                      formData.priority === priority.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full ${
                      priority.id === 'urgent' ? 'bg-red-500' :
                      priority.id === 'high' ? 'bg-orange-500' :
                      priority.id === 'medium' ? 'bg-amber-500' :
                      'bg-blue-500'
                    }`} />
                    <span className={`font-medium ${priority.color}`}>
                      {priority.name}
                    </span>
                  </button>
                ))}
              </div>
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
                className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.scheduledDate ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                }`}
              />
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
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="15000"
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
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Rajesh Kumar"
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
              className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                errors.description ? "border-red-500" : "border-gray-300 dark:border-gray-700"
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Parts & Cost Breakdown
              </h3>
              <button
                type="button"
                onClick={addPart}
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                <Plus className="h-4 w-4" />
                Add Part
              </button>
            </div>

            <div className="space-y-4">
              {formData.parts.map((part, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Part Name
                    </label>
                    <input
                      type="text"
                      value={part.name}
                      onChange={(e) => handlePartChange(index, 'name', e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      onChange={(e) => handlePartChange(index, 'quantity', e.target.value)}
                      min="1"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cost (₹)
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <input
                        type="number"
                        value={part.cost}
                        onChange={(e) => handlePartChange(index, 'cost', e.target.value)}
                        className={`w-full px-4 py-3 pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[`part_${index}_cost`] ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                        }`}
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-1">
                    <button
                      type="button"
                      onClick={() => removePart(index)}
                      className="w-full p-3 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                      disabled={formData.parts.length === 1}
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
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Total Cost
                </span>
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
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Any additional notes, observations, or recommendations..."
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:opacity-90 transition-opacity font-medium"
          >
            <Save className="h-4 w-4" />
            {record ? "Update Record" : "Save Record"}
          </button>
        </div>
      </form>
    </div>
  );
};