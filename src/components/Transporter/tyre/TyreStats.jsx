import {
  AlertTriangle,
  BarChart3,
  Car,
  DollarSign,
  Gauge,
  Layers,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

export const TyreStats = ({ stats, loading = false }) => {
  // Format stats for display
  const statCards = [
    {
      title: "Total Tyres",
      value: stats?.totalTyres || 0,
      icon: Layers,
      color: "blue",
      description: "Total tyres in inventory",
      trend: "neutral",
    },
    {
      title: "Total Investment",
      value: stats?.totalCost || "₹0",
      icon: DollarSign,
      color: "purple",
      description: "Total purchase cost",
      trend: "neutral",
    },
    {
      title: "Average Cost",
      value: stats?.avgCost || "₹0",
      icon: BarChart3,
      color: "emerald",
      description: "Average cost per tyre",
      trend: "neutral",
    },
    {
      title: "Avg Tread Depth",
      value: stats?.avgTreadDepth || "0%",
      icon: Gauge,
      color: "cyan",
      description: "Average tread condition",
      trend:
        stats?.avgTreadDepth && parseFloat(stats.avgTreadDepth) > 70
          ? "up"
          : stats?.avgTreadDepth && parseFloat(stats.avgTreadDepth) < 50
          ? "down"
          : "neutral",
    },
    {
      title: "Needs Attention",
      value: stats?.needsAttention || 0,
      icon: AlertTriangle,
      color: "amber",
      description: "Tyres requiring maintenance",
      trend: stats?.needsAttention > 0 ? "down" : "neutral",
      isWarning: true,
    },
    {
      title: "Active Vehicles",
      value: stats?.byPosition
        ? stats.byPosition.front +
          stats.byPosition.rear +
          stats.byPosition.spare
        : 0,
      icon: Car,
      color: "indigo",
      description: "Tyres assigned to vehicles",
      trend: "neutral",
    },
  ];

  // Additional status cards for detailed breakdown
  const statusCards = [
    {
      title: "Front Position",
      value: stats?.byPosition?.front || 0,
      color: "blue",
      description: "Front tyres",
    },
    {
      title: "Rear Position",
      value: stats?.byPosition?.rear || 0,
      color: "green",
      description: "Rear tyres",
    },
    {
      title: "Spare Tyres",
      value: stats?.byPosition?.spare || 0,
      color: "purple",
      description: "Spare tyres",
    },
    {
      title: "Good Condition",
      value: stats?.byCondition?.good || 0,
      color: "emerald",
      description: "Tread depth > 70%",
    },
    {
      title: "Fair Condition",
      value: stats?.byCondition?.fair || 0,
      color: "yellow",
      description: "Tread depth 50-70%",
    },
    {
      title: "Poor Condition",
      value: stats?.byCondition?.poor || 0,
      color: "orange",
      description: "Tread depth 30-50%",
    },
    {
      title: "Critical",
      value: stats?.byCondition?.critical || 0,
      color: "red",
      description: "Tread depth < 30%",
    },
    {
      title: "New Tyres",
      value: stats?.byStatus?.new || 0,
      color: "blue",
      description: "Brand new tyres",
    },
    {
      title: "Used Tyres",
      value: stats?.byStatus?.used || 0,
      color: "gray",
      description: "Used tyres",
    },
    {
      title: "Damaged",
      value: stats?.byStatus?.damaged || 0,
      color: "red",
      description: "Damaged tyres",
    },
  ];

  const colorConfig = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      iconBg: "bg-blue-500",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800",
    },
    emerald: {
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      iconBg: "bg-emerald-500",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-800",
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-900/20",
      iconBg: "bg-amber-500",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-800",
    },
    red: {
      bg: "bg-red-50 dark:bg-red-900/20",
      iconBg: "bg-red-500",
      text: "text-red-600 dark:text-red-400",
      border: "border-red-200 dark:border-red-800",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      iconBg: "bg-purple-500",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-200 dark:border-purple-800",
    },
    cyan: {
      bg: "bg-cyan-50 dark:bg-cyan-900/20",
      iconBg: "bg-cyan-500",
      text: "text-cyan-600 dark:text-cyan-400",
      border: "border-cyan-200 dark:border-cyan-800",
    },
    indigo: {
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
      iconBg: "bg-indigo-500",
      text: "text-indigo-600 dark:text-indigo-400",
      border: "border-indigo-200 dark:border-indigo-800",
    },
    green: {
      bg: "bg-green-50 dark:bg-green-900/20",
      iconBg: "bg-green-500",
      text: "text-green-600 dark:text-green-400",
      border: "border-green-200 dark:border-green-800",
    },
    yellow: {
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      iconBg: "bg-yellow-500",
      text: "text-yellow-600 dark:text-yellow-400",
      border: "border-yellow-200 dark:border-yellow-800",
    },
    orange: {
      bg: "bg-orange-50 dark:bg-orange-900/20",
      iconBg: "bg-orange-500",
      text: "text-orange-600 dark:text-orange-400",
      border: "border-orange-200 dark:border-orange-800",
    },
    gray: {
      bg: "bg-gray-50 dark:bg-gray-900/20",
      iconBg: "bg-gray-500",
      text: "text-gray-600 dark:text-gray-400",
      border: "border-gray-200 dark:border-gray-800",
    },
  };

  // Skeleton loader for when loading
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 animate-pulse"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-700">
                <div className="p-2 rounded-md bg-gray-200 dark:bg-gray-600">
                  <div className="h-4 w-4" />
                </div>
              </div>
              <div className="h-6 w-12 bg-gray-100 dark:bg-gray-700 rounded-full" />
            </div>
            <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded mb-2" />
            <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat, idx) => {
          const colors = colorConfig[stat.color];

          return (
            <div
              key={idx}
              className={`bg-white dark:bg-gray-800 rounded-xl border ${
                colors.border
              } p-4 hover:shadow-sm transition-shadow ${
                stat.isWarning
                  ? "ring-1 ring-amber-200 dark:ring-amber-800"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-lg ${colors.bg}`}>
                  <div className={`p-2 rounded-md ${colors.iconBg}`}>
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                </div>

                {stat.trend && stat.trend !== "neutral" && (
                  <div
                    className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${
                      stat.trend === "up"
                        ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                        : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                  </div>
                )}
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {stat.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
