import { Plus, Filter, Edit3, User, Phone, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { driverAPI } from "../../api/driverAPI";
import { useSelector } from "react-redux";

const DriverListView = ({ setIsListView, setEditId }) => {
  const [drivers, setDrivers] = useState([]);
  const [allDrivers, setAllDrivers] = useState([]);
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
   

  useEffect(() => {
    getAllDrivers();
  }, [page, filters.search]);

  useEffect(() => {
    filterDrivers();
  }, [filters.status, allDrivers]);

  const getAllDrivers = async () => {
    try {
      setLoading(true);

      const response = await driverAPI.getAllDriver({
        page,
        count,
        search: filters.search.trim(),
        orgId
      });

      const data = response?.paramObjectsMap?.driverVO?.data || [];
      const total = response?.paramObjectsMap?.driverVO?.totalCount || 0;

      setAllDrivers(data);
      setDrivers(data);
      setTotalCount(total);
      setTotalPages(Math.ceil(total / count));

    } catch (error) {
      console.error("Error loading drivers:", error);
      setAllDrivers([]);
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  };

  const filterDrivers = () => {
    let list = [...allDrivers];

    if (filters.status) {
      list = list.filter(d => d.active === filters.status);
    }

    setDrivers(list);
  };

  const handleEdit = (driver) => {
    setEditId(driver.id);
    setIsListView(false);
  };

  return (
    <div className="max-w-7xl mx-auto mt-6 p-6 bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-700">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          Drivers
        </h2>

        <div className="flex items-center gap-3">
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
          >
            <Filter className="h-4 w-4" />
            Filter
          </button>

          {/* Add Driver */}
          <button
            onClick={() => setIsListView(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            <Plus className="h-4 w-4" />
            Add Driver
          </button>
        </div>
      </div>

      {/* FILTER */}
      {showFilter && (
        <div className="flex items-center gap-3 mb-4">

          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-full">
            <span className="text-gray-500">🔍</span>
            <input
              type="text"
              placeholder="Search Driver / Phone"
              className="bg-transparent outline-none text-sm w-60 text-gray-800 dark:text-gray-200"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-full">
            <span className="text-gray-600 dark:text-gray-300">⚡</span>
            <select
              className="bg-transparent outline-none text-sm text-gray-800 dark:text-gray-200 dark:bg-gray-800"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">Status</option>
              <option value="Active">Active</option>
              <option value="In-Active">In-Active</option>
            </select>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border dark:border-gray-700">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-300">
            <tr>
              {["#", "Driver Name", "Phone Number", "Status", "Action"].map((h, i) => (
                <th key={i} className="px-5 py-3 text-left font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="text-gray-700 dark:text-gray-300">
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-4">Loading...</td>
              </tr>
            ) : drivers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No drivers found
                </td>
              </tr>
            ) : (
              drivers.map((d, idx) => (
                <tr key={d.id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-800/60"
                >
                  <td className="px-5 py-3">{idx + 1}</td>
                  <td className="px-5 py-3">{d.driverName}</td>
                  <td className="px-5 py-3 flex items-center gap-1">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {d.driverNumber}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3">
                    <span className={`px-3 py-1 text-xs rounded-full
                      ${d.active === "Active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}>
                      {d.active}
                    </span>
                  </td>

                  <td className="px-5 py-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(d)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
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
      <div className="flex justify-between items-center mt-6 text-sm text-gray-600 dark:text-gray-300">

        <span>Showing {drivers.length} of {totalCount} results</span>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 disabled:opacity-40"
          >
            Prev
          </button>

          <span className="px-3 py-1 border rounded-lg bg-blue-600 text-white">
            {page}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 disabled:opacity-40"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
};

export default DriverListView;
