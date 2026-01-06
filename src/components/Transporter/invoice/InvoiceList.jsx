// components/invoices/InvoiceList.jsx
import { useState } from "react";
import { Eye, Download, Printer, Mail, Edit, Trash2 } from "lucide-react";
import InvoiceStatusBadge from "./InvoiceStatusBadge";
import InvoiceActions from "./InvoiceActions";

const InvoiceList = ({ 
  invoices, 
  selectedInvoices, 
  onSelectInvoice, 
  onEdit, 
  onDelete, 
  onDownload,
  onView,
  onSend,
  onPrint,
  onMarkPaid 
}) => {
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  return (
    <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
      {invoices.map((invoice) => (
        <div
          key={invoice.id}
          className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow ${
            selectedInvoices.includes(invoice.id) ? "ring-2 ring-blue-500 border-blue-500" : ""
          }`}
        >
          {/* Invoice Header */}
          <div className="p-5 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedInvoices.includes(invoice.id)}
                    onChange={() => onSelectInvoice(invoice.id)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {invoice.id}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {invoice.customer}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <InvoiceStatusBadge status={invoice.status} />
                <InvoiceActions 
                  invoice={invoice}
                  onView={() => onView(invoice)}
                  onDownload={() => onDownload(invoice)}
                  onPrint={() => onPrint(invoice)}
                  onEdit={() => onEdit(invoice)}
                  onDelete={() => onDelete(invoice)}
                  onMarkPaid={() => onMarkPaid(invoice)}
                  onSend={() => onSend(invoice)}
                />
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="p-5">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {invoice.amount}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Due Date</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(invoice.dueDate).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Vehicle</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {invoice.vehicle}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Driver</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {invoice.driver}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Route</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {invoice.route}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Payment</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {invoice.paymentMethod}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="px-5 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onView(invoice)}
                  title="View Invoice"
                  className="p-2 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => onDownload(invoice)}
                  title="Download"
                  className="p-2 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Download className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => onPrint(invoice)}
                  title="Print"
                  className="p-2 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Printer className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => onSend(invoice)}
                  title="Send Email"
                  className="p-2 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Mail className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(invoice)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40"
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </button>
                {invoice.status === "pending" && (
                  <button
                    onClick={() => onMarkPaid(invoice)}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
                  >
                    Mark Paid
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InvoiceList;