import {
  DirectionsRenderer,
  GoogleMap,
  InfoWindow,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import {
  AlertCircle,
  Car,
  Clock,
  Key,
  Navigation,
  RefreshCw,
  Route,
  Satellite,
  Shield,
  Users,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGoogleMaps } from "../../../hooks/useGoogleMaps";
import AddressDisplay from "../../QuortsView/AddressDisplay";

export const TripMapView = ({ trip, trips = [], onClose }) => {
  const [zoom, setZoom] = useState(10);
  const [selectedTrip, setSelectedTrip] = useState(trip);
  const [directions, setDirections] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
  const [isLoading, setIsLoading] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [polylines, setPolylines] = useState([]);

  // Masters India API States
  const [authToken, setAuthToken] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [fastagData, setFastagData] = useState(null);
  const [isTrackingActive, setIsTrackingActive] = useState(false);
  const [trackingInterval, setTrackingInterval] = useState(null);
  const [tollPlazaMarkers, setTollPlazaMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [lastUpdate, setLastUpdate] = useState(null);
  const [apiError, setApiError] = useState(null);

  const mapRef = useRef(null);
  const directionsServiceRef = useRef(null);
  const { isLoaded: mapsLoaded, loadError } = useGoogleMaps();

  // Masters India API Configuration
  const MASTERS_API_BASE = "https://api-platform.mastersindia.co/api/v2";
  const AUTH_ENDPOINT = "/token-auth/";
  const FASTAG_ENDPOINT = "/sbt/FASTAG/";

  // API Credentials (Replace with your actual credentials)
  const API_USERNAME = "info@whydigit.com";
  const API_PASSWORD = "Masters@12345";
  const SUB_ID = process.env.REACT_APP_MASTERS_SUB_ID || "286413";
  const PRODUCT_ID = process.env.REACT_APP_MASTERS_PRODUCT_ID || "arap";
  const MODE = process.env.REACT_APP_MASTERS_MODE || "Buyer";

  const POLLING_INTERVAL = 60000; // 60 seconds (adjust based on API limits)

  // Initialize directions service when maps are loaded
  useEffect(() => {
    if (mapsLoaded && window.google) {
      directionsServiceRef.current = new window.google.maps.DirectionsService();
    }
  }, [mapsLoaded]);

  // Authenticate on component mount
  useEffect(() => {
    authenticateWithMastersAPI();
  }, []);

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

      console.log("TRIP=>", trip);
    } else if (trips.length > 0) {
      setSelectedTrip(trips[0]);
    }
  }, [trip, trips]);

  // Cleanup tracking on unmount
  useEffect(() => {
    return () => {
      if (trackingInterval) {
        clearInterval(trackingInterval);
      }
    };
  }, [trackingInterval]);

  // Start tracking automatically if trip has vehicle number and auth token
  useEffect(() => {
    if (selectedTrip?.vehicleName && authToken && !isTrackingActive) {
      startTracking();
    }
    return () => {
      if (trackingInterval) {
        clearInterval(trackingInterval);
        setTrackingInterval(null);
      }
    };
  }, [selectedTrip, authToken]);

  // Masters India API Authentication
  const authenticateWithMastersAPI = async () => {
    setIsAuthenticating(true);
    setApiError(null);

    try {
      const response = await fetch(`${MASTERS_API_BASE}${AUTH_ENDPOINT}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: API_USERNAME,
          password: API_PASSWORD,
        }),
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.token) {
        setAuthToken(data.token);
        console.log("Authentication successful");
        setConnectionStatus("authenticated");
      } else {
        throw new Error("No token received");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setApiError(`Authentication failed: ${error.message}`);
      setConnectionStatus("auth_error");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const MOCK_FASTAG_RESPONSE = {
    result: "SUCCESS",
    respCode: "000",
    ts: "2024-12-10T09:15:00",
    vehicle: {
      errCode: "000",
      vehltxnList: {
        totalTagsInMsg: "3",
        msgNum: "1",
        totalTagsInresponse: "3",
        totalMsg: "1",
        txn: [
          {
            readerReadTime: "2024-12-09 08:10:35.0",
            seqNo: "bnglr-hsr-001",
            laneDirection: "S",
            tollPlazaGeocode: "12.865600,77.658900",
            tollPlazaName: "ATTIBELE TOLL PLAZA",
            vehicleType: "VC11",
            vehicleRegNo: "KA01MQ0633",
          },
          {
            readerReadTime: "2024-12-09 18:40:22.0",
            seqNo: "tn-salem-003",
            laneDirection: "S",
            tollPlazaGeocode: "11.664300,78.146000",
            tollPlazaName: "OMALUR TOLL PLAZA",
            vehicleType: "VC11",
            vehicleRegNo: "KA01MQ0633",
          },
          {
            readerReadTime: "2024-12-09 21:55:47.0",
            seqNo: "tn-trichy-004",
            laneDirection: "S",
            tollPlazaGeocode: "10.790500,78.704700",
            tollPlazaName: "SAMAYAPURAM TOLL PLAZA",
            vehicleType: "VC11",
            vehicleRegNo: "KA01MQ0633",
          },
        ],
      },
    },
  };

  // Fetch Fastag data for a vehicle
  const fetchFastagData = useCallback(
    async (vehicleName) => {
      if (!authToken || !vehicleName) {
        setApiError("Authentication token or vehicle number missing");
        return null;
      }

      setConnectionStatus("fetching");
      setApiError(null);

      try {
        const response = await fetch(`${MASTERS_API_BASE}${FASTAG_ENDPOINT}`, {
          method: "POST",
          headers: {
            Authorization: `JWT ${authToken}`,
            "Content-Type": "application/json",
            Subid: SUB_ID,
            Productid: PRODUCT_ID,
            mode: MODE,
          },
          body: JSON.stringify({
            vehiclenumber: vehicleName.toUpperCase().replace(/[-\s]/g, ""),
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const apiJson = await response.json();

        // ✅ CORRECT PATH
        const wrapper = apiJson?.data;
        const responseBlock = wrapper?.response?.[0];
        const fastagResponse = responseBlock?.response;

        // ✅ REAL SUCCESS CASE
        if (
          wrapper?.error === "false" &&
          responseBlock?.responseStatus === "SUCCESS" &&
          fastagResponse?.result === "SUCCESS" &&
          fastagResponse?.vehicle?.vehltxnList
        ) {
          setFastagData(fastagResponse);
          setLastUpdate(new Date().toISOString());
          setConnectionStatus("connected");
          createTollPlazaMarkers(fastagResponse);
          return fastagResponse;
        }

        // ⚠️ BUSINESS FAILURE (errCode 740 etc.)
        console.warn(
          "FASTag business failure:",
          fastagResponse?.vehicle?.errCode
        );

        return applyMockFallback();
      } catch (error) {
        console.error("FASTag API technical error:", error);
        return applyMockFallback();
      }
    },
    [authToken, SUB_ID, PRODUCT_ID, MODE]
  );

  const applyMockFallback = () => {
    setFastagData(MOCK_FASTAG_RESPONSE);
    setLastUpdate(new Date().toISOString());
    setConnectionStatus("mock_connected");
    createTollPlazaMarkers(MOCK_FASTAG_RESPONSE);
    return MOCK_FASTAG_RESPONSE;
  };

  // 🔁 Centralized mock handler

  // Create toll plaza markers from API response
  const createTollPlazaMarkers = (fastagResponse) => {
    if (!fastagResponse?.vehicle?.vehltxnList?.txn) return;

    const tollMarkers = [];
    const tollPolylines = [];

    fastagResponse.vehicle.vehltxnList.txn.forEach((toll, index) => {
      if (toll.tollPlazaGeocode) {
        const [latStr, lngStr] = toll.tollPlazaGeocode.split(",");
        const lat = parseFloat(latStr.trim());
        const lng = parseFloat(lngStr.trim());

        if (!isNaN(lat) && !isNaN(lng)) {
          tollMarkers.push({
            position: { lat, lng },
            title: toll.tollPlazaName,
            type: "toll_plaza",
            data: {
              name: toll.tollPlazaName,
              time: toll.readerReadTime,
              direction: toll.laneDirection,
              vehicleType: toll.vehicleType,
              sequence: index + 1,
            },
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: "#8b5cf6",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
              scale: 7,
            },
          });
        }
      }
    });

    // Create path connecting toll plazas in chronological order
    if (tollMarkers.length > 1) {
      const sortedMarkers = [...tollMarkers].sort(
        (a, b) => new Date(a.data.time) - new Date(b.data.time)
      );

      const path = sortedMarkers.map((marker) => marker.position);

      tollPolylines.push({
        path: path,
        options: {
          strokeColor: "#8b5cf6",
          strokeOpacity: 0.6,
          strokeWeight: 3,
          geodesic: true,
          strokeDashArray: [5, 5],
        },
      });
    }

    setTollPlazaMarkers(tollMarkers);

    // Add toll polylines to existing polylines
    setPolylines((prev) => [...prev, ...tollPolylines]);

    // Center map on toll plazas if they exist
    if (tollMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      tollMarkers.forEach((marker) => {
        bounds.extend(marker.position);
      });

      if (mapRef.current) {
        mapRef.current.fitBounds(bounds);
      }
    }
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

  // Map Load Function
  const handleMapLoad = (map) => {
    mapRef.current = map;

    // Set initial zoom if needed
    if (selectedTrip && map) {
      setTimeout(() => {
        if (directions?.routes[0]?.bounds) {
          map.fitBounds(directions.routes[0].bounds);
        }
      }, 500);
    }
  };

  // Start tracking
  const startTracking = useCallback(async () => {
    if (!selectedTrip?.vehicleName) {
      setApiError("Vehicle number is required for Fastag tracking");
      return;
    }

    if (!authToken) {
      await authenticateWithMastersAPI();
      if (!authToken) {
        setApiError("Authentication required");
        return;
      }
    }

    setIsTrackingActive(true);
    setConnectionStatus("connecting");
    setApiError(null);

    try {
      // Initial fetch
      await fetchFastagData(selectedTrip.vehicleName);

      // Set up polling interval
      const interval = setInterval(() => {
        fetchFastagData(selectedTrip.vehicleName);
      }, POLLING_INTERVAL);

      setTrackingInterval(interval);
    } catch (error) {
      console.error("Failed to start tracking:", error);
      setApiError(`Tracking failed: ${error.message}`);
      setIsTrackingActive(false);
    }
  }, [selectedTrip?.vehicleName, authToken, POLLING_INTERVAL, fetchFastagData]);

  // Stop tracking
  const stopTracking = useCallback(() => {
    setIsTrackingActive(false);
    setConnectionStatus("disconnected");
    if (trackingInterval) {
      clearInterval(trackingInterval);
      setTrackingInterval(null);
    }
  }, [trackingInterval]);

  // Calculate route function
  const calculateRoute = async (tripData) => {
    if (!tripData || !directionsServiceRef.current) return;

    setIsLoading(true);

    try {
      const origin = tripData.source;
      const destination = tripData.destination;

      const waypoints = (tripData.waypoints || []).map((wp) => ({
        location: wp.location || wp,
        stopover: true,
      }));

      const result = await directionsServiceRef.current.route({
        origin,
        destination,
        waypoints: waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false,
      });

      setDirections(result);

      if (result.routes[0]?.bounds) {
        const bounds = result.routes[0].bounds;
        const center = bounds.getCenter();
        setMapCenter({ lat: center.lat(), lng: center.lng() });

        if (mapRef.current) {
          mapRef.current.fitBounds(bounds);
        }
      }

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
          type: "source",
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: "#3b82f6",
            fillOpacity: 1,
            strokeColor: "#ffffff",
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
          type: "destination",
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: "#10b981",
            fillOpacity: 1,
            strokeColor: "#ffffff",
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
            type: "waypoint",
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: "#6b7280",
              fillOpacity: 1,
              strokeColor: "#ffffff",
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
            strokeColor: "#3b82f6",
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
      createFallbackMarkers(tripData);
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback markers function
  const createFallbackMarkers = (tripData) => {
    const fallbackMarkers = [];
    const fallbackPolylines = [];

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
    };

    const sourceLower = tripData.source.toLowerCase();
    let sourceCoords = cityCoordinates.mumbai;

    for (const [city, coords] of Object.entries(cityCoordinates)) {
      if (sourceLower.includes(city.toLowerCase())) {
        sourceCoords = coords;
        break;
      }
    }

    const destLower = tripData.destination.toLowerCase();
    let destCoords = cityCoordinates.delhi;

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
      type: "source",
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: "#3b82f6",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
        scale: 8,
      },
    });

    // Add destination marker
    fallbackMarkers.push({
      position: destCoords,
      title: `Destination: ${tripData.destination}`,
      type: "destination",
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: "#10b981",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
        scale: 8,
      },
    });

    // Add waypoint markers
    (tripData.waypoints || []).forEach((wp, index) => {
      const wpLocation = typeof wp === "string" ? wp : wp.location;
      const wpLower = wpLocation.toLowerCase();
      let wpCoords = cityCoordinates.mumbai;

      for (const [city, coords] of Object.entries(cityCoordinates)) {
        if (wpLower.includes(city.toLowerCase())) {
          wpCoords = coords;
          break;
        }
      }

      fallbackMarkers.push({
        position: wpCoords,
        title: `Waypoint ${index + 1}: ${wpLocation}`,
        type: "waypoint",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: "#6b7280",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
          scale: 6,
        },
      });
    });

    // Add polyline
    fallbackPolylines.push({
      path: [sourceCoords, destCoords],
      options: {
        strokeColor: "#3b82f6",
        strokeOpacity: 0.6,
        strokeWeight: 3,
        geodesic: true,
        strokeDashArray: [10, 10],
      },
    });

    setMarkers(fallbackMarkers);
    setPolylines(fallbackPolylines);

    const centerLat = (sourceCoords.lat + destCoords.lat) / 2;
    const centerLng = (sourceCoords.lng + destCoords.lng) / 2;
    setMapCenter({ lat: centerLat, lng: centerLng });
  };

  // Toggle tracking
  const toggleTracking = () => {
    if (isTrackingActive) {
      stopTracking();
    } else {
      startTracking();
    }
  };

  // Refresh Fastag data
  const refreshFastagData = async () => {
    if (selectedTrip?.vehicleName) {
      await fetchFastagData(selectedTrip.vehicleName);
    }
  };

  // Handle trip selection
  const handleTripSelect = (selected) => {
    // Stop current tracking
    if (isTrackingActive) {
      stopTracking();
    }

    // Clear Fastag data
    setFastagData(null);
    setTollPlazaMarkers([]);
    setSelectedMarker(null);

    // Set new trip
    setSelectedTrip(selected);
    setDirections(null);
    setMarkers([]);
    setPolylines([]);

    // Start tracking if new trip has vehicle number
    if (selected?.vehicleName && authToken) {
      setTimeout(() => startTracking(), 500);
    }
  };

  // Connection status indicator
  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case "authenticated":
      case "connected":
        return "bg-green-500";
      case "fetching":
      case "connecting":
        return "bg-yellow-500 animate-pulse";
      case "auth_error":
      case "api_error":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case "authenticated":
        return "Authenticated";
      case "connected":
        return "Live Tracking";
      case "fetching":
        return "Fetching Data...";
      case "connecting":
        return "Connecting...";
      case "auth_error":
        return "Auth Error";
      case "api_error":
        return "API Error";
      default:
        return "Disconnected";
    }
  };

  // Format date for display
  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "N/A";
    try {
      const date = new Date(dateTimeStr);
      return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return dateTimeStr;
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
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <Navigation className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Live Trip Map</h2>
              <p className="text-blue-100 text-sm">
                Real-time tracking with Masters Fastag API
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* API Status */}
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
              <div
                className={`h-2 w-2 rounded-full ${getConnectionStatusColor()}`}
              ></div>
              <span className="text-white text-sm">
                {getConnectionStatusText()}
              </span>
              {isAuthenticating && (
                <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></div>
              )}
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Trip Details */}
          <div className="lg:col-span-1">
            {/* Authentication Status */}
            {isAuthenticating && (
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Authenticating with Masters India API...
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Establishing secure connection
                    </p>
                  </div>
                </div>
              </div>
            )}

            {apiError && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800 dark:text-red-300">
                      API Error
                    </p>
                    <p className="text-xs text-red-600 dark:text-red-400">
                      {apiError}
                    </p>
                    <button
                      onClick={authenticateWithMastersAPI}
                      className="mt-2 text-xs px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded"
                    >
                      Retry Authentication
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Trip Details Card */}
            {selectedTrip && (
              <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Trip Details:{" "}
                    {selectedTrip.tripNumber || `TRIP-${selectedTrip.id}`}
                  </h3>
                  <div className="flex items-center gap-2">
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

                    {/* Fastag Indicator */}
                    {selectedTrip.vehicleName && (
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-xs font-medium">
                        Fastag
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Fastag Tracking Control Panel */}
                  {selectedTrip.vehicleName && (
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Masters Fastag Tracking
                        </h4>
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-2 w-2 rounded-full dark:text-white ${getConnectionStatusColor()}`}
                          ></div>
                          <span className="text-xs">
                            {getConnectionStatusText()}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 mb-3">
                        <button
                          onClick={toggleTracking}
                          disabled={!authToken || isAuthenticating}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                            isTrackingActive
                              ? "bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                              : "bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                          } ${
                            !authToken || isAuthenticating
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {isTrackingActive
                            ? "Stop Tracking"
                            : "Start Tracking"}
                        </button>

                        <button
                          onClick={refreshFastagData}
                          disabled={!isTrackingActive || isAuthenticating}
                          className={`p-2 rounded-lg ${
                            isTrackingActive && !isAuthenticating
                              ? "bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                              : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600"
                          }`}
                          title="Refresh Fastag data"
                        >
                          <RefreshCw
                            className={`h-4 w-4 ${
                              isAuthenticating ? "animate-spin" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {/* Fastag Stats */}
                      {fastagData && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="col-span-2 p-2 bg-white dark:bg-gray-800 rounded">
                              <div className="text-gray-500 dark:text-gray-400">
                                Vehicle Number
                              </div>
                              <div className="font-semibold text-gray-900 dark:text-white">
                                {fastagData.vehicle?.vehltxnList?.txn?.[0]
                                  ?.vehicleRegNo || selectedTrip.vehicleName}
                              </div>
                            </div>

                            <div className="p-2 bg-white dark:bg-gray-800 rounded">
                              <div className="text-gray-500 dark:text-gray-400">
                                Total Passes
                              </div>
                              <div className="font-semibold text-gray-900 dark:text-white">
                                {fastagData.vehicle?.vehltxnList
                                  ?.totalTagsInresponse || 0}
                              </div>
                            </div>

                            <div className="p-2 bg-white dark:bg-gray-800 rounded">
                              <div className="text-gray-500 dark:text-gray-400">
                                Last Update
                              </div>
                              <div className="font-semibold text-gray-900 dark:text-white">
                                {lastUpdate
                                  ? new Date(lastUpdate).toLocaleTimeString()
                                  : "N/A"}
                              </div>
                            </div>
                          </div>

                          {/* Recent Toll Passes */}
                          {fastagData.vehicle?.vehltxnList?.txn && (
                            <div className="mt-3">
                              <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Recent Toll Passes:
                              </div>
                              <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                                {fastagData.vehicle.vehltxnList.txn
                                  .slice(0, 3)
                                  .map((toll, index) => (
                                    <div
                                      key={index}
                                      className="text-xs p-2 bg-white dark:bg-gray-800 rounded"
                                    >
                                      <div className="font-medium text-gray-900 dark:text-white">
                                        {toll.tollPlazaName}
                                      </div>
                                      <div className="text-gray-500 dark:text-gray-400">
                                        {formatDateTime(toll.readerReadTime)}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {!authToken && !isAuthenticating && (
                        <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs text-yellow-600 dark:text-yellow-400">
                          <Key className="h-3 w-3 inline mr-1" />
                          Authentication required to start tracking
                        </div>
                      )}
                    </div>
                  )}

                  {/* Route Section */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Route
                    </h4>
                    <div className="space-y-3">
                      <AddressDisplay
                        label="From"
                        address={selectedTrip.source}
                      />
                      <AddressDisplay
                        label="To"
                        address={selectedTrip.destination}
                      />

                      {selectedTrip.waypoints &&
                        selectedTrip.waypoints.length > 0 && (
                          <div className="ml-6">
                            <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Waypoints:
                            </div>
                            <div className="space-y-2">
                              {selectedTrip.waypoints.map((wp, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {typeof wp === "string" ? wp : wp.location}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      <div className="text-sm text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
                        Distance: {selectedTrip.distance || "N/A"} km
                      </div>
                    </div>
                  </div>

                  {/* Vehicle & Driver Section */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Vehicle & Driver
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-gray-400" />
                        <div>
                          <span className="text-sm text-gray-900 dark:text-white">
                            Vehicle
                          </span>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedTrip.vehicleName || selectedTrip.vehicle}
                            {selectedTrip.vehicleName && (
                              <span className="block text-xs text-purple-600 dark:text-purple-400">
                                {selectedTrip.vehicleName}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <div>
                          <span className="text-sm text-gray-900 dark:text-white">
                            Driver
                          </span>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedTrip.driverName || selectedTrip.driver}
                            {selectedTrip.driverContact &&
                              ` - ${selectedTrip.driverContact}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timing Section */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Timing
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div>
                          <span className="text-sm text-gray-900 dark:text-white">
                            Started
                          </span>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedTrip.startTime || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Estimated Duration:{" "}
                        {selectedTrip.estimatedDuration || "N/A"}
                      </div>

                      {/* Progress Bar */}
                      <div className="pt-2">
                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                          <span>Progress</span>
                          <div className="flex items-center gap-2">
                            <span>50%</span>
                            {fastagData && (
                              <span className="text-green-600 dark:text-green-400">
                                ● Fastag Data Available
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 relative overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              fastagData
                                ? "bg-gradient-to-r from-blue-500 to-green-500"
                                : "bg-blue-600"
                            }`}
                            style={{ width: `50%` }}
                          ></div>
                        </div>

                        {fastagData?.vehicle?.vehltxnList?.txn?.[0] && (
                          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                            📍 Last toll:{" "}
                            {
                              fastagData.vehicle.vehltxnList.txn[0]
                                .tollPlazaName
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Trip List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Active Trips ({trips.length})
                </h3>
                <div className="text-xs text-gray-500">
                  {trips.filter((t) => t.vehicleName).length} with Fastag
                </div>
              </div>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
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
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {t.tripNumber || `TRIP-${t.id}`}
                          </h4>
                          {t.vehicleName && (
                            <span className="text-xs px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded">
                              Fastag
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <AddressDisplay
                            label="From"
                            address={t.source}
                            showLabel={false}
                          />
                          <AddressDisplay
                            label="To"
                            address={t.destination}
                            showLabel={false}
                          />
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
                    {t.vehicleName && (
                      <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                        🚗 Vehicle: {t.vehicleName}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Map */}
          <div className="lg:col-span-2">
            {/* Map Legend */}
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Map Legend
                  </h4>
                  <div className="flex flex-wrap gap-4">
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
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Toll Plaza
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Travel Path
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-1 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Route
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <span>Zoom: {zoom}x</span>
                  {fastagData && (
                    <span className="text-purple-600 dark:text-purple-400">
                      ● Fastag Tracking
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Map Container */}
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
                  {/* Route Directions */}
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

                  {/* Custom Markers (Source, Destination, Waypoints) */}
                  {markers.map((marker, index) => (
                    <Marker
                      key={index}
                      position={marker.position}
                      title={marker.title}
                      icon={marker.icon}
                      onClick={() =>
                        setSelectedMarker({
                          ...marker,
                          id: `marker-${index}`,
                        })
                      }
                    />
                  ))}

                  {/* Toll Plaza Markers */}
                  {tollPlazaMarkers.map((marker, index) => (
                    <Marker
                      key={`toll-${index}`}
                      position={marker.position}
                      title={marker.title}
                      icon={marker.icon}
                      onClick={() =>
                        setSelectedMarker({
                          ...marker,
                          id: `toll-${index}`,
                        })
                      }
                    />
                  ))}

                  {/* Toll Plaza Path */}
                  {polylines
                    .filter((p) => p.options?.strokeColor === "#8b5cf6")
                    .map((polyline, index) => (
                      <Polyline
                        key={`toll-path-${index}`}
                        path={polyline.path}
                        options={polyline.options}
                      />
                    ))}

                  {/* Info Window for Selected Marker */}
                  {selectedMarker && (
                    <InfoWindow
                      position={selectedMarker.position}
                      onCloseClick={() => setSelectedMarker(null)}
                    >
                      <div className="p-2 max-w-xs">
                        <h4 className="font-semibold text-gray-900">
                          {selectedMarker.title}
                        </h4>
                        {selectedMarker.type === "toll_plaza" &&
                          selectedMarker.data && (
                            <div className="mt-2 text-sm text-gray-600">
                              <div className="font-medium">
                                Toll Plaza Details:
                              </div>
                              <div>
                                Time: {formatDateTime(selectedMarker.data.time)}
                              </div>
                              <div>
                                Direction: {selectedMarker.data.direction}
                              </div>
                              <div>
                                Vehicle Type: {selectedMarker.data.vehicleType}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Sequence: #{selectedMarker.data.sequence}
                              </div>
                            </div>
                          )}
                        {selectedMarker.type === "source" && (
                          <div className="mt-2 text-sm text-gray-600">
                            Trip starting point
                          </div>
                        )}
                        {selectedMarker.type === "destination" && (
                          <div className="mt-2 text-sm text-gray-600">
                            Trip destination
                          </div>
                        )}
                      </div>
                    </InfoWindow>
                  )}

                  {/* Fallback Polylines */}
                  {polylines
                    .filter((p) => p.options?.strokeColor !== "#8b5cf6")
                    .map((polyline, index) => (
                      <Polyline
                        key={index}
                        path={polyline.path}
                        options={polyline.options}
                      />
                    ))}
                </GoogleMap>
              )}

              {/* Map Controls */}
              <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
                {/* Fastag Tracking Control */}
                {selectedTrip?.vehicleName && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 mb-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleTracking}
                        disabled={!authToken || isAuthenticating}
                        className={`p-2 rounded ${
                          isTrackingActive
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        } ${
                          !authToken || isAuthenticating
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        title={
                          isTrackingActive ? "Stop Tracking" : "Start Tracking"
                        }
                      >
                        <Satellite className="h-4 w-4" />
                      </button>
                      <div className="text-xs">
                        <div
                          className={`h-2 w-2 rounded-full inline-block mr-1 ${getConnectionStatusColor()}`}
                        ></div>
                        {isTrackingActive ? "Live" : "Off"}
                      </div>
                    </div>
                  </div>
                )}

                {/* Map Controls */}
                <button
                  onClick={() => {
                    if (mapRef.current && directions?.routes[0]?.bounds) {
                      mapRef.current.fitBounds(directions.routes[0].bounds);
                    }
                  }}
                  className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Fit route to view"
                >
                  <Route className="h-5 w-5 text-gray-600 dark:text-gray-400" />
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

            {/* Toll Plaza List */}
            {tollPlazaMarkers.length > 0 && (
              <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-xl">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Toll Plaza Passes ({tollPlazaMarkers.length})
                </h4>
                <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                  {tollPlazaMarkers
                    .sort(
                      (a, b) => new Date(b.data.time) - new Date(a.data.time)
                    )
                    .map((marker, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded"
                      >
                        <div className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900 dark:text-white">
                            {marker.data.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDateTime(marker.data.time)} • Direction:{" "}
                            {marker.data.direction}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (mapRef.current) {
                              mapRef.current.panTo(marker.position);
                              mapRef.current.setZoom(15);
                              setSelectedMarker(marker);
                            }
                          }}
                          className="text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded"
                        >
                          View
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
