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
  Users,
  Wifi,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import apiClient from "../../../api/apiClient";
import { useGoogleMaps } from "../../../hooks/useGoogleMaps";

const TripMapViewSim = ({ trip, trips = [], onClose }) => {
  const [selectedTrip, setSelectedTrip] = useState(trip || trips[0]);
  const [trackingData, setTrackingData] = useState(null);
  const [tripDetails, setTripDetails] = useState(null);
  const [isTracking, setIsTracking] = useState(true);
  const [refreshCount, setRefreshCount] = useState(0);
  const [zoom, setZoom] = useState(10);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
  const [markers, setMarkers] = useState([]);
  const [polylines, setPolylines] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [trackingHistory, setTrackingHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mapRef = useRef(null);
  const { isLoaded: mapsLoaded, loadError } = useGoogleMaps();

  // Fetch trip tracking data
  const fetchTripData = async (tripId) => {
    if (!tripId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/api/trip/tripSimTrackingStatus`, {
        params: { id: tripId },
      });

      if (response?.statusFlag === "Ok" && response?.status) {
        const tripData = response.paramObjectsMap?.trip;
        setTripDetails(tripData);

        // Extract tracking data from currentLocation

        console.log("tripData", tripData);
        const currentLoc = tripData?.currentLocation;
        if (currentLoc?.status === "success" && currentLoc.loc) {
          const trackingInfo = {
            latitude: currentLoc.loc[0],
            longitude: currentLoc.loc[1],
            timestamp: currentLoc.time_recorded,
            address: currentLoc.address,
            totalDistance: currentLoc.total_distance || 0,
            distanceTraveled: currentLoc.distance_travel || 0,
            eta: currentLoc.eta,
            tripTrackId: tripData.tripTrackId,
            etaHrs: currentLoc.eta_hrs,
            deviceId: tripData.vehicle || "GPS-001",
            phoneNumber: currentLoc.tel ? `+91${currentLoc.tel}` : null,
            // Default values (can be enhanced with actual telemetry data)
            speed: 45, // Default speed, can be calculated from distance/time
            bearing: 0, // Default bearing
            batteryLevel: 85, // Default battery
            signalStrength: -75,
            accuracy: 10,
            ignition: true,
            fuelLevel: 65,
            temperature: 28,
            odometer: 15670,
            movement: true,
            satelliteCount: 9,
            simNumber: currentLoc.tel
              ? `+91${currentLoc.tel}`
              : "+919876543210",
            imei: "356789101112131",
          };

          setTrackingData(trackingInfo);

          // Add to tracking history
          if (trackingInfo.latitude && trackingInfo.longitude) {
            setTrackingHistory((prev) => [
              ...prev.slice(-50),
              {
                lat: trackingInfo.latitude,
                lng: trackingInfo.longitude,
                timestamp: trackingInfo.timestamp,
                address: trackingInfo.address,
              },
            ]);
          }

          // Update map markers
          updateMapMarkers(trackingInfo, tripData);
        }
      } else {
        setError("Failed to fetch trip data");
      }
    } catch (err) {
      setError("Error fetching trip data");
      console.error("Trip data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update map markers with real data
  const updateMapMarkers = (trackingInfo, tripData) => {
    if (!trackingInfo?.latitude || !trackingInfo?.longitude) return;

    const position = {
      lat: trackingInfo.latitude,
      lng: trackingInfo.longitude,
    };

    // Update live position marker
    const liveMarker = {
      position,
      title: `Live Position: ${tripData?.vehicle || "Vehicle"}`,
      type: "live_position",
      icon: {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
        <!-- Truck Body -->
        <path d="M14,38 L14,24 L34,24 L34,38" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2" stroke-linejoin="round"/>
        
        <!-- Truck Cabin -->
        <path d="M34,24 L44,24 L44,32 L40,32 L40,38 L34,38" fill="#2563eb" stroke="#1d4ed8" stroke-width="2" stroke-linejoin="round"/>
        
        <!-- Windows -->
        <path d="M36,26 L42,26 L42,30 L36,30 Z" fill="#dbeafe" stroke="#1d4ed8" stroke-width="1"/>
        
        <!-- Wheels -->
        <circle cx="18" cy="38" r="6" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
        <circle cx="18" cy="38" r="3" fill="#64748b"/>
        <circle cx="38" cy="38" r="6" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
        <circle cx="38" cy="38" r="3" fill="#64748b"/>
        
        <!-- Light on top -->
        <circle cx="43" cy="22" r="2" fill="#fbbf24" stroke="#f59e0b" stroke-width="1"/>
        
        <!-- Pulsing animation -->
        <circle cx="24" cy="24" r="12" fill="none" stroke="#3b82f6" stroke-width="2" stroke-opacity="0.3">
          <animate attributeName="r" from="12" to="24" dur="1.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        
        <!-- Optional: Add bearing/direction indicator -->
        <path d="M24,14 L24,8 M24,40 L24,34 M14,24 L8,24 M40,24 L34,24" 
              stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.7">
          <animateTransform 
            attributeName="transform" 
            attributeType="XML" 
            type="rotate"
            from="0 24 24" 
            to="${trackingInfo.bearing || 0} 24 24" 
            dur="0.5s" 
            fill="freeze"
          />
        </path>
      </svg>
    `)}`,
        scaledSize: window.google
          ? new window.google.maps.Size(50, 50)
          : { width: 50, height: 50 },
        anchor: window.google
          ? new window.google.maps.Point(24, 24)
          : { x: 24, y: 24 },
        rotation: trackingInfo.bearing || 0, // Optional: rotate truck based on bearing
      },
      data: {
        speed: trackingInfo.speed,
        bearing: trackingInfo.bearing,
        battery: trackingInfo.batteryLevel,
        timestamp: trackingInfo.timestamp,
        address: trackingInfo.address,
        driver: tripData?.driver,
        vehicle: tripData?.vehicle,
      },
    };

    // Create source and destination markers
    const sourceMarker = {
      position: {
        lat: parseFloat(tripData?.sourceLat) || 13.0843007,
        lng: parseFloat(tripData?.sourceLng) || 80.2704622,
      },
      title: `Source: ${tripData?.source || "Chennai"}`,
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
      position: {
        lat: parseFloat(tripData?.destinationLat) || 9.9252007,
        lng: parseFloat(tripData?.destinationLng) || 78.1197754,
      },
      title: `Destination: ${tripData?.destination || "Madurai"}`,
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

    // Create polyline from source to destination with current location
    if (sourceMarker.position && destinationMarker.position) {
      const path = [
        sourceMarker.position,
        position,
        destinationMarker.position,
      ];
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

  // Calculate trip progress based on actual distance
  const getTripProgress = () => {
    if (!tripDetails?.distance || !trackingData?.distanceTraveled) {
      return Math.min(refreshCount * 2, 100); // Fallback to mock progress
    }

    const totalDistance = parseFloat(tripDetails.distance);
    const traveled = parseFloat(trackingData.distanceTraveled);

    if (totalDistance > 0) {
      const progress = (traveled / totalDistance) * 100;
      return Math.min(Math.max(progress, 0), 100).toFixed(0);
    }

    return 0;
  };

  // Calculate estimated time remaining
  const getETA = () => {
    if (trackingData?.eta) {
      const etaDate = new Date(trackingData.eta);
      const now = new Date();
      const diffMs = etaDate - now;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      if (diffHours > 0) {
        return `${diffHours}h ${diffMinutes}m`;
      }
      return `${diffMinutes} minutes`;
    }

    if (trackingData?.etaHrs) {
      const hours = parseFloat(trackingData.etaHrs);
      if (hours > 0) {
        const wholeHours = Math.floor(hours);
        const minutes = Math.round((hours - wholeHours) * 60);
        if (wholeHours > 0) {
          return `${wholeHours}h ${minutes}m`;
        }
        return `${minutes} minutes`;
      }
    }

    return "Calculating...";
  };

  // Start/stop tracking
  const toggleTracking = () => {
    setIsTracking(!isTracking);
  };

  // Refresh data
  const refreshData = () => {
    if (selectedTrip?.id) {
      fetchTripData(selectedTrip.id);
      setRefreshCount((prev) => prev + 1);
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
  const fitToRoute = () => {
    if (mapRef.current && markers.length > 0 && window.google) {
      const bounds = new window.google.maps.LatLngBounds();
      markers.forEach((marker) => {
        bounds.extend(marker.position);
      });

      if (trackingHistory.length > 0) {
        trackingHistory.forEach((point) => {
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

  // Format time
  const formatTime = (timestamp) => {
    if (!timestamp) return "--:--";
    return new Date(timestamp).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleWhatsAppShare = () => {
    console.log("trackingData", trackingData);

    // Check if trackingData and tripTrackId exist
    if (!trackingData || !trackingData.tripTrackId) {
      console.error("No tripTrackId available in trackingData");
      alert(
        "Trip tracking data is not available yet. Please wait for the data to load.",
      );
      return;
    }

    // Construct share URL using tripTrackId from trackingData
    const shareUrl = `https://dashboard.traqo.in/share_trip/?q=${trackingData.tripTrackId}`;

    // Create a more detailed message using available data
    const vehicleName = trackingData.deviceId || "Vehicle";
    const locationInfo = trackingData.address
      ? `\n📍 Current Location: ${trackingData.address}`
      : "";
    const timestamp = trackingData.timestamp
      ? `\n🕐 Last Updated: ${new Date(trackingData.timestamp).toLocaleTimeString()}`
      : "";

    const message = `🚗 Live GPS Tracking\n\nVehicle: ${vehicleName}${locationInfo}${timestamp}\n\nTrack live location here:\n${shareUrl}`;

    // Encode the message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message);

    // Open WhatsApp with the share URL
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Auto-refresh every 30 seconds when tracking
  useEffect(() => {
    if (isTracking && selectedTrip?.id) {
      const interval = setInterval(() => {
        fetchTripData(selectedTrip.id);
        setRefreshCount((prev) => prev + 1);
      }, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isTracking, selectedTrip]);

  // Initialize when component mounts or selectedTrip changes
  useEffect(() => {
    if (selectedTrip?.id) {
      fetchTripData(selectedTrip.id);
    }
  }, [selectedTrip]);

  // Initialize map when maps are loaded
  useEffect(() => {
    if (mapsLoaded && selectedTrip && window.google) {
      // Center map based on trip data
      const sourceLat = parseFloat(selectedTrip.sourceLat) || 13.0843007;
      const sourceLng = parseFloat(selectedTrip.sourceLng) || 80.2704622;
      const destLat = parseFloat(selectedTrip.destinationLat) || 9.9252007;
      const destLng = parseFloat(selectedTrip.destinationLng) || 78.1197754;

      // Calculate center point
      const centerLat = (sourceLat + destLat) / 2;
      const centerLng = (sourceLng + destLng) / 2;

      setMapCenter({ lat: centerLat, lng: centerLng });
    }
  }, [mapsLoaded, selectedTrip]);

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
            {/* WhatsApp Share Button */}
            <button
              onClick={handleWhatsAppShare}
              className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              title="Share trip via WhatsApp"
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411" />
              </svg>
            </button>

            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
              <div
                className={`h-2 w-2 rounded-full ${isTracking ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
              ></div>
              <span className="text-white text-sm">
                {isTracking ? "Live Tracking" : "Paused"}
              </span>
            </div>

            {loading && (
              <div className="text-white text-sm">
                <RefreshCw className="h-4 w-4 animate-spin inline mr-1" />
                Updating...
              </div>
            )}

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
            {tripDetails && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {tripDetails.tripNumber || `TRIP-${tripDetails.id}`}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        tripDetails.status === "scheduled"
                          ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                          : tripDetails.status === "in_progress"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                            : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                      }`}
                    >
                      {tripDetails.status?.toUpperCase() || "ACTIVE"}
                    </span>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs">
                      GPS
                    </span>
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
                            {tripDetails.source || "Chennai"}
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
                            {tripDetails.destination || "Madurai"}
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
                            {tripDetails.vehicle || "TN10TG8767"}
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
                            {tripDetails.driver || "Ram Kumar"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-900 dark:text-white">
                            Customer
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {tripDetails.customer || "BACARDI IND PVT LTD"}
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
                      Distance: {trackingData?.distanceTraveled || 0} km /{" "}
                      {tripDetails?.distance || 456} km
                      <br />
                      ETA: {getETA()} remaining
                    </div>
                  </div>

                  {/* Trip Info */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">
                          Start
                        </div>
                        <div className="text-gray-900 dark:text-white">
                          {formatDate(tripDetails.startDate)}{" "}
                          {tripDetails.startTime?.substring(0, 5)}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">
                          Est. Duration
                        </div>
                        <div className="text-gray-900 dark:text-white">
                          {tripDetails.estimatedDuration}
                        </div>
                      </div>
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
                    disabled={loading}
                    className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg disabled:opacity-50"
                    title="Refresh data"
                  >
                    <RefreshCw
                      className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
                    />
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
            {trips.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Active Trips ({trips.length})
                </h3>
                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                  {trips.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        setSelectedTrip(t);
                        fetchTripData(t.id);
                      }}
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
                          {t.vehicle && (
                            <Satellite className="h-4 w-4 text-blue-500" />
                          )}
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              t.status === "scheduled"
                                ? "bg-yellow-100 text-yellow-800"
                                : t.status === "in_progress"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {t.status?.replace("_", " ") || "Active"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Columns - Map & Live Data */}
          <div className="lg:col-span-3">
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center text-red-700 dark:text-red-400">
                  <span className="mr-2">⚠️</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

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
                              <div>Vehicle: {selectedMarker.data.vehicle}</div>
                              <div>Driver: {selectedMarker.data.driver}</div>
                              <div>Speed: {selectedMarker.data.speed} km/h</div>
                              <div>Battery: {selectedMarker.data.battery}%</div>
                              <div>
                                Last Updated:{" "}
                                {formatTime(selectedMarker.data.timestamp)}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {selectedMarker.data.address}
                              </div>
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
                      setZoom(15);
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

              {/* Location Info Overlay */}
              {trackingData && (
                <div className="absolute top-4 left-4 max-w-sm bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-10">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Current Location
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {trackingData.address || "Location not available"}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Updated: {formatTime(trackingData.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Trip Statistics */}
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Trip Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {trackingData?.distanceTraveled || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Distance Traveled (km)
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {tripDetails?.distance || 456}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Distance (km)
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
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {getETA()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Estimated Time Remaining
                  </div>
                </div>
              </div>
            </div>

            {/* Device Information */}
            <div className="mt-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between text-sm text-gray-600 dark:text-gray-400 gap-2">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Radio className="h-3 w-3" />
                    <span>IMEI: {trackingData?.imei || "35***********13"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wifi className="h-3 w-3" />
                    <span>
                      SIM:{" "}
                      {trackingData?.simNumber ||
                        trackingData?.phoneNumber ||
                        "+91********10"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="h-3 w-3" />
                    <span>Vehicle: {tripDetails?.vehicle || "TN10TG8767"}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span>Device: {trackingData?.deviceId || "GPS-001"}</span>
                  <span className="ml-4">Zoom: {zoom}x</span>
                  <span className="ml-4">Last Refresh: {refreshCount}</span>
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
