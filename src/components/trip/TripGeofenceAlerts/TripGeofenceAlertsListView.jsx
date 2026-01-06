import { Plus, Filter, Edit3, ArrowLeft } from "lucide-react";

const TripGeofenceAlertsListView = ({ setIsListView }) => {

    const mockData = [
        {
            id: 1,
            trip: "Trip A",
            tag: "Tag 01",
            vehicle: "TN 01 AB 1234",
            status: "Enter",
            geofence: "Warehouse Gate",
            timeStamp: "2025-11-07 12:30 PM",
        },
        {
            id: 2,
            trip: "Trip B",
            tag: "Tag 12",
            vehicle: "MH 12 XY 4567",
            status: "Exit",
            geofence: "Factory Exit",
            timeStamp: "2025-11-06 03:15 PM",
        },
        {
            id: 3,
            trip: "Trip C",
            tag: "Tag 22",
            vehicle: "DL 05 BC 1122",
            status: "Enter",
            geofence: "Plant Gate",
            timeStamp: "2025-11-08 08:20 AM",
        },
    ];

    const handleEdit = () => {
        setIsListView(false);
    };

    return (
        <div className="max-w-6xl mx-auto mt-5 bg-white dark:bg-gray-900 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Trip Geofence Alerts
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200">
                        <Filter className="h-4 w-4" />
                        Filter
                    </button>

                    <button
                        onClick={() => setIsListView(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                        <Plus className="h-4 w-4" />
                        Add Trip Geofence Alert
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="min-w-full text-sm text-gray-700 dark:text-gray-300">
                    <thead className="bg-gray-100 dark:bg-gray-800 uppercase text-gray-600 dark:text-gray-300 text-xs">
                        <tr>
                            <th className="px-5 py-3 text-left font-semibold">#</th>
                            <th className="px-5 py-3 text-left font-semibold">Trip</th>
                            <th className="px-5 py-3 text-left font-semibold">Tag</th>
                            <th className="px-5 py-3 text-left font-semibold">Vehicle</th>
                            <th className="px-5 py-3 text-left font-semibold">Status</th>
                            <th className="px-5 py-3 text-left font-semibold">Geofence</th>
                            <th className="px-5 py-3 text-left font-semibold">Timestamp</th>
                            <th className="px-5 py-3 text-center font-semibold">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {mockData.map((item, idx) => (
                            <tr
                                key={item.id}
                                className="border-t border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-800/60 transition-all"
                            >
                                <td className="px-5 py-4">{idx + 1}</td>
                                <td className="px-5 py-4">{item.trip}</td>
                                <td className="px-5 py-4">{item.tag}</td>
                                <td className="px-5 py-4">{item.vehicle}</td>

                                <td className="px-5 py-4">
                                    <span
                                        className={`px-3 py-1 text-xs font-medium rounded-full ${item.status === "Enter"
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                            }`}
                                    >
                                        {item.status}
                                    </span>
                                </td>

                                <td className="px-5 py-4">{item.geofence}</td>
                                <td className="px-5 py-4">{item.timeStamp}</td>

                                <td className="px-5 py-4 text-center">
                                    <button
                                        onClick={() => handleEdit(item)}
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
                    <button className="px-3 py-1 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">Prev</button>
                    <button className="px-3 py-1 border rounded-lg bg-blue-600 text-white hover:bg-blue-700">1</button>
                    <button className="px-3 py-1 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">Next</button>
                </div>
            </div>
        </div>
    );
};

export default TripGeofenceAlertsListView;
