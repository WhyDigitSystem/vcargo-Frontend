import { useState, useEffect } from "react";
import { 
  FileText, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Plus,
  Download,
  Filter,
  Search,
  IndianRupee,
  TrendingUp,
  Users,
  Calendar
} from "lucide-react";
import { InvoiceStats } from "./InvoiceStats";
import { InvoiceFilters } from "./InvoiceFilters";
import { InvoiceList } from "./InvoiceList";
import { InvoiceForm } from "./InvoiceForm";
import { InvoicePreview } from "./InvoicePreview";

export const InvoiceDashboard = ({ vehicles = [], customers = [] }) => {
  const [invoices, setInvoices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    customerId: "all",
    vehicleId: "all",
    dateRange: "all",
  });

  // Fetch invoices
  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    // Mock data
    const mockInvoices = [
      {
        id: "INV-2024-001",
        invoiceNumber: "INV-2024-001",
        customerId: "CUST-001",
        customerName: "Reliance Industries",
        customerEmail: "accounts@reliance.com",
        customerPhone: "+91 9876543210",
        customerAddress: "Mumbai, Maharashtra",
        vehicleId: "V001",
        vehicleName: "Tata Ace",
        driverId: "D001",
        driverName: "Rajesh Kumar",
        tripId: "TRIP-001",
        tripDetails: "Mumbai to Pune",
        issueDate: "2024-03-15",
        dueDate: "2024-04-15",
        status: "paid",
        paymentDate: "2024-03-20",
        paymentMethod: "bank_transfer",
        subtotal: 25000,
        taxRate: 18,
        taxAmount: 4500,
        discount: 1000,
        totalAmount: 28500,
        amountPaid: 28500,
        balanceDue: 0,
        notes: "Transportation charges for March delivery",
        items: [
          {
            id: "ITEM-001",
            description: "Transportation charges",
            quantity: 1,
            unit: "trip",
            rate: 20000,
            amount: 20000,
          },
          {
            id: "ITEM-002",
            description: "Loading charges",
            quantity: 2,
            unit: "hour",
            rate: 1000,
            amount: 2000,
          },
          {
            id: "ITEM-003",
            description: "Unloading charges",
            quantity: 2,
            unit: "hour",
            rate: 1500,
            amount: 3000,
          },
        ],
      },
      {
        id: "INV-2024-002",
        invoiceNumber: "INV-2024-002",
        customerId: "CUST-002",
        customerName: "Tata Motors",
        customerEmail: "payments@tatamotors.com",
        customerPhone: "+91 9876543211",
        customerAddress: "Pune, Maharashtra",
        vehicleId: "V002",
        vehicleName: "Ashok Leyland Dost",
        driverId: "D002",
        driverName: "Amit Sharma",
        tripId: "TRIP-002",
        tripDetails: "Pune to Bangalore",
        issueDate: "2024-03-10",
        dueDate: "2024-04-10",
        status: "pending",
        paymentMethod: "cash",
        subtotal: 45000,
        taxRate: 18,
        taxAmount: 8100,
        discount: 2000,
        totalAmount: 51100,
        amountPaid: 25000,
        balanceDue: 26100,
        notes: "Urgent delivery charges",
      },
      // Add more invoices...
    ];
    setInvoices(mockInvoices);
  };

  const handleSaveInvoice = async (invoiceData) => {
    if (editingInvoice) {
      setInvoices(invoices.map(i => i.id === invoiceData.id ? invoiceData : i));
    } else {
      const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`;
      setInvoices([...invoices, { 
        ...invoiceData, 
        id: `INV-${Date.now()}`,
        invoiceNumber,
        status: 'draft',
        balanceDue: invoiceData.totalAmount - (invoiceData.amountPaid || 0)
      }]);
    }
    setShowForm(false);
    setEditingInvoice(null);
  };

  const handleDeleteInvoice = async (id) => {
    setInvoices(invoices.filter(i => i.id !== id));
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setShowForm(true);
  };

  const handlePreviewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowPreview(true);
  };

  const handleStatusChange = (id, status) => {
    setInvoices(invoices.map(invoice => 
      invoice.id === id ? { 
        ...invoice, 
        status,
        paymentDate: status === 'paid' ? new Date().toISOString().split('T')[0] : invoice.paymentDate
      } : invoice
    ));
  };

  const handleSendInvoice = async (id) => {
    // Send invoice email logic
    console.log(`Sending invoice ${id} to customer`);
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = !filters.search || 
      invoice.invoiceNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(filters.search.toLowerCase()) ||
      invoice.tripDetails?.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStatus = filters.status === "all" || invoice.status === filters.status;
    const matchesCustomer = filters.customerId === "all" || invoice.customerId === filters.customerId;
    const matchesVehicle = filters.vehicleId === "all" || invoice.vehicleId === filters.vehicleId;

    // Date range filter
    let matchesDate = true;
    if (filters.dateRange !== "all") {
      const invoiceDate = new Date(invoice.issueDate);
      const today = new Date();
      
      switch(filters.dateRange) {
        case "today":
          matchesDate = invoiceDate.toDateString() === today.toDateString();
          break;
        case "week":
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          matchesDate = invoiceDate >= weekAgo;
          break;
        case "month":
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          matchesDate = invoiceDate >= monthAgo;
          break;
        case "quarter":
          const quarterAgo = new Date(today);
          quarterAgo.setMonth(quarterAgo.getMonth() - 3);
          matchesDate = invoiceDate >= quarterAgo;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesCustomer && matchesVehicle && matchesDate;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoice Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create, manage, and track invoices for your transport services
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            Create Invoice
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <InvoiceStats invoices={invoices} />

      {/* Filters */}
      <InvoiceFilters 
        filters={filters}
        setFilters={setFilters}
        customers={customers}
        vehicles={vehicles}
        selectedInvoices={selectedInvoices}
        onBulkAction={(action) => {
          if (action === "export") {
            // Export selected invoices
            console.log("Exporting:", selectedInvoices);
          } else if (action === "send") {
            // Send selected invoices
            selectedInvoices.forEach(id => handleSendInvoice(id));
          }
        }}
      />

      {/* Invoice List */}
      <InvoiceList 
        invoices={filteredInvoices}
        onEdit={handleEditInvoice}
        onDelete={handleDeleteInvoice}
        onPreview={handlePreviewInvoice}
        onStatusChange={handleStatusChange}
        onSend={handleSendInvoice}
        selectedInvoices={selectedInvoices}
        onSelectInvoice={setSelectedInvoices}
      />

      {/* Invoice Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => {
              setShowForm(false);
              setEditingInvoice(null);
            }} />
            <InvoiceForm 
              invoice={editingInvoice}
              customers={customers}
              vehicles={vehicles}
              onSave={handleSaveInvoice}
              onCancel={() => {
                setShowForm(false);
                setEditingInvoice(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Invoice Preview Modal */}
      {showPreview && selectedInvoice && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPreview(false)} />
            <InvoicePreview 
              invoice={selectedInvoice}
              onClose={() => setShowPreview(false)}
              onPrint={() => window.print()}
            />
          </div>
        </div>
      )}
    </div>
  );
};
