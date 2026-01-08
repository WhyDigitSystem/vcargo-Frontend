import {
  Car,
  Clock,
  MapPin,
  Navigation,
  Users,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useState } from "react";

export const TripMapView = ({ trip, trips = [], onClose }) => {
  const [zoom, setZoom] = useState(10);
  const [selectedTrip, setSelectedTrip] = useState(trip);

  // Mock coordinates for Indian cities
  const cityCoordinates = {
    Mumbai: { lat: 19.076, lng: 72.8777, color: "bg-blue-500" },
    Pune: { lat: 18.5204, lng: 73.8567, color: "bg-green-500" },
    Bangalore: { lat: 12.9716, lng: 77.5946, color: "bg-purple-500" },
    Ahmedabad: { lat: 23.0225, lng: 72.5714, color: "bg-orange-500" },
    Delhi: { lat: 28.6139, lng: 77.209, color: "bg-red-500" },
    Chennai: { lat: 13.0827, lng: 80.2707, color: "bg-pink-500" },
    Hyderabad: { lat: 17.385, lng: 78.4867, color: "bg-cyan-500" },
    Kolkata: { lat: 22.5726, lng: 88.3639, color: "bg-yellow-500" },
    Jaipur: { lat: 26.9124, lng: 75.7873, color: "bg-indigo-500" },
    Lucknow: { lat: 26.8467, lng: 80.9462, color: "bg-teal-500" },
  };

  const getCityCoords = (location) => {
    for (const [city, coords] of Object.entries(cityCoordinates)) {
      if (location.includes(city)) {
        return coords;
      }
    }
    return { lat: 20.5937, lng: 78.9629, color: "bg-gray-500" }; // Default to India center
  };

  const formatDuration = (duration) => {
    if (!duration) return "";
    return duration;
  };

  const calculateProgress = (trip) => {
    if (!trip) return 0;

    const sourceCoords = getCityCoords(trip.source);
    const destCoords = getCityCoords(trip.destination);

    // Mock progress calculation based on status
    switch (trip.status) {
      case "completed":
        return 100;
      case "in_progress":
        return 50;
      case "scheduled":
        return 0;
      default:
        return 0;
    }
  };

  return (
    <div className="relative w-full max-w-6xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <Navigation className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Live Trip Map</h2>
              <p className="text-blue-100 text-sm">
                Real-time tracking of all active trips
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setZoom(Math.min(zoom + 2, 20))}
              className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <button
              onClick={() => setZoom(Math.max(zoom - 2, 1))}
              className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Trip List */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Active Trips ({trips.length})
              </h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {trips.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTrip(t)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedTrip?.id === t.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {t.tripNumber}
                        </h4>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {t.source} → {t.destination}
                        </div>
                      </div>
                      <span className="text-xs font-medium px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Car className="h-3 w-3" />
                        {t.vehicleName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {t.driverName}
                      </span>
                    </div>
                    {t.currentLocation && (
                      <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                        📍 Currently at: {t.currentLocation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Map Legend
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Source
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Destination
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Active Vehicle
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Waypoint
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Map View */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 h-[500px] relative overflow-hidden">
              {/* Mock Map with SVG */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* India Outline (Simplified) */}
                  <svg className="w-full h-full" viewBox="0 0 800 600">
                    {/* Background */}
                    <rect
                      width="800"
                      height="600"
                      fill="#f8fafc"
                      className="dark:fill-gray-900"
                    />

                    {/* Grid Lines */}
                    {Array.from({ length: 10 }).map((_, i) => (
                      <g key={i}>
                        <line
                          x1={i * 80}
                          y1="0"
                          x2={i * 80}
                          y2="600"
                          stroke="#e2e8f0"
                          strokeWidth="1"
                          className="dark:stroke-gray-700"
                        />
                        <line
                          x1="0"
                          y1={i * 60}
                          x2="800"
                          y2={i * 60}
                          stroke="#e2e8f0"
                          strokeWidth="1"
                          className="dark:stroke-gray-700"
                        />
                      </g>
                    ))}

                    {/* Routes */}
                    {trips.map((t, index) => {
                      const sourceCoords = getCityCoords(t.source);
                      const destCoords = getCityCoords(t.destination);
                      const progress = calculateProgress(t);

                      // Convert lat/lng to SVG coordinates (simplified)
                      const x1 = 100 + (sourceCoords.lng + 80) * 3;
                      const y1 = 300 - sourceCoords.lat * 4;
                      const x2 = 100 + (destCoords.lng + 80) * 3;
                      const y2 = 300 - destCoords.lat * 4;
                      const currentX = x1 + (x2 - x1) * (progress / 100);
                      const currentY = y1 + (y2 - y1) * (progress / 100);

                      return (
                        <g key={t.id}>
                          {/* Route Line */}
                          <line
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="#93c5fd"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                          />

                          {/* Source */}
                          <circle
                            cx={x1}
                            cy={y1}
                            r="8"
                            fill="#3b82f6"
                            stroke="white"
                            strokeWidth="2"
                          />

                          {/* Destination */}
                          <circle
                            cx={x2}
                            cy={y2}
                            r="8"
                            fill="#10b981"
                            stroke="white"
                            strokeWidth="2"
                          />

                          {/* Current Location */}
                          {progress > 0 && progress < 100 && (
                            <circle
                              cx={currentX}
                              cy={currentY}
                              r="6"
                              fill="#f59e0b"
                              stroke="white"
                              strokeWidth="2"
                              className="animate-pulse"
                            >
                              <animate
                                attributeName="r"
                                values="6;10;6"
                                dur="1.5s"
                                repeatCount="indefinite"
                              />
                            </circle>
                          )}

                          {/* Waypoints */}
                          {t.waypoints &&
                            t.waypoints.map((wp, wpIndex) => {
                              const wpCoords = getCityCoords(wp.location);
                              const wpX = 100 + (wpCoords.lng + 80) * 3;
                              const wpY = 300 - wpCoords.lat * 4;

                              return (
                                <circle
                                  key={wpIndex}
                                  cx={wpX}
                                  cy={wpY}
                                  r="5"
                                  fill="#6b7280"
                                  stroke="white"
                                  strokeWidth="2"
                                />
                              );
                            })}
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Map Controls */}
              <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <button className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                  <Navigation className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                  <MapPin className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Zoom Display */}
              <div className="absolute top-4 left-4 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Zoom: {zoom}x
                </span>
              </div>
            </div>

            {/* Selected Trip Details */}
            {selectedTrip && (
              <div className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Trip Details: {selectedTrip.tripNumber}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedTrip.status === "in_progress"
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                        : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300"
                    }`}
                  >
                    {selectedTrip.status === "in_progress"
                      ? "In Progress"
                      : "Active"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Route
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        <span className="text-gray-900 dark:text-white">
                          {selectedTrip.source}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-green-500" />
                        <span className="text-gray-900 dark:text-white">
                          {selectedTrip.destination}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Distance: {selectedTrip.distance} km
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Vehicle & Driver
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">
                          {selectedTrip.vehicleName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">
                          {selectedTrip.driverName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Timing
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">
                          Started: {selectedTrip.startTime}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Estimated: {selectedTrip.estimatedDuration}
                      </div>
                      {selectedTrip.currentLocation && (
                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="text-xs text-blue-600 dark:text-blue-400">
                            Current Location
                          </div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {selectedTrip.currentLocation}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
