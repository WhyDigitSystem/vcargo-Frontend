import { Plus, Filter, Edit3, Users, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { customerAPI } from "../../api/customerAPI";
import { useSelector } from "react-redux";

const CustomerListView = ({ setIsListView, onEdit, onAddCustomer }) => {
  const [customerList, setCustomerList] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [count] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // FILTER UI
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    active: "",
  });

  const { user } = useSelector((state) => state.auth);
  const orgId = user.orgId;

  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      setPage(1);
      getAllCustomers();
    }, 500);

    setSearchTimeout(timeout);

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [filters.search, page]);

  useEffect(() => {
    applyFilters();
  }, [filters.status, filters.active, allCustomers]);

  const getAllCustomers = async () => {
    try {
      setLoading(true);

      const response = await customerAPI.getAllCustomersList({
        page,
        count,
        orgId,
        search: filters.search.trim()
      });

      console.log('API Response:', response);

      // Updated data extraction based on your API structure
      const data = response?.paramObjectsMap?.customerVO?.data || [];
      const total = response?.paramObjectsMap?.customerVO?.totalCount || 0;

      console.log('Extracted data:', data);
      console.log('Total count:', total);

      if (data && Array.isArray(data)) {
        setAllCustomers(data);
        setCustomerList(data);
        setTotalCount(total);

        const calculatedTotalPages = Math.ceil(total / count);
        setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
      } else {
        setAllCustomers([]);
        setCustomerList([]);
        setTotalPages(1);
      }

    } catch (error) {
      console.error("Error fetching customers:", error);
      setAllCustomers([]);
      setCustomerList([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allCustomers];

    if (filters.status) {
      filtered = filtered.filter(customer =>
        customer.active?.toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.active && filters.active !== "All") {
      filtered = filtered.filter(customer =>
        customer.active?.toLowerCase() === filters.active.toLowerCase()
      );
    }

    setCustomerList(filtered);
    setTotalCount(filtered.length);
    const calculatedTotalPages = Math.ceil(filtered.length / count);
    setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
    setPage(1);
  };

  const handleEdit = (customer) => {
    console.log('Editing customer:', customer);
    if (onEdit && customer.id) {
      onEdit(customer.id);
    }
  };

  const handleAddCustomer = () => {
    if (onAddCustomer) {
      onAddCustomer();
    } else {
      setIsListView(false);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "",
      active: "",
    });
    setPage(1);
  };

  const getVisibleCustomers = () => {
    const startIndex = (page - 1) * count;
    const endIndex = startIndex + count;
    return customerList.slice(startIndex, endIndex);
  };

  const visibleCustomers = getVisibleCustomers();

  return (
    <div className="max-w-full mx-auto mt-5 bg-white dark:bg-gray-900 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Customers
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
          >
            <Filter className="h-4 w-4" />
            {showFilter ? "Hide Filters" : "Filter"}
          </button>

          <button
            type="button"
            onClick={handleAddCustomer}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            <Plus className="h-4 w-4" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilter && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filters
            </h3>
            <button
              onClick={clearFilters}
              className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* SEARCH */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Name, Email, Phone, GST..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>

            {/* STATUS FILTER */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Status
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      {customerList.length > 0 && (
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Found {customerList.length} customer{customerList.length !== 1 ? 's' : ''}
          {(filters.search || filters.status || filters.active) && " matching your filters"}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="min-w-full text-sm text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-100 dark:bg-gray-800 uppercase text-gray-600 dark:text-gray-300 text-xs">
            <tr>
              <th className="px-5 py-3 text-left font-semibold">#</th>
              <th className="px-5 py-3 text-left font-semibold">Code</th>
              <th className="px-5 py-3 text-left font-semibold">Name</th>
              <th className="px-5 py-3 text-left font-semibold">Type</th>
              <th className="px-5 py-3 text-left font-semibold">Email</th>
              <th className="px-5 py-3 text-left font-semibold">Phone</th>
              <th className="px-5 py-3 text-left font-semibold">GST Number</th>
              <th className="px-5 py-3 text-left font-semibold">PAN</th>
              <th className="px-5 py-3 text-left font-semibold">Status</th>
              <th className="px-5 py-3 text-center font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-8">
                  <div className="flex justify-center items-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span>Loading customers...</span>
                  </div>
                </td>
              </tr>
            ) : visibleCustomers.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-10 text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col items-center">
                    <Users className="h-12 w-12 mb-3 text-gray-400" />
                    <p className="text-sm font-medium mb-2">
                      {customerList.length === 0 && !filters.search && !filters.status && !filters.active
                        ? "No customers found"
                        : "No customers match your filters"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      {customerList.length === 0 && !filters.search && !filters.status && !filters.active
                        ? "Get started by adding your first customer"
                        : "Try adjusting your search or filters"}
                    </p>
                    {(customerList.length === 0 && !filters.search && !filters.status && !filters.active) && (
                      <button
                        onClick={handleAddCustomer}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                      >
                        Add Customer
                      </button>
                    )}
                    {(filters.search || filters.status || filters.active) && (
                      <button
                        onClick={clearFilters}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              visibleCustomers.map((item, idx) => (
                <tr
                  key={item.id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-800/60 transition-all"
                >
                  <td className="px-5 py-4">{(page - 1) * count + idx + 1}</td>
                  <td className="px-5 py-4 font-medium text-gray-900 dark:text-white">
                    {item.customerCode || "-"}
                  </td>
                  <td className="px-5 py-4 font-medium">{item.customerName || "-"}</td>
                  <td className="px-5 py-4">{item.customerType || "-"}</td>
                  <td className="px-5 py-4">{item.email || "-"}</td>
                  <td className="px-5 py-4">{item.phoneNumber || "-"}</td>
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs">{item.gstNumber || "-"}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs">{item.panNumber || "-"}</span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full 
                        ${item.active === "Active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                    >
                      {item.active || "Inactive"}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => handleEdit(item)}
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

      {/* Pagination */}
      {!loading && visibleCustomers.length > 0 && (
        <div className="flex justify-between items-center mt-6 text-sm text-gray-500 dark:text-gray-400">
          <span>
            Showing {((page - 1) * count) + 1} to {Math.min(page * count, customerList.length)} of {customerList.length} entries
          </span>

          <div className="flex gap-2">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Show pages around current page
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-1 min-w-[2.5rem] border rounded-lg transition ${page === pageNum
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerListView;