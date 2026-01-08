import { 
  Navigation, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  IndianRupee,
  Car,
  Users,
  Calendar
} from "lucide-react";

export const TripStats = ({ trips }) => {
  const stats = {
    totalTrips: trips.length,
    inProgress: trips.filter(t => t.status === 'in_progress').length,
    completed: trips.filter(t => t.status === 'completed').length,
    scheduled: trips.filter(t => t.status === 'scheduled').length,
    pending: trips.filter(t => t.status === 'pending').length,
    totalDistance: trips.reduce((sum, trip) => sum + (trip.distance || 0), 0),
    totalRevenue: trips.reduce((sum, trip) => sum + (trip.revenue || 0), 0),
    totalProfit: trips.reduce((sum, trip) => sum + (trip.profit || 0), 0),
  };

  const statCards = [
    {
      title: "Total Trips",
      value: stats.totalTrips,
      icon: Navigation,
      color: "blue",
      change: "+15%",
      trend: "up",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: Clock,
      color: "orange",
      change: "3",
      trend: "neutral",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      color: "emerald",
      change: "+8",
      trend: "up",
    },
    {
      title: "Scheduled",
      value: stats.scheduled,
      icon: Calendar,
      color: "cyan",
      change: "5",
      trend: "neutral",
    },
    {
      title: "Total Distance",
      value: `${stats.totalDistance} km`,
      icon: MapPin,
      color: "purple",
      change: "+250km",
      trend: "up",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: IndianRupee,
      color: "green",
      change: "+22%",
      trend: "up",
    },
  ];

  const colorConfig = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      iconBg: "bg-blue-500",
      text: "text-blue-600 dark:text-blue-400",
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
    cyan: {
      bg: "bg-cyan-50 dark:bg-cyan-900/20",
      iconBg: "bg-cyan-500",
      text: "text-cyan-600 dark:text-cyan-400",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      iconBg: "bg-purple-500",
      text: "text-purple-600 dark:text-purple-400",
    },
    green: {
      bg: "bg-green-50 dark:bg-green-900/20",
      iconBg: "bg-green-500",
      text: "text-green-600 dark:text-green-400",
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