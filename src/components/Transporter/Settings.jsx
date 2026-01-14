import {
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Percent,
  Calendar,
  FileText,
  Tag,
  Settings,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  Upload,
  Download,
  Save,
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
  Copy,
  Check,
  X,
  ChevronDown,
  Users,
  Shield,
  Banknote
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import apiClient from "../../api/apiClient";

const SettingsScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(!!id);
  
  // Initial vendor state matching API structure
  const initialVendorState = {
    active: true,
    additionalEmails: "",
    additionalPhoneNumber: "",
    address: "",
    advancePercent: 0,
    branch: "",
    branchCode: "",
    createdBy: "",
    creditPeriod: "",
    id: 0,
    orgId: 0,
    organization: "",
    pocEmail: "",
    pocName: "",
    pocNumber: "",
    primaryEmail: "",
    primaryPhoneNumber: "",
    status: "ACTIVE",
    tags: "",
    tdsPercent: 0,
    vendorBankDetailsDTO: [
      {
        accountHolderName: "",
        accountNumber: "",
        bankName: "",
        ifsc: ""
      }
    ],
    vendorCode: "",
    vendorDetailsDTO: [
      {
        backgroundVerificationName: "",
        contractAttachmentName: "",
        effectioveTo: "",
        effectiveFrom: "",
        id: 0,
        securitycheckName: ""
      }
    ],
    vendorGstDTO: [
      {
        gst: ""
      }
    ],
    vendorSpotId: "",
    vendorType: "TRANSPORT",
    vendorUsersDTO: [
      {
        id: 0,
        users: ""
      }
    ],
    vendoruuid: ""
  };

  const [vendor, setVendor] = useState(initialVendorState);
  const [errors, setErrors] = useState({});
  const [attachments, setAttachments] = useState({
    contract: null,
    backgroundVerification: null,
    securityCheck: null
  });

  // Vendor types
  const vendorTypes = [
    { value: "TRANSPORT", label: "Transport" },
    { value: "FUEL", label: "Fuel Supplier" },
    { value: "MAINTENANCE", label: "Maintenance Service" },
    { value: "TYRE", label: "Tyre Supplier" },
    { value: "INSURANCE", label: "Insurance Provider" },
    { value: "OTHER", label: "Other" }
  ];

  // Credit periods
  const creditPeriods = [
    { value: "7", label: "7 Days" },
    { value: "15", label: "15 Days" },
    { value: "30", label: "30 Days" },
    { value: "45", label: "45 Days" },
    { value: "60", label: "60 Days" },
    { value: "90", label: "90 Days" }
  ];

  // Load vendor data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      fetchVendorDetails(id);
    } else {
      // Generate vendor code for new vendor
      generateVendorCode();
    }
  }, [id, isEditMode]);

  const fetchVendorDetails = async (vendorId) => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/api/vendor/getVendorById`, {
        params: { id: vendorId }
      });

      if (response.data?.status) {
        const vendorData = response.data.paramObjectsMap?.vendor || initialVendorState;
        setVendor(vendorData);
      } else {
        throw new Error("Failed to fetch vendor details");
      }
    } catch (error) {
      console.error("Error fetching vendor:", error);
      toast.error("Failed to load vendor details");
    } finally {
      setLoading(false);
    }
  };

  const generateVendorCode = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const code = `VEND-${timestamp.toString().slice(-6)}-${random.toString().padStart(3, '0')}`;
    setVendor(prev => ({ ...prev, vendorCode: code }));
  };

  // Handle form field changes
  const handleChange = (field, value) => {
    setVendor(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Handle bank details changes
  const handleBankDetailsChange = (index, field, value) => {
    setVendor(prev => {
      const updatedBankDetails = [...prev.vendorBankDetailsDTO];
      updatedBankDetails[index] = {
        ...updatedBankDetails[index],
        [field]: value
      };
      return { ...prev, vendorBankDetailsDTO: updatedBankDetails };
    });
  };

  // Handle GST details changes
  const handleGstDetailsChange = (index, field, value) => {
    setVendor(prev => {
      const updatedGstDetails = [...prev.vendorGstDTO];
      updatedGstDetails[index] = {
        ...updatedGstDetails[index],
        [field]: value
      };
      return { ...prev, vendorGstDTO: updatedGstDetails };
    });
  };

  // Handle vendor users changes
  const handleVendorUsersChange = (index, field, value) => {
    setVendor(prev => {
      const updatedUsers = [...prev.vendorUsersDTO];
      updatedUsers[index] = {
        ...updatedUsers[index],
        [field]: value
      };
      return { ...prev, vendorUsersDTO: updatedUsers };
    });
  };

  // Handle vendor details changes
  const handleVendorDetailsChange = (index, field, value) => {
    setVendor(prev => {
      const updatedDetails = [...prev.vendorDetailsDTO];
      updatedDetails[index] = {
        ...updatedDetails[index],
        [field]: value
      };
      return { ...prev, vendorDetailsDTO: updatedDetails };
    });
  };

  // Add new bank account
  const addBankAccount = () => {
    setVendor(prev => ({
      ...prev,
      vendorBankDetailsDTO: [
        ...prev.vendorBankDetailsDTO,
        {
          accountHolderName: "",
          accountNumber: "",
          bankName: "",
          ifsc: ""
        }
      ]
    }));
  };

  // Remove bank account
  const removeBankAccount = (index) => {
    if (vendor.vendorBankDetailsDTO.length <= 1) {
      toast.error("At least one bank account is required");
      return;
    }
    
    setVendor(prev => ({
      ...prev,
      vendorBankDetailsDTO: prev.vendorBankDetailsDTO.filter((_, i) => i !== index)
    }));
  };

  // Add new GST
  const addGst = () => {
    setVendor(prev => ({
      ...prev,
      vendorGstDTO: [
        ...prev.vendorGstDTO,
        { gst: "" }
      ]
    }));
  };

  // Remove GST
  const removeGst = (index) => {
    setVendor(prev => ({
      ...prev,
      vendorGstDTO: prev.vendorGstDTO.filter((_, i) => i !== index)
    }));
  };

  // Add new vendor user
  const addVendorUser = () => {
    setVendor(prev => ({
      ...prev,
      vendorUsersDTO: [
        ...prev.vendorUsersDTO,
        { id: 0, users: "" }
      ]
    }));
  };

  // Remove vendor user
  const removeVendorUser = (index) => {
    setVendor(prev => ({
      ...prev,
      vendorUsersDTO: prev.vendorUsersDTO.filter((_, i) => i !== index)
    }));
  };

  // Handle file upload
  const handleFileUpload = (type, file) => {
    if (!file) return;

    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast.error('Please upload PDF, DOC, or image files only');
      return;
    }

    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setAttachments(prev => ({ ...prev, [type]: file }));
    
    // Update vendor details with file name
    if (vendor.vendorDetailsDTO[0]) {
      const fieldMap = {
        contract: 'contractAttachmentName',
        backgroundVerification: 'backgroundVerificationName',
        securityCheck: 'securitycheckName'
      };
      
      handleVendorDetailsChange(0, fieldMap[type], file.name);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!vendor.organization?.trim()) newErrors.organization = "Organization name is required";
    if (!vendor.primaryEmail?.trim()) newErrors.primaryEmail = "Primary email is required";
    if (!vendor.primaryPhoneNumber?.trim()) newErrors.primaryPhoneNumber = "Primary phone is required";
    if (!vendor.address?.trim()) newErrors.address = "Address is required";
    if (!vendor.pocName?.trim()) newErrors.pocName = "Point of contact name is required";
    if (!vendor.pocEmail?.trim()) newErrors.pocEmail = "POC email is required";
    if (!vendor.pocNumber?.trim()) newErrors.pocNumber = "POC phone is required";
    if (!vendor.vendorType?.trim()) newErrors.vendorType = "Vendor type is required";

    // Validate emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (vendor.primaryEmail && !emailRegex.test(vendor.primaryEmail)) {
      newErrors.primaryEmail = "Invalid email format";
    }
    if (vendor.pocEmail && !emailRegex.test(vendor.pocEmail)) {
      newErrors.pocEmail = "Invalid email format";
    }

    // Validate GST numbers
    vendor.vendorGstDTO.forEach((gst, index) => {
      if (gst.gst && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst.gst)) {
        newErrors[`gst_${index}`] = "Invalid GST format";
      }
    });

    // Validate percentages
    if (vendor.advancePercent < 0 || vendor.advancePercent > 100) {
      newErrors.advancePercent = "Advance percent must be between 0-100";
    }
    if (vendor.tdsPercent < 0 || vendor.tdsPercent > 100) {
      newErrors.tdsPercent = "TDS percent must be between 0-100";
    }

    // Validate bank details
    vendor.vendorBankDetailsDTO.forEach((bank, index) => {
      if (bank.accountNumber && !/^\d{9,18}$/.test(bank.accountNumber)) {
        newErrors[`bank_account_${index}`] = "Invalid account number";
      }
      if (bank.ifsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bank.ifsc)) {
        newErrors[`bank_ifsc_${index}`] = "Invalid IFSC code";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setSaving(true);
    try {
      // Prepare vendor data with current orgId
      const vendorData = {
        ...vendor,
        orgId: vendor.orgId || 1, // Set default orgId if not present
        status: vendor.active ? "ACTIVE" : "INACTIVE",
        createdBy: vendor.createdBy || "admin" // Set default createdBy
      };

      const response = await apiClient.put("/api/vendor/createUpdateVendor", vendorData);

      if (response.data?.status) {
        const message = isEditMode ? "Vendor updated successfully" : "Vendor created successfully";
        toast.success(message);
        
        // Redirect to vendor list or stay in edit mode
        if (!isEditMode) {
          navigate('/vendors');
        }
      } else {
        throw new Error(response.data?.paramObjectsMap?.message || "Failed to save vendor");
      }
    } catch (error) {
      console.error("Error saving vendor:", error);
      toast.error(error.message || "Failed to save vendor");
    } finally {
      setSaving(false);
    }
  };

  // Copy field to clipboard
  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading vendor details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/vendors')}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                {isEditMode ? 'Edit Vendor' : 'Create New Vendor'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {isEditMode ? `Editing ${vendor.organization}` : 'Add a new vendor to your system'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {vendor.vendorCode && (
              <div className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg text-sm font-medium">
                Code: {vendor.vendorCode}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-600" />
                Basic Information
              </h2>
            </div>

            <div className="p-4 md:p-6 space-y-6">
              {/* Vendor Status & Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Vendor Type *
                  </label>
                  <select
                    value={vendor.vendorType}
                    onChange={(e) => handleChange("vendorType", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm ${
                      errors.vendorType
                        ? "border-red-300 dark:border-red-700"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <option value="">Select Type</option>
                    {vendorTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.vendorType && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.vendorType}</p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Vendor Spot ID
                    </label>
                    <input
                      type="text"
                      value={vendor.vendorSpotId}
                      onChange={(e) => handleChange("vendorSpotId", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                      placeholder="Enter spot ID"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 pt-6">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={vendor.active}
                        onChange={(e) => handleChange("active", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {vendor.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Organization Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    value={vendor.organization}
                    onChange={(e) => handleChange("organization", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm ${
                      errors.organization
                        ? "border-red-300 dark:border-red-700"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="Enter organization name"
                  />
                  {errors.organization && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.organization}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Branch
                  </label>
                  <input
                    type="text"
                    value={vendor.branch}
                    onChange={(e) => handleChange("branch", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                    placeholder="Enter branch name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Branch Code
                  </label>
                  <input
                    type="text"
                    value={vendor.branchCode}
                    onChange={(e) => handleChange("branchCode", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                    placeholder="Enter branch code"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={vendor.tags}
                    onChange={(e) => handleChange("tags", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                    placeholder="premium, reliable, express"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Phone className="h-5 w-5 text-blue-600" />
                Contact Information
              </h2>
            </div>

            <div className="p-4 md:p-6 space-y-6">
              {/* Primary Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Primary Email *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={vendor.primaryEmail}
                      onChange={(e) => handleChange("primaryEmail", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm pr-10 ${
                        errors.primaryEmail
                          ? "border-red-300 dark:border-red-700"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      placeholder="primary@example.com"
                    />
                    <button
                      onClick={() => copyToClipboard(vendor.primaryEmail)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  {errors.primaryEmail && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.primaryEmail}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Primary Phone *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={vendor.primaryPhoneNumber}
                      onChange={(e) => handleChange("primaryPhoneNumber", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm pr-10 ${
                        errors.primaryPhoneNumber
                          ? "border-red-300 dark:border-red-700"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      placeholder="+91 9876543210"
                    />
                    <button
                      onClick={() => copyToClipboard(vendor.primaryPhoneNumber)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  {errors.primaryPhoneNumber && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.primaryPhoneNumber}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Additional Email
                  </label>
                  <input
                    type="email"
                    value={vendor.additionalEmails}
                    onChange={(e) => handleChange("additionalEmails", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                    placeholder="additional@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Additional Phone
                  </label>
                  <input
                    type="tel"
                    value={vendor.additionalPhoneNumber}
                    onChange={(e) => handleChange("additionalPhoneNumber", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                    placeholder="+91 9876543211"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address *
                </label>
                <textarea
                  value={vendor.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  rows="3"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm ${
                    errors.address
                      ? "border-red-300 dark:border-red-700"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Enter complete address"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.address}</p>
                )}
              </div>
            </div>
          </div>

          {/* Point of Contact Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Point of Contact
              </h2>
            </div>

            <div className="p-4 md:p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={vendor.pocName}
                    onChange={(e) => handleChange("pocName", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm ${
                      errors.pocName
                        ? "border-red-300 dark:border-red-700"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.pocName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.pocName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={vendor.pocEmail}
                    onChange={(e) => handleChange("pocEmail", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm ${
                      errors.pocEmail
                        ? "border-red-300 dark:border-red-700"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="poc@example.com"
                  />
                  {errors.pocEmail && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.pocEmail}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={vendor.pocNumber}
                    onChange={(e) => handleChange("pocNumber", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm ${
                      errors.pocNumber
                        ? "border-red-300 dark:border-red-700"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="+91 9876543212"
                  />
                  {errors.pocNumber && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.pocNumber}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bank Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Banknote className="h-5 w-5 text-blue-600" />
                  Bank Details
                </h2>
                <button
                  onClick={addBankAccount}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Account
                </button>
              </div>
            </div>

            <div className="p-4 md:p-6 space-y-6">
              {vendor.vendorBankDetailsDTO.map((bank, index) => (
                <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Bank Account {index + 1}
                    </h4>
                    {vendor.vendorBankDetailsDTO.length > 1 && (
                      <button
                        onClick={() => removeBankAccount(index)}
                        className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Account Holder Name
                      </label>
                      <input
                        type="text"
                        value={bank.accountHolderName}
                        onChange={(e) => handleBankDetailsChange(index, "accountHolderName", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                        placeholder="Account holder name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Account Number
                      </label>
                      <input
                        type="text"
                        value={bank.accountNumber}
                        onChange={(e) => handleBankDetailsChange(index, "accountNumber", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm ${
                          errors[`bank_account_${index}`]
                            ? "border-red-300 dark:border-red-700"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        placeholder="123456789012"
                      />
                      {errors[`bank_account_${index}`] && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`bank_account_${index}`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        value={bank.bankName}
                        onChange={(e) => handleBankDetailsChange(index, "bankName", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                        placeholder="State Bank of India"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        IFSC Code
                      </label>
                      <input
                        type="text"
                        value={bank.ifsc}
                        onChange={(e) => handleBankDetailsChange(index, "ifsc", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm ${
                          errors[`bank_ifsc_${index}`]
                            ? "border-red-300 dark:border-red-700"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        placeholder="SBIN0001234"
                      />
                      {errors[`bank_ifsc_${index}`] && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`bank_ifsc_${index}`]}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Financial Settings Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Percent className="h-5 w-5 text-blue-600" />
                Financial Settings
              </h2>
            </div>

            <div className="p-4 md:p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Advance Percent (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={vendor.advancePercent}
                  onChange={(e) => handleChange("advancePercent", parseFloat(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm ${
                    errors.advancePercent
                      ? "border-red-300 dark:border-red-700"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="0.00"
                />
                {errors.advancePercent && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.advancePercent}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  TDS Percent (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={vendor.tdsPercent}
                  onChange={(e) => handleChange("tdsPercent", parseFloat(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm ${
                    errors.tdsPercent
                      ? "border-red-300 dark:border-red-700"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="0.00"
                />
                {errors.tdsPercent && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tdsPercent}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Credit Period
                </label>
                <select
                  value={vendor.creditPeriod}
                  onChange={(e) => handleChange("creditPeriod", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                >
                  <option value="">Select period</option>
                  {creditPeriods.map((period) => (
                    <option key={period.value} value={period.value}>
                      {period.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* GST Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  GST Details
                </h2>
                <button
                  onClick={addGst}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add GST
                </button>
              </div>
            </div>

            <div className="p-4 md:p-6 space-y-4">
              {vendor.vendorGstDTO.map((gst, index) => (
                <div key={index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      GST {index + 1}
                    </span>
                    <button
                      onClick={() => removeGst(index)}
                      className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={gst.gst}
                    onChange={(e) => handleGstDetailsChange(index, "gst", e.target.value)}
                    className={`w-full px-3 py-1.5 border rounded text-sm dark:bg-gray-700 dark:text-white ${
                      errors[`gst_${index}`]
                        ? "border-red-300 dark:border-red-700"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="27ABCDE1234F1Z5"
                  />
                  {errors[`gst_${index}`] && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors[`gst_${index}`]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="sticky top-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="space-y-3">
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      {isEditMode ? 'Update Vendor' : 'Create Vendor'}
                    </>
                  )}
                </button>

                <button
                  onClick={() => navigate('/vendors')}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;