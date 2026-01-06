import { 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  BarChart3,
  TrendingUp,
  TrendingDown
} from "lucide-react";

export const TyreStats = ({ tyres }) => {
  const stats = {
    totalTyres: tyres.length,
    activeTyres: tyres.filter(t => t.status === 'active').length,
    warningTyres: tyres.filter(t => {
      const treadDepth = parseFloat(t.treadDepth) || 0;
      return treadDepth < 3 && treadDepth > 1.6;
    }).length,
    criticalTyres: tyres.filter(t => {
      const treadDepth = parseFloat(t.treadDepth) || 0;
      return treadDepth <= 1.6;
    }).length,
    totalCost: tyres.reduce((sum, tyre) => sum + (parseFloat(tyre.purchaseCost) || 0), 0),
    avgTreadDepth: tyres.length > 0 
      ? (tyres.reduce((sum, tyre) => sum + (parseFloat(tyre.treadDepth) || 0), 0) / tyres.length).toFixed(1)
      : "0.0",
  };

  const statCards = [
    {
      title: "Total Tyres",
      value: stats.totalTyres,
      icon: Settings,
      color: "blue",
      change: "+2",
      trend: "up",
    },
    {
      title: "Active",
      value: stats.activeTyres,
      icon: CheckCircle,
      color: "emerald",
      change: "+5%",
      trend: "up",
    },
    {
      title: "Warning",
      value: stats.warningTyres,
      icon: AlertTriangle,
      color: "amber",
      change: "3",
      trend: "neutral",
    },
    {
      title: "Critical",
      value: stats.criticalTyres,
      icon: AlertTriangle,
      color: "red",
      change: "1",
      trend: "neutral",
    },
    {
      title: "Total Investment",
      value: `₹${stats.totalCost.toLocaleString()}`,
      icon: BarChart3,
      color: "purple",
      change: "+12%",
      trend: "up",
    },
    {
      title: "Avg Tread Depth",
      value: `${stats.avgTreadDepth} mm`,
      icon: TrendingDown,
      color: "cyan",
      change: "-0.2mm",
      trend: "down",
    },
  ];

  const colorConfig = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      iconBg: "bg-blue-500",
      text: "text-blue-600 dark:text-blue-400",
    },
    emerald: {
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      iconBg: "bg-emerald-500",
      text: "text-emerald-600 dark:text-emerald-400",
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-900/20",
      iconBg: "bg-amber-500",
      text: "text-amber-600 dark:text-amber-400",
    },
    red: {
      bg: "bg-red-50 dark:bg-red-900/20",
      iconBg: "bg-red-500",
      text: "text-red-600 dark:text-red-400",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      iconBg: "bg-purple-500",
      text: "text-purple-600 dark:text-purple-400",
    },
    cyan: {
      bg: "bg-cyan-50 dark:bg-cyan-900/20",
      iconBg: "bg-cyan-500",
      text: "text-cyan-600 dark:text-cyan-400",
    },
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statCards.map((stat, idx) => {
        const colors = colorConfig[stat.color];
        
        return (
          <div 
            key={idx} 
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-lg ${colors.bg}`}>
                <div className={`p-2 rounded-md ${colors.iconBg}`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </div>
              
              {stat.change && (
                <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.trend === "up" 
                    ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" 
                    : stat.trend === "down"
                    ? "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                    : "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                }`}>
                  {stat.change}
                </div>
              )}
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {stat.title}
            </p>
          </div>
        );
      })}
    </div>
  );
};