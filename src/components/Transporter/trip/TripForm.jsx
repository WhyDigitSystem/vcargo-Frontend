import {
  X,
  Save,
  Navigation,
  MapPin,
  Calendar,
  Car,
  User,
  Package,
  IndianRupee,
  Plus,
  Trash2,
  Hash,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import driverAPI from "../../../api/TdriverAPI";
import vehicleAPI from "../../../api/TvehicleAPI";
import { useSelector } from "react-redux";
import { Autocomplete } from "@react-google-maps/api";
import { useGoogleMaps } from "../../../hooks/useGoogleMaps";

export const TripForm = ({
  trip = null,
  customers = [],
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    customer: "",
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
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const { user } = useSelector((state) => state.auth);
  const orgId = user.orgId;

  const sourceRef = useRef(null);
  const destinationRef = useRef(null);

  const { isLoaded } = useGoogleMaps();

  useEffect(() => {
    const tripCost = parseFloat(formData.tripCost) || 0;
    const revenue = parseFloat(formData.revenue) || 0;
    const fuelCost = parseFloat(formData.fuelCost) || 0;
    const tollCharges = parseFloat(formData.tollCharges) || 0;
    const otherExpenses = parseFloat(formData.otherExpenses) || 0;
    const profit = revenue - (tripCost + fuelCost + tollCharges + otherExpenses);

    setFormData(prev => ({
      ...prev,
      profit: profit.toFixed(2)
    }));
  }, [formData.tripCost, formData.revenue, formData.fuelCost, formData.tollCharges, formData.otherExpenses]);

  useEffect(() => {
    if (!formData.startDate || !formData.startTime || !formData.estimatedDuration) return;

    const result = calculateEndDateTime(
      formData.startDate,
      formData.startTime,
      formData.estimatedDuration
    );

    if (!result) return;

    setFormData(prev => ({
      ...prev,
      endDate: result.endDate,
      endTime: `${result.endTime.hour}:${result.endTime.minute}`
    }));
  }, [formData.startDate, formData.startTime, formData.estimatedDuration]);

  useEffect(() => {
    const timer = setTimeout(() => {
      calculateRouteDetails();
    }, 600);

    return () => clearTimeout(timer);
  }, [formData.source, formData.destination, formData.waypoints]);

  useEffect(() => {
    calculateRouteDetails();
  }, [formData.source, formData.destination, formData.waypoints]);

  useEffect(() => {
    if (trip) {
      setFormData({
        customer: trip.customer || "",
        vehicleId: trip.vehicleId || "",
        driverId: trip.driverId || "",
        source: trip.source || "",
        destination: trip.destination || "",
        distance: trip.distance || "",
        estimatedDuration: trip.estimatedDuration || "",
        startDate: trip.startDate || new Date().toISOString().split("T")[0],
        startTime: trip.startTime || "",
        endDate: trip.endDate || "",
        endTime: trip.endTime || "",
        status: trip.status || "",
        tripType: trip.tripType || "",
        goodsType: trip.goodsType || "",
        goodsWeight: trip.goodsWeight || "",
        goodsValue: trip.goodsValue || "",
        tripCost: trip.tripCost || "",
        revenue: trip.revenue || "",
        profit: trip.profit || "",
        fuelCost: trip.fuelCost || "",
        tollCharges: trip.tollCharges || "",
        otherExpenses: trip.otherExpenses || "",
        notes: trip.notes || "",
        waypoints: trip.waypoints || [],
        documents: trip.documents || [],
      });
    }
  }, [trip]);

  useEffect(() => {
    loadDrivers();
    loadVehicles();
  }, []);

  const loadDrivers = async () => {
    try {
      const response = await driverAPI.getDrivers(1, 50, orgId);

      const activeDrivers = response.drivers.filter(
        (d) => d.status === "Active" || d.isActive === true
      );

      setDrivers(activeDrivers);
    } catch (error) {
      console.error("Error loading drivers:", error);
    }
  };

  const loadVehicles = async () => {
    try {
      const response = await vehicleAPI.getVehicles(1, 50, orgId);

      const activeVehicles = response.vehicles.filter(
        (v) => v.status === "ACTIVE" && v.cancel !== true
      );

      setVehicles(activeVehicles);
    } catch (error) {
      console.error("Error loading vehicles:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customer) newErrors.customer = "Customer is required";
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

    // Additional validation for freight trips
    if (formData.tripType === 'freight') {
      if (!formData.goodsType) newErrors.goodsType = "Goods type is required for freight trips";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const tripDataToSave = {
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
      customerName: customers.find(c => c.id === formData.customer)?.name || "",
      vehicleName: vehicles.find(v => v.id === formData.vehicleId)?.registrationNumber || "",
      driverName: parseInt(drivers.find(d => d.id === formData.driverId)?.name) || "",
      waypoints: formData.waypoints.map((wp, index) => ({
        location: wp.location,
        sequenceNo: index + 1
      })),
      documents: formData.documents || []
    };

    console.log("Trip data to save:", tripDataToSave);

    onSave(tripDataToSave);
  };

  const parseEstimatedDurationToMinutes = (duration = "") => {
    if (!duration) return 0;

    let totalMinutes = 0;
    const lower = duration.toLowerCase();

    const hourMatch = lower.match(/(\d+)\s*hour/);
    const minuteMatch = lower.match(/(\d+)\s*(min|minute)/);

    if (hourMatch) totalMinutes += parseInt(hourMatch[1], 10) * 60;
    if (minuteMatch) totalMinutes += parseInt(minuteMatch[1], 10);

    return totalMinutes;
  };

  const calculateEndDateTime = (startDate, startTime, estimatedDuration) => {
    if (!startDate || !startTime || !estimatedDuration) return null;

    const totalMinutes = parseEstimatedDurationToMinutes(estimatedDuration);

    const start = new Date(`${startDate}T${startTime}:00`);
    const end = new Date(start.getTime() + totalMinutes * 60 * 1000);

    return {
      endDate: end.toISOString().split("T")[0],
      endTime: {
        hour: String(end.getHours()).padStart(2, "0"),
        minute: String(end.getMinutes()).padStart(2, "0"),
        second: "00",
        nano: 0,
      },
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const addWaypoint = () => {
    const value = newWaypoint.trim();
    if (!value) return;

    setFormData((prev) => ({
      ...prev,
      waypoints: [
        ...prev.waypoints,
        { location: value }
      ]
    }));

    setNewWaypoint(""); // reset input
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

  const LocationAutocomplete = ({
    value,
    onChange,
    placeholder,
    inputRef,
    className = "",
    onKeyPress,
  }) => {
    const [inputValue, setInputValue] = useState(value || "");
    const autocompleteRef = useRef(null);

    useEffect(() => {
      setInputValue(value || "");
    }, [value]);

    if (!isLoaded) {
      return (
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            onChange(e.target.value);
          }}
          onKeyPress={onKeyPress}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-xl
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-gray-100
          border border-gray-300 dark:border-gray-700
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${className}`}
        />
      );
    }

    return (
      <Autocomplete
        onLoad={(auto) => {
          autocompleteRef.current = auto;
          if (inputRef) inputRef.current = auto;
        }}
        onPlaceChanged={() => {
          if (!autocompleteRef.current) return;

          const place = autocompleteRef.current.getPlace();

          const placeName = place?.name || "";
          const formattedAddress = place?.formatted_address || "";

          let fullLocation = "";

          if (placeName && formattedAddress) {
            if (!formattedAddress.toLowerCase().includes(placeName.toLowerCase())) {
              fullLocation = `${placeName}, ${formattedAddress}`;
            } else {
              fullLocation = formattedAddress;
            }
          } else {
            fullLocation = placeName || formattedAddress;
          }

          if (fullLocation) {
            setInputValue(fullLocation);
            onChange(fullLocation);
          }
        }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            const newValue = e.target.value;
            setInputValue(newValue);
          }}
          onKeyPress={onKeyPress}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-xl
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-gray-100
          border border-gray-300 dark:border-gray-700
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${className}`}
        />
      </Autocomplete>
    );
  };

  const calculateRouteDetails = async () => {
    if (!isLoaded || !formData.source || !formData.destination) return;

    const directionsService = new window.google.maps.DirectionsService();

    const waypoints = formData.waypoints.map((w) => ({
      location: w.location,
      stopover: true,
    }));

    try {
      const result = await directionsService.route({
        origin: formData.source,
        destination: formData.destination,
        waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });

      const legs = result.routes[0].legs;

      let totalDistanceMeters = 0;
      let totalDurationSeconds = 0;

      legs.forEach((leg) => {
        totalDistanceMeters += leg.distance.value;   // meters
        totalDurationSeconds += leg.duration.value;  // seconds
      });

      const totalDistanceKm = Math.round(totalDistanceMeters / 1000);

      const hours = Math.floor(totalDurationSeconds / 3600);
      const minutes = Math.round((totalDurationSeconds % 3600) / 60);

      const formattedDuration =
        hours > 0 ? `${hours} hours ${minutes} mins` : `${minutes} mins`;

      setFormData((prev) => ({
        ...prev,
        distance: totalDistanceKm,
        estimatedDuration: formattedDuration,
      }));
    } catch (err) {
      console.error("Route calculation failed:", err);
    }
  };

  return (
    <div className="relative w-full max-w-6xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-2 pl-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <Navigation className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {trip ? "Edit Trip" : "Create New Trip"}
              </h2>
              <p className="text-blue-100 text-xs">
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
          <div className="space-y-6">

            {/* ================= ROW 1 ================= */}
            <div className="space-y-6">

              {/* ===== Header Row ===== */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* -------- Customer -------- */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Details
                  </h3>

                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Customer *
                  </label>
                  <input
                    type="text"
                    name="customer"
                    value={formData.customer}
                    onChange={handleChange}
                    placeholder="Enter Customer"
                    className={`w-full px-4 py-3 rounded-xl
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-gray-100
          border focus:outline-none focus:ring-2 focus:ring-blue-500
          ${errors.customer ? "border-red-500" : "border-gray-300 dark:border-gray-700"}
        `}
                  />
                </div>

                {/* -------- Vehicle -------- */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Vehicle
                  </h3>

                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Vehicle *
                  </label>
                  <select
                    name="vehicleId"
                    value={formData.vehicleId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Vehicle</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.vehicleNumber} - {v.year} {v.model}
                      </option>
                    ))}
                  </select>
                </div>

                {/* -------- Driver -------- */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Driver
                  </h3>

                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Driver *
                  </label>
                  <select
                    name="driverId"
                    value={formData.driverId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Driver</option>
                    {drivers.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name} - {d.licenseNumber}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Trip Type
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {tripTypeOptions.map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, tripType: type.id }))}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center dark:text-gray-300 transition-all
                      ${formData.tripType === type.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-400"
                      }
                    `}
                  >
                    <span className="text-xl mb-2">{type.icon}</span>
                    <span className="text-sm font-medium">{type.name}</span>
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
                <LocationAutocomplete
                  inputRef={sourceRef}
                  value={formData.source}
                  placeholder="e.g., Mumbai, Maharashtra"
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, source: val }))
                  }
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.source ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                    }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Destination *
                </label>
                <LocationAutocomplete
                  inputRef={destinationRef}
                  value={formData.destination}
                  placeholder="e.g., Pune, Maharashtra"
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, destination: val }))
                  }
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.destination ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                    }`}
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
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.distance ? "border-red-500" : "border-gray-300 dark:border-gray-700"
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

              <div className="mb-3 space-y-3">
                <LocationAutocomplete
                  value={newWaypoint}
                  placeholder="Search waypoint..."
                  onChange={setNewWaypoint}
                />
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
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.startDate ? "border-red-500" : "border-gray-300 dark:border-gray-700"
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
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.startTime ? "border-red-500" : "border-gray-300 dark:border-gray-700"
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
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.estimatedDuration ? "border-red-500" : "border-gray-300 dark:border-gray-700"
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
            </div>

            {/* Expense Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Profit (₹)
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <input
                    type="number"
                    name="profit"
                    disabled
                    value={formData.profit}
                    readOnly
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Documents */}
          {/* <div className="space-y-4">
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
          </div> */}

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