import {
  Building,
  Car,
  Download,
  FileText,
  Mail,
  MapPin,
  Phone,
  Printer,
  User,
  X,
} from "lucide-react";

export const InvoicePreview = ({ invoice, onClose, onPrint }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-emerald-100 text-emerald-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Invoice Preview</h2>
              <p className="text-blue-100 text-sm">{invoice.invoiceNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onPrint}
              className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
              title="Print"
            >
              <Printer className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="p-8">
        {/* Company Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Transport Solutions Ltd.
                </h1>
                <p className="text-gray-600">
                  Your Trusted Transportation Partner
                </p>
              </div>
            </div>
            <div className="space-y-1 text-gray-600">
              <p>123 Business Street, Mumbai, Maharashtra 400001</p>
              <p>GSTIN: 27ABCDE1234F1Z5</p>
              <p>PAN: ABCDE1234F</p>
              <p>
                Phone: +91 9876543210 | Email: accounts@transportsolutions.com
              </p>
            </div>
          </div>

          <div className="text-right">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${getStatusColor(
                invoice.status
              )} mb-4`}
            >
              <span className="text-sm font-medium">
                {invoice.status.charAt(0).toUpperCase() +
                  invoice.status.slice(1)}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h2>
            <div className="text-gray-600">
              <p className="font-medium">{invoice.invoiceNumber}</p>
              <p>Date: {formatDate(invoice.issueDate)}</p>
              <p>Due Date: {formatDate(invoice.dueDate)}</p>
            </div>
          </div>
        </div>

        {/* Bill To & Ship To */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Bill To
            </h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">
                {invoice.customerName}
              </p>
              <p className="text-gray-600 mt-1">{invoice.customerEmail}</p>
              <p className="text-gray-600">{invoice.customerPhone}</p>
              <p className="text-gray-600 mt-2">{invoice.customerAddress}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Car className="h-5 w-5" />
              Transport Details
            </h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehicle:</span>
                  <span className="font-medium text-gray-900">
                    {invoice.vehicleName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Driver:</span>
                  <span className="font-medium text-gray-900">
                    {invoice.driverName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trip:</span>
                  <span className="font-medium text-gray-900">
                    {invoice.tripDetails}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 border-b">
                  Description
                </th>
                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-900 border-b">
                  Quantity
                </th>
                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-900 border-b">
                  Unit
                </th>
                <th className="py-3 px-4 text-right text-sm font-semibold text-gray-900 border-b">
                  Rate (₹)
                </th>
                <th className="py-3 px-4 text-right text-sm font-semibold text-gray-900 border-b">
                  Amount (₹)
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.items &&
                invoice.items.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">
                      {item.description}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600">
                      {item.unit}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900">
                      ₹{item.rate?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900">
                      ₹{item.amount?.toLocaleString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-80">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium text-gray-900">
                  ₹{invoice.subtotal?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax ({invoice.taxRate}%):</span>
                <span className="font-medium text-gray-900">
                  ₹{invoice.taxAmount?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount:</span>
                <span className="font-medium text-red-600">
                  -₹{invoice.discount?.toLocaleString()}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-300">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{invoice.totalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>
              {invoice.amountPaid > 0 && (
                <div className="pt-2 border-t border-gray-300">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="font-medium text-emerald-600">
                      ₹{invoice.amountPaid?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-lg font-semibold text-gray-900">
                      Balance Due:
                    </span>
                    <span
                      className={`text-xl font-bold ${
                        invoice.balanceDue > 0
                          ? "text-amber-600"
                          : "text-emerald-600"
                      }`}
                    >
                      ₹{invoice.balanceDue?.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">
            Payment Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">
                Payment Method:{" "}
                <span className="font-medium text-gray-900">
                  {invoice.paymentMethod}
                </span>
              </p>
              {invoice.paymentDate && (
                <p className="text-gray-600 mt-1">
                  Payment Date:{" "}
                  <span className="font-medium text-gray-900">
                    {formatDate(invoice.paymentDate)}
                  </span>
                </p>
              )}
            </div>
            <div>
              <p className="text-gray-600">
                Due Date:{" "}
                <span className="font-medium text-gray-900">
                  {formatDate(invoice.dueDate)}
                </span>
              </p>
              {invoice.balanceDue > 0 && (
                <p className="text-red-600 mt-1 font-medium">
                  Please pay by due date to avoid late fees
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Notes</h4>
            <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
              {invoice.notes}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="pt-8 border-t border-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h5 className="font-semibold text-gray-900 mb-2">
                Terms & Conditions
              </h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Payment due within 30 days</li>
                <li>• Late fees apply after due date</li>
                <li>• Make payment to account mentioned below</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-2">Bank Details</h5>
              <div className="text-sm text-gray-600">
                <p>Bank: State Bank of India</p>
                <p>Account Name: Transport Solutions Ltd.</p>
                <p>Account Number: 123456789012</p>
                <p>IFSC: SBIN0001234</p>
              </div>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-2">Contact</h5>
              <div className="text-sm text-gray-600">
                <p className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  +91 9876543210
                </p>
                <p className="flex items-center gap-1 mt-1">
                  <Mail className="h-3 w-3" />
                  accounts@transportsolutions.com
                </p>
                <p className="flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  Mumbai, Maharashtra
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>Thank you for choosing Transport Solutions Ltd.</p>
            <p className="mt-1">
              This is a computer generated invoice and does not require a
              signature.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
          >
            Close
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                /* Send email logic */
              }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              <Mail className="h-4 w-4" />
              Send to Customer
            </button>
            <button
              onClick={onPrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Printer className="h-4 w-4" />
              Print Invoice
            </button>
            <button
              onClick={() => {
                /* Download PDF logic */
              }}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
