import { Plus, Filter, MapPin, ClipboardList, Calendar, Edit3, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { customerBookingRequestAPI } from "../../../api/customerBookingRequestAPI";
import { useSelector } from "react-redux";
import { useDebounce } from "../../../hooks/useDebounce";

const CustomerBookingRequestListView = ({ setIsListView, setEditingId }) => {
    const [bookingList, setBookingList] = useState([]);
    const [allBookings, setAllBookings] = useState([]);
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [count] = useState(5);
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

    const debouncedSearch = useDebounce(filters.search, 500);

    useEffect(() => {
        // if (first.current) {
        //     first.current = false;
        //     return;
        // }

        getAllBookings();
    }, [page, debouncedSearch]);

    useEffect(() => {
        applyFilters();
    }, [filters.status, allBookings]);

    const getAllBookings = async () => {
        try {
            setLoading(true);

            const response = await customerBookingRequestAPI.getAllCustomerBookingRequest({
                page,
                count,
                search: filters.search.trim(),
                orgId
            });

            const data = response?.paramObjectsMap?.customerBookingRequestVO?.data || [];
            const total = response?.paramObjectsMap?.customerBookingRequestVO?.totalCount || 0;

            setAllBookings(data);
            setBookingList(data);
            setTotalCount(total);
            setTotalPages(Math.ceil(total / count) || 1);

        } catch (error) {
            console.error("Error fetching booking requests:", error);
            setAllBookings([]);
            setBookingList([]);
            setTotalCount(0);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...allBookings];

        if (filters.status) {
            filtered = filtered.filter(booking => booking.status === filters.status);
        }

        setBookingList(filtered);
    };

    const handleEdit = (booking) => {
        console.log("Editing ID:", booking.id);
        setEditingId(booking.id);
        setIsListView(false);
    };

    return (
        <div className="max-w-7xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                    <ClipboardList className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Customer Booking Request
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
                        Add Booking Request
                    </button>
                </div>
            </div>

            {/* Filter Panel */}
            {showFilter && (
                <div className="flex items-center gap-4 mb-4">
                    {/* SEARCH */}
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-full">
                        <span className="text-gray-500">🔍</span>
                        <input
                            type="text"
                            placeholder="Customer / Origin / Destination"
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
                            <option value="Confirmed">Confirmed</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Modern Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="min-w-full text-sm text-gray-700 dark:text-gray-300">
                    <thead className="bg-gray-100 dark:bg-gray-800 uppercase text-gray-600 dark:text-gray-300 text-xs">
                        <tr>
                            {["#", "Customer", "Origin", "Destination", "Vehicle Type", "Placement Date", "Order Type", "Status", "Action"].map((header, i) => (
                                <th key={i} className="px-5 py-3 text-left font-semibold">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="10" className="text-center py-4">Loading...</td>
                            </tr>
                        ) : bookingList.length === 0 ? (
                            <tr>
                                <td colSpan="10" className="text-center py-4 text-gray-500">
                                    No booking requests found.
                                </td>
                            </tr>
                        ) : (
                            bookingList.map((booking, idx) => (
                                <tr
                                    key={booking.id}
                                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-800/60 transition-all"
                                >
                                    <td className="px-5 py-4">{(page - 1) * count + (idx + 1)}</td>

                                    {/* CUSTOMER */}
                                    <td className="px-5 py-4">
                                        {booking.customer}
                                    </td>

                                    {/* ORIGIN */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-gray-400" />
                                            <span>{booking.origin}</span>
                                        </div>
                                    </td>

                                    {/* DESTINATION */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-gray-400" />
                                            <span>{booking.destination}</span>
                                        </div>
                                    </td>

                                    {/* VEHICLE TYPE */}
                                    <td className="px-5 py-4">{booking.vehicleType}</td>

                                    {/* PLACEMENT DATE */}
                                    <td className="px-5 py-4 flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        {booking.placementDate}
                                    </td>

                                    {/* ORDER TYPE */}
                                    <td className="px-5 py-4">
                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                            {booking.orderType}
                                        </span>
                                    </td>

                                    {/* STATUS */}
                                    <td className="px-5 py-4">
                                        <span className={`px-3 py-1 text-xs rounded-full 
                                            ${booking.status === "Confirmed"
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                : booking.status === "In Progress"
                                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                                    : booking.status === "Completed"
                                                        ? "bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-300"
                                                        : booking.status === "Cancelled"
                                                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </td>

                                    {/* ACTION */}
                                    <td className="px-5 py-4 text-center">
                                        <button
                                            onClick={() => handleEdit(booking)}
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
                    Showing {bookingList.length} of {totalCount} results
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

export default CustomerBookingRequestListView;