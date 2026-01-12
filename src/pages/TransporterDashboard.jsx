import {
  Calendar,
  FileText,
  Fuel,
  IndianRupee,
  Map,
  Truck,
  Users,
  Wrench,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import QuickStats from "../components/Transporter/Dashboard/QuickStats";
import RecentActivities from "../components/Transporter/Dashboard/RecentActivities";

const TransporterDashboard = () => {
  const navigate = useNavigate();

  // Quick Stats Cards
  const quickStats = [
    {
      name: "Active Vehicles",
      count: 24,
      icon: Truck,
      gradient: "from-blue-500 to-cyan-500",
      path: "/vehicles",
      change: "+2",
      changeType: "positive",
      description: "On road now",
    },
    {
      name: "Ongoing Trips",
      count: 18,
      icon: Map,
      gradient: "from-emerald-500 to-green-500",
      path: "/trips",
      change: "+3",
      changeType: "positive",
      description: "In progress",
    },
    {
      name: "Pending Invoices",
      count: 8,
      icon: IndianRupee,
      gradient: "from-amber-500 to-orange-500",
      path: "/invoices",
      change: "-2",
      changeType: "negative",
      description: "Awaiting payment",
      amount: "$42,850",
    },
    {
      name: "Fuel Efficiency",
      count: "8.2",
      icon: Fuel,
      gradient: "from-purple-500 to-pink-500",
      path: "/analytics",
      change: "+0.4",
      changeType: "positive",
      description: "km/liter",
      suffix: " km/l",
    },
    {
      name: "Maintenance Due",
      count: 5,
      icon: Wrench,
      gradient: "from-red-500 to-rose-500",
      path: "/maintenance",
      change: "+1",
      changeType: "negative",
      description: "Check required",
    },
    {
      name: "Driver Status",
      count: "28/32",
      icon: Users,
      gradient: "from-indigo-500 to-violet-500",
      path: "/drivers",
      change: "100%",
      changeType: "positive",
      description: "Active drivers",
    },
  ];

  // Recent Trips Data
  const recentTrips = [
    {
      id: "TRP-7890",
      vehicle: "MH-12-AB-1234",
      driver: "Rajesh Kumar",
      route: "Mumbai → Delhi",
      distance: "1,450 km",
      status: "in-progress",
      statusText: "On Route",
      eta: "12 hrs",
      revenue: "$2,850",
    },
    {
      id: "TRP-7889",
      vehicle: "MH-12-CD-5678",
      driver: "Amit Sharma",
      route: "Pune → Bangalore",
      distance: "850 km",
      status: "completed",
      statusText: "Delivered",
      eta: "-",
      revenue: "$1,650",
    },
    {
      id: "TRP-7888",
      vehicle: "MH-12-EF-9012",
      driver: "Suresh Patel",
      route: "Chennai → Hyderabad",
      distance: "625 km",
      status: "scheduled",
      statusText: "Starts in 2h",
      eta: "8 hrs",
      revenue: "$1,250",
    },
    {
      id: "TRP-7887",
      vehicle: "MH-12-GH-3456",
      driver: "Vikram Singh",
      route: "Ahmedabad → Surat",
      distance: "260 km",
      status: "delayed",
      statusText: "Delayed by 1h",
      eta: "4 hrs",
      revenue: "$750",
    },
  ];

  // Upcoming Maintenance
  const maintenanceSchedule = [
    {
      vehicle: "MH-12-AB-1234",
      type: "Engine Service",
      dueDate: "Tomorrow",
      status: "urgent",
      cost: "$350",
    },
    {
      vehicle: "MH-12-CD-5678",
      type: "Tyre Replacement",
      dueDate: "In 3 days",
      status: "warning",
      cost: "$800",
    },
    {
      vehicle: "MH-12-EF-9012",
      type: "Brake Inspection",
      dueDate: "Next Week",
      status: "normal",
      cost: "$120",
    },
    {
      vehicle: "MH-12-GH-3456",
      type: "Annual Insurance",
      dueDate: "15th Feb",
      status: "info",
      cost: "$2,400",
    },
  ];

  // Quick Actions
  const quickActions = [
    {
      name: "New Trip",
      icon: Map,
      color: "bg-emerald-500",
      path: "/trips/new",
    },
    {
      name: "Add Vehicle",
      icon: Truck,
      color: "bg-blue-500",
      path: "/vehicles/add",
    },
    {
      name: "Create Invoice",
      icon: FileText,
      color: "bg-amber-500",
      path: "/invoices/new",
    },
    {
      name: "Schedule Maintenance",
      icon: Calendar,
      color: "bg-purple-500",
      path: "/maintenance/schedule",
    },
  ];

  // Invoice Status
  const invoiceStatus = [
    { status: "Paid", count: 42, amount: "$198,500", color: "#10b981" },
    { status: "Pending", count: 8, amount: "$42,850", color: "#f59e0b" },
    { status: "Overdue", count: 3, amount: "$12,750", color: "#ef4444" },
    { status: "Draft", count: 5, amount: "$18,250", color: "#3b82f6" },
  ];

  // Vehicle Status Data for Pie Chart
  const vehicleStatusData = [
    { name: "Active", value: 18, color: "#3b82f6" },
    { name: "Maintenance", value: 3, color: "#f59e0b" },
    { name: "Idle", value: 2, color: "#10b981" },
    { name: "Breakdown", value: 1, color: "#ef4444" },
  ];

  // Revenue Data for Bar Chart (Monthly)
  const monthlyRevenueData = [
    { month: "Jan", revenue: 42000, trips: 45 },
    { month: "Feb", revenue: 52000, trips: 52 },
    { month: "Mar", revenue: 68000, trips: 58 },
    { month: "Apr", revenue: 45000, trips: 47 },
    { month: "May", revenue: 72000, trips: 63 },
    { month: "Jun", revenue: 85000, trips: 71 },
  ];

  // Trip Status Data for Bar Chart
  const tripStatusData = [
    { status: "Completed", count: 125, color: "#10b981" },
    { status: "In Progress", count: 18, color: "#3b82f6" },
    { status: "Scheduled", count: 24, color: "#f59e0b" },
    { status: "Delayed", count: 6, color: "#ef4444" },
  ];

  // Fuel Efficiency Trend
  const fuelEfficiencyData = [
    { week: "Week 1", efficiency: 7.8 },
    { week: "Week 2", efficiency: 8.1 },
    { week: "Week 3", efficiency: 8.0 },
    { week: "Week 4", efficiency: 8.3 },
    { week: "Week 5", efficiency: 8.2 },
    { week: "Week 6", efficiency: 8.5 },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "scheduled":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "delayed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getMaintenanceColor = (status) => {
    switch (status) {
      case "urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "warning":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "normal":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "info":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // Custom Tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}:{" "}
              {typeof entry.value === "number"
                ? entry.value.toLocaleString()
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-50 dark:from-gray-900 dark:via-gray-800/20 dark:to-gray-900 p-6">
      {/* Header */}
      <div className="mb-2">
        {/* Quick Actions Bar */}
        {/* <div className="flex flex-wrap gap-3 mb-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.name}
                onClick={() => navigate(action.path)}
                className={`${action.color} text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-transform`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{action.name}</span>
              </button>
            );
          })}
        </div> */}
      </div>

      <QuickStats />

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Left Column - Recent Trips */}
        <RecentActivities />

        {/* Right Column - Summary & Actions */}
        {/* <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Invoice Status
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total: $272,350
                </p>
              </div>
              <button
                onClick={() => navigate("/invoices")}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                View All
              </button>
            </div>

            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={invoiceStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="count"
                    label={({ status, count }) => `${status}: ${count}`}
                  >
                    {invoiceStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<CustomTooltip />}
                    formatter={(value, name, props) => [
                      `$${props.payload.amount}`,
                      "Amount",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <button className="w-full mt-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
              Generate Reports
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Trip Status
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Current trip distribution
                </p>
              </div>
              <Map className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={tripStatusData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="status"
                    stroke="#9CA3AF"
                    fontSize={12}
                    width={60}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Trips" radius={[0, 4, 4, 0]}>
                    {tripStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Fuel Efficiency Trend
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Weekly average (km/liter)
                </p>
              </div>
              <Fuel className="h-5 w-5 text-purple-500" />
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={fuelEfficiencyData}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="week" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} domain={[7.5, 9]} />
                  <Tooltip
                    content={<CustomTooltip />}
                    formatter={(value) => [`${value} km/l`, "Efficiency"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="efficiency"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: "#8b5cf6", strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div> */}
      </div>

      {/* Bottom Navigation */}
      {/* <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          onClick={() => navigate("/vehicles")}
          className="cursor-pointer bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-4">
            <Truck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <ChevronRight className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Vehicle Management
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage your fleet, documents & maintenance
          </p>
        </div>

        <div
          onClick={() => navigate("/trips")}
          className="cursor-pointer bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-4">
            <Map className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            <ChevronRight className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Trip Management
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Plan, track & monitor all trips
          </p>
        </div>

        <div
          onClick={() => navigate("/invoices")}
          className="cursor-pointer bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-4">
            <FileText className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            <ChevronRight className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Invoice Management
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Create, track & manage invoices
          </p>
        </div>

        <div
          onClick={() => navigate("/analytics")}
          className="cursor-pointer bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <ChevronRight className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Analytics & Reports
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Insights, reports & performance
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default TransporterDashboard;
