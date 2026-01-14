import {
  AlertCircle,
  Calendar,
  Car,
  CheckCircle,
  ChevronRight,
  Clock,
  Edit,
  IndianRupee,
  Loader2,
  MapPin,
  Navigation,
  Package,
  Play,
  StopCircle,
  User,
} from "lucide-react";
import { useState } from "react";
import apiClient from "../../../api/apiClient";
import { toast } from "../../../utils/toast";
import AddressDisplay from "../../QuortsView/AddressDisplay";

export const TripList = ({
  trips,
  onEdit,
  onDelete,
  onViewMap,
  onStatusChange,
  onStartTrip,
  onCompleteTrip,
  selectedTrips,
  onSelectTrip,
  onRefresh, // Add refresh callback to update trip list
}) => {
  const [expandedId, setExpandedId] = useState(null);
  const [loadingTripId, setLoadingTripId] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null); // 'start' or 'complete'

  const handleSelectAll = () => {
    if (selectedTrips.length === trips.length) {
      onSelectTrip([]);
    } else {
      onSelectTrip(trips.map((t) => t.id));
    }
  };

  const handleSelectTrip = (id) => {
    if (selectedTrips.includes(id)) {
      onSelectTrip(selectedTrips.filter((tId) => tId !== id));
    } else {
      onSelectTrip([...selectedTrips, id]);
    }
  };

  // API function to update trip status
  const updateTripStatus = async (tripId, status) => {
    try {
      setLoadingTripId(tripId);
      setLoadingAction(status === "START" ? "start" : "complete");

      const response = await apiClient.put(
        `/api/trip/trip/${tripId}/status`,
        null,
        { params: { status } }
      );

      if (response?.status) {
        toast.success(
          response?.paramObjectsMap?.message ||
          (status === "START"
            ? "Trip started successfully"
            : "Trip completed successfully")
        );

        // ✅ THIS IS THE KEY FIX
        await onRefresh?.();   // refetchTrips immediately

        setExpandedId(null);
      } else {
        throw new Error("Status update failed");
      }
    } catch (err) {
      toast.error("Failed to update trip status");
    } finally {
      setLoadingTripId(null);
      setLoadingAction(null);
    }
  };

  // Handle start trip
  const handleStartTrip = async (tripId) => {
    const success = await updateTripStatus(tripId, "START");
    if (success) {
      setExpandedId(null); // Collapse the expanded view
    }
  };

  // Handle complete trip
  const handleCompleteTrip = async (tripId) => {
    const success = await updateTripStatus(tripId, "END");
    if (success) {
      setExpandedId(null); // Collapse the expanded view
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300";
      case "in_progress":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
      case "scheduled":
        return "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300";
      case "pending":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300";
      case "cancelled":
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-3 w-3" />;
      case "in_progress":
        return <Clock className="h-3 w-3" />;
      case "scheduled":
        return <Calendar className="h-3 w-3" />;
      case "pending":
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <AlertCircle className="h-3 w-3" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString;
  };

  const getProgressPercentage = (trip) => {
    if (trip.status === "COMPLETED") return 100;
    if (trip.status === "in_progress") return 50;
    if (trip.status === "scheduled") return 10;
    return 0;
  };

  const calculateTimeRemaining = (trip) => {
    if (trip.status !== "in_progress") return null;

    const start = new Date(`${trip.startDate}T${trip.startTime}`);
    const now = new Date();
    const elapsed = now - start;
    const estimatedMs = parseFloat(trip.estimatedDuration) * 60 * 60 * 1000;
    const remainingMs = estimatedMs - elapsed;

    if (remainingMs <= 0) return "Overdue";

    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  // Check if trip can be started
  const canStartTrip = (trip) => trip.status === "scheduled";

  const canCompleteTrip = (trip) => trip.status === "STARTED";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-center justify-between">
          {/* Left Side - matches body structure */}
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={
                trips.length > 0 && selectedTrips.length === trips.length
              }
              onChange={handleSelectAll}
              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            />

            {/* Trip Info area - empty div to match body spacing */}
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl opacity-0">
                <Navigation className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Trips ({trips.length})
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - matches body structure */}
          <div className="flex items-center">
            <div className="w-26 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
              Distance
            </div>

            <div className="w-28 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
              Revenue
            </div>

            <div className="w-36 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
              Actions
            </div>
          </div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {trips.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto w-12 h-12 text-gray-400 dark:text-gray-500 mb-4">
              <Navigation className="w-full h-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No trips found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Create your first trip or adjust your filters
            </p>
          </div>
        ) : (
          trips.map((trip) => {
            const timeRemaining = calculateTimeRemaining(trip);
            const progress = getProgressPercentage(trip);
            const isTripLoading = loadingTripId === trip.id;

            return (
              <div
                key={trip.id}
                className={`px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors ${selectedTrips.includes(trip.id)
                  ? "bg-blue-50 dark:bg-blue-900/20"
                  : ""
                  }`}
              >
                <div className="flex items-center justify-between">
                  {/* Left Side */}
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedTrips.includes(trip.id)}
                      onChange={() => handleSelectTrip(trip.id)}
                      className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />

                    {/* Trip Info */}
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-xl ${trip.status === "COMPLETED"
                          ? "bg-emerald-100 dark:bg-emerald-900/20"
                          : trip.status === "in_progress"
                            ? "bg-blue-100 dark:bg-blue-900/20"
                            : trip.status === "scheduled"
                              ? "bg-cyan-100 dark:bg-cyan-900/20"
                              : "bg-amber-100 dark:bg-amber-900/20"
                          }`}
                      >
                        <Navigation
                          className={`h-5 w-5 ${trip.status === "COMPLETED"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : trip.status === "in_progress"
                              ? "text-blue-600 dark:text-blue-400"
                              : trip.status === "scheduled"
                                ? "text-cyan-600 dark:text-cyan-400"
                                : "text-amber-600 dark:text-amber-400"
                            }`}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {trip.tripNumber}
                          </h4>
                          {/* <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              trip?.status
                            )}`}
                          >
                            {getStatusIcon(trip.status)}
                            {trip?.status.charAt(0).toUpperCase() +
                              trip?.status.slice(1).replace("_", " ")}
                          </span> */}

                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                            {getStatusIcon(trip.status)}
                            {trip.status}
                          </span>

                        </div>

                        {/* Route Info - Using AddressDisplay */}
                        <div className="space-y-2 mb-2 max-w-[300px]">
                          <AddressDisplay label="From" address={trip.source} />
                          <AddressDisplay
                            label="To"
                            address={trip.destination}
                          />
                        </div>

                        {/* Trip Details */}
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-40 max-w-[300px]">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {trip.driverName}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Car className="h-3 w-3" />
                            {trip.vehicleName}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(trip.startDate)}{" "}
                            {formatTime(trip.startTime)}
                          </span>
                          {trip.goodsType && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Package className="h-3 w-3" />
                                {trip.goodsType}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Trip Progress
                            </span>
                            <span className="text-xs font-medium text-gray-900 dark:text-white">
                              {progress}%
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${trip.status === "COMPLETED"
                                ? "bg-emerald-500"
                                : trip.status === "in_progress"
                                  ? "bg-blue-500"
                                  : "bg-cyan-500"
                                }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="flex items-start gap-8 pt-1">
                    {/* Distance */}
                    <div className="hidden md:block">
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {trip.distance} km
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Distance
                        </div>
                      </div>
                    </div>

                    {/* Revenue */}
                    <div className="hidden lg:block">
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-lg font-bold text-gray-900 dark:text-white">
                          <IndianRupee className="h-4 w-4" />
                          {trip.revenue?.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Revenue
                        </div>
                      </div>
                    </div>

                    {/* Time Remaining */}
                    {timeRemaining && (
                      <div className="hidden xl:block">
                        <div className="text-right">
                          <div
                            className={`text-sm font-medium ${timeRemaining === "Overdue"
                              ? "text-red-600 dark:text-red-400"
                              : "text-gray-900 dark:text-white"
                              }`}
                          >
                            {timeRemaining}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Remaining
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-0">
                      {/* Start Trip */}
                      <div className="w-[20px] flex justify-center">
                        {canStartTrip(trip) && (
                          <button
                            onClick={() => handleStartTrip(trip.id)}
                            disabled={isTripLoading}
                            className="p-2 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Start trip"
                          >
                            {isTripLoading && loadingAction === "start" ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Complete Trip */}
                      {canCompleteTrip(trip) && (
                        <button
                          onClick={() => handleCompleteTrip(trip.id)}
                          disabled={isTripLoading}
                          className="p-2 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Complete trip"
                        >
                          {isTripLoading && loadingAction === "complete" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <StopCircle className="h-4 w-4" />
                          )}
                        </button>
                      )}

                      <button
                        onClick={() => onViewMap(trip)}
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                        title="View on map"
                      >
                        <MapPin className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => onEdit(trip)}
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                        title="Edit trip"
                      >
                        <Edit className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() =>
                          setExpandedId(expandedId === trip.id ? null : trip.id)
                        }
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        <ChevronRight
                          className={`h-4 w-4 transition-transform ${expandedId === trip.id ? "rotate-90" : ""
                            }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === trip.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Customer Details */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Customer Details
                        </h5>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900 dark:text-white">
                              {trip.customerName}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {trip.customerContact}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Trip Type: {trip.tripType?.replace("_", " ")}
                          </div>
                        </div>
                      </div>

                      {/* Trip Details */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Trip Details
                        </h5>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Start:
                            </span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {formatDate(trip.startDate)}{" "}
                              {formatTime(trip.startTime)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              End:
                            </span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {trip.endDate
                                ? `${formatDate(trip.endDate)} ${formatTime(
                                  trip.endTime
                                )}`
                                : "Ongoing"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Duration:
                            </span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {trip.actualDuration || trip.estimatedDuration}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Financial Summary */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Financial Summary
                        </h5>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Trip Cost:
                            </span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              ₹{trip.tripCost?.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Revenue:
                            </span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              ₹{trip.revenue?.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Profit:
                            </span>
                            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                              ₹{trip.profit?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Goods Details */}
                    {trip.goodsType && trip.goodsType !== "Empty" && (
                      <div className="mt-6">
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Goods Information
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Type
                            </div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {trip.goodsType}
                            </div>
                          </div>
                          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Weight
                            </div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {trip.goodsWeight} tons
                            </div>
                          </div>
                          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Value
                            </div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              ₹{trip.goodsValue?.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-6 flex items-center gap-3">
                      <button
                        onClick={() => onViewMap(trip)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <MapPin className="h-4 w-4" />
                        View on Map
                      </button>

                      {canStartTrip(trip) && (
                        <button
                          onClick={() => handleStartTrip(trip.id)}
                          disabled={isTripLoading}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isTripLoading && loadingAction === "start" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                          Start Trip
                        </button>
                      )}

                      {canCompleteTrip(trip) && (
                        <button
                          onClick={() => handleCompleteTrip(trip.id)}
                          disabled={isTripLoading}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isTripLoading && loadingAction === "complete" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <StopCircle className="h-4 w-4" />
                          )}
                          Complete Trip
                        </button>
                      )}

                      <button
                        onClick={() => onEdit(trip)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                      >
                        <Edit className="h-4 w-4" />
                        Edit Details
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
