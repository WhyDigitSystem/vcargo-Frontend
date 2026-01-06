import {
  DirectionsRenderer,
  GoogleMap,
  TrafficLayer,
} from "@react-google-maps/api";
import { ArrowLeft, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import InputField from "../UI/InputField";
import CommonTable from "../common/CommonTable";
import { useNavigate } from "react-router-dom";
import { vehicleTypeAPI } from "../../api/vehicleType";
import { customerAPI } from "../../api/customerAPI";
import { routesAPI } from "../../api/routesAPI";
import { toast } from "../../utils/toast";
import SafeAutocomplete from "../common/SafeAutocomplete";
import { useGoogleMaps } from "../../hooks/useGoogleMaps";
import { useSelector } from "react-redux";

const PitstopAutocomplete = ({ value, onChange }) => {
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState(value || "");
  const { isLoaded } = useGoogleMaps();

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  const handlePlaceChanged = () => {
    if (inputRef.current) {
      const place = inputRef.current.getPlace();
      const address = place?.formatted_address || place?.name || "";
      setInputValue(address);
      onChange(address);
    }
  };

  return (
    <SafeAutocomplete
      onLoad={(autocomplete) => {
        inputRef.current = autocomplete;
      }}
      onPlaceChanged={handlePlaceChanged}
    >
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Search Pitstop..."
        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
      />
    </SafeAutocomplete>
  );
};

const RouteMaster = ({ setIsListView, editId }) => {
  const [form, setForm] = useState({
    status: "Active",
    origin: "",
    destination: "",
    vehicleType: "",
    mileage: "",
    fuelRate: "",
    kmPerLitre: "",
    showPumps: false,
    tatHours: "",
    routeDescription: "",
    branchCode: "",
    branch: "",
    orgId: "",
    customer: "",
    customerCode: "",
  });
  const userName = JSON.parse(localStorage.getItem("user"))?.name || "";
  const [errors, setErrors] = useState({});

  const [waypoints, setWaypoints] = useState([]);
  const [directions, setDirections] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pitstops, setPitstops] = useState([]);
  const [routeCalcs, setRouteCalcs] = useState([]);
  const [pumps, setPumps] = useState([]);
  const [customerNameList, setCustomerNameList] = useState([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [vehicleTypeList, setVehicleTypeList] = useState([]);
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const orgId = user.orgId;

  const originRef = useRef(null);
  const destinationRef = useRef(null);
  const vehicleRef = useRef(null);
  const customerRef = useRef(null);
   
  const navigate = useNavigate();
  const { isLoaded: mapsLoaded } = useGoogleMaps();

  useEffect(() => {
    getVehicleType();
    getCustomersName();
  }, []);

  useEffect(() => {
    if (editId) {
      getRouteById(editId);
    }
  }, [editId]);

  useEffect(() => {
    if (directions && pitstops.length > 0 && mapsLoaded) {
      const hasValidPitstops = pitstops.some(pitstop => pitstop.name && pitstop.name.trim() !== "");
      if (hasValidPitstops) {
        console.log("Pitstops changed, recalculating route...");
        setTimeout(() => {
          calcRoute();
        }, 300);
      }
    }
  }, [pitstops, mapsLoaded]);

  const filteredVehicleTypes = vehicleTypeList.filter((v) =>
    v.vehicleType?.toLowerCase().includes(vehicleSearch.toLowerCase())
  );

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle.vehicleType);
    setForm(prev => ({ ...prev, vehicleType: vehicle.vehicleType }));
    setShowVehicleDropdown(false);
  };

  const handleCreateNewVehicleType = () => {
    navigate("/vehicle-type");
  };

  useEffect(() => {
    const handler = (e) => {
      if (vehicleRef.current && !vehicleRef.current.contains(e.target)) {
        setShowVehicleDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredCustomers = customerNameList.filter((c) =>
    c.customername?.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer.customername);
    setForm((prev) => ({
      ...prev,
      customer: customer.customername,
      customerCode: customer.customercode
    }));
    setShowCustomerDropdown(false);
  };

  const handleCreateNewCustomer = () => {
    navigate("/customer");
  };

  useEffect(() => {
    const handler = (e) => {
      if (customerRef.current && !customerRef.current.contains(e.target)) {
        setShowCustomerDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const onFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const clearForm = () => {
    setForm({
      status: "Active",
      origin: "",
      destination: "",
      vehicleType: "",
      mileage: "",
      fuelRate: form.fuelRate,
      kmPerLitre: "",
      showPumps: false,
      tatHours: "",
      routeDescription: "",
      branchCode: "",
      branch: "",
      orgId: "",
      customer: "",
      customerCode: "",
    });

    setSelectedCustomer("");
    setCustomerSearch("");
    setSelectedVehicle("");
    setVehicleSearch("");

    setWaypoints([]);
    setPitstops([]);
    setRouteCalcs([]);
    setPumps([]);

    setDirections(null);
    setRouteInfo(null);

    if (originRef.current) originRef.current.value = "";
    if (destinationRef.current) destinationRef.current.value = "";
  };

  const calcRoute = async () => {
    const origin = originRef.current?.value || form.origin;
    const destination = destinationRef.current?.value || form.destination;

    if (!origin || !destination) {
      console.warn("Please enter both Origin and Destination!");
      toast.warning("Please enter both Origin and Destination!");
      return;
    }

    if (!mapsLoaded) {
      console.warn("Google Maps not loaded yet");
      toast.warning("Google Maps is still loading. Please try again.");
      return;
    }

    setIsCalculating(true);

    try {
      const directionsService = new window.google.maps.DirectionsService();

      const wp = pitstops
        .filter(pitstop => pitstop.name && pitstop.name.trim() !== "")
        .map((pitstop) => ({
          location: pitstop.name,
          stopover: true,
        }));

      console.log("Calculating route with:", { origin, destination, waypoints: wp });

      const result = await directionsService.route({
        origin,
        destination,
        waypoints: wp,
        travelMode: window.google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false,
      });

      setDirections(result);
      console.log("Route calculated successfully:", result);

      let totalDistance = 0;
      let totalDuration = 0;

      result.routes[0].legs.forEach(leg => {
        totalDistance += leg.distance.value;
        totalDuration += leg.duration.value;
      });

      const distanceKm = (totalDistance / 1000).toFixed(2);
      const durationHrs = (totalDuration / 3600).toFixed(2);

      const kmPerL = parseFloat(form.kmPerLitre) || 0;
      const fuelCost = kmPerL
        ? ((distanceKm / kmPerL) * (parseFloat(form.fuelRate) || 0)).toFixed(2)
        : 0;

      setRouteInfo({
        origin,
        destination,
        waypoints: wp.map((w) => w.location),
        distanceKm,
        durationHrs,
        fuelCost,
        tollCost: null,
      });

      setForm((prev) => ({
        ...prev,
        origin,
        destination,
        mileage: `${distanceKm} km`,
        tatHours: `${durationHrs} hrs`,
      }));

      setWaypoints(wp);
      toast.success("Route calculated successfully!");

    } catch (err) {
      console.error("Error fetching directions:", err);
    } finally {
      setIsCalculating(false);
    }
  };

  const getRouteById = async (id) => {
    try {
      setLoading(true);
      const response = await routesAPI.getRouteById(id);
      const data = response?.paramObjectsMap?.routesVO;

      if (!data) {
        toast.error("Route data not found");
        return;
      }

      setForm({
        id: data.id,
        status: data.active ? "Active" : "Inactive",
        origin: data.origin || "",
        destination: data.destination || "",
        vehicleType: data.vehicleType || "",
        kmPerLitre: data.mileage || "",
        fuelRate: data.fuelRate || "",
        showPumps: data.showpumps || false,
        tatHours: data.tat || "",
        routeDescription: data.route || "",
        branchCode: data.branchCode || "",
        branch: data.branchName || "",
        orgId: data.orgId || "",
        customer: data.customer || "",
        customerCode: data.customerCode || "",
      });

      const formattedPitstops = (data.routesPitStopVO || []).map((p) => ({
        id: p.id || Date.now() + Math.random(),
        name: p.pitShop || "",
        location: p.pitShop || "",
      }));
      setPitstops(formattedPitstops);

      const formattedPumps = (data.routesPetrolPumpsVO || []).map((p) => ({
        id: p.id,
        name: p.name,
        address: p.address,
        city: p.city,
        state: p.state,
        type: p.type,
      }));
      setPumps(formattedPumps);

      const formattedDetails = (data.routesDetailsVO || []).map((r) => ({
        id: r.id,
        name: r.name,
        distance: r.distance,
        noOfTolls: r.noOfTolls,
        tollCost: r.tollCost,
        fuelCost: r.fuelCost,
        totalCost: r.totalCost,
        savings: r.savings,
        duration: r.duration,
        isDefault: r.defaults,
      }));
      setRouteCalcs(formattedDetails);

      setSelectedCustomer(data.customer);
      setSelectedVehicle(data.vehicleType);

      if (originRef.current) originRef.current.value = data.origin || "";
      if (destinationRef.current) destinationRef.current.value = data.destination || "";

      console.log("Route data loaded, waiting for maps to load...");

      const checkMapsAndCalculate = () => {
        if (mapsLoaded && data.origin && data.destination) {
          console.log("Maps loaded, calculating route for edit...");
          setTimeout(() => {
            calcRoute();
          }, 1000);
        } else {
          setTimeout(checkMapsAndCalculate, 500);
        }
      };

      checkMapsAndCalculate();

    } catch (err) {
      console.error("Error fetching route:", err);
      toast.error("Failed to fetch route details!");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.customer?.trim()) {
      newErrors.customer = "Customer is required.";
    }

    if (!form.origin?.trim()) {
      newErrors.origin = "Origin is required.";
    }

    if (!form.destination?.trim()) {
      newErrors.destination = "Destination is required.";
    }

    if (
      form.origin?.trim() &&
      form.destination?.trim() &&
      form.origin.trim().toLowerCase() === form.destination.trim().toLowerCase()
    ) {
      newErrors.destination = "Origin & Destination cannot be the same.";
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
        active: form.status === "Active" ? true : false,
        branchCode: form.branchCode || "",
        branchName: form.branch || "",
        createdBy: userName || "",
        orgId: orgId,
        customer: form.customer || "",
        customerCode: form.customerCode || "",
        origin: form.origin || "",
        destination: form.destination || "",
        vehicleType: form.vehicleType || "",
        mileage: form.kmPerLitre || "",
        fuelRate: Number(form.fuelRate) || 0,
        tat: form.tatHours || "",
        route: `${form.origin} → ${form.destination}`,
        showpumps: form.showPumps === true,

        routesPitstopDTO: pitstops
          .filter(pitstop => pitstop.name && pitstop.name.trim() !== "")
          .map((p) => ({
            pitShop: p.name || ""
          })),

        routesDetailsDTO: routeCalcs.map((r) => ({
          defaults: r.isDefault || false,
          distance: Number(r.distance) || 0,
          duration: Number(r.duration) || 0,
          fuelCost: Number(r.fuelCost) || 0,
          name: r.name || "",
          noOfTolls: Number(r.noOfTolls) || 0,
          savings: Number(r.savings) || 0,
          tollCost: Number(r.tollCost) || 0,
          totalCost: Number(r.totalCost) || 0,
        })),

        routesPetrolPumpsDTO: pumps.map((p) => ({
          address: p.address || "",
          city: p.city || "",
          name: p.name || "",
          state: p.state || "",
          type: p.type || "",
        })),
      };

      console.log("Saving payload:", payload);

      if (form.id) {
        payload.id = form.id;
      }

      const response = await routesAPI.createUpdateRoutes(payload);

      if (response?.status === true) {
        toast.success(
          form.id
            ? "Route updated successfully!"
            : "Route created successfully!"
        );
        clearForm();
        setIsListView(true);
      } else {
        toast.error("Failed to save route!");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save route!");
    }
  };

  const getVehicleType = async () => {
    try {
      setLoading(true);
      const response = await vehicleTypeAPI.getVehicleType({ orgId });
      const data = response?.paramObjectsMap?.vehicleTypeVO || [];
      setVehicleTypeList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching vehicle types:", error);
      setVehicleTypeList([]);
    } finally {
      setLoading(false);
    }
  };

  const getCustomersName = async () => {
    try {
      setLoading(true);
      const response = await customerAPI.getCustomerName({ orgId });
      const data = response?.paramObjectsMap?.customerVO || [];
      setCustomerNameList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setCustomerNameList([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePitstopChange = (rowId, field, value) => {
    setPitstops(prev =>
      prev.map(row =>
        row.id === rowId ? { ...row, [field]: value } : row
      )
    );
  };

  const addPitstop = () => {
    setPitstops(prev => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        name: "",
        location: ""
      }
    ]);
  };

  const removePitstop = (id) => {
    setPitstops(prev => prev.filter(row => row.id !== id));
  };

  const handleOriginChange = (e) => {
    setForm(prev => ({ ...prev, origin: e.target.value }));
  };

  const handleDestinationChange = (e) => {
    setForm(prev => ({ ...prev, destination: e.target.value }));
  };

  const handleOriginPlaceChanged = () => {
    if (originRef.current) {
      const place = originRef.current.getPlace();
      const address = place?.formatted_address || place?.name || "";
      console.log('📍 Origin selected:', address);
      setForm(prev => ({ ...prev, origin: address }));
    }
  };

  const handleOriginLoad = (autocomplete) => {
    console.log('Origin Autocomplete loaded');
    originRef.current = autocomplete;
  };

  const handleDestinationPlaceChanged = () => {
    if (destinationRef.current) {
      const place = destinationRef.current.getPlace();
      const address = place?.formatted_address || place?.name || "";
      console.log('📍 Destination selected:', address);
      setForm(prev => ({ ...prev, destination: address }));
    }
  };

  const handleDestinationLoad = (autocomplete) => {
    console.log('Destination Autocomplete loaded');
    destinationRef.current = autocomplete;
  };

  return (
    <div className="max-w-7xl mx-auto mt-5 p-6 bg-white dark:bg-gray-900 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700">
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
            Route Master
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={clearForm}
          >
            Clear Form
          </button>
          <button
            onClick={handleSave}
            disabled={isCalculating}
            className="px-3 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCalculating ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <select
            name="status"
            value={form.status}
            onChange={onFormChange}
            className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white md:col-span-3">
          Customer
        </h2>

        <div className="relative md:col-span-1" ref={customerRef}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Customer <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={selectedCustomer || customerSearch}
            onChange={(e) => {
              setSelectedCustomer("");
              setCustomerSearch(e.target.value);
              setShowCustomerDropdown(true);
            }}
            onFocus={() => setShowCustomerDropdown(true)}
            placeholder="Search Customer..."
            className="w-full px-3 h-9 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
          {errors.customer && (
            <p className="text-xs text-red-500 mt-1">{errors.customer}</p>
          )}

          {showCustomerDropdown && (
            <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50">
              <div className="max-h-52 overflow-y-auto p-2">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((cust, index) => (
                    <div
                      key={index}
                      onClick={() => handleCustomerSelect(cust)}
                      className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                    >
                      <p className="font-medium text-gray-700 dark:text-gray-200">
                        {cust.customername}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 px-3 py-2">No customers found</p>
                )}
              </div>
              <button
                onClick={handleCreateNewCustomer}
                className="w-full flex items-center gap-2 px-3 py-2 border-t border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-800 rounded-b-xl text-sm"
              >
                <Plus className="h-4 w-4" />
                Add New Customer
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Routes
          </h2>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Origin
            </label>
            <SafeAutocomplete
              onLoad={handleOriginLoad}
              onPlaceChanged={handleOriginPlaceChanged}
            >
              <div className="w-full">
                <input
                  type="text"
                  ref={originRef}
                  placeholder="Enter Origin"
                  defaultValue={form.origin}
                  onChange={handleOriginChange}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                {errors.origin && (
                  <p className="text-xs text-red-500 mt-1">{errors.origin}</p>
                )}
              </div>
            </SafeAutocomplete>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Destination
            </label>
            <SafeAutocomplete
              onLoad={handleDestinationLoad}
              onPlaceChanged={handleDestinationPlaceChanged}
            >
              <div className="w-full">
                <input
                  type="text"
                  ref={destinationRef}
                  placeholder="Enter Destination"
                  defaultValue={form.destination}
                  onChange={handleDestinationChange}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                {errors.destination && (
                  <p className="text-xs text-red-500 mt-1">{errors.destination}</p>
                )}
              </div>
            </SafeAutocomplete>
          </div>

          <div className="relative" ref={vehicleRef}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Vehicle Type <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={selectedVehicle || vehicleSearch}
              onChange={(e) => {
                setSelectedVehicle("");
                setVehicleSearch(e.target.value);
                setShowVehicleDropdown(true);
              }}
              onFocus={() => setShowVehicleDropdown(true)}
              placeholder="Search Vehicle Type..."
              className="w-full px-3 h-9 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
            {showVehicleDropdown && (
              <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 p-2">
                {filteredVehicleTypes.length > 0 ? (
                  filteredVehicleTypes.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => handleVehicleSelect(v)}
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

          <InputField
            label="Fuel Rate (₹/L)"
            name="fuelRate"
            value={form.fuelRate}
            onChange={onFormChange}
            compact
          />
          <InputField
            label="Mileage"
            name="kmPerLitre"
            value={form.kmPerLitre}
            onChange={onFormChange}
            compact
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="showPumps"
              checked={form.showPumps}
              onChange={onFormChange}
              className="h-4 w-4 accent-blue-600"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Show Pumps
            </span>
          </div>

          <button
            onClick={calcRoute}
            disabled={isCalculating || !mapsLoaded}
            className="mt-2 px-3 py-2 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!mapsLoaded ? "Loading Maps..." : isCalculating ? "Calculating..." : "Calculate Route on Map"}
          </button>
        </div>

        <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          {routeInfo && (
            <div className="absolute top-3 left-3 z-10 bg-white/90 dark:bg-gray-800/80 backdrop-blur-md shadow-md rounded-lg px-4 py-2 text-sm">
              <div className="text-gray-800 dark:text-gray-100 font-medium mb-1">
                {routeInfo.origin} → {routeInfo.destination}
              </div>
              <div className="flex flex-wrap gap-4 text-gray-700 dark:text-gray-300 text-xs">
                <span>🛣️ {routeInfo.distanceKm} km</span>
                <span>⏱️ {routeInfo.durationHrs} hrs</span>
                <span>⛽ ₹{routeInfo.fuelCost} est.</span>
                {routeInfo.tollCost != null && (
                  <span>💳 ₹{routeInfo.tollCost} toll</span>
                )}
              </div>
            </div>
          )}

          {mapsLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: 360 }}
              center={directions ? undefined : { lat: 20.5937, lng: 78.9629 }}
              zoom={directions ? undefined : 5}
              onLoad={(m) => setMap(m)}
              options={{
                zoomControl: true,
                streetViewControl: true,
                mapTypeControl: true,
                fullscreenControl: true,
              }}
            >
              <TrafficLayer />
              {directions && (
                <DirectionsRenderer
                  directions={directions}
                  options={{
                    suppressMarkers: false,
                    polylineOptions: {
                      strokeColor: "#3b82f6",
                      strokeOpacity: 0.8,
                      strokeWeight: 5,
                    },
                  }}
                />
              )}
            </GoogleMap>
          ) : (
            <div className="w-full h-360 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <p className="text-gray-500 dark:text-gray-400">Loading Google Maps...</p>
            </div>
          )}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Pitstop Table
          </h3>
          <button
            onClick={addPitstop}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
          >
            <Plus className="h-4 w-4" />
            Add Pitstop
          </button>
        </div>

        {pitstops.length > 0 ? (
          <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold border-r border-gray-200 dark:border-gray-700">
                    #
                  </th>
                  <th className="px-4 py-3 text-left font-semibold border-r border-gray-200 dark:border-gray-700">
                    Pitstop Location
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                {pitstops.map((stop, index) => (
                  <tr key={stop.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3 border-r border-gray-200 dark:border-gray-700">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 border-r border-gray-200 dark:border-gray-700">
                      <PitstopAutocomplete
                        value={stop.name}
                        onChange={(value) => handlePitstopChange(stop.id, "name", value)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => removePitstop(stop.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">No pitstops added yet. Click "Add Pitstop" to add one.</p>
          </div>
        )}
      </div>

      <CommonTable
        title="Calculations"
        columns={[
          {
            key: "name",
            header: "Name",
            type: "text",
            placeholder: "Enter name",
          },
          {
            key: "distance",
            header: "Distance (km)",
            type: "number",
            width: 120,
          },
          { key: "tollCost", header: "Toll Cost", type: "number", width: 120 },
          { key: "fuelCost", header: "Fuel Cost", type: "number", width: 120 },
          {
            key: "totalCost",
            header: "Total Cost",
            type: "number",
            width: 120,
          },
          {
            key: "duration",
            header: "Duration (hrs)",
            type: "number",
            width: 140,
          },
          { key: "isDefault", header: "Default", type: "checkbox", width: 90 },
        ]}
        rows={routeCalcs}
        onRowsChange={setRouteCalcs}
        className="mb-8"
      />

      <CommonTable
        title="Petrol Pumps Table"
        columns={[
          { key: "name", header: "Pump Name", type: "text" },
          { key: "address", header: "Address", type: "text" },
          { key: "city", header: "City", type: "text", width: 140 },
          { key: "state", header: "State", type: "text", width: 140 },
          {
            key: "type",
            header: "Type",
            type: "select",
            width: 140,
            options: [
              { label: "Company Owned", value: "Company Owned" },
              { label: "Dealer", value: "Dealer" },
            ],
          },
        ]}
        rows={pumps}
        onRowsChange={setPumps}
        className="mb-8"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Route Description
          </label>
          <textarea
            name="routeDescription"
            value={form.routeDescription}
            onChange={onFormChange}
            rows={4}
            className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            placeholder="Describe the route..."
          />
        </div>
        <InputField
          label="TAT (in Hours)"
          name="tatHours"
          value={form.tatHours}
          onChange={onFormChange}
          compact
        />
      </div>
    </div>
  );
}

export default RouteMaster;