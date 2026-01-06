import { Plus, Filter, Edit3, List, Trash2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { listOfValuesAPI } from "../../api/listOfValues";

const ListOfValuesListView = ({ setIsListView, setEditId }) => {
    const [lists, setLists] = useState([]);
    const [allLists, setAllLists] = useState([]);
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
        getAllLists();
    }, []);

    useEffect(() => {
        // Apply filters whenever filters change
        applyFilters();
    }, [filters, allLists]);

    useEffect(() => {
        // Update pagination when filtered lists change
        const startIndex = (page - 1) * count;
        const endIndex = startIndex + count;
        const filtered = getFilteredLists();
        const paginatedLists = filtered.slice(startIndex, endIndex);

        setLists(paginatedLists);
        setTotalCount(filtered.length);
        setTotalPages(Math.ceil(filtered.length / count));
    }, [page, filters, allLists]);

    const getAllLists = async () => {
        try {
            setLoading(true);

            const response = await listOfValuesAPI.getAllListOfValues({ orgId });

            const data = response?.paramObjectsMap?.listOfValuesVO || [];

            setAllLists(data);
            applyFilters(); // Apply initial filters

        } catch (error) {
            console.error("Error loading lists:", error);
            setAllLists([]);
            setLists([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };

    const getFilteredLists = () => {
        let filtered = [...allLists];

        // Apply search filter
        if (filters.search.trim()) {
            const searchTerm = filters.search.toLowerCase().trim();
            filtered = filtered.filter(list =>
                (list.listCode && list.listCode.toLowerCase().includes(searchTerm)) ||
                (list.listDescription && list.listDescription.toLowerCase().includes(searchTerm))
            );
        }

        // Apply status filter
        if (filters.status) {
            if (filters.status === "Active") {
                filtered = filtered.filter(list => list.active === true);
            } else if (filters.status === "Inactive") {
                filtered = filtered.filter(list => list.active === false);
            }
        }

        return filtered;
    };

    const applyFilters = () => {
        const filtered = getFilteredLists();
        const startIndex = (page - 1) * count;
        const endIndex = startIndex + count;
        const paginatedLists = filtered.slice(startIndex, endIndex);

        setLists(paginatedLists);
        setTotalCount(filtered.length);
        setTotalPages(Math.ceil(filtered.length / count));

        // Reset to page 1 if current page is invalid after filtering
        if (page > 1 && paginatedLists.length === 0) {
            setPage(1);
        }
    };

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        setFilters({
            search: "",
            status: "",
        });
    };

    const handleEdit = (list) => {
        setEditId(list.id);
        setIsListView(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this list?")) {
            try {
                await listOfValuesAPI.deleteListOfValues(id);
                getAllLists(); // Refresh the list after deletion
            } catch (error) {
                console.error("Error deleting list:", error);
            }
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const getDisplayedRange = () => {
        const start = (page - 1) * count + 1;
        const end = Math.min(page * count, totalCount);
        return { start, end };
    };

    return (
        <div className="max-w-7xl mx-auto mt-6 p-6 bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-700">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <List className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    List Of Values
                </h2>

                <div className="flex items-center gap-3">
                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilter(!showFilter)}
                        className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg ${showFilter ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'}`}
                    >
                        <Filter className="h-4 w-4" />
                        Filter {filters.search || filters.status ? `(${getFilteredLists().length})` : ''}
                    </button>

                    {/* Clear Filters */}
                    {(filters.search || filters.status) && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
                        >
                            Clear Filters
                        </button>
                    )}

                    {/* Add New List */}
                    <button
                        onClick={() => {
                            setEditId(null);
                            setIsListView(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                        <Plus className="h-4 w-4" />
                        Add List Of Values
                    </button>
                </div>
            </div>

            {/* FILTER */}
            {showFilter && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {/* Search Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <Search className="h-4 w-4" />
                            Search
                        </label>
                        <input
                            type="text"
                            placeholder="Search by List Code or Description..."
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={filters.search}
                            onChange={(e) => handleFilterChange("search", e.target.value)}
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Status
                        </label>
                        <select
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={filters.status}
                            onChange={(e) => handleFilterChange("status", e.target.value)}
                        >
                            <option value="">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Active Filters Badges */}
            {(filters.search || filters.status) && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {filters.search && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                            Search: "{filters.search}"
                            <button onClick={() => handleFilterChange("search", "")} className="ml-1 hover:text-blue-900">
                                ×
                            </button>
                        </span>
                    )}
                    {filters.status && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                            Status: {filters.status}
                            <button onClick={() => handleFilterChange("status", "")} className="ml-1 hover:text-green-900">
                                ×
                            </button>
                        </span>
                    )}
                </div>
            )}

            {/* TABLE */}
            <div className="overflow-x-auto rounded-xl border dark:border-gray-700">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-300">
                        <tr>
                            {["#", "List Code", "List Description", "Status", "Actions"].map((h, i) => (
                                <th key={i} className="px-5 py-3 text-left font-semibold">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="text-gray-700 dark:text-gray-300">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center py-8">
                                    <div className="animate-pulse">Loading lists...</div>
                                </td>
                            </tr>
                        ) : lists.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-8">
                                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                        <List className="h-12 w-12 mb-2 opacity-50" />
                                        {allLists.length === 0 ? 'No List Of Values found' : 'No matching results found'}
                                        {(filters.search || filters.status) && (
                                            <button
                                                onClick={clearFilters}
                                                className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                            >
                                                Clear filters to see all items
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            lists.map((list, idx) => (
                                <tr key={list.id}
                                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-800/60"
                                >
                                    <td className="px-5 py-3">{getDisplayedRange().start + idx}</td>
                                    <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">
                                        {list.listCode}
                                    </td>
                                    <td className="px-5 py-3">
                                        {list.listDescription}
                                    </td>
                                    {/* Status */}
                                    <td className="px-5 py-3">
                                        <span className={`px-3 py-1 text-xs rounded-full
                      ${list.active
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                            }`}>
                                            {list.active ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    {/* Actions */}
                                    <td className="px-5 py-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(list)}
                                                className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400"
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
            {lists.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-sm text-gray-600 dark:text-gray-300 gap-4">
                    <div>
                        <span>
                            Showing {getDisplayedRange().start} to {getDisplayedRange().end} of {totalCount} results
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => handlePageChange(page - 1)}
                            className="px-3 py-1 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 disabled:opacity-40"
                        >
                            Previous
                        </button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`px-3 py-1 border rounded-lg ${page === pageNum
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            disabled={page === totalPages || totalPages === 0}
                            onClick={() => handlePageChange(page + 1)}
                            className="px-3 py-1 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListOfValuesListView;