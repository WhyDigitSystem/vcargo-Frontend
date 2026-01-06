import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { tripAPI } from "../../api/tripAPI";
import { Autocomplete } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const TripLinked = ({
    tripDetailsRows,
    setTripDetailsRows
}) => {

    const rows = tripDetailsRows ?? [];
    const [tripList, setTripList] = useState([]);
    const [vehicleList, setVehicleList] = useState([]);
    const [loading, setLoading] = useState(true);

    const originRefs = useRef({});
    const destinationRefs = useRef({});
     
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const orgId = user.orgId;

    useEffect(() => {
        getTrips();
    }, []);

    const getTrips = async () => {
        try {
            setLoading(true);
            const res = await tripAPI.getAllTrips({
                count: 100,
                page: 1,
                search: "",
                orgId
            });

            const data = res?.paramObjectsMap?.tripsVO?.data || [];
            setTripList(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Trips fetch error:", err);
            setTripList([]);
        } finally {
            setLoading(false);
        }
    };

    // Unique Vehicle Numbers
    useEffect(() => {
        const vehicles = [
            ...new Set(
                tripList
                    .filter(t => t.vehicleNumber)
                    .map(t => t.vehicleNumber)
            )
        ].map(v => ({ vehicleNumber: v }));

        setVehicleList(vehicles);
    }, [tripList]);

    // Update a field in row
    const updateRow = (id, key, value) => {
        setTripDetailsRows(prev =>
            prev.map(r => (r.id === id ? { ...r, [key]: value } : r))
        );
    };

    // Add row
    const addRow = () => {
        setTripDetailsRows(prev => [
            ...prev,
            {
                id: Date.now(),
                trip: "",
                origin: "",
                destination: "",
                vehicle: "",
                status: "Pending"
            }
        ]);
    };

    // Remove row
    const removeRow = (id) => {
        setTripDetailsRows(prev => prev.filter(r => r.id !== id));
    };

    // When selecting a TRIP -> Autofill all fields
    const handleTripSelect = (rowId, tripId) => {
        if (!tripId) {
            // Clear all fields if no trip selected
            updateRow(rowId, "trip", "");
            updateRow(rowId, "origin", "");
            updateRow(rowId, "destination", "");
            updateRow(rowId, "vehicle", "");
            return;
        }

        const selectedTrip = tripList.find(t => t.id == tripId); // Use == for string/number comparison
        console.log("Selected Trip:", selectedTrip); // For debugging

        if (selectedTrip) {
            // Update all fields with trip data
            updateRow(rowId, "trip", selectedTrip.id);
            updateRow(rowId, "origin", selectedTrip.orgin || ""); // Note: API returns "orgin" not "origin"
            updateRow(rowId, "destination", selectedTrip.destination || "");
            updateRow(rowId, "vehicle", selectedTrip.vehicleNumber || "");

            console.log("Updated row fields:", {
                origin: selectedTrip.orgin,
                destination: selectedTrip.destination,
                vehicle: selectedTrip.vehicleNumber
            }); // For debugging
        }
    };

    // Select Vehicle
    const handleVehicleSelect = (rowId, vehicleNumber) => {
        if (!vehicleNumber) {
            // Clear trip if no vehicle selected
            updateRow(rowId, "vehicle", "");
            updateRow(rowId, "trip", "");
            updateRow(rowId, "origin", "");
            updateRow(rowId, "destination", "");
            return;
        }

        updateRow(rowId, "vehicle", vehicleNumber);

        // Find the trip with this vehicle number and auto-fill other fields
        const linkedTrip = tripList.find(t => t.vehicleNumber === vehicleNumber);
        if (linkedTrip) {
            updateRow(rowId, "trip", linkedTrip.id);
            updateRow(rowId, "origin", linkedTrip.orgin || ""); // Note: API returns "orgin" not "origin"
            updateRow(rowId, "destination", linkedTrip.destination || "");
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Trips Linked
            </h3>

            <div className="rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        <tr>
                            <th className="px-3 py-2 w-12">#</th>
                            <th className="px-3 py-2">Trip</th>
                            <th className="px-3 py-2">Origin</th>
                            <th className="px-3 py-2">Destination</th>
                            <th className="px-3 py-2">Vehicle</th>
                            <th className="px-3 py-2">Status</th>
                            <th className="px-3 py-2 w-16"></th>
                        </tr>
                    </thead>

                    <tbody className="bg-white dark:bg-gray-800">
                        {rows.map((row, index) => (
                            <tr key={row.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{index + 1}</td>

                                {/* ───── TRIP SELECT DROPDOWN ───── */}
                                <td className="px-3 py-2">
                                    <select
                                        value={row.trip}
                                        onChange={(e) => handleTripSelect(row.id, e.target.value)}
                                        className="w-full border border-gray-300 dark:border-gray-600 px-2 py-1 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={loading}
                                    >
                                        <option value="">Select Trip</option>
                                        {tripList.map((trip) => (
                                            <option key={trip.id} value={trip.id}>
                                                Trip-{trip.id} {trip.lrNumber && `(${trip.lrNumber})`} {trip.vehicleNumber && `- ${trip.vehicleNumber}`}
                                            </option>
                                        ))}
                                    </select>
                                    {loading && (
                                        <div className="text-xs text-gray-500 mt-1">Loading trips...</div>
                                    )}
                                </td>

                                {/* ───── ORIGIN FIELD ───── */}
                                <td className="px-3 py-2">
                                    <Autocomplete
                                        onLoad={(auto) => (originRefs.current[row.id + "_auto"] = auto)}
                                        onPlaceChanged={() => {
                                            const place = originRefs.current[row.id + "_auto"]?.getPlace();
                                            const address = place?.formatted_address || "";
                                            if (address) {
                                                updateRow(row.id, "origin", address);
                                            }
                                        }}
                                    >
                                        <input
                                            type="text"
                                            value={row.origin}
                                            onChange={(e) => updateRow(row.id, "origin", e.target.value)}
                                            placeholder="Enter origin"
                                            className="w-full border border-gray-300 dark:border-gray-600 px-2 py-1 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </Autocomplete>
                                </td>

                                {/* ───── DESTINATION FIELD ───── */}
                                <td className="px-3 py-2">
                                    <Autocomplete
                                        onLoad={(auto) => (destinationRefs.current[row.id + "_auto"] = auto)}
                                        onPlaceChanged={() => {
                                            const place = destinationRefs.current[row.id + "_auto"]?.getPlace();
                                            const address = place?.formatted_address || "";
                                            if (address) {
                                                updateRow(row.id, "destination", address);
                                            }
                                        }}
                                    >
                                        <input
                                            type="text"
                                            value={row.destination}
                                            onChange={(e) => updateRow(row.id, "destination", e.target.value)}
                                            placeholder="Enter destination"
                                            className="w-full border border-gray-300 dark:border-gray-600 px-2 py-1 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </Autocomplete>
                                </td>

                                {/* ───── VEHICLE SELECT DROPDOWN ───── */}
                                <td className="px-3 py-2">
                                    <select
                                        value={row.vehicle}
                                        onChange={(e) => handleVehicleSelect(row.id, e.target.value)}
                                        className="w-full border border-gray-300 dark:border-gray-600 px-2 py-1 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Select Vehicle</option>
                                        {vehicleList.map((vehicle, idx) => (
                                            <option key={idx} value={vehicle.vehicleNumber}>
                                                {vehicle.vehicleNumber}
                                            </option>
                                        ))}
                                    </select>
                                </td>

                                {/* Status */}
                                <td className="px-3 py-2">
                                    <select
                                        value={row.status}
                                        onChange={(e) => updateRow(row.id, "status", e.target.value)}
                                        className="w-full border border-gray-300 dark:border-gray-600 px-2 py-1 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                        <option value="In Progress">In Progress</option>
                                    </select>
                                </td>

                                {/* Delete */}
                                <td className="px-3 py-2 text-center">
                                    <button
                                        onClick={() => removeRow(row.id)}
                                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ADD ROW BUTTON */}
            <button
                onClick={addRow}
                className="mt-3 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-2 transition-colors"
            >
                <Plus size={16} /> Add Row
            </button>
        </div>
    );
};

export default TripLinked;