import {
  AlertCircle,
  Car,
  Clock,
  Loader2,
  MapPin,
  Navigation,
  User,
} from "lucide-react";
import { useState } from "react";
import apiClient from "../../../api/apiClient";
import AddressDisplay from "../../QuortsView/AddressDisplay";
import { toast } from "../../../utils/toast";

export const TripTimeline = ({ trips, onStatusChange, onRefresh }) => {
  const [loadingTripId, setLoadingTripId] = useState(null);

  const activeTrips = trips.filter((t) => t.status === "STARTED");

  // const upcomingTrips = trips
  //   .filter((t) => t.status === "scheduled")
  //   .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
  //   .slice(0, 3);

  const upcomingTrips = trips.filter((t) => t.status === "scheduled");

  // API function to update trip status
  const updateTripStatus = async (tripId, status) => {
    try {
      setLoadingTripId(tripId);

      const response = await apiClient.put(
        `/api/trip/trip/${tripId}/status`,
        null, // No request body
        {
          params: { status },
        }
      );

      console.log("Trip status update response:", response);

      if (response?.status) {
        const successMessage =
          response?.paramObjectsMap?.message ||
          (status === "START"
            ? "Trip started successfully"
            : "Trip completed successfully");

        toast.success(successMessage, {
          position: "top-right",
          autoClose: 3000,
        });

        // Call parent callback to update status
        if (onStatusChange) {
          onStatusChange(
            tripId,
            status === "END" ? "completed" : "in_progress"
          );
        }

        // Refresh trip list
        if (onRefresh) {
          onRefresh();
        }

        return true;
      } else {
        const errorMessage =
          response?.paramObjectsMap?.message || "Failed to update trip status";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error(`Error updating trip status to ${status}:`, error);

      const errorMsg =
        error.response?.paramObjectsMap?.message ||
        error.message ||
        `Failed to ${status === "END" ? "complete" : "start"} trip`;

      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 4000,
      });

      return false;
    } finally {
      setLoadingTripId(null);
    }
  };

  // Handle complete trip
  const handleCompleteTrip = async (tripId) => {
    const success = await updateTripStatus(tripId, "END");
    if (success) {
      // Success handled in updateTripStatus
      // toast.success("Trip Completed successfully!");
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getTimeRemaining = (trip) => {
    if (trip.status !== "in_progress") return null;

    const start = new Date(`${trip.startDate}T${trip.startTime}`);
    const now = new Date();
    const elapsed = now - start;
    const estimatedMs = parseFloat(trip.estimatedDuration) * 60 * 60 * 1000;
    const remainingMs = estimatedMs - elapsed;

    if (remainingMs <= 0)
      return {
        text: "Overdue",
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-100 dark:bg-red-900/20",
      };

    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return {
        text: `${hours}h ${minutes}m left`,
        color: "text-amber-600 dark:text-amber-400",
        bgColor: "bg-amber-100 dark:bg-amber-900/20",
      };
    } else {
      return {
        text: `${minutes}m left`,
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-100 dark:bg-red-900/20",
      };
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Trips */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Navigation className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Active Trips
          </h3>
          <span className="ml-auto bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            {activeTrips.length}
          </span>
        </div>

        {activeTrips.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No active trips</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTrips.map((trip) => {
              const timeRemaining = getTimeRemaining(trip);
              const isLoading = loadingTripId === trip.id;

              return (
                <div
                  key={trip.id}
                  className={`p-4 border rounded-xl transition-all ${isLoading
                    ? "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10 animate-pulse"
                    : timeRemaining?.text === "Overdue"
                      ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10"
                      : "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10"
                    }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      {/* Trip Number */}
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-white truncate">
                          {trip.tripNumber}
                        </h4>

                        {timeRemaining && (
                          <span
                            className={`shrink-0 text-xs font-medium px-2 py-1 rounded-full ${timeRemaining.bgColor} ${timeRemaining.color}`}
                          >
                            {timeRemaining.text}
                          </span>
                        )}
                      </div>

                      {/* Addresses */}
                      <div className="space-y-2 mt-2">
                        <AddressDisplay
                          label="From"
                          address={trip.source}
                          className="line-clamp-2"
                        />
                        <AddressDisplay
                          label="To"
                          address={trip.destination}
                          className="line-clamp-2"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm mb-3">
                    <div className="flex items-center gap-1">
                      <Car className="h-3 w-3 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400 truncate">
                        {trip.vehicleName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400 truncate">
                        {trip.driverName}
                      </span>
                    </div>
                  </div>

                  {trip.currentLocation && (
                    <div className="mt-3 p-2 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Current Location
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {trip.currentLocation}
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleCompleteTrip(trip.id)}
                      disabled={isLoading}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Completing...
                        </>
                      ) : (
                        "Mark as Completed"
                      )}
                    </button>

                    {trip.currentLocation && (
                      <button
                        onClick={() =>
                          window.open(
                            `https://maps.google.com/?q=${encodeURIComponent(
                              trip.currentLocation
                            )}`,
                            "_blank"
                          )
                        }
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-1"
                      >
                        <MapPin className="h-4 w-4" />
                        Map
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upcoming Trips */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-cyan-100 dark:bg-cyan-900/20 rounded-lg">
            <Clock className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Upcoming Trips
          </h3>
          <span className="ml-auto bg-cyan-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            {upcomingTrips.length}
          </span>
        </div>

        {upcomingTrips.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
            No upcoming trips
          </p>
        ) : (
          <div className="space-y-3">
            {upcomingTrips.map((trip, index) => (
              <div
                key={trip.id}
                className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className={`w-2 h-2 rounded-full ${index === 0
                          ? "bg-emerald-500"
                          : index === 1
                            ? "bg-blue-500"
                            : "bg-cyan-500"
                          }`}
                      />
                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                        {trip.tripNumber}
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {trip.source} → {trip.destination}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-gray-900 dark:text-white">
                      {formatTime(trip.startTime)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(trip.startDate).toLocaleDateString("en-IN", {
                        weekday: "short",
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1 truncate">
                    <Car className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{trip.vehicleName}</span>
                  </span>
                  <span className="flex items-center gap-1 truncate">
                    <User className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{trip.driverName}</span>
                  </span>
                </div>

                {/* Trip details that appear on hover */}
                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 hidden group-hover:block">
                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Distance:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {trip.distance || 0} km
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Estimated Duration:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {trip.estimatedDuration || "N/A"}
                      </span>
                    </div>
                    {trip.goodsType && trip.goodsType !== "Empty" && (
                      <div className="flex items-center justify-between">
                        <span>Goods:</span>
                        <span className="font-medium text-gray-900 dark:text-white truncate ml-2">
                          {trip.goodsType}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
            <AlertCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Today's Summary
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {
                trips.filter(
                  (t) =>
                    new Date(t.startDate).toDateString() ===
                    new Date().toDateString()
                ).length
              }
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Trips Today
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {
                trips.filter(
                  (t) =>
                    new Date(t.startDate).toDateString() ===
                    new Date().toDateString() && t.status === "completed"
                ).length
              }
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Completed
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {
                trips.filter(
                  (t) =>
                    new Date(t.startDate).toDateString() ===
                    new Date().toDateString() && t.status === "in_progress"
                ).length
              }
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              In Progress
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {trips
                .filter(
                  (t) =>
                    new Date(t.startDate).toDateString() ===
                    new Date().toDateString()
                )
                .reduce((sum, trip) => sum + (trip.distance || 0), 0)}{" "}
              km
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Distance Today
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
