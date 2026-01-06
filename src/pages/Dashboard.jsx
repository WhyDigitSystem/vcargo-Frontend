import {
  BarChart3,
  BookOpen,
  ChevronRight,
  Database,
  DollarSign,
  FileText,
  Filter,
  Route,
  Ticket,
  Truck,
  Upload,
  UserCheck,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const shortcuts = [
    {
      name: "Indents",
      count: 10,
      icon: BookOpen,
      gradient: "from-blue-500 to-blue-600",
      path: "/indents",
    },
    {
      name: "Trips",
      count: 40,
      icon: Truck,
      gradient: "from-green-500 to-green-600",
      path: "/trip",
    },
    {
      name: "Invoice",
      count: 56,
      icon: FileText,
      gradient: "from-purple-500 to-purple-600",
      path: "/vendor-invoice",
    },
    {
      name: "Payouts",
      count: 38,
      icon: DollarSign,
      gradient: "from-amber-500 to-amber-600",
      path: "/payouts",
    },
    {
      name: "Routes",
      count: 45,
      icon: Route,
      gradient: "from-indigo-500 to-indigo-600",
      path: "/route",
    },
    {
      name: "Quotes",
      count: 18,
      icon: Ticket,
      gradient: "from-red-500 to-red-600",
      path: "/quotes",
    },
    {
      name: "EPOD Upload",
      count: 4,
      icon: Upload,
      gradient: "from-cyan-500 to-cyan-600",
      path: "/epod-upload",
    },
  ];

   const reportSections = [
    {
      title: "Masters",
      color: "green",
      items: [
        { name: "Vendors", icon: Users, path: "/vendor" },
        { name: "Customers", icon: UserCheck, path: "/customer" },
        { name: "Customers Rate", icon: UserCheck, path: "/customer-rate" },
        // { name: "Drivers", icon: UserCheck, path: "/driver" },
        // { name: "Vehicles", icon: Truck, path: "/vehicle" },
        // { name: "Accounts", icon: Database, path: "/account-master" },
      ],
    },
    {
      title: "Indents",
      color: "blue",
      items: [
        { name: "Indents", icon: BookOpen, path: "/indents" },
        { name: "Vendor Rates", icon: DollarSign, path: "/vendor-rate" },
        { name: "Customer Booking Request", icon: Route, path: "/booking-request" },
        // { name: "Trip Planning", icon: Route, path: "/trip-planning" },
        // { name: "Vehicle Tracking", icon: Truck, path: "/vehicle-tracking" },
      ],
    },
     {
      title: "Planning",
      color: "yellow",
      items: [
        { name: "Route Planning", icon: FileText, path: "/route" },

      ],
    },
    {
      title: "Trips",
      color: "purple",
      items:[
        { name: "Trips", icon: FileText, path: "/trip" },
        { name: "Vehicles", icon: DollarSign, path: "/vehicle" },
        { name: "Driver", icon: BarChart3, path: "/driver" },
      ],
    },
     {
      title: "Invoice & Payouts",
      color: "orange",
      items:[
        { name: "Vendor Invoice", icon: FileText, path: "/vendor-invoice" },
        { name: "Payouts", icon: DollarSign, path: "/payouts" },
        { name: "General ledger", icon: BarChart3, path: "/general-ledger" },
        { name: "Charge Type", icon: BarChart3, path: "/charge-type" },
      ],
    },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 p-8">
      {/* Top Section with Gradient Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-4 shadow-lg text-white mb-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Welcome back 👋</h1>
            <p className="text-sm text-blue-100">
              Here’s what’s happening in your system today
            </p>
          </div>
          <button className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg hover:bg-white/30 transition-all text-sm text-white">
            <Filter className="h-4 w-4" /> Filter View
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-5">
          {shortcuts.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                onClick={() => navigate(item.path)}
                className="cursor-pointer relative group overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-20 transition-opacity`}
                />
                <div className="relative flex flex-col items-center text-center">
                  <div
                    className={`p-3 mb-3 rounded-xl bg-gradient-to-r ${item.gradient} text-white shadow-lg`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-gray-800 dark:text-gray-100 text-sm mb-1">
                    {item.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {item.count} Active
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reports & Master Data */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {reportSections.map((section, index) => (
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

export default Dashboard;
