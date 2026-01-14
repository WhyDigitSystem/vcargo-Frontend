import {
  AlertCircle,
  ChevronRight,
  FileText,
  Fuel,
  Loader2,
  Map,
  MoreHorizontal,
  RefreshCw,
  Settings,
  Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { dashboardAPI } from "../../../api/dashboardAPI";

const RecentActivities = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("trips");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    trips: [],
    maintenance: [],
    fuel: [],
    invoices: [],
    tyres: [],
  });

  const { user } = useSelector((state) => state.auth);
  const orgId = user.orgId;

  const tabs = [
    { id: "trips", label: "Trips", icon: Map, color: "blue", path: "/trips" },
    {
      id: "maintenance",
      label: "Maintenance",
      icon: Wrench,
      color: "amber",
      path: "/maintenance",
    },
    { id: "fuel", label: "Fuel", icon: Fuel, color: "emerald", path: "/fuel" },
    {
      id: "invoices",
      label: "Invoices",
      icon: FileText,
      color: "purple",
      path: "/invoices",
    },
    {
      id: "tyres",
      label: "Tyres",
      icon: Settings,
      color: "red",
      path: "/tyres",
    },
  ];

  // Fetch data from API
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await dashboardAPI.getAllRecentActivities({ orgId });

      if (response.status) {
        const dashboardData = response.paramObjectsMap.dashboard;

        // Transform API data to match component format
        const transformedData = {
          trips: transformTrips(dashboardData.trips || []),
          maintenance: transformMaintenance(dashboardData.maintenance || []),
          fuel: transformFuel(dashboardData.fuel || []),
          invoices: [], // No invoices in API response, using empty array
          tyres: transformTyres(dashboardData.tyres || []),
        };

        setData(transformedData);
      } else {
        throw new Error(
          response.data.paramObjectsMap?.message || "Failed to fetch data"
        );
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Transform API trips data
  const transformTrips = (apiTrips) => {
    return apiTrips.slice(0, 5).map((trip) => ({
      id: trip.id,
      vehicle: trip.vehicleNo || trip.vehicleNumber || "N/A",
      driver: trip.driverName || "Unknown",
      route: trip.route || "Unknown",
      status: trip.status?.toLowerCase() || "unknown",
      statusText: trip.status || "Unknown",
      time: formatTime(trip.startTime || new Date()),
    }));
  };

  // Transform API maintenance data
  const transformMaintenance = (apiMaintenance) => {
    return apiMaintenance.slice(0, 5).map((main) => {
      const status = main.status?.toLowerCase();

      return {
        id: main.id,
        vehicle: main.vehicleNo || main.vehicleNumber || "N/A",
        type: main.type || "Unknown",
        cost: main.totalCost ? `₹${main.totalCost.toLocaleString()}` : "₹0",
        status: status,
        statusText: status === "completed" ? "Done" : "Pending",
        time: formatTime(main.scheduledDate || new Date()),
        priority: main.priority?.toLowerCase() || "medium",
      };
    });
  };

  // Transform API fuel data
  const transformFuel = (apiFuel) => {
    return apiFuel.slice(0, 5).map((fuel) => ({
      id: fuel.id,
      vehicle: fuel.vehicle || fuel.vehicleNumber || "N/A",
      quantity: `${fuel.quantity}L`,
      total: `₹${fuel.total?.toLocaleString() || "0"}`,
      time: formatTime(fuel.date),
      driver: fuel.driver || "Unknown",
    }));
  };

  // Transform API tyres data
  const transformTyres = (apiTyres) => {
    return apiTyres.slice(0, 5).map((tyre) => {
      let status = "good";
      if (tyre.depth !== undefined) {
        if (tyre.depth < 3) status = "critical";
        else if (tyre.depth < 5) status = "warning";
      }

      return {
        id: tyre.id,
        vehicle: tyre.vehicle || tyre.vehicleNumber || "N/A",
        position: tyre.position || "Unknown",
        depth: `${tyre.depth || 0}mm`,
        status: status,
        statusText:
          status === "good" ? "OK" : status === "warning" ? "Check" : "Replace",
        time: formatTime(tyre.installedDate),
      };
    });
  };

  // Format time function
  const formatTime = (dateString) => {
    if (!dateString) return "Just now";

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) return "Now";
      if (diffMins < 60) return `${diffMins}m`;
      if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;
      return `${Math.floor(diffMins / 1440)}d`;
    } catch (err) {
      return "Now";
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  const getStatusColor = (status, type) => {
    const statusColors = {
      trips: {
        "in-progress": "border-l-blue-500",
        completed: "border-l-emerald-500",
        delayed: "border-l-red-500",
        default: "border-l-gray-400",
      },
      maintenance: {
        completed: "border-l-emerald-500",
        scheduled: "border-l-amber-500",
        pending: "border-l-gray-400",
        default: "border-l-gray-400",
      },
      fuel: {
        default: "border-l-emerald-500",
      },
      tyres: {
        good: "border-l-emerald-500",
        warning: "border-l-amber-500",
        critical: "border-l-red-500",
        default: "border-l-gray-400",
      },
      default: {
        default: "border-l-gray-400",
      },
    };

    return (
      statusColors[type]?.[status] ||
      statusColors[type]?.default ||
      statusColors.default.default
    );
  };

  const renderItem = (item, type) => {
    const currentTab = tabs.find((tab) => tab.id === type);
    const Icon = currentTab.icon;

    return (
      <div
        key={item.id}
        onClick={() => navigate(`/${type}/${item.id}`)}
        className={`group flex items-center gap-3 p-3 border-l-4 ${getStatusColor(
          item.status,
          type
        )} hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer`}
      >
        <div
          className={`p-2 rounded-lg bg-${currentTab.color}-50 dark:bg-${currentTab.color}-900/20`}
        >
          <Icon
            className={`h-4 w-4 text-${currentTab.color}-600 dark:text-${currentTab.color}-400`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
              {item.vehicle}
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
              {item.time}
            </span>
          </div>

          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {type === "trips" && `${item.driver} • ${item.route}`}
              {type === "maintenance" && `${item.type} • ${item.cost}`}
              {type === "fuel" && `${item.quantity} • ${item.total}`}
              {type === "tyres" && `${item.position} • ${item.depth}`}
            </p>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ml-2 ${
                item.status === "completed" || item.status === "good"
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                  : item.status === "warning" || item.status === "pending"
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
              }`}
            >
              {item.statusText}
            </span>
          </div>
        </div>

        <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Header with tabs in same line */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 gap-3">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Recent Activities
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Latest updates across your fleet
              </p>
            </div>

            {/* Mobile: Show More button */}
            <div className="sm:hidden">
              <button className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Tabs - Desktop */}
          <div className="hidden sm:flex items-center gap-1 mt-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const tabData = data[tab.id] || [];
              const count = tabData.length;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? `bg-${tab.color}-100 text-${tab.color}-700 dark:bg-${tab.color}-900/30 dark:text-${tab.color}-300`
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  <span>{tab.label}</span>
                  {count > 0 && (
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? `bg-${tab.color}-200 text-${tab.color}-800 dark:bg-${tab.color}-800/50`
                          : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs - Mobile */}
      <div className="sm:hidden flex items-center gap-1 px-4 pt-2 pb-3 overflow-x-auto border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const tabData = data[tab.id] || [];

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? `bg-${tab.color}-100 text-${tab.color}-700 dark:bg-${tab.color}-900/30 dark:text-${tab.color}-300`
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Icon className="h-3 w-3" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-2">
        {loading && !data[activeTab]?.length ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Loading {tabs.find((t) => t.id === activeTab)?.label}{" "}
                activities...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8 text-center px-4">
            <AlertCircle className="h-8 w-8 text-red-500 mb-3" />
            <p className="text-red-600 dark:text-red-400 text-sm mb-2">
              {error}
            </p>
            <button
              onClick={handleRefresh}
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              Try again
            </button>
          </div>
        ) : data[activeTab]?.length > 0 ? (
          <div className="space-y-1">
            {data[activeTab]
              ?.slice(0, 5)
              .map((item) => renderItem(item, activeTab))}
          </div>
        ) : (
          <div className="text-center py-8 px-4">
            <div
              className={`inline-flex p-3 rounded-lg bg-${
                tabs.find((t) => t.id === activeTab)?.color
              }-50 dark:bg-${
                tabs.find((t) => t.id === activeTab)?.color
              }-900/20 mb-3`}
            >
              {(() => {
                const activeTabData = tabs.find((t) => t.id === activeTab);
                const IconComponent = activeTabData?.icon || AlertCircle;
                return <IconComponent className="h-6 w-6" />;
              })()}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
              No {tabs.find((t) => t.id === activeTab)?.label} activities yet
            </p>
            <button
              onClick={handleRefresh}
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              Refresh
            </button>
          </div>
        )}
      </div>

      {/* Mobile Footer */}
      <div className="sm:hidden p-3 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() =>
            navigate(tabs.find((tab) => tab.id === activeTab).path)
          }
          className="w-full text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 flex items-center justify-center gap-1 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          View all {tabs.find((tab) => tab.id === activeTab)?.label}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default RecentActivities;
