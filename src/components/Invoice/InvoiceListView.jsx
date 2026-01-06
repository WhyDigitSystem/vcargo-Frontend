import { Plus, Filter, FileText, Calendar, Edit3, Banknote, CheckCheck, Hourglass, Receipt } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { vendorInvoiceAPI } from "../../api/vendorInvoiceAPI";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";

const InvoiceListView = ({ setIsListView, setEditingId }) => {
    const [invoiceList, setInvoiceList] = useState([]);
    const [allInvoices, setAllInvoices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        totalInvoices: 0,
        totalAmount: 0,
        totalPaid: 0,
        totalPending: 0,
    });

    const [page, setPage] = useState(1);
    const [count] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    // FILTER UI
    const [showFilter, setShowFilter] = useState(false);
    const [filters, setFilters] = useState({
        search: "",
        status: "",
    });

    const { user } = useSelector((state) => state.auth);
    const orgId = user.orgId;
     
    const debouncedSearch = useDebounce(filters.search, 500);

    useEffect(() => {
        getAllInvoices();
    }, [page, debouncedSearch]);

    useEffect(() => {
        applyFilters();
    }, [filters.status, allInvoices]);

    const getAllInvoices = async () => {
        try {
            setLoading(true);

            const response = await vendorInvoiceAPI.getAllVendorInvoice({
                page,
                count,
                search: filters.search.trim(),
                orgId
            });

            const data = response?.paramObjectsMap?.vendorInvoiceVO?.data || [];
            const total = response?.paramObjectsMap?.vendorInvoiceVO?.totalCount || 0;

            setAllInvoices(data);
            setInvoiceList(data);
            setTotalCount(total);
            setTotalPages(Math.ceil(total / count) || 1);

            // Calculate stats
            calculateStats(data);

        } catch (error) {
            console.error("Error fetching invoice list:", error);
            setAllInvoices([]);
            setInvoiceList([]);
            setTotalCount(0);
            setTotalPages(1);
            setStats({
                totalInvoices: 0,
                totalAmount: 0,
                totalPaid: 0,
                totalPending: 0,
            });
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (invoices) => {
        let totalAmount = 0;
        let totalPaid = 0;
        let totalPending = 0;

        invoices.forEach(invoice => {
            // Extract numeric amount (remove ₹ and commas)
            const amount = parseFloat(invoice.amount?.replace(/[₹,]/g, '') || 0);
            totalAmount += amount;

            if (invoice.status === "Paid") {
                totalPaid += 1;
            } else if (invoice.status === "Pending") {
                totalPending += 1;
            }
        });

        setStats({
            totalInvoices: invoices.length,
            totalAmount,
            totalPaid,
            totalPending,
        });
    };

    const applyFilters = () => {
        let filtered = [...allInvoices];

        // Apply status filter
        if (filters.status && filters.status !== "All") {
            filtered = filtered.filter(invoice => invoice.status === filters.status);
        }

        setInvoiceList(filtered);
    };

    const handleEdit = (invoice) => {
        console.log("Editing Invoice ID:", invoice.id);
        setEditingId(invoice.id);
        setIsListView(false);
    };

    const handleNewInvoice = () => {
        setEditingId(null);
        setIsListView(false);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const statsCards = [
        {
            label: "Total Invoices",
            count: stats.totalInvoices.toString(),
            color: "blue",
            icon: FileText,
        },
        {
            label: "Total Amount",
            count: formatCurrency(stats.totalAmount),
            color: "green",
            icon: Banknote,
        },
        {
            label: "Total Paid",
            count: stats.totalPaid.toString(),
            color: "green",
            icon: CheckCheck,
        },
        {
            label: "Total Pending",
            count: stats.totalPending.toString(),
            color: "orange",
            icon: Hourglass,
        },
    ];

    return (
        <div className="max-w-7xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            {/* -------- HEADER -------- */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                    <Receipt className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Invoice Master
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    {/* FILTER BUTTON */}
                    <button
                        onClick={() => setShowFilter(!showFilter)}
                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
                    >
                        <Filter className="h-4 w-4" />
                        Filter
                    </button>

                    {/* ADD INVOICE */}
                    <button
                        onClick={handleNewInvoice}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
                    >
                        <Plus className="h-4 w-4" />
                        New Invoice
                    </button>
                </div>
            </div>

            {/* -------- SUMMARY CARDS -------- */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {statsCards.map((s) => {
                    const Icon = s.icon;
                    return (
                        <div
                            key={s.label}
                            className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col justify-between shadow-sm hover:shadow transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                    {s.label}
                                </h3>
                                <Icon
                                    className={`h-5 w-5 text-${s.color}-500 dark:text-${s.color}-400`}
                                />
                            </div>
                            <div
                                className={`mt-3 text-lg font-semibold text-${s.color}-600 dark:text-${s.color}-400`}
                            >
                                {s.count}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* -------- FILTER PANEL -------- */}
            {showFilter && (
                <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    {/* SEARCH */}
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search by Invoice Number, Vendor, or Amount..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                    </div>

                    {/* STATUS FILTER */}
                    <div className="w-48">
                        <select
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Paid">Paid</option>
                            <option value="Overdue">Overdue</option>
                        </select>
                    </div>
                </div>
            )}

            {/* -------- TABLE -------- */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="min-w-full text-sm text-gray-700 dark:text-gray-300">
                    <thead className="bg-gray-100 dark:bg-gray-800 uppercase text-gray-600 dark:text-gray-300 text-xs">
                        <tr>
                            {["#", "Invoice Number", "Vendor", "Invoice Type", "Invoice Date", "Due Date", "Status", "Action"].map((header, i) => (
                                <th key={i} className="px-5 py-3 text-left font-semibold">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="9" className="text-center py-8">
                                    <div className="flex flex-col items-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                                        <p className="text-gray-500 dark:text-gray-400">Loading invoices...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : invoiceList.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="text-center py-10 text-gray-500 dark:text-gray-400">
                                    <div className="flex flex-col items-center">
                                        <FileText className="h-10 w-10 mb-3 text-gray-400" />
                                        <p className="text-sm font-medium mb-2">No invoices found</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                            {filters.search || filters.status !== "All"
                                                ? "Try adjusting your filters"
                                                : "You haven't created any invoices yet"}
                                        </p>
                                        <button
                                            onClick={handleNewInvoice}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                                        >
                                            Create your first invoice
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            invoiceList.map((invoice, idx) => (
                                <tr
                                    key={invoice.id}
                                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-800/60 transition-all"
                                >
                                    <td className="px-5 py-4">{(page - 1) * count + (idx + 1)}</td>

                                    {/* INVOICE NUMBER */}
                                    <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white">
                                        {invoice.invoiceNumber}
                                    </td>

                                    {/* VENDOR */}
                                    <td className="px-5 py-4">
                                        {invoice.vendor?.organization || ""}
                                    </td>
                                    <td className="px-5 py-4">
                                        {invoice.invoiceType || ""}
                                    </td>


                                    {/* INVOICE DATE */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            {invoice.invoiceDate}
                                        </div>
                                    </td>

                                    {/* DUE DATE */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            {invoice.dueDate}
                                        </div>
                                    </td>

                                    {/* STATUS */}
                                    <td className="px-5 py-4">
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full 
                      ${invoice.active === "Active"
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                            }`}>
                                            {invoice.active}
                                        </span>
                                    </td>

                                    {/* ACTION */}
                                    <td className="px-5 py-4 text-center">
                                        <button
                                            onClick={() => handleEdit(invoice)}
                                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                            title="Edit"
                                        >
                                            <Edit3 className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* -------- PAGINATION -------- */}
            <div className="flex justify-between items-center mt-6 text-sm text-gray-500 dark:text-gray-400">
                <span>
                    Showing {invoiceList.length} of {totalCount} results
                </span>

                <div className="flex gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Prev
                    </button>

                    <span className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-blue-600 text-white">
                        {page}
                    </span>

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>

        </div>
    );
};

export default InvoiceListView;