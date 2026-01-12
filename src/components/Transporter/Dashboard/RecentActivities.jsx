import {
  AlertCircle,
  ChevronRight,
  FileText,
  Fuel,
  Loader2,
  Map,
  RefreshCw,
  Settings,
  Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";
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

  // Get orgId from localStorage or context
  const orgId = localStorage.getItem("orgId") || "1000000001";

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

      console.log("response==>", response);

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

      // Use fallback data if API fails
      setData(getFallbackData());
    } finally {
      setLoading(false);
    }
  };

  // Transform API trips data
  const transformTrips = (apiTrips) => {
    return apiTrips.map((trip) => ({
      id: `TRP-${trip.id}`,
      vehicle: trip.vehicleNo || trip.vehicleNumber || "N/A",
      driver: trip.driverName || "Unknown",
      route: trip.route || "Unknown route",
      distance: "N/A", // API doesn't provide distance
      status: trip.status?.toLowerCase() || "unknown",
      statusText:
        trip.status?.charAt(0).toUpperCase() + trip.status?.slice(1) ||
        "Unknown",
      eta: "N/A", // API doesn't provide ETA
      revenue: "$0", // API doesn't provide revenue
    }));
  };

  // Transform API maintenance data
  const transformMaintenance = (apiMaintenance) => {
    return apiMaintenance.map((main) => {
      const status = main.status?.toLowerCase();
      let statusText = "Unknown";
      let date = "N/A";

      if (status === "completed" && main.completedDate) {
        statusText = "Completed";
        date = formatDate(main.completedDate);
      } else if (status === "scheduled") {
        statusText = "Scheduled";
        date = "Upcoming";
      }

      return {
        id: `MTN-${main.id}`,
        vehicle: main.vehicleNo || main.vehicleNumber || "N/A",
        type:
          main.type?.charAt(0).toUpperCase() + main.type?.slice(1) || "Unknown",
        description: main.description || "No description",
        date: date,
        status: status,
        statusText: statusText,
        cost: main.totalCost ? `$${main.totalCost.toLocaleString()}` : "$0",
        priority: main.priority?.toLowerCase() || "medium",
      };
    });
  };

  // Transform API fuel data
  const transformFuel = (apiFuel) => {
    return apiFuel.map((fuel) => ({
      id: `FUL-${fuel.id}`,
      vehicle: fuel.vehicle || fuel.vehicleNumber || "N/A",
      station: fuel.station || "Unknown station",
      quantity: `${fuel.quantity} liters`,
      rate: `$${fuel.rate}/liter`,
      total: `$${fuel.total?.toLocaleString()}`,
      date: formatDate(fuel.date),
      efficiency: "N/A", // API doesn't provide efficiency
      driver: fuel.driver || "Unknown",
    }));
  };

  // Transform API tyres data
  const transformTyres = (apiTyres) => {
    return apiTyres.map((tyre) => {
      const status = tyre.status?.toLowerCase();
      let statusText = "Good";
      let statusType = "good";

      if (tyre.depth !== undefined) {
        if (tyre.depth < 3) {
          statusText = "Replace";
          statusType = "critical";
        } else if (tyre.depth < 5) {
          statusText = "Check";
          statusType = "warning";
        }
      }

      return {
        id: `TYR-${tyre.id}`,
        vehicle: tyre.vehicle || tyre.vehicleNumber || "N/A",
        position: tyre.position || "Unknown",
        brand: tyre.brand || "Unknown",
        depth: `${tyre.depth || 0} mm`,
        status: statusType,
        statusText: statusText,
        installedDate: formatDate(tyre.installedDate),
        nextCheck: "N/A", // API doesn't provide next check date
        driver: "Unknown", // API doesn't provide driver info
      };
    });
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
      } else {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }
    } catch (err) {
      return dateString;
    }
  };

  // Fallback data in case API fails
  const getFallbackData = () => {
    return {
      trips: [
        {
          id: "TRP-7890",
          vehicle: "MH-12-AB-1234",
          driver: "Rajesh Kumar",
          route: "Mumbai → Delhi",
          distance: "1,450 km",
          status: "in-progress",
          statusText: "On Route",
          eta: "12 hrs",
          revenue: "$2,850",
        },
      ],
      maintenance: [
        {
          id: "MTN-0456",
          vehicle: "MH-12-AB-1234",
          type: "Scheduled Service",
          description: "Engine oil change",
          date: "Today, 10:00 AM",
          status: "scheduled",
          statusText: "Upcoming",
          cost: "$450",
          priority: "medium",
        },
      ],
      fuel: [
        {
          id: "FUL-0789",
          vehicle: "MH-12-AB-1234",
          station: "Indian Oil, Mumbai",
          quantity: "250 liters",
          rate: "$1.25/liter",
          total: "$312.50",
          date: "Today",
          efficiency: "8.2 km/l",
          driver: "Rajesh Kumar",
        },
      ],
      invoices: [
        {
          id: "INV-5678",
          client: "Reliance Industries",
          amount: "$12,500",
          date: "Dec 15",
          dueDate: "Jan 15",
          status: "pending",
          statusText: "Pending",
          trips: "5 trips",
          vehicle: "MH-12-AB-1234",
        },
      ],
      tyres: [
        {
          id: "TYR-0345",
          vehicle: "MH-12-AB-1234",
          position: "Front Left",
          brand: "MRF",
          depth: "4.5 mm",
          status: "good",
          statusText: "Good",
          installedDate: "Jun 15",
          nextCheck: "Mar 15",
          driver: "Rajesh Kumar",
        },
      ],
    };
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  const getStatusColor = (status) => {
    const colors = {
      "in-progress":
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      scheduled:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      completed:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
      paid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
      good: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
      delayed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      overdue: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      critical: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      warning:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    };
    return (
      colors[status] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    );
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      high: (
        <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
          H
        </span>
      ),
      medium: (
        <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
          M
        </span>
      ),
      low: (
        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
          L
        </span>
      ),
    };
    return badges[priority];
  };

  const renderItem = (item, type) => {
    const currentTab = tabs.find((tab) => tab.id === type);
    const Icon = currentTab.icon;

    const renderers = {
      trips: () => (
        <>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                {item.id}
              </h4>
              <span
                className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                  item.status
                )} shrink-0`}
              >
                {item.statusText}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {item.vehicle} • {item.driver}
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
              {item.route}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {item.revenue}
            </p>
          </div>
        </>
      ),

      maintenance: () => (
        <>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                {item.id}
              </h4>
              <span
                className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                  item.status
                )} shrink-0`}
              >
                {item.statusText}
              </span>
              {getPriorityBadge(item.priority)}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {item.vehicle} • {item.type}
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium text-gray-900 dark:text-white text-sm">
              {item.cost}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {item.date}
            </p>
          </div>
        </>
      ),

      fuel: () => (
        <>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
              {item.id}
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {item.vehicle} • {item.driver}
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium text-gray-900 dark:text-white text-sm">
              {item.total}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {item.quantity} @ {item.rate}
            </p>
          </div>
        </>
      ),

      invoices: () => (
        <>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                {item.id}
              </h4>
              <span
                className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                  item.status
                )} shrink-0`}
              >
                {item.statusText}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {item.client}
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium text-gray-900 dark:text-white text-sm">
              {item.amount}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Due: {item.dueDate}
            </p>
          </div>
        </>
      ),

      tyres: () => (
        <>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                {item.id}
              </h4>
              <span
                className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                  item.status
                )} shrink-0`}
              >
                {item.statusText}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {item.vehicle} • {item.position}
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium text-gray-900 dark:text-white text-sm">
              {item.depth}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Installed: {item.installedDate}
            </p>
          </div>
        </>
      ),
    };

    return (
      <div
        key={item.id}
        onClick={() => navigate(`/${type}/${item.id.replace(/\D/g, "")}`)}
        className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
      >
        <div
          className={`p-2 rounded-lg bg-${currentTab.color}-50 dark:bg-${currentTab.color}-900/30 mr-3 shrink-0`}
        >
          <Icon
            className={`h-4 w-4 text-${currentTab.color}-600 dark:text-${currentTab.color}-400`}
          />
        </div>
        {renderers[type]()}
        <ChevronRight className="h-3 w-3 text-gray-400 ml-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      {/* Header with integrated tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-1 overflow-x-auto pb-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const tabData = data[tab.id] || [];
              const hasData = tabData.length > 0;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  disabled={loading || !hasData}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? `bg-${tab.color}-50 text-${tab.color}-700 dark:bg-${tab.color}-900/30 dark:text-${tab.color}-300 border border-${tab.color}-200 dark:border-${tab.color}-800`
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent"
                  } ${
                    !hasData && !loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {loading && isActive && (
                    <Loader2 className="h-3 w-3 animate-spin ml-1" />
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 transition-colors"
              title="Refresh data"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={() =>
                navigate(tabs.find((tab) => tab.id === activeTab).path)
              }
              disabled={loading || !data[activeTab]?.length}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="hidden sm:inline">View All</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {loading && !data[activeTab]?.length ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-3" />
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Loading {tabs.find((t) => t.id === activeTab)?.label} data...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mb-3" />
            <p className="text-red-600 dark:text-red-400 mb-2 text-sm">
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
          <div className="space-y-2">
            {data[activeTab]?.map((item) => renderItem(item, activeTab))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 dark:text-gray-500 mb-2">
              {(() => {
                const activeTabData = tabs.find((t) => t.id === activeTab);
                const IconComponent = activeTabData?.icon || AlertCircle;
                return <IconComponent className="h-8 w-8 mx-auto mb-2" />;
              })()}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No {tabs.find((t) => t.id === activeTab)?.label} data available
            </p>
            <button
              onClick={handleRefresh}
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm mt-2"
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivities;
