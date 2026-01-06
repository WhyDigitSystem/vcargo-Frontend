import { Edit3, Filter, Plus, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { customerRateAPI } from "../../../api/customerRateAPI";

const CustomerRateListView = ({ setIsListView, setEditId }) => {
  const [rates, setRates] = useState([]);
  const [allRates, setAllRates] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [count] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });
  const { user } = useSelector((state) => state.auth);
  const orgId = user.orgId;
  //  

  useEffect(() => {
    // if (first.current) {
    //   first.current = false;
    //   return;
    // }
    getAllCustomerRates();
  }, [page, filters.search]);

  const getAllCustomerRates = async () => {
    try {
      setLoading(true);

      const response = await customerRateAPI.getAllCustomerRateList({
        page,
        count,
        search: filters.search.trim(),
        orgId,
      });

      const data = response?.paramObjectsMap?.customerRateVO?.data || [];
      const total = response?.paramObjectsMap?.customerRateVO?.totalCount || 0;

      setAllRates(data);
      setRates(data);
      setTotalCount(total);

      const pages = Math.ceil(total / count);
      setTotalPages(pages || 1);
    } catch (err) {
      console.error("Error:", err);
      setRates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...allRates];

    if (filters.status) {
      filtered = filtered.filter(
        (r) => (r.active ? "Active" : "Inactive") === filters.status
      );
    }

    setRates(filtered);
  }, [filters.status, allRates]);

  const handleEdit = (item) => {
    setEditId(item.id);
    setIsListView(false);
  };

  return (
    <div
      className="max-w-7xl mx-auto mt-6 p-6 
                        bg-white dark:bg-gray-900 
                        rounded-xl shadow 
                        border border-gray-200 dark:border-gray-700"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2
          className="text-xl font-semibold 
                               text-gray-900 dark:text-white 
                               flex items-center gap-2"
        >
          <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          Customer Rate
        </h2>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-3 py-2 text-sm 
                                   rounded-lg 
                                   bg-gray-100 hover:bg-gray-200 
                                   dark:bg-gray-700 dark:hover:bg-gray-600 
                                   text-gray-700 dark:text-gray-200"
          >
            <Filter className="h-4 w-4" />
            Filter
          </button>

          <button
            onClick={() => setIsListView(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm 
                                   bg-blue-600 hover:bg-blue-700 
                                   text-white rounded-lg"
          >
            <Plus className="h-4 w-4" />
            Add Customer Rate
          </button>
        </div>
      </div>

      {/* FILTER */}
      {showFilter && (
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex items-center gap-2 
                                    bg-gray-100 dark:bg-gray-800 
                                    px-3 py-2 rounded-full"
          >
            <span className="text-gray-500">🔍</span>
            <input
              type="text"
              placeholder="Customer / Origin / Dest / Vehicle Type"
              className="bg-transparent outline-none 
                                       text-sm w-60 
                                       text-gray-800 dark:text-gray-200"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>

          <div
            className="flex items-center gap-2 
                                    bg-gray-100 dark:bg-gray-800 
                                    px-3 py-2 rounded-full"
          >
            <span className="text-gray-600 dark:text-gray-300">⚡</span>
            <select
              className="bg-transparent outline-none text-sm 
                                       text-gray-800 dark:text-gray-200 dark:bg-gray-800"
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

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border dark:border-gray-700">
        <table className="min-w-full text-sm">
          <thead
            className="bg-gray-100 dark:bg-gray-800 text-xs 
                                      text-gray-600 dark:text-gray-300"
          >
            <tr>
              {[
                "#",
                "Customer",
                "Origin",
                "Destination",
                "Vehicle Type",
                "Rate",
                "Rate Type",
                "Weight",
                "Status",
                "Action",
              ].map((h, i) => (
                <th key={i} className="px-5 py-3 text-left font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="text-gray-700 dark:text-gray-300">
            {loading ? (
              <tr>
                <td colSpan="10" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : rates.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-4">
                  No records found
                </td>
              </tr>
            ) : (
              rates.map((r, idx) => (
                <tr
                  key={r.id}
                  className="border-t border-gray-200 dark:border-gray-700 
                                               hover:bg-blue-50 dark:hover:bg-gray-800/60"
                >
                  <td className="px-5 py-4">{idx + 1}</td>
                  <td className="px-5 py-4">{r.customer}</td>
                  <td className="px-5 py-4">{r.origin}</td>
                  <td className="px-5 py-4">{r.destination}</td>
                  <td className="px-5 py-4">{r.vehicleType}</td>
                  <td className="">₹ {r.rate}</td>
                  <td className="px-5 py-4">{r.rateType}</td>
                  <td className="px-5 py-4">{r.weight}</td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full
                                            ${
                                              r.active
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                            }`}
                    >
                      {r.active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => handleEdit(r)}
                      className="p-2 rounded-lg 
                                                       hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div
        className="flex justify-between items-center mt-6 text-sm 
                            text-gray-600 dark:text-gray-300"
      >
        <span>
          Showing {rates.length} of {totalCount} results
        </span>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded-lg 
                                   hover:bg-gray-100 dark:hover:bg-gray-700 
                                   border-gray-300 dark:border-gray-600
                                   disabled:opacity-40"
          >
            Prev
          </button>

          <span
            className="px-3 py-1 border rounded-lg 
                                     bg-blue-600 text-white"
          >
            {page}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded-lg 
                                   hover:bg-gray-100 dark:hover:bg-gray-700 
                                   border-gray-300 dark:border-gray-600
                                   disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerRateListView;
