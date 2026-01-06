import { clsx } from "clsx";
import Lottie from "lottie-react";
import {
  Bell,
  Car,
  ChartBar,
  CircleDot,
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
    },

    // Core Modules - Priority 1
    {
      name: "Vehicles",
      href: "/vehicles",
      icon: Car,
      roles: ["Transporter", "FleetManager", "Admin"],
      color: "text-red-500",
      bgColor: "bg-red-100 dark:bg-red-900/30",
    },
    {
      name: "Trips",
      href: "/scheduling",
      icon: Route,
      roles: ["Transporter", "FleetManager", "Admin"],
      color: "text-emerald-500",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      name: "Invoices",
      href: "/invoice",
      icon: IndianRupee,
      roles: ["Transporter", "FleetManager", "Admin"],
      color: "text-amber-500",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
    },

    // Core Modules - Priority 2
    {
      name: "Drivers",
      href: "/drivers",
      icon: User,
      roles: ["Transporter", "FleetManager", "Admin"],
      color: "text-cyan-500",
      bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
    },
    {
      name: "Maintenance",
      href: "/maintenance",
      icon: Wrench,
      roles: ["Transporter", "FleetManager", "Admin"],
      color: "text-orange-500",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },

    {
      name: "Fuel",
      href: "/fuel-management",
      icon: FuelIcon,
      roles: ["Transporter", "FleetManager", "Admin"],
      color: "text-orange-500",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },

    {
      name: "Tyre",
      href: "/tyre-management",
      icon: Gauge,
      roles: ["Transporter", "FleetManager", "Admin"],
      color: "text-orange-500",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },

    // Analytics & Reports
    {
      name: "Analytics",
      href: "/analytics",
      icon: ChartBar,
      roles: ["Transporter", "FleetManager", "Admin"],
      color: "text-indigo-500",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    },

    // Settings (at bottom)
    {
      name: "Settings",
      href: "/transporter/settings",
      icon: Settings2,
      roles: ["Transporter", "FleetManager", "Admin"],
      color: "text-gray-600",
      bgColor: "bg-gray-100 dark:bg-gray-900/30",
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

        {/* Main Navigation - No scrolling */}
        {!isAdmin && (
          <div className="flex-1 px-1.5 space-y-0.5">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center border transition-all duration-200 group",
                      isActive
                        ? `border-blue-200 dark:border-blue-800 ${item.bgColor} ${item.color}`
                        : `border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white`,
                      sidebarOpen
                        ? "px-2 py-1.5 rounded-md"
                        : "p-1 rounded-full justify-center"
                    )
                  }
                >
                  <div
                    className={clsx(
                      "rounded-md transition-colors duration-200",
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
                    <span className="ml-2.5 text-sm font-medium truncate">
                      {item.name}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        )}

        {/* Optional: Quick access to secondary items (only when sidebar is open) */}
        {sidebarOpen && !isAdmin && secondaryItems.length > 0 && (
          <div className="px-2 py-1 border-t border-gray-100 dark:border-gray-800">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Quick Access
            </div>
            <div className="grid grid-cols-3 gap-1">
              {secondaryItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className="flex flex-col items-center p-1.5 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                    title={item.name}
                  >
                    <Icon className="h-3 w-3 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 truncate w-full text-center">
                      {item.name}
                    </span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}

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
