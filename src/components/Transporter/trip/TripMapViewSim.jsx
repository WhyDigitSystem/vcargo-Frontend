import {
  GoogleMap,
  InfoWindow,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import {
  Car,
  Fuel,
  Map,
  MapPin,
  Navigation,
  Play,
  Radio,
  RefreshCw,
  Route,
  Satellite,
  Shield,
  Square,
  Thermometer,
  Users,
  Wifi,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useGoogleMaps } from "../../../hooks/useGoogleMaps";

const TripMapViewSim = ({ trip, trips = [], onClose }) => {
  const [selectedTrip, setSelectedTrip] = useState(trip || trips[0]);
  const [trackingData, setTrackingData] = useState(null);
  const [isTracking, setIsTracking] = useState(true);
  const [refreshCount, setRefreshCount] = useState(0);
  const [zoom, setZoom] = useState(10);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
  const [markers, setMarkers] = useState([]);
  const [polylines, setPolylines] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [trackingHistory, setTrackingHistory] = useState([]);

  const mapRef = useRef(null);
  const { isLoaded: mapsLoaded, loadError } = useGoogleMaps();

  // Generate mock GPS data
  const generateMockData = () => {
    // Simulate movement along Mumbai-Delhi route
    const baseLat = 19.076 + refreshCount * 0.0005;
    const baseLng = 72.8777 + refreshCount * 0.0005;

    const cities = [
      { name: "Mumbai", lat: 19.076, lng: 72.8777 },
      { name: "Pune", lat: 18.5204, lng: 73.8567 },
      { name: "Indore", lat: 22.7196, lng: 75.8577 },
      { name: "Gwalior", lat: 26.2183, lng: 78.1828 },
      { name: "Delhi", lat: 28.6139, lng: 77.209 },
    ];

    const progress = Math.min(refreshCount / 50, 1);
    const startIndex = 0;
    const endIndex = Math.floor(progress * (cities.length - 1));

    let lat, lng, address;
    if (endIndex < cities.length - 1) {
      const startCity = cities[endIndex];
      const endCity = cities[endIndex + 1];
      const segmentProgress = progress * (cities.length - 1) - endIndex;

      lat = startCity.lat + (endCity.lat - startCity.lat) * segmentProgress;
      lng = startCity.lng + (endCity.lng - startCity.lng) * segmentProgress;
      address = `Between ${startCity.name} and ${endCity.name}`;
    } else {
      lat = cities[cities.length - 1].lat;
      lng = cities[cities.length - 1].lng;
      address = `Arrived at ${cities[cities.length - 1].name}`;
    }

    return {
      latitude: lat,
      longitude: lng,
      timestamp: new Date().toISOString(),
      speed: Math.floor(Math.random() * 70) + 30,
      bearing: Math.floor(Math.random() * 360),
      batteryLevel: 65 + (refreshCount % 15),
      signalStrength: -75 + Math.floor(Math.random() * 25),
      accuracy: Math.floor(Math.random() * 12) + 3,
      ignition: true,
      fuelLevel: 45 + (refreshCount % 25),
      temperature: 28 + Math.floor(Math.random() * 8),
      odometer: 15670 + refreshCount * 2,
      address: address,
      movement: refreshCount > 0,
      satelliteCount: 9 + Math.floor(Math.random() * 3),
      deviceId: "GPS-001",
      simNumber: "+919876543210",
      imei: "356789101112131",
    };
  };

  // Start/stop tracking
  const toggleTracking = () => {
    setIsTracking(!isTracking);
  };

  // Refresh data
  const refreshData = () => {
    const data = generateMockData();
    setTrackingData(data);
    setRefreshCount((prev) => prev + 1);

    // Add to tracking history
    if (data.latitude && data.longitude) {
      setTrackingHistory((prev) => [
        ...prev.slice(-50), // Keep only last 50 points
        { lat: data.latitude, lng: data.longitude, timestamp: data.timestamp },
      ]);
    }

    // Update map markers
    updateMapMarkers(data);
  };

  // Update map markers with new position
  // Update map markers with new position
  const updateMapMarkers = (data) => {
    if (!data.latitude || !data.longitude) return;

    const position = { lat: data.latitude, lng: data.longitude };

    // Update live position marker
    const liveMarker = {
      position,
      title: `Live Position: ${selectedTrip?.vehicleName || "Vehicle"}`,
      type: "live_position",
      icon: {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
          <circle cx="12" cy="12" r="10" fill="#3b82f6" opacity="0.9"/>
          <circle cx="12" cy="12" r="6" fill="#ffffff"/>
          <circle cx="12" cy="12" r="2" fill="#3b82f6"/>
          <path d="M12 2L12 22" stroke="#ffffff" stroke-width="2"/>
          <path d="M2 12L22 12" stroke="#ffffff" stroke-width="2"/>
          <animateTransform 
            attributeName="transform" 
            attributeType="XML" 
            type="rotate"
            from="0 12 12" 
            to="360 12 12" 
            dur="2s" 
            repeatCount="indefinite"
          />
        </svg>
      `)}`,
        scaledSize: window.google
          ? new window.google.maps.Size(40, 40)
          : { width: 40, height: 40 },
        anchor: window.google
          ? new window.google.maps.Point(20, 20)
          : { x: 20, y: 20 },
      },
      data: {
        speed: data.speed,
        bearing: data.bearing,
        battery: data.batteryLevel,
        timestamp: data.timestamp,
        address: data.address,
      },
    };

    // Create source and destination markers (only if window.google exists)
    const sourceMarker = {
      position: { lat: 19.076, lng: 72.8777 },
      title: "Source: Mumbai",
      type: "source",
      icon: window.google
        ? {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: "#3b82f6",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
            scale: 8,
          }
        : undefined,
    };

    const destinationMarker = {
      position: { lat: 28.6139, lng: 77.209 },
      title: "Destination: Delhi",
      type: "destination",
      icon: window.google
        ? {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: "#10b981",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
            scale: 8,
          }
        : undefined,
    };

    // Update markers
    setMarkers([sourceMarker, destinationMarker, liveMarker]);

    // Update polyline for tracking history
    if (trackingHistory.length > 1) {
      const path = trackingHistory.map((point) => point);
      setPolylines([
        {
          path: path,
          options: {
            strokeColor: "#3b82f6",
            strokeOpacity: 0.6,
            strokeWeight: 3,
            geodesic: true,
          },
        },
      ]);
    }

    // Center map on live position
    setMapCenter(position);

    // Auto-pan to live position if tracking is active
    if (isTracking && mapRef.current) {
      mapRef.current.panTo(position);
    }
  };

  // Map Load Function
  const handleMapLoad = (map) => {
    mapRef.current = map;
  };

  // Map Zoom Functions
  const handleZoomIn = () => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom();
      const newZoom = currentZoom + 1;
      mapRef.current.setZoom(newZoom);
      setZoom(newZoom);
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom();
      const newZoom = currentZoom - 1;
      mapRef.current.setZoom(newZoom);
      setZoom(newZoom);
    }
  };

  // Fit to route bounds
