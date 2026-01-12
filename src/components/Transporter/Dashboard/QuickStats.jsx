import {
  AlertCircle,
  Battery,
  ChevronDown,
  Eye,
  EyeOff,
  FileText,
  Filter,
  Fuel,
  MapPin,
  TrendingUp,
  Truck,
  Users,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const QuickStats = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [visibleCategories, setVisibleCategories] = useState({
    vehicles: true,
    drivers: true,
    fuel: true,
    tyres: true,
    maintenance: true,
    operations: true,
  });
  const [showAllStats, setShowAllStats] = useState(false);

  // Stats data organized by category
  const statsByCategory = {
    vehicles: [
      {
        name: "Active Vehicles",
        count: 24,
        icon: Truck,
        gradient: "from-blue-500 to-cyan-500",
        path: "/vehicles",
        change: "+2",
        changeType: "positive",
        description: "Ready for dispatch",
        trend: "up",
        value: "92%",
        subtext: "Utilization",
      },
      {
        name: "Idle Vehicles",
        count: 3,
        icon: Truck,
        gradient: "from-gray-400 to-gray-600",
        path: "/vehicles",
        change: "-1",
        changeType: "negative",
        description: "Available",
        trend: "down",
      },
    ],
    drivers: [
      {
        name: "Available Drivers",
        count: "28/32",
        icon: Users,
        gradient: "from-indigo-500 to-violet-500",
        path: "/drivers",
        change: "+2",
        changeType: "positive",
        description: "Active",
        progress: 87,
        value: "4.8/5.0",
        subtext: "Avg Rating",
      },
      {
        name: "Driver Efficiency",
        count: "92%",
        icon: TrendingUp,
        gradient: "from-emerald-500 to-green-500",
        path: "/drivers/performance",
        change: "+3%",
        changeType: "positive",
        description: "On-time deliveries",
      },
    ],
    fuel: [
      {
        name: "Fuel Efficiency",
        count: "8.2",
        icon: Fuel,
        gradient: "from-amber-500 to-orange-500",
        path: "/fuel",
        change: "+0.4",
        changeType: "positive",
        description: "km/liter avg",
        value: "$18.4K",
        subtext: "Monthly cost",
      },
      {
        name: "Fuel Savings",
        count: "$1.2K",
        icon: TrendingUp,
        gradient: "from-teal-500 to-emerald-500",
        path: "/fuel/analytics",
        change: "+15%",
        changeType: "positive",
        description: "Cost reduction",
      },
    ],
    tyres: [
      {
        name: "Tyre Health",
        count: "78%",
        icon: Battery,
        gradient: "from-teal-500 to-emerald-500",
        path: "/tyres",
        change: "-5%",
        changeType: "warning",
        description: "Avg tread depth",
        value: "6",
        subtext: "Replace soon",
      },
      {
        name: "Tyre Alert",
        count: 3,
        icon: AlertCircle,
        gradient: "from-orange-500 to-amber-500",
        path: "/tyres/alerts",
        change: "+1",
        changeType: "negative",
        description: "Critical issues",
      },
    ],
    maintenance: [
      {
        name: "Maintenance Due",
        count: 5,
        icon: Wrench,
        gradient: "from-red-500 to-pink-500",
        path: "/maintenance",
        change: "+1",
        changeType: "warning",
        description: "Scheduled",
        value: "2.4h",
        subtext: "Avg MTTR",
      },
      {
        name: "Service Cost",
        count: "$4.8K",
        icon: FileText,
        gradient: "from-purple-500 to-pink-500",
        path: "/maintenance/cost",
        change: "-$320",
        changeType: "positive",
        description: "Monthly average",
      },
    ],
    operations: [
      {
        name: "Active Trips",
        count: 18,
        icon: MapPin,
        gradient: "from-cyan-500 to-blue-500",
        path: "/trips",
        change: "+3",
        changeType: "positive",
        description: "On road",
        value: "94%",
        subtext: "On-time rate",
      },
      {
        name: "Pending Invoices",
        count: 8,
        icon: FileText,
        gradient: "from-yellow-500 to-orange-500",
        path: "/invoices",
        change: "-2",
        changeType: "positive",
        description: "Awaiting payment",
        value: "$42.8K",
        subtext: "Total amount",
      },
    ],
  };

  const filters = [
    { id: "all", label: "All Modules", color: "gray" },
    { id: "vehicles", label: "Vehicles", color: "blue" },
    { id: "drivers", label: "Drivers", color: "indigo" },
    { id: "fuel", label: "Fuel", color: "amber" },
    { id: "tyres", label: "Tyres", color: "teal" },
    { id: "maintenance", label: "Maintenance", color: "red" },
    { id: "operations", label: "Operations", color: "cyan" },
  ];

  const getChangeColor = (changeType) => {
    const colors = {
      positive:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
      negative: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      warning:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    };
    return (
      colors[changeType] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    );
  };

  const getChangeIcon = (changeType) => {
    const icons = { positive: "↑", negative: "↓", warning: "⚠" };
    return icons[changeType] || "→";
  };

  const renderProgressBar = (progress) => (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
      <div
        className="bg-emerald-500 h-1.5 rounded-full"
        style={{ width: `${progress}%` }}
      />
    </div>
  );

  const toggleCategory = (category) => {
    setVisibleCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const filteredStats =
    activeFilter === "all"
      ? Object.entries(statsByCategory)
          .filter(([category]) => visibleCategories[category])
          .flatMap(([_, stats]) => stats)
      : statsByCategory[activeFilter] || [];

  const displayedStats = showAllStats
    ? filteredStats
    : filteredStats.slice(0, 8);

  return (
    <div className="mb-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Fleet Analytics Dashboard
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Real-time performance metrics
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Category visibility toggle */}
          <div className="relative group">
            <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Categories</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            <div className="absolute right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-10 hidden group-hover:block min-w-48">
              {Object.entries(visibleCategories).map(
                ([category, isVisible]) => (
                  <div
                    key={category}
                    className="flex items-center justify-between px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <span className="text-sm capitalize">{category}</span>
                    <button
                      onClick={() => toggleCategory(category)}
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {isVisible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Filter dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            <div className="absolute right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-10 hidden group-hover:block min-w-36">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`w-full text-left px-3 py-2 text-sm capitalize hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    activeFilter === filter.id
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowAllStats(!showAllStats)}
            className="px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            {showAllStats ? "Show Less" : "Show All"}
          </button>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
              activeFilter === filter.id
                ? `bg-${filter.color}-100 text-${filter.color}-800 dark:bg-${filter.color}-900/30 dark:text-${filter.color}-300`
                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {displayedStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={`${stat.name}-${index}`}
              onClick={() => navigate(stat.path)}
              className="group cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-150"
            >
              <div className="relative">
                {/* Icon and change indicator */}
                <div className="flex items-start justify-between mb-2">
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-r ${stat.gradient} shadow-sm`}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getChangeColor(
                      stat.changeType
                    )}`}
                  >
                    {getChangeIcon(stat.changeType)} {stat.change}
                  </span>
                </div>

                {/* Main content */}
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide truncate">
                    {stat.name}
                  </p>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                      {stat.count}
                    </h3>
                    {stat.value && (
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {stat.value}
                      </span>
                    )}
                  </div>

                  {/* Additional info row */}
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {stat.description}
                    </p>
                    {stat.subtext && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {stat.subtext}
                      </span>
                    )}
                  </div>

                  {/* Progress bar for specific stats */}
                  {stat.progress && renderProgressBar(stat.progress)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary footer */}
      {displayedStats.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  {
                    displayedStats.filter((s) => s.changeType === "positive")
                      .length
                  }{" "}
                  Positive
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  {
                    displayedStats.filter((s) => s.changeType === "negative")
                      .length
                  }{" "}
                  Attention
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate("/analytics")}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1"
            >
              Detailed Analytics
              <ChevronDown className="h-3 w-3 transform -rotate-90" />
            </button>
          </div>
        </div>
      )}

      {displayedStats.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No stats available for selected filter
        </div>
      )}
    </div>
  );
};

export default QuickStats;
