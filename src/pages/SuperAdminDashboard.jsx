import {
  BarChart3,
  Building,
  ChevronRight,
  Cpu,
  Database,
  DollarSign,
  FileText,
  Filter,
  Globe,
  Layers,
  LineChart,
  Monitor,
  Package,
  Server,
  Settings,
  Shield,
  Ticket,
  TrendingUp,
  Truck,
  Upload,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: 45,
    memory: 78,
    storage: 62,
    activeSessions: 342,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      // Simulate real-time metrics update
      setSystemMetrics(prev => ({
        cpu: Math.min(100, Math.max(20, prev.cpu + (Math.random() * 10 - 5))),
        memory: Math.min(100, Math.max(60, prev.memory + (Math.random() * 8 - 4))),
        storage: Math.min(100, Math.max(50, prev.storage + (Math.random() * 6 - 3))),
        activeSessions: Math.max(200, Math.min(500, prev.activeSessions + Math.floor(Math.random() * 20 - 10))),
      }));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const systemOverview = [
    {
      title: "Total Users",
      value: "1,248",
      change: "+12.5%",
      icon: Users,
      color: "blue",
      data: [45, 52, 38, 24, 33, 52, 45],
    },
    {
      title: "Active Industries",
      value: "48",
      change: "+8.2%",
      icon: Building,
      color: "green",
      data: [30, 45, 40, 50, 48, 52, 48],
    },
    {
      title: "Active Transporters",
      value: "156",
      change: "+15.3%",
      icon: Truck,
      color: "purple",
      data: [120, 130, 140, 135, 145, 150, 156],
    },
    {
      title: "Revenue",
      value: "₹2.8M",
      change: "+24.7%",
      icon: DollarSign,
      color: "amber",
      data: [120, 140, 160, 180, 200, 220, 280],
    },
  ];

  const systemModules = [
    {
      name: "System Health",
      status: "healthy",
      uptime: "99.98%",
      icon: Server,
      gradient: "from-green-500 to-emerald-600",
      path: "/admin/system-health",
    },
    {
      name: "User Management",
      count: 1248,
      icon: Users,
      gradient: "from-blue-500 to-cyan-600",
      path: "/admin/user-management",
    },
    {
      name: "Organizations",
      count: 48,
      icon: Building,
      gradient: "from-indigo-500 to-purple-600",
      path: "/admin/organizations",
    },
    {
      name: "Transactions",
      count: 2894,
      icon: DollarSign,
      gradient: "from-amber-500 to-orange-600",
      path: "/admin/transactions",
    },
    {
      name: "Audit Logs",
      count: 8942,
      icon: FileText,
      gradient: "from-gray-600 to-gray-800",
      path: "/admin/audit-logs",
    },
    {
      name: "API Management",
      count: 42,
      icon: Cpu,
      gradient: "from-red-500 to-pink-600",
      path: "/admin/api-management",
    },
    {
      name: "System Config",
      count: 156,
      icon: Settings,
      gradient: "from-teal-500 to-blue-600",
      path: "/admin/system-config",
    },
  ];

  const quickActions = [
    {
      title: "System Monitoring",
      icon: Monitor,
      description: "Real-time system monitoring and alerts",
      path: "/admin/monitoring",
      color: "red",
    },
    {
      title: "Analytics Dashboard",
      icon: LineChart,
      description: "Advanced analytics and insights",
      path: "/admin/analytics",
      color: "blue",
    },
    {
      title: "Security Center",
      icon: Shield,
      description: "Security monitoring and threat detection",
      path: "/admin/security",
      color: "green",
    },
    {
      title: "Billing & Invoices",
      icon: DollarSign,
      description: "Manage subscriptions and billing",
      path: "/admin/billing",
      color: "purple",
    },
    {
      title: "API Management",
      icon: Cpu,
      description: "API endpoints and usage monitoring",
      path: "/admin/api",
      color: "amber",
    },
    {
      title: "Backup & Restore",
      icon: Database,
      description: "System backup and recovery",
      path: "/admin/backup",
      color: "gray",
    },
  ];

  const recentActivities = [
    { time: "2 min ago", user: "John Doe", action: "Logged in", icon: Users },
    { time: "15 min ago", user: "Prime Gold Group", action: "Created new auction", icon: Ticket },
    { time: "32 min ago", user: "Admin", action: "Updated system settings", icon: Settings },
    { time: "1 hour ago", user: "ABC Logistics", action: "Submitted quote", icon: DollarSign },
    { time: "2 hours ago", user: "System", action: "Scheduled backup", icon: Database },
    { time: "3 hours ago", user: "Security", action: "Security scan completed", icon: Shield },
  ];

  const systemSections = [
    {
      title: "Platform Management",
      color: "indigo",
      items: [
        { name: "User Administration", icon: Users, path: "/admin/users" },
        { name: "Organization Management", icon: Building, path: "/admin/organizations" },
        { name: "Role & Permissions", icon: Shield, path: "/admin/roles" },
        { name: "API Access Control", icon: Cpu, path: "/admin/api-access" },
      ],
    },
    {
      title: "System Operations",
      color: "blue",
      items: [
        { name: "System Monitoring", icon: Monitor, path: "/admin/monitoring" },
        { name: "Server Management", icon: Server, path: "/admin/servers" },
        { name: "Database Administration", icon: Database, path: "/admin/database" },
        { name: "Log Management", icon: FileText, path: "/admin/logs" },
      ],
    },
    {
      title: "Analytics & Reports",
      color: "green",
      items: [
        { name: "Usage Analytics", icon: BarChart3, path: "/admin/analytics" },
        { name: "Financial Reports", icon: DollarSign, path: "/admin/financial-reports" },
        { name: "Performance Metrics", icon: TrendingUp, path: "/admin/performance" },
        { name: "Audit Reports", icon: FileText, path: "/admin/audit-reports" },
      ],
    },
    {
      title: "Security & Compliance",
      color: "red",
      items: [
        { name: "Security Dashboard", icon: Shield, path: "/admin/security" },
        { name: "Compliance Checks", icon: UserCheck, path: "/admin/compliance" },
        { name: "Activity Monitoring", icon: Monitor, path: "/admin/activity" },
        { name: "Threat Detection", icon: Shield, path: "/admin/threats" },
      ],
    },
    {
      title: "Configuration",
      color: "purple",
      items: [
        { name: "System Settings", icon: Settings, path: "/admin/settings" },
        { name: "Email Templates", icon: FileText, path: "/admin/email-templates" },
        { name: "Notification Center", icon: Zap, path: "/admin/notifications" },
        { name: "Integration Management", icon: Layers, path: "/admin/integrations" },
      ],
    },
    {
      title: "Data Management",
      color: "amber",
      items: [
        { name: "Data Backup", icon: Database, path: "/admin/backup" },
        { name: "Data Export", icon: Upload, path: "/admin/data-export" },
        { name: "Data Migration", icon: Package, path: "/admin/migration" },
        { name: "Archive Management", icon: FileText, path: "/admin/archive" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 p-4 sm:p-6 lg:p-8">
      {/* Top Header with System Info */}
      <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl text-white mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:32px_32px]" />
        
        <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="h-8 w-8 text-blue-400" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Super Admin Dashboard</h1>
                <p className="text-sm text-gray-300 mt-1">
                  Complete system oversight and management
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span>System Status: Operational</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>Last Updated: {time.toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4" />
                <span>Uptime: 99.98%</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/admin/settings')}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-lg hover:bg-white/20 transition-all text-sm"
            >
              <Settings className="h-4 w-4" /> System Settings
            </button>
          </div>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {systemOverview.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metric.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl bg-${metric.color}-50 dark:bg-${metric.color}-900/20`}>
                  <Icon className={`h-6 w-6 text-${metric.color}-600 dark:text-${metric.color}-400`} />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-1 text-sm font-medium ${parseFloat(metric.change) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  <TrendingUp className="h-4 w-4" />
                  {metric.change}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Last 7 days
                </div>
              </div>
              
              {/* Mini Chart */}
              <div className="mt-4 flex items-end h-12 gap-0.5">
                {metric.data.map((value, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 bg-gradient-to-t ${
                      parseFloat(metric.change) >= 0 
                        ? `from-${metric.color}-500 to-${metric.color}-400` 
                        : 'from-gray-400 to-gray-300'
                    } rounded-t`}
                    style={{ height: `${(value / Math.max(...metric.data)) * 100}%` }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* System Health Metrics */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          System Health
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">CPU Usage</span>
              <Cpu className="h-5 w-5 text-blue-500" />
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Usage</span>
                <span className="font-semibold text-gray-900 dark:text-white">{systemMetrics.cpu.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${systemMetrics.cpu}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-200 dark:border-green-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Memory</span>
              <Server className="h-5 w-5 text-green-500" />
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Used</span>
                <span className="font-semibold text-gray-900 dark:text-white">{systemMetrics.memory.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                  style={{ width: `${systemMetrics.memory}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Storage</span>
              <Database className="h-5 w-5 text-amber-500" />
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Used</span>
                <span className="font-semibold text-gray-900 dark:text-white">{systemMetrics.storage.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
                  style={{ width: `${systemMetrics.storage}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-200 dark:border-purple-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Sessions</span>
              <Users className="h-5 w-5 text-purple-500" />
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Count</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{systemMetrics.activeSessions}</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Real-time user sessions
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Modules */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          System Modules
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {systemModules.map((module) => {
            const Icon = module.icon;
            return (
              <div
                key={module.name}
                onClick={() => navigate(module.path)}
                className="cursor-pointer group"
              >
                <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${module.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
                  />
                  <div className="relative flex flex-col items-center text-center">
                    <div
                      className={`p-3 mb-3 rounded-lg bg-gradient-to-r ${module.gradient} text-white shadow-md`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-medium text-gray-800 dark:text-gray-100 text-sm mb-1 truncate w-full">
                      {module.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {module.count ? `${module.count}` : module.uptime}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Quick Actions */}
        <div className="xl:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 text-left hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-${action.color}-50 dark:bg-${action.color}-900/20`}>
                      <Icon className={`h-6 w-6 text-${action.color}-600 dark:text-${action.color}-400`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {action.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activities */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activities
          </h2>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                    <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.user}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {activity.action}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {activity.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* System Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {systemSections.map((section, index) => (
          <div
            key={index}
            className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-5">
              <div
                className={`p-2 bg-${section.color}-100 dark:bg-${section.color}-900/20 rounded-lg`}
              >
                <Database
                  className={`h-5 w-5 text-${section.color}-600 dark:text-${section.color}-400`}
                />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {section.title}
              </h2>
            </div>

            <div className="space-y-2">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.path)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100/70 dark:hover:bg-gray-700/40 transition-all group"
                  >
                    <div
                      className={`p-2 bg-${section.color}-50 dark:bg-${section.color}-900/10 rounded-lg`}
                    >
                      <Icon
                        className={`h-4 w-4 text-${section.color}-600 dark:text-${section.color}-400`}
                      />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium text-left flex-1">
                      {item.name}
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;