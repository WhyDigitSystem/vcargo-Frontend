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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";

export const InvoicePreview = ({ invoice, onClose, onPrint }) => {
  const pdfRef = useRef();
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "overdue":
        return "bg-red-50 text-red-700 border-red-200";
      case "draft":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const handleDownloadPDF = async () => {
    const element = pdfRef.current;

    const canvas = await html2canvas(element, {
      scale: 2,                // HIGH QUALITY
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`Invoice_${invoice.invoiceNumber || invoice.id}.pdf`);
  };

  return (
    <div ref={pdfRef} className="relative w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                INVOICE #{invoice.invoiceNumber}
              </h2>
              <p className="text-blue-100 text-sm">Preview • Transport Solutions Ltd.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onPrint}
              className="p-2.5 hover:bg-white/10 text-white rounded-lg transition-all duration-200 border border-white/20 hover:border-white/40"
              title="Print"
            >
              <Printer className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 hover:bg-white/10 text-white rounded-lg transition-all duration-200 border border-white/20 hover:border-white/40"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="p-6">
        {/* Company & Status Header */}
        <div className="flex justify-between items-start mb-2 pb-2 border-b border-gray-100">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-sm">
                <Building className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TRANSPORT SOLUTIONS LTD.</h1>
                <p className="text-gray-600 text-sm">Professional Transportation & Logistics</p>
              </div>
            </div>
            <div className="space-y-1.5 text-gray-600 text-sm">
              <p className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-gray-500" />
                123 Business Street, Mumbai, Maharashtra 400001
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-gray-500" />
                +91 98765 43210
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-gray-500" />
                accounts@transportsolutions.com
              </p>
              <p className="text-gray-500 text-xs mt-2 tracking-wide">
                GSTIN: 27ABCDE1234F1Z5 | PAN: ABCDE1234F
              </p>
            </div>
          </div>

          <div className="text-right space-y-4">
            <div className="flex flex-col items-end">
              <span
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(
                  invoice.status
                )} uppercase tracking-wider shadow-sm`}
              >
                <span className="h-2 w-2 rounded-full bg-current"></span>
                {invoice.status}
              </span>
            </div>
            <div className="space-y-2">
              <div className="text-gray-600 space-y-1 text-sm">
                <div className="flex justify-end gap-4">
                  <span className="text-gray-500 font-medium">Issued Date:</span>
                  <span className="font-semibold text-gray-900">{formatDate(invoice.issueDate)}</span>
                </div>
                <div className="flex justify-end gap-4">
                  <span className="text-gray-500 font-medium">Due Date:</span>
                  <span className="font-semibold text-gray-900">{formatDate(invoice.dueDate)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Client & Transport Details - Card Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-2">
          {/* Bill To Card */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-4 w-4 text-blue-700" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Bill To</h3>
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="font-bold text-gray-900 text-lg mb-1">{invoice.customerName}</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    {invoice.customerEmail}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    {invoice.customerPhone}
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <p className="text-gray-700 text-sm leading-relaxed">{invoice.customerAddress}</p>
              </div>
            </div>
          </div>

          {/* Transport Details Card */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Car className="h-4 w-4 text-indigo-700" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Transport Details</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Vehicle No.</p>
                <p className="font-semibold text-gray-900 text-sm bg-gray-50 px-3 py-2 rounded-lg border">
                  {invoice.vehicleNumber}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Driver</p>
                <p className="font-semibold text-gray-900 text-sm bg-gray-50 px-3 py-2 rounded-lg border">
                  {invoice.driverNumber}
                </p>
              </div>
              <div className="col-span-2 space-y-1">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Trip Details</p>
                <p className="font-medium text-gray-900 text-sm bg-gray-50 px-3 py-2 rounded-lg border">
                  {invoice.tripDetails}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table - Modern Design */}
        <div className="mb-2 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Invoice Items
            </h3>
          </div>
          <table className="w-full">
            <thead className="bg-white border-b border-gray-200">
              <tr>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Description
                </th>
                <th className="py-4 px-6 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="py-4 px-6 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Unit
                </th>
                <th className="py-4 px-6 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Rate (₹)
                </th>
                <th className="py-4 px-6 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Amount (₹)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoice.items &&
                invoice.items.map((item, index) => (
                  <tr key={index} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3.5 px-6 text-gray-900 text-sm font-medium">{item.description}</td>
                    <td className="py-3.5 px-6 text-center text-gray-700 text-sm">{item.quantity}</td>
                    <td className="py-3.5 px-6 text-center text-gray-600 text-sm font-medium">{item.unit}</td>
                    <td className="py-3.5 px-6 text-right text-gray-900 text-sm font-semibold">
                      ₹{item.rate?.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3.5 px-6 text-right text-gray-900 font-bold text-sm">
                      ₹{item.amount?.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section - Card Style */}
        <div className="flex justify-end mb-2">
          <div className="w-96">
            <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="space-y-3 mb-2">
                <div className="flex justify-between items-center pb-0">
                  <span className="text-gray-600 text-sm font-medium">Subtotal</span>
                  <span className="text-gray-900 font-semibold">
                    ₹{invoice.subtotal?.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-0">
                  <span className="text-gray-600 text-sm font-medium">Tax ({invoice.taxRate}%)</span>
                  <span className="text-gray-900 font-semibold">
                    ₹{invoice.taxAmount?.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-0">
                  <span className="text-gray-600 text-sm font-medium">Discount</span>
                  <span className="text-red-600 font-semibold">
                    -₹{invoice.discount?.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-300">
                <div className="flex justify-between items-center mb-0">
                  <span className="text-base font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{invoice.totalAmount?.toLocaleString("en-IN")}
                  </span>
                </div>
                {invoice.amountPaid > 0 && (
                  <div className="pt-2 mt-2 border-t border-gray-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm font-medium">Amount Paid</span>
                      <span className="text-emerald-600 font-semibold">
                        ₹{invoice.amountPaid?.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-0 border-t border-gray-100">
                      <span className="text-base font-bold text-gray-900">Balance Due</span>
                      <span
                        className={`text-xl font-bold ${invoice.balanceDue > 0 ? "text-amber-600" : "text-emerald-600"
                          }`}
                      >
                        ₹{invoice.balanceDue?.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Notes Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-2">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Payment Information</h4>
            <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-200 p-5">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Payment Method</p>
                  <p className="font-semibold text-gray-900 text-sm mt-1">{invoice.paymentMethod}</p>
                </div>
                {invoice.paymentDate && (
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Payment Date</p>
                    <p className="font-semibold text-gray-900 text-sm mt-1">{formatDate(invoice.paymentDate)}</p>
                  </div>
                )}
                {invoice.balanceDue > 0 && (
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg border border-red-100">
                      <span className="text-red-600 font-medium text-xs">
                        ⚠️ Payment due by {formatDate(invoice.dueDate)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Additional Notes</h4>
              <div className="bg-gradient-to-b from-blue-50 to-white rounded-xl border border-blue-100 p-5">
                <p className="text-gray-700 text-sm leading-relaxed">{invoice.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Company Details */}
        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Terms & Conditions</h5>
              <ul className="text-xs text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span>Payment due within 30 days of invoice date</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span>1.5% monthly late fee on overdue payments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span>Disputes must be raised within 7 days</span>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Bank Details</h5>
              <div className="text-xs text-gray-600 space-y-1.5">
                <p className="font-bold text-gray-900">State Bank of India</p>
                <p>Account Name: Transport Solutions Ltd.</p>
                <p>Account No: 1234 5678 9012</p>
                <p>IFSC Code: SBIN0001234</p>
                <p>Branch: Nariman Point, Mumbai - 400021</p>
              </div>
            </div>
            <div>
              <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Contact Information</h5>
              <div className="text-xs text-gray-600 space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-gray-500" />
                  <span>+91 98765 43210 (Accounts)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-gray-500" />
                  <span>accounts@transportsolutions.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-gray-500" />
                  <span>123 Business Street, Mumbai 400001</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600 font-medium">
              Thank you for choosing Transport Solutions Ltd. We appreciate your business.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              This is a system-generated invoice and is valid without signature.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons - Sticky Bottom */}
      <div className="sticky bottom-0 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200 p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-gray-700 hover:text-gray-900 text-sm font-medium hover:bg-gray-100 rounded-lg transition-all duration-200 border border-gray-300"
            >
              Close Preview
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                /* Send email logic */
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-900 transition-all duration-200 font-semibold shadow-sm hover:shadow"
            >
              <Mail className="h-4 w-4" />
              Send Invoice
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition-all duration-200 font-semibold shadow-sm hover:shadow"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>
            <button
              onClick={onPrint}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-sm hover:shadow"
            >
              <Printer className="h-4 w-4" />
              Print Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};