import {
  Battery,
  Clock,
  Compass,
  Fuel,
  MapPin,
  Radio,
  RefreshCw,
  Satellite,
  Signal,
  Thermometer,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const SimTrackingComponent = ({
  vehicleNumber = "MH12AB1234",
  onPositionUpdate,
  className = "",
  isActive = true,
}) => {
  const [trackingData, setTrackingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  // Generate mock GPS data
  const generateMockData = useCallback(() => {
    // Mumbai to Delhi route simulation
    const baseLat = 19.076 + refreshCount * 0.001;
    const baseLng = 72.8777 + refreshCount * 0.001;

    return {
      latitude: baseLat,
      longitude: baseLng,
      timestamp: new Date().toISOString(),
      speed: Math.floor(Math.random() * 80) + 40,
      bearing: Math.floor(Math.random() * 360),
      batteryLevel: 65 + (refreshCount % 10),
      signalStrength: -80 + Math.floor(Math.random() * 20),
      accuracy: Math.floor(Math.random() * 15) + 5,
      ignition: true,
      fuelLevel: 45 + (refreshCount % 20),
      temperature: 28 + Math.floor(Math.random() * 10),
      odometer: 15670 + refreshCount * 2,
      address: `Express Highway, Kilometer ${120 + refreshCount}`,
      movement: refreshCount > 0,
      satelliteCount: 8 + Math.floor(Math.random() * 4),
      deviceId: "GPS-TRACKER-001",
      simNumber: "+919876543210",
      imei: "356789101112131",
    };
  }, [refreshCount]);

  // Initialize tracking
  const startTracking = useCallback(() => {
    if (!isConnected) {
      setIsLoading(true);
      setTimeout(() => {
        const data = generateMockData();
        setTrackingData(data);
        setIsConnected(true);
        setIsLoading(false);
        onPositionUpdate?.(data);
      }, 800);
    }
  }, [isConnected, generateMockData, onPositionUpdate]);

  // Stop tracking
  const stopTracking = () => {
    setIsConnected(false);
    setTrackingData(null);
  };

  // Refresh data
  const refreshData = () => {
    if (isConnected) {
      setIsLoading(true);
      setTimeout(() => {
        const data = generateMockData();
        setTrackingData(data);
        setRefreshCount((prev) => prev + 1);
        setIsLoading(false);
        onPositionUpdate?.(data);
      }, 500);
    }
  };

  // Auto-start if active
  useEffect(() => {
    if (isActive && !isConnected) {
      startTracking();
    }
  }, [isActive, isConnected, startTracking]);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    if (isConnected && isActive) {
      const interval = setInterval(refreshData, 10000);
      return () => clearInterval(interval);
    }
  }, [isConnected, isActive]);

  // Format time
  const formatTime = (timestamp) => {
    if (!timestamp) return "--:--";
    return new Date(timestamp).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get battery color
  const getBatteryColor = (level) => {
    if (level > 60) return "text-green-500";
    if (level > 30) return "text-yellow-500";
    return "text-red-500";
  };

  // Get signal color
  const getSignalColor = (strength) => {
    if (strength > -70) return "text-green-500";
    if (strength > -85) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Satellite className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                GPS Tracking
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {vehicleNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-gray-400"}`}
            ></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      {!isConnected ? (
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Satellite className="h-8 w-8 text-gray-400" />
          </div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            Tracking Disconnected
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Start tracking to get live location updates
          </p>
          <button
            onClick={startTracking}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Connecting..." : "Start Tracking"}
          </button>
        </div>
      ) : (
        <>
          {/* Live Data */}
          <div className="p-4">
            {/* Location */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current Location
                </span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                <div className="text-sm text-gray-900 dark:text-white font-mono">
                  {trackingData?.latitude?.toFixed(6)},{" "}
                  {trackingData?.longitude?.toFixed(6)}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {trackingData?.address}
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  {/* <Speed className="h-4 w-4 text-blue-500" /> */}
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Speed
                  </span>
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {trackingData?.speed || 0}
                  <span className="text-sm text-gray-500 ml-1">km/h</span>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Compass className="h-4 w-4 text-purple-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Direction
                  </span>
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {trackingData?.bearing || 0}°
                </div>
              </div>
            </div>

            {/* Device Status */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Battery
                    className={`h-4 w-4 ${getBatteryColor(trackingData?.batteryLevel)}`}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Battery
                  </span>
                </div>
                <span
                  className={`text-sm font-medium ${getBatteryColor(trackingData?.batteryLevel)}`}
                >
                  {trackingData?.batteryLevel || 0}%
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Signal
                    className={`h-4 w-4 ${getSignalColor(trackingData?.signalStrength)}`}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Signal
                  </span>
                </div>
                <span
                  className={`text-sm font-medium ${getSignalColor(trackingData?.signalStrength)}`}
                >
                  {trackingData?.signalStrength || 0}dB
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Fuel className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Fuel
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {trackingData?.fuelLevel || 0}%
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Temp
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {trackingData?.temperature || 0}°C
                </span>
              </div>
            </div>

            {/* Last Update */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Last update: {formatTime(trackingData?.timestamp)}
                  </span>
                </div>
                <button
                  onClick={refreshData}
                  disabled={isLoading}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  title="Refresh"
                >
                  <RefreshCw
                    className={`h-4 w-4 text-gray-500 ${isLoading ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex gap-2">
              <button
                onClick={stopTracking}
                className="flex-1 py-2 px-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium text-sm"
              >
                Stop Tracking
              </button>
              <button
                onClick={refreshData}
                disabled={isLoading}
                className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium text-sm disabled:opacity-50"
              >
                Refresh
              </button>
            </div>
          </div>
        </>
      )}

      {/* Footer Info */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Radio className="h-3 w-3" />
            <span>IMEI: {trackingData?.imei?.slice(0, 8)}...</span>
          </div>
          <span>Demo Mode</span>
        </div>
      </div>
    </div>
  );
};

export default SimTrackingComponent;
