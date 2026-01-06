import {
  Activity,
  Calendar,
  FileText,
  Fuel,
  IndianRupee,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

export const FuelStats = ({ stats }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
    {[
      {
        label: "Total Fuel",
        value: `${stats.totalFuel} L`,
        icon: <Fuel className="h-6 w-6 text-blue-600" />,
        bg: "bg-blue-50 dark:bg-blue-900/20",
      },
      {
        label: "Total Cost",
        value: stats.totalCost,
        icon: <IndianRupee className="h-6 w-6 text-purple-600" />, // Changed to Indian Rupee
        bg: "bg-purple-50 dark:bg-purple-900/20",
      },
      {
        label: "Avg Efficiency",
        value: `${stats.avgEfficiency} km/l`,
        trend: stats.efficiencyTrend,
        icon: <Activity className="h-6 w-6 text-emerald-600" />,
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
      },
      {
        label: "Avg Cost/Entry",
        value: stats.avgCost,
        icon: <IndianRupee className="h-6 w-6 text-amber-600" />, // Changed to Indian Rupee
        bg: "bg-amber-50 dark:bg-amber-900/20",
      },
      {
        label: "Mar 2024 Cost",
        value: stats.monthlyCost,
        trend: stats.monthlyTrend,
        icon: <Calendar className="h-6 w-6 text-red-600" />,
        bg: "bg-red-50 dark:bg-red-900/20",
      },
      {
        label: "Total Entries",
        value: stats.totalEntries,
        icon: <FileText className="h-6 w-6 text-cyan-600" />,
        bg: "bg-cyan-50 dark:bg-cyan-900/20",
      },
    ].map((stat, idx) => (
      <div
        key={idx}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {stat.value}
            </p>
            {stat.trend && (
              <div className="flex items-center gap-1 mt-1">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span
                  className={`text-xs ${
                    stat.trend === "up" ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {stat.trend === "up" ? "+2.5%" : "-1.2%"}
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg ${stat.bg}`}>{stat.icon}</div>
        </div>
      </div>
    ))}
  </div>
);
