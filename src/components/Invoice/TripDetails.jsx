import { useEffect, useRef } from "react";
import { Plus, Trash2, Search } from "lucide-react";
import InputField from "../UI/InputField";
import { tripAPI } from "../../api/tripAPI";
import { Autocomplete } from "@react-google-maps/api";
import { useSelector } from "react-redux";

export default function TripDetails({
    invoiceForm,
    updateInvoiceForm,
    tripDetails,
    tripList,
    setTripList,
    vehicleList,
    setVehicleList,
    loading,
    setLoading,
    addTripRow,
    removeTripRow,
    updateTripDetail,
    handleTripSelect,
    handleVehicleSelect
}) {
    const originRefs = useRef({});
    const destinationRefs = useRef({});
     
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

    const handleFilterChange = (field, value) => {
        updateInvoiceForm(field, value);
    };

    return (
        <div className="p-1 space-y-6">
            {/* Header Section - Trips Details */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Trips Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* From Date */}
                    <InputField
                        label="From Date"
                        name="fromDate"
                        type="date"
                        value={invoiceForm.fromDate}
                        onChange={(e) =>
                            handleFilterChange("fromDate", e.target.value)
                        }
                    />

                    {/* To Date */}
                    <InputField
                        label="To Date"
                        name="toDate"
                        type="date"
                        value={invoiceForm.toDate}
                        onChange={(e) =>
                            handleFilterChange("toDate", e.target.value)
                        }
                    />
                </div>

                {/* Fetch Trips Button */}
                <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    <Search className="h-3 w-3" />
                    Fetch Trips
                </button>
            </div>

            {/* Trips Table Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Trips
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
                                <th className="px-3 py-2 w-16">Action</th>
                            </tr>
                        </thead>

                        <tbody className="bg-white dark:bg-gray-800">
                            {tripDetails.map((row, index) => (
                                <tr
                                    key={row.id}
                                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                >
                                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{index + 1}</td>

                                    {/* Trip Select Dropdown */}
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

                                    {/* Origin Field with Autocomplete */}
                                    <td className="px-3 py-2">
                                        <Autocomplete
                                            onLoad={(auto) => (originRefs.current[row.id + "_auto"] = auto)}
                                            onPlaceChanged={() => {
                                                const place = originRefs.current[row.id + "_auto"]?.getPlace();
                                                const address = place?.formatted_address || "";
                                                if (address) {
                                                    updateTripDetail(row.id, "origin", address);
                                                }
                                            }}
                                        >
                                            <input
                                                type="text"
                                                value={row.origin}
                                                onChange={(e) => updateTripDetail(row.id, "origin", e.target.value)}
                                                placeholder="Enter origin"
                                                className="w-full border border-gray-300 dark:border-gray-600 px-2 py-1 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </Autocomplete>
                                    </td>

                                    {/* Destination Field with Autocomplete */}
                                    <td className="px-3 py-2">
                                        <Autocomplete
                                            onLoad={(auto) => (destinationRefs.current[row.id + "_auto"] = auto)}
                                            onPlaceChanged={() => {
                                                const place = destinationRefs.current[row.id + "_auto"]?.getPlace();
                                                const address = place?.formatted_address || "";
                                                if (address) {
                                                    updateTripDetail(row.id, "destination", address);
                                                }
                                            }}
                                        >
                                            <input
                                                type="text"
                                                value={row.destination}
                                                onChange={(e) => updateTripDetail(row.id, "destination", e.target.value)}
                                                placeholder="Enter destination"
                                                className="w-full border border-gray-300 dark:border-gray-600 px-2 py-1 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </Autocomplete>
                                    </td>

                                    {/* Vehicle Select Dropdown */}
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

                                    {/* Status Select */}
                                    <td className="px-3 py-2">
                                        <select
                                            value={row.status}
                                            onChange={(e) => updateTripDetail(row.id, "status", e.target.value)}
                                            className="w-full border border-gray-300 dark:border-gray-600 px-2 py-1 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                            <option value="In Progress">In Progress</option>
                                        </select>
                                    </td>

                                    {/* Delete Action */}
                                    <td className="px-3 py-2 text-center">
                                        <button
                                            onClick={() => removeTripRow(row.id)}
                                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                                            disabled={tripDetails.length <= 1}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Add Row Button */}
                <button
                    onClick={addTripRow}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                    <Plus className="h-4 w-4" />
                    Add Row
                </button>
            </div>
        </div>
    );
}