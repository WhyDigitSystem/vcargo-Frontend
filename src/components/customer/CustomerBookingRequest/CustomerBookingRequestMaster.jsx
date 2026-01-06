import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";

import TabComponent from "../../common/TabComponent";
import InputField from "../../UI/InputField";
import { useNavigate } from "react-router-dom";
import { customerAPI } from "../../../api/customerAPI";
import SafeAutocomplete from "../../common/SafeAutocomplete";
import { useGoogleMaps } from "../../../hooks/useGoogleMaps";
import { vehicleTypeAPI } from "../../../api/vehicleType";
import { customerBookingRequestAPI } from "../../../api/customerBookingRequestAPI";
import { toast } from "../../../utils/toast";
import { useSelector } from "react-redux";

const CustomerBookingRequestMaster = ({ setIsListView, editingId }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const [customerNameList, setCustomerNameList] = useState([]);
    const [vehicleTypeList, setVehicleTypeList] = useState([]);
    const userName = JSON.parse(localStorage.getItem("user"))?.name || "";
    const [errors, setErrors] = useState({});

    const [customerSearch, setCustomerSearch] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

    const [vehicleTypeSearch, setVehicleTypeSearch] = useState("");
    const [selectedVehicleType, setSelectedVehicleType] = useState("");
    const [showVehicleTypeDropdown, setShowVehicleTypeDropdown] = useState(false);

    const { user } = useSelector((state) => state.auth);
    const orgId = user.orgId;

    const [formData, setFormData] = useState({
        customer: "",
        customerCode: "",
        status: "Open",
        origin: "",
        destination: "",
        vehicleType: "",
        numberOfVehicles: "1",
        placementDate: "",
        orderType: "Contracted scheduled",
        serviceType: "",
        orderingParty: "",
        materialType: "",
        billToParty: "",
        docketNo: "",
    });

    const customerRef = useRef(null);
    const originRef = useRef(null);
    const destinationRef = useRef(null);
    const vehicleTypeRef = useRef(null);
    //  
    const navigate = useNavigate();
    const { isLoaded } = useGoogleMaps();

    useEffect(() => {
        // if (first.current) {
        //     first.current = false;
        //     return;
        // }
        getCustomersName();
        getVehicleType();

        if (editingId) {
            getBookingRequestById(editingId);
        }
    }, [editingId]);

    // Update input values when formData changes
    useEffect(() => {
        if (originRef.current && formData.origin) {
            originRef.current.value = formData.origin;
        }
        if (destinationRef.current && formData.destination) {
            destinationRef.current.value = formData.destination;
        }
    }, [formData.origin, formData.destination]);

    const getBookingRequestById = async (id) => {
        try {
            setLoading(true);
            const response = await customerBookingRequestAPI.getCustomerBookingRequestById(id);
            console.log("📥 Booking Request API Response:", response);

            const data = response?.paramObjectsMap?.customerBookingRequestVO;
            if (!data) {
                console.error("No data found in response");
                return;
            }

            console.log("📝 Prefill Booking Request Data:", data);

            // Prefill form data
            setFormData(prev => ({
                ...prev,
                customer: data.customer || "",
                status: data.status || "Open",
                origin: data.origin || "",
                destination: data.destination || "",
                vehicleType: data.vehicleType || "",
                numberOfVehicles: data.noOfVehicles?.toString() || "1",
                placementDate: data.placementDate || "",
                orderType: data.orderType || "Contracted scheduled",
                serviceType: data.serviceType || "",
                orderingParty: data.orderingParty || "",
                materialType: data.materialType || "",
                billToParty: data.billToParty || "",
                docketNo: data.docketNo || "",
                orgId: orgId
            }));

            // Set selected values for dropdowns
            setSelectedCustomer(data.customer || "");
            setSelectedVehicleType(data.vehicleType || "");

            console.log("✅ Booking request data populated successfully");

        } catch (err) {
            console.error("❌ Error loading booking request:", err);
            toast.error("Failed to load booking request details");
        } finally {
            setLoading(false);
        }
    };

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

    const filteredVehicleTypes = vehicleTypeList.filter((v) =>
        v.vehicleType?.toLowerCase().includes(vehicleTypeSearch.toLowerCase())
    );

    const handleVehicleTypeSelect = (vehicle) => {
        setSelectedVehicleType(vehicle.vehicleType);
        setVehicleTypeSearch("");
        onFormChange("vehicleType", vehicle.vehicleType);
        setShowVehicleTypeDropdown(false);
    };

    const handleVehicleTypeInputChange = (e) => {
        onFormChange("vehicleType", e.target.value);
        setVehicleTypeSearch(e.target.value);
        setShowVehicleTypeDropdown(true);
    };

    const handleCreateNewVehicleType = () => {
        navigate("/vehicle-type");
    };

    const onFormChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

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

    useEffect(() => {
        const handler = (e) => {
            if (customerRef.current && !customerRef.current.contains(e.target)) {
                setShowCustomerDropdown(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (vehicleTypeRef.current && !vehicleTypeRef.current.contains(e.target)) {
                setShowVehicleTypeDropdown(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

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

    const validateForm = () => {
        let newErrors = {};

        if (!formData.customer?.trim()) {
            newErrors.customer = "Customer is required.";
        }

        if (!formData.origin?.trim()) {
            newErrors.origin = "Origin is required.";
        }

        if (!formData.destination?.trim()) {
            newErrors.destination = "Destination is required.";
        }

        if (
            formData.origin?.trim().toLowerCase() &&
            formData.destination?.trim().toLowerCase() &&
            formData.origin.trim().toLowerCase() === formData.destination.trim().toLowerCase()
        ) {
            newErrors.destination = "Origin & Destination cannot be same.";
        }

        if (!formData.vehicleType?.trim()) {
            newErrors.vehicleType = "Vehicle type is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            toast.error("Please fix the required fields");
            return;
        }
        try {
            setLoading(true);

            const payload = {
                active: formData.status === "Open" ? true : false,
                billToParty: formData.billToParty || "",
                branchCode: "",
                branchName: "",
                createdBy: userName,
                customer: formData.customer,
                destination: formData.destination,
                docketNo: formData.docketNo,
                materialType: formData.materialType,
                noOfVehicles: Number(formData.numberOfVehicles || 1),
                orderType: formData.orderType,
                orderingParty: formData.orderingParty,
                orgId: orgId,
                origin: formData.origin,
                placementDate: formData.placementDate,
                remarks: "",
                serviceType: formData.serviceType,
                status: formData.status,
                vehicleType: formData.vehicleType,
            };

            if (editingId) {
                payload.id = parseInt(editingId);
                payload.updatedBy = userName;
            }

            console.log("🔄 Sending payload:", payload);

            const response = await customerBookingRequestAPI.createUpdateCustomerBookingRequest(payload);

            console.log("✅ API Response:", response);

            if (response?.status === true || response?.data?.status === true) {
                toast.success(editingId ? "Booking request updated successfully!" : "Booking request created successfully!");
                setIsListView(true);
            } else {
                toast.error("Failed to save booking request");
                console.error("Save issue:", response);
            }

        } catch (error) {
            console.error("❌ Error saving booking request:", error);
            console.error("Error details:", error.response?.data);
            toast.error(error?.response?.data?.message || "Something went wrong while saving booking request!");
        } finally {
            setLoading(false);
        }
    };

    const handleClearForm = () => {
        setFormData({
            customer: "",
            customerCode: "",
            status: "Open",
            origin: "",
            destination: "",
            vehicleType: "",
            numberOfVehicles: "1",
            placementDate: "",
            orderType: "Contracted scheduled",
            serviceType: "",
            orderingParty: "",
            materialType: "",
            billToParty: "",
            docketNo: "",
            orgId: ''
        });
        setSelectedCustomer("");
        setCustomerSearch("");
        setSelectedVehicleType("");
        setVehicleTypeSearch("");

        // Clear Google Autocomplete inputs
        if (originRef.current) originRef.current.value = "";
        if (destinationRef.current) destinationRef.current.value = "";
    };

    const tabs = [
        { label: "Details" },
        { label: "Other Info" },
    ];

    return (
        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 shadow rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all">
            {/* 🔹 Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsListView(true)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        title="Back"
                        disabled={loading}
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    </button>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {editingId ? "Edit Customer Booking Request" : "New Customer Booking Request"}
                    </h2>
                    {!editingId && <span className="text-red-500 text-sm font-medium">• Not Saved</span>}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleClearForm}
                        className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                        disabled={loading}
                    >
                        Clear Form
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>

            <TabComponent tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

            {loading && !editingId ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            ) : (
                <>
                    {activeTab === 0 && (
                        <div className="mt-6 space-y-8">
                            {/* ── Main Details Grid ── */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                        className="w-full px-3 h-9 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={loading}
                                    />
                                    {errors.customer && (
                                        <p className="text-xs text-red-500 mt-1">{errors.customer}</p>
                                    )}

                                    {/* DROPDOWN */}
                                    {showCustomerDropdown && (
                                        <div className="absolute left-0 right-0 mt-1 rounded-lg shadow-xl border z-50 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 max-h-60 overflow-hidden">
                                            {/* Scroll container */}
                                            <div className="max-h-40 overflow-y-auto">
                                                {filteredCustomers.length > 0 ? (
                                                    filteredCustomers.map((cust, index) => (
                                                        <div
                                                            key={index}
                                                            onClick={() => handleCustomerSelect(cust)}
                                                            className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                                                        >
                                                            <div className="font-medium">{cust.customername}</div>
                                                            {cust.customercode && (
                                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                    Code: {cust.customercode}
                                                                </div>
                                                            )}
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
                                                className="w-full flex items-center justify-center gap-2 px-3 py-2 border-t text-blue-600 dark:text-blue-400 bg-gray-50 dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700"
                                            >
                                                <Plus className="h-4 w-4" />
                                                Add New Customer
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Status
                                    </label>

                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                        className="w-full border border-gray-300 dark:border-gray-600 px-3 py-1 rounded-lg dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={loading}
                                    >
                                        <option value="Open">Open</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Confirmed">Confirmed</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
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
                                                placeholder="Enter origin location"
                                                className="w-full px-3 h-9 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                onBlur={(e) => {
                                                    // Update form data on blur as fallback
                                                    if (e.target.value !== formData.origin) {
                                                        onFormChange("origin", e.target.value);
                                                    }
                                                }}
                                                disabled={loading}
                                            />
                                            {errors.origin && (
                                                <p className="text-xs text-red-500 mt-1">{errors.origin}</p>
                                            )}
                                        </div>
                                    </SafeAutocomplete>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
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
                                                placeholder="Enter destination location"
                                                className="w-full px-3 h-9 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                onBlur={(e) => {
                                                    // Update form data on blur as fallback
                                                    if (e.target.value !== formData.destination) {
                                                        onFormChange("destination", e.target.value);
                                                    }
                                                }}
                                                disabled={loading}
                                            />
                                            {errors.destination && (
                                                <p className="text-xs text-red-500 mt-1">{errors.destination}</p>
                                            )}
                                        </div>
                                    </SafeAutocomplete>
                                </div>

                                <div className="relative" ref={vehicleTypeRef}>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Vehicle Type <span className="text-red-500">*</span>
                                    </label>

                                    <input
                                        type="text"
                                        value={selectedVehicleType || vehicleTypeSearch || formData.vehicleType}
                                        onChange={handleVehicleTypeInputChange}
                                        onFocus={() => setShowVehicleTypeDropdown(true)}
                                        placeholder="Search Vehicle Type..."
                                        className="w-full px-3 h-9 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={loading}
                                    />
                                    {errors.vehicleType && (
                                        <p className="text-xs text-red-500 mt-1">{errors.vehicleType}</p>
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
                            </div>

                            {/* ── Extra Info Section ── */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                                    Extra Info
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                                    <InputField
                                        label="Number of Vehicles"
                                        type="number"
                                        value={formData.numberOfVehicles}
                                        onChange={(e) => onFormChange("numberOfVehicles", e.target.value)}
                                        disabled={loading}
                                    />
                                    <InputField
                                        label="Placement Date"
                                        type="date"
                                        value={formData.placementDate}
                                        onChange={(e) => onFormChange("placementDate", e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 1 && (
                        <div className="mt-6 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Order Type
                                    </label>

                                    <select
                                        value={formData.orderType}
                                        onChange={(e) => setFormData(prev => ({ ...prev, orderType: e.target.value }))}
                                        className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={loading}
                                    >
                                        <option value="Contracted Scheduled">Contracted Scheduled</option>
                                        <option value="Contracted Order">Contracted Order</option>
                                        <option value="Leased Order">Leased Order</option>
                                        <option value="AdHoc">AdHoc</option>
                                        <option value="Empty">Empty</option>
                                        <option value="FTL">FTL</option>
                                        <option value="LTL">LTL</option>
                                    </select>
                                </div>
                                <InputField
                                    label="Service Type"
                                    placeholder="Select service type"
                                    value={formData.serviceType}
                                    onChange={(e) => onFormChange("serviceType", e.target.value)}
                                    disabled={loading}
                                />
                                <InputField
                                    label="Ordering Party"
                                    placeholder="Select ordering party"
                                    value={formData.orderingParty}
                                    onChange={(e) => onFormChange("orderingParty", e.target.value)}
                                    disabled={loading}
                                />
                                <InputField
                                    label="Material Type"
                                    placeholder="Select material type"
                                    value={formData.materialType}
                                    onChange={(e) => onFormChange("materialType", e.target.value)}
                                    disabled={loading}
                                />
                                <InputField
                                    label="Bill to Party"
                                    placeholder="Select bill to party"
                                    value={formData.billToParty}
                                    onChange={(e) => onFormChange("billToParty", e.target.value)}
                                    disabled={loading}
                                />
                                <InputField
                                    label="Docket No"
                                    placeholder="Enter docket number"
                                    value={formData.docketNo}
                                    onChange={(e) => onFormChange("docketNo", e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CustomerBookingRequestMaster;