import { Plus, Filter, Edit3, FileText, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { chargeTypeAPI } from "../../api/chargeTypeAPI";
import { toast } from "../../utils/toast";
import { useSelector } from "react-redux";

const ChargeTypeListView = ({ setIsListView, setEditId }) => {
  const [chargeTypes, setChargeTypes] = useState([]);
  const [allChargeTypes, setAllChargeTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(5); // Default rows per page
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });

  //  

  const { user } = useSelector((state) => state.auth);
  const orgId = user.orgId;

  useEffect(() => {
    getAllChargeTypes();
  }, [page, count, filters.search]);

  const getAllChargeTypes = async () => {
    try {
      setLoading(true);

      const response = await chargeTypeAPI.getAllChargeType({
        page,
        count,
        search: filters.search.trim(),
        orgId
      });

      // Based on your JSON structure
      const data = response?.paramObjectsMap?.chargeTypeVO?.data || [];
      const total = response?.paramObjectsMap?.chargeTypeVO?.totalCount || 0;
      const pages = response?.paramObjectsMap?.chargeTypeVO?.totalPages || 1;

      setAllChargeTypes(data);
      setChargeTypes(data);
      setTotalCount(total);
      setTotalPages(pages);

    } catch (error) {
      console.error("Error loading charge types:", error);
      toast.error("Failed to load charge types");
      setAllChargeTypes([]);
      setChargeTypes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterChargeTypes();
  }, [filters.status, allChargeTypes]);

  const filterChargeTypes = () => {
    let list = [...allChargeTypes];

    if (filters.status) {
      list = list.filter(ct => ct.status === filters.status || ct.active === filters.status);
    }

    setChargeTypes(list);
  };

  const handleEdit = (chargeType) => {
    setEditId(chargeType.id);
    setIsListView(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto mt-6 p-6 bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-700">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            Charge Type Master
          </h2>
          {loading && (
            <div className="text-sm text-blue-500 animate-pulse">Loading...</div>
          )}
        </div>

        <div className="flex items-center gap-3">

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilter(!showFilter)}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 disabled:opacity-50"
          >
            <Filter className="h-4 w-4" />
            Filter
          </button>

          {/* Add Charge Type */}
          <button
            onClick={() => {
              setEditId(null);
              setIsListView(false);
            }}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Add Charge Type
          </button>
        </div>
      </div>

      {/* FILTER */}
      {
        showFilter && (
          <div className="mb-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="flex items-center gap-2 bg-white dark:bg-gray-700 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600">
                <span className="text-gray-500 dark:text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Search by Charge Type or Unit..."
                  className="bg-transparent outline-none text-sm w-full text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                  value={filters.search}
                  onChange={(e) => {
                    setPage(1);
                    setFilters({ ...filters, search: e.target.value });
                  }}
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 bg-white dark:bg-gray-700 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600">
                <span className="text-gray-600 dark:text-gray-300">⚡</span>
                <select
                  className="bg-transparent outline-none text-sm w-full text-gray-800 dark:text-gray-200 dark:bg-gray-700"
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        )
      }

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border dark:border-gray-700">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-300">
            <tr>
              <th className="px-5 py-3 text-left font-semibold">#</th>
              <th className="px-5 py-3 text-left font-semibold">Charge Type</th>
              <th className="px-5 py-3 text-left font-semibold">Unit</th>
              <th className="px-5 py-3 text-left font-semibold">Status</th>
              <th className="px-5 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="text-gray-700 dark:text-gray-300">
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                </td>
              </tr>
            ) : chargeTypes.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8">
                  <div className="flex flex-col items-center">
                    <FileText className="h-12 w-12 mb-3 text-gray-400 dark:text-gray-500" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {allChargeTypes.length === 0
                        ? "No charge types found. Click 'Add Charge Type' to create one."
                        : "No charge types match your filters"
                      }
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              chargeTypes.map((ct, idx) => (
                <tr
                  key={ct.id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                >
                  <td className="px-5 py-3">{(page - 1) * count + idx + 1}</td>
                  <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">
                    {ct.chargeType}
                  </td>
                  <td className="px-5 py-3">{ct.unit}</td>

                  {/* Status */}
                  <td className="px-5 py-3">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium
                      ${ct.active === "Active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}>
                      {ct.active}
                    </span>
                  </td>

                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(ct)}
                        className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        title="Edit"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {
        chargeTypes.length > 0 && (
          <div className="flex items-center justify-between mt-6 text-sm">
            <span className="text-gray-600 dark:text-gray-300">
              Showing {(page - 1) * count + 1}–{Math.min(page * count, totalCount)} of {totalCount} results
            </span>

            <div className="flex items-center gap-6">
              {/* Rows per page selector */}
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-sm">Rows per page:</span>
                <select
                  value={count}
                  onChange={(e) => {
                    setCount(Number(e.target.value));
                    setPage(1);
                  }}
                  disabled={loading}
                  className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm disabled:opacity-50"
                >
                  <option value={5}>05</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              {/* Pagination buttons */}
              <div className="flex gap-2">
                <button
                  disabled={page === 1 || loading}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Prev
                </button>

                <span className="px-3 py-1 border rounded-lg bg-blue-600 text-white">
                  {page}
                </span>

                <button
                  disabled={page === totalPages || loading}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default ChargeTypeListView;