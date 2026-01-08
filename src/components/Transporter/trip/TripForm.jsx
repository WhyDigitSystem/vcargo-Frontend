import { 
  X, 
  Save, 
  Navigation, 
  MapPin,
  Calendar,
  Clock,
  Car,
  User,
  Package,
  IndianRupee,
  Plus,
  Trash2,
  Hash,
  AlertCircle,
  FileText
} from "lucide-react";
import { useState, useEffect } from "react";

export const TripForm = ({ 
  trip = null, 
  vehicles = [], 
  drivers = [], 
  customers = [], 
  onSave, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    customerId: "",
    vehicleId: "",
    driverId: "",
    source: "",
    destination: "",
    distance: "",
    estimatedDuration: "",
    startDate: new Date().toISOString().split("T")[0],
    startTime: "08:00",
    endDate: "",
    endTime: "",
    status: "scheduled",
    tripType: "freight",
    goodsType: "",
    goodsWeight: "",
    goodsValue: "",
    tripCost: "",
    revenue: "",
    profit: "",
    fuelCost: "",
    tollCharges: "",
    otherExpenses: "",
    notes: "",
    waypoints: [],
    documents: [],
  });

  const [errors, setErrors] = useState({});
  const [newWaypoint, setNewWaypoint] = useState("");
  const [newDocument, setNewDocument] = useState({ name: "", type: "pdf" });

  useEffect(() => {
    if (trip) {
      setFormData({
        ...trip,
        startDate: trip.startDate || new Date().toISOString().split("T")[0],
        startTime: trip.startTime || "08:00",
        endDate: trip.endDate || "",
        endTime: trip.endTime || "",
        waypoints: trip.waypoints || [],
        documents: trip.documents || [],
      });
    }
  }, [trip]);

  // Calculate profit when costs or revenue change
  useEffect(() => {
    const tripCost = parseFloat(formData.tripCost) || 0;
    const revenue = parseFloat(formData.revenue) || 0;
    const profit = revenue - tripCost;
    
    setFormData(prev => ({
      ...prev,
      profit: profit.toFixed(2)
    }));
  }, [formData.tripCost, formData.revenue]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerId) newErrors.customerId = "Customer is required";
    if (!formData.vehicleId) newErrors.vehicleId = "Vehicle is required";
    if (!formData.driverId) newErrors.driverId = "Driver is required";
    if (!formData.source) newErrors.source = "Source is required";
    if (!formData.destination) newErrors.destination = "Destination is required";
    if (!formData.distance || parseFloat(formData.distance) <= 0)
      newErrors.distance = "Valid distance is required";
    if (!formData.estimatedDuration) newErrors.estimatedDuration = "Estimated duration is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.tripType) newErrors.tripType = "Trip type is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSave({
      ...formData,
      distance: parseFloat(formData.distance) || 0,
      goodsWeight: parseFloat(formData.goodsWeight) || 0,
      goodsValue: parseFloat(formData.goodsValue) || 0,
      tripCost: parseFloat(formData.tripCost) || 0,
      revenue: parseFloat(formData.revenue) || 0,
      profit: parseFloat(formData.profit) || 0,
      fuelCost: parseFloat(formData.fuelCost) || 0,
      tollCharges: parseFloat(formData.tollCharges) || 0,
      otherExpenses: parseFloat(formData.otherExpenses) || 0,
      customerName: customers.find(c => c.id === formData.customerId)?.name || "",
      vehicleName: vehicles.find(v => v.id === formData.vehicleId)?.registrationNumber || "",
      driverName: drivers.find(d => d.id === formData.driverId)?.name || "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const addWaypoint = () => {
    if (newWaypoint.trim()) {
      setFormData(prev => ({
        ...prev,
        waypoints: [...prev.waypoints, { 
          location: newWaypoint.trim(),
          lat: 0,
          lng: 0
        }]
      }));
      setNewWaypoint("");
    }
  };

  const removeWaypoint = (index) => {
    setFormData(prev => ({
      ...prev,
      waypoints: prev.waypoints.filter((_, i) => i !== index)
    }));
  };

  const addDocument = () => {
    if (newDocument.name.trim()) {
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, { 
          ...newDocument,
          url: "#"
        }]
      }));
      setNewDocument({ name: "", type: "pdf" });
    }
  };

  const removeDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const tripTypeOptions = [
    { id: "freight", name: "Freight", icon: "🚚" },
    { id: "passenger", name: "Passenger", icon: "👥" },
    { id: "return", name: "Return", icon: "↩️" },
    { id: "local", name: "Local", icon: "🏙️" },
    { id: "long_haul", name: "Long Haul", icon: "🛣️" },
  ];

  const goodsTypeOptions = [
    "Electronics", "Textiles", "Auto Parts", "FMCG", "Chemicals", 
    "Construction Material", "Agriculture", "Pharmaceuticals", "Other"
  ];

  const documentTypes = ["pdf", "image", "excel", "word"];

  const selectedCustomer = customers.find(c => c.id === formData.customerId);
  const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);
  const selectedDriver = drivers.find(d => d.id === formData.driverId);

  return (
    <div className="relative w-full max-w-6xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <Navigation className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {trip ? "Edit Trip" : "Create New Trip"}
              </h2>
              <p className="text-blue-100 text-sm">
                {trip ? "Update trip details" : "Plan a new transport trip"}
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Details
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Customer *
                </label>
                <select
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.customerId ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                  }`}
                >
                  <option value="" className="text-gray-500 dark:text-gray-400">Select Customer</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id} className="text-gray-900 dark:text-gray-100">
                      {customer.name} - {customer.phone}
                    </option>
                  ))}
                </select>
                {errors.customerId && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errors.customerId}
                  </p>
                )}
              </div>

              {selectedCustomer && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedCustomer.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedCustomer.email}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedCustomer.phone}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedCustomer.address}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Vehicle & Driver Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Car className="h-5 w-5" />
                Vehicle & Driver
              </h3>
              
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
                  Driver *
                </label>
                <select
                  name="driverId"
                  value={formData.driverId}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.driverId ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                  }`}
                >
                  <option value="" className="text-gray-500 dark:text-gray-400">Select Driver</option>
                  {drivers.map(driver => (
                    <option key={driver.id} value={driver.id} className="text-gray-900 dark:text-gray-100">
                      {driver.name} - {driver.license}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Trip Type */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Trip Type
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {tripTypeOptions.map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, tripType: type.id }))}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                      formData.tripType === type.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <span className="text-xl mb-2">{type.icon}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {type.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Route Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Route Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Source *
                </label>
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.source ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                  }`}
                  placeholder="e.g., Mumbai, Maharashtra"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Destination *
                </label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.destination ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                  }`}
                  placeholder="e.g., Pune, Maharashtra"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Distance (km) *
                </label>
                <input
                  type="number"
                  name="distance"
                  value={formData.distance}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.distance ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                  }`}
                  placeholder="150"
                />
              </div>
            </div>

            {/* Waypoints */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Waypoints (Optional)
                </label>
                <button
                  type="button"
                  onClick={addWaypoint}
                  className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Add Waypoint
                </button>
              </div>
              
              <div className="flex gap-3 mb-3">
                <input
                  type="text"
                  value={newWaypoint}
                  onChange={(e) => setNewWaypoint(e.target.value)}
                  className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Lonavala, Maharashtra"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addWaypoint())}
                />
                <button
                  type="button"
                  onClick={addWaypoint}
                  className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              
              {formData.waypoints.length > 0 && (
                <div className="space-y-2">
                  {formData.waypoints.map((waypoint, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">{waypoint.location}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeWaypoint(index)}
                        className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Schedule
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.startDate ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Time *
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.startTime ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estimated Duration *
                </label>
                <input
                  type="text"
                  name="estimatedDuration"
                  value={formData.estimatedDuration}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.estimatedDuration ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                  }`}
                  placeholder="e.g., 3 hours, 4 hours 30 mins"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Goods Information */}
          {formData.tripType === 'freight' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Package className="h-5 w-5" />
                Goods Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Goods Type
                  </label>
                  <select
                    name="goodsType"
                    value={formData.goodsType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Goods Type</option>
                    {goodsTypeOptions.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Weight (tons)
                  </label>
                  <input
                    type="number"
                    name="goodsWeight"
                    value={formData.goodsWeight}
                    onChange={handleChange}
                    step="0.1"
                    min="0"
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="2.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Goods Value (₹)
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <input
                      type="number"
                      name="goodsValue"
                      value={formData.goodsValue}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="500000"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Financial Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <IndianRupee className="h-5 w-5" />
              Financial Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Trip Cost (₹)
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <input
                    type="number"
                    name="tripCost"
                    value={formData.tripCost}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="25000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Revenue (₹)
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <input
                    type="number"
                    name="revenue"
                    value={formData.revenue}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="35000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Profit (₹)
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <input
                    type="number"
                    name="profit"
                    value={formData.profit}
                    readOnly
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Expense Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fuel Cost (₹)
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <input
                    type="number"
                    name="fuelCost"
                    value={formData.fuelCost}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="5000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Toll Charges (₹)
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <input
                    type="number"
                    name="tollCharges"
                    value={formData.tollCharges}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Other Expenses (₹)
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <input
                    type="number"
                    name="otherExpenses"
                    value={formData.otherExpenses}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="2000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents
              </h3>
              <button
                type="button"
                onClick={addDocument}
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
              >
                <Plus className="h-4 w-4" />
                Add Document
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Document Name
                </label>
                <input
                  type="text"
                  value={newDocument.name}
                  onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Delivery Challan, E-Way Bill"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDocument())}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Document Type
                </label>
                <select
                  value={newDocument.type}
                  onChange={(e) => setNewDocument({ ...newDocument, type: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {documentTypes.map(type => (
                    <option key={type} value={type}>{type.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {formData.documents.length > 0 && (
              <div className="space-y-2">
                {formData.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {doc.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {doc.type.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              placeholder="Additional notes, special instructions, or requirements..."
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
            {trip ? "Update Trip" : "Create Trip"}
          </button>
        </div>
      </form>
    </div>
  );
};