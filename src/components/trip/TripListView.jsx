import {
  FileText,
  Filter,
  MapPin,
  Plus,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Timer,
  Edit3,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { tripAPI } from "../../api/tripAPI";
import { useSelector } from "react-redux";

const TripListView = ({ setIsListView, setEditId }) => {
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [allTrips, setAllTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [count] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [showFilter, setShowFilter] = useState(false); // 👈 NEW
  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });

  const { user } = useSelector((state) => state.auth);
  const orgId = user.orgId;

   

  const stats = [
    {
      label: "Total / Active",
      count: `${totalCount} / ${allTrips.filter((t) => t.status === "Active").length}`,
      color: "blue",
      icon: BarChart3,
    },
    {
      label: "Online / Consent Pending",
      count: `0 / ${allTrips.filter((t) => t.status === "Driver Consent Pending").length}`,
      color: "green",
      icon: CheckCircle,
    },
    {
      label: "Deviated / Delayed / Long Stoppage (Last 15 Days)",
      count: `0 / ${allTrips.filter((t) => t.status === "Delayed").length} / 0`,
      color: "red",
      icon: AlertTriangle,
    },
    {
      label: "Completed / POD Received",
      count: `${allTrips.filter((t) => t.status === "Completed").length} / 0`,
      color: "blue",
      icon: Timer,
    },
  ];

  useEffect(() => {
    getAllTrips();
  }, [page, filters.search]);

  const getAllTrips = async () => {
    try {
      setLoading(true);

      const response = await tripAPI.getAllTrips({
        page,
        count,
        search: filters.search.trim(),
        orgId
      });

      const data = response?.paramObjectsMap?.tripsVO?.data || [];
      const total = response?.paramObjectsMap?.tripsVO?.totalCount || 0;

      setAllTrips(data);
      setTrips(data);
      setTotalCount(total);
      setTotalPages(Math.ceil(total / count));
    } catch (err) {
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...allTrips];
    if (filters.status) {
      filtered = filtered.filter((t) => t.status === filters.status);
    }
    setTrips(filtered);
  }, [filters.status, allTrips]);

  const handleEdit = (item) => {
    setEditId(item.id);
    setIsListView(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Trips</h1>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilter(!showFilter)} // 👈 NEW
              className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm flex gap-1 dark:text-gray-400"
            >
              <Filter className="h-4 w-4" /> Filter
            </button>

            <button
              onClick={() => {
                setIsListView(false);
                navigate("/trip");
              }}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm flex gap-1"
            >
              <Plus className="h-4 w-4" /> Add Trips
            </button>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-sm text-gray-600 dark:text-gray-400">{s.label}</h3>
                  <Icon className={`h-5 w-5 text-${s.color}-500`} />
                </div>
                <p className={`mt-3 text-lg font-semibold text-${s.color}-600`}>
                  {s.count}
                </p>
              </div>
            );
          })}
        </div>

        {/* FILTER PANEL */}
        {showFilter && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border dark:border-gray-700">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Search */}
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                <span>🔍</span>
                <input
                  type="text"
                  placeholder="Vendor / Driver / Vehicle"
                  className="bg-transparent outline-none text-sm w-full"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg dark:bg-gray-800">
                <span>⚡</span>
                <select
                  className="bg-transparent outline-none text-sm w-full dark:bg-gray-800"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="">All Status</option>
                  <option>Driver Consent Pending</option>
                  <option>Active</option>
                  <option>Completed</option>
                  <option>Delayed</option>
                </select>
              </div>

            </div>
          </div>
        )}

        {/* TABLE */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">

              {/* HEADER */}
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs uppercase">
                <tr>
                  {["#", "Vendor", "Vehicle", "Origin", "Destination", "Driver", "Status", "Action"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2 border-b border-gray-200 dark:border-gray-600"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* BODY */}
              <tbody className="text-gray-800 dark:text-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="9" className="py-6 text-center">Loading...</td>
                  </tr>
                ) : trips.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="py-10 text-center text-gray-500 dark:text-gray-400">
                      No trips found
                    </td>
                  </tr>
                ) : (
                  trips.map((trip, idx) => (
                    <tr
                      key={trip.id}
                      className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      {/* <td className="px-5 py-4">{idx + 1}</td> */}
                      <td className="px-5 py-4">{(page - 1) * count + (idx + 1)}</td>
                      <td className="px-4 py-2">{trip.vendor}</td>
                      <td className="px-4 py-2">{trip.vehicleNumber}</td>
                      <td className="px-4 py-2">{trip.orgin}</td>
                      <td className="px-4 py-2">{trip.destination}</td>
                      <td className="px-4 py-2">{trip.driverNumber}</td>
                      <td className="px-4 py-2">{trip.status}</td>

                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => handleEdit(trip)}
                          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          <Edit3 className="h-4 w-4 text-blue-600" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex justify-between items-center p-3 border-t border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
            <span className="text-sm">
              Showing {trips.length} of {totalCount} results
            </span>

            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 border rounded dark:border-gray-700 disabled:opacity-40"
              >
                Prev
              </button>

              <span className="px-3 py-1 bg-blue-600 text-white rounded">{page}</span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 border rounded dark:border-gray-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TripListView;
