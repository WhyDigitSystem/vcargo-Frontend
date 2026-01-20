import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  Bell,
  Shield,
  CreditCard,
  Palette,
  Globe,
  Download,
  Upload,
  Trash2,
  CheckCircle,
  XCircle,
  Plus,
  Building,
  FileText,
  Users,
  Truck,
  Calendar,
  BarChart3,
  ChevronDown
} from 'lucide-react';
import { companyProfileAPI } from '../../api/companyProfileAPI';
import { useSelector } from 'react-redux';
import { toast } from '../../utils/toast';

const initialSettings = {
  profile: {
    id: null,
    companyName: "",
    ownerName: "",
    email: "",
    phone: "",
    gstNumber: "",
    panNumber: "",
    website: "",
    establishedYear: "",
    termsAndConditions: "",

    billingAddresses: [
      { id: Date.now(), address: "", isPrimary: true }
    ],
    shippingAddresses: [
      { id: Date.now() + 1, address: "", isPrimary: true }
    ],

    bankDetails: [
      {
        id: Date.now(),
        accountName: "",
        accountNumber: "",
        bankName: "",
        ifscCode: "",
        branch: "",
        isPrimary: true
      }
    ],

    logoPreview: null,
    logoFile: null,
  },

  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    tripUpdates: true,
    maintenanceAlerts: true,
    documentExpiry: true,
    paymentReminders: true,
    lowBalanceAlerts: true,
  },

  security: {
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAlerts: true,
    autoLogout: true,
    ipWhitelist: [""],
  },

  billing: {
    currency: "INR",
    taxRate: 18,
    invoicePrefix: "RTS",
    paymentTerms: "30 days",
    lateFeePercentage: 1.5,
    autoGenerateInvoices: true,
    sendPaymentReminders: true,
  }
};

// Main Settings Component
const SettingsScreen = () => {
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const orgId = user.orgId;
  const organizationName = user.organizationName;
  const createdBy = user.username || user.name || user.id;

  // Load settings on component mount
  useEffect(() => {
    loadCompanyProfile();
  }, []);

  const mapApiProfileToUI = (apiProfile) => {
    let logoPreview = null;

    if (apiProfile.companyLogo) {
      logoPreview = `data:image/png;base64,${apiProfile.companyLogo}`;
    }

    return {
      id: apiProfile.id,
      companyName: apiProfile.companyName || "",
      ownerName: apiProfile.ownerName || "",
      email: apiProfile.emailAddress || "",
      phone: apiProfile.phoneNo || "",
      gstNumber: apiProfile.gstNo || "",
      panNumber: apiProfile.panNo || "",
      website: apiProfile.website || "",
      establishedYear: apiProfile.establishedYear || "",
      termsAndConditions: apiProfile.termsAndConditions || "",

      billingAddresses:
        apiProfile.companyAddresses?.map((addr) => ({
          id: addr.id,
          address: addr.billingAddress || "",
          isPrimary: !!addr.primary,
        })) || [{ id: Date.now(), address: "", isPrimary: true }],

      shippingAddresses:
        apiProfile.companyAddresses?.map((addr) => ({
          id: addr.id,
          address: addr.shippingAddress || "",
          isPrimary: !!addr.primary,
        })) || [{ id: Date.now() + 1, address: "", isPrimary: true }],

      bankDetails:
        apiProfile.companyBankDetailsResponseDTO?.map((bank) => ({
          id: bank.id,
          accountName: bank.accountHolderName || "",
          accountNumber: bank.accountNumber || "",
          bankName: bank.bankName || "",
          ifscCode: bank.ifscCode || "",
          branch: bank.branch || "",
          branchCode: bank.branchCode || "",
          isPrimary: !!bank.primary,
        })) || [
          {
            id: Date.now(),
            accountName: "",
            accountNumber: "",
            bankName: "",
            ifscCode: "",
            branch: "",
            branchCode: "",
            isPrimary: true,
          },
        ],

      logoPreview,
      logoFile: null,
    };
  };

  const loadCompanyProfile = async () => {
    setLoading(true);
    try {
      const res = await companyProfileAPI.getAllCompanyProfile({
        count: 10,
        page: 1,
        orgId
      });

      const profileData =
        res?.paramObjectsMap?.companyProfile?.data?.[0];

      if (profileData) {
        setSettings(prev => ({
          ...prev,
          profile: mapApiProfileToUI(profileData)
        }));
      }
    } catch (err) {
      console.error("Failed to load company profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);

    try {
      const primaryBank = settings.profile.bankDetails.find(b => b.isPrimary);
      const primaryBilling = settings.profile.billingAddresses.find(a => a.isPrimary);
      const primaryShipping = settings.profile.shippingAddresses.find(a => a.isPrimary);

      if (!primaryBank || !primaryBilling || !primaryShipping) {
        toast.error("Please select primary bank, billing & shipping address");
        setSaving(false);
        return;
      }

      const payload = {
        id: settings.profile.id || null,
        orgId,
        companyCode: "CMP1001",
        companyName: organizationName,
        ownerName: settings.profile.ownerName,
        emailAddress: settings.profile.email,
        phoneNo: settings.profile.phone,
        gstNo: settings.profile.gstNumber,
        panNo: settings.profile.panNumber,
        website: settings.profile.website,
        establishedYear: settings.profile.establishedYear,
        termsAndConditions: settings.profile.termsAndConditions,
        createdBy,

        // ✅ ADDRESS ARRAY WITH PRIMARY
        companyAddressDTO: settings.profile.billingAddresses.map(
          (bill, index) => ({
            billingAddress: bill.address,
            shippingAddress:
              settings.profile.shippingAddresses[index]?.address || "",
            primary: bill.isPrimary === true,
          })
        ),

        // ✅ BANK ARRAY WITH PRIMARY
        companyBankDetailsDTO: settings.profile.bankDetails.map((bank) => ({
          accountHolderName: bank.accountName,
          accountNumber: bank.accountNumber,
          bankName: bank.bankName,
          branch: bank.branch,
          branchCode: bank.branchCode || "",
          ifscCode: bank.ifscCode,
          primary: bank.isPrimary === true,
        })),
      };

      const formData = new FormData();
      formData.append(
        "companyProfileDTO",
        new Blob([JSON.stringify(payload)], { type: "application/json" })
      );

      if (settings.profile.logoFile) {
        formData.append("image", settings.profile.logoFile);
      }

      await companyProfileAPI.createUpdateCompanyProfile(formData);

      toast.success("Company Profile saved successfully!");
      await loadCompanyProfile();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleToggle = (section, field) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field]
      }
    }));
  };

  const addAddress = (type) => {
    setSettings(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [type]: [
          ...prev.profile[type],
          { id: Date.now(), address: "", isPrimary: false }
        ]
      }
    }));
  };

  const removeAddress = (type, id) => {
    setSettings(prev => {
      const updated = prev.profile[type].filter(a => a.id !== id);

      if (!updated.some(a => a.isPrimary) && updated.length > 0) {
        updated[0].isPrimary = true;
      }

      return {
        ...prev,
        profile: {
          ...prev.profile,
          [type]: updated
        }
      };
    });
  };

  const updateAddress = (type, id, value) => {
    setSettings((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [type]: prev.profile[type].map((item) =>
          item.id === id ? { ...item, address: value } : item
        ),
      },
    }));
  };

  const setPrimaryAddress = (type, id) => {
    setSettings(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [type]: prev.profile[type].map(addr => ({
          ...addr,
          isPrimary: addr.id === id
        }))
      }
    }));
  };

  const addBank = () => {
    setSettings(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        bankDetails: [
          ...prev.profile.bankDetails,
          {
            id: Date.now(),
            accountName: "",
            accountNumber: "",
            bankName: "",
            ifscCode: "",
            branch: "",
            isPrimary: false
          }
        ]
      }
    }));
  };

  const removeBank = (id) => {
    setSettings(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        bankDetails: prev.profile.bankDetails.filter(b => b.id !== id)
      }
    }));
  };

  const updateBank = (id, field, value) => {
    setSettings(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        bankDetails: prev.profile.bankDetails.map(b =>
          b.id === id ? { ...b, [field]: value } : b
        )
      }
    }));
  };

  const setPrimaryBank = (id) => {
    setSettings(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        bankDetails: prev.profile.bankDetails.map(bank => ({
          ...bank,
          isPrimary: bank.id === id
        }))
      }
    }));
  };

  const handleLogoUpload = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Logo size must be under 2MB");
      return;
    }

    setSettings((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        logoFile: file,          // ✅ store file
        logoPreview: URL.createObjectURL(file), // ✅ preview only
      },
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Settings className="h-12 w-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Settings className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your transport business settings and preferences
            </p>
          </div>

          {/* Save Status */}
          {saveStatus && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${saveStatus.type === 'success'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
              }`}>
              {saveStatus.type === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">{saveStatus.message}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="xl:col-span-1 space-y-3">
          {[
            { id: 'profile', name: 'Company Profile', icon: Building },
            { id: 'notifications', name: 'Notifications', icon: Bell },
            { id: 'security', name: 'Security', icon: Shield },
            { id: 'billing', name: 'Billing & Payments', icon: CreditCard },
            { id: 'appearance', name: 'Appearance', icon: Palette },
            { id: 'integrations', name: 'Integrations', icon: Globe }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-colors ${activeSection === item.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
              >
                <div className={`p-2 rounded-lg ${activeSection === item.id
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className={`font-medium ${activeSection === item.id
                  ? 'text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300'
                  }`}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="xl:col-span-3 space-y-6">
          {/* Company Profile */}
          {activeSection === 'profile' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                  <Building className="h-5 w-5 text-blue-600" />
                  Company Profile
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage your company information and contact details
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Logo Upload */}
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    {settings.profile.logoPreview ? (
                      <img
                        src={settings.profile.logoPreview}
                        alt="Company Logo"
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <Building className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company Logo
                    </label>
                    <div className="flex gap-3 items-center">
                      <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm cursor-pointer transition-colors">
                        Upload Logo
                        <input
                          type="file"
                          accept="image/png, image/jpeg"
                          className="hidden"
                          onChange={(e) => handleLogoUpload(e.target.files[0])}
                        />
                      </label>

                      {settings.profile.logo && (
                        <button
                          type="button"
                          onClick={() =>
                            setSettings((prev) => ({
                              ...prev,
                              profile: { ...prev.profile, logo: null },
                            }))
                          }
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Recommended: 200x200px PNG or JPG
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={organizationName}
                      disabled
                      onChange={(e) => handleChange('profile', 'companyName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Owner Name *
                    </label>
                    <input
                      type="text"
                      value={settings.profile.ownerName}
                      onChange={(e) => handleChange('profile', 'ownerName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter owner name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => handleChange('profile', 'email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="company@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={settings.profile.phone}
                      onChange={(e) => handleChange('profile', 'phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="+91 9876543210"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      GST Number *
                    </label>
                    <input
                      type="text"
                      value={settings.profile.gstNumber}
                      onChange={(e) => handleChange('profile', 'gstNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="27ABCDE1234F1Z5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      PAN Number *
                    </label>
                    <input
                      type="text"
                      value={settings.profile.panNumber}
                      onChange={(e) => handleChange('profile', 'panNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="ABCDE1234F"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Billing Address */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Billing Addresses *
                      </label>
                      <button
                        type="button"
                        onClick={() => addAddress("billingAddresses")}
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        + Add Address
                      </button>
                    </div>

                    <div className="space-y-4">
                      {settings.profile.billingAddresses.map((item, index) => (
                        <div
                          key={item.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                        >
                          {/* Header */}
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-medium text-gray-500">
                              Billing Address {index + 1}
                            </p>

                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() =>
                                  !item.isPrimary &&
                                  setPrimaryAddress("billingAddresses", item.id)
                                }
                                disabled={item.isPrimary}
                                className={`px-3 py-1 text-xs font-semibold rounded-full transition ${item.isPrimary
                                  ? "bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-300"
                                  : "text-blue-600 hover:bg-blue-50 hover:text-black dark:border-blue-400 dark:text-blue-400"
                                  }`}
                              >
                                {item.isPrimary ? "Primary" : "Set as Primary"}
                              </button>

                              {settings.profile.billingAddresses.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeAddress("billingAddresses", item.id)
                                  }
                                  className="text-xs text-red-500 hover:underline"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>

                          <textarea
                            rows="3"
                            value={item.address}
                            onChange={(e) =>
                              updateAddress("billingAddresses", item.id, e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Enter billing address"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Shipping Addresses *
                      </label>
                      <button
                        type="button"
                        onClick={() => addAddress("shippingAddresses")}
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        + Add Address
                      </button>
                    </div>

                    <div className="space-y-4">
                      {settings.profile.shippingAddresses.map((item, index) => (
                        <div
                          key={item.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-medium text-gray-500">
                              Shipping Address {index + 1}
                            </p>

                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() =>
                                  !item.isPrimary &&
                                  setPrimaryAddress("shippingAddresses", item.id)
                                }
                                disabled={item.isPrimary}
                                className={`px-3 py-1 text-xs font-semibold rounded-full transition ${item.isPrimary
                                  ? "bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-300"
                                  : "text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400"
                                  }`}
                              >
                                {item.isPrimary ? "Primary" : "Set as Primary"}
                              </button>

                              {settings.profile.shippingAddresses.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeAddress("shippingAddresses", item.id)
                                  }
                                  className="text-xs text-red-500 hover:underline"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>

                          <textarea
                            rows="3"
                            value={item.address}
                            onChange={(e) =>
                              updateAddress("shippingAddresses", item.id, e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Enter shipping address"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                <div>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-md font-semibold text-gray-900 dark:text-white">
                      Bank Details
                    </h3>
                    <button
                      type="button"
                      onClick={addBank}
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      + Add Bank
                    </button>
                  </div>

                  <div className="space-y-6">
                    {settings.profile.bankDetails.map((bank, index) => (
                      <div
                        key={bank.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                      >
                        {/* Card Header */}
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Bank Account {index + 1}
                          </p>

                          <div className="flex items-center gap-3">
                            {/* Primary Button */}
                            <button
                              type="button"
                              onClick={() => !bank.isPrimary && setPrimaryBank(bank.id)}
                              disabled={bank.isPrimary}
                              className={`px-3 py-1 text-xs font-semibold rounded-full transition${bank.isPrimary
                                ? "bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-300 cursor-default"
                                : "border border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                }`}
                            >
                              {bank.isPrimary ? "Primary Account" : "Set as Primary"}
                            </button>

                            {/* Remove Button */}
                            {settings.profile.bankDetails.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeBank(bank.id)}
                                className="text-xs text-red-500 hover:underline"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Form Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Account Name
                            </label>
                            <input
                              placeholder="Account Holder Name"
                              value={bank.accountName}
                              onChange={(e) =>
                                updateBank(bank.id, "accountName", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Account Number
                            </label>
                            <input
                              placeholder="Account Number"
                              value={bank.accountNumber}
                              onChange={(e) =>
                                updateBank(bank.id, "accountNumber", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Bank Name
                            </label>
                            <input
                              placeholder="Bank Name"
                              value={bank.bankName}
                              onChange={(e) =>
                                updateBank(bank.id, "bankName", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              IFSC Code
                            </label>
                            <input
                              placeholder="IFSC Code"
                              value={bank.ifscCode}
                              onChange={(e) =>
                                updateBank(bank.id, "ifscCode", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Branch
                            </label>
                            <input
                              placeholder="Branch"
                              value={bank.branch}
                              onChange={(e) =>
                                updateBank(bank.id, "branch", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Terms & Conditions
                  </label>
                  <textarea
                    value={settings.profile.termsAndConditions}
                    onChange={(e) => handleChange('profile', 'termsAndConditions', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter Terms & Conditions"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={settings.profile.website}
                      onChange={(e) => handleChange('profile', 'website', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="www.example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Established Year
                    </label>
                    <input
                      type="number"
                      value={settings.profile.establishedYear}
                      onChange={(e) => handleChange('profile', 'establishedYear', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="2015"
                      min="1900"
                      max="2024"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  // onClick={() => loadSettings()}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Reset Changes
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                  <Bell className="h-5 w-5 text-blue-600" />
                  Notification Settings
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Configure how you receive notifications and alerts
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Notification Channels */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                    Notification Channels
                  </h3>
                  <div className="space-y-4">
                    {[
                      { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                      { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive notifications via SMS' },
                      { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive browser push notifications' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                        </div>
                        <button
                          onClick={() => handleToggle('notifications', item.key)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications[item.key]
                            ? 'bg-blue-600'
                            : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                              }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notification Types */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                    Notification Types
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: 'tripUpdates', label: 'Trip Updates', description: 'Trip status changes and updates' },
                      { key: 'maintenanceAlerts', label: 'Maintenance Alerts', description: 'Vehicle maintenance reminders' },
                      { key: 'documentExpiry', label: 'Document Expiry', description: 'Document expiry notifications' },
                      { key: 'paymentReminders', label: 'Payment Reminders', description: 'Payment due reminders' },
                      { key: 'lowBalanceAlerts', label: 'Low Balance Alerts', description: 'Wallet balance alerts' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                        </div>
                        <button
                          onClick={() => handleToggle('notifications', item.key)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications[item.key]
                            ? 'bg-blue-600'
                            : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                              }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  // onClick={() => loadSettings()}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Reset Changes
                </button>
                <button
                  // onClick={() => handleSave('notifications')}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Notifications'}
                </button>
              </div>
            </div>
          )}

          {/* Security */}
          {activeSection === 'security' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Security Settings
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage your account security and access controls
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Two-Factor Authentication */}
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('security', 'twoFactorAuth')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.security.twoFactorAuth
                      ? 'bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.security.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>

                {/* Session Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <select
                      value={settings.security.sessionTimeout}
                      onChange={(e) => handleChange('security', 'sessionTimeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>60 minutes</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password Expiry (days)
                    </label>
                    <select
                      value={settings.security.passwordExpiry}
                      onChange={(e) => handleChange('security', 'passwordExpiry', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value={30}>30 days</option>
                      <option value={60}>60 days</option>
                      <option value={90}>90 days</option>
                      <option value={180}>180 days</option>
                    </select>
                  </div>
                </div>

                {/* Security Features */}
                <div className="space-y-4">
                  {[
                    { key: 'loginAlerts', label: 'Login Alerts', description: 'Get notified of new sign-ins' },
                    { key: 'autoLogout', label: 'Auto Logout', description: 'Automatically log out after session timeout' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                      </div>
                      <button
                        onClick={() => handleToggle('security', item.key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.security[item.key]
                          ? 'bg-blue-600'
                          : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.security[item.key] ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                {/* IP Whitelist */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    IP Whitelist
                  </label>
                  <div className="space-y-2">
                    {settings.security.ipWhitelist.map((ip, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={ip}
                          onChange={(e) => {
                            const newIps = [...settings.security.ipWhitelist];
                            newIps[index] = e.target.value;
                            handleChange('security', 'ipWhitelist', newIps);
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="192.168.1.1"
                        />
                        <button
                          onClick={() => {
                            const newIps = settings.security.ipWhitelist.filter((_, i) => i !== index);
                            handleChange('security', 'ipWhitelist', newIps);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newIps = [...settings.security.ipWhitelist, ''];
                        handleChange('security', 'ipWhitelist', newIps);
                      }}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <Plus className="h-4 w-4" />
                      Add IP Address
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  // onClick={() => loadSettings()}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Reset Changes
                </button>
                <button
                  // onClick={() => handleSave('security')}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Security'}
                </button>
              </div>
            </div>
          )}

          {/* Billing & Payments */}
          {activeSection === 'billing' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  Billing & Payments
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Configure billing preferences and payment settings
                </p>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Currency
                    </label>
                    <select
                      value={settings.billing.currency}
                      onChange={(e) => handleChange('billing', 'currency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="INR">Indian Rupee (₹)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                      <option value="GBP">British Pound (£)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      value={settings.billing.taxRate}
                      onChange={(e) => handleChange('billing', 'taxRate', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Invoice Prefix
                    </label>
                    <input
                      type="text"
                      value={settings.billing.invoicePrefix}
                      onChange={(e) => handleChange('billing', 'invoicePrefix', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="RTS"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Payment Terms
                    </label>
                    <select
                      value={settings.billing.paymentTerms}
                      onChange={(e) => handleChange('billing', 'paymentTerms', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="7 days">7 days</option>
                      <option value="15 days">15 days</option>
                      <option value="30 days">30 days</option>
                      <option value="45 days">45 days</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Late Fee Percentage
                    </label>
                    <input
                      type="number"
                      value={settings.billing.lateFeePercentage}
                      onChange={(e) => handleChange('billing', 'lateFeePercentage', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      min="0"
                      max="50"
                      step="0.1"
                    />
                  </div>
                </div>

                {/* Billing Features */}
                <div className="space-y-4">
                  {[
                    { key: 'autoGenerateInvoices', label: 'Auto-generate Invoices', description: 'Automatically generate invoices for completed trips' },
                    { key: 'sendPaymentReminders', label: 'Send Payment Reminders', description: 'Automatically send payment reminder emails' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                      </div>
                      <button
                        onClick={() => handleToggle('billing', item.key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.billing[item.key]
                          ? 'bg-blue-600'
                          : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.billing[item.key] ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  // onClick={() => loadSettings()}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Reset Changes
                </button>
                <button
                  // onClick={() => handleSave('billing')}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Billing'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;