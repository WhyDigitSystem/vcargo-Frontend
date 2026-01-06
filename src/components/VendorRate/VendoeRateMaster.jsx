import React, { useEffect, useRef, useState } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { Save, RotateCcw, ChevronLeft, Plus } from "lucide-react";
import InputField from "../UI/InputField";
import { useNavigate } from "react-router-dom";
import { vendorAPI } from "../../api/vendorAPI";
import { vehicleTypeAPI } from "../../api/vehicleType";
import { vendorRateAPI } from "../../api/vendorRateAPI";
import { toast } from "../../utils/toast";
import SafeAutocomplete from "../common/SafeAutocomplete";
import { useGoogleMaps } from "../../hooks/useGoogleMaps";
import { useSelector } from "react-redux";

const VendorRateMaster = ({ setIsListView, editId }) => {
  const userName = JSON.parse(localStorage.getItem("user"))?.name || "";

  const [formData, setFormData] = useState({
    status: "Active",
    vendor: "",
    namingSeries: "",
    effectiveFrom: "",
    effectiveTo: "",
    priority: "1",
    active: true,
    origin: "",
    destination: "",
    rate: "",
    vehicleType: "",
    weight: "",
    rateType: "Contractual",
    detentionCharge: "",
    rank: "1",
    unloadingCharges: "0.00",
    extraKmCharges: "0.00",
    remark: "",
    branch: "",
    branchCode: "",
    orgId: 0,
    state: "",
  });
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);
  const [vendorList, setVendorList] = useState([]);
  const [vendorSearch, setVendorSearch] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);

  const [vehicleTypeList, setVehicleTypeList] = useState([]);
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);

  const navigate = useNavigate();
  const vendorRef = useRef(null);
  const originRef = useRef(null);
  const destinationRef = useRef(null);
  const vehicleRef = useRef(null);
  const { isLoaded: mapsLoaded } = useGoogleMaps();

  const { user } = useSelector((state) => state.auth);
  const orgId = user.orgId;
   

  useEffect(() => {
    getVendor();
    getVehicleTypes();
  }, []);

  useEffect(() => {
    if (editId) {
      getVendorRateById(editId);
    }
  }, [editId]);

  const filteredVendor = vendorList.filter((v) =>
    v.organization?.toLowerCase().includes(vendorSearch.toLowerCase())
  );

  const handleVendorSelect = (vendor) => {
    setSelectedVendor(vendor.organization);
    setFormData(prev => ({
      ...prev,
      vendor: vendor.organization,
      vendorCode: vendor.vendorCode
    }));
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleListView = () => {
    handleClear();
    setIsListView(true);
  }

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

  const getVendor = async () => {
    try {
      setLoading(true);
      const response = await vendorAPI.getVendorName({ orgId });
      const data = response?.paramObjectsMap?.vendorVO || [];
      setVendorList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching Vendor:", error);
      setVendorList([]);
    } finally {
      setLoading(false);
    }
  };

  const getVehicleTypes = async () => {
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

  const getVendorRateById = async (id) => {
    try {
      setLoading(true);
      const response = await vendorRateAPI.getVendorRateById(id);

      const data = response?.paramObjectsMap?.vendorRateVO;

      if (data) {
        setFormData({
          status: data.active ? "Active" : "In-Active",
          vendor: data.vendor || "",
          namingSeries: data.namingSeries || "",
          effectiveFrom: data.effectiveFrom || "",
          effectiveTo: data.effectiveTo || "",
          priority: data.priority || "1",
          active: data.active || true,
          origin: data.origin || "",
          destination: data.destination || "",
          rate: data.rate || "",
          vehicleType: data.vehicleType || "",
          weight: data.weight || "",
          rateType: data.rateType || "Contractual",
          detentionCharge: data.detentioncharge || "",
          rank: data.rank?.toString() || "1",
          unloadingCharges: data.unloadingCharges || "0.00",
          extraKmCharges: data.extraCharges || "0.00",
          remark: data.remarks || "",
          branch: data.branch || "",
          branchCode: data.branchCode || "",
          orgId: data.orgId || 0,
          state: data.state || "",
        });

        setSelectedVendor(data.vendor || "");
        setSelectedVehicle(data.vehicleType || "");
      }
    } catch (error) {
      console.error("Error fetching vendor rate:", error);
      toast.error("Failed to load vendor rate details!");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.vendor?.trim()) {
      newErrors.vendor = "Vendor is required.";
    }

    if (!formData.origin?.trim()) {
      newErrors.origin = "Origin is required.";
    }

    if (!formData.destination?.trim()) {
      newErrors.destination = "Destination is required.";
    }

    if (
      formData.origin?.trim().toLowerCase() ===
      formData.destination?.trim().toLowerCase()
    ) {
      newErrors.destination = "Origin and Destination cannot be same.";
    }

    if (!formData.rate || Number(formData.rate) <= 0) {
      newErrors.rate = "Rate must be a positive number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fill the required fields");
      return;
    }
    try {
      setLoading(true);

      const payload = {
        active: formData.status === "Active",
        branch: formData.branch || "",
        branchCode: formData.branchCode || "",
        createdBy: userName || "",
        destination: formData.destination || "",
        detentioncharge: formData.detentionCharge || "",
        effectiveFrom: formData.effectiveFrom || "",
        effectiveTo: formData.effectiveTo || "",
        extraCharges: formData.extraKmCharges || "",
        namingSeries: formData.namingSeries || "",
        orgId: orgId,
        origin: formData.origin || "",
        priority: formData.priority || "",
        rank: parseInt(formData.rank) || 0,
        rate: formData.rate || "",
        rateType: formData.rateType || "",
        remarks: formData.remark || "",
        state: formData.state || "",
        unloadingCharges: formData.unloadingCharges || "",
        vehicleType: formData.vehicleType || "",
        vendor: formData.vendor || "",
        weight: formData.weight || "",
      };

      // Add ID for update operation
      if (editId) {
        payload.id = editId;
      }

      console.log("Saving Vendor Rate Payload:", payload);

      const response = await vendorRateAPI.createUpdateVendorRate(payload);

      if (response?.success || response?.statusFlag === "Ok") {
        toast.success(
          editId ? "Vendor rate updated successfully!" : "Vendor rate created successfully!"
        );
        handleClear();
        setIsListView(true);
      } else {
        toast.error("Failed to save vendor rate!");
      }
    } catch (error) {
      console.error("Error saving vendor rate:", error);
      toast.error("Failed to save vendor rate!");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      status: "Active",
      vendor: "",
      namingSeries: "",
      effectiveFrom: "",
      effectiveTo: "",
      priority: "1",
      active: true,
      origin: "",
      destination: "",
      rate: "",
      vehicleType: "",
      weight: "",
      rateType: "Contractual",
      detentionCharge: "",
      rank: "1",
      unloadingCharges: "0.00",
      extraKmCharges: "0.00",
      remark: "",
      branch: "",
      branchCode: "",
      orgId: 0,
      state: "",
    });
    setSelectedVendor("");
    setVendorSearch("");
    setSelectedVehicle("");
    setVehicleSearch("");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mt-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={handleListView}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {editId ? "Edit Vendor Rate" : "New Vendor Rate Master"}
          </h2>
          <span className="text-sm text-orange-500 ml-2">● Not Saved</span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleClear}
            disabled={loading}
            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg flex items-center gap-1 text-gray-700 dark:text-gray-200 disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" /> Clear Form
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Vendor Dropdown */}
        <div className="relative" ref={vendorRef}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Vendor <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={selectedVendor || vendorSearch}
            onChange={(e) => {
              setSelectedVendor("");
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

        <InputField
          label="Naming Series"
          name="namingSeries"
          value={formData.namingSeries}
          onChange={handleChange}
          placeholder="Enter naming series"
        />
        <InputField
          label="Effective From"
          name="effectiveFrom"
          type="date"
          value={formData.effectiveFrom}
          onChange={handleChange}
        />
        <InputField
          label="Effective To"
          name="effectiveTo"
          type="date"
          value={formData.effectiveTo}
          onChange={handleChange}
        />

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="Active">Active</option>
            <option value="In-Active">In-Active</option>
          </select>
        </div>

        {/* Origin with Autocomplete */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Origin <span className="text-red-500">*</span>
          </label>
          <SafeAutocomplete
            onLoad={handleOriginLoad}
            onPlaceChanged={handleOriginPlaceChanged}
          >
            <div className="w-full">
              <input
                type="text"
                placeholder="Enter Origin"
                value={formData.origin}
                onChange={handleOriginChange}
                className="w-full px-3 h-9 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
              {errors.origin && <p className="text-xs text-red-500 mt-1">{errors.origin}</p>}
            </div>
          </SafeAutocomplete>
        </div>

        {/* Destination with Autocomplete */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Destination <span className="text-red-500">*</span>
          </label>
          <SafeAutocomplete
            onLoad={handleDestinationLoad}
            onPlaceChanged={handleDestinationPlaceChanged}
          >
            <div className="w-full">
              <input
                type="text"
                placeholder="Enter Destination"
                value={formData.destination}
                onChange={handleDestinationChange}
                className="w-full px-3 h-9 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
              {errors.destination && <p className="text-xs text-red-500 mt-1">{errors.destination}</p>}
            </div>
          </SafeAutocomplete>
        </div>

        <div>
          <InputField
            label="Rate"
            name="rate"
            value={formData.rate}
            onChange={handleChange}
            required
            placeholder="Enter rate"
          />
          {errors.rate && <p className="text-xs text-red-500 mt-1">{errors.rate}</p>}
        </div>

        {/* Vehicle Type Dropdown */}
        <div className="relative" ref={vehicleRef}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Vehicle Type
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
            <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50">
              <div className="max-h-52 overflow-y-auto p-2">
                {filteredVehicleTypes.length > 0 ? (
                  filteredVehicleTypes.map((vehicle, index) => (
                    <div
                      key={index}
                      onClick={() => handleVehicleSelect(vehicle)}
                      className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                    >
                      <p className="font-medium text-gray-700 dark:text-gray-200">
                        {vehicle.vehicleType}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 px-3 py-2">
                    No vehicle types found
                  </p>
                )}
              </div>

              <button
                onClick={handleCreateNewVehicleType}
                className="w-full flex items-center gap-2 px-3 py-2 border-t border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-800 rounded-b-xl text-sm"
              >
                <Plus className="h-4 w-4" />
                Add New Vehicle Type
              </button>
            </div>
          )}
        </div>

        <InputField
          label="Weight (Ton)"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          placeholder="Enter weight"
        />

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Rate Type
          </label>
          <select
            name="rateType"
            value={formData.rateType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="Contractual">Contractual</option>
            <option value="Ad-Hoc">Ad-Hoc</option>
          </select>
        </div>

        <InputField
          label="Detention Charge"
          name="detentionCharge"
          value={formData.detentionCharge}
          onChange={handleChange}
          placeholder="Enter detention charge"
        />
        <InputField
          label="Rank"
          name="rank"
          value={formData.rank}
          onChange={handleChange}
          placeholder="Enter rank"
        />
        <InputField
          label="Unloading Charges"
          name="unloadingCharges"
          value={formData.unloadingCharges}
          onChange={handleChange}
          placeholder="Enter unloading charges"
        />
        <InputField
          label="Extra km Charges Upto 500 Km"
          name="extraKmCharges"
          value={formData.extraKmCharges}
          onChange={handleChange}
          placeholder="Enter extra km charges"
        />
        <InputField
          label="Remark"
          name="remark"
          value={formData.remark}
          onChange={handleChange}
          placeholder="Enter remarks"
        />
      </div>
    </div>
  );
};

export default VendorRateMaster;