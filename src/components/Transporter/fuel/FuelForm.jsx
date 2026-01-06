import {
  AlertCircle,
  Calendar,
  Car,
  Clock,
  FileText,
  Fuel,
  Hash,
  IndianRupee,
  Map,
  Save,
  Thermometer,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export const FuelForm = ({
  entry = null,
  vehicles = [],
  drivers = [],
  onSave,
  onCancel,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState({
    vehicleId: "",
    driverId: "",
    fuelType: "diesel",
    quantity: "",
    cost: "",
    odometerReading: "",
    previousOdometer: "",
    station: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
    receiptNumber: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState("basic");

  const fuelTypes = [
    {
      id: "diesel",
      name: "Diesel",
      icon: <Fuel className="h-4 w-4" />,
      color: "from-orange-500 to-amber-500",
    },
    {
      id: "petrol",
      name: "Petrol",
      icon: <Fuel className="h-4 w-4" />,
      color: "from-purple-500 to-violet-500",
    },
    {
      id: "cng",
      name: "CNG",
      icon: <Thermometer className="h-4 w-4" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "electric",
      name: "Electric",
      icon: <Zap className="h-4 w-4" />,
      color: "from-green-500 to-emerald-500",
    },
  ];

  // Calculate derived values
  const calculations = useMemo(() => {
    const qty = parseFloat(formData.quantity) || 0;
    const cost = parseFloat(formData.cost) || 0;
    const currentOdo = parseFloat(formData.odometerReading) || 0;
    const prevOdo = parseFloat(formData.previousOdometer) || 0;

    return {
      costPerUnit: qty > 0 ? (cost / qty).toFixed(2) : "0.00",
      distanceTravelled: currentOdo > prevOdo ? currentOdo - prevOdo : 0,
      fuelEfficiency:
        qty > 0 && currentOdo > prevOdo
          ? ((currentOdo - prevOdo) / qty).toFixed(2)
          : "0.00",
      totalCost: cost.toFixed(2),
    };
  }, [
    formData.quantity,
    formData.cost,
    formData.odometerReading,
    formData.previousOdometer,
  ]);

  // Initialize form if editing
  useEffect(() => {
    if (entry) {
      setFormData({
        vehicleId: entry.vehicleId || "",
        driverId: entry.driverId || "",
        fuelType: entry.fuelType || "diesel",
        quantity: entry.quantity || "",
        cost: entry.cost?.replace("₹", "") || entry.cost || "",
        odometerReading: entry.odometerReading || "",
        previousOdometer: entry.previousOdometer || "",
        station: entry.station || "",
        date: entry.date || new Date().toISOString().split("T")[0],
        time: entry.time || new Date().toTimeString().slice(0, 5),
        receiptNumber: entry.receiptNumber || "",
        notes: entry.notes || "",
      });
    }
  }, [entry]);

  // Get selected vehicle details
  const selectedVehicle = useMemo(
    () => vehicles.find((v) => v.id === formData.vehicleId),
    [formData.vehicleId, vehicles]
  );

  const validateForm = () => {
    const newErrors = {};

    if (!formData.vehicleId) newErrors.vehicleId = "Vehicle is required";
    if (!formData.driverId) newErrors.driverId = "Driver is required";
    if (!formData.quantity || parseFloat(formData.quantity) <= 0)
      newErrors.quantity = "Valid quantity is required";
    if (!formData.cost || parseFloat(formData.cost) <= 0)
      newErrors.cost = "Valid cost is required";
    if (!formData.odometerReading || parseFloat(formData.odometerReading) <= 0)
      newErrors.odometerReading = "Valid odometer reading is required";

    if (
      parseFloat(formData.previousOdometer) >=
      parseFloat(formData.odometerReading)
    ) {
      newErrors.odometerReading = "Must be greater than previous reading";
    }

    if (!formData.station) newErrors.station = "Station is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.receiptNumber)
      newErrors.receiptNumber = "Receipt number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const submissionData = {
        ...formData,
        quantity: parseFloat(formData.quantity),
        cost: parseFloat(formData.cost),
        odometerReading: parseFloat(formData.odometerReading),
        previousOdometer: parseFloat(formData.previousOdometer) || 0,
        costPerUnit: `₹${calculations.costPerUnit}`,
        distanceTravelled: calculations.distanceTravelled,
        fuelEfficiency: calculations.fuelEfficiency,
        id: entry?.id || `FUEL-${Date.now()}`,
        vehicleName: selectedVehicle
          ? `${selectedVehicle.make} ${selectedVehicle.model}`
          : "",
        driverName: drivers.find((d) => d.id === formData.driverId)?.name || "",
      };

      await onSave(submissionData);
    } catch (error) {
      console.error("Error saving fuel entry:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleVehicleChange = (e) => {
    const vehicleId = e.target.value;
    const selectedVehicle = vehicles.find((v) => v.id === vehicleId);

    setFormData((prev) => ({
      ...prev,
      vehicleId,
      fuelType: selectedVehicle?.fuelType || "diesel",
      previousOdometer: selectedVehicle?.lastOdometer || "",
    }));
  };

  // Quick fill actions
  // const quickFillActions = [
  //   {
  //     label: "Full Tank",
  //     action: () => {
  //       if (selectedVehicle?.tankCapacity) {
  //         setFormData((prev) => ({
  //           ...prev,
  //           quantity: selectedVehicle.tankCapacity,
  //         }));
  //       }
  //     },
  //     icon: <Fuel className="h-3.5 w-3.5" />,
  //   },
  //   {
  //     label: "Today",
  //     action: () => {
  //       setFormData((prev) => ({
  //         ...prev,
  //         date: new Date().toISOString().split("T")[0],
  //       }));
  //     },
  //     icon: <Calendar className="h-3.5 w-3.5" />,
  //   },
  //   {
  //     label: "Now",
  //     action: () => {
  //       setFormData((prev) => ({
  //         ...prev,
  //         time: new Date().toTimeString().slice(0, 5),
  //       }));
  //     },
  //     icon: <Clock className="h-3.5 w-3.5" />,
  //   },
  // ];

  const sections = [
    { id: "basic", label: "Basic Info", icon: <Car className="h-4 w-4" /> },
    {
      id: "details",
      label: "Fuel Details",
      icon: <Fuel className="h-4 w-4" />,
    },
    {
      id: "additional",
      label: "Additional",
      icon: <FileText className="h-4 w-4" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        {/* Backdrop with blur */}
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={onCancel}
        />

        {/* Modal Container */}
        <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Fuel className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {isEditing ? "Edit Fuel Entry" : "New Fuel Entry"}
                  </h2>
                  <p className="text-blue-100 text-sm">
                    {selectedVehicle
                      ? `${selectedVehicle.registrationNumber} • ${selectedVehicle.make} ${selectedVehicle.model}`
                      : "Select a vehicle to continue"}
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

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-3 divide-x divide-gray-800 bg-gray-900 dark:bg-gray-800">
            <div className="p-3 text-center">
              <div className="text-xs text-gray-400">Cost/L</div>
              <div className="text-lg font-semibold text-white">
                ₹{calculations.costPerUnit}
              </div>
            </div>
            <div className="p-3 text-center">
              <div className="text-xs text-gray-400">Efficiency</div>
              <div className="text-lg font-semibold text-white">
                {calculations.fuelEfficiency} km/L
              </div>
            </div>
            <div className="p-3 text-center">
              <div className="text-xs text-gray-400">Total Cost</div>
              <div className="text-lg font-semibold text-white">
                ₹{calculations.totalCost}
              </div>
            </div>
          </div>

          {/* Form Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-800">
            <div className="flex px-6">
              {sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setExpandedSection(section.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-medium transition-colors ${
                    expandedSection === section.id
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                  }`}
                >
                  {section.icon}
                  {section.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Basic Info Section */}
              {(expandedSection === "basic" || !expandedSection) && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <span className="flex items-center gap-2">
                          <Car className="h-4 w-4" />
                          Vehicle *
                        </span>
                      </label>
                      <select
                        name="vehicleId"
                        value={formData.vehicleId}
                        onChange={handleVehicleChange}
                        className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.vehicleId
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-700"
                        }`}
                      >
                        <option
                          value=""
                          className="text-gray-500 dark:text-gray-400"
                        >
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
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.vehicleId}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <span className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Driver *
                        </span>
                      </label>
                      <select
                        name="driverId"
                        value={formData.driverId}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.driverId
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-700"
                        }`}
                      >
                        <option
                          value=""
                          className="text-gray-500 dark:text-gray-400"
                        >
                          Select Driver
                        </option>
                        {drivers.map((driver) => (
                          <option
                            key={driver.id}
                            value={driver.id}
                            className="text-gray-900 dark:text-gray-100"
                          >
                            {driver.name} ({driver.license})
                          </option>
                        ))}
                      </select>
                      {errors.driverId && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.driverId}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Fuel Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Fuel Type
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {fuelTypes.map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              fuelType: type.id,
                            }))
                          }
                          className={`relative overflow-hidden p-4 rounded-xl border-2 transition-all ${
                            formData.fuelType === type.id
                              ? `border-blue-500 bg-gradient-to-br ${type.color} bg-opacity-10`
                              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div
                              className={`p-2 rounded-lg ${
                                formData.fuelType === type.id
                                  ? "bg-white/20"
                                  : "bg-gray-100 dark:bg-gray-800"
                              }`}
                            >
                              {type.icon}
                            </div>
                            <span
                              className={`text-sm font-medium ${
                                formData.fuelType === type.id
                                  ? "text-gray-900 dark:text-white"
                                  : "text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {type.name}
                            </span>
                          </div>
                          {formData.fuelType === type.id && (
                            <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Fuel Details Section */}
              {expandedSection === "details" && (
                <div className="space-y-6">
                  {/* Quick Actions */}
                  {/* <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Quick Fill
                      </span>
                      <Navigation className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex gap-2">
                      {quickFillActions.map((action, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={action.action}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm"
                        >
                          {action.icon}
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div> */}

                  {/* Quantity & Cost */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <span className="flex items-center gap-2">
                          <Hash className="h-4 w-4" />
                          Quantity (L) *
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleChange}
                          step="0.01"
                          min="0"
                          className={`w-full px-4 py-3 pl-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.quantity
                              ? "border-red-500"
                              : "border-gray-300 dark:border-gray-700"
                          }`}
                          placeholder="0.00"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                          <Fuel className="h-4 w-4" />
                        </div>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
                          L
                        </div>
                      </div>
                      {errors.quantity && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.quantity}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <span className="flex items-center gap-2">
                          <IndianRupee className="h-4 w-4" />
                          Cost (₹) *
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="cost"
                          value={formData.cost}
                          onChange={handleChange}
                          step="0.01"
                          min="0"
                          className={`w-full px-4 py-3 pl-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.cost
                              ? "border-red-500"
                              : "border-gray-300 dark:border-gray-700"
                          }`}
                          placeholder="0.00"
                        />
                        <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </div>
                      {errors.cost && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.cost}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Odometer Readings */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Odometer Readings
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">
                          Previous (km)
                        </label>
                        <input
                          type="number"
                          name="previousOdometer"
                          value={formData.previousOdometer}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">
                          Current (km) *
                        </label>
                        <input
                          type="number"
                          name="odometerReading"
                          value={formData.odometerReading}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.odometerReading
                              ? "border-red-500"
                              : "border-gray-300 dark:border-gray-700"
                          }`}
                          placeholder="0"
                        />
                        {errors.odometerReading && (
                          <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.odometerReading}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Info Section */}
              {expandedSection === "additional" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Date *
                        </span>
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.date
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-700"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <span className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Time
                        </span>
                      </label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <span className="flex items-center gap-2">
                          <Map className="h-4 w-4" />
                          Fuel Station *
                        </span>
                      </label>
                      <input
                        type="text"
                        name="station"
                        value={formData.station}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.station
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-700"
                        }`}
                        placeholder="e.g., Indian Oil, Mumbai"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <span className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Receipt Number *
                        </span>
                      </label>
                      <input
                        type="text"
                        name="receiptNumber"
                        value={formData.receiptNumber}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.receiptNumber
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-700"
                        }`}
                        placeholder="RCPT-0000"
                      />
                    </div>
                  </div>

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
                      placeholder="Any additional notes about this fuel purchase..."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between gap-4 pt-6 mt-6 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                {sections.map((section, idx) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setExpandedSection(section.id)}
                    className={`w-2 h-2 rounded-full ${
                      expandedSection === section.id
                        ? "bg-blue-500"
                        : "bg-gray-300 dark:bg-gray-700"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-5 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      {isEditing ? "Update Entry" : "Save Entry"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
