import { Edit3, Filter, Plus, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { vendorAPI } from "../../api/vendorAPI";
import { useSelector } from "react-redux";

const VendorListView = ({ setIsListView, setEditId }) => {
  const [vendorList, setVendorList] = useState([]);
  const [allVendors, setAllVendors] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const orgId = user.orgId;
  const [page, setPage] = useState(1);
  const [count] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [loading, setLoading] = useState(false);

  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });
  //  

  useEffect(() => {
    // if (first.current) {
    //   first.current = false;
    //   return;
    // }
    getAllVendors();
  }, [page, filters.search]);

  const getAllVendors = async () => {
    try {
      setLoading(true);

      const response = await vendorAPI.getAllVendor({
        page,
        count,
        search: filters.search.trim(),
        orgId,
      });

      const data = response?.paramObjectsMap?.data?.users || [];
      const total = response?.paramObjectsMap?.data?.totalCount || 0;

      setAllVendors(data);
      setVendorList(data);
      setTotalCount(total);

      setTotalPages(Math.ceil(total / count) || 1);
    } catch (error) {
      console.error("Error fetching vendor list:", error);
      setVendorList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...allVendors];

    if (filters.status) {
      filtered = filtered.filter((v) => v.status === filters.status);
    }

    setVendorList(filtered);
  }, [filters.status, allVendors]);

  const handleEdit = (vendor) => {
    setEditId(vendor.id);
    setIsListView(false);
  };

  return (
    <div className="max-w-7xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Vendor Master
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
          >
            <Filter className="h-4 w-4" />
            Filter
          </button>

          <button
            onClick={() => setIsListView(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Vendor
          </button>
        </div>
      </div>

      {/* Filter Section */}
      {showFilter && (
        <div className="flex items-center gap-4 mb-4">
          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-full">
            <span className="text-gray-500">🔍</span>
            <input
              type="text"
              placeholder="Vendor Code / Organization / Phone"
              className="bg-transparent outline-none text-sm text-gray-900 dark:text-gray-200"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-full">
            <span className="text-gray-500 dark:text-gray-300">⚡</span>
            <select
              className="bg-transparent outline-none text-sm text-gray-900 dark:text-gray-200 dark:bg-gray-800"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="min-w-full text-sm text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-100 dark:bg-gray-800 uppercase text-gray-600 dark:text-gray-300 text-xs">
            <tr>
              {[
                "#",
                "Vendor",
                "Organization",
                "Phone",
                "Email",
                "GST",
                "Status",
                "Action",
              ].map((header, i) => (
                <th key={i} className="px-5 py-3 text-left font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : vendorList.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No vendors found.
                </td>
              </tr>
            ) : (
              vendorList.map((vendor, idx) => (
                <tr
                  key={vendor.vendorid}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-800/60 transition-all"
                >
                  <td className="px-5 py-4">
                    {(page - 1) * count + (idx + 1)}
                  </td>
                  <td className="px-5 py-4">{vendor.vendorCode}</td>
                  <td className="px-5 py-4">{vendor.organization}</td>
                  <td className="px-5 py-4">{vendor.primaryPhoneNumber}</td>
                  <td className="px-5 py-4">{vendor.primaryEmail}</td>
                  <td className="px-5 py-4">{vendor.gst}</td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full 
                      ${vendor.status === "Active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                    >
                      {vendor.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => handleEdit(vendor)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
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
      <div className="flex justify-between items-center mt-6 text-sm text-gray-500 dark:text-gray-400">
        <span>
          Showing {vendorList.length} of {totalCount} results
        </span>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40"
          >
            Prev
          </button>

          <span className="px-3 py-1 border rounded-lg bg-blue-600 text-white">
            {page}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorListView;
