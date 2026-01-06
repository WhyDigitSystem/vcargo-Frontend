import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { customerAPI } from "../../api/customerAPI";
import { toast } from "../../utils/toast";
import TabComponent from "../common/TabComponent";
import InputField from "../UI/InputField";
import { listOfValuesAPI } from "../../api/listOfValues";

const CustomerMaster = ({ editingCustomerId, onBackToList }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const userName = JSON.parse(localStorage.getItem("user"))?.name || "";
  const [fieldErrors, setFieldErrors] = useState({});
  const [customerTypeOptions, setCustomerTypeOptions] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const orgId = user.orgId;

  const [addresses, setAddresses] = useState([
    {
      id: Date.now(),
      address1: "",
      address2: "",
      city: "",
      state: "",
      type: "",
      pinCode: "",
      isDefault: true
    }
  ]);

  const [formData, setFormData] = useState({
    customerCode: "",
    customerName: "",
    customerType: "",
    salesPerson: "",
    email: "",
    pan: "",
    gstNumber: "",
    phoneNumber: "",
    status: "Active",
    pocName: "",
    pocEmail: "",
    pocNumber: "",
    orgId: null,
    branch: null,
    branchCode: null,
  });

  useEffect(() => {
    getListDescription();

    if (editingCustomerId) {
      handleEditCustomer(editingCustomerId);
    } else {
      resetForm();
    }
  }, [editingCustomerId]);

  const getListDescription = async () => {
    try {
      const listDescription = 'Customer Type'
      const response = await listOfValuesAPI.getListDescription({ orgId, listDescription })

      const data = response.paramObjectsMap?.listOfValuesVO || [];
      setCustomerTypeOptions(data);
    } catch (error) {
      console.error("Error fetching customer types:", error);
    }
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "phoneNumber" || name === "pocNumber") {
      value = value.replace(/[^0-9]/g, "");
      value = value.slice(0, 10);
    }

    if (name === "pinCode") {
      value = value.replace(/[^0-9]/g, "");
      value = value.slice(0, 6);
    }

    if (name === "gstNumber") {
      value = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
      value = value.slice(0, 15);
    }

    if (name === "pan") {
      value = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
      value = value.slice(0, 10);
    }

    if (name === "email" || name === "pocEmail") {
      value = value.replace(/[^a-zA-Z0-9@._\-]/g, "");
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAddressChange = (id, field, value) => {
    if (field === "pinCode") {
      value = value.replace(/[^0-9]/g, "");
      value = value.slice(0, 6);
    }

    if (field === "type" && value === "Domestic") {
      setAddresses(prev => prev.map(addr =>
        addr.id === id ? { ...addr, [field]: value, isDefault: true } : addr
      ));
    } else {
      setAddresses(prev => prev.map(addr =>
        addr.id === id ? { ...addr, [field]: value } : addr
      ));
    }
  };

  const addNewAddress = () => {
    const newAddress = {
      id: Date.now(),
      address1: "",
      address2: "",
      city: "",
      state: "",
      type: "",
      pinCode: "",
      isDefault: addresses.length === 0 || !addresses.some(addr => addr.type === "Domestic")
    };
    setAddresses([...addresses, newAddress]);
  };

  const removeAddress = (id) => {
    if (addresses.length <= 1) {
      toast.error("At least one address is required");
      return;
    }

    const addressToRemove = addresses.find(addr => addr.id === id);
    if (addressToRemove?.isDefault && addresses.length > 1) {
      const otherAddress = addresses.find(addr => addr.id !== id);
      setAddresses(prev =>
        prev.filter(addr => addr.id !== id)
          .map((addr, index) => index === 0 ? { ...addr, isDefault: true } : addr)
      );
    } else {
      setAddresses(prev => prev.filter(addr => addr.id !== id));
    }
  };

  const handleEditCustomer = async (customerId) => {
    try {
      setLoading(true);
      const response = await customerAPI.getCustomerById(customerId);

      const customerData = response?.paramObjectsMap?.customerVO;

      if (customerData) {

        setFormData({
          id: customerData.id || null,
          customerCode: customerData.customerCode || "",
          customerName: customerData.customerName || "",
          customerType: customerData.customerType || "",
          email: customerData.email || "",
          pan: customerData.panNumber || "",
          gstNumber: customerData.gstNumber || "",
          phoneNumber: customerData.phoneNumber || "",
          status: customerData.active || "Inactive",
          pocName: customerData.pocName || "",
          pocEmail: customerData.pocEmail || "",
          pocNumber: customerData.pocNumber || "",
        });

        if (Array.isArray(customerData.customerAddressVO)) {
          const formattedAddresses = customerData.customerAddressVO.map(addr => ({
            id: addr.id,
            address1: addr.primaryAddress || "",
            address2: addr.additionalAddress || "",
            city: addr.city || "",
            state: addr.state || "",
            type: addr.type || "",
            pinCode: addr.pincode || "",
          }));

          setAddresses(formattedAddresses);
        }
      }

    } catch (error) {
      console.error("Error fetching customer:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      customerCode: "",
      customerName: "",
      customerType: "",
      email: "",
      pan: "",
      gstNumber: "",
      phoneNumber: "",
      status: "Active",
      pocName: "",
      pocEmail: "",
      pocNumber: "",
      orgId: null,
      branch: null,
      branchCode: null,
    });
    setAddresses([{
      id: Date.now(),
      address1: "",
      address2: "",
      city: "",
      state: "",
      type: "",
      pinCode: "",
      isDefault: true
    }]);
    setActiveTab(0);
  };

  const validateForm = () => {
    let errors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
    const pinRegex = /^[0-9]{6}$/;

    if (!formData.customerName.trim()) {
      errors.customerName = "Customer name is required";
    }

    if (!formData.pan.trim()) {
      errors.pan = "Pan number is required";
    }

    if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
      errors.phoneNumber = "Phone number must be 10 digits";
    }

    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = "Enter a valid email address";
    }

    if (formData.gstNumber && !gstRegex.test(formData.gstNumber)) {
      errors.gstNumber = "Invalid GST format. Example: 29ABCDE1234F1Z5";
    }

    if (formData.pan && !panRegex.test(formData.pan.toUpperCase())) {
      errors.pan = "Invalid PAN format. Example: ABCDE1234F";
    }

    // Validate addresses
    addresses.forEach((address, index) => {
      if (!address.address1.trim()) {
        errors[`address1_${index}`] = "Address Line 1 is required";
      }

      if (!address.city.trim()) {
        errors[`city_${index}`] = "City is required";
      }

      if (!address.state.trim()) {
        errors[`state_${index}`] = "State is required";
      }

      if (!address.pinCode || !pinRegex.test(address.pinCode)) {
        errors[`pinCode_${index}`] = "Valid 6-digit pincode is required";
      }

      if (!address.type) {
        errors[`type_${index}`] = "Address type is required";
      }
    });

    if (formData.pocNumber && !phoneRegex.test(formData.pocNumber)) {
      errors.pocNumber = "POC number must be 10 digits";
    }

    if (formData.pocEmail && !emailRegex.test(formData.pocEmail)) {
      errors.pocEmail = "Enter a valid POC email";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    try {
      setLoading(true);

      const formattedAddresses = addresses.map(addr => ({
        primaryAddress: addr.address1 || "",
        additionalAddress: addr.address2 || "",
        city: addr.city || "",
        state: addr.state || "",
        type: addr.type || "",
        pincode: Number(addr.pinCode) || 0,
        isDefault: addr.isDefault || false
      }));

      const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];

      const payload = {
        active: formData.status === "Active",
        additionalAddress: defaultAddress.address2 || "",
        branch: formData.branch || "",
        branchCode: formData.branchCode || "",
        city: defaultAddress.city || "",
        state: defaultAddress.state || "",
        createdBy: userName || "",
        customerCode: formData.customerCode || "",
        customerName: formData.customerName || "",
        customerType: formData.customerType || "",
        salesPerson: formData.salesPerson || "",
        email: formData.email || "",
        gstNumber: formData.gstNumber || "",
        orgId: orgId || 0,
        panNumber: formData.pan || "",
        phoneNumber: formData.phoneNumber || "",
        pincode: Number(defaultAddress.pinCode) || 0,
        pocEmail: formData.pocEmail || "",
        pocName: formData.pocName || "",
        pocNumber: formData.pocNumber || "",
        primaryAddress: defaultAddress.address1 || "",
        customerAddressDTO: formattedAddresses // Send all addresses
      };

      if (editingCustomerId) payload.id = editingCustomerId;

      const response = await customerAPI.createOrUpdateCustomer(payload);

      if (response?.data?.status === true || response?.status === true) {
        toast.success(
          formData.id
            ? "Customer updated successfully!"
            : "Customer created successfully!"
        );
        onBackToList();
      } else {
        toast.error("Customer Creation Failed");
      }
    } catch (error) {
      console.error("Error saving customer:", error);
      toast.error("Error saving customer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      label: "Details",
      component: (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <InputField
              label="Code"
              name="customerCode"
              value={formData.customerCode}
              placeholder="Enter Customer Code"
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div>
            <InputField
              label="Name"
              name="customerName"
              required
              placeholder="Enter Customer Name"
              value={formData.customerName}
              onChange={handleChange}
              disabled={loading}
            />
            {fieldErrors.customerName && (
              <p className="text-xs text-red-500">{fieldErrors.customerName}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Customer Type *
            </label>
            <select
              name="customerType"
              value={formData.customerType}
              onChange={handleChange}
              disabled={customerTypeOptions.length === 0}
              className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select Customer Type</option>
              {customerTypeOptions.map((option) => (
                <option key={option.valuedescription} value={option.valuedescription}>
                  {option.valuedescription}
                </option>
              ))}
            </select>
          </div>

          <div>
            <InputField
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              placeholder="Enter Phone Number"
              onChange={handleChange}
              disabled={loading}
            />
            {fieldErrors.phoneNumber && (
              <p className="text-xs text-red-500">{fieldErrors.phoneNumber}</p>
            )}
          </div>

          <div>
            <InputField
              label="Email"
              name="email"
              value={formData.email}
              placeholder="Enter Email"
              onChange={handleChange}
              disabled={loading}
            />
            {fieldErrors.email && (
              <p className="text-xs text-red-500">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <InputField
              label="GST Number"
              name="gstNumber"
              value={formData.gstNumber}
              placeholder="Enter GST Number"
              onChange={handleChange}
              disabled={loading}
            />
            {fieldErrors.gstNumber && (
              <p className="text-xs text-red-500">{fieldErrors.gstNumber}</p>
            )}
          </div>

          <div>
            <InputField
              label="PAN *"
              name="pan"
              required
              value={formData.pan}
              placeholder="Enter PAN Number"
              onChange={handleChange}
              disabled={loading}
            />
            {fieldErrors.pan && (
              <p className="text-xs text-red-500">{fieldErrors.pan}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Sales Person
            </label>
            <select
              name="salesPerson"
              value={formData.salesPerson}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select Sales Person</option>
              <option value="Ravi">Ravi</option>
              <option value="Pradeep">Pradeep</option>
              <option value="John">John</option>
              <option value="Ashwin">Ashwin</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg 
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      ),
    },
    {
      label: "Billing Addresses",
      component: (
        <div className="space-y-3">
          {/* Header */}
          <h3 className="text-md font-semibold dark:text-gray-100">Billing Addresses</h3>

          <div className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium border-b border-gray-300 dark:border-gray-600">
              <div className="col-span-2 px-3 py-2">Address Line 1</div>
              <div className="col-span-2 px-3 py-2">Address Line 2</div>
              <div className="col-span-2 px-3 py-2">City</div>
              <div className="col-span-2 px-3 py-2">State</div>
              <div className="col-span-2 px-3 py-2">Type</div>
              <div className="col-span-1 px-3 py-2">Pincode</div>
              <div className="col-span-1 px-3 py-2 text-center">Action</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {addresses.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                >
                  {/* Address 1 */}
                  <div className="col-span-2 px-3 py-2">
                    <input
                      value={item.address1}
                      onChange={(e) =>
                        handleAddressChange(item.id, "address1", e.target.value)
                      }
                      placeholder="Enter address"
                      className={`w-full px-2 py-1.5 border ${fieldErrors[`address1_${index}`] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                    {fieldErrors[`address1_${index}`] && (
                      <p className="text-xs text-red-500 mt-1">{fieldErrors[`address1_${index}`]}</p>
                    )}
                  </div>

                  {/* Address 2 */}
                  <div className="col-span-2 px-3 py-2">
                    <input
                      value={item.address2}
                      onChange={(e) =>
                        handleAddressChange(item.id, "address2", e.target.value)
                      }
                      placeholder="Enter address"
                      className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    />
                  </div>

                  {/* City */}
                  <div className="col-span-2 px-3 py-2">
                    <input
                      value={item.city}
                      onChange={(e) =>
                        handleAddressChange(item.id, "city", e.target.value)
                      }
                      placeholder="City"
                      className={`w-full px-2 py-1.5 border ${fieldErrors[`city_${index}`] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm`}
                    />
                    {fieldErrors[`city_${index}`] && (
                      <p className="text-xs text-red-500 mt-1">{fieldErrors[`city_${index}`]}</p>
                    )}
                  </div>

                  {/* State */}
                  <div className="col-span-2 px-3 py-2">
                    <input
                      value={item.state}
                      onChange={(e) =>
                        handleAddressChange(item.id, "state", e.target.value)
                      }
                      placeholder="State"
                      className={`w-full px-2 py-1.5 border ${fieldErrors[`state_${index}`] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm`}
                    />
                    {fieldErrors[`state_${index}`] && (
                      <p className="text-xs text-red-500 mt-1">{fieldErrors[`state_${index}`]}</p>
                    )}
                  </div>

                  {/* Type */}
                  <div className="col-span-2 px-3 py-2">
                    <select
                      value={item.type}
                      onChange={(e) =>
                        handleAddressChange(item.id, "type", e.target.value)
                      }
                      className={`w-full px-2 py-1.5 border ${fieldErrors[`type_${index}`] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm`}
                    >
                      <option value="">Select Type</option>
                      <option value="Domestic">Domestic</option>
                      <option value="Export">Export</option>
                    </select>
                    {fieldErrors[`type_${index}`] && (
                      <p className="text-xs text-red-500 mt-1">{fieldErrors[`type_${index}`]}</p>
                    )}
                  </div>

                  {/* Pincode */}
                  <div className="col-span-1 px-3 py-2">
                    <input
                      value={item.pinCode}
                      onChange={(e) =>
                        handleAddressChange(item.id, "pinCode", e.target.value)
                      }
                      placeholder="Pincode"
                      className={`w-full px-2 py-1.5 border ${fieldErrors[`pinCode_${index}`] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm`}
                    />
                    {fieldErrors[`pinCode_${index}`] && (
                      <p className="text-xs text-red-500 mt-1">{fieldErrors[`pinCode_${index}`]}</p>
                    )}
                  </div>

                  {/* Delete */}
                  <div className="col-span-1 px-3 py-2 flex justify-center items-center">
                    <button
                      onClick={() => removeAddress(item.id)}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/50 rounded transition"
                      disabled={addresses.length <= 1}
                    >
                      <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Add Row Footer */}
          <button
            onClick={addNewAddress}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Add Row
          </button>
        </div>
      ),
    },
    {
      label: "POC Details",
      component: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <InputField
              label="POC Name"
              name="pocName"
              value={formData.pocName}
              placeholder="Enter POC Name"
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div>
            <InputField
              label="POC Email"
              name="pocEmail"
              value={formData.pocEmail}
              placeholder="Enter POC Email"
              onChange={handleChange}
              disabled={loading}
            />
            {fieldErrors.pocEmail && (
              <p className="text-xs text-red-500">{fieldErrors.pocEmail}</p>
            )}
          </div>

          <div>
            <InputField
              label="POC Number"
              name="pocNumber"
              value={formData.pocNumber}
              placeholder="Enter POC Number"
              onChange={handleChange}
              disabled={loading}
            />
            {fieldErrors.pocNumber && (
              <p className="text-xs text-red-500">{fieldErrors.pocNumber}</p>
            )}
          </div>
        </div>
      ),
    },
  ];

  if (loading && editingCustomerId) {
    return (
      <div className="max-w-6xl mx-auto mt-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-gray-600 dark:text-gray-400">
              Loading customer data...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto mt-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onBackToList}
          disabled={loading}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </button>
        <h1 className="flex-1 text-xl font-semibold ml-3 text-gray-900 dark:text-white">
          {editingCustomerId ? "Edit Customer" : "New Customer"}
        </h1>

        <div className="flex items-center gap-2">
          {/* CLEAR BUTTON */}
          <button
            onClick={resetForm}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 
               text-gray-700 rounded-lg shadow-sm transition disabled:opacity-50 
               disabled:cursor-not-allowed"
          >
            Clear
          </button>
          {/* SAVE BUTTON */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 
               text-white rounded-lg shadow-sm transition disabled:opacity-50 
               disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            {loading ? "Saving..." : editingCustomerId ? "Update" : "Save"}
          </button>
        </div>
      </div>

      <TabComponent
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="mt-6 transition-all duration-500">
        {tabs[activeTab].component}
      </div>
    </div>
  );
};

export default CustomerMaster;