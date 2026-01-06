import { Autocomplete, DirectionsRenderer, GoogleMap } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import InputField from "../UI/InputField";
import { useNavigate } from "react-router-dom";
import { customerAPI } from "../../api/customerAPI";
import { Plus } from "lucide-react";
import { vendorAPI } from "../../api/vendorAPI";
import { routesAPI } from "../../api/routesAPI";
import { useGoogleMaps } from "../../hooks/useGoogleMaps";
import { toast } from "../../utils/toast";
import { useSelector } from "react-redux";

// PitstopAutocomplete Component
const PitstopAutocomplete = ({ value, onChange }) => {
    const inputRef = useRef(null);
    const [inputValue, setInputValue] = useState(value || "");
    const { isLoaded } = useGoogleMaps();

    // Update local state when value prop changes (for edit mode)
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

    if (!isLoaded) {
        return (
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Search Pitstop..."
                className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
        );
    }

    return (
        <Autocomplete
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
        </Autocomplete>
    );
};

const BasicDetailsTab = ({
    form,
    setForm,
    handleChange,
    pitstops,
    setPitstops,
    directions,
    setDirections,
    clearCounter,
    errors = {}
}) => {
    const navigate = useNavigate();
    const originRef = useRef(null);
    const destinationRef = useRef(null);
    const customerRef = useRef(null);
    const vendorRef = useRef(null);
    const routeRef = useRef(null);

    const [customerSearch, setCustomerSearch] = useState("");
    const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

    const [vendorSearch, setVendorSearch] = useState("");
    const [showVendorDropdown, setShowVendorDropdown] = useState(false);

    const [routeSearch, setRouteSearch] = useState("");
    const [showRouteDropdown, setShowRouteDropdown] = useState(false);

    const userName = JSON.parse(localStorage.getItem("user"))?.name || "";
    const [customerNameList, setCustomerNameList] = useState([]);
    const [VendorList, setVendorList] = useState([]);
    const [routeList, setRouteList] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isLoaded } = useGoogleMaps();

    const { user } = useSelector((state) => state.auth);
    const orgId = user.orgId;

     

    useEffect(() => {
        getCustomersName();
        getVendorName();
        getRouteList();
    }, []);

    useEffect(() => {
        setCustomerSearch("");
        setVendorSearch("");
        setRouteSearch("");

        if (originRef.current && !form.origin) originRef.current.value = "";
        if (destinationRef.current && !form.destination) destinationRef.current.value = "";
    }, [clearCounter]);

    // Sync origin & destination when switching tabs or editing
    useEffect(() => {
        if (originRef.current) originRef.current.value = form.origin || "";
        if (destinationRef.current) destinationRef.current.value = form.destination || "";
    }, [form.origin, form.destination]);

    const filteredCustomers = customerNameList.filter((c) =>
        c.customername?.toLowerCase().includes(customerSearch.toLowerCase())
    );

    const handleCustomerSelect = (customer) => {
        setForm((prev) => ({
            ...prev,
            customer: customer.customername,
            customerCode: customer.customercode
        }));
        setCustomerSearch("");
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

    const filteredVendor = VendorList.filter((v) =>
        v.organization?.toLowerCase().includes(vendorSearch.toLowerCase())
    );

    const handleVendorSelect = (vendor) => {
        setForm((prev) => ({
            ...prev,
            vendor: vendor.organization,
            vendorCode: vendor.vendorCode
        }));
        setVendorSearch("");
        setShowVendorDropdown(false);
    };

    const handleCreateNewVendor = () => {
        navigate("/vendor");
    };

    useEffect(() => {
        const handler = (e) => {
            if (vendorRef.current && !vendorRef.current.contains(e.target)) {
                setShowVendorDropdown(false);
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

        setForm((prev) => ({
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

    const addPitstop = () => {
        setPitstops((prev) => [...prev, {
            id: Date.now() + Math.random(), // Better ID generation
            name: ""
        }]);
    };

    const handlePitstopChange = (id, value) => {
        setPitstops((prev) =>
            prev.map((row) => (row.id === id ? { ...row, name: value } : row))
        );
    };

    const removePitstop = (id) => {
        setPitstops((prev) => prev.filter((row) => row.id !== id));
    };

    const calcRoute = async () => {
        if (!isLoaded) {
            toast.error("Google Maps is still loading. Please try again in a moment.");
            return;
        }

        if (!originRef.current?.value || !destinationRef.current?.value) {
            alert("Please enter both Origin and Destination!");
            return;
        }

        const directionsService = new window.google.maps.DirectionsService();

        const waypoints =
            pitstops.length > 0
                ? pitstops.map((p) => ({
                    location: p.name,
                    stopover: true,
                }))
                : [];

        try {
            const result = await directionsService.route({
                origin: originRef.current.value,
                destination: destinationRef.current.value,
                waypoints,
                travelMode: window.google.maps.TravelMode.DRIVING,
            });

            setDirections(result);
        } catch (error) {
            console.error("Error calculating route:", error);
            toast.error("Failed to calculate route. Please check your locations.");
        }
    };

    const getVendorName = async () => {
        try {
            setLoading(true);

            const response = await vendorAPI.getVendorName({ orgId });
            console.log('API Response:', response);

            const data = response?.paramObjectsMap?.vendorVO || [];

            if (Array.isArray(data)) {
                setVendorList(data);
            } else {
                setVendorList([]);
            }

        } catch (error) {
            console.error("Error fetching Vendor:", error);
            setVendorList([]);
        } finally {
            setLoading(false);
        }
    };

    const getCustomersName = async () => {
        try {
            setLoading(true);

            const response = await customerAPI.getCustomerName({ orgId });
            console.log('API Response:', response);

            const data = response?.paramObjectsMap?.customerVO || [];

            if (Array.isArray(data)) {
                setCustomerNameList(data);
            } else {
                setCustomerNameList([]);
            }

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

    // Render Google Map only when loaded
    const renderMap = () => {
        if (!isLoaded) {
            return (
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 relative h-80 flex items-center justify-center">
                    <div className="text-gray-500">Loading map...</div>
                </div>
            );
        }

        return (
            <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 relative">
                {directions && (
                    <div className="absolute top-2 left-2 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg shadow text-xs text-gray-800 dark:text-gray-200 z-10">
                        <strong>
                            {directions.routes[0].legs[0].distance.text}
                        </strong>{" "}
                        • {directions.routes[0].legs[0].duration.text}
                    </div>
                )}
                <GoogleMap
                    mapContainerStyle={{ width: "100%", height: 320 }}
                    center={{ lat: 20.5937, lng: 78.9629 }}
                    zoom={5}
                >
                    {directions && <DirectionsRenderer directions={directions} />}
                </GoogleMap>
            </div>
        );
    };

    // Render Autocomplete inputs
    const renderAutocompleteInput = (ref, placeholder, value, onChange) => {
        if (!isLoaded) {
            return (
                <input
                    ref={ref}
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
            );
        }

        return (
            <Autocomplete>
                <input
                    ref={ref}
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
            </Autocomplete>
        );
    };

    return (
        <div className="p-6 space-y-6">
            {/* Vendor and Customer */}
            <div>
                <h2 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Vendor and Customer
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="relative" ref={vendorRef}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Vendor <span className="text-red-500">*</span>
                        </label>

                        <input
                            type="text"
                            value={vendorSearch || form.vendor}
                            onChange={(e) => {
                                setVendorSearch(e.target.value);
                                setShowVendorDropdown(true);
                            }}
                            onFocus={() => setShowVendorDropdown(true)}
                            placeholder="Search Vendor..."
                            className="w-full px-3 h-9 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.vendor && <p className="text-xs text-red-500 mt-1">{errors.vendor}</p>}

                        {showVendorDropdown && (
                            <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                                <div className="max-h-52 overflow-y-auto p-2">
                                    {filteredVendor.length > 0 ? (
                                        filteredVendor.map((ven, index) => (
                                            <div
                                                key={index}
                                                onClick={() => handleVendorSelect(ven)}
                                                className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                                            >
                                                <p className="font-medium text-gray-700 dark:text-gray-200">
                                                    {ven.organization}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 px-3 py-2">
                                            No Vendor found
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={handleCreateNewVendor}
                                    className="w-full flex items-center gap-2 px-3 py-2 border-t border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-800 rounded-b-xl text-sm"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add New Vendor
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="relative" ref={customerRef}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Customer <span className="text-red-500">*</span>
                        </label>

                        <input
                            type="text"
                            value={customerSearch || form.customer}
                            onChange={(e) => {
                                setCustomerSearch(e.target.value);
                                setShowCustomerDropdown(true);
                            }}
                            onFocus={() => setShowCustomerDropdown(true)}
                            placeholder="Search Customer..."
                            className="w-full px-3 h-9 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.customer && <p className="text-xs text-red-500 mt-1">{errors.customer}</p>}

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
                                        <p className="text-sm text-gray-500 px-3 py-2">
                                            No customers found
                                        </p>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField
                        label="LR Number"
                        name="lrNumber"
                        value={form.lrNumber}
                        onChange={handleChange}
                        placeholder="Enter LR Number"
                    />
                    <InputField
                        label="Vehicle Number"
                        name="vehicleNumber"
                        value={form.vehicleNumber}
                        onChange={handleChange}
                        placeholder="Enter Vehicle Number"
                    />

                    <div className="relative" ref={routeRef}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Route (Optional)
                        </label>

                        <input
                            type="text"
                            value={routeSearch || form.route}
                            onChange={(e) => {
                                setRouteSearch(e.target.value);
                                setShowRouteDropdown(true);
                            }}
                            onFocus={() => setShowRouteDropdown(true)}
                            placeholder="Search Route (ex: Chennai - Bengaluru)"
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

                    <div className="flex items-center gap-6 mt-4">
                        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <input
                                type="checkbox"
                                name="roundTrip"
                                checked={form.roundTrip}
                                onChange={handleChange}
                                className="h-4 w-4 accent-blue-600"
                            />
                            Round Trip
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <input
                                type="checkbox"
                                name="addPitstops"
                                checked={form.addPitstops}
                                onChange={handleChange}
                                className="h-4 w-4 accent-blue-600"
                            />
                            Add Pitstops
                        </label>
                    </div>
                </div>
            </div>

            {/* Pitstop Table - Conditionally Rendered */}
            {form.addPitstops && (
                <div className="mt-4 border rounded-lg p-4 border-gray-200 dark:border-gray-700">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                        Pitstop Table
                    </h3>

                    {pitstops.length > 0 ? (
                        <table className="w-full text-sm text-left border border-gray-200 dark:border-gray-700">
                            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                <tr>
                                    <th className="px-3 py-2 border-r border-gray-200 dark:border-gray-700">
                                        #
                                    </th>
                                    <th className="px-3 py-2 border-r border-gray-200 dark:border-gray-700">
                                        Pitstop Location
                                    </th>
                                    <th className="px-3 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pitstops.map((stop, index) => (
                                    <tr key={stop.id}>
                                        <td className="px-3 py-2 border-r border-gray-200 dark:border-gray-700 dark:text-gray-300">{index + 1}</td>
                                        <td className="px-3 py-2 border-r border-gray-200 dark:border-gray-700">
                                            <PitstopAutocomplete
                                                value={stop.name}
                                                onChange={(value) => handlePitstopChange(stop.id, value)}
                                            />
                                        </td>
                                        <td className="px-3 py-2 border-r border-gray-200 dark:border-gray-700">
                                            <button onClick={() => removePitstop(stop.id)} className="text-red-500">
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-500 text-sm">No pitstops added yet.</p>
                    )}

                    <button
                        onClick={addPitstop}
                        className="mt-3 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                    >
                        Add Row
                    </button>
                </div>
            )}

            {/* Map Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300">
                        Origin *
                    </label>
                    {renderAutocompleteInput(
                        originRef,
                        "Enter Origin",
                        form.origin,
                        (e) => setForm((prev) => ({ ...prev, origin: e.target.value }))
                    )}
                    {errors.origin && (
                        <p className="text-xs text-red-500 mt-1">{errors.origin}</p>
                    )}

                    <label className="block text-sm text-gray-700 dark:text-gray-300 mt-3">
                        Destination *
                    </label>
                    {renderAutocompleteInput(
                        destinationRef,
                        "Enter Destination",
                        form.destination,
                        (e) => setForm((prev) => ({ ...prev, destination: e.target.value }))
                    )}
                    {errors.destination && (
                        <p className="text-xs text-red-500 mt-1">{errors.destination}</p>
                    )}

                    <button
                        onClick={calcRoute}
                        disabled={!isLoaded}
                        className="mt-3 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                    >
                        {isLoaded ? "Show Route" : "Loading Maps..."}
                    </button>
                </div>

                {renderMap()}
            </div>

            {/* Driver & Other Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                    <InputField
                        label="Driver Number"
                        name="driverNumber"
                        value={form.driverNumber}
                        onChange={handleChange}
                        placeholder="Enter Driver Number"
                        required
                    />
                    {errors.driverNumber && <p className="text-xs text-red-500 mt-1">{errors.driverNumber}</p>}
                </div>
                <InputField
                    label="Driver Name"
                    name="driverName"
                    value={form.driverName}
                    onChange={handleChange}
                    placeholder="Enter Driver Name"
                />
                <InputField label="Created At" value={form.createdAt} disabled />
                <InputField
                    label="ETA"
                    name="eta"
                    value={form.eta}
                    type="datetime-local"
                    onChange={handleChange}
                    placeholder="Enter ETA"
                />
                <InputField
                    label="TAT Days"
                    name="tatDays"
                    value={form.tatDays}
                    onChange={handleChange}
                    placeholder="Enter TAT Days"
                />
                <InputField
                    label="Status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    placeholder="Enter Status"
                />
                <InputField
                    label="Branch"
                    name="branch"
                    value={form.branch}
                    onChange={handleChange}
                    placeholder="Enter Branch"
                />
            </div>
        </div>
    );
}

export default BasicDetailsTab;