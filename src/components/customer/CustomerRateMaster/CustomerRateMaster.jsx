import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import InputField from "../../UI/InputField";
import { useNavigate } from "react-router-dom";
import { customerAPI } from "../../../api/customerAPI";
import { vehicleTypeAPI } from "../../../api/vehicleType";
import { customerRateAPI } from "../../../api/customerRateAPI";
import { toast } from "../../../utils/toast";
import SafeAutocomplete from "../../../components/common/SafeAutocomplete";
import { useGoogleMaps } from "../../../hooks/useGoogleMaps";
import { useSelector } from "react-redux";

export default function CustomerRateMaster({ setIsListView, editId }) {

    const [formData, setFormData] = useState({
        status: "Active",
        customer: "",
        namingSeries: "",
        origin: "",
        destination: "",
        rate: 0,
        vehicleType: "",
        rateType: "Contractual",
        weight: ""
    });
    const [errors, setErrors] = useState({});

    const userName = JSON.parse(localStorage.getItem("user"))?.name || "";
    const [customerNameList, setCustomerNameList] = useState([]);
    const [vehicleTypeList, setVehicleTypeList] = useState([]);
    const [loading, setLoading] = useState(false);

    const [customerSearch, setCustomerSearch] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

    const [vehicleSearch, setVehicleSearch] = useState("");
    const [selectedVehicle, setSelectedVehicle] = useState("");
    const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);

    const { user } = useSelector((state) => state.auth);
    const orgId = user.orgId;

    const navigate = useNavigate();
    const customerRef = useRef(null);
    const originRef = useRef(null);
    const destinationRef = useRef(null);
    const vehicleRef = useRef(null);
    const { isLoaded: mapsLoaded } = useGoogleMaps();

    useEffect(() => {
        getCustomersName();
        getVehicleType();
    }, []);

    useEffect(() => {
        if (editId) {
            getCustomerRateDetailsById(editId);
        }
    }, [editId]);

    const filteredCustomers = customerNameList.filter((c) =>
        c.customername?.toLowerCase().includes(customerSearch.toLowerCase())
    );

    const handleCustomerSelect = (customer) => {
        setSelectedCustomer(customer.customername);
        setFormData((prev) => ({
            ...prev,
            customer: customer.customername,
            customerCode: customer.customercode
        }));
        setShowCustomerDropdown(false);
    };

    const handleCreateNewCustomer = () => {
        navigate("/customer");
    };

    const filteredVehicleTypes = vehicleTypeList.filter((v) =>
        v.vehicleType?.toLowerCase().includes(vehicleSearch.toLowerCase())
    );

    const handleVehicleSelect = (vehicle) => {
        setSelectedVehicle(vehicle.vehicleType);
        setFormData(prev => ({ ...prev, vehicleType: vehicle.vehicleType }));
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

    useEffect(() => {
        const handler = (e) => {
            if (customerRef.current && !customerRef.current.contains(e.target)) {
                setShowCustomerDropdown(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleOriginPlaceChanged = () => {
        if (originRef.current) {
            const place = originRef.current.getPlace();
            const address = place?.formatted_address || place?.name || "";
            console.log('📍 Origin selected:', address);
            setFormData(prev => ({ ...prev, origin: address }));
        }
    };

    const handleOriginLoad = (autocomplete) => {
        console.log('✅ Origin Autocomplete loaded');
        originRef.current = autocomplete;
    };

    const handleDestinationPlaceChanged = () => {
        if (destinationRef.current) {
            const place = destinationRef.current.getPlace();
            const address = place?.formatted_address || place?.name || "";
            console.log('📍 Destination selected:', address);
            setFormData(prev => ({ ...prev, destination: address }));
        }
    };

    const handleDestinationLoad = (autocomplete) => {
        console.log('✅ Destination Autocomplete loaded');
        destinationRef.current = autocomplete;
    };

    const handleOriginChange = (e) => {
        setFormData(prev => ({ ...prev, origin: e.target.value }));
    };

    const handleDestinationChange = (e) => {
        setFormData(prev => ({ ...prev, destination: e.target.value }));
    };

    const handleClearForm = () => {
        setFormData({
            status: "Active",
            customer: "",
            namingSeries: "CM-######",
            origin: "",
            destination: "",
            rate: 0,
            vehicleType: "",
            rateType: "Contractual",
            weight: ""
        });
        setCustomerSearch("");
        setSelectedCustomer("");
        setVehicleSearch("");
        setSelectedVehicle("");
    };

    const getCustomersName = async () => {
        try {
            setLoading(true);

            const response = await customerAPI.getCustomerName({orgId});
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

    const getVehicleType = async () => {
        try {
            setLoading(true);

            const response = await vehicleTypeAPI.getVehicleType({orgId});
            console.log('API Response:', response);

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

    const getCustomerRateDetailsById = async (id) => {
        try {
            const response = await customerRateAPI.getCustomerRateById(id);
            console.log("Edit API Response:", response);

            const data = response?.paramObjectsMap?.customerRateVO;

            if (data) {
                setFormData({
                    id: data.id || null,
                    customer: data.customer || "",
                    namingSeries: data.namingSeries || "",
                    origin: data.origin || "",
                    destination: data.destination || "",
                    rate: data.rate || 0,
                    rateType: data.rateType || "",
                    vehicleType: data.vehicleType || "",
                    weight: data.weight || "",
                    status: data.active ? "Active" : "Inactive",
                    branch: data.branch || "",
                    branchCode: data.branchCode || "",
                    orgId: data.orgId || "",
                    createdBy: data.createdBy || "",
                });

                setSelectedCustomer(data.customer || "");
                setSelectedVehicle(data.vehicleType || "");
            }

        } catch (error) {
            console.error("Error fetching customer rate:", error);
            toast.error("Failed to load Customer Rate details");
        }
    };

    const validateForm = () => {
        let newErrors = {};

        if (!formData.customer?.trim()) {
            newErrors.customer = "Customer is required";
        }

        if (!formData.origin?.trim()) {
            newErrors.origin = "Origin is required";
        }

        if (!formData.destination?.trim()) {
            newErrors.destination = "Destination is required";
        }

        if (!formData.vehicleType?.trim()) {
            newErrors.vehicleType = "Vehicle type is required";
        }

        if (!formData.rate || Number(formData.rate) <= 0) {
            newErrors.rate = "Rate must be a positive number";
        }

        if (
            formData.origin?.trim().toLowerCase() ===
            formData.destination?.trim().toLowerCase()
        ) {
            newErrors.destination = "Origin and Destination cannot be same";
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
                orgId: orgId,
                branch: formData.branch || '',
                branchCode: formData.branchCode || '',
                createdBy: userName || '',
                active: formData.status === "Active",
                customer: formData.customer,
                namingSeries: formData.namingSeries,
                origin: formData.origin,
                destination: formData.destination,
                rate: Number(formData.rate),
                rateType: formData.rateType,
                vehicleType: formData.vehicleType,
                weight: Number(formData.weight)
            };

            if (formData.id) {
                payload.id = formData.id;
            }

            console.log("SAVE PAYLOAD:", payload);

            const response = await customerRateAPI.createUpdateCustomerRate(payload);

            if (response?.status) {
                toast.success(
                    formData.id
                        ? "Customer Rate updated successfully!"
                        : "Customer Rate created successfully!"
                );
                setIsListView(true);
            } else {
                toast.error("Customer Rate Creation Failed");
            }

        } catch (error) {
            console.error("Error saving Customer Rate:", error);
            toast.error("Failed to save Customer Rate");
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 mt-6 bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-700">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsListView(true)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    </button>
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {editId ? "Edit Customer Rate Master" : "New Customer Rate Master"}
                    </h1>
                    <span className="text-xs text-red-500">● Not Saved</span>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleClearForm}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 
                        rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        Clear
                    </button>

                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                        Save
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

                {/* CUSTOMER SEARCH FIELD */}
                <div className="relative" ref={customerRef}>
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

                            {/* Scrollable Customer List */}
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

                            {/* Add Customer Button (Always visible) */}
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

                {/* Naming Series */}
                <InputField
                    label="Naming Series"
                    name="namingSeries"
                    value={formData.namingSeries}
                    onChange={handleChange}
                />

                {/* ORIGIN */}
                <div className="flex flex-col">
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
                                value={formData.origin}
                                onChange={handleOriginChange}
                                placeholder="Enter Origin"
                                className="w-full mt-1 h-9 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.origin && (
                                <p className="text-xs text-red-500 mt-1">{errors.origin}</p>
                            )}
                        </div>
                    </SafeAutocomplete>
                </div>

                {/* DESTINATION */}
                <div className="flex flex-col">
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
                                value={formData.destination}
                                onChange={handleDestinationChange}
                                placeholder="Enter Destination"
                                className="w-full mt-1 h-9 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.destination && (
                                <p className="text-xs text-red-500 mt-1">{errors.destination}</p>
                            )}
                        </div>
                    </SafeAutocomplete>
                </div>

                {/* Rate */}
                <div>
                    <InputField
                        label="Rate *"
                        name="rate"
                        type="number"
                        value={formData.rate}
                        onChange={handleChange}
                    />
                    {errors.rate && (
                        <p className="text-xs text-red-500 mt-1">{errors.rate}</p>
                    )}
                </div>

                {/* VEHICLE TYPE SEARCH FIELD */}
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
                    {errors.vehicleType && (
                        <p className="text-xs text-red-500 mt-1">{errors.vehicleType}</p>
                    )}

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

                {/* Rate Type */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Rate Type
                    </label>
                    <select
                        name="rateType"
                        value={formData.rateType}
                        onChange={handleChange}
                        className="w-full h-9 px-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                        <option>Contractual</option>
                        <option>Ad-Hoc</option>
                    </select>
                </div>

                {/* Weight */}
                <InputField
                    label="Weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                />

                {/* Status */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status
                    </label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full h-9 px-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>

        </div>
    );
}