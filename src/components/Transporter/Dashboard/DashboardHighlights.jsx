import { Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { dashboardAPI } from "../../../api/dashboardAPI";

const DashboardHighlights = () => {
  const { user } = useSelector((state) => state.auth);
  const orgId = user?.orgId;

  const [vehicleStats, setVehicleStats] = useState({
    active: 0,
    onTrip: 0,
    maintenance: 0,
  });

  const getVehicleStatus = async () => {
    try {
      const response = await dashboardAPI.getVehicleStatus({ orgId });

      if (response?.status) {
        const vehicles = response?.paramObjectsMap?.vehicles || {};

        setVehicleStats({
          active: vehicles.activeVehicles || 0,
          onTrip: vehicles.onTripVehicles || 0,
          maintenance: vehicles.maintenanceVehicles || 0,
        });
      }
    } catch (error) {
      console.error("Vehicle Status API Error:", error);
    }
  };

  useEffect(() => {
    if (orgId) getVehicleStatus();
  }, [orgId]);

  const totalFleet =
    vehicleStats.active + vehicleStats.onTrip + vehicleStats.maintenance;

  const utilization = totalFleet
    ? Math.round((vehicleStats.onTrip / totalFleet) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Vehicle Utilization */}
      <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur hover:shadow-lg transition">
        <div className="absolute left-0 top-0 h-full w-1 bg-blue-500" />

        <div className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Vehicle Utilization
                </p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {utilization}%
                </h3>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 text-center">
            <div>
              <p className="font-semibold text-blue-500 text-md">
                {vehicleStats.onTrip}
              </p>
              <p className="text-gray-400 text-sm">On Trip</p>
            </div>

            <div>
              <p className="font-semibold text-emerald-500 text-md">
                {vehicleStats.active}
              </p>
              <p className="text-gray-400 text-sm">Active</p>
            </div>

            <div>
              <p className="font-semibold text-red-500 text-md">
                {vehicleStats.maintenance}
              </p>
              <p className="text-gray-400 text-sm">Maintenance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Snapshot (still static for now) */}
      {/* <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur hover:shadow-lg transition">

        <div className="absolute left-0 top-0 h-full w-1 bg-emerald-500" />

        <div className="p-5">
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <IndianRupee className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Revenue Snapshot
                </p>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  ₹3,42,000
                </h3>
              </div>
            </div>

            <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              +12%
            </span>
          </div>

          <div className="mt-5 grid grid-cols-3 text-center text-xs">

            <div>
              <p className="font-semibold text-emerald-500">₹18,400</p>
              <p className="text-gray-400">Today</p>
            </div>

            <div>
              <p className="font-semibold text-blue-500">₹96,000</p>
              <p className="text-gray-400">Week</p>
            </div>

            <div>
              <p className="font-semibold text-purple-500">₹3,42,000</p>
              <p className="text-gray-400">Month</p>
            </div>

          </div>
        </div>
      </div> */}
    </div>
  );
};

export default DashboardHighlights;
