import { ArrowLeft, Eye, Plus, X, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auctionsAPI } from "../../api/auctionsAPI";
import { vehicleTypeAPI } from "../../api/vehicleType";
import { vendorAPI } from "../../api/vendorAPI";
import { useGoogleMaps } from "../../hooks/useGoogleMaps";
import { toast } from "../../utils/toast";
import SafeAutocomplete from "../common/SafeAutocomplete";
import InputField from "../UI/InputField";

export default function AuctionsMaster({ setIsListView, editingId }) {
  const [form, setForm] = useState({
    auctionType: "Ad hoc",
    roundTrip: false,
    customGeofence: false,
    loading: "",
    unloading: "",
    vehicleType: "",
    vehicleQty: 1,
    branch: "",
    loadingDate: "",
    unloadingDate: "",
    loadingTime: "",
    unloadingTime: "",
    duration: 15,
    startDate: "",
    endDate: "",
    materialType: "",
    materialQty: "",
    materialWeight: "",
    weightUnit: "",
    dimensions: "",
    transporterTag: [],
    excludeTransporters: [],
    termsAndConditions: "",
    bidType: "Per Vehicle",
    minBidDifference: "",
    maxPrice: "",
    minPrice: "",
    allowedBids: "",
  });

  const { user } = useSelector((state) => state.auth);
  const orgId = user.orgId;

  const [openSection, setOpenSection] = useState({
    route: true,
    timings: true,
    material: true,
    materialExtra: true,
    transporterDetails: true,
    docsTerms: true,
    config: true,
  });

  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [file, setFile] = useState(null);
  const [vehicleTypeList, setVehicleTypeList] = useState([]);
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errors, setErrors] = useState({});
  const userName = JSON.parse(localStorage.getItem("user"))?.name || "";
  const organizationName =
    JSON.parse(localStorage.getItem("user"))?.organizationName || "";
  const userId = JSON.parse(localStorage.getItem("user"))?.usersId || "";

  const [vendorList, setVendorList] = useState([]);
  const [transporterTagSearch, setTransporterTagSearch] = useState("");
  const [excludeTransportersSearch, setExcludeTransportersSearch] =
    useState("");
  const [showTransporterTagDropdown, setShowTransporterTagDropdown] =
    useState(false);
  const [showExcludeTransportersDropdown, setShowExcludeTransportersDropdown] =
    useState(false);

  const vehicleRef = useRef(null);
  const fileInputRef = useRef(null);
  const transporterTagRef = useRef(null);
  const excludeTransportersRef = useRef(null);
  const loadingRef = useRef(null);
  const unloadingRef = useRef(null);
  const navigate = useNavigate();
  const { isLoaded: mapsLoaded } = useGoogleMaps();

  useEffect(() => {
    getVehicleType();
    getVendor();
    if (editingId) {
      getAuctionById(editingId);
    }
  }, [editingId]);

  const handleLoadingLoad = (autocomplete) => {
    loadingRef.current = autocomplete;
  };

  const handleLoadingPlaceChanged = () => {
    if (loadingRef.current) {
      const place = loadingRef.current.getPlace();

      const placeName = place?.name || "";
      const formattedAddress = place?.formatted_address || "";

      // Avoid duplicate name if Google already includes it
      const address =
        placeName && !formattedAddress.includes(placeName)
          ? `${placeName}, ${formattedAddress}`
          : formattedAddress || placeName;

      console.log("📍 Loading location selected:", address);

      setForm((prev) => ({ ...prev, loading: address }));
    }
  };

  const handleLoadingChange = (e) => {
    setForm((prev) => ({ ...prev, loading: e.target.value }));
  };

  const handleUnloadingLoad = (autocomplete) => {
    unloadingRef.current = autocomplete;
  };

  const handleUnloadingPlaceChanged = () => {
    if (unloadingRef.current) {
      const place = unloadingRef.current.getPlace();

      const placeName = place?.name || "";
      const formattedAddress = place?.formatted_address || "";

      const address =
        placeName && !formattedAddress.includes(placeName)
          ? `${placeName}, ${formattedAddress}`
          : formattedAddress || placeName;

      console.log("📍 Unloading location selected:", address);

      setForm((prev) => ({ ...prev, unloading: address }));
    }
  };

  const handleUnloadingChange = (e) => {
    setForm((prev) => ({ ...prev, unloading: e.target.value }));
  };

  const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = Array.from(slice).map((ch) => ch.charCodeAt(0));
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, { type: contentType });
  };

  const previewDocument = (base64Data) => {
    if (!base64Data) return;

    let mimeType = "application/pdf";
    if (base64Data.startsWith("/9j/")) mimeType = "image/jpeg";
    else if (base64Data.startsWith("iVBOR")) mimeType = "image/png";

    try {
      const blob = b64toBlob(base64Data, mimeType);
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setShowPreviewModal(true);
    } catch (error) {
      console.error("Error previewing document:", error);
      toast.error("Cannot preview this file");
    }
  };

  const closePreviewModal = () => {
    setShowPreviewModal(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }
  };

  const getFilteredVendors = (searchTerm, currentField, otherField) => {
    return vendorList.filter((vendor) => {
      const matchesSearch = vendor.organization
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const notInCurrentField = !form[currentField]?.some(
        (selected) => selected === vendor.organization
      );
      const notInOtherField = !form[otherField]?.some(
        (selected) => selected === vendor.organization
      );
      return matchesSearch && notInCurrentField && notInOtherField;
    });
  };

  const filteredTransporterTags = getFilteredVendors(
    transporterTagSearch,
    "transporterTag",
    "excludeTransporters"
  );
  const filteredExcludeTransporters = getFilteredVendors(
    excludeTransportersSearch,
    "excludeTransporters",
    "transporterTag"
  );

  const handleVendorSelect = (vendor, field) => {
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], vendor.organization],
    }));

    if (field === "transporterTag") {
      setTransporterTagSearch("");
      setShowTransporterTagDropdown(false);
    } else {
      setExcludeTransportersSearch("");
      setShowExcludeTransportersDropdown(false);
    }
  };

  const removeVendorTag = (vendorName, field) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((vendor) => vendor !== vendorName),
    }));
  };

  const handleCreateNewVendor = () => {
    navigate("/vendor");
  };

  useEffect(() => {
    const handler = (e) => {
      if (
        transporterTagRef.current &&
        !transporterTagRef.current.contains(e.target)
      ) {
        setShowTransporterTagDropdown(false);
      }
      if (
        excludeTransportersRef.current &&
        !excludeTransportersRef.current.contains(e.target)
      ) {
        setShowExcludeTransportersDropdown(false);
      }
      if (vehicleRef.current && !vehicleRef.current.contains(e.target)) {
        setShowVehicleDropdown(false);
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
    setForm((prev) => ({ ...prev, vehicleType: vehicle.vehicleType }));
    setShowVehicleDropdown(false);
    setErrors((prev) => ({ ...prev, vehicleType: "" }));
  };

  const handleCreateNewVehicleType = () => {
    navigate("/vehicle-type");
  };

  const toggle = (key) =>
    setOpenSection((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
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

  const handleClear = () => {
    setForm({
      auctionType: "Ad hoc",
      roundTrip: false,
      customGeofence: false,
      loading: "",
      unloading: "",
      vehicleType: "",
      vehicleQty: 1,
      branch: "",
      loadingDate: "",
      unloadingDate: "",
      loadingTime: "",
      unloadingTime: "",
      duration: 15,
      startDate: "",
      endDate: "",
      materialType: "",
      materialQty: "",
      materialWeight: "",
      weightUnit: "",
      dimensions: "",
      transporterTag: [],
      excludeTransporters: [],
      termsAndConditions: "",
      bidType: "Per Vehicle",
      minBidDifference: "",
      maxPrice: "",
      minPrice: "",
      allowedBids: "",
    });
    setSelectedVehicle("");
    setFile(null);
    setErrors({});
  };

  const getAuctionById = async (id) => {
    try {
      setLoading(true);
      const response = await auctionsAPI.getAuctionsById(id);

      const data = response?.data || response?.paramObjectsMap?.auctionsVO;
      if (!data) {
        console.error("No auction data found in response");
        return;
      }

      setForm((prev) => ({
        ...prev,
        auctionType: data.auctionsType,
        roundTrip: data.roundTrip || false,
        customGeofence: data.customGeofence || false,
        loading: data.loading || "",
        unloading: data.unloading || "",
        vehicleType: data.vehicle || "",
        vehicleQty: data.vehicleQuantity || 1,
        branch: data.branch || "",
        loadingDate: data.loadingDate || "",
        unloadingDate: data.unloadingDate || "",
        loadingTime: data.loadingTime || "",
        unloadingTime: data.unloadingTime || "",
        duration: data.duration || 15,
        startDate: data.startDate || "",
        endDate: data.endDate || "",
        materialType: data.material || "",
        materialQty: data.materialQuantity || "",
        materialWeight: data.materialWeight || "",
        weightUnit: data.weightUnit || "",
        dimensions: data.dimension || "",
        transporterTag: data.transporterTag
          ? data.transporterTag.split(",").map((tag) => tag.trim())
          : [],
        excludeTransporters: data.excludeTransporters
          ? data.excludeTransporters.split(",").map((tag) => tag.trim())
          : [],
        termsAndConditions: data.termsAndConditions || "",
        bidType: data.bidType || "Per Vehicle",
        minBidDifference: data.minBidDifferent || "",
        maxPrice: data.maxPrice || "",
        minPrice: data.minPrice || "",
        allowedBids: data.allowedBits || "",
      }));

      setSelectedVehicle(data.vehicle || "");

      if (data.documents) {
        setFile(data.documents);
      }
    } catch (err) {
      console.error("Error loading auction:", err);
      toast.error("Failed to load auction details");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.vehicleType?.trim())
      newErrors.vehicleType = "Vehicle Type is required";
    if (!form.loading?.trim())
      newErrors.loading = "Loading location is required";
    if (!form.unloading?.trim())
      newErrors.unloading = "Unloading location is required";
    if (!form.startDate) newErrors.startDate = "Start Date is required";
    if (!form.endDate) newErrors.endDate = "End Date is required";
    if (!form.materialType?.trim())
      newErrors.materialType = "Material Type is required";
    if (!form.bidType?.trim()) newErrors.bidType = "Bid Type is required";

    // Additional validation for numbers
    if (form.vehicleQty <= 0)
      newErrors.vehicleQty = "Vehicle Quantity must be greater than 0";
    if (form.duration <= 0)
      newErrors.duration = "Duration must be greater than 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const transformDataForAPI = () => {
    const payload = {
      auctionsType: form.auctionType,
      roundTrip: form.roundTrip,
      customGeofence: form.customGeofence,
      loading: form.loading,
      unloading: form.unloading,
      vehicle: form.vehicleType,
      vehicleQuantity: parseInt(form.vehicleQty) || 1,
      branch: form.branch,
      loadingDate: form.loadingDate,
      unloadingDate: form.unloadingDate,
      loadingTime: form.loadingTime,
      duration: parseInt(form.duration) || 15,
      startDate: form.startDate,
      endDate: form.endDate,
      material: form.materialType,
      materialQuantity: parseFloat(form.materialQty) || 0,
      materialWeight: parseFloat(form.materialWeight) || 0,
      weightUnit: form.weightUnit,
      dimension: parseFloat(form.dimensions) || 0,
      transporterTag: form.transporterTag.join(", "),
      excludeTransporters: form.excludeTransporters.join(", "),
      bidType: form.bidType,
      minBidDifferent: parseFloat(form.minBidDifference) || 0,
      maxPrice: form.maxPrice,
      minPrice: form.minPrice,
      allowedBits: form.allowedBids,
      additionalCharges: "Toll & Loading Charges",
      branchCode: "CHE001",
      createdBy: userName,
      userId: userId,
      organizationName: organizationName,
      orgId: orgId,
      numTransporter: 5,
      shortCuts: "Express Route",
    };

    if (editingId) {
      payload.id = parseInt(editingId);
    }

    return payload;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setIsSaving(true);

      const payload = transformDataForAPI();
      console.log("🔄 Auction Payload:", JSON.stringify(payload, null, 2));

      const formDataToSend = new FormData();

      formDataToSend.append(
        "auctionsDTO",
        new Blob([JSON.stringify(payload)], { type: "application/json" })
      );

      if (file && typeof file !== "string") {
        formDataToSend.append("documents", file);
      }

      const response = await auctionsAPI.createUpdateAuctions(formDataToSend);

      if (response?.status === true || response?.data?.status === true) {
        toast.success(
          editingId
            ? "Auction updated successfully!"
            : "Auction created successfully!"
        );
        setIsListView(true);
      } else {
        toast.error("Failed to save auction");
        console.error("Save issue:", response);
      }
    } catch (error) {
      console.error("❌ Auction Save Error:", error);
      console.error("Error details:", error.response?.data);
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong while saving auction!"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const renderTags = (tags, field) => (
    <div className="flex flex-wrap gap-2 mt-2">
      {tags.map((tag, index) => (
        <div
          key={index}
          className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
        >
          <span>{tag}</span>
          <button
            type="button"
            onClick={() => removeVendorTag(tag, field)}
            className="hover:text-red-600 transition-colors"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );

  const renderVendorDropdown = (
    showDropdown,
    filteredVendors,
    search,
    setSearch,
    field,
    placeholder
  ) =>
    showDropdown && (
      <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50">
        <div className="max-h-52 overflow-y-auto p-2">
          {filteredVendors.length > 0 ? (
            filteredVendors.map((vendor, index) => (
              <div
                key={index}
                onClick={() => handleVendorSelect(vendor, field)}
                className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                <p className="font-medium text-gray-700 dark:text-gray-200">
                  {vendor.organization}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 px-3 py-2">
              {search ? "No vendors found" : "Start typing to search vendors"}
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
    );

  return (
    <>
      <div className="max-w-6xl mx-auto mt-5 bg-white dark:bg-gray-900 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700">
        {/* -------- HEADER -------- */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsListView(true)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              title="Back"
              disabled={isSaving}
            >
              <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>

            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {editingId ? "Edit Auction" : "New Auctions"}
              <span className="text-sm text-orange-500 ml-1">
                • {editingId ? "Editing" : "Not Saved"}
              </span>
            </h1>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleClear}
              disabled={isSaving}
              className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 dark:text-white"
            >
              Clear Form
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {/* -------- FORM BODY -------- */}
        <div className="p-6 space-y-8">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Loading auction data...</span>
            </div>
          ) : (
            <>
              {/* AUCTION TYPE */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Auction Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="auctionType"
                    value={form.auctionType}
                    onChange={handleChange}
                    className={`w-full border rounded-lg p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                      errors.auctionType
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-700 focus:ring-blue-500"
                    }`}
                  >
                    <option>Ad hoc</option>
                    <option>STC</option>
                  </select>
                  {errors.auctionType && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.auctionType}
                    </p>
                  )}
                </div>
                <div className="flex-column mt-5 gap-2">
                  <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      name="roundTrip"
                      checked={form.roundTrip}
                      onChange={handleChange}
                      className="accent-blue-600"
                    />
                    Round Trip
                  </label>

                  <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      name="customGeofence"
                      checked={form.customGeofence}
                      onChange={handleChange}
                      className="accent-blue-600"
                    />
                    Custom Geofence
                  </label>
                </div>
              </div>

              {/* ROUTE DETAILS */}
              <div>
                <Section
                  title="Route Details"
                  open={openSection.route}
                  onClick={() => toggle("route")}
                />

                {openSection.route && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-1">
                    {/* Loading Field with Google Maps Autocomplete */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Loading <span className="text-red-500">*</span>
                      </label>
                      <SafeAutocomplete
                        onLoad={handleLoadingLoad}
                        onPlaceChanged={handleLoadingPlaceChanged}
                      >
                        <input
                          type="text"
                          value={form.loading}
                          onChange={handleLoadingChange}
                          placeholder="Enter loading location..."
                          className={`w-full px-3 h-9 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 ${
                            errors.loading
                              ? "border-red-500"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                        />
                      </SafeAutocomplete>
                      {errors.loading && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.loading}
                        </p>
                      )}
                    </div>

                    {/* Unloading Field with Google Maps Autocomplete */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Unloading <span className="text-red-500">*</span>
                      </label>
                      <SafeAutocomplete
                        onLoad={handleUnloadingLoad}
                        onPlaceChanged={handleUnloadingPlaceChanged}
                      >
                        <input
                          type="text"
                          value={form.unloading}
                          onChange={handleUnloadingChange}
                          placeholder="Enter unloading location..."
                          className={`w-full px-3 h-9 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 ${
                            errors.unloading
                              ? "border-red-500"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                        />
                      </SafeAutocomplete>
                      {errors.unloading && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.unloading}
                        </p>
                      )}
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
                        className={`w-full px-3 h-9 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 ${
                          errors.vehicleType
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                        }`}
                      />
                      {errors.vehicleType && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.vehicleType}
                        </p>
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
                            <p className="text-sm text-gray-500 px-3 py-2">
                              No vehicle types found
                            </p>
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
                      label="Vehicle Quantity"
                      name="vehicleQty"
                      type="number"
                      value={form.vehicleQty}
                      onChange={handleChange}
                      error={errors.vehicleQty}
                      required
                    />

                    <InputField
                      label="Branch"
                      name="branch"
                      value={form.branch}
                      onChange={handleChange}
                    />

                    <InputField
                      type="date"
                      label="Loading Date"
                      name="loadingDate"
                      value={form.loadingDate}
                      onChange={handleChange}
                    />
                    <InputField
                      type="time"
                      label="Loading Time"
                      name="loadingTime"
                      value={form.loadingTime}
                      onChange={handleChange}
                    />

                    <InputField
                      type="date"
                      label="Unloading Date"
                      name="unloadingDate"
                      value={form.unloadingDate}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </div>

              {/* EVENT TIMINGS */}
              <div>
                <Section
                  title="Event Timings"
                  open={openSection.timings}
                  onClick={() => toggle("timings")}
                />

                {openSection.timings && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <InputField
                      type="number"
                      label="Duration (mins)"
                      name="duration"
                      value={form.duration}
                      onChange={handleChange}
                      error={errors.duration}
                      required
                    />
                    <InputField
                      type="datetime-local"
                      label="Start Date *"
                      name="startDate"
                      value={form.startDate}
                      onChange={handleChange}
                      error={errors.startDate}
                      required
                    />
                    <InputField
                      type="datetime-local"
                      label="End Date *"
                      name="endDate"
                      value={form.endDate}
                      onChange={handleChange}
                      error={errors.endDate}
                      required
                    />
                  </div>
                )}
              </div>

              {/* MATERIAL DETAILS */}
              <div>
                <Section
                  title="Material Details"
                  open={openSection.material}
                  onClick={() => toggle("material")}
                />

                {openSection.material && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <InputField
                      label="Material Type"
                      name="materialType"
                      value={form.materialType}
                      onChange={handleChange}
                      error={errors.materialType}
                      required
                    />
                    <InputField
                      label="Material Quantity"
                      name="materialQty"
                      value={form.materialQty}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </div>

              {/* Material Extra Info */}
              <div>
                <Section
                  title="Material Extra Info"
                  open={openSection.materialExtra}
                  onClick={() => toggle("materialExtra")}
                />

                {openSection.materialExtra && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <InputField
                      label="Material Weight"
                      name="materialWeight"
                      value={form.materialWeight}
                      onChange={handleChange}
                    />
                    <InputField
                      label="Weight Unit"
                      name="weightUnit"
                      value={form.weightUnit}
                      onChange={handleChange}
                    />
                    <InputField
                      label="Dimensions (L x W x H)"
                      name="dimensions"
                      value={form.dimensions}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </div>

              {/* Transporter Details */}
              <div>
                <Section
                  title="Transporter Details"
                  open={openSection.transporterDetails}
                  onClick={() => toggle("transporterDetails")}
                />

                {openSection.transporterDetails && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    {/* Transporter Tag */}
                    <div className="relative" ref={transporterTagRef}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Transporter Tag
                      </label>
                      <input
                        type="text"
                        value={transporterTagSearch}
                        onChange={(e) => {
                          setTransporterTagSearch(e.target.value);
                          setShowTransporterTagDropdown(true);
                        }}
                        onFocus={() => setShowTransporterTagDropdown(true)}
                        placeholder="Search and select transporters..."
                        className="w-full px-3 h-9 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />

                      {renderTags(form.transporterTag, "transporterTag")}

                      {renderVendorDropdown(
                        showTransporterTagDropdown,
                        filteredTransporterTags,
                        transporterTagSearch,
                        setTransporterTagSearch,
                        "transporterTag",
                        "Search transporters..."
                      )}
                    </div>

                    {/* Exclude Transporters */}
                    <div className="relative" ref={excludeTransportersRef}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Exclude Transporters
                      </label>
                      <input
                        type="text"
                        value={excludeTransportersSearch}
                        onChange={(e) => {
                          setExcludeTransportersSearch(e.target.value);
                          setShowExcludeTransportersDropdown(true);
                        }}
                        onFocus={() => setShowExcludeTransportersDropdown(true)}
                        placeholder="Search and exclude transporters..."
                        className="w-full px-3 h-9 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />

                      {renderTags(
                        form.excludeTransporters,
                        "excludeTransporters"
                      )}

                      {renderVendorDropdown(
                        showExcludeTransportersDropdown,
                        filteredExcludeTransporters,
                        excludeTransportersSearch,
                        setExcludeTransportersSearch,
                        "excludeTransporters",
                        "Search transporters to exclude..."
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Documentation & Terms */}
              <div>
                <Section
                  title="Documentation & Terms"
                  open={openSection.docsTerms}
                  onClick={() => toggle("docsTerms")}
                />

                {openSection.docsTerms && (
                  <div className="space-y-4 mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <InputField
                        label="Terms and Conditions"
                        name="termsAndConditions"
                        value={form.termsAndConditions}
                        onChange={handleChange}
                      />

                      {/* File Upload Section */}
                      <div className="mt-0">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Upload Documents
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          />
                          <button
                            type="button"
                            onClick={triggerFileInput}
                            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm dark:text-white"
                          >
                            Choose File
                          </button>

                          {/* Eye icon for preview */}
                          {file && (
                            <button
                              type="button"
                              onClick={() =>
                                previewDocument(
                                  typeof file === "string" ? file : null
                                )
                              }
                              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                              <Eye className="h-5 w-5 text-blue-600" />
                            </button>
                          )}

                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {file
                              ? file.name
                                ? file.name
                                : "Uploaded File"
                              : "No file chosen"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* BID CONFIG */}
              <div>
                <Section
                  title="Auction Configurations"
                  open={openSection.config}
                  onClick={() => toggle("config")}
                />

                {openSection.config && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Bid Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="bidType"
                        value={form.bidType}
                        onChange={handleChange}
                        className={`w-full border rounded-lg p-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                          errors.bidType
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-700 focus:ring-blue-500"
                        }`}
                      >
                        <option>Per Tonne</option>
                        <option>Per km</option>
                        <option>Per Vehicle</option>
                        <option>Per Container</option>
                      </select>
                      {errors.bidType && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.bidType}
                        </p>
                      )}
                    </div>
                    <InputField
                      label="Min Bid Difference"
                      name="minBidDifference"
                      value={form.minBidDifference}
                      onChange={handleChange}
                    />

                    <InputField
                      label="Min Price"
                      name="minPrice"
                      value={form.minPrice}
                      onChange={handleChange}
                    />
                    <InputField
                      label="Max Price"
                      name="maxPrice"
                      value={form.maxPrice}
                      onChange={handleChange}
                    />

                    <InputField
                      label="Allowed Bids"
                      name="allowedBids"
                      value={form.allowedBids}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Document Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Document Preview
              </h3>
              <button
                onClick={closePreviewModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <div className="p-4 max-h-[calc(90vh-80px)] overflow-auto">
              {previewUrl &&
                (previewUrl.includes("pdf") ? (
                  <iframe
                    src={previewUrl}
                    className="w-full h-96 border-0"
                    title="Document Preview"
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt="Document Preview"
                    className="max-w-full h-auto mx-auto"
                  />
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Section({ title, open, onClick }) {
  return (
    <div
      className="flex items-center justify-between cursor-pointer select-none mt-2"
      onClick={onClick}
    >
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h2>
      <span className="text-gray-600 dark:text-gray-300">
        {open ? "▲" : "▼"}
      </span>
    </div>
  );
}
