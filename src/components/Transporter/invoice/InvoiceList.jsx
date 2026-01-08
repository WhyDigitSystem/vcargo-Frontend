import { 
  Edit, 
  Trash2, 
  Eye, 
  Mail, 
  Printer, 
  MoreVertical,
  ChevronRight,
  FileText,
  IndianRupee,
  Calendar,
  User,
  Car,
  CheckCircle,
  Clock,
  AlertCircle,
  Download
} from "lucide-react";
import { useState } from "react";

export const InvoiceList = ({ 
  invoices, 
  onEdit, 
  onDelete, 
  onPreview,
  onStatusChange,
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
    switch(status) {
      case 'paid': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300';
      case 'pending': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300';
      case 'overdue': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'draft': return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
      case 'cancelled': return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={invoices.length > 0 && selectedInvoices.length === invoices.length}
              onChange={handleSelectAll}
              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Invoices ({invoices.length})
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <span className="hidden md:inline">Amount</span>
            <span className="hidden lg:inline">Due Date</span>
            <span className="hidden xl:inline">Actions</span>
          </div>
        </div>
      </div>

      {/* Table Body */}
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
            
            return (
              <div 
                key={invoice.id} 
                className={`px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors ${
                  selectedInvoices.includes(invoice.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                } ${overdue ? 'border-l-4 border-red-500' : ''}`}
              >
                <div className="flex items-center justify-between">
                  {/* Left Side */}
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedInvoices.includes(invoice.id)}
                      onChange={() => handleSelectInvoice(invoice.id)}
                      className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    
                    {/* Invoice Info */}
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${
                        invoice.status === 'paid' ? 'bg-emerald-100 dark:bg-emerald-900/20' :
                        invoice.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/20' :
                        invoice.status === 'overdue' ? 'bg-red-100 dark:bg-red-900/20' :
                        'bg-gray-100 dark:bg-gray-900/20'
                      }`}>
                        <FileText className={`h-5 w-5 ${
                          invoice.status === 'paid' ? 'text-emerald-600 dark:text-emerald-400' :
                          invoice.status === 'pending' ? 'text-amber-600 dark:text-amber-400' :
                          invoice.status === 'overdue' ? 'text-red-600 dark:text-red-400' :
                          'text-gray-600 dark:text-gray-400'
                        }`} />
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {invoice.invoiceNumber}
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
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {invoice.customerName}
                        </p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Car className="h-3 w-3" />
                            {invoice.vehicleName}
                          </span>
                          <span>•</span>
                          <span>{invoice.tripDetails}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(invoice.issueDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="flex items-center gap-8">
                    {/* Amount */}
                    <div className="hidden md:block">
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-lg font-bold text-gray-900 dark:text-white">
                          <IndianRupee className="h-4 w-4" />
                          {invoice.totalAmount?.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Total
                        </div>
                      </div>
                    </div>

                    {/* Due Date */}
                    <div className="hidden lg:block">
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          overdue ? 'text-red-600 dark:text-red-400' : 
                          daysUntilDue !== null && daysUntilDue <= 3 ? 'text-amber-600 dark:text-amber-400' : 
                          'text-gray-900 dark:text-white'
                        }`}>
                          {formatDate(invoice.dueDate)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {overdue ? 'Overdue' : 
                           daysUntilDue !== null ? `${daysUntilDue} days left` : 'Due Date'}
                        </div>
                      </div>
                    </div>

                    {/* Balance Due */}
                    <div className="hidden xl:block">
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          invoice.balanceDue > 0 ? 'text-amber-600 dark:text-amber-400' : 
                          'text-emerald-600 dark:text-emerald-400'
                        }`}>
                          ₹{invoice.balanceDue?.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Balance Due
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onPreview(invoice)}
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                        title="Preview invoice"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onSend(invoice.id)}
                        className="p-2 text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded-lg"
                        title="Send invoice"
                      >
                        <Mail className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        title="Print invoice"
                      >
                        <Printer className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(invoice)}
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                        title="Edit invoice"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => setExpandedId(expandedId === invoice.id ? null : invoice.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        <ChevronRight className={`h-4 w-4 transition-transform ${expandedId === invoice.id ? 'rotate-90' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === invoice.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Customer Details */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Customer Details</h5>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900 dark:text-white">{invoice.customerName}</span>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {invoice.customerEmail}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {invoice.customerPhone}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {invoice.customerAddress}
                          </div>
                        </div>
                      </div>

                      {/* Trip Details */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Trip Details</h5>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Vehicle:</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {invoice.vehicleName}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Driver:</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {invoice.driverName}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Trip:</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {invoice.tripDetails}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Payment Summary */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Payment Summary</h5>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal:</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              ₹{invoice.subtotal?.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Tax ({invoice.taxRate}%):</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              ₹{invoice.taxAmount?.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Discount:</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              -₹{invoice.discount?.toLocaleString()}
                            </span>
                          </div>
                          <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">Total:</span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                              ₹{invoice.totalAmount?.toLocaleString()}
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
                                  <td className="py-2 text-gray-900 dark:text-white">{item.description}</td>
                                  <td className="py-2 text-right text-gray-900 dark:text-white">{item.quantity}</td>
                                  <td className="py-2 text-right text-gray-600 dark:text-gray-400">{item.unit}</td>
                                  <td className="py-2 text-right text-gray-900 dark:text-white">₹{item.rate?.toLocaleString()}</td>
                                  <td className="py-2 text-right text-gray-900 dark:text-white">₹{item.amount?.toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-6 flex items-center gap-3">
                      <button
                        onClick={() => onPreview(invoice)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Eye className="h-4 w-4" />
                        Preview
                      </button>
                      <button
                        onClick={() => onSend(invoice.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                      >
                        <Mail className="h-4 w-4" />
                        Send to Customer
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                      >
                        <Printer className="h-4 w-4" />
                        Print
                      </button>
                      <button
                        onClick={() => {
                          // Download PDF logic
                          console.log("Downloading PDF for", invoice.id);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      >
                        <Download className="h-4 w-4" />
                        Download PDF
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