// Fit to route bounds
const fitToRoute = () => {
  if (mapRef.current && markers.length > 0 && window.google) {
    const bounds = new window.google.maps.LatLngBounds();
    markers.forEach(marker => {
      bounds.extend(marker.position);
    });
    
    if (trackingHistory.length > 0) {
      trackingHistory.forEach(point => {
        bounds.extend(point);
      });
    }
    
    mapRef.current.fitBounds(bounds);
    
    // Adjust zoom level
    setTimeout(() => {
      const currentZoom = mapRef.current.getZoom();
      if (currentZoom > 15) {
        mapRef.current.setZoom(15);
        setZoom(15);
      }
    }, 100);
  }
};

  // Auto-refresh every 5 seconds when tracking
  useEffect(() => {
    if (isTracking) {
      const interval = setInterval(() => {
        refreshData();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isTracking]);

  // Initialize map with route when maps are loaded
useEffect(() => {
  if (mapsLoaded && selectedTrip && window.google) {
    // Initialize with default markers
    const sourceMarker = {
      position: { lat: 19.076, lng: 72.8777 },
      title: "Source: Mumbai",
      type: "source",
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: "#3b82f6",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
        scale: 8,
      }
    };

    const destinationMarker = {
      position: { lat: 28.6139, lng: 77.209 },
      title: "Destination: Delhi",
      type: "destination",
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: "#10b981",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
        scale: 8,
      }
    };

    setMarkers([sourceMarker, destinationMarker]);
    setMapCenter({ lat: 23.344, lng: 75.014 }); // Center between Mumbai and Delhi
  }
}, [mapsLoaded, selectedTrip]);

  // Initial data load
  useEffect(() => {
    if (selectedTrip) {
      refreshData();
    }
  }, [selectedTrip]);

  // Initialize map with route when maps are loaded
  useEffect(() => {
    if (mapsLoaded && selectedTrip) {
      // Initialize with default markers
      const sourceMarker = {
        position: { lat: 19.076, lng: 72.8777 },
        title: "Source: Mumbai",
        type: "source",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: "#3b82f6",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
          scale: 8,
        },
      };

      const destinationMarker = {
        position: { lat: 28.6139, lng: 77.209 },
        title: "Destination: Delhi",
        type: "destination",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: "#10b981",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
          scale: 8,
        },
      };

      setMarkers([sourceMarker, destinationMarker]);
      setMapCenter({ lat: 23.344, lng: 75.014 }); // Center between Mumbai and Delhi
    }
  }, [mapsLoaded, selectedTrip]);

  // Format time
  const formatTime = (timestamp) => {
    if (!timestamp) return "--:--";
    return new Date(timestamp).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate trip progress
  const getTripProgress = () => {
    const totalCities = 5; // Mumbai, Pune, Indore, Gwalior, Delhi
    const currentCity = Math.min(
      Math.floor(refreshCount / 10),
      totalCities - 1,
    );
    return ((currentCity / (totalCities - 1)) * 100).toFixed(0);
  };

  if (loadError) {
    return (
      <div className="relative w-full max-w-6xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8 text-center">
          <div className="text-red-500 mb-4">
            <Map className="h-12 w-12 mx-auto" />
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
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <Navigation className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                GPS Tracking Dashboard
              </h2>
              <p className="text-blue-100 text-sm">
                Real-time vehicle tracking with SIM-based GPS
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
              <div
                className={`h-2 w-2 rounded-full ${isTracking ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
              ></div>
              <span className="text-white text-sm">
                {isTracking ? "Live Tracking" : "Paused"}
              </span>
            </div>

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

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Trip Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Trip Details Card */}
            {selectedTrip && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedTrip.tripNumber || `TRIP-${selectedTrip.id}`}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                      Active
                    </span>
                    {selectedTrip.vehicleName && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs">
                        GPS
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Route */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Route
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        <div>
                          <div className="text-sm text-gray-900 dark:text-white">
                            From
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedTrip.source || "Mumbai"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-green-500" />
                        <div>
                          <div className="text-sm text-gray-900 dark:text-white">
                            To
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedTrip.destination || "Delhi"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle & Driver */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Vehicle & Driver
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-900 dark:text-white">
                            Vehicle
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedTrip.vehicleName ||
                              selectedTrip.vehicle ||
                              "Truck 001"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-900 dark:text-white">
                            Driver
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedTrip.driverName ||
                              selectedTrip.driver ||
                              "Rajesh Kumar"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>Trip Progress</span>
                      <span>{getTripProgress()}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500"
                        style={{ width: `${getTripProgress()}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Estimated arrival: 4 hours 30 minutes
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tracking Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tracking Controls
              </h3>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <button
                    onClick={toggleTracking}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 ${
                      isTracking
                        ? "bg-red-100 hover:bg-red-200 text-red-700"
                        : "bg-green-100 hover:bg-green-200 text-green-700"
                    }`}
                  >
                    {isTracking ? (
                      <>
                        <Square className="h-4 w-4" />
                        Stop Tracking
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Start Tracking
                      </>
                    )}
                  </button>
                  <button
                    onClick={refreshData}
                    className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg"
                    title="Refresh data"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm">
                    <Shield className="h-4 w-4 inline mr-1" />
                    SOS
                  </button>
                  <button className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm">
                    <Fuel className="h-4 w-4 inline mr-1" />
                    Fuel Report
                  </button>
                </div>
              </div>
            </div>

            {/* Map Legend */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Map Legend
              </h3>
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
                  <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Live Vehicle
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-1 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Travel Path
                  </span>
                </div>
              </div>
            </div>

            {/* Active Trips */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Active Trips ({trips.length})
              </h3>
              <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                {trips.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTrip(t)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedTrip?.id === t.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {t.tripNumber || `TRIP-${t.id}`}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t.source} → {t.destination}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {t.vehicleName && (
                          <Satellite className="h-4 w-4 text-blue-500" />
                        )}
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Columns - Map & Live Data */}
          <div className="lg:col-span-3">
            {/* Map Container */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 h-[400px] mb-6 relative overflow-hidden">
              {!mapsLoaded ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                      Loading Google Maps...
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
                  {/* Source and Destination Markers */}
                  {markers.map((marker, index) => (
                    <Marker
                      key={index}
                      position={marker.position}
                      title={marker.title}
                      icon={marker.icon}
                      onClick={() => setSelectedMarker(marker)}
                      animation={
                        marker.type === "live_position" && window.google
                          ? window.google.maps.Animation.BOUNCE
                          : null
                      }
                    />
                  ))}
                  {/* Travel Path Polyline */}
                  {polylines.map((polyline, index) => (
                    <Polyline
                      key={index}
                      path={polyline.path}
                      options={polyline.options}
                    />
                  ))}

                  {/* Info Window for Selected Marker */}
                  {/* Info Window for Selected Marker */}
                  {selectedMarker &&
                    selectedMarker.type === "live_position" &&
                    window.google && (
                      <InfoWindow
                        position={selectedMarker.position}
                        onCloseClick={() => setSelectedMarker(null)}
                      >
                        <div className="p-2 max-w-xs">
                          <h4 className="font-semibold text-gray-900">
                            {selectedMarker.title}
                          </h4>
                          {selectedMarker.data && (
                            <div className="mt-2 text-sm text-gray-600 space-y-1">
                              <div>Speed: {selectedMarker.data.speed} km/h</div>
                              <div>Battery: {selectedMarker.data.battery}%</div>
                              <div>
                                Time:{" "}
                                {formatTime(selectedMarker.data.timestamp)}
                              </div>
                              <div>{selectedMarker.data.address}</div>
                            </div>
                          )}
                        </div>
                      </InfoWindow>
                    )}
                </GoogleMap>
              )}

              {/* Map Controls */}
              <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
                <button
                  onClick={fitToRoute}
                  className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Fit route to view"
                >
                  <Route className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => {
                    if (trackingData && mapRef.current) {
                      mapRef.current.panTo({
                        lat: trackingData.latitude,
                        lng: trackingData.longitude,
                      });
                      mapRef.current.setZoom(15);
                    }
                  }}
                  className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Center on vehicle"
                >
                  <Navigation className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </button>
                <button
                  onClick={handleZoomIn}
                  className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Zoom in"
                >
                  <ZoomIn className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Zoom out"
                >
                  <ZoomOut className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Live Data & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Live Telemetry */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Live Telemetry
                </h3>
                <div className="space-y-4">
                  {/* Speed and Direction Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                        {trackingData?.speed || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Speed (km/h)
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                        {trackingData?.bearing || 0}°
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Direction
                      </div>
                    </div>
                  </div>

                  {/* Status Bars */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span>Battery</span>
                        <span>{trackingData?.batteryLevel || 0}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            trackingData?.batteryLevel > 60
                              ? "bg-green-500"
                              : trackingData?.batteryLevel > 30
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{
                            width: `${trackingData?.batteryLevel || 0}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span>Fuel</span>
                        <span>{trackingData?.fuelLevel || 0}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-yellow-500"
                          style={{ width: `${trackingData?.fuelLevel || 0}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span>Signal</span>
                        <span>{trackingData?.signalStrength || 0} dB</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4].map((bar) => (
                          <div
                            key={bar}
                            className={`flex-1 rounded-full ${
                              bar <=
                              Math.min(
                                4,
                                ((trackingData?.signalStrength || -100) + 100) /
                                  25,
                              )
                                ? "bg-blue-500"
                                : "bg-gray-300 dark:bg-gray-600"
                            }`}
                            style={{ height: `${bar * 4}px` }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Device Status */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Device Status
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wifi className="h-4 w-4 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Connection
                      </span>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Strong
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-red-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Temperature
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {trackingData?.temperature || 0}°C
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Fuel className="h-4 w-4 text-orange-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Fuel Level
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {trackingData?.fuelLevel || 0}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Radio className="h-4 w-4 text-blue-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Satellites
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {trackingData?.satelliteCount || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Accuracy
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ±{trackingData?.accuracy || 0}m
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trip Statistics */}
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Trip Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {trackingData?.odometer ? trackingData.odometer - 15670 : 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Distance Traveled
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.floor((refreshCount * 5) / 60)}h{" "}
                    {(refreshCount * 5) % 60}m
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Travel Time
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {(trackingData?.speed || 0) - 15}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Avg Speed (km/h)
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {getTripProgress()}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Progress
                  </div>
                </div>
              </div>
            </div>

            {/* Device Information */}
            <div className="mt-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Radio className="h-3 w-3" />
                    <span>IMEI: {trackingData?.imei || "35***********13"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wifi className="h-3 w-3" />
                    <span>
                      SIM: {trackingData?.simNumber || "+91********10"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span>Device: {trackingData?.deviceId || "GPS-001"}</span>
                  <span className="ml-4">Zoom: {zoom}x</span>
                  <span className="ml-4">Demo Mode</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripMapViewSim;
