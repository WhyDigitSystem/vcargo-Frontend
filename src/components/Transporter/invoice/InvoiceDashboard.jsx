import { useState, useEffect } from "react";
import {
  Plus,
} from "lucide-react";
import { InvoiceStats } from "./InvoiceStats";
import { InvoiceFilters } from "./InvoiceFilters";
import { InvoiceList } from "./InvoiceList";
import { InvoiceForm } from "./InvoiceForm";
import { InvoicePreview } from "./InvoicePreview";
import { useSelector } from "react-redux";
import { invoiceAPI } from "../../../api/invoiceService";

export const InvoiceDashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    customerId: "all",
    vehicleId: "all",
    dateRange: "all",
  });
  const { user } = useSelector((state) => state.auth);
  const orgId = user.orgId;
  const createdBy = user.username || user.name || user.id;

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    const loadInvoices = async () => {
      const { extractedCustomers, extractedVehicles } = await fetchInvoices();

      setCustomers(extractedCustomers);
      setVehicles(extractedVehicles);
    };

    loadInvoices();
  }, []);

  const fetchInvoices = async () => {
    const response = await invoiceAPI.getAllInvoice({
      count: 10,
      page: 1,
      orgId
    });

    const apiInvoices = response?.paramObjectsMap?.tripInvoice?.data || [];

    const customerSet = new Set();
    const vehicleSet = new Set();

    const listViewInvoices = apiInvoices.map(inv => {
      if (inv.customer) customerSet.add(inv.customer);
      if (inv.vehicleNumber) vehicleSet.add(inv.vehicleNumber);

      return {
        id: inv.id,
        customerId: inv.customer,
        customerName: inv.customer,
        vehicleId: inv.vehicleId,
        vehicleNumber: inv.vehicleNumber,
        driverId: inv.driverId,
        driverNumber: inv.driverNumber,
        tripId: inv.tripId,
        tripDetails: inv.tripDetails,
        issueDate: inv.issueDate,
        dueDate: inv.dueDate,
        status: inv.status,
        subtotal: Number(inv.subtotal) || 0,
        taxRate: Number(inv.taxRate) || 0,
        taxAmount: Number(inv.taxAmount) || 0,
        discount: Number(inv.discount) || 0,
        totalAmount: Number(inv.totalAmount) || 0,
        amountPaid: Number(inv.amountPaid) || 0,
        balanceDue: Number(inv.balanceDue) || 0,
        paymentMethod: inv.paymentMethod || "",
        paymentDate: inv.paymentDate || "",
        items: inv.items || [],
        notes: inv.notes || ""
      };
    });

    const extractedCustomers = Array.from(customerSet).map(customer => ({
      id: customer, // Using customer name as ID since no separate ID provided
      name: customer
    }));

    const extractedVehicles = Array.from(vehicleSet).map(vehicle => ({
      id: vehicle, // Using vehicle number as ID since no separate ID provided
      registrationNumber: vehicle
    }));

    setInvoices(listViewInvoices);

    // Return or set the extracted data for use in filters
    return { extractedCustomers, extractedVehicles };
  };

  const handleSaveInvoice = async (invoiceData) => {
    try {
      const payload = {
        orgId,
        createdBy,
        customer: invoiceData.customerId,
        vehicleId: invoiceData.vehicleId,
        driverId: invoiceData.driverId,
        tripId: invoiceData.tripId,
        tripDetails: invoiceData.tripDetails,
        issueDate: invoiceData.issueDate,
        dueDate: invoiceData.dueDate,
        paymentDate: invoiceData.paymentDate || "",
        status: invoiceData.status,
        paymentMethod: invoiceData.paymentMethod,
        subtotal: Number(invoiceData.subtotal),
        taxRate: Number(invoiceData.taxRate),
        taxAmount: Number(invoiceData.taxAmount),
        discount: Number(invoiceData.discount),
        totalAmount: Number(invoiceData.totalAmount),
        amountPaid: Number(invoiceData.amountPaid),
        balanceDue: Number(invoiceData.balanceDue),
        notes: invoiceData.notes || "",
        items: invoiceData.items.map(item => ({
          id: item.id,
          description: item.description,
          quantity: Number(item.quantity),
          rate: Number(item.rate),
          unit: item.unit,
          amount: Number(item.amount)
        }))
      };

      // ✅ SEND ID ONLY FOR EDIT
      if (editingInvoice?.id) {
        payload.id = editingInvoice.id;
      }

      console.log("FINAL INVOICE PAYLOAD 👉", payload);

      await invoiceAPI.createUpdateInvoice(payload);

      await fetchInvoices();

      setShowForm(false);
      setEditingInvoice(null);

    } catch (error) {
      console.error("Invoice Save Failed ❌", error);
      alert("Failed to save invoice. Please try again.");
    }
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
    console.log(`Sending invoice ${id} to customer`);
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = !filters.search ||
      invoice.id?.toString().toLowerCase().includes(filters.search.toLowerCase()) ||
      invoice.customerName?.toLowerCase().includes(filters.search.toLowerCase()) ||
      invoice.tripDetails?.toLowerCase().includes(filters.search.toLowerCase()) ||
      invoice.vehicleNumber?.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStatus = filters.status === "all" || invoice.status === filters.status;

    // Compare by string value since we're using names/numbers as IDs
    const matchesCustomer = filters.customerId === "all" ||
      invoice.customerId === filters.customerId;

    const matchesVehicle = filters.vehicleId === "all" ||
      invoice.vehicleId === filters.vehicleId;

    // Date range filter remains the same
    let matchesDate = true;
    if (filters.dateRange !== "all") {
      const invoiceDate = new Date(invoice.issueDate);
      const today = new Date();

      switch (filters.dateRange) {
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
        customers={customers} // Use state variable instead of prop
        vehicles={vehicles}   // Use state variable instead of prop
        selectedInvoices={selectedInvoices}
        onBulkAction={(action) => {
          if (action === "export") {
            console.log("Exporting:", selectedInvoices);
          } else if (action === "send") {
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
