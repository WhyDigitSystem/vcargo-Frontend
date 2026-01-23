import {
  Edit,
  Eye,
  Mail,
  Printer,
  ChevronRight,
  FileText,
  IndianRupee,
  Calendar,
  User,
  Car,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Navigation
} from "lucide-react";
import { useState } from "react";
import AddressDisplay from "../../QuortsView/AddressDisplay";

export const InvoiceList = ({
  invoices,
  onEdit,
  onPreview,
  onSend,
  selectedInvoices,
  onSelectInvoice
}) => {
  const [expandedId, setExpandedId] = useState(null);

  const handleSelectAll = () => {
    if (selectedInvoices.length === invoices.length) {
      onSelectInvoice([]);
    } else {
      onSelectInvoice(invoices.map(i => i.id));
    }
  };

  const handleSelectInvoice = (id) => {
    if (selectedInvoices.includes(id)) {
      onSelectInvoice(selectedInvoices.filter(iId => iId !== id));
    } else {
      onSelectInvoice([...selectedInvoices, id]);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300';
      case 'pending': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300';
      case 'overdue': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'draft': return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
      case 'cancelled': return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-3 w-3" />;
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'overdue': return <AlertCircle className="h-3 w-3" />;
      case 'draft': return <FileText className="h-3 w-3" />;
      default: return <FileText className="h-3 w-3" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isOverdue = (invoice) => {
    if (invoice.status === 'pending') {
      const dueDate = new Date(invoice.dueDate);
      const today = new Date();
      return dueDate < today;
    }
    return false;
  };

  const getDaysUntilDue = (invoice) => {
    if (invoice.status === 'paid' || invoice.status === 'cancelled') return null;

    const dueDate = new Date(invoice.dueDate);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const parseTripDetails = (tripDetails) => {
    if (!tripDetails) return { source: '', destination: '' };

    if (tripDetails.includes(' to ')) {
      const [source, destination] = tripDetails.split(' to ');
      return { source: source.trim(), destination: destination.trim() };
    }

    if (tripDetails.includes(' → ')) {
      const [source, destination] = tripDetails.split(' → ');
      return { source: source.trim(), destination: destination.trim() };
    }

    return { source: tripDetails, destination: '' };
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Table Header - FIXED ALIGNMENT */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-center justify-between">
          {/* Left side: Checkbox and Invoice count */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-12 flex-shrink-0">
              <input
                type="checkbox"
                checked={invoices.length > 0 && selectedInvoices.length === invoices.length}
                onChange={handleSelectAll}
                className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div className="w-16 xl:w-20 flex-shrink-0">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                Invoice
              </span>
            </div>
          </div>

          {/* Right side: Column headers (MATCH BODY EXACTLY) */}
          <div className="flex items-center justify-end gap-4 flex-shrink-0 mr-16">

            {/* Amount */}
            <div className="w-24 text-right hidden md:block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Amount
              </span>
            </div>

            {/* Due Date */}
            <div className="w-28 text-right hidden lg:block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Due Date
              </span>
            </div>

            {/* Balance Due */}
            <div className="w-28 text-right hidden xl:block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Balance Due
              </span>
            </div>

            {/* Actions */}
            <div className="w-28 text-right hidden xl:block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Actions
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* Table Body - UPDATED FOR PROPER ALIGNMENT */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {invoices.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto w-12 h-12 text-gray-400 dark:text-gray-500 mb-4">
              <FileText className="w-full h-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No invoices found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Create your first invoice or adjust your filters
            </p>
          </div>
        ) : (
          invoices.map((invoice) => {
            const daysUntilDue = getDaysUntilDue(invoice);
            const overdue = isOverdue(invoice);
            const { source, destination } = parseTripDetails(invoice.tripDetails || invoice.trip);

            return (
              <div
                key={invoice.id}
                className={`px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors ${selectedInvoices.includes(invoice.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  } ${overdue ? 'border-l-4 border-red-500' : ''}`}
              >
                <div className="flex items-center justify-between">
                  {/* Left Side - Invoice Info */}
                  <div className="flex items-center flex-1 min-w-0">
                    {/* Checkbox */}
                    <div className="w-12 flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={selectedInvoices.includes(invoice.id)}
                        onChange={() => handleSelectInvoice(invoice.id)}
                        className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                    </div>

                    {/* Invoice Icon and Details */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Icon */}
                      <div className={`p-3 rounded-xl ${invoice.status === 'paid' ? 'bg-emerald-100 dark:bg-emerald-900/20' :
                        invoice.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/20' :
                          invoice.status === 'overdue' ? 'bg-red-100 dark:bg-red-900/20' :
                            'bg-gray-100 dark:bg-gray-900/20'
                        }`}>
                        <FileText className={`h-5 w-5 ${invoice.status === 'paid' ? 'text-emerald-600 dark:text-emerald-400' :
                          invoice.status === 'pending' ? 'text-amber-600 dark:text-amber-400' :
                            invoice.status === 'overdue' ? 'text-red-600 dark:text-red-400' :
                              'text-gray-600 dark:text-gray-400'
                          }`} />
                      </div>

                      {/* Invoice Info */}
                      <div className="min-w-0 flex-1 max-w-[500px]">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 dark:text-white truncate">
                            INV-{invoice.id?.toString().padStart(6, "0")}
                          </h4>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                            {getStatusIcon(invoice.status)}
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                          {overdue && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                              Overdue
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 truncate">
                          {invoice.customer || invoice.customerName}
                        </p>

                        {/* Trip Details */}
                        <div className="flex flex-wrap items-start gap-4 mb-3">
                          {source && (
                            <div className="min-w-0 max-w-[250px]">
                              <AddressDisplay label="From" address={source} />
                            </div>
                          )}
                          {destination && (
                            <div className="min-w-0 max-w-[250px]">
                              <AddressDisplay label="To" address={destination} />
                            </div>
                          )}
                        </div>

                        {/* Invoice Details */}
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                          {invoice.vehicleNumber && (
                            <>
                              <span className="flex items-center gap-1 whitespace-nowrap">
                                <Car className="h-3 w-3" />
                                {invoice.vehicleNumber}
                              </span>
                              <span>•</span>
                            </>
                          )}
                          <span className="flex items-center gap-1 whitespace-nowrap">
                            <Calendar className="h-3 w-3" />
                            {formatDate(invoice.issueDate)}
                          </span>
                          {invoice.tripId && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1 whitespace-nowrap">
                                <Navigation className="h-3 w-3" />
                                Trip {invoice.tripId}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Values and Actions */}
                  <div className="flex items-center justify-end gap-4 flex-shrink-0">

                    {/* Amount */}
                    <div className="w-24 text-right hidden md:block">
                      <div className="flex items-center justify-end gap-1 text-lg font-bold text-gray-900 dark:text-white">
                        <IndianRupee className="h-4 w-4" />
                        {invoice.totalAmount?.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
                    </div>

                    {/* Due Date */}
                    <div className="w-28 text-right hidden lg:block">
                      <div
                        className={`text-sm font-medium ${overdue
                          ? "text-red-600 dark:text-red-400"
                          : daysUntilDue <= 3
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-gray-900 dark:text-white"
                          }`}
                      >
                        {formatDate(invoice.dueDate)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {overdue ? "Overdue" : `${daysUntilDue} days left`}
                      </div>
                    </div>

                    {/* Balance Due */}
                    <div className="w-28 text-right hidden xl:block mr-16">
                      <div
                        className={`text-sm font-medium ${invoice.balanceDue > 0
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-emerald-600 dark:text-emerald-400"
                          }`}
                      >
                        ₹{invoice.balanceDue?.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Balance Due
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="w-28 flex items-center justify-end gap-1">
                      <button onClick={() => onPreview(invoice)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400">
                        <Eye className="h-4 w-4" />
                      </button> 

                      <button onClick={() => onEdit(invoice)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hidden xl:inline-flex dark:text-gray-400">
                        <Edit className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => setExpandedId(expandedId === invoice.id ? null : invoice.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400"
                      >
                        <ChevronRight
                          className={`h-4 w-4 transition-transform ${expandedId === invoice.id ? "rotate-90" : ""
                            }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details (unchanged from previous fix) */}
                {expandedId === invoice.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Customer Details */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Customer Details</h5>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Customer:</span>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {invoice.customer || invoice.customerName}
                              </span>
                            </div>
                          </div>
                          {invoice.customerPhone && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Phone:</span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {invoice.customerPhone}
                              </span>
                            </div>
                          )}
                          {invoice.customerEmail && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {invoice.customerEmail}
                              </span>
                            </div>
                          )}
                          {invoice.createdBy && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Created by:</span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {invoice.createdBy}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Trip Details */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Trip Details</h5>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Trip ID:</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {invoice.tripId || 'N/A'}
                            </span>
                          </div>
                          {invoice.vehicleNumber && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Vehicle:</span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {invoice.vehicleNumber}
                              </span>
                            </div>
                          )}
                          {invoice.driverNumber && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Driver:</span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {invoice.driverNumber}
                              </span>
                            </div>
                          )}
                          {source && (
                            <div className="flex flex-col gap-1">
                              <span className="text-sm text-gray-600 dark:text-gray-400">From:</span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {source}
                              </span>
                            </div>
                          )}
                          {destination && (
                            <div className="flex flex-col gap-1">
                              <span className="text-sm text-gray-600 dark:text-gray-400">To:</span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {destination}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Payment Summary */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Payment Summary</h5>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal:</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              ₹{invoice.subtotal?.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Tax ({invoice.taxRate || 0}%):</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              ₹{invoice.taxAmount?.toLocaleString() || '0'}
                            </span>
                          </div>
                          {invoice.discount > 0 && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Discount:</span>
                              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                -₹{invoice.discount?.toLocaleString()}
                              </span>
                            </div>
                          )}
                          <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">Total:</span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                              ₹{invoice.totalAmount?.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">Amount Paid:</span>
                            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                              ₹{invoice.amountPaid?.toLocaleString() || '0'}
                            </span>
                          </div>
                          <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">Balance Due:</span>
                            <span className={`text-lg font-bold ${invoice.balanceDue > 0
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                              }`}>
                              ₹{invoice.balanceDue?.toLocaleString() || '0'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Items Table */}
                    {invoice.items && invoice.items.length > 0 && (
                      <div className="mt-6">
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Items</h5>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="py-2 text-left text-gray-600 dark:text-gray-400">Item Code</th>
                                <th className="py-2 text-left text-gray-600 dark:text-gray-400">Description</th>
                                <th className="py-2 text-right text-gray-600 dark:text-gray-400">Quantity</th>
                                <th className="py-2 text-right text-gray-600 dark:text-gray-400">Unit</th>
                                <th className="py-2 text-right text-gray-600 dark:text-gray-400">Rate</th>
                                <th className="py-2 text-right text-gray-600 dark:text-gray-400">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {invoice.items.map((item, idx) => (
                                <tr key={idx} className="border-b border-gray-200 dark:border-gray-700">
                                  <td className="py-3 text-gray-900 dark:text-white">{item.itemCode || `ITEM-${idx + 1}`}</td>
                                  <td className="py-3 text-gray-900 dark:text-white">{item.description}</td>
                                  <td className="py-3 text-right text-gray-900 dark:text-white">{item.quantity}</td>
                                  <td className="py-3 text-right text-gray-600 dark:text-gray-400">{item.unit}</td>
                                  <td className="py-3 text-right text-gray-900 dark:text-white">₹{item.rate?.toLocaleString()}</td>
                                  <td className="py-3 text-right text-gray-900 dark:text-white">₹{item.amount?.toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => onPreview(invoice)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Eye className="h-4 w-4" />
                        Preview
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};