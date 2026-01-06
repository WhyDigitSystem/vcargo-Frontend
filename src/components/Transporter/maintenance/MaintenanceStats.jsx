import { 
  Wrench, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Calendar,
  TrendingUp,
  IndianRupee
} from "lucide-react";

export const MaintenanceStats = ({ records }) => {
  const stats = {
    totalRecords: records.length,
    pending: records.filter(r => r.status === 'pending').length,
    inProgress: records.filter(r => r.status === 'in_progress').length,
    completed: records.filter(r => r.status === 'completed').length,
    overdue: records.filter(r => {
      if (r.status === 'pending' || r.status === 'scheduled') {
        const scheduled = new Date(r.scheduledDate);
        const today = new Date();
        return scheduled < today;
      }
      return false;
    }).length,
    totalCost: records.reduce((sum, record) => sum + (record.cost || record.estimatedCost || 0), 0),
    preventive: records.filter(r => r.type === 'preventive').length,
  };

  const statCards = [
    {
      title: "Total Records",
      value: stats.totalRecords,
      icon: Wrench,
      color: "blue",
      change: "+3",
      trend: "up",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "amber",
      change: "2",
      trend: "neutral",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: AlertTriangle,
      color: "orange",
      change: "+1",
      trend: "up",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      color: "emerald",
      change: "+5",
      trend: "up",
    },
    {
      title: "Overdue",
      value: stats.overdue,
      icon: Calendar,
      color: "red",
      change: "1",
      trend: "neutral",
      urgent: stats.overdue > 0,
    },
    {
      title: "Total Cost",
      value: `₹${stats.totalCost.toLocaleString()}`,
      icon: IndianRupee,
      color: "purple",
      change: "+12%",
      trend: "up",
    },
  ];

  const colorConfig = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      iconBg: "bg-blue-500",
      text: "text-blue-600 dark:text-blue-400",
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-900/20",
      iconBg: "bg-amber-500",
      text: "text-amber-600 dark:text-amber-400",
    },
    orange: {
      bg: "bg-orange-50 dark:bg-orange-900/20",
      iconBg: "bg-orange-500",
      text: "text-orange-600 dark:text-orange-400",
    },
    emerald: {
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      iconBg: "bg-emerald-500",
      text: "text-emerald-600 dark:text-emerald-400",
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
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statCards.map((stat, idx) => {
        const colors = colorConfig[stat.color];
        
        return (
          <div 
            key={idx} 
            className={`bg-white dark:bg-gray-800 rounded-xl border p-4 hover:shadow-sm transition-shadow ${
              stat.urgent 
                ? 'border-red-300 dark:border-red-700 ring-1 ring-red-200 dark:ring-red-800' 
                : 'border-gray-200 dark:border-gray-700'
            }`}
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
            
            {stat.urgent && (
              <div className="mt-2">
                <div className="w-full h-1 bg-red-100 dark:bg-red-900/30 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full animate-pulse" style={{ width: '70%' }} />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};