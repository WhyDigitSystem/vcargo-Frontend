import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  Fuel,
  MapPin,
  Plus,
  Search,
  TruckIcon,
  Upload,
  Wrench,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import driverAPI from "../../api/TdriverAPI";
import vehicleAPI from "../../api/TvehicleAPI";

const Car = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 20l-5.447-2.724A1 1 0 013 16.382V7.618a1 1 0 011.447-.894L9 10m0 10v-6m0 6h6m-6 0h6m6 0v-6m0 6h-6m6 0a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const User = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const Info = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const File = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const FileText = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const Eye = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const Trash2 = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const Save = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
    />
  </svg>
);

const X = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

// Vehicle Form Component

const VehicleForm = ({ vehicle, onSave, onCancel, isOpen }) => {
  const [activeTab, setActiveTab] = useState("details");
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    type: "Container Truck",
    model: "",
    capacity: "",
    status: "ACTIVE",
    insuranceExpiry: "",
    fitnessExpiry: "",
    lastService: "",
    nextService: "",
    driverId: "",
    driverName: "",
    driverPhone: "",
    currentLocation: "",
    fuelEfficiency: "",
    year: new Date().getFullYear(),
    chassisNumber: "",
    engineNumber: "",
    permitType: "National",
    registrationType: "",
    ownerName: "Self",
    maintenanceRequired: false,
  });

  const userId = JSON.parse(localStorage.getItem("user"))?.usersId || "";

  const { user } = useSelector((state) => state.auth);
  const orgId = user.orgId;

  // New state for file uploads
  const [files, setFiles] = useState({
    rc: [],
    insurance: [],
    fitness: [],
    permit: [],
    puc: [],
    other: [],
  });

  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [drivers, setDrivers] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    console.log("Current formData status:", formData.status);
  }, [formData.status]);

  useEffect(() => {
    console.log("Vechicle", vehicle);

    if (vehicle) {
      // Check if vehicle is nested in tvehiclesVO.data
      let vehicleData = vehicle;

      if (
        vehicle.tvehiclesVO &&
        vehicle.tvehiclesVO.data &&
        vehicle.tvehiclesVO.data.length > 0
      ) {
        // If vehicle comes from API response with tvehiclesVO structure
        vehicleData = vehicle.tvehiclesVO.data[0];
      }

      console.log("Vehicle data for form:", vehicleData);
      console.log("Original status from API:", vehicleData.active);

      // Map the status from API to form format
      const apiStatus = vehicleData.status || "";
      let formStatus = "ACTIVE"; // default

      if (apiStatus) {
        // Convert from any case to uppercase for the select field
        formStatus = apiStatus.toUpperCase();
      }

      console.log("Mapped form status:", formStatus);

      setFormData({
        vehicleNumber: vehicleData.vehicleNumber || "",
        type: vehicleData.type || "Container Truck",
        model: vehicleData.model || "",
        capacity: vehicleData.capacity || "",
        status: formStatus,
        insuranceExpiry: vehicleData.insuranceExpiry || "",
        fitnessExpiry: vehicleData.fitnessExpiry || "",
        lastService: vehicleData.lastService || "",
        nextService: vehicleData.nextService || "",
        driverId: vehicleData.driverId || "",
        driverName: vehicleData.driver || "",
        driverPhone: vehicleData.driverPhone || "",
        currentLocation: vehicleData.currentLocation || "",
        fuelEfficiency: vehicleData.fuelEfficiency || "",
        year: vehicleData.year || new Date().getFullYear(),
        chassisNumber: vehicleData.chassisNumber || "",
        engineNumber: vehicleData.engineNumber || "",
        permitType: vehicleData.permitType || "National",
        registrationType: vehicleData.registrationType || "",
        ownerName: vehicleData.ownerName || "Self",
        maintenanceRequired: vehicleData.maintenanceRequired || false,
      });

      // If vehicle has existing files, load them
      if (vehicleData.documents && vehicleData.documents.length > 0) {
        // Transform API documents to your files structure
        const transformedFiles = {
          rc: [],
          insurance: [],
          fitness: [],
          permit: [],
          puc: [],
          other: [],
        };

        // Map documentType from API to your file type keys
        const documentTypeMapping = {
          RC: "rc",
          INSURANCE: "insurance",
          FC: "fitness",
          PERMIT: "permit",
          PUC: "puc",
          OTHER: "other",
        };

        vehicleData.documentObjects.forEach((doc) => {
          const fileType = documentTypeMapping[doc.documentType];
          if (fileType) {
            transformedFiles[fileType].push({
              id: doc.id,
              name: doc.fileName,
              type: doc.fileType,
              size: doc.fileSize,
              url: doc.filePath, // Use the filePath from API as URL
              uploadedAt: doc.uploadedOn,
              // originalFile will be null for existing files from server
            });
          }
        });

        console.log("Transformed files:", transformedFiles);
        setFiles(transformedFiles);
      } else {
        // Reset files if no documents
        console.log("No documents found, resetting files");
        setFiles({
          rc: [],
          insurance: [],
          fitness: [],
          permit: [],
          puc: [],
          other: [],
        });
      }
    } else {
      // Reset form for new vehicle
      console.log("Resetting form for new vehicle");
      setFormData({
        vehicleNumber: "",
        type: "Container Truck",
        model: "",
        capacity: "",
        status: "ACTIVE", // Explicitly set default status
        insuranceExpiry: "",
        fitnessExpiry: "",
        lastService: "",
        nextService: "",
        driver: "",
        driverPhone: "",
        currentLocation: "",
        fuelEfficiency: "",
        year: new Date().getFullYear(),
        chassisNumber: "",
        engineNumber: "",
        permitType: "National",
        registrationType: "",
        ownerName: "Self",
        maintenanceRequired: false,
      });
      setFiles({
        rc: [],
        insurance: [],
        fitness: [],
        permit: [],
        puc: [],
        other: [],
      });
    }
  }, [vehicle, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    // Vehicle Number
    const vehicleNumberError = validateVehicleNumber(formData.vehicleNumber);
    if (vehicleNumberError) newErrors.vehicleNumber = vehicleNumberError;

    // Model
    if (!formData.model.trim()) {
      newErrors.model = "Model is required";
    }

    // Capacity
    if (!formData.capacity.trim()) {
      newErrors.capacity = "Capacity is required";
    }

    // Insurance Expiry
    if (!formData.insuranceExpiry) {
      newErrors.insuranceExpiry = "Insurance expiry date is required";
    }

    // Fitness Expiry
    if (!formData.fitnessExpiry) {
      newErrors.fitnessExpiry = "Fitness expiry date is required";
    }

    // Status
    if (!formData.status) {
      newErrors.status = "Vehicle status is required";
    }

    // 🔴 DOCUMENT VALIDATION
    if (files.rc.length === 0) {
      newErrors.rc = "RC document is required";
    }

    if (files.insurance.length === 0) {
      newErrors.insurance = "Insurance document is required";
    }

    if (files.fitness.length === 0) {
      newErrors.fitness = "Fitness certificate is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = async (fileType, file) => {
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      alert("Please upload only JPG, PNG, or PDF files");
      return;
    }

    if (file.size > maxSize) {
      alert("File size should be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      const newFile = {
        id: Date.now(), // Temporary ID for new files
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString(),
        originalFile: file, // Store original File object for upload
        isNew: true, // Flag to identify new files
      };

      setFiles((prev) => ({
        ...prev,
        [fileType]: [...prev[fileType], newFile],
      }));
    } catch (error) {
      alert("Error uploading file. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      const response = await driverAPI.getDrivers(1, 10, orgId);

      const normalizedDrivers = response.drivers.map((d) => ({
        ...d,
        active: d.status?.toLowerCase() === "active",
      }));

      setDrivers(normalizedDrivers);
    } catch (error) {
      console.error("Error loading drivers:", error);
    }
  };

  const handleFileChange = (fileType, event) => {
    const selectedFiles = Array.from(event.target.files);
    selectedFiles.forEach((file) => {
      handleFileUpload(fileType, file);
    });
    event.target.value = ""; // Reset file input
  };

  const [filesToDelete, setFilesToDelete] = useState([]);

  const removeFile = (fileType, fileId) => {
    const file = files[fileType].find((f) => f.id === fileId);

    // Check if it's an existing file from server (has server ID and no originalFile)
    if (file && file.id > 1000000000 && !file.originalFile) {
      // Mark for deletion on server
      setFilesToDelete((prev) => [
        ...prev,
        { fileType, fileId, serverId: file.id },
      ]);
    }

    // Remove from local state
    setFiles((prev) => ({
      ...prev,
      [fileType]: prev[fileType].filter((file) => file.id !== fileId),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    setSaving(true);
    try {
      // Prepare the vehicle data object with correct date formatting
      const formatDateForAPI = (dateString) => {
        if (!dateString) return null;
        try {
          const date = new Date(dateString);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        } catch (e) {
          return null;
        }
      };

      const vehicleData = {
        vehicleNumber: formData.vehicleNumber,
        type: formData.type,
        model: formData.model,
        capacity: formData.capacity,
        active: formData.status,
        insuranceExpiry: formatDateForAPI(formData.insuranceExpiry),
        fitnessExpiry: formatDateForAPI(formData.fitnessExpiry),
        lastService: formatDateForAPI(formData.lastService),
        nextService: formatDateForAPI(formData.nextService),
        driverId: formData.driverId,
        driver: formData.driverName,
        driverPhone: formData.driverPhone || "",
        currentLocation: formData.currentLocation || "",
        fuelEfficiency: formData.fuelEfficiency || "",
        maintenanceRequired: formData.maintenanceRequired || false,
        year: parseInt(formData.year) || new Date().getFullYear(),
        chassisNumber: formData.chassisNumber || "",
        engineNumber: formData.engineNumber || "",
        permitType: formData.permitType || "National",
        registrationType: formData.registrationType || "",
        ownerName: formData.ownerName || "Self",
        userId: userId,
        orgId: orgId,
        branchCode: "CHE001",
        branchName: "Chennai",
        createdBy: "Admin",
      };

      // Add ID if editing
      if (vehicle?.id) {
        vehicleData.id = vehicle.id;
      }

      // Create FormData
      const formDataToSend = new FormData();

      // Add vehicle data as tvehicleDTO binary blob
      const vehicleDataJSON = JSON.stringify(vehicleData);
      const vehicleDataBlob = new Blob([vehicleDataJSON], {
        type: "application/json",
      });

      formDataToSend.append(
        "tvehicleDTO",
        vehicleDataBlob,
        "tvehicleDTO.json"
      );

      // Add files to delete if any
      if (filesToDelete.length > 0) {
        formDataToSend.append("filesToDelete", JSON.stringify(filesToDelete));
      }

      // Add files according to API parameter names
      const apiFileMappings = {
        rc: "RC",
        insurance: "INSURANCE",
        fitness: "FC",
        permit: "PERMIT",
        puc: "PUC",
        other: "OTHER",
      };

      // Append each file to the correct API parameter
      Object.keys(files).forEach((fileType) => {
        const apiParamName = apiFileMappings[fileType];

        if (apiParamName && files[fileType].length > 0) {
          files[fileType].forEach((file) => {
            // Only upload new files (with originalFile)
            if (file.originalFile) {
              formDataToSend.append(
                apiParamName,
                file.originalFile,
                file.name
              );
            }
          });
        }
      });

      await onSave(formDataToSend);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Helper function to format vehicle number as user types
  const formatVehicleNumber = (input) => {
    // Remove all non-alphanumeric characters
    let cleaned = input.replace(/[^A-Z0-9]/gi, "");

    // Limit to 10 characters (2 for state, 2 for district, 2 for series, 4 for number)
    cleaned = cleaned.substring(0, 10);

    if (cleaned.length === 0) return "";

    // Format based on length
    let formatted = cleaned;

    if (cleaned.length > 2) {
      formatted = cleaned.substring(0, 2) + "-" + cleaned.substring(2);
    }

    if (cleaned.length > 4) {
      formatted = formatted.substring(0, 5) + "-" + formatted.substring(5);
    }

    if (cleaned.length > 6) {
      formatted = formatted.substring(0, 8) + "-" + formatted.substring(8);
    }

    return formatted;
  };

  // Helper function to validate and finalize format on blur
  const formatAndValidateVehicleNumber = (input) => {
    // Remove all non-alphanumeric characters
    let cleaned = input.replace(/[^A-Z0-9]/gi, "");

    // Check if we have a complete number (10 characters)
    if (cleaned.length < 10) {
      return input; // Return as-is, validation will catch it
    }

    // Format as TN-10-AB-7878
    return (
      cleaned.substring(0, 2) +
      "-" +
      cleaned.substring(2, 4) +
      "-" +
      cleaned.substring(4, 6) +
      "-" +
      cleaned.substring(6, 10)
    );
  };

  // Also add a validation function in your existing validation logic:
  const validateVehicleNumber = (value) => {
    if (!value) return "Vehicle number is required";

    // Remove dashes for validation
    const cleaned = value.replace(/-/g, "");

    // if (cleaned.length !== 10) {
    //   return "Vehicle number must be 10 characters (e.g., TN-10-AB-7878)";
    // }

    // First 2 should be letters (state code)
    // if (!/^[A-Z]{2}$/.test(cleaned.substring(0, 2))) {
    //   return "First 2 characters should be state code letters";
    // }

    // Next 2 should be numbers (district code)
    // if (!/^[0-9]{2}$/.test(cleaned.substring(2, 4))) {
    //   return "District code should be 2 digits";
    // }

    // Next 2 should be letters (series)
    // if (!/^[A-Z]{2}$/.test(cleaned.substring(4, 6))) {
    //   return "Series should be 2 letters";
    // }

    // Last 4 should be numbers
    // if (!/^[0-9]{4}$/.test(cleaned.substring(6, 10))) {
    //   return "Last 4 characters should be numbers";
    // }

    return null; // No error
  };

  const fileTypes = [
    {
      key: "rc",
      label: "RC Document",
      icon: "📄",
      required: true,
      apiParam: "RC", // Add API parameter name
    },
    {
      key: "insurance",
      label: "Insurance Certificate",
      icon: "🛡️",
      required: true,
      apiParam: "INSURANCE",
    },
    {
      key: "fitness",
      label: "Fitness Certificate",
      icon: "✅",
      required: true,
      apiParam: "FC", // Note: API expects "FC" not "FITNESS"
    },
    {
      key: "permit",
      label: "Permit Documents",
      icon: "📋",
      apiParam: "PERMIT",
    },
    {
      key: "puc",
      label: "PUC Certificate",
      icon: "🌿",
      apiParam: "PUC",
    },
    {
      key: "other",
      label: "Other Documents",
      icon: "📎",
      apiParam: "OTHER",
    },
  ];

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-6xl my-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {vehicle ? "Edit Vehicle" : "Add New Vehicle"}
          </h2>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            disabled={saving}
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-1 px-4">
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === "details"
                ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
            >
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                Vehicle Details
              </div>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("documents")}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === "documents"
                ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                : "text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
            >
              <div className="flex items-center gap-2">
                <File className="h-4 w-4" />
                Documents
              </div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {/* Vehicle Details Tab */}
          {activeTab === "details" && (
            <div className="space-y-6 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
              {/* Basic Information Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Row 1 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Vehicle Number *
                    </label>
                    <input
                      type="text"
                      value={formData.vehicleNumber}
                      onChange={(e) => {
                        const rawValue = e.target.value.toUpperCase();
                        const formattedValue = formatVehicleNumber(rawValue);
                        handleChange("vehicleNumber", formattedValue);
                      }}
                      onBlur={(e) => {
                        // Validate and finalize format on blur
                        const formattedValue = formatAndValidateVehicleNumber(
                          e.target.value
                        );
                        handleChange("vehicleNumber", formattedValue);
                      }}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.vehicleNumber
                        ? "border-red-500"
                        : "border-gray-300"
                        }`}
                      placeholder="TN-10-AB-7878"
                      disabled={saving}
                      maxLength={13} // TN-10-AB-7878 = 13 characters max
                    />
                    {errors.vehicleNumber && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.vehicleNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Vehicle Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleChange("type", e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      disabled={saving}
                    >
                      <option value="CONTAINER_TRUCK">Container Truck</option>
                      <option value="OPEN_TRUCK">Open Truck</option>
                      <option value="TRAILER">Trailer</option>
                      <option value="FLATBED">Flatbed Truck</option>
                      <option value="TANKER">Tanker</option>
                      <option value="TIPPER">Tipper</option>
                      <option value="REEFER">Reefer (Refrigerated)</option>

                      {/* LCV */}
                      <option value="LCV">LCV</option>
                      <option value="PICKUP">Pickup Truck</option>
                      <option value="MINI_TRUCK">Mini Truck</option>

                      {/* Special */}
                      <option value="CAR_CARRIER">Car Carrier</option>
                      <option value="COURIER_VAN">Courier Van</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Model *
                    </label>
                    <input
                      type="text"
                      value={formData.model}
                      onChange={(e) => {
                        const value = e.target.value
                          .toUpperCase() // force uppercase
                          .replace(/[^A-Z0-9 ]/g, ""); // allow A–Z, 0–9, and SPACE

                        handleChange("model", value);
                      }}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.model ? "border-red-500" : "border-gray-300"
                        }`}
                      placeholder="Tata Prima 5530.S"
                      disabled={saving}
                    />
                    {errors.model && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.model}
                      </p>
                    )}
                  </div>

                  {/* Row 2 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Capacity *
                    </label>
                    <input
                      type="text"
                      value={formData.capacity}
                      onChange={(e) => {
                        const value = e.target.value
                          .toUpperCase()
                          .replace(/[^A-Z0-9 /]/g, "") // allow letters, numbers, space, /
                          .replace(/\s+/g, " "); // collapse extra spaces

                        handleChange("capacity", value);
                      }}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.capacity ? "border-red-500" : "border-gray-300"
                        }`}
                      placeholder="40 FT / 25 Tons"
                      disabled={saving}
                    />
                    {errors.capacity && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.capacity}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Insurance Expiry *
                    </label>
                    <input
                      type="date"
                      value={formData.insuranceExpiry}
                      min={today}
                      onChange={(e) =>
                        handleChange("insuranceExpiry", e.target.value)
                      }
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.insuranceExpiry
                        ? "border-red-500"
                        : "border-gray-300"
                        }`}
                      disabled={saving}
                    />
                    {errors.insuranceExpiry && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.insuranceExpiry}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Fitness Expiry *
                    </label>
                    <input
                      type="date"
                      value={formData.fitnessExpiry}
                      min={today}
                      onChange={(e) =>
                        handleChange("fitnessExpiry", e.target.value)
                      }
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.fitnessExpiry
                        ? "border-red-500"
                        : "border-gray-300"
                        }`}
                      disabled={saving}
                    />
                    {errors.fitnessExpiry && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.fitnessExpiry}
                      </p>
                    )}
                  </div>

                  {/* Row 3 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status *
                    </label>
                    <select
                      value={formData.status || ""}
                      onChange={(e) => handleChange("status", e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      disabled={saving}
                    >
                      <option value="">Select Status</option>
                      <option value="ACTIVE">Active</option>
                      <option value="MAINTENANCE">Maintenance</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                    {!formData.status && (
                      <p className="text-red-500 text-xs mt-1">
                        Please select a status
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Year
                    </label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) =>
                        handleChange("year", parseInt(e.target.value))
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      min="2000"
                      max={new Date().getFullYear() + 1}
                      disabled={saving}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Permit Type
                    </label>
                    <select
                      value={formData.permitType}
                      onChange={(e) =>
                        handleChange("permitType", e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      disabled={saving}
                    >
                      <option value="National">National</option>
                      <option value="State">State</option>
                      <option value="All India">All India</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Registration Type
                    </label>
                    <select
                      value={formData.registrationType}
                      onChange={(e) =>
                        handleChange("registrationType", e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      disabled={saving}
                    >
                      <option value="">Select Registration Type</option>
                      <option value="TEMPORARY">Temporary Registration</option>
                      <option value="PRIVATE">Private</option>
                      <option value="COMMERCIAL">Commercial</option>
                      <option value="GOVERNMENT">Government</option>
                      <option value="TOURIST">Tourist Permit</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Driver & Service Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  Driver & Service Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Driver Name
                    </label>
                    <select
                      value={formData.driverId}
                      onChange={(e) => {
                        const driverId = Number(e.target.value);
                        const selectedDriver = drivers.find((d) => d.id === driverId);

                        handleChange("driverId", driverId);
                        handleChange("driverName", selectedDriver?.name || "");
                        handleChange("driverPhone", selectedDriver?.phone || "");
                      }}
                      disabled={saving}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Driver</option>
                      {drivers
                        ?.filter((d) => d.status?.toLowerCase() === "active")
                        ?.map((driver) => (
                          <option key={driver.id} value={driver.id}>
                            {driver.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Driver Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.driverPhone}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="+91 9876543210"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Current Station
                    </label>
                    <input
                      type="text"
                      value={formData.currentLocation}
                      onChange={(e) =>
                        handleChange("currentLocation", e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Mumbai"
                      disabled={saving}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Service
                    </label>
                    <input
                      type="date"
                      value={formData.lastService}
                      max={today}
                      onChange={(e) =>
                        handleChange("lastService", e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      disabled={saving}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Next Service
                    </label>
                    <input
                      type="date"
                      value={formData.nextService}
                      min={today}
                      onChange={(e) =>
                        handleChange("nextService", e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      disabled={saving}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Fuel Efficiency
                    </label>

                    <div className="relative">
                      <input
                        type="text"
                        value={formData.fuelEfficiency}
                        maxLength={4}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/[^0-9.]/g, "") // allow digits & dot
                            .replace(/(\..*)\./g, "$1"); // allow only ONE dot

                          handleChange("fuelEfficiency", value);
                        }}
                        className="w-full px-3 py-2 pr-14 text-sm border border-gray-300 dark:border-gray-600 
                 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 
                 dark:bg-gray-700 dark:text-white"
                        placeholder="e.g. 4.2"
                        disabled={saving}
                      />

                      {/* UNIT */}
                      <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500 dark:text-gray-400 pointer-events-none">
                        KMPL
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Details */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  Technical Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Chassis Number
                    </label>
                    <input
                      type="text"
                      value={formData.chassisNumber}
                      maxLength={17}
                      onChange={(e) => {
                        const value = e.target.value
                          .toUpperCase()
                          .replace(/[^A-Z0-9]/g, ""); // only A–Z & 0–9

                        handleChange("chassisNumber", value);
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Chassis number"
                      disabled={saving}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Engine Number
                    </label>
                    <input
                      type="text"
                      value={formData.engineNumber}
                      maxLength={17}
                      onChange={(e) => {
                        const value = e.target.value
                          .toUpperCase()
                          .replace(/[^A-Z0-9]/g, "");

                        handleChange("engineNumber", value);
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Engine number"
                      disabled={saving}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Vehicle Ownership
                    </label>
                    <select
                      value={formData.ownerName}
                      onChange={(e) =>
                        handleChange("ownerName", e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      disabled={saving}
                    >
                      <option value="Self">Self</option>
                      <option value="Third Party">Third Party</option>
                      <option value="Leased">Leased</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === "documents" && (
            <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Upload Vehicle Documents
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Max 5MB per file (JPG, PNG, PDF). Required documents are
                  marked with *
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {fileTypes.map((fileType) => (
                  <div
                    key={fileType.key}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{fileType.icon}</span>
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {fileType.label}
                              {fileType.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {files[fileType.key]?.length || 0} file(s)
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1">
                        {files[fileType.key] &&
                          files[fileType.key].length > 0 ? (
                          <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                            {files[fileType.key].map((file) => (
                              <div
                                key={file.id}
                                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded"
                              >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                  <div className="min-w-0">
                                    <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                      {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {formatFileSize(file.size)}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                    title="Preview"
                                  >
                                    <Eye className="h-4 w-4 text-gray-500" />
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeFile(fileType.key, file.id)
                                    }
                                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500"
                                    disabled={saving}
                                    title="Remove"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg h-full flex flex-col justify-center items-center">
                            <File className="h-10 w-10 text-gray-400 mb-3" />
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                              No files uploaded
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              Click below to upload
                            </p>
                          </div>
                        )}
                      </div>

                      <label className="mt-4 text-sm px-3 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors font-medium text-center">
                        <Plus className="h-4 w-4 inline mr-2" />
                        Add File
                        <input
                          type="file"
                          multiple
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => handleFileChange(fileType.key, e)}
                          className="hidden"
                          disabled={uploading || saving}
                        />
                      </label>
                      {/* 🔴 Document Validation Error */}
                      {errors[fileType.key] && (
                        <p className="text-xs text-red-500 mt-2 text-center">
                          {errors[fileType.key]}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-between items-center pt-4 mt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setActiveTab(
                    activeTab === "details" ? "documents" : "details"
                  )
                }
                className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                disabled={saving}
              >
                {activeTab === "details" ? (
                  <>
                    <File className="h-4 w-4" />
                    Go to Documents
                  </>
                ) : (
                  <>
                    <Car className="h-4 w-4" />
                    Go to Details
                  </>
                )}
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onCancel}
                disabled={saving}
                className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {vehicle ? "Update Vehicle" : "Add Vehicle"}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Vehicle Management Component
const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [notification, setNotification] = useState(null);
  const userId = JSON.parse(localStorage.getItem("user"))?.usersId || "";
  const { user } = useSelector((state) => state.auth);
  const orgId = user.orgId;

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Load vehicles on component mount and when filters/page changes
  useEffect(() => {
    loadVehicles();
  }, [pagination.currentPage]); // Reload when page changes

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const { vehicles: fetchedVehicles, pagination: fetchedPagination } =
        await vehicleAPI.getVehicles(
          pagination.currentPage,
          pagination.pageSize,
          orgId
        );

      const processedVehicles = fetchedVehicles.map((vehicle) => ({
        ...vehicle,
        documents: vehicle.documents || [],
        status: (vehicle.status || "ACTIVE").toLowerCase(),
        fuelEfficiency: vehicle.fuelEfficiency || "N/A",
        currentLocation: vehicle.currentLocation || "Not specified",
        driver: vehicle.driver || "Not assigned",
        maintenanceRequired: vehicle.maintenanceRequired || false,
      }));

      setVehicles(processedVehicles);
      setPagination((prev) => ({
        ...prev,
        totalCount: fetchedPagination.totalCount,
        totalPages: fetchedPagination.totalPages,
        pageSize: fetchedPagination.pageSize,
      }));
    } catch (error) {
      console.error("Error loading vehicles:", error);
      setVehicles([]);
      showNotification("Failed to load vehicles", "error");
    } finally {
      setLoading(false);
    }
  };

  // Filter vehicles based on search and status - for display only
  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driver?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.type?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || vehicle.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleFormSave = async (formData) => {
    try {
      console.log("Saving vehicle with FormData...");

      // Since formData is now a FormData object, send it directly
      const response = await vehicleAPI.createUpdateVehicle(formData);

      if (response && response.statusFlag === "Ok") {
        // Reload vehicles with current page
        await loadVehicles();

        // Close form
        setShowForm(false);
        setEditingVehicle(null);

        // Show success message
        showNotification(
          editingVehicle
            ? "Vehicle updated successfully!"
            : "Vehicle added successfully!"
        );
      } else {
        throw new Error(response?.message || "Failed to save vehicle");
      }
    } catch (error) {
      console.error("Error saving vehicle:", error);
      showNotification(`Error: ${error.message}`, "error");
    }
  };

  // Add these states near your other state declarations
  const [currentFilteredPage, setCurrentFilteredPage] = useState(1);
  const [filteredPageSize] = useState(10);

  // Calculate pagination for filtered results
  const filteredTotalPages = Math.ceil(
    filteredVehicles.length / filteredPageSize
  );
  const filteredIndexLast = currentFilteredPage * filteredPageSize;
  const filteredIndexFirst = filteredIndexLast - filteredPageSize;
  const currentFilteredItems = filteredVehicles.slice(
    filteredIndexFirst,
    filteredIndexLast
  );

  // Update the filtered pagination when filters change
  useEffect(() => {
    setCurrentFilteredPage(1);
  }, [searchTerm, statusFilter]);

  // Update your table to show currentFilteredItems instead of filteredVehicles

  const handleDeleteVehicle = async (id) => {
    try {
      await vehicleAPI.deleteVehicle(id);
      await loadVehicles();
      setDeleteConfirm(null);
      showNotification("Vehicle deleted successfully!");
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      showNotification(`Error deleting vehicle: ${error.message}`, "error");
    }
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingVehicle(null);
    setShowForm(true);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingVehicle(null);
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: pageNumber }));
    }
  };

  // Calculate stats from ALL vehicles (not just filtered)
  const stats = {
    total: pagination.totalCount, // Use total count from backend
    active: vehicles.filter((v) => v.status === "active").length,
    maintenance: vehicles.filter((v) => v.status === "maintenance").length,
    documentsExpiring: vehicles.filter((v) => {
      if (!v.insuranceExpiry) return false;
      try {
        const expiryDate = new Date(v.insuranceExpiry);
        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);
        return expiryDate >= today && expiryDate <= thirtyDaysFromNow;
      } catch (e) {
        return false;
      }
    }).length,
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        icon: CheckCircle,
      },
      maintenance: {
        color:
          "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
        icon: AlertTriangle,
      },
      inactive: {
        color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
        icon: XCircle,
      },
    };

    const config = statusConfig[status] || statusConfig.inactive;
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <IconComponent className="h-3 w-3" />
        {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
      </span>
    );
  };

  const getDocumentIcons = (documents = []) => {
    const documentCount = documents.length;
    return (
      <div className="flex items-center gap-1">
        <div className="flex -space-x-1">
          {documents.slice(0, 3).map((doc, index) => (
            <div
              key={index}
              className="w-6 h-6 bg-blue-100 border border-white rounded-full flex items-center justify-center text-xs text-blue-600 font-medium"
            >
              {typeof doc === "string" ? doc.charAt(0) : "D"}
            </div>
          ))}
        </div>
        {documentCount > 3 && (
          <span className="text-xs text-gray-500">+{documentCount - 3}</span>
        )}
        {documentCount === 0 && (
          <span className="text-xs text-gray-400">No documents</span>
        )}
      </div>
    );
  };

  const calculateNextServiceDate = (lastService, intervalDays = 90) => {
    if (!lastService) return null;

    const lastDate = new Date(lastService);
    if (isNaN(lastDate)) return null;

    const nextDate = new Date(lastDate);
    nextDate.setDate(lastDate.getDate() + intervalDays);

    return nextDate;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  const getDaysRemaining = (nextDate) => {
    if (!nextDate) return null;
    const today = new Date();
    const diff = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <TruckIcon className="h-12 w-12 text-indigo-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading vehicles...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${notification.type === "error"
            ? "bg-red-100 text-red-800 border border-red-300"
            : "bg-green-100 text-green-800 border border-green-300"
            }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "error" ? (
              <AlertTriangle className="h-5 w-5" />
            ) : (
              <CheckCircle className="h-5 w-5" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <TruckIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              Vehicle Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your fleet, maintenance, and vehicle documents
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <button
              onClick={loadVehicles}
              className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={handleAddNew}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add New Vehicle
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Vehicles
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.total}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <TruckIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Vehicles
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.active}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Under Maintenance
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.maintenance}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Wrench className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Documents Expiring
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.documentsExpiring}
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by vehicle number, model, driver..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="inactive">Inactive</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              <Upload className="h-4 w-4" />
              Import
            </button>
          </div>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Vehicle Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Driver & Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Documents
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Maintenance
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredVehicles.length === 0 && vehicles.length > 0 ? (
                // No search results but there are vehicles
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No matching vehicles found
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Try adjusting your search or filter criteria
                      </p>
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setStatusFilter("all");
                        }}
                        className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredVehicles.length === 0 ? (
                // No vehicles at all (empty state)
                ""
              ) : (
                filteredVehicles.map((vehicle) => {
                  const nextServiceDate = calculateNextServiceDate(
                    vehicle.lastService,
                    vehicle.serviceIntervalDays || 90
                  );

                  const daysRemaining = getDaysRemaining(nextServiceDate);

                  return (
                    <tr
                      key={vehicle.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      {/* VEHICLE INFO */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                            <TruckIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {vehicle.vehicleNumber}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {vehicle.model}
                            </div>
                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              {vehicle.type} • {vehicle.capacity}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4">
                        {getStatusBadge(vehicle.status)}
                        {vehicle.maintenanceRequired && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-orange-600 dark:text-orange-400">
                            <Wrench className="h-3 w-3" />
                            Maintenance Due
                          </div>
                        )}
                      </td>

                      {/* DRIVER */}
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {vehicle.driver}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <MapPin className="h-3 w-3" />
                          {vehicle.currentLocation}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mt-1">
                          <Fuel className="h-3 w-3" />
                          {vehicle.fuelEfficiency}
                        </div>
                      </td>

                      {/* DOCUMENTS */}
                      <td className="px-6 py-4">
                        {getDocumentIcons(vehicle.documents)}
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Insurance: {vehicle.insuranceExpiry || "N/A"}
                        </div>
                      </td>

                      {/* SERVICE */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          Last: {vehicle.lastService || "N/A"}
                        </div>

                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Next: {formatDate(nextServiceDate)}
                          {nextServiceDate && (
                            <div
                              className={`text-xs mt-1 ${daysRemaining <= 0
                                ? "text-red-500"
                                : daysRemaining <= 7
                                  ? "text-orange-500"
                                  : "text-green-500"
                                }`}
                            >
                              {daysRemaining <= 0
                                ? "Service overdue"
                                : `${daysRemaining} days remaining`}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleEdit(vehicle)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {vehicles.length === 0 && (
          <div className="text-center py-12">
            <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {vehicles.length === 0
                ? "No vehicles found"
                : "No matching vehicles"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {vehicles.length === 0
                ? "Add your first vehicle to get started"
                : "Try adjusting your search or filter criteria"}
            </p>
            {vehicles.length === 0 && (
              <button
                onClick={handleAddNew}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Your First Vehicle
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalCount > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing{" "}
              <span className="font-medium">
                {Math.min(
                  (pagination.currentPage - 1) * pagination.pageSize + 1,
                  pagination.totalCount
                )}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(
                  pagination.currentPage * pagination.pageSize,
                  pagination.totalCount
                )}
              </span>{" "}
              of <span className="font-medium">{pagination.totalCount}</span>{" "}
              vehicles
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className={`p-2 rounded-lg border ${pagination.currentPage === 1
                  ? "border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  // Show first, last, and pages around current
                  if (pagination.totalPages <= 5) return true;
                  if (page === 1 || page === pagination.totalPages) return true;
                  if (
                    page >= pagination.currentPage - 1 &&
                    page <= pagination.currentPage + 1
                  )
                    return true;
                  return false;
                })
                .map((page, index, array) => {
                  // Add ellipsis for skipped pages
                  const prevPage = array[index - 1];
                  if (prevPage && page - prevPage > 1) {
                    return (
                      <React.Fragment key={`ellipsis-${page}`}>
                        <span className="px-2 text-gray-500">...</span>
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 rounded-lg ${pagination.currentPage === page
                            ? "bg-indigo-600 text-white"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-lg ${pagination.currentPage === page
                        ? "bg-indigo-600 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                    >
                      {page}
                    </button>
                  );
                })}

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className={`p-2 rounded-lg border ${pagination.currentPage === pagination.totalPages
                  ? "border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Vehicle Form Modal */}
      <VehicleForm
        vehicle={editingVehicle}
        onSave={handleFormSave}
        onCancel={handleFormCancel}
        isOpen={showForm}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Vehicle
              </h3>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete vehicle{" "}
              <strong>{deleteConfirm.vehicleNumber}</strong>? This action cannot
              be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteVehicle(deleteConfirm.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Vehicle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;
