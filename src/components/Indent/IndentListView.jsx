import { Plus, Filter, MapPin, Truck, Calendar, Edit3 } from "lucide-react";
import { indentAPI } from "../../api/indentAPI";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";

const IndentListView = ({ setIsListView, setEditingId }) => {
  const [indentList, setIndentList] = useState([]);
  const [allIndents, setAllIndents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [count] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const { user } = useSelector((state) => state.auth);
  const orgId = user.orgId;
  // FILTER UI
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });

   

  const debouncedSearch = useDebounce(filters.search, 500);

  useEffect(() => {
    getAllIndents();
  }, [page, debouncedSearch]);

  // Apply status filter locally
  useEffect(() => {
    applyFilters();
  }, [filters.status, allIndents]);

  const getAllIndents = async () => {
    try {
      setLoading(true);

      const response = await indentAPI.getAllIndentList({
        page,
        count,
        search: filters.search.trim(),
        orgId
      });

      const data = response?.paramObjectsMap?.indentsVO?.data || [];
      const total = response?.paramObjectsMap?.indentsVO?.totalCount || 0;

      setAllIndents(data);
      setIndentList(data);
      setTotalCount(total);
      setTotalPages(Math.ceil(total / count) || 1);

    } catch (error) {
      console.error("Error fetching indent list:", error);
      setAllIndents([]);
      setIndentList([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allIndents];

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(indent => indent.status === filters.status);
    }

    setIndentList(filtered);
  };

  const handleEdit = (indent) => {
    console.log("Editing ID:", indent.id);
    setEditingId(indent.id);
    setIsListView(false);
  };

  return (
    <div className="max-w-7xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6">

      {/* -------- HEADER -------- */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Truck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Indent Master
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

          {/* ADD INDENT */}
          <button
            onClick={() => setIsListView(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Indent
          </button>
        </div>
      </div>

      {/* -------- FILTER PANEL -------- */}
      {showFilter && (
        <div className="flex items-center gap-4 mb-4">
          {/* SEARCH */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-full">
            <span className="text-gray-500">🔍</span>
            <input
              type="text"
              placeholder="Origin / Destination / Vehicle Type"
              className="bg-transparent outline-none text-sm text-gray-900 dark:text-gray-200"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>

          {/* STATUS FILTER */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-full">
            <span className="text-gray-500 dark:text-gray-300">⚡</span>
            <select
              className="bg-transparent outline-none text-sm text-gray-900 dark:text-gray-200 dark:bg-gray-800"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">Status</option>
              <option value="Open">Open</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="In Transit">In Transit</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      )}

      {/* -------- TABLE -------- */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="min-w-full text-sm text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-100 dark:bg-gray-800 uppercase text-gray-600 dark:text-gray-300 text-xs">
            <tr>
              {["#", "Origin", "Destination", "Vehicle Type", "Weight", "Date", "Status", "Action"].map((header, i) => (
                <th key={i} className="px-5 py-3 text-left font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-4">Loading...</td>
              </tr>
            ) : indentList.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No indents found.
                </td>
              </tr>
            ) : (
              indentList.map((indent, idx) => (
                <tr
                  key={indent.id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-800/60 transition-all"
                >
                  <td className="px-5 py-4">{(page - 1) * count + (idx + 1)}</td>

                  {/* ORIGIN */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{indent.origin}</span>
                    </div>
                  </td>

                  {/* DESTINATION */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{indent.destination}</span>
                    </div>
                  </td>

                  {/* VEHICLE TYPE */}
                  <td className="px-5 py-4">{indent.vechicleType}</td>

                  {/* WEIGHT */}
                  <td className="px-5 py-4">{indent.weight}</td>

                  {/* DATE */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {indent.placementDate}
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="px-5 py-4">
                    <span className={`px-3 py-1 text-xs rounded-full 
                      ${indent.status === "Approved"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : indent.status === "In Transit"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : indent.status === "Completed"
                            ? "bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-300"
                            : indent.status === "Cancelled"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}>
                      {indent.status}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => handleEdit(indent)}
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

      {/* -------- PAGINATION -------- */}
      <div className="flex justify-between items-center mt-6 text-sm text-gray-500 dark:text-gray-400">
        <span>
          Showing {indentList.length} of {totalCount} results
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

export default IndentListView;