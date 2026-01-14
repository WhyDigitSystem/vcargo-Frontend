import { clsx } from "clsx";
import Lottie from "lottie-react";
import {
  Bell,
  Car,
  ChartBar,
  FileText,
  Fuel,
  FuelIcon,
  Gauge,
  IndianRupee,
  LayoutDashboard,
  Route,
  Settings2,
  User,
  Wrench,
} from "lucide-react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

import truckAnimation from "../../assets/lottieflow-ecommerce.json";

const Sidebar = () => {
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
  const type = useSelector((state) => state.auth.user?.type);
  const navigate = useNavigate();

  console.log("User Type =>", type);

  // Redirect Sadmin / SuperAdmin / Admin
  useEffect(() => {
    if (["Sadmin", "SuperAdmin", "Admin"].includes(type)) {
      navigate("/dashboard/sadmin", { replace: true });
    }
  }, [type, navigate]);

  // List of completed modules for testing
  const completedModules = ["Drivers", "Vehicles", "Fuel", "Tyre"];

  // Essential Fleet Management Navigation (No scrolling needed)
  const navigation = [
    // Dashboard
    {
      name: "Dashboard",
      href: "/transporter",
      icon: LayoutDashboard,
      roles: ["Transporter", "FleetManager", "Admin"],
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      completed: false,
    },

    // Core Modules - Priority 1
    {
      name: "Trips",
      href: "/scheduling",
      icon: Route,
      roles: ["Transporter", "FleetManager", "Admin"],
      color: "text-emerald-500",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
      completed: false,
    },
    {
      name: "Invoices",
      href: "/invoice",
      icon: IndianRupee,
      roles: ["Transporter", "FleetManager", "Admin"],
      color: "text-amber-500",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      completed: false,
    },
    {
      name: "Vehicles",
      href: "/vehicles",
      icon: Car,
      roles: ["Transporter", "FleetManager", "Admin"],
      color: "text-red-500",
      bgColor: "bg-red-100 dark:bg-red-900/30",
      completed: false, // Completed module
    },
    // Core Modules - Priority 2
    {
      name: "Drivers",
      href: "/drivers",
      icon: User,
      roles: ["Transporter", "FleetManager", "Admin"],
      color: "text-cyan-500",
      bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
      completed: false, // Completed module
    },

    {
      name: "Fuel",
      href: "/fuel-management",
      icon: FuelIcon,
      roles: ["Transporter", "FleetManager", "Admin"],
      color: "text-orange-500",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      completed: false, // Completed module
    },

    {
      name: "Tyre",
      href: "/tyre-management",
      icon: Gauge,
      roles: ["Transporter", "FleetManager", "Admin"],
      color: "text-orange-500",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      completed: false, // Completed module
    },

    {
      name: "Maintenance",
      href: "/maintenance",
      icon: Wrench,
      roles: ["Transporter", "FleetManager", "Admin"],
      color: "text-orange-500",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      completed: false,
    },

    // Analytics & Reports
    {
      name: "Analytics",
      href: "/analytics",
      icon: ChartBar,
      roles: ["Transporter", "FleetManager", "Admin"],
      color: "text-indigo-500",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
      completed: false,
    },

    // Settings (at bottom)
    {
      name: "Settings",
      href: "/transporter/settings",
      icon: Settings2,
      roles: ["Transporter", "FleetManager", "Admin"],
      color: "text-gray-600",
      bgColor: "bg-gray-100 dark:bg-gray-900/30",
      completed: false,
    },
  ];

  // Optional: Move less-used items to "More" dropdown in settings
  const secondaryItems = [
    { name: "Fuel", href: "/fuel", icon: Fuel },
    { name: "Documents", href: "/documents", icon: FileText },
    { name: "Notifications", href: "/notifications", icon: Bell },
  ];

  // Filter menu based on role
  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(type)
  );

  const isAdmin = ["Sadmin", "SuperAdmin", "Admin"].includes(type);

  return (
    <aside
      className={clsx(
        "bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-all duration-300 h-full",
        sidebarOpen ? "w-56" : "w-16"
      )}
    >
      <nav className="h-full flex flex-col">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-2 mt-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
            <div className="w-24 h-24 mx-auto">
              <Lottie
                animationData={truckAnimation}
                loop
                autoplay
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
          {sidebarOpen && (
            <div className="text-left">
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                VCARGO
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Smart Fleet Management
              </p>
            </div>
          )}
        </div>

        {/* Module Status Indicator - Only show when sidebar is open */}

        {/* Main Navigation - No scrolling */}
        {!isAdmin && (
          <div className="flex-1 px-1.5 space-y-0.5">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const isCompleted = item.completed;

              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center border transition-all duration-200 group relative",
                      isActive
                        ? `border-blue-200 dark:border-blue-800 ${item.bgColor} ${item.color}`
                        : `border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white`,
                      sidebarOpen
                        ? "px-2 py-1.5 rounded-md"
                        : "p-1 rounded-full justify-center"
                    )
                  }
                >
                  {/* Green dot indicator for completed modules */}
                  {isCompleted && (
                    <div className="absolute -top-0.5 -right-0.5">
                      <div className="relative">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 opacity-75 animate-ping"></div>
                      </div>
                    </div>
                  )}

                  <div
                    className={clsx(
                      "rounded-md transition-colors duration-200 relative",
                      sidebarOpen
                        ? `${item.bgColor} p-1.5`
                        : "group-hover:bg-gray-100 dark:group-hover:bg-gray-800 p-1.5"
                    )}
                  >
                    <Icon
                      className={clsx(
                        "flex-shrink-0 transition-colors duration-200",
                        sidebarOpen
                          ? `h-4 w-4 ${item.color}`
                          : "h-4 w-4 group-hover:text-gray-900 dark:group-hover:text-white"
                      )}
                    />
                  </div>
                  {sidebarOpen && (
                    <div className="ml-2.5 flex-1 min-w-0 flex items-center justify-between">
                      <span className="text-sm font-medium truncate">
                        {item.name}
                      </span>
                      {isCompleted && (
                        <span className="text-[10px] text-green-600 dark:text-green-400 font-medium px-1.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30">
                          Test
                        </span>
                      )}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </div>
        )}

        {/* Completed modules summary - Only show when sidebar is open */}
        {/* {sidebarOpen && !isAdmin && completedModules.length > 0 && (
          <div className="px-2 py-1 border-t border-gray-100 dark:border-gray-800">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Testing Modules ({completedModules.length})
            </div>
            <div className="flex flex-wrap gap-1">
              {completedModules.map((moduleName) => (
                <div
                  key={moduleName}
                  className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  <span>{moduleName}</span>
                </div>
              ))}
            </div>
          </div>
        )} */}

        {/* Optional: Quick access to secondary items (only when sidebar is open) */}

        {/* Footer */}
        {sidebarOpen && (
          <div className="px-2 py-1 border-t border-gray-100 dark:border-gray-800">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              v2.0
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
