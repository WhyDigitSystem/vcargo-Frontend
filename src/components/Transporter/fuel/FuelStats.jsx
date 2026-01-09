import {
  Activity,
  AlertCircle,
  ChevronDown,
  Fuel,
  IndianRupee,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

export const FuelStats = ({
  stats,
  isLoading = false,
  onTimeframeChange,
  timeframe = "month",
  showVehicleStats = false,
}) => {
  const [localTimeframe, setLocalTimeframe] = useState(timeframe);
  const [hoveredStat, setHoveredStat] = useState(null);

  useEffect(() => {
    setLocalTimeframe(timeframe);
  }, [timeframe]);

  const handleTimeframeChange = (newTimeframe) => {
    setLocalTimeframe(newTimeframe);
    onTimeframeChange?.(newTimeframe);
  };

  const getTimeframeLabel = () => {
    switch (localTimeframe) {
      case "day":
        return "Today";
      case "week":
        return "This Week";
      case "month":
        return "This Month";
      case "quarter":
        return "This Quarter";
      case "year":
        return "This Year";
      default:
        return "All Time";
    }
  };

  const getTrendPercentage = (value, previousValue) => {
    if (!previousValue || previousValue === 0) return null;
    const percentage = ((value - previousValue) / previousValue) * 100;
    return {
      value: Math.abs(percentage).toFixed(1),
      direction: percentage >= 0 ? "up" : "down",
      positive: Math.abs(percentage) <= 5, // Consider <5% change as neutral/positive
    };
  };

  const formatNumber = (num) => {
    if (typeof num !== "number") return num;

    if (num >= 1000000) {
      return `₹${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `₹${(num / 1000).toFixed(1)}K`;
    }
    return `₹${num}`;
  };

  const statCards = [
    {
      id: "totalFuel",
      label: "Total Fuel",
      value: `${stats.totalFuel?.toLocaleString() || 0} L`,
      subvalue: stats.totalEntries ? `${stats.totalEntries} entries` : null,
      icon: <Fuel className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      bg: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10",
      border: "border-blue-100 dark:border-blue-800",
      trend: getTrendPercentage(stats.totalFuel, stats.previousTotalFuel),
      description: "Total fuel consumed in current period",
      loadingValue: "1,250 L",
    },
    {
      id: "totalCost",
      label: "Total Cost",
      value: formatNumber(stats.totalCost || 0),
      subvalue: stats.avgCost ? `Avg: ${formatNumber(stats.avgCost)}` : null,
      icon: (
        <IndianRupee className="h-6 w-6 text-purple-600 dark:text-purple-400" />
      ),
      bg: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10",
      border: "border-purple-100 dark:border-purple-800",
      trend: getTrendPercentage(stats.totalCost, stats.previousTotalCost),
      description: "Total expenditure on fuel",
      loadingValue: "₹45.8K",
    },
    {
      id: "avgEfficiency",
      label: "Avg Efficiency",
      value: `${stats.avgEfficiency || 0} km/l`,
      subvalue: stats.bestEfficiency
        ? `Best: ${stats.bestEfficiency} km/l`
        : null,
      icon: (
        <Activity className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
      ),
      bg: "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10",
      border: "border-emerald-100 dark:border-emerald-800",
      trend: getTrendPercentage(
        stats.avgEfficiency,
        stats.previousAvgEfficiency
      ),
      description: "Average fuel efficiency across all vehicles",
      loadingValue: "15.8 km/l",
      warning: stats.avgEfficiency < 10,
    },
    {
      id: "fuelEconomy",
      label: "Fuel Economy",
      value: `${stats.fuelEconomy || 0}%`,
      subvalue: stats.previousFuelEconomy
        ? `Prev: ${stats.previousFuelEconomy}%`
        : null,
      icon: <Zap className="h-6 w-6 text-amber-600 dark:text-amber-400" />,
      bg: "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10",
      border: "border-amber-100 dark:border-amber-800",
      trend: getTrendPercentage(stats.fuelEconomy, stats.previousFuelEconomy),
      description: "Overall fuel economy score",
      loadingValue: "85%",
      showTrend: true,
    },
    // {
    //   id: "monthlyCost",
    //   label: `${getTimeframeLabel()} Cost`,
    //   value: formatNumber(stats.monthlyCost || 0),
    //   subvalue: getTimeframeLabel(),
    //   icon: <Calendar className="h-6 w-6 text-red-600 dark:text-red-400" />,
    //   bg: "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10",
    //   border: "border-red-100 dark:border-red-800",
    //   trend: getTrendPercentage(stats.monthlyCost, stats.previousMonthlyCost),
    //   description: `Cost for ${getTimeframeLabel().toLowerCase()}`,
    //   loadingValue: "₹12.3K",
    // },
    // {
    //   id: "activeVehicles",
    //   label: "Active Vehicles",
    //   value: stats.activeVehicles || 0,
    //   subvalue: stats.totalVehicles ? `of ${stats.totalVehicles}` : null,
    //   icon: <Car className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />,
    //   bg: "bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-900/10",
    //   border: "border-cyan-100 dark:border-cyan-800",
    //   description: "Vehicles with fuel entries this period",
    //   loadingValue: "8",
    //   showChange: false,
    // },
    // {
    //   id: "avgDistance",
    //   label: "Avg Distance",
    //   value: `${stats.avgDistance?.toLocaleString() || 0} km`,
    //   subvalue: stats.totalDistance
    //     ? `Total: ${stats.totalDistance?.toLocaleString()} km`
    //     : null,
    //   icon: (
    //     <BarChart3 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
    //   ),
    //   bg: "bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/10",
    //   border: "border-indigo-100 dark:border-indigo-800",
    //   description: "Average distance between refuels",
    //   loadingValue: "450 km",
    //   showChange: false,
    // },
    // {
    //   id: "fuelUptime",
    //   label: "Fuel Uptime",
    //   value: `${stats.fuelUptime || 0}%`,
    //   subvalue: stats.lastUpdated ? `Updated: ${stats.lastUpdated}` : null,
    //   icon: <Clock className="h-6 w-6 text-violet-600 dark:text-violet-400" />,
    //   bg: "bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-900/10",
    //   border: "border-violet-100 dark:border-violet-800",
    //   description: "Percentage of time vehicles have sufficient fuel",
    //   loadingValue: "92%",
    //   showChange: false,
    // },
  ].filter((card) => !showVehicleStats || card.id !== "activeVehicles");

  if (isLoading) {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      {/* Header with timeframe selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Fuel Analytics
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Insights and trends from your fuel consumption
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={localTimeframe}
              onChange={(e) => handleTimeframeChange(e.target.value)}
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg pl-4 pr-8 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          <button
            onClick={() => onTimeframeChange?.(localTimeframe)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Refresh data"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {statCards.slice(0, showVehicleStats ? 6 : 8).map((stat) => (
          <div
            key={stat.id}
            className={`bg-white dark:bg-gray-800 rounded-xl border ${
              stat.border
            } p-5 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
              hoveredStat === stat.id
                ? "ring-2 ring-blue-500 dark:ring-blue-400"
                : ""
            } ${stat.warning ? "ring-2 ring-red-500 dark:ring-red-400" : ""}`}
            onMouseEnter={() => setHoveredStat(stat.id)}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                    {stat.label}
                  </p>
                  {stat.warning && (
                    <AlertCircle
                      className="h-3 w-3 text-red-500 dark:text-red-400"
                      title="Low efficiency warning"
                    />
                  )}
                </div>

                <div className="mb-2">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                    {stat.value}
                  </p>
                  {stat.subvalue && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                      {stat.subvalue}
                    </p>
                  )}
                </div>

                {stat.trend && stat.showChange !== false && (
                  <div className="flex items-center gap-2">
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        stat.trend.direction === "up" && !stat.trend.positive
                          ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                          : stat.trend.direction === "down" &&
                            stat.trend.positive
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300"
                      }`}
                    >
                      {stat.trend.direction === "up" ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span>
                        {stat.trend.direction === "up" ? "+" : "-"}
                        {stat.trend.value}%
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      vs previous period
                    </span>
                  </div>
                )}
              </div>

              <div className={`p-3 rounded-xl ${stat.bg} flex-shrink-0 ml-3`}>
                {stat.icon}
              </div>
            </div>

            {/* Description on hover */}
            {hoveredStat === stat.id && (
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {stat.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Default props
FuelStats.defaultProps = {
  stats: {
    totalFuel: 0,
    totalCost: 0,
    avgEfficiency: 0,
    fuelEconomy: 0,
    monthlyCost: 0,
    activeVehicles: 0,
    avgDistance: 0,
    fuelUptime: 0,
    totalEntries: 0,
    avgCost: 0,
  },
  timeframe: "month",
};
