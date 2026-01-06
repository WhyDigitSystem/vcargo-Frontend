// pages/InvoiceManagement.jsx
import { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Plus,
  Download,
  Mail,
  Trash2,
  FileText,
} from "lucide-react";



import InvoiceList from "./invoice/InvoiceList";
import InvoiceStats from "./invoice/InvoiceStats";
import invoiceService from "../../api/invoiceService";
import InvoicePDFGenerator from "./invoice/InvoicePDFGenerator";

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    revenue: 0,
    pending: 0,
    overdue: 0
  });

  const pdfGenerator = new InvoicePDFGenerator();

  // Initialize
  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      const data = await invoiceService.getInvoices();
      setInvoices(data);
      setFilteredInvoices(data);
      calculateStats(data);
    } catch (error) {
      console.error("Error loading invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const total = data.length;
    const revenue = data
      .filter(inv => inv.status === "paid")
      .reduce((sum, inv) => sum + parseFloat(inv.amount.replace('$', '')), 0);
    const pending = data.filter(inv => inv.status === "pending").length;
    const overdue = data.filter(inv => inv.status === "overdue").length;
    
    setStats({
      total,
      revenue: `$${revenue.toLocaleString()}`,
      pending,
      overdue
    });
  };

  // Filtering
  useEffect(() => {
    const filtered = invoices.filter((invoice) => {
      const matchesStatus = filterStatus === "all" || invoice.status === filterStatus;
      const matchesSearch = 
        invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.vehicle.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });
    setFilteredInvoices(filtered);
  }, [invoices, filterStatus, searchQuery]);

  // Invoice Actions
  const handleSelectInvoice = (id) => {
    if (selectedInvoices.includes(id)) {
      setSelectedInvoices(selectedInvoices.filter(invoiceId => invoiceId !== id));
    } else {
      setSelectedInvoices([...selectedInvoices, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices.map(invoice => invoice.id));
    }
  };

  const handleDownloadPDF = (invoice) => {
    pdfGenerator.generateInvoice(invoice);
  };

  const handleBulkDownloadPDF = () => {
    const selected = invoices.filter(inv => selectedInvoices.includes(inv.id));
    // Create a zip file with multiple PDFs
    selected.forEach((invoice, index) => {
      setTimeout(() => {
        pdfGenerator.generateInvoice(invoice);
      }, index * 500); // Stagger downloads
    });
  };

  const handleMarkPaid = async (invoice) => {
    try {
      await invoiceService.updateInvoice(invoice.id, { status: "paid" });
      loadInvoices(); // Refresh data
    } catch (error) {
      console.error("Error marking as paid:", error);
    }
  };

  const handleDeleteInvoice = async (invoice) => {
    if (window.confirm(`Are you sure you want to delete invoice ${invoice.id}?`)) {
      try {
        await invoiceService.deleteInvoice(invoice.id);
        loadInvoices(); // Refresh data
      } catch (error) {
        console.error("Error deleting invoice:", error);
      }
    }
  };

  const handleSendEmail = (invoice) => {
    // Implement email sending logic here
    const emailSubject = `Invoice ${invoice.id} - FleetSync Pro`;
    const emailBody = `Dear ${invoice.customer},\n\nPlease find attached invoice ${invoice.id} for ${invoice.amount}.\n\nThank you for your business!\n\nFleetSync Pro Team`;
    window.location.href = `mailto:${invoice.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  };

  const handlePrint = (invoice) => {
    // Create a printable version
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${invoice.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .invoice-details { margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .total { font-weight: bold; font-size: 1.2em; }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>FleetSync Pro</h1>
            <h2>INVOICE</h2>
          </div>
          <div class="invoice-details">
            <p><strong>Invoice #:</strong> ${invoice.id}</p>
            <p><strong>Date:</strong> ${new Date(invoice.date).toLocaleDateString()}</p>
            <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
            <p><strong>Customer:</strong> ${invoice.customer}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Vehicle</th>
                <th>Driver</th>
                <th>Route</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Trip ${invoice.trip}</td>
                <td>${invoice.vehicle}</td>
                <td>${invoice.driver}</td>
                <td>${invoice.route}</td>
                <td>${invoice.amount}</td>
              </tr>
            </tbody>
          </table>
          <div class="total">
            <p>Total Amount: ${invoice.amount}</p>
          </div>
          <button class="no-print" onclick="window.print()">Print</button>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleCreateInvoice = () => {
    // Navigate to create invoice page or open modal
    window.location.href = "/invoices/create";
  };

  // Prepare stats for component
  const statsData = [
    { 
      label: "Total Invoices", 
      value: stats.total.toString(), 
      change: "+12%", 
      color: "text-blue-600", 
      bgColor: "bg-blue-50 dark:bg-blue-900/20" 
    },
    { 
      label: "Total Revenue", 
      value: stats.revenue, 
      change: "+8.5%", 
      color: "text-emerald-600", 
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20" 
    },
    { 
      label: "Pending", 
      value: stats.pending.toString(), 
      change: "-2", 
      color: "text-amber-600", 
      bgColor: "bg-amber-50 dark:bg-amber-900/20" 
    },
    { 
      label: "Overdue", 
      value: stats.overdue.toString(), 
      change: "+1", 
      color: "text-red-600", 
      bgColor: "bg-red-50 dark:bg-red-900/20" 
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Invoice Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Create, track, and manage all your fleet invoices
              </p>
            </div>
            <button 
              onClick={handleCreateInvoice}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-lg"
            >
              <Plus className="h-4 w-4" />
              <span className="font-medium">Create Invoice</span>
            </button>
          </div>

          {/* Stats */}
          <InvoiceStats stats={statsData} />
        </div>

        {/* Filters and Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by invoice ID, customer, vehicle..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                  <option value="draft">Draft</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedInvoices.length > 0 && (
            <div className="flex items-center gap-3 mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
              <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                {selectedInvoices.length} invoice(s) selected
              </span>
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={handleBulkDownloadPDF}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
                <button
                  onClick={() => {
                    selectedInvoices.forEach(id => {
                      const invoice = invoices.find(inv => inv.id === id);
                      if (invoice) handleSendEmail(invoice);
                    });
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                >
                  <Mail className="h-4 w-4" />
                  Send
                </button>
                <button
                  onClick={async () => {
                    if (window.confirm(`Are you sure you want to delete ${selectedInvoices.length} invoice(s)?`)) {
                      try {
                        await Promise.all(selectedInvoices.map(id => 
                          invoiceService.deleteInvoice(id)
                        ));
                        loadInvoices();
                        setSelectedInvoices([]);
                      } catch (error) {
                        console.error("Error deleting invoices:", error);
                      }
                    }
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg text-sm hover:bg-red-100 dark:hover:bg-red-900/40"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Invoice List */}
        {filteredInvoices.length > 0 ? (
          <>
            <InvoiceList
              invoices={filteredInvoices}
              selectedInvoices={selectedInvoices}
              onSelectInvoice={handleSelectInvoice}
              onEdit={(invoice) => window.location.href = `/invoices/edit/${invoice.id}`}
              onDelete={handleDeleteInvoice}
              onDownload={handleDownloadPDF}
              onView={(invoice) => window.location.href = `/invoices/view/${invoice.id}`}
              onSend={handleSendEmail}
              onPrint={handlePrint}
              onMarkPaid={handleMarkPaid}
            />

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing 1-{filteredInvoices.length} of {invoices.length} invoices
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                  Previous
                </button>
                <button className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                  1
                </button>
                <button className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                  2
                </button>
                <button className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                  3
                </button>
                <button className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="inline-flex p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl mb-4">
              <FileText className="h-12 w-12 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No invoices found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery
                ? "No invoices match your search criteria"
                : "Get started by creating your first invoice"}
            </p>
            <button 
              onClick={handleCreateInvoice}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
            >
              <Plus className="h-4 w-4" />
              <span className="font-medium">Create Invoice</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceManagement;