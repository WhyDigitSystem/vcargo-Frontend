import {
  Car,
  Clock,
  MapPin,
  Navigation,
  Users,
  X,
  ZoomIn,
  ZoomOut,
  Route,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import { useGoogleMaps } from "../../../hooks/useGoogleMaps";

export const TripMapView = ({ trip, trips = [], onClose }) => {
  const [zoom, setZoom] = useState(10);
  const [selectedTrip, setSelectedTrip] = useState(trip);
  const [directions, setDirections] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // Default to India center
  const [isLoading, setIsLoading] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [polylines, setPolylines] = useState([]);
  
  const mapRef = useRef(null);
  const directionsServiceRef = useRef(null);
  const { isLoaded: mapsLoaded, loadError } = useGoogleMaps();

  // Initialize directions service when maps are loaded
  useEffect(() => {
    if (mapsLoaded && window.google) {
      directionsServiceRef.current = new window.google.maps.DirectionsService();
    }
  }, [mapsLoaded]);

  // Calculate route when selected trip changes
  useEffect(() => {
    if (selectedTrip && mapsLoaded && directionsServiceRef.current) {
      calculateRoute(selectedTrip);
    }
  }, [selectedTrip, mapsLoaded]);

  // Set initial selected trip
  useEffect(() => {
    if (trip) {
      setSelectedTrip(trip);
    } else if (trips.length > 0) {
      setSelectedTrip(trips[0]);
    }
  }, [trip, trips]);

  const calculateRoute = async (tripData) => {
    if (!tripData || !directionsServiceRef.current) return;

    setIsLoading(true);
    
    try {
      const origin = tripData.source;
      const destination = tripData.destination;
      
      // Create waypoints from trip waypoints
      const waypoints = (tripData.waypoints || []).map(wp => ({
        location: wp.location || wp,
        stopover: true
      }));

      console.log('Calculating route:', { origin, destination, waypoints });

      const result = await directionsServiceRef.current.route({
        origin,
        destination,
        waypoints: waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false,
      });

      setDirections(result);

      // Center map on the route
      if (result.routes[0]?.bounds) {
        const bounds = result.routes[0].bounds;
        const center = bounds.getCenter();
        setMapCenter({ lat: center.lat(), lng: center.lng() });
        
        // Fit bounds to show entire route
        if (mapRef.current) {
          mapRef.current.fitBounds(bounds);
        }
      }

      // Create markers for source, destination, and waypoints
      const routeMarkers = [];
      const routePolylines = [];

      // Add source marker
      if (result.routes[0]?.legs[0]?.start_location) {
        routeMarkers.push({
          position: {
            lat: result.routes[0].legs[0].start_location.lat(),
            lng: result.routes[0].legs[0].start_location.lng(),
          },
          title: `Source: ${tripData.source}`,
          type: 'source',
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: '#3b82f6',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            scale: 8,
          },
        });
      }

      // Add destination marker
      const lastLeg = result.routes[0]?.legs[result.routes[0].legs.length - 1];
      if (lastLeg?.end_location) {
        routeMarkers.push({
          position: {
            lat: lastLeg.end_location.lat(),
            lng: lastLeg.end_location.lng(),
          },
          title: `Destination: ${tripData.destination}`,
          type: 'destination',
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: '#10b981',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            scale: 8,
          },
        });
      }

      // Add waypoint markers
      waypoints.forEach((wp, index) => {
        const leg = result.routes[0]?.legs[index];
        if (leg?.end_location) {
          routeMarkers.push({
            position: {
              lat: leg.end_location.lat(),
              lng: leg.end_location.lng(),
            },
            title: `Waypoint ${index + 1}: ${wp.location}`,
            type: 'waypoint',
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: '#6b7280',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
              scale: 6,
            },
          });
        }
      });

      // Add polyline for the route
      if (result.routes[0]?.overview_path) {
        routePolylines.push({
          path: result.routes[0].overview_path,
          options: {
            strokeColor: '#3b82f6',
            strokeOpacity: 0.8,
            strokeWeight: 5,
            geodesic: true,
          },
        });
      }

      setMarkers(routeMarkers);
      setPolylines(routePolylines);

    } catch (error) {
      console.error("Error calculating route:", error);
      
      // Fallback: Create markers based on city names if route calculation fails
      createFallbackMarkers(tripData);
    } finally {
      setIsLoading(false);
    }
  };

  const createFallbackMarkers = (tripData) => {
    const fallbackMarkers = [];
    const fallbackPolylines = [];
    
    // Mock coordinates for Indian cities (you can expand this list)
    const cityCoordinates = {
      mumbai: { lat: 19.076, lng: 72.8777 },
      pune: { lat: 18.5204, lng: 73.8567 },
      bangalore: { lat: 12.9716, lng: 77.5946 },
      ahmedabad: { lat: 23.0225, lng: 72.5714 },
      delhi: { lat: 28.6139, lng: 77.209 },
      chennai: { lat: 13.0827, lng: 80.2707 },
      hyderabad: { lat: 17.385, lng: 78.4867 },
      kolkata: { lat: 22.5726, lng: 88.3639 },
      jaipur: { lat: 26.9124, lng: 75.7873 },
      lucknow: { lat: 26.8467, lng: 80.9462 },
      // Add more cities as needed
    };

    // Get source coordinates
    const sourceLower = tripData.source.toLowerCase();
    let sourceCoords = cityCoordinates.mumbai; // Default
    
    for (const [city, coords] of Object.entries(cityCoordinates)) {
      if (sourceLower.includes(city.toLowerCase())) {
        sourceCoords = coords;
        break;
      }
    }

    // Get destination coordinates
    const destLower = tripData.destination.toLowerCase();
    let destCoords = cityCoordinates.delhi; // Default
    
    for (const [city, coords] of Object.entries(cityCoordinates)) {
      if (destLower.includes(city.toLowerCase())) {
        destCoords = coords;
        break;
      }
    }

    // Add source marker
    fallbackMarkers.push({
      position: sourceCoords,
      title: `Source: ${tripData.source}`,
      type: 'source',
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: '#3b82f6',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
        scale: 8,
      },
    });

    // Add destination marker
    fallbackMarkers.push({
      position: destCoords,
      title: `Destination: ${tripData.destination}`,
      type: 'destination',
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: '#10b981',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
        scale: 8,
      },
    });

    // Add waypoint markers
    (tripData.waypoints || []).forEach((wp, index) => {
      const wpLocation = typeof wp === 'string' ? wp : wp.location;
      const wpLower = wpLocation.toLowerCase();
      let wpCoords = cityCoordinates.mumbai; // Default
      
      for (const [city, coords] of Object.entries(cityCoordinates)) {
        if (wpLower.includes(city.toLowerCase())) {
          wpCoords = coords;
          break;
        }
      }

      fallbackMarkers.push({
        position: wpCoords,
        title: `Waypoint ${index + 1}: ${wpLocation}`,
        type: 'waypoint',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: '#6b7280',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          scale: 6,
        },
      });
    });

    // Add polyline connecting source and destination
    fallbackPolylines.push({
      path: [sourceCoords, destCoords],
      options: {
        strokeColor: '#3b82f6',
        strokeOpacity: 0.6,
        strokeWeight: 3,
        geodesic: true,
        strokeDashArray: [10, 10], // Dashed line for fallback
      },
    });

    setMarkers(fallbackMarkers);
    setPolylines(fallbackPolylines);
    
    // Center map between source and destination
    const centerLat = (sourceCoords.lat + destCoords.lat) / 2;
    const centerLng = (sourceCoords.lng + destCoords.lng) / 2;
    setMapCenter({ lat: centerLat, lng: centerLng });
  };

  const handleMapLoad = (map) => {
    mapRef.current = map;
  };

  const handleZoomIn = () => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom();
      mapRef.current.setZoom(currentZoom + 1);
      setZoom(currentZoom + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom();
      mapRef.current.setZoom(currentZoom - 1);
      setZoom(currentZoom - 1);
    }
  };

  const handleTripSelect = (selected) => {
    setSelectedTrip(selected);
    setDirections(null);
    setMarkers([]);
    setPolylines([]);
  };

  const formatDuration = (duration) => {
    if (!duration) return "";
    return duration;
  };

  const calculateProgress = (trip) => {
    if (!trip) return 0;
    
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

  if (loadError) {
    return (
      <div className="relative w-full max-w-6xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8 text-center">
          <div className="text-red-500 mb-4">
            <Route className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Google Maps Failed to Load
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Please check your internet connection and try again.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

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
              onClick={handleZoomIn}
              className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <button
              onClick={handleZoomOut}
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
                    onClick={() => handleTripSelect(t)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedTrip?.id === t.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {t.tripNumber || `TRIP-${t.id}`}
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
                        {t.vehicleName || t.vehicle}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {t.driverName || t.driver}
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
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Waypoint
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Current Location
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Map View */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 h-[500px] relative overflow-hidden">
              {!mapsLoaded ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                      Loading Google Maps...
                    </p>
                  </div>
                </div>
              ) : isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                      Calculating route...
                    </p>
                  </div>
                </div>
              ) : (
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={mapCenter}
                  zoom={zoom}
                  onLoad={handleMapLoad}
                  options={{
                    zoomControl: false,
                    streetViewControl: false,
                    mapTypeControl: true,
                    fullscreenControl: true,
                    styles: [
                      {
                        featureType: "poi",
                        elementType: "labels",
                        stylers: [{ visibility: "off" }],
                      },
                    ],
                  }}
                >
                  {directions && (
                    <DirectionsRenderer
                      directions={directions}
                      options={{
                        suppressMarkers: true,
                        polylineOptions: {
                          strokeColor: "#3b82f6",
                          strokeOpacity: 0.8,
                          strokeWeight: 5,
                        },
                      }}
                    />
                  )}

                  {/* Custom Markers */}
                  {markers.map((marker, index) => (
                    <Marker
                      key={index}
                      position={marker.position}
                      title={marker.title}
                      icon={marker.icon}
                    />
                  ))}

                  {/* Polylines for fallback mode */}
                  {polylines.map((polyline, index) => (
                    <Polyline
                      key={index}
                      path={polyline.path}
                      options={polyline.options}
                    />
                  ))}

                  {/* Current Location Marker (if available) */}
                  {selectedTrip?.currentLocation && (
                    <Marker
                      position={{
                        lat: selectedTrip.currentLocation.lat || mapCenter.lat,
                        lng: selectedTrip.currentLocation.lng || mapCenter.lng,
                      }}
                      title="Current Location"
                      icon={{
                        path: window.google.maps.SymbolPath.CIRCLE,
                        fillColor: "#f59e0b",
                        fillOpacity: 1,
                        strokeColor: "#ffffff",
                        strokeWeight: 2,
                        scale: 8,
                      }}
                      animation={window.google.maps.Animation.BOUNCE}
                    />
                  )}
                </GoogleMap>
              )}

              {/* Map Controls */}
              <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
                <button 
                  onClick={() => {
                    if (mapRef.current && directions?.routes[0]?.bounds) {
                      mapRef.current.fitBounds(directions.routes[0].bounds);
                    }
                  }}
                  className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Route className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Zoom Display */}
              <div className="absolute top-4 left-4 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10">
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
                    Trip Details: {selectedTrip.tripNumber || `TRIP-${selectedTrip.id}`}
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
                      {selectedTrip.waypoints && selectedTrip.waypoints.length > 0 && (
                        <div className="ml-6 mt-2">
                          <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Waypoints:
                          </div>
                          {selectedTrip.waypoints.map((wp, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                              <span className="text-gray-600 dark:text-gray-400">
                                {typeof wp === 'string' ? wp : wp.location}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Distance: {selectedTrip.distance || "N/A"} km
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
                          {selectedTrip.vehicleName || selectedTrip.vehicle}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">
                          {selectedTrip.driverName || selectedTrip.driver}
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
                          Started: {selectedTrip.startTime || "N/A"}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Estimated: {selectedTrip.estimatedDuration || "N/A"}
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{calculateProgress(selectedTrip)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${calculateProgress(selectedTrip)}%` }}
                          ></div>
                        </div>
                      </div>
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