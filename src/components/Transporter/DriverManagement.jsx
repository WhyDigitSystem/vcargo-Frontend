import {
  AlertTriangle,
  Award,
  Car,
  CheckCircle,
  ChevronDown,
  Clock,
  Download,
  Edit,
  Eye,
  MapPin,
  Phone,
  Plus,
  Save,
  Search,
  Trash2,
  Upload,
  User,
  X,
  XCircle,
} from "lucide-react";

import { Briefcase, File, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import driverAPI from "../../api/TdriverAPI";

// Import the driverAPI

// Driver Form Component
const DriverForm = ({ driver, onSave, onCancel, isOpen, showNotification }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    licenseNumber: "",
    licenseExpiry: "",
    aadharNumber: "",
    address: "",
    status: "Active",
    experience: "",
    salary: "",
    assignedVehicle: "",
    bloodGroup: "",
    emergencyContact: "",
    joinedDate: new Date().toISOString().split("T")[0],
    performance: "4.5/5",
    branchCode: "MAIN",
    branchName: "Main Branch",
  });

  const [activeTab, setActiveTab] = useState("personal");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const orgId = user.orgId;

  // Update the useEffect that loads driver data when editing:
  useEffect(() => {
    if (!isOpen) return;

    // Map API document types → UI file keys
    const documentTypeMapping = {
      DL: "driverLicense",
      AADHAR: "aadharCard",
      PAN: "panCard",
      PHOTO: "passportPhoto",
      EXP: "experienceCertificate",
      MEDICAL: "medicalCertificate",
    };

    // -------------------------------
    // EDIT DRIVER FLOW
    // -------------------------------
    if (driver) {
      let driverData = driver;

      // Handle wrapped API responses
      if (driver.tdriverVO?.data?.length > 0) {
        driverData = driver.tdriverVO.data[0];
      } else if (driver.tdriversVO?.data?.length > 0) {
        driverData = driver.tdriversVO.data[0];
      }

      console.log("Extracted driver data for form:", driverData);

      // Normalize status
      const normalizeStatus = (status, active) => {
        if (status === "Leave") return "Leave";
        if (status === "Inactive" || active === false) return "Inactive";
        return "Active";
      };

      // -------------------------------
      // FORM DATA
      // -------------------------------
      setFormData({
        name: driverData.name || "",
        phone: driverData.phone || "",
        email: driverData.email || "",
        licenseNumber: driverData.licenseNumber || "",
        licenseExpiry: driverData.licenseExpiry || "",
        aadharNumber: driverData.aadharNumber || "",
        address: driverData.address || "",
        status: normalizeStatus(driverData.status, driverData.active),
        experience: driverData.experience || "",
        salary: driverData.salary || "",
        assignedVehicle: driverData.assignedVehicle || "",
        currentLocation: driverData.currentLocation || "",
        bloodGroup: driverData.bloodGroup || "",
        emergencyContact: driverData.emergencyContact || "",
        joinedDate: driverData.joinedDate || new Date().toISOString().split("T")[0],
        performance: driverData.performance || "4.5/5",
        branchCode: driverData.branchCode || "MAIN",
        branchName: driverData.branchName || "Main Branch",
        id: driverData.id || 0,
        lastTrip: driverData.lastTrip || "",
        orgId: driverData.orgId || orgId,
        userId: driverData.userId || "",
        createdBy: driverData.createdBy || "",
        userName: driverData.userName || "",
        active: true
      });

      // -------------------------------
      // DOCUMENTS - FIXED VERSION
      // -------------------------------
      const emptyFiles = {
        driverLicense: [],
        aadharCard: [],
        panCard: [],
        passportPhoto: [],
        experienceCertificate: [],
        medicalCertificate: [],
      };

      // Check for documents in different possible API structures
      const documentObjects = driverData.tdriverDocumentsVO ||
        driverData.documentObjects ||
        driverData.documents ||
        [];

      console.log("Loading driver documents from:", documentObjects);

      const transformedFiles = { ...emptyFiles };

      if (documentObjects && documentObjects.length > 0) {
        documentObjects.forEach((doc) => {
          const fileKey = documentTypeMapping[doc.documentType];

          if (fileKey) {
            // Create file object that tracks whether it's from server
            const fileObj = {
              id: doc.id, // Use server ID as unique identifier
              name: doc.fileName || `Document-${doc.documentType}`,
              type: doc.fileType || "application/octet-stream",
              size: doc.fileSize || 0,
              url: doc.filePath, // This is the server URL/path
              uploadedAt: doc.uploadedOn || new Date().toISOString(),
              serverId: doc.id, // Track server ID
              serverPath: doc.filePath, // Track server path
              documentType: doc.documentType,
              fileName: doc.fileName,
              isFromServer: true, // Flag to identify server files
              originalFileName: doc.fileName
            };

            transformedFiles[fileKey].push(fileObj);
          }
        });

        console.log("Transformed files:", transformedFiles);
      }

      setFiles(transformedFiles);
    }

    // -------------------------------
    // CREATE NEW DRIVER FLOW
    // -------------------------------
    else {
      setFormData({
        name: "",
        phone: "",
        email: "",
        licenseNumber: "",
        licenseExpiry: "",
        aadharNumber: "",
        address: "",
        status: "Active",
        experience: "",
        salary: "",
        assignedVehicle: "",
        currentLocation: "",
        bloodGroup: "",
        emergencyContact: "",
        joinedDate: new Date().toISOString().split("T")[0],
        performance: "4.5/5",
        branchCode: "MAIN",
        branchName: "Main Branch",
        lastTrip: "",
        orgId: orgId,
        userId: JSON.parse(localStorage.getItem("user"))?.usersId || "",
        active: true,
      });

      setFiles({
        driverLicense: [],
        aadharCard: [],
        panCard: [],
        passportPhoto: [],
        experienceCertificate: [],
        medicalCertificate: [],
      });

      setErrors({});
    }

    setActiveTab("personal");
  }, [driver, isOpen, orgId]);

  useEffect(() => {
    return () => {
      // Cleanup all blob URLs when component unmounts
      Object.values(files)
        .flat()
        .forEach((file) => {
          if (file && file.url && file.url.startsWith("blob:")) {
            URL.revokeObjectURL(file.url);
          }
        });
    };
  }, []);

  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState({
    driverLicense: [],
    aadharCard: [],
    panCard: [],
    passportPhoto: [],
    experienceCertificate: [],
    medicalCertificate: [],
  });

  // File types configuration
  const fileTypes = [
    {
      key: "driverLicense",
      label: "Driver License",
      icon: "📋",
      required: true,
    },
    {
      key: "aadharCard",
      label: "Aadhar Card",
      icon: "🆔",
      required: true,
    },
    {
      key: "panCard",
      label: "panCard Card",
      icon: "💳",
      required: false,
    },
    {
      key: "passportPhoto",
      label: "Passport Photo",
      icon: "📸",
      required: true,
    },
    {
      key: "experienceCertificate",
      label: "Experience Certificate",
      icon: "📜",
      required: false,
    },
    {
      key: "medicalCertificate",
      label: "Medical Certificate",
      icon: "🏥",
      required: false,
    },
  ];

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Handle file change
  const handleFileChange = async (fileType, event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length === 0) return;

    setUploading(true);

    try {
      const newFiles = selectedFiles.map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString(),
      }));

      setFiles((prev) => ({
        ...prev,
        [fileType]: [...prev[fileType], ...newFiles],
      }));

      setErrors((prev) => ({
        ...prev,
        [fileType]: "",
      }));

    } catch (error) {
      console.error("Error uploading files:", error);
      // You might want to show an error toast here
    } finally {
      setUploading(false);
      event.target.value = ""; // Reset input
    }
  };

  const removeFile = (fileType, fileId) => {
    setFiles(prev => ({
      ...prev,
      [fileType]: prev[fileType].filter(f => f.id !== fileId),
    }));
  };

  // Phone formatter function

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = "Phone number is required";
    } else {
      const phoneDigits = formData.phone.replace(/\D/g, "");

      if (phoneDigits.length !== 10) {
        newErrors.phone = "Phone number must be exactly 10 digits";
      }
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.aadharNumber?.trim()) {
      newErrors.aadharNumber = "Aadhar number is required";
    }

    if (!formData.experience?.trim()) {
      newErrors.experience = "Experience is required";
    }

    if (!formData.licenseNumber?.trim()) {
      newErrors.licenseNumber = "License number is required";
    } else {
      const license = formData.licenseNumber.trim();

      // Alphanumeric only
      const licenseRegex = /^[A-Za-z0-9]+$/;

      if (!licenseRegex.test(license)) {
        newErrors.licenseNumber =
          "License number must contain only letters and numbers";
      } else if (license.length < 10 || license.length > 20) {
        newErrors.licenseNumber =
          "License number must be between 10 and 20 characters";
      }
    }

    if (!formData.licenseExpiry) {
      newErrors.licenseExpiry = "License expiry date is required";
    } else {
      const expiryDate = new Date(formData.licenseExpiry);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (expiryDate < today) {
        newErrors.licenseExpiry = "License expiry cannot be in the past";
      }
    }

    if (!files.driverLicense || files.driverLicense.length === 0) {
      newErrors.driverLicense = "Driver License document is required";
    }

    if (!files.aadharCard || files.aadharCard.length === 0) {
      newErrors.aadharCard = "Aadhar Card document is required";
    }

    if (!files.passportPhoto || files.passportPhoto.length === 0) {
      newErrors.passportPhoto = "Passport Photo is required";
    }

    if (
      newErrors.driverLicense ||
      newErrors.aadharCard ||
      newErrors.passportPhoto
    )

      setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      showNotification("error", "Please fill all required fields correctly");
      return false;
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const formatDateForAPI = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return isNaN(date)
          ? null
          : date.toISOString().split("T")[0];
      };

      const userId =
        JSON.parse(localStorage.getItem("user"))?.usersId || "";
      const userName = localStorage.getItem("userName") || "Admin";

      const normalizeStatus = (status) => {
        if (!status) return "Active";
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
      };

      const driverData = {
        name: formData.name,
        phone: formData.phone.replace(/\D/g, "").slice(0, 10),
        email: formData.email || "",
        licenseNumber: formData.licenseNumber,
        licenseExpiry: formatDateForAPI(formData.licenseExpiry),
        aadharNumber: formData.aadharNumber,
        address: formData.address || "",
        status: normalizeStatus(formData.status),
        experience: formData.experience || "",
        salary: formData.salary || "",
        assignedVehicle: formData.assignedVehicle || "",
        currentLocation: formData.currentLocation || "",
        bloodGroup: formData.bloodGroup || "",
        emergencyContact: formData.emergencyContact || "",
        performance: formData.performance || "4.5/5",
        joinedDate: formatDateForAPI(formData.joinedDate),
        lastTrip: formatDateForAPI(formData.lastTrip),
        userId,
        orgId,
        branchCode: "MAIN",
        branchName: "Main Branch",
        active: true,
        createdBy: userId,
        userName,
      };

      if (driver?.id) {
        driverData.id = driver.id;
        driverData.updatedBy = userId;
      }

      const formDataToSend = new FormData();

      // Driver DTO as JSON Blob
      formDataToSend.append(
        "tdriverDTO",
        new Blob([JSON.stringify(driverData)], {
          type: "application/json",
        }),
        "tdriverDTO.json"
      );

      const apiFileMappings = {
        driverLicense: "DL",
        aadharCard: "AADHAR",
        panCard: "PAN",
        passportPhoto: "PHOTO",
        experienceCertificate: "EXP",
        medicalCertificate: "MEDICAL",
      };

      Object.keys(files).forEach((fileType) => {
        const apiParamName = apiFileMappings[fileType];
        if (!apiParamName) return;

        files[fileType].forEach(file => {
          if (file.file) {
            // ✅ NEW upload
            formDataToSend.append(apiParamName, file.file, file.name);
          } else if (file.isFromServer && file.serverPath) {
            // ✅ EXISTING server file (re-send reference)
            formDataToSend.append(
              apiParamName,
              new Blob([], { type: file.type }),
              file.originalFileName || file.name
            );
          }
        });
      });

      await onSave(formDataToSend);
    } catch (error) {
      console.error("Driver save failed:", error);

      setErrors((prev) => ({
        ...prev,
        submit:
          error?.message ||
          "Failed to save driver. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const formatPhone = (value) => {
    return value.replace(/\D/g, "");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {driver ? "Edit Driver" : "Add New Driver"}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setActiveTab("personal")}
                className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === "personal"
                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
              >
                Personal Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("employment")}
                className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === "employment"
                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
              >
                Employment
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("documents")}
                className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === "documents"
                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
              >
                Documents
              </button>
            </div>
          </div>

          {/* Personal Details Tab */}
          {activeTab === "personal" && (
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
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.name ? "border-red-500" : "border-gray-300"
                        }`}
                      placeholder="Enter driver's full name"
                      disabled={isSubmitting}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formatPhone(formData.phone)}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.phone ? "border-red-500" : "border-gray-300"
                        }`}
                      placeholder="987 654 3210"
                      maxLength="10"
                      disabled={isSubmitting}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                      placeholder="driver@example.com"
                      disabled={isSubmitting}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Blood Group
                    </label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) =>
                        handleChange("bloodGroup", e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      disabled={isSubmitting}
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>

                  {/* Row 2 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Aadhar Number *
                    </label>
                    <input
                      type="text"
                      value={formData.aadharNumber}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 12);
                        const formatted = value.replace(
                          /(\d{4})(?=\d)/g,
                          "$1 "
                        );
                        handleChange("aadharNumber", formatted);
                      }}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.aadharNumber
                        ? "border-red-500"
                        : "border-gray-300"
                        }`}
                      placeholder="1234 5678 9012"
                      maxLength="14"
                      disabled={isSubmitting}
                    />
                    {errors.aadharNumber && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.aadharNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Emergency Contact
                    </label>
                    <input
                      type="tel"
                      value={formatPhone(formData.emergencyContact)}
                      onChange={(e) =>
                        handleChange("emergencyContact", e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="987 654 3211"
                      maxLength="10"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Current Location
                    </label>
                    <input
                      type="text"
                      value={formData.currentLocation}
                      onChange={(e) =>
                        handleChange("currentLocation", e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., Mumbai"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Address Information Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  Address Information
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Address
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      rows="3"
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter complete address with city, state, and pin code"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Employment Tab */}
          {activeTab === "employment" && (
            <div className="space-y-6 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
              {/* Employment Details Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  Employment Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Experience *
                    </label>
                    <input
                      type="text"
                      value={formData.experience}
                      onChange={(e) =>
                        handleChange("experience", e.target.value)
                      }
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.experience ? "border-red-500" : "border-gray-300"
                        }`}
                      placeholder="e.g., 5 years"
                      disabled={isSubmitting}
                    />
                    {errors.experience && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.experience}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Salary
                    </label>
                    <input
                      value={formData.salary}
                      type='number'
                      onChange={(e) => handleChange("salary", e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., ₹45,000"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Joined Date
                    </label>
                    <input
                      type="date"
                      value={formData.joinedDate}
                      onChange={(e) =>
                        handleChange("joinedDate", e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleChange("status", e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Leave">Leave</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* License Information Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  License Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      License Number *
                    </label>
                    <input
                      type="text"
                      value={formData.licenseNumber}
                      onChange={(e) => {
                        const value = e.target.value
                          .toUpperCase()
                          .replace(/[^A-Z0-9]/g, "");

                        handleChange("licenseNumber", value);
                      }}
                      maxLength={16}
                      className={`w-full px-3 py-2 text-sm border rounded-lg ${errors.licenseNumber ? "border-red-500" : "border-gray-300"} focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                      placeholder="DL0420190001234"
                      disabled={isSubmitting}
                    />
                    {errors.licenseNumber && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.licenseNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      License Expiry *
                    </label>
                    <input
                      type="date"
                      value={formData.licenseExpiry}
                      onChange={(e) =>
                        handleChange("licenseExpiry", e.target.value)
                      }
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.licenseExpiry
                        ? "border-red-500"
                        : "border-gray-300"
                        }`}
                      disabled={isSubmitting}
                    />
                    {errors.licenseExpiry && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.licenseExpiry}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Performance Rating
                    </label>
                    <select
                      value={formData.performance}
                      onChange={(e) =>
                        handleChange("performance", e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      disabled={isSubmitting}
                    >
                      <option value="Excellent">Excellent</option>
                      <option value="Very Good">Very Good</option>
                      <option value="Good">Good</option>
                      <option value="Satisfactory">Satisfactory</option>
                      <option value="Below Average">Below Average</option>
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
                  Upload Driver Documents
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Max 5MB per file (JPG, PNG, PDF). Required documents are
                  marked with *
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Driver License */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors">
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📋</span>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Driver License *
                            <span className="text-red-500 ml-1">*</span>
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {files.driverLicense?.length || 0} file(s)
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1">
                      {files.driverLicense && files.driverLicense.length > 0 ? (
                        <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                          {files.driverLicense.map((file) => (
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
                                    removeFile("driverLicense", file.id)
                                  }
                                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500"
                                  disabled={isSubmitting}
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
                        onChange={(e) => handleFileChange("driverLicense", e)}
                        className="hidden"
                        disabled={uploading || isSubmitting}
                      />
                    </label>
                    {errors.driverLicense && (
                      <p className="text-xs text-red-500 mt-2 text-center">
                        {errors.driverLicense}
                      </p>
                    )}
                  </div>
                </div>

                {/* Aadhar Card */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors">
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🆔</span>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Aadhar Card *
                            <span className="text-red-500 ml-1">*</span>
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {files.aadharCard?.length || 0} file(s)
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1">
                      {files.aadharCard && files.aadharCard.length > 0 ? (
                        <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                          {files.aadharCard.map((file) => (
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
                                    removeFile("aadharCard", file.id)
                                  }
                                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500"
                                  disabled={isSubmitting}
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
                        onChange={(e) => handleFileChange("aadharCard", e)}
                        className="hidden"
                        disabled={uploading || isSubmitting}
                      />
                    </label>
                    {errors.aadharCard && (
                      <p className="text-xs text-red-500 mt-2 text-center">
                        {errors.aadharCard}
                      </p>
                    )}
                  </div>
                </div>

                {/* Passport Photo */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors">
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📸</span>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Passport Photo *
                            <span className="text-red-500 ml-1">*</span>
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {files.passportPhoto?.length || 0} file(s)
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1">
                      {files.passportPhoto && files.passportPhoto.length > 0 ? (
                        <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                          {files.passportPhoto.map((file) => (
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
                                    removeFile("passportPhoto", file.id)
                                  }
                                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500"
                                  disabled={isSubmitting}
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
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange("passportPhoto", e)}
                        className="hidden"
                        disabled={uploading || isSubmitting}
                      />
                    </label>
                    {errors.passportPhoto && (
                      <p className="text-xs text-red-500 mt-2 text-center">
                        {errors.passportPhoto}
                      </p>
                    )}
                  </div>
                </div>

                {/* panCard Card */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors">
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">💳</span>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            panCard Card
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {files.panCard?.length || 0} file(s)
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1">
                      {files.panCard && files.panCard.length > 0 ? (
                        <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                          {files.panCard.map((file) => (
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
                                  onClick={() => removeFile("panCard", file.id)}
                                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500"
                                  disabled={isSubmitting}
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
                        onChange={(e) => handleFileChange("panCard", e)}
                        className="hidden"
                        disabled={uploading || isSubmitting}
                      />
                    </label>
                  </div>
                </div>

                {/* Experience Certificate */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors">
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📜</span>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Experience Certificate
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {files.experienceCertificate?.length || 0} file(s)
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1">
                      {files.experienceCertificate &&
                        files.experienceCertificate.length > 0 ? (
                        <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                          {files.experienceCertificate.map((file) => (
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
                                    removeFile("experienceCertificate", file.id)
                                  }
                                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500"
                                  disabled={isSubmitting}
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
                        onChange={(e) =>
                          handleFileChange("experienceCertificate", e)
                        }
                        className="hidden"
                        disabled={uploading || isSubmitting}
                      />
                    </label>
                  </div>
                </div>

                {/* Medical Certificate */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors">
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🏥</span>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Medical Certificate
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {files.medicalCertificate?.length || 0} file(s)
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1">
                      {files.medicalCertificate &&
                        files.medicalCertificate.length > 0 ? (
                        <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                          {files.medicalCertificate.map((file) => (
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
                                    removeFile("medicalCertificate", file.id)
                                  }
                                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500"
                                  disabled={isSubmitting}
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
                        onChange={(e) =>
                          handleFileChange("medicalCertificate", e)
                        }
                        className="hidden"
                        disabled={uploading || isSubmitting}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-between items-center pt-4 mt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  if (activeTab === "personal") setActiveTab("employment");
                  else if (activeTab === "employment")
                    setActiveTab("documents");
                  else setActiveTab("personal");
                }}
                className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                disabled={isSubmitting}
              >
                {activeTab === "personal" ? (
                  <>
                    <Briefcase className="h-4 w-4" />
                    Go to Employment
                  </>
                ) : activeTab === "employment" ? (
                  <>
                    <File className="h-4 w-4" />
                    Go to Documents
                  </>
                ) : (
                  <>
                    <User className="h-4 w-4" />
                    Go to Personal Details
                  </>
                )}
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {driver ? "Update Driver" : "Add Driver"}
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

// Main Driver Management Component
const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewDriver, setViewDriver] = useState(null);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const userId = JSON.parse(localStorage.getItem("user"))?.usersId || "";

  const { user } = useSelector((state) => state.auth);
  const orgId = user.orgId;

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Show notification
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: "", message: "" }), 3000);
  };

  // Load drivers on component mount
  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    setLoading(true);
    try {
      const response = await driverAPI.getDrivers(orgId);
      setDrivers(response.drivers);
      showNotification("success", `Loaded ${response.drivers.length} drivers`);
    } catch (error) {
      console.error("Error loading drivers:", error);
      showNotification("error", "Failed to load drivers");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDriver = async (driverData) => {
    try {
      const response = await driverAPI.createUpdateDriver(driverData);
      if (response.statusFlag === "Ok") {
        await loadDrivers();
        setShowForm(false);
        showNotification("success", "Driver created successfully!");
      } else {
        showNotification(
          "error",
          response.message || "Failed to create driver"
        );
      }
    } catch (error) {
      console.error("Error creating driver:", error);
      showNotification("error", error.message || "Failed to create driver");
    }
  };

  const handleUpdateDriver = async (driverData) => {
    try {
      const response = await driverAPI.createUpdateDriver(driverData);
      if (response.statusFlag === "Ok") {
        await loadDrivers();
        setShowForm(false);
        setEditingDriver(null);
        showNotification("success", "Driver updated successfully!");
      } else {
        showNotification(
          "error",
          response.message || "Failed to update driver"
        );
      }
    } catch (error) {
      console.error("Error updating driver:", error);
      showNotification("error", error.message || "Failed to update driver");
    }
  };

  const handleDeleteDriver = async (id) => {
    try {
      await driverAPI.deleteDriver(id);
      await loadDrivers();
      setDeleteConfirm(null);
      showNotification("success", "Driver deleted successfully!");
    } catch (error) {
      console.error("Error deleting driver:", error);
      showNotification("error", "Failed to delete driver");
    }
  };

  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingDriver(null);
    setShowForm(true);
  };

  const handleFormSave = (driverData) => {
    console.log("Test==>", driverData);
    if (editingDriver) {
      handleUpdateDriver(driverData);
    } else {
      handleCreateDriver(driverData);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingDriver(null);
  };

  // Filter drivers based on search and status
  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      searchTerm === "" ||
      driver.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone?.includes(searchTerm) ||
      driver.licenseNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.aadharNumber?.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || driver.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  console.log("filteredDrivers==>", filteredDrivers);

  // Calculate stats
  const stats = {
    total: drivers.length,
    active: drivers.filter((d) => d.status === "Active").length,
    onLeave: drivers.filter((d) => d.status === "Leave").length,
    licensesExpiring: drivers.filter((d) => {
      if (!d.licenseExpiry) return false;
      const expiryDate = new Date(d.licenseExpiry);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      return expiryDate <= thirtyDaysFromNow;
    }).length,
  };

  const getStatusBadge = (status) => {
    const normalized = (status || "Inactive").toString().toLowerCase();

    const statusConfig = {
      active: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        icon: CheckCircle,
        label: "Active",
      },
      inactive: {
        color:
          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
        icon: XCircle,
        label: "Inactive",
      },
      leave: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
        icon: Clock,
        label: "Leave",
      },
      available: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        icon: CheckCircle,
        label: "Available",
      },
      "on duty": {
        color:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        icon: Clock,
        label: "On Duty",
      },
      "on trip": {
        color:
          "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
        icon: Clock,
        label: "On Trip",
      },
      true: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        icon: CheckCircle,
        label: "Active",
      },
      false: {
        color:
          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
        icon: XCircle,
        label: "Inactive",
      },
    };

    const config = statusConfig[normalized] || statusConfig.inactive;
    const IconComponent = config.icon || XCircle;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <IconComponent className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  const getPerformanceBadge = (performance) => {
    if (!performance) return "bg-gray-100 text-gray-700";

    const scoreMap = {
      excellent: 4.5,
      "very good": 4.0,
      good: 3.5,
      satisfactory: 3.0,
      "below average": 2.5,
    };

    const normalized = performance.toLowerCase();
    const score = scoreMap[normalized] || 3.0; // Default fallback

    if (score >= 4.5)
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";

    if (score >= 4.0)
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";

    if (score >= 3.5)
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";

    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
  };

  const getDocumentIcons = (documents) => {
    const documentCount = documents?.length || 0;
    if (documentCount === 0)
      return <span className="text-xs text-gray-500">No docs</span>;

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
      </div>
    );
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  if (loading && drivers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading drivers...</p>
        </div>
      </div>
    );
  }

  const Info = ({ label, value, isNode }) => (
    <div>
      <label className="text-xs text-gray-500">{label}</label>
      <div className="text-gray-900 dark:text-white">
        {isNode ? value : value || "N/A"}
      </div>
    </div>
  );

  const totalPages = Math.ceil(filteredDrivers.length / ITEMS_PER_PAGE);

  const paginatedDrivers = filteredDrivers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Notification */}
      {notification.message && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${notification.type === "error"
            ? "bg-red-100 text-red-800 border border-red-200"
            : notification.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-blue-100 text-blue-800 border border-blue-200"
            }`}
        >
          {notification.message}
        </div>
      )}

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              Driver Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage drivers, assignments, and performance tracking
            </p>
          </div>
          <button
            onClick={handleAddNew}
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add New Driver
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Drivers
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.total}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Drivers
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
                Leave
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.onLeave}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Licenses Expiring
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.licensesExpiring}
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
                placeholder="Search by name, phone, license number..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative">
              <select
                className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Duty">On Duty</option>
                <option value="On Trip">On Trip</option>
                <option value="Available">Available</option>
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

      {/* Drivers Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Driver Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status & Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contact & Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Documents
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  License Expiry
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedDrivers.map((driver) => (
                <tr
                  key={driver.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {driver.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {driver.experience || "N/A"} experience
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          Joined: {formatDate(driver.joinedDate)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      {getStatusBadge(driver.status)}
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPerformanceBadge(
                          driver.performance
                        )}`}
                      >
                        <Award className="h-3 w-3" />
                        {driver.performance || "N/A"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm text-gray-900 dark:text-white">
                        <Phone className="h-3 w-3" />
                        {driver.phone ? formatPhone(driver.phone) : "N/A"}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <Car className="h-3 w-3" />
                        {driver.assignedVehicle || "Not Assigned"}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                        <MapPin className="h-3 w-3" />
                        {driver.currentLocation || "N/A"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getDocumentIcons(driver.documents)}
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`text-sm font-medium ${!driver.licenseExpiry
                        ? "text-gray-500"
                        : new Date(driver.licenseExpiry) < new Date()
                          ? "text-red-600 dark:text-red-400"
                          : new Date(driver.licenseExpiry) <
                            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                            ? "text-orange-600 dark:text-orange-400"
                            : "text-green-600 dark:text-green-400"
                        }`}
                    >
                      {driver.licenseExpiry
                        ? formatDate(driver.licenseExpiry)
                        : "N/A"}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                      {driver.licenseNumber || "No license"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setViewDriver(driver)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(driver)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit Driver"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {/* <button
                        onClick={() => setDeleteConfirm(driver)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete Driver"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t dark:border-gray-700">
              <p className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(
                    Math.max(0, currentPage - 2),
                    Math.min(totalPages, currentPage + 1)
                  )
                  .map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 text-sm border rounded ${currentPage === page
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                    >
                      {page}
                    </button>
                  ))}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredDrivers.length === 0 && !loading && (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No drivers found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Add your first driver to get started"}
            </p>
            <button
              onClick={handleAddNew}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Your First Driver
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && drivers.length > 0 && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Loading more drivers...
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions Footer */}
      {/* <div className="mt-6 flex flex-wrap gap-4">
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Calendar className="h-4 w-4" />
          Schedule Training
        </button>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Shield className="h-4 w-4" />
          License Renewal
        </button>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Award className="h-4 w-4" />
          Performance Report
        </button>
      </div> */}

      {/* Driver Form Modal */}
      <DriverForm
        driver={editingDriver}
        onSave={handleFormSave}
        onCancel={handleFormCancel}
        isOpen={showForm}
        showNotification={showNotification}
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
                Delete Driver
              </h3>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete driver{" "}
              <strong>{deleteConfirm.name}</strong>? This action cannot be
              undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteDriver(deleteConfirm.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Driver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Driver Details Modal */}
      {viewDriver && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold dark:text-white">
                Driver Details
              </h2>
              <button
                onClick={() => setViewDriver(null)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* GRID INFO */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {/* Column 1 */}
                <div className="space-y-2">
                  <Info label="Name" value={viewDriver.name} />
                  <Info label="Phone" value={formatPhone(viewDriver.phone)} />
                  <Info label="Email" value={viewDriver.email} />
                  <Info label="Blood Group" value={viewDriver.bloodGroup} />
                </div>

                {/* Column 2 */}
                <div className="space-y-2">
                  <Info
                    label="Status"
                    value={getStatusBadge(viewDriver.status)}
                    isNode
                  />
                  <Info label="Experience" value={viewDriver.experience} />
                  <Info label="Salary" value={viewDriver.salary} />
                  <Info
                    label="Joined"
                    value={formatDate(viewDriver.joinedDate)}
                  />
                </div>

                {/* Column 3 */}
                <div className="space-y-2">
                  <Info label="License No" value={viewDriver.licenseNumber} />
                  <Info
                    label="Expiry"
                    value={formatDate(viewDriver.licenseExpiry)}
                  />
                  <Info label="Aadhar" value={viewDriver.aadharNumber} />
                  <Info
                    label="Vehicle"
                    value={viewDriver.assignedVehicle || "Not Assigned"}
                  />
                </div>
              </div>

              {/* Address + Emergency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <Info label="Address" value={viewDriver.address} />
                <Info
                  label="Emergency Contact"
                  value={formatPhone(viewDriver.emergencyContact)}
                />
              </div>

              {/* Documents */}
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Documents
                </label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {viewDriver.documents?.length ? (
                    viewDriver.documents.map((doc, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30"
                      >
                        {doc}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-xs">No documents</span>
                  )}
                </div>
              </div>

              {/* Performance */}
              <div className="flex items-center justify-between text-sm">
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded ${getPerformanceBadge(
                    viewDriver.performance
                  )}`}
                >
                  <Award className="h-4 w-4" />
                  {viewDriver.performance || "N/A"}
                </div>

                {viewDriver.lastTrip && (
                  <span className="text-xs text-gray-500">
                    Last trip: {formatDate(viewDriver.lastTrip)}
                  </span>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 px-4 py-3 border-t dark:border-gray-700">
              <button
                onClick={() => setViewDriver(null)}
                className="px-3 py-1.5 border rounded text-sm dark:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setViewDriver(null);
                  handleEdit(viewDriver);
                }}
                className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to format phone numbers
const formatPhone = (phone) => {
  if (!phone) return "N/A";
  const numbers = phone.replace(/\D/g, "");
  if (numbers.length === 10) {
    return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6)}`;
  }
  return phone;
};

export default DriverManagement;
