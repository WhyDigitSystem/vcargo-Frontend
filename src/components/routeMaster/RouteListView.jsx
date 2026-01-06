import { Plus, Filter, Edit3, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { routesAPI } from "../../api/routesAPI";
import { useSelector } from "react-redux";

const RouteListView = ({ setIsListView, setEditId }) => {
    const [routes, setRoutes] = useState([]);
    const [allRoutes, setAllRoutes] = useState([]);
    const [loading, setLoading] = useState(false);

    // Pagination
    const [page, setPage] = useState(1);
    const [count] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    // Filters
    const [showFilter, setShowFilter] = useState(false);
    const [filters, setFilters] = useState({
        search: "",
        status: "",
    });

    const { user } = useSelector((state) => state.auth);
    const orgId = user.orgId;
     

    useEffect(() => {
        getAllRoutes();
    }, [page, filters.search]);

    const getAllRoutes = async () => {
        try {
            setLoading(true);

            const response = await routesAPI.getAllRouteList({
                page,
                count,
                search: filters.search.trim(),
                orgId
            });

            const data = response?.paramObjectsMap?.routesVO?.data || [];
            const total = response?.paramObjectsMap?.routesVO?.totalCount || 0;

            setAllRoutes(data);
            setRoutes(data);
            setTotalCount(total);

            const pages = Math.ceil(total / count);
            setTotalPages(pages || 1);

        } catch (err) {
            console.error("Route Load Error:", err);
            setRoutes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filtered = [...allRoutes];

        if (filters.status) {
            filtered = filtered.filter(r =>
                (r.active ? "Active" : "Inactive") === filters.status
            );
        }
        setRoutes(filtered);
    }, [filters.status, allRoutes]);

    // Edit Route
    const handleEdit = (item) => {
        setEditId(item.id);
        setIsListView(false);
    };

    return (
        <div className="max-w-7xl mx-auto mt-6 p-6 bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold 
                               text-gray-900 dark:text-white 
                               flex items-center gap-2">
                    <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    Route Master
                </h2>

                <div className="flex items-center gap-3">
                    {/* Filter Button */}
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

                    {/* Add Button */}
                    <button
                        onClick={() => setIsListView(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm 
                                   bg-blue-600 hover:bg-blue-700 
                                   text-white rounded-lg"
                    >
                        <Plus className="h-4 w-4" />
                        Add Route
                    </button>
                </div>
            </div>

            {/* Filter UI */}
            {showFilter && (
                <div className="flex items-center gap-3 mb-4">

                    {/* Search */}
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-full">
                        <span className="text-gray-500">🔍</span>
                        <input
                            type="text"
                            placeholder="Origin / Destination / Vehicle Type"
                            className="bg-transparent outline-none text-sm w-60 text-gray-800 dark:text-gray-200"
                            value={filters.search}
                            onChange={(e) =>
                                setFilters({ ...filters, search: e.target.value })
                            }
                        />
                    </div>

                    {/* Status filter */}
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
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border dark:border-gray-700">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 dark:bg-gray-800 text-xs 
                                      text-gray-600 dark:text-gray-300">
                        <tr>
                            {["#", "Origin", "Destination", "Route", "Duration (Hrs)", "Fuel Cost (₹)", "Status", "Action"]
                                .map((h, i) => (
                                    <th key={i} className="px-5 py-3 text-left font-semibold">
                                        {h}
                                    </th>
                                ))}
                        </tr>
                    </thead>

                    <tbody className="text-gray-700 dark:text-gray-300">
                        {loading ? (
                            <tr>
                                <td colSpan="10" className="text-center py-4">Loading...</td>
                            </tr>
                        ) : routes.length === 0 ? (
                            <tr>
                                <td colSpan="10" className="text-center py-4">
                                    No routes found
                                </td>
                            </tr>
                        ) : (
                            routes.map((r, idx) => (
                                <tr key={r.id}
                                    className="border-t border-gray-200 dark:border-gray-700 
                                               hover:bg-blue-50 dark:hover:bg-gray-800/60">
                                    <td className="px-5 py-4">{idx + 1}</td>
                                    <td className="px-5 py-4">{r.origin}</td>
                                    <td className="px-5 py-4">{r.destination}</td>
                                    <td className="px-5 py-4">{r.route}</td>
                                    <td className="px-5 py-4">{r.tat}</td>
                                    <td className="px-5 py-4">{r.fuelRate}</td>

                                    <td className="px-5 py-4">
                                        <span className={`px-3 py-1 text-xs rounded-full
                                            ${r.active
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                            }`}>
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

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6 text-sm text-gray-600 dark:text-gray-300">

                <span>Showing {routes.length} of {totalCount} results</span>

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

export default RouteListView;
