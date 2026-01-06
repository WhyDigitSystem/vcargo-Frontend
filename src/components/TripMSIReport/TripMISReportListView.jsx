import { Plus, Filter, MapPin, Truck, Calendar, Edit3, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TripMISReportListView = ({ setIsListView }) => {
    const navigate = useNavigate();

    const mockTripMsi = [
        {
            id: 1,
            indentId: "IND-001",
            lrNumber: "LR-78910",
            origin: "Chennai",
            destination: "Bangalore",
            driverNumber: "9876543210",
            driverName: "Kumar",
            vehicle: "TN 01 AB 1234",
            status: "Pending",
            date: "2025-11-07",
        },
        {
            id: 2,
            indentId: "IND-002",
            lrNumber: "LR-55522",
            origin: "Hyderabad",
            destination: "Mumbai",
            driverNumber: "9988776655",
            driverName: "Ramesh",
            vehicle: "MH 12 XY 4567",
            status: "Approved",
            date: "2025-11-06",
        },
        {
            id: 3,
            indentId: "IND-003",
            lrNumber: "LR-11223",
            origin: "Delhi",
            destination: "Kolkata",
            driverNumber: "9090909090",
            driverName: "Sanjay",
            vehicle: "DL 05 BC 1122",
            status: "In Transit",
            date: "2025-11-08",
        },
    ];

    const handleEdit = (indent) => {
        console.log("Edit Indent:", indent);
        setIsListView(false);
    };

    return (
        <div className="max-w-7xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsListView(false)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    </button>
                    <Truck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Trip Report MIS
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition">
                        <Filter className="h-4 w-4" />
                        Filter
                    </button>

                    <button
                        onClick={() => navigate("/trip")}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
                    >
                        <Plus className="h-4 w-4" />
                        Add Trip
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="min-w-full text-sm text-gray-700 dark:text-gray-300">
                    <thead className="bg-gray-100 dark:bg-gray-800 uppercase text-gray-600 dark:text-gray-300 text-xs">
                        <tr>
                            <th className="px-5 py-3 text-left font-semibold">#</th>
                            <th className="px-5 py-3 text-left font-semibold">Indent ID</th>
                            <th className="px-5 py-3 text-left font-semibold">LR Number</th>
                            <th className="px-5 py-3 text-left font-semibold">Origin</th>
                            <th className="px-5 py-3 text-left font-semibold">Destination</th>
                            <th className="px-5 py-3 text-left font-semibold">Driver Number</th>
                            <th className="px-5 py-3 text-left font-semibold">Driver Name</th>
                            <th className="px-5 py-3 text-left font-semibold">Vehicle</th>
                            <th className="px-5 py-3 text-left font-semibold">Date</th>
                            <th className="px-5 py-3 text-left font-semibold">Status</th>
                            <th className="px-5 py-3 text-center font-semibold">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {mockTripMsi.map((indent, idx) => (
                            <tr
                                key={indent.id}
                                className="border-t border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-800/60 transition-all duration-200"
                            >
                                <td className="px-5 py-4">{idx + 1}</td>

                                <td className="px-5 py-4">{indent.indentId}</td>

                                <td className="px-5 py-4">{indent.lrNumber}</td>

                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-gray-400" />
                                        {indent.origin}
                                    </div>
                                </td>

                                <td className="px-5 py-4 flex items-center gap-2">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-gray-400" />
                                        {indent.destination}
                                    </div>
                                </td>

                                <td className="px-5 py-4">{indent.driverNumber}</td>

                                <td className="px-5 py-4">{indent.driverName}</td>

                                <td className="px-5 py-4">{indent.vehicle}</td>

                                <td className="px-5 py-4 flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    {indent.date}
                                </td>

                                <td className="px-5 py-4">
                                    <span
                                        className={`px-3 py-1 text-xs font-medium rounded-full ${indent.status === "Approved"
                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                            : indent.status === "In Transit"
                                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                            }`}
                                    >
                                        {indent.status}
                                    </span>
                                </td>

                                <td className="px-5 py-4 text-center">
                                    <button
                                        onClick={() => handleEdit(indent)}
                                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                        title="Edit"
                                    >
                                        <Edit3 className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6 text-sm text-gray-500 dark:text-gray-400">
                <span>Showing 1–3 of 3 results</span>
                <div className="flex gap-2">
                    <button className="px-3 py-1 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        Prev
                    </button>
                    <button className="px-3 py-1 border rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                        1
                    </button>
                    <button className="px-3 py-1 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TripMISReportListView;
