import {
  Activity,
  AlertCircle,
  Fuel,
  IndianRupee,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState } from "react";

export const FuelStats = ({
  stats,
  isLoading = false,
  onTimeframeChange,
  timeframe = "month",
  showVehicleStats = false,
}) => {
  const [localTimeframe, setLocalTimeframe] = useState(timeframe);
  const [hoveredStat, setHoveredStat] = useState(null);

  const handleTimeframeChange = (newTimeframe) => {
    setLocalTimeframe(newTimeframe);
    onTimeframeChange?.(newTimeframe);
  };

  const getTrend = (value, previousValue) => {
    if (!previousValue || previousValue === 0) return null;
    const percentage = ((value - previousValue) / previousValue) * 100;
    return {
      value: Math.abs(percentage).toFixed(1),
      direction: percentage >= 0 ? "up" : "down",
      positive: Math.abs(percentage) <= 5,
    };
  };

  const formatCost = (num) => {
    if (typeof num !== "number") return `₹${num}`;
    if (num >= 1000000) return `₹${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
    return `₹${num}`;
  };

  const statCards = [
    {
      id: "totalFuel",
      label: "Fuel Used",
      value: `${stats.totalFuel?.toLocaleString() || 0} L`,
      icon: Fuel,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-100 dark:border-blue-800",
      trend: getTrend(stats.totalFuel, stats.previousTotalFuel),
      loadingValue: "1,250 L",
    },
    {
      id: "totalCost",
      label: "Total Cost",
      value: formatCost(stats.totalCost || 0),
      icon: IndianRupee,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/20",
      border: "border-purple-100 dark:border-purple-800",
      trend: getTrend(stats.totalCost, stats.previousTotalCost),
      loadingValue: "₹45.8K",
    },
    {
      id: "avgEfficiency",
      label: "Efficiency",
      value: `${stats.avgEfficiency || 0} km/l`,
      icon: Activity,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      border: "border-emerald-100 dark:border-emerald-800",
      trend: getTrend(stats.avgEfficiency, stats.previousAvgEfficiency),
      loadingValue: "15.8 km/l",
      warning: stats.avgEfficiency < 10,
    },
    {
      id: "fuelEconomy",
      label: "Economy",
      value: `${stats.fuelEconomy || 0}%`,
      icon: Zap,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      border: "border-amber-100 dark:border-amber-800",
      trend: getTrend(stats.fuelEconomy, stats.previousFuelEconomy),
      loadingValue: "85%",
    },
  ].filter((card) => !showVehicleStats || card.id !== "activeVehicles");

  if (isLoading) {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Fuel Analytics
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Insights from fuel consumption
            </p>
          </div>
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Fuel Analytics
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Insights from fuel consumption
          </p>
        </div>

        <select
          value={localTimeframe}
          onChange={(e) => handleTimeframeChange(e.target.value)}
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="day">Today</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="quarter">Quarter</option>
          <option value="year">Year</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map((stat) => (
          <div
            key={stat.id}
            className={`bg-white dark:bg-gray-800 rounded-lg border ${
              stat.border
            } p-4 transition-all ${
              hoveredStat === stat.id ? "ring-1 ring-blue-500" : ""
            } ${stat.warning ? "ring-1 ring-red-500" : ""}`}
            onMouseEnter={() => setHoveredStat(stat.id)}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-1">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">
                    {stat.label}
                  </p>
                  {stat.warning && (
                    <AlertCircle className="h-3 w-3 text-red-500" />
                  )}
                </div>

                <p className="text-xl font-bold text-gray-900 dark:text-white truncate">
                  {stat.value}
                </p>

                {stat.trend && (
                  <div className="flex items-center gap-1 mt-1">
                    <div
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                        stat.trend.direction === "up" && !stat.trend.positive
                          ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                          : stat.trend.direction === "down" &&
                            stat.trend.positive
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300"
                      }`}
                    >
                      {stat.trend.direction === "up" ? (
                        <TrendingUp className="h-2.5 w-2.5" />
                      ) : (
                        <TrendingDown className="h-2.5 w-2.5" />
                      )}
                      <span>
                        {stat.trend.direction === "up" ? "+" : "-"}
                        {stat.trend.value}%
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className={`p-2 rounded-lg ${stat.bg} ml-2`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
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
  },
  timeframe: "month",
};
