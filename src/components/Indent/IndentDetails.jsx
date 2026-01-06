import { useEffect, useState, useRef } from "react";
import InputField from "../UI/InputField";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { customerAPI } from "../../api/customerAPI";
import { routesAPI } from "../../api/routesAPI";
import { vehicleTypeAPI } from "../../api/vehicleType";
import { customerRateAPI } from "../../api/customerRateAPI";
import { vendorRateAPI } from "../../api/vendorRateAPI";

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

const IndentDetailsTab = ({ formData, onFormChange, setFormData, pitstops, setPitstops, errors = {} }) => {
  // const [pitstops, setPitstops] = useState([]);
  const [customerNameList, setCustomerNameList] = useState([]);
  const [routeList, setRouteList] = useState([]);
  const [vehicleTypeList, setVehicleTypeList] = useState([]);
  const [customerRateList, setCustomerRateList] = useState([]);
  const [vendorRateList, setVendorRateList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  const [vehicleTypeSearch, setVehicleTypeSearch] = useState("");
  const [selectedVehicleType, setSelectedVehicleType] = useState("");
  const [showVehicleTypeDropdown, setShowVehicleTypeDropdown] = useState(false);

  const [routeSearch, setRouteSearch] = useState("");
  const [showRouteDropdown, setShowRouteDropdown] = useState(false);

  const [customerRateSearch, setCustomerRateSearch] = useState("");
  const [showCustomerRateDropdown, setShowCustomerRateDropdown] = useState(false);

  const [vendorRateSearch, setVendorRateSearch] = useState("");
  const [showVendorRateDropdown, setShowVendorRateDropdown] = useState(false);

  const originRef = useRef(null);
  const destinationRef = useRef(null);
  const customerRef = useRef(null);
  const routeRef = useRef(null);
  const vehicleTypeRef = useRef(null);
  const customerRateRef = useRef(null);
  const vendorRateRef = useRef(null);
   

  const { user } = useSelector((state) => state.auth);
  const orgId = user.orgId;

  const navigate = useNavigate();
  const { isLoaded } = useGoogleMaps();

  useEffect(() => {
    if (originRef.current && formData.origin) {
      originRef.current.value = formData.origin;
    }
    if (destinationRef.current && formData.destination) {
      destinationRef.current.value = formData.destination;
    }

    // Update local states when formData changes
    if (formData.customer) {
      setSelectedCustomer(formData.customer);
    }
    if (formData.vechicleType) {
      setSelectedVehicleType(formData.vechicleType);
    }
  }, [formData.origin, formData.destination, formData.customer, formData.vechicleType]);

  useEffect(() => {
    getCustomersName();
    getRouteList();
    getVehicleType();
    getCustomerRate();
    getVendorRate();
  }, []);

  useEffect(() => {
    if (formData.pitstops && Array.isArray(formData.pitstops)) {
      setPitstops(formData.pitstops);
    }
  }, [formData.pitstops]);

  const filteredCustomers = customerNameList.filter((c) =>
    c.customername?.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer.customername);
    setCustomerSearch("");
    onFormChange("customer", customer.customername);
    onFormChange("customerCode", customer.customercode);
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

  const filteredRoute = routeList.filter((r) =>
    (r.origin + "-" + r.destination).toLowerCase().includes(routeSearch.toLowerCase())
  );

  const handleRouteSelect = (route) => {
    const routeName = `${route.origin} - ${route.destination}`;

    setFormData((prev) => ({
      ...prev,
      route: routeName,
      origin: route.origin,
      destination: route.destination,
    }));

    if (originRef.current) originRef.current.value = route.origin;
    if (destinationRef.current) destinationRef.current.value = route.destination;

    setRouteSearch("");
    setShowRouteDropdown(false);
  };

  const handleCreateNewRoute = () => {
    navigate("/route");
  };

  useEffect(() => {
    const handler = (e) => {
      if (routeRef.current && !routeRef.current.contains(e.target)) {
        setShowRouteDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredVehicleTypes = vehicleTypeList.filter((v) =>
    v.vehicleType?.toLowerCase().includes(vehicleTypeSearch.toLowerCase())
  );

  const handleVehicleTypeSelect = (vehicle) => {
    setSelectedVehicleType(vehicle.vehicleType);
    setVehicleTypeSearch("");
    onFormChange("vechicleType", vehicle.vehicleType);
    setShowVehicleTypeDropdown(false);
  };

  const handleVehicleTypeInputChange = (e) => {
    onFormChange("vechicleType", e.target.value);
    setVehicleTypeSearch(e.target.value);
    setShowVehicleTypeDropdown(true);
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

  const filteredCustomerRate = customerRateList.filter((c) =>
    (c.rate + "-" + c.rate).toLowerCase().includes(customerRateSearch.toLowerCase())
  );

  const handleCustomerRateSelect = (customerRate) => {
    onFormChange("customerRate", customerRate.rate);
    setCustomerRateSearch("");
    setShowCustomerRateDropdown(false);
  };

  const handleCustomerRateInputChange = (e) => {
    onFormChange("customerRate", e.target.value);
    setCustomerRateSearch(e.target.value);
  };

  const handleCreateNewCustomerRate = () => {
    navigate("/customer-rate");
  };

  useEffect(() => {
    const handler = (e) => {
      if (customerRateRef.current && !customerRateRef.current.contains(e.target)) {
        setShowCustomerRateDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredVendorRate = vendorRateList.filter((v) =>
    (v.rate + "-" + v.rate).toLowerCase().includes(vendorRateSearch.toLowerCase())
  );

  const handleVendorRateSelect = (vendorRate) => {
    onFormChange("vendorRateVehicles", vendorRate.rate);
    setVendorRateSearch("");
    setShowVendorRateDropdown(false);
  };

  const handleVendorRateInputChange = (e) => {
    onFormChange("vendorRateVehicles", e.target.value);
    setVendorRateSearch(e.target.value);
  };

  const handleCreateNewVendorRate = () => {
    navigate("/vendor-rate");
  };

  useEffect(() => {
    const handler = (e) => {
      if (vendorRateRef.current && !vendorRateRef.current.contains(e.target)) {
        setShowVendorRateDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    onFormChange(name, type === "checkbox" ? checked : value);
  };

  const handleAddPitstop = () => {
    const newPitstop = {
      id: Date.now(),
      location: "",
      sequence: pitstops.length + 1
    };
    const updatedPitstops = [...pitstops, newPitstop];
    setPitstops(updatedPitstops);
  };

  const handlePitstopChange = (id, location) => {
    const updatedPitstops = pitstops.map((p) =>
      p.id === id ? { ...p, location } : p
    );
    setPitstops(updatedPitstops);
  };

  const removePitstop = (id) => {
    const updatedPitstops = pitstops.filter(row => row.id !== id);
    // Re-sequence the pitstops
    const resequencedPitstops = updatedPitstops.map((pitstop, index) => ({
      ...pitstop,
      sequence: index + 1
    }));
    setPitstops(resequencedPitstops);
  };

  // Handle Google Places Autocomplete for Origin
  const handleOriginPlaceChanged = () => {
    if (originRef.current) {
      const place = originRef.current.getPlace();
      const address = place?.formatted_address || place?.name || "";
      console.log('📍 Origin selected:', address);
      onFormChange("origin", address);
    }
  };

  const handleOriginLoad = (autocomplete) => {
    console.log('✅ Origin Autocomplete loaded');
    originRef.current = autocomplete;
  };

  // Handle Google Places Autocomplete for Destination
  const handleDestinationPlaceChanged = () => {
    if (destinationRef.current) {
      const place = destinationRef.current.getPlace();
      const address = place?.formatted_address || place?.name || "";
      console.log('📍 Destination selected:', address);
      onFormChange("destination", address);
    }
  };

  const handleDestinationLoad = (autocomplete) => {
    console.log('✅ Destination Autocomplete loaded');
    destinationRef.current = autocomplete;
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

  const getRouteList = async () => {
    try {
      setLoading(true);
      const response = await routesAPI.getRouteList({ orgId });
      const data = response?.paramObjectsMap?.routesVO || [];
      setRouteList(data);
    } catch (error) {
      console.error("Error fetching Route list:", error);
      setRouteList([]);
    } finally {
      setLoading(false);
    }
  };

  const getVehicleType = async () => {
    try {
      setLoading(true);
      const response = await vehicleTypeAPI.getVehicleType({ orgId });
      console.log('Vehicle Type API Response:', response);
      const data = response?.paramObjectsMap?.vehicleTypeVO || [];
      if (Array.isArray(data)) {
        setVehicleTypeList(data);
      } else {
        setVehicleTypeList([]);
      }
    } catch (error) {
      console.error("Error fetching vehicle types:", error);
      setVehicleTypeList([]);
    } finally {
      setLoading(false);
    }
  };

  const getCustomerRate = async () => {
    try {
      setLoading(true);
      const response = await customerRateAPI.getCustomerRate({ orgId });
      console.log('Customer Rate API Response:', response);
      const data = response?.paramObjectsMap?.customerRateVO || [];
      if (Array.isArray(data)) {
        setCustomerRateList(data);
      } else {
        setCustomerRateList([]);
      }
    } catch (error) {
      console.error("Error fetching customer rates:", error);
      setCustomerRateList([]);
    } finally {
      setLoading(false);
    }
  };

  const getVendorRate = async () => {
    try {
      setLoading(true);
      const response = await vendorRateAPI.getVendorRate({ orgId });
      console.log('Vendor Rate API Response:', response);
      const data = response?.paramObjectsMap?.vendorRateVO || [];
      if (Array.isArray(data)) {
        setVendorRateList(data);
      } else {
        setVendorRateList([]);
      }
    } catch (error) {
      console.error("Error fetching vendor rates:", error);
      setVendorRateList([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ---- STATUS SECTION ---- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleInputChange}
        />

        <InputField
          label="Created At"
          name="createdAt"
          value={formData.createdAt || new Date().toLocaleString()}
          onChange={handleInputChange}
          disabled
        />
      </div>

      {/* ---- CUSTOMER SECTION ---- */}
      <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="relative" ref={customerRef}>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Customer <span className="text-red-500">*</span>
            </label>

            {/* INPUT BOX */}
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

            {/* DROPDOWN */}
            {showCustomerDropdown && (
              <div className="absolute left-0 right-0 mt-2 rounded-xl shadow-xl border z-50 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
                {/* Scroll container */}
                <div className="max-h-52 overflow-y-auto p-2">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((cust, index) => (
                      <div
                        key={index}
                        onClick={() => handleCustomerSelect(cust)}
                        className="px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        {cust.customername}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 px-3 py-2">
                      No customers found
                    </p>
                  )}
                </div>

                {/* Add New Customer Button */}
                <button
                  onClick={handleCreateNewCustomer}
                  className="w-full flex items-center gap-2 px-3 py-2 border-t text-blue-600 dark:text-blue-400 bg-gray-50 dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700"
                >
                  <Plus className="h-4 w-4" />
                  Add New Customer
                </button>
              </div>
            )}
          </div>
          <div className="relative" ref={routeRef}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Route
            </label>

            <input
              type="text"
              value={routeSearch || formData.route}
              onChange={(e) => {
                setRouteSearch(e.target.value);
                setShowRouteDropdown(true);
              }}
              onFocus={() => setShowRouteDropdown(true)}
              placeholder="Search Route..."
              className="w-full px-3 h-9 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />

            {showRouteDropdown && (
              <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                <div className="max-h-52 overflow-y-auto p-2">
                  {filteredRoute.length > 0 ? (
                    filteredRoute.map((r, index) => (
                      <div
                        key={index}
                        onClick={() => handleRouteSelect(r)}
                        className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                      >
                        <p className="font-medium text-gray-700 dark:text-gray-200">
                          {r.origin} - {r.destination}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 px-3 py-2">
                      No routes found
                    </p>
                  )}
                </div>

                <button
                  onClick={handleCreateNewRoute}
                  className="w-full flex items-center gap-2 px-3 py-2 border-t border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-800 rounded-b-xl text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Add New Route
                </button>
              </div>
            )}
          </div>
          {/* ORIGIN */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Origin <span className="text-red-500">*</span>
            </label>
            <SafeAutocomplete
              onLoad={handleOriginLoad}
              onPlaceChanged={handleOriginPlaceChanged}
            >
              <div className="w-full">
                <input
                  type="text"
                  defaultValue={formData.origin}
                  placeholder="Enter Origin"
                  className="w-full mt-1 h-9 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  onBlur={(e) => {
                    // Update form data on blur as fallback
                    if (e.target.value !== formData.origin) {
                      onFormChange("origin", e.target.value);
                    }
                  }}
                />
                {errors.origin && (
                  <p className="text-xs text-red-500 mt-1">{errors.origin}</p>
                )}
              </div>
            </SafeAutocomplete>
          </div>

          {/* DESTINATION */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Destination <span className="text-red-500">*</span>
            </label>
            <SafeAutocomplete
              onLoad={handleDestinationLoad}
              onPlaceChanged={handleDestinationPlaceChanged}
            >
              <div className="w-full">
                <input
                  type="text"
                  defaultValue={formData.destination}
                  placeholder="Enter Destination"
                  className="w-full mt-1 h-9 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  onBlur={(e) => {
                    // Update form data on blur as fallback
                    if (e.target.value !== formData.destination) {
                      onFormChange("destination", e.target.value);
                    }
                  }}
                />
                {errors.destination && (
                  <p className="text-xs text-red-500 mt-1">{errors.destination}</p>
                )}
              </div>
            </SafeAutocomplete>
          </div>
          {/* VEHICLE TYPE */}
          <div className="relative" ref={vehicleTypeRef}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Vehicle Type <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              value={selectedVehicleType || vehicleTypeSearch || formData.vechicleType}
              onChange={handleVehicleTypeInputChange}
              onFocus={() => setShowVehicleTypeDropdown(true)}
              placeholder="Search Vehicle Type..."
              className="w-full px-3 h-9 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
            {errors.vechicleType && (
              <p className="text-xs text-red-500 mt-1">{errors.vechicleType}</p>
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

          <InputField
            label="Weight (Ton)"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            placeholder="Enter weight in tons"
            type="number"
          />
        </div>

        {/* Add Pitstop */}
        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            name="addPitstop"
            checked={formData.addPitstop}
            onChange={handleInputChange}
            className="h-4 w-4 accent-blue-600"
          />
          <label className="text-sm text-gray-700 dark:text-gray-300">
            Add Pitstop
          </label>
        </div>

        {formData.addPitstop && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Pitstops
              </h4>
              <button
                onClick={handleAddPitstop}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                            value={stop.location}
                            onChange={(value) => handlePitstopChange(stop.id, value)}
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
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <p>No pitstops added yet. Click "Add Pitstop" to add one.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Rates Section ── */}
      <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
          Rates
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label="Number of Vehicles"
            name="numberOfVehicles"
            value={formData.numberOfVehicles}
            onChange={handleInputChange}
            type="number"
          />

          {/* CUSTOMER RATE */}
          <div className="relative" ref={customerRateRef}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Customer Rate <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              value={customerRateSearch || formData.customerRate}
              onChange={handleCustomerRateInputChange}
              onFocus={() => setShowCustomerRateDropdown(true)}
              placeholder="Search Customer Rate..."
              className="w-full px-3 h-9 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
            {errors.customerRate && (
              <p className="text-xs text-red-500 mt-1">{errors.customerRate}</p>
            )}

            {showCustomerRateDropdown && (
              <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                <div className="max-h-52 overflow-y-auto p-2">
                  {filteredCustomerRate.length > 0 ? (
                    filteredCustomerRate.map((cust, index) => (
                      <div
                        key={index}
                        onClick={() => handleCustomerRateSelect(cust)}
                        className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                      >
                        <p className="font-medium text-gray-700 dark:text-gray-200">
                          {cust.rate}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 px-3 py-2">
                      No customer rate found
                    </p>
                  )}
                </div>

                <button
                  onClick={handleCreateNewCustomerRate}
                  className="w-full flex items-center gap-2 px-3 py-2 border-t border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-800 rounded-b-xl text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Add New Customer Rate
                </button>
              </div>
            )}
          </div>

          {/* VENDOR RATE */}
          <div className="relative" ref={vendorRateRef}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Vendor Rate per Vehicle <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              value={vendorRateSearch || formData.vendorRateVehicles}
              onChange={handleVendorRateInputChange}
              onFocus={() => setShowVendorRateDropdown(true)}
              placeholder="Search Vendor Rate..."
              className="w-full px-3 h-9 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
            {errors.vendorRateVehicles && (
              <p className="text-xs text-red-500 mt-1">{errors.vendorRateVehicles}</p>
            )}

            {showVendorRateDropdown && (
              <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                <div className="max-h-52 overflow-y-auto p-2">
                  {filteredVendorRate.length > 0 ? (
                    filteredVendorRate.map((ven, index) => (
                      <div
                        key={index}
                        onClick={() => handleVendorRateSelect(ven)}
                        className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                      >
                        <p className="font-medium text-gray-700 dark:text-gray-200">
                          {ven.rate}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 px-3 py-2">
                      No Vendor rate found
                    </p>
                  )}
                </div>

                <button
                  onClick={handleCreateNewVendorRate}
                  className="w-full flex items-center gap-2 px-3 py-2 border-t border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-800 rounded-b-xl text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Add New Vendor Rate
                </button>
              </div>
            )}
          </div>

          <InputField
            label="Extra Info"
            name="extraInfo"
            value={formData.extraInfo}
            onChange={handleInputChange}
            placeholder="Add notes or remarks"
          />

          <InputField
            label="Placement Date"
            name="placementDate"
            value={formData.placementDate}
            onChange={handleInputChange}
            type="date"
          />
        </div>
      </div>
    </div>
  );
};

export default IndentDetailsTab;