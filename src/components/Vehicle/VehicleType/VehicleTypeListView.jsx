import { Plus, Filter, Edit3, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { vehicleTypeAPI } from "../../../api/vehicleType";
import { useSelector } from "react-redux";

const VehicleTypeListView = ({ setIsListView, setEditId }) => {

    const navigate = useNavigate();

    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [allVehicleTypes, setAllVehicleTypes] = useState([]);
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [count] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const [showFilter, setShowFilter] = useState(false);
    const [filters, setFilters] = useState({
        vehicleType: "",
        status: "",
    });
     

    const { user } = useSelector((state) => state.auth);
    const orgId = user.orgId;

    useEffect(() => {
        getAllVehicleTypes();
    }, [page, filters.vehicleType]);


    const getAllVehicleTypes = async () => {
        try {
            setLoading(true);

            const response = await vehicleTypeAPI.getAllVehicleTypeList({
                page,
                count,
                search: filters.vehicleType.trim(),
                orgId
            });

            const data = response?.paramObjectsMap?.vehicleTypeData?.data || [];
            const total = response?.paramObjectsMap?.vehicleTypeData?.totalCount || 0;

            setAllVehicleTypes(data);
            setVehicleTypes(data);
            setTotalCount(total);

            setTotalPages(Math.ceil(total / count) || 1);

        } catch (error) {
            console.error("API Error:", error);
            setVehicleTypes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filtered = [...allVehicleTypes];

        if (filters.status) {
            filtered = filtered.filter(
                (v) => v.status === filters.status
            );
        }

        setVehicleTypes(filtered);

    }, [filters.status, allVehicleTypes]);


    const handleEdit = (item) => {
        setEditId(item.id);
        setIsListView(false);
    };

    return (
        <div className="max-w-7xl mx-auto mt-6 p-6 
                        bg-white dark:bg-gray-900 
                        rounded-xl shadow 
                        border border-gray-200 dark:border-gray-700">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold 
                               text-gray-900 dark:text-white 
                               flex items-center gap-2">
                    <Truck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    Vehicle Type Master
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
                        Add Vehicle Type
                    </button>
                </div>
            </div>

            {/* Filter */}
            {showFilter && (
                <div className="flex items-center gap-3 mb-4">

                    <div className="flex items-center gap-2 
                                    bg-gray-100 dark:bg-gray-800 
                                    px-3 py-2 rounded-full">
                        <span className="text-gray-500">🔍</span>
                        <input
                            type="text"
                            placeholder="Vehicle Type"
                            className="bg-transparent outline-none text-sm 
                                       text-gray-900 dark:text-gray-200"
                            value={filters.vehicleType}
                            onChange={(e) =>
                                setFilters({ ...filters, vehicleType: e.target.value })
                            }
                        />
                    </div>

                    <div className="flex items-center gap-2 
                                    bg-gray-100 dark:bg-gray-800 
                                    px-3 py-2 rounded-full">
                        <span className="text-gray-500 dark:text-gray-300">⚡</span>
                        <select
                            className="bg-transparent outline-none text-sm 
                                       text-gray-900 dark:text-gray-200 dark:bg-gray-800"
                            value={filters.status}
                            onChange={(e) =>
                                setFilters({ ...filters, status: e.target.value })
                            }
                        >
                            <option value="">Status</option>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border dark:border-gray-700">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 dark:bg-gray-800 
                                      text-xs text-gray-600 dark:text-gray-300">
                        <tr>
                            {["#", "Vehicle Type", "Mileage", "Unit", "Dimensions", "Sqft Capacity", "Tonnage", "Status", "Action"]
                                .map((header, i) => (
                                    <th key={i} className="px-5 py-3 text-left font-semibold">
                                        {header}
                                    </th>
                                ))}
                        </tr>
                    </thead>

                    <tbody className="text-gray-700 dark:text-gray-300">
                        {loading ? (
                            <tr>
                                <td colSpan="9" className="text-center py-4">Loading...</td>
                            </tr>
                        ) : vehicleTypes.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="text-center py-4">No records found</td>
                            </tr>
                        ) : (
                            vehicleTypes.map((v, idx) => (
                                <tr key={v.id}
                                    className="border-t border-gray-200 dark:border-gray-700
                                               hover:bg-blue-50 dark:hover:bg-gray-800/60">
                                    <td className="px-5 py-4">
                                        {(page - 1) * count + (idx + 1)}
                                    </td>
                                    <td className="px-5 py-4">{v.vehicleType}</td>
                                    <td className="px-5 py-4">{v.mileage} km/l</td>
                                    <td className="px-5 py-4">{v.unit}</td>
                                    <td className="px-5 py-4">{v.hight} × {v.width} × {v.length}</td>
                                    <td className="px-5 py-4">{v.vehicleSqftCapacity}</td>
                                    <td className="px-5 py-4">{v.vehicleTonnageCapacity}</td>

                                    <td className="px-5 py-4">
                                        <span className={`px-3 py-1 text-xs rounded-full
                                            ${v.status === "ACTIVE"
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                            }`}>
                                            {v.status}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4 text-center">
                                        <button
                                            onClick={() => handleEdit(v)}
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
            <div className="flex justify-between items-center mt-6 text-sm 
                            text-gray-700 dark:text-gray-300">

                <span>Showing {vehicleTypes.length} of {totalCount} results</span>

                <div className="flex gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="px-3 py-1 border rounded-lg 
                                   border-gray-300 dark:border-gray-600
                                   hover:bg-gray-100 dark:hover:bg-gray-700
                                   disabled:opacity-40"
                    >
                        Prev
                    </button>

                    <span className="px-3 py-1 border rounded-lg 
                                     bg-blue-600 text-white">
                        {page}
                    </span>

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className="px-3 py-1 border rounded-lg 
                                   border-gray-300 dark:border-gray-600
                                   hover:bg-gray-100 dark:hover:bg-gray-700
                                   disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VehicleTypeListView;
