import { useNavigate } from "react-router-dom";
import QuickStats from "../components/Transporter/Dashboard/QuickStats";
import RecentActivities from "../components/Transporter/Dashboard/RecentActivities";
import { 
  Calendar, 
  TrendingUp, 
  Shield,
  CheckCircle,
  MapPin,
  Clock,
  Bell,
  BarChart3,
  Users,
  FileText,
  Wrench,
  Fuel,
  Settings
} from "lucide-react";

const TransporterDashboard = () => {
  const navigate = useNavigate();

  // Additional data for the right column
  const upcomingEvents = [
    {
      id: 1,
      title: "Insurance Renewal - KA-05-AB-1234",
      date: "Jan 18, 2025",
      type: "insurance",
      priority: "high",
      icon: Shield
    },
    {
      id: 2,
      title: "PUC Due - TN-10-RT-6767",
      date: "Jan 20, 2025",
      type: "compliance",
      priority: "medium",
      icon: CheckCircle
    },
    {
      id: 3,
      title: "Driver License Renewal - Raj Kumar",
      date: "Jan 25, 2025",
      type: "driver",
      priority: "low",
      icon: Users
    },
    {
      id: 4,
      title: "Monthly Report Generation",
      date: "Jan 31, 2025",
      type: "report",
      priority: "medium",
      icon: FileText
    }
  ];

  const quickActions = [
    { id: 1, label: "Create Trip", icon: MapPin, path: "/trips/create" },
    { id: 2, label: "Add Driver", icon: Users, path: "/drivers/add" },
    { id: 3, label: "Schedule Maintenance", icon: Wrench, path: "/maintenance/schedule" },
    { id: 4, label: "Fuel Entry", icon: Fuel, path: "/fuel/add" },
    { id: 5, label: "Generate Report", icon: BarChart3, path: "/analytics" },
    { id: 6, label: "Tyre Management", icon: Settings, path: "/tyres" }
  ];

  const fleetAlerts = [
    { id: 1, message: "Vehicle TN-10-RT-6767 needs tyre replacement", type: "warning", time: "2 hours ago" },
    { id: 2, message: "Monthly fuel budget exceeded by 15%", type: "danger", time: "1 day ago" },
    { id: 3, message: "Driver Raj scheduled leave tomorrow", type: "info", time: "Just now" },
    { id: 4, message: "Vehicle KA-05-AB-1234 due for service", type: "warning", time: "3 hours ago" }
  ];

  const performanceStats = [
    { label: "On-time Delivery", value: "94%", change: "+2%", icon: CheckCircle },
    { label: "Fuel Efficiency", value: "8.2 km/L", change: "-0.3%", icon: Fuel },
    { label: "Vehicle Utilization", value: "78%", change: "+5%", icon: TrendingUp },
    { label: "Trip Cost/KM", value: "₹32.50", change: "-₹1.20", icon: FileText }
  ];

  const getPriorityColor = (priority) => {
    switch(priority) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "medium": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      default: return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    }
  };

  const getAlertColor = (type) => {
    switch(type) {
      case "danger": return "border-l-red-500 bg-red-50 dark:bg-red-900/10";
      case "warning": return "border-l-amber-500 bg-amber-50 dark:bg-amber-900/10";
      default: return "border-l-blue-500 bg-blue-50 dark:bg-blue-900/10";
    }
  };

  const getAlertIconColor = (type) => {
    switch(type) {
      case "danger": return "text-red-600 dark:text-red-400";
      case "warning": return "text-amber-600 dark:text-amber-400";
      default: return "text-blue-600 dark:text-blue-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-50 dark:from-gray-900 dark:via-gray-800/20 dark:to-gray-900 p-6">
      <QuickStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Recent Activities */}
        <div>
          <RecentActivities />
          
          {/* Performance Metrics Section */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Performance Metrics</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">This month's performance overview</p>
              </div>
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {performanceStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-1">
                      <Icon className="h-4 w-4 text-blue-500" />
                      <span className={`text-xs font-medium ${
                        stat.change.startsWith('+') || stat.change.includes('-₹') 
                          ? 'text-emerald-600 dark:text-emerald-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Upcoming Events & Quick Actions */}
        <div>
          {/* Upcoming Events */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Upcoming Events</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Important deadlines & schedules</p>
              </div>
              <Calendar className="h-5 w-5 text-amber-500" />
            </div>
            
            <div className="space-y-3">
              {upcomingEvents.map((event) => {
                const Icon = event.icon;
                return (
                  <div 
                    key={event.id}
                    onClick={() => navigate(`/calendar`)}
                    className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${
                      event.priority === 'high' ? 'bg-red-50 dark:bg-red-900/20' :
                      event.priority === 'medium' ? 'bg-amber-50 dark:bg-amber-900/20' :
                      'bg-blue-50 dark:bg-blue-900/20'
                    }`}>
                      <Icon className={`h-4 w-4 ${
                        event.priority === 'high' ? 'text-red-600 dark:text-red-400' :
                        event.priority === 'medium' ? 'text-amber-600 dark:text-amber-400' :
                        'text-blue-600 dark:text-blue-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        {event.title}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {event.date}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(event.priority)}`}>
                          {event.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <button 
              onClick={() => navigate('/calendar')}
              className="w-full mt-4 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center justify-center gap-1"
            >
              View All Events
            </button>
          </div>

          {/* Vehicle Status Summary */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Vehicle Status Summary</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current fleet status</p>
              </div>
              <BarChart3 className="h-5 w-5 text-emerald-500" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                    <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">On Route</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Currently active</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">5</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Available</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Ready for dispatch</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">3</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                    <Wrench className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Maintenance</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Under service</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">2</span>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/vehicles')}
              className="w-full mt-4 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center justify-center gap-1"
            >
              View Fleet Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransporterDashboard;