import {
  Calendar,
  Car,
  FileText,
  IndianRupee,
  Percent,
  Plus,
  Save,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

export const InvoiceForm = ({
  invoice = null,
  customers = [],
  vehicles = [],
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    customerId: "",
    vehicleId: "",
    driverId: "",
    tripId: "",
    tripDetails: "",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    status: "draft",
    paymentMethod: "bank_transfer",
    paymentDate: "",
    subtotal: 0,
    taxRate: 18,
    taxAmount: 0,
    discount: 0,
    totalAmount: 0,
    amountPaid: 0,
    balanceDue: 0,
    notes: "",
    items: [
      {
        id: "ITEM-001",
        description: "",
        quantity: 1,
        unit: "trip",
        rate: 0,
        amount: 0,
      },
    ],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (invoice) {
      setFormData({
        ...invoice,
        issueDate: invoice.issueDate || new Date().toISOString().split("T")[0],
        dueDate:
          invoice.dueDate ||
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        items: invoice.items || [
          {
            id: "ITEM-001",
            description: "",
            quantity: 1,
            unit: "trip",
            rate: 0,
            amount: 0,
          },
        ],
      });
    }
  }, [invoice]);

  // Calculate totals when items change
  useEffect(() => {
    calculateTotals();
  }, [formData.items, formData.taxRate, formData.discount]);

  const calculateTotals = () => {
    const subtotal = formData.items.reduce(
      (sum, item) =>
        sum + (parseFloat(item.rate) || 0) * (parseInt(item.quantity) || 0),
      0
    );

    const taxAmount = (subtotal * (parseFloat(formData.taxRate) || 0)) / 100;
    const totalAmount =
      subtotal + taxAmount - (parseFloat(formData.discount) || 0);
    const balanceDue = totalAmount - (parseFloat(formData.amountPaid) || 0);

    setFormData((prev) => ({
      ...prev,
      subtotal,
      taxAmount,
      totalAmount,
      balanceDue,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerId) newErrors.customerId = "Customer is required";
    if (!formData.vehicleId) newErrors.vehicleId = "Vehicle is required";
    if (!formData.tripDetails)
      newErrors.tripDetails = "Trip details are required";
    if (!formData.issueDate) newErrors.issueDate = "Issue date is required";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required";

    // Validate items
    formData.items.forEach((item, index) => {
      if (!item.description.trim()) {
        newErrors[`item_${index}_description`] = "Description is required";
      }
      if (!item.rate || parseFloat(item.rate) <= 0) {
        newErrors[`item_${index}_rate`] = "Valid rate is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSave({
      ...formData,
      subtotal: parseFloat(formData.subtotal) || 0,
      taxRate: parseFloat(formData.taxRate) || 0,
      taxAmount: parseFloat(formData.taxAmount) || 0,
      discount: parseFloat(formData.discount) || 0,
      totalAmount: parseFloat(formData.totalAmount) || 0,
      amountPaid: parseFloat(formData.amountPaid) || 0,
      balanceDue: parseFloat(formData.balanceDue) || 0,
      items: formData.items.map((item) => ({
        ...item,
        quantity: parseInt(item.quantity) || 1,
        rate: parseFloat(item.rate) || 0,
        amount: (parseFloat(item.rate) || 0) * (parseInt(item.quantity) || 1),
      })),
      customerName:
        customers.find((c) => c.id === formData.customerId)?.name || "",
      vehicleName:
        vehicles.find((v) => v.id === formData.vehicleId)?.registrationNumber ||
        "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    // Calculate amount for rate or quantity changes
    if (field === "rate" || field === "quantity") {
      const rate = parseFloat(updatedItems[index].rate) || 0;
      const quantity = parseInt(updatedItems[index].quantity) || 1;
      updatedItems[index].amount = rate * quantity;
    }

    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    const newId = `ITEM-${String(formData.items.length + 1).padStart(3, "0")}`;
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: newId,
          description: "",
          quantity: 1,
          unit: "trip",
          rate: 0,
          amount: 0,
        },
      ],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, items: updatedItems }));
    }
  };

  const statusOptions = [
    { id: "draft", name: "Draft", color: "text-gray-600" },
    { id: "pending", name: "Pending", color: "text-amber-600" },
    { id: "paid", name: "Paid", color: "text-emerald-600" },
    { id: "cancelled", name: "Cancelled", color: "text-red-600" },
  ];

  const paymentMethods = [
    { id: "bank_transfer", name: "Bank Transfer" },
    { id: "cash", name: "Cash" },
    { id: "cheque", name: "Cheque" },
    { id: "card", name: "Credit/Debit Card" },
    { id: "upi", name: "UPI" },
    { id: "online", name: "Online Payment" },
  ];

  const unitOptions = [
    "trip",
    "km",
    "hour",
    "day",
    "ton",
    "kg",
    "item",
    "container",
  ];

  const selectedCustomer = customers.find((c) => c.id === formData.customerId);
  const selectedVehicle = vehicles.find((v) => v.id === formData.vehicleId);

  return (
    <div className="relative w-full max-w-6xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {invoice ? "Edit Invoice" : "Create New Invoice"}
              </h2>
              <p className="text-blue-100 text-sm">
                {invoice
                  ? "Update invoice details"
                  : "Create a new invoice for transport services"}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
          {/* Customer & Vehicle Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Details
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Customer *
                </label>
                <select
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.customerId
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-700"
                  }`}
                >
                  <option value="" className="text-gray-500 dark:text-gray-400">
                    Select Customer
                  </option>
                  {customers.map((customer) => (
                    <option
                      key={customer.id}
                      value={customer.id}
                      className="text-gray-900 dark:text-gray-100"
                    >
                      {customer.name} - {customer.email}
                    </option>
                  ))}
                </select>
                {errors.customerId && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errors.customerId}
                  </p>
                )}
              </div>

              {selectedCustomer && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Email:
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedCustomer.email}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Phone:
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedCustomer.phone}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Address:
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedCustomer.address}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Vehicle & Trip Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Car className="h-5 w-5" />
                Transport Details
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vehicle *
                </label>
                <select
                  name="vehicleId"
                  value={formData.vehicleId}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.vehicleId
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-700"
                  }`}
                >
                  <option value="" className="text-gray-500 dark:text-gray-400">
                    Select Vehicle
                  </option>
                  {vehicles.map((vehicle) => (
                    <option
                      key={vehicle.id}
                      value={vehicle.id}
                      className="text-gray-900 dark:text-gray-100"
                    >
                      {vehicle.registrationNumber} - {vehicle.make}{" "}
                      {vehicle.model}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Trip Details *
                </label>
                <input
                  type="text"
                  name="tripDetails"
                  value={formData.tripDetails}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.tripDetails
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-700"
                  }`}
                  placeholder="e.g., Mumbai to Pune, Goods Transportation"
                />
                {errors.tripDetails && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errors.tripDetails}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Issue Date *
                </span>
              </label>
              <input
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.issueDate
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-700"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Due Date *
                </span>
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.dueDate
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-700"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map((status) => (
                  <option
                    key={status.id}
                    value={status.id}
                    className="text-gray-900 dark:text-gray-100"
                  >
                    {status.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {paymentMethods.map((method) => (
                  <option
                    key={method.id}
                    value={method.id}
                    className="text-gray-900 dark:text-gray-100"
                  >
                    {method.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Items & Services
              </h3>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                <Plus className="h-4 w-4" />
                Add Item
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description *
                    </th>
                    <th className="py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      Quantity
                    </th>
                    <th className="py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      Unit
                    </th>
                    <th className="py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                      Rate (₹) *
                    </th>
                    <th className="py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                      Amount (₹)
                    </th>
                    <th className="py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-200 dark:border-gray-700"
                    >
                      <td className="py-3">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          className={`w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors[`item_${index}_description`]
                              ? "border-red-500"
                              : "border-gray-300 dark:border-gray-700"
                          }`}
                          placeholder="Description of service"
                        />
                        {errors[`item_${index}_description`] && (
                          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                            {errors[`item_${index}_description`]}
                          </p>
                        )}
                      </td>
                      <td className="py-3">
                        <div className="flex justify-center">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "quantity",
                                e.target.value
                              )
                            }
                            min="1"
                            className="w-20 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                          />
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex justify-center">
                          <select
                            value={item.unit}
                            onChange={(e) =>
                              handleItemChange(index, "unit", e.target.value)
                            }
                            className="w-24 px-2 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {unitOptions.map((unit) => (
                              <option key={unit} value={unit}>
                                {unit}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex justify-end">
                          <div className="relative">
                            <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-500 dark:text-gray-400" />
                            <input
                              type="number"
                              value={item.rate}
                              onChange={(e) =>
                                handleItemChange(index, "rate", e.target.value)
                              }
                              step="0.01"
                              className={`w-32 pl-8 pr-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors[`item_${index}_rate`]
                                  ? "border-red-500"
                                  : "border-gray-300 dark:border-gray-700"
                              }`}
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                        {errors[`item_${index}_rate`] && (
                          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                            {errors[`item_${index}_rate`]}
                          </p>
                        )}
                      </td>
                      <td className="py-3">
                        <div className="flex justify-end">
                          <span className="text-lg font-medium text-gray-900 dark:text-white">
                            ₹{item.amount.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex justify-center">
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                            disabled={formData.items.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tax & Discount */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Tax & Discount
              </h4>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <span className="flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    Tax Rate (%)
                  </span>
                </label>
                <input
                  type="number"
                  name="taxRate"
                  value={formData.taxRate}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <span className="flex items-center gap-2">
                    <IndianRupee className="h-4 w-4" />
                    Discount (₹)
                  </span>
                </label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Payment Details
              </h4>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount Paid (₹)
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <input
                    type="number"
                    name="amountPaid"
                    value={formData.amountPaid}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    max={formData.totalAmount}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {formData.status === "paid" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    name="paymentDate"
                    value={formData.paymentDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Summary
              </h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Subtotal:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ₹{formData.subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Tax ({formData.taxRate}%):
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ₹{formData.taxAmount.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Discount:
                  </span>
                  <span className="font-medium text-red-600 dark:text-red-400">
                    -₹{formData.discount.toLocaleString()}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      Total:
                    </span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      ₹{formData.totalAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Amount Paid:
                    </span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      ₹{formData.amountPaid.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      Balance Due:
                    </span>
                    <span
                      className={`text-xl font-bold ${
                        formData.balanceDue > 0
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      ₹{formData.balanceDue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Additional notes, terms, or special instructions..."
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:opacity-90 transition-opacity font-medium"
          >
            <Save className="h-4 w-4" />
            {invoice ? "Update Invoice" : "Create Invoice"}
          </button>
        </div>
      </form>
    </div>
  );
};
