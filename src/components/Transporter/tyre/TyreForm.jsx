import { 
  X, 
  Save, 
  Settings, 
  Calendar,
  MapPin,
  IndianRupee,
  Gauge,
  AlertCircle
} from "lucide-react";
import { useState, useEffect } from "react";

export const TyreForm = ({ 
  tyre = null, 
  vehicles = [], 
  onSave, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    serialNumber: "",
    brand: "",
    model: "",
    size: "",
    vehicleId: "",
    position: "Front Left",
    status: "active",
    purchaseDate: new Date().toISOString().split("T")[0],
    purchaseCost: "",
    odometerReading: "",
    treadDepth: "",
    recommendedPressure: 35,
    pressure: 32,
    notes: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (tyre) {
      setFormData({
        serialNumber: tyre.serialNumber || "",
        brand: tyre.brand || "",
        model: tyre.model || "",
        size: tyre.size || "",
        vehicleId: tyre.vehicleId || "",
        position: tyre.position || "Front Left",
        status: tyre.status || "active",
        purchaseDate: tyre.purchaseDate || new Date().toISOString().split("T")[0],
        purchaseCost: tyre.purchaseCost || "",
        odometerReading: tyre.odometerReading || "",
        treadDepth: tyre.treadDepth || "",
        recommendedPressure: tyre.recommendedPressure || 35,
        pressure: tyre.pressure || 32,
        notes: tyre.notes || "",
      });
    }
  }, [tyre]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.serialNumber) newErrors.serialNumber = "Serial number is required";
    if (!formData.brand) newErrors.brand = "Brand is required";
    if (!formData.size) newErrors.size = "Tyre size is required";
    if (!formData.vehicleId) newErrors.vehicleId = "Vehicle is required";
    if (!formData.purchaseDate) newErrors.purchaseDate = "Purchase date is required";
    if (!formData.purchaseCost || parseFloat(formData.purchaseCost) <= 0)
      newErrors.purchaseCost = "Valid purchase cost is required";
    if (!formData.treadDepth || parseFloat(formData.treadDepth) <= 0)
      newErrors.treadDepth = "Valid tread depth is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSave({
      ...formData,
      purchaseCost: parseFloat(formData.purchaseCost),
      odometerReading: parseFloat(formData.odometerReading) || 0,
      treadDepth: parseFloat(formData.treadDepth),
      recommendedPressure: parseFloat(formData.recommendedPressure),
      pressure: parseFloat(formData.pressure),
      id: tyre?.id || `TYRE-${Date.now()}`,
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

  const positions = [
    "Front Left",
    "Front Right", 
    "Rear Left",
    "Rear Right",
    "Spare"
  ];

  const statuses = [
    { id: "active", name: "Active", color: "text-emerald-600" },
    { id: "warning", name: "Warning", color: "text-amber-600" },
    { id: "critical", name: "Critical", color: "text-red-600" },
    { id: "repair", name: "Under Repair", color: "text-blue-600" },
    { id: "scrap", name: "Scrapped", color: "text-gray-600" },
  ];

  return (
    <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {tyre ? "Edit Tyre" : "Add New Tyre"}
              </h2>
              <p className="text-blue-100 text-sm">
                {tyre ? "Update tyre details" : "Register a new tyre"}
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
        <div className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Serial Number *
                </label>
                <input
                  type="text"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.serialNumber ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                  }`}
                  placeholder="TYRE-001234"
                />
                {errors.serialNumber && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.serialNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Brand *
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.brand ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                  }`}
                  placeholder="MRF, Apollo, CEAT"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Model
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Zapper, Steelmax"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Size *
                </label>
                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.size ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                  }`}
                  placeholder="205/55 R16"
                />
              </div>
            </div>
          </div>

          {/* Vehicle & Position */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Installation Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Position
                </label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {positions.map(pos => (
                    <option key={pos} value={pos} className="text-gray-900 dark:text-gray-100">
                      {pos}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Purchase Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <IndianRupee className="h-5 w-5" />
              Purchase Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Purchase Date *
                </label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.purchaseDate ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Purchase Cost (₹) *
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <input
                    type="number"
                    name="purchaseCost"
                    value={formData.purchaseCost}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.purchaseCost ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                    }`}
                    placeholder="8500"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              Technical Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tread Depth (mm) *
                </label>
                <input
                  type="number"
                  name="treadDepth"
                  value={formData.treadDepth}
                  onChange={handleChange}
                  step="0.1"
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.treadDepth ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                  }`}
                  placeholder="6.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Recommended Pressure (PSI)
                </label>
                <input
                  type="number"
                  name="recommendedPressure"
                  value={formData.recommendedPressure}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="35"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Pressure (PSI)
                </label>
                <input
                  type="number"
                  name="pressure"
                  value={formData.pressure}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="32"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Status
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {statuses.map(status => (
                <button
                  key={status.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, status: status.id }))}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    formData.status === status.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <div className={`text-sm font-medium ${status.color} mb-1`}>
                    {status.name}
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    status.id === 'active' ? 'bg-emerald-500' :
                    status.id === 'warning' ? 'bg-amber-500' :
                    status.id === 'critical' ? 'bg-red-500' :
                    status.id === 'repair' ? 'bg-blue-500' :
                    'bg-gray-500'
                  }`} />
                </button>
              ))}
            </div>
          </div>

          {/* Additional Information */}
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

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Any additional notes about this tyre..."
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
            {tyre ? "Update Tyre" : "Save Tyre"}
          </button>
        </div>
      </form>
    </div>
  );
};