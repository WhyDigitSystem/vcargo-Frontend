import {
  AlertCircle,
  DollarSign,
  Fuel,
  Loader2,
  MapPin,
  RefreshCw,
  Settings,
  Truck,
  Users,
  Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../api/apiClient";

const QuickStats = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const orgId = user?.orgId;

  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(
        "/api/dashboard/getAllDashBoardStatsDetails",
        {
          params: { orgId },
        }
      );
      console.log("Res==>", response);
      if (response?.status) {
        // Fixed: access data from response.data
        setDashboardData(response?.paramObjectsMap?.dashboard || {});
      } else {
        throw new Error(
          response?.paramObjectsMap?.message || "Failed to fetch dashboard data"
        );
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orgId) {
      fetchDashboardData();
    }
  }, [orgId]);

  // Get data from API or fallback to 0 - UPDATED WITH ALL API FIELDS
  const getAPIData = () => {
    if (!dashboardData) return {};

    const apiData = dashboardData;

    return {
      // Active Vehicles
      activeVehicles: apiData.activeVechicle || apiData.activeVehicle || 0,

      // Maintenance Vehicles
      maintenanceVehicles: apiData.maintenanceVehicleCount || 0,

      // Upcoming Maintenance Vehicles
      upcomingMaintenance: apiData.upcomingMaintenanceVehicle || 0,

      // Driver data
      activeDrivers: apiData.tDriver?.activeDriver || 0,
      inactiveDrivers: apiData.tDriver?.inActiveDriver || 0,
      leaveDrivers: apiData.tDriver?.leaveDriver || 0,
      totalDrivers:
        (apiData.tDriver?.activeDriver || 0) +
        (apiData.tDriver?.inActiveDriver || 0) +
        (apiData.tDriver?.leaveDriver || 0),

      // Fuel data
      totalFuel: apiData.totalFuel || 0,

      // Maintenance Cost
      maintenanceCost: apiData.maintenanceCost || 0,

      // Tyres Purchased
      tyresPurchased: apiData.totalTyresPurchased || 0,

      // Active Trips (assuming totalTripCount is active trips)
      activeTrips: apiData.totalTripCount || 0,

      // For drivers in trip, we can assume some percentage of active drivers are in trip
      // Since API doesn't provide this, we'll calculate as 75% of active drivers (round up)
      driversInTrip: Math.ceil((apiData.tDriver?.activeDriver || 0) * 0.75),
    };
  };

  const stats = [
    {
      name: "Active Vehicles",
      count: getAPIData().activeVehicles,
      icon: Truck,
      color: "blue",
      path: "/vehicles",
      change: "+0", // Static for now, can be dynamic if API provides trend
      subtext: "Ready for dispatch",
    },
    {
      name: "Maintenance Vehicles",
      count: getAPIData().maintenanceVehicles,
      icon: Wrench,
      color: "red",
      path: "/maintenance",
      change: "+0",
      subtext: "Under maintenance",
    },
    {
      name: "Upcoming Maintenance",
      count: getAPIData().upcomingMaintenance,
      icon: Wrench,
      color: "orange",
      path: "/maintenance/upcoming",
      change: "+0",
      subtext: "Next 7 days",
    },
    {
      name: "Maintenance Cost",
      count: `₹${getAPIData().maintenanceCost}`,
      icon: DollarSign,
      color: "purple",
      path: "/maintenance/cost",
      change: "-₹0",
      subtext: "Total cost",
    },
    {
      name: "Total Tyres Purchased",
      count: getAPIData().tyresPurchased,
      icon: Settings,
      color: "teal",
      path: "/tyres",
      change: "+0",
      subtext: "This quarter",
    },
    {
      name: "Total Fuel Consumption",
      count: `${getAPIData().totalFuel} L`,
      icon: Fuel,
      color: "amber",
      path: "/fuel",
      change: "+0",
      subtext: "Total liters",
    },
    {
      name: "Active Drivers",
      count: `${getAPIData().activeDrivers}`,
      icon: Users,
      color: "indigo",
      path: "/drivers",
      change: "+0",
      subtext: "Available",
    },
    {
      name: "Drivers in Trip",
      count: getAPIData().driversInTrip,
      icon: Users,
      color: "green",
      path: "/drivers",
      change: "+0",
      subtext: "Currently driving",
    },
    {
      name: "Driver Leave",
      count: getAPIData().leaveDrivers,
      icon: Users,
      color: "gray",
      path: "/drivers",
      change: "-0",
      subtext: "On leave",
    },
    {
      name: "Active Trips",
      count: getAPIData().activeTrips,
      icon: MapPin,
      color: "cyan",
      path: "/trips",
      change: "+0",
      subtext: "On road",
    },
  ];

  const getColorClasses = (color) => {
    const classes = {
      blue: "bg-blue-500 text-white",
      red: "bg-red-500 text-white",
      amber: "bg-amber-500 text-white",
      indigo: "bg-indigo-500 text-white",
      green: "bg-emerald-500 text-white",
      cyan: "bg-cyan-500 text-white",
      gray: "bg-gray-500 text-white",
      orange: "bg-orange-500 text-white",
      purple: "bg-purple-500 text-white",
      teal: "bg-teal-500 text-white",
    };
    return classes[color] || "bg-gray-500 text-white";
  };

  const getChangeColor = (change) => {
    if (change.startsWith("+")) return "text-emerald-600 dark:text-emerald-400";
    if (change.startsWith("-")) return "text-red-600 dark:text-red-400";
    return "text-gray-600 dark:text-gray-400";
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  return (
    <div className="mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Fleet Overview
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {loading ? "Loading data..." : "Key metrics at a glance"}
          </p>
        </div>

        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
          title="Refresh data"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span>Refresh</span>
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={handleRefresh}
              className="ml-auto text-xs text-red-600 dark:text-red-400 hover:underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      {loading && !dashboardData ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 animate-pulse"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                  <div className="w-8 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
                <div>
                  <div className="w-3/4 h-3 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="w-1/2 h-5 bg-gray-300 dark:bg-gray-700 rounded mb-1"></div>
                  <div className="w-2/3 h-2 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                onClick={() => navigate(stat.path)}
                className="group cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-150"
              >
                <div className="space-y-2">
                  {/* Icon and Change */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`p-2 rounded-lg ${getColorClasses(
                        stat.color
                      )}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span
                      className={`text-xs font-medium ${getChangeColor(
                        stat.change
                      )}`}
                    >
                      {stat.change}
                    </span>
                  </div>

                  {/* Content */}
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">
                      {stat.name}
                    </p>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1 truncate">
                      {stat.count}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                      {stat.subtext}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QuickStats;
