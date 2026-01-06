import { Car, Users, Activity, DollarSign, Map, Calendar } from "lucide-react";

export const FuelAnalytics = ({ vehicles, fuelEntries, drivers }) => {
  // Vehicle Efficiency
  const vehicleEfficiencies = vehicles.map(vehicle => {
    const vehicleEntries = fuelEntries.filter(entry => entry.vehicleId === vehicle.id);
    const totalEfficiency = vehicleEntries.reduce((sum, entry) => 
      sum + parseFloat(entry.efficiency.split(' ')[0]), 0
    );
    const avgEfficiency = vehicleEntries.length > 0 
      ? (totalEfficiency / vehicleEntries.length).toFixed(2)
      : 0;
    
    return { ...vehicle, avgEfficiency, entries: vehicleEntries.length };
  });

  // Fuel Cost Analysis
  const vehicleCosts = vehicles.slice(0, 5).map(vehicle => {
    const vehicleEntries = fuelEntries.filter(entry => entry.vehicleId === vehicle.id);
    const totalCost = vehicleEntries.reduce((sum, entry) => 
      sum + parseFloat(entry.cost.replace('$', '')), 0
    );
    return { ...vehicle, totalCost };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Vehicle Efficiency */}
      <AnalyticsCard title="Vehicle Efficiency Ranking" icon={Car}>
        <div className="space-y-4">
          {vehicleEfficiencies.map(vehicle => (
            <div key={vehicle.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Car className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{vehicle.registrationNumber}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{vehicle.make} {vehicle.model}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${
                  vehicle.avgEfficiency > 6 ? "text-emerald-600" :
                  vehicle.avgEfficiency > 4 ? "text-amber-600" :
                  "text-red-600"
                }`}>
                  {vehicle.avgEfficiency} km/l
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{vehicle.entries} refuels</p>
              </div>
            </div>
          ))}
        </div>
      </AnalyticsCard>

      {/* Fuel Cost Analysis */}
      <AnalyticsCard title="Fuel Cost Analysis" icon={DollarSign}>
        <div className="space-y-4">
          {vehicleCosts.map(vehicle => {
            const percentage = Math.min((vehicle.totalCost / 5000) * 100, 100);
            return (
              <div key={vehicle.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-900 dark:text-white">{vehicle.registrationNumber}</span>
                  <span className="text-gray-600 dark:text-gray-400">${vehicle.totalCost.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </AnalyticsCard>

      {/* Driver Performance */}
      <AnalyticsCard title="Driver Performance" icon={Users}>
        <div className="space-y-3">
          {drivers.map(driver => {
            const driverEntries = fuelEntries.filter(entry => entry.driverId === driver.id);
            const totalEfficiency = driverEntries.reduce((sum, entry) => 
              sum + parseFloat(entry.efficiency.split(' ')[0]), 0
            );
            const avgEfficiency = driverEntries.length > 0 
              ? (totalEfficiency / driverEntries.length).toFixed(2)
              : 0;
            
            return (
              <div key={driver.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">{driver.name}</span>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    avgEfficiency > 6 ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" :
                    avgEfficiency > 4 ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" :
                    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                  }`}>
                    {avgEfficiency} km/l
                  </span>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{driverEntries.length} entries</p>
                </div>
              </div>
            );
          })}
        </div>
      </AnalyticsCard>

      {/* Monthly Trends */}
      <AnalyticsCard title="Monthly Fuel Consumption" icon={Calendar}>
        <div className="space-y-4">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => {
            const mockCost = Math.floor(Math.random() * 5000) + 2000;
            return (
              <div key={month} className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400 w-16">{month} 2024</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full"
                      style={{ width: `${(mockCost / 7000) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="font-medium text-gray-900 dark:text-white w-20 text-right">
                  ${mockCost.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </AnalyticsCard>
    </div>
  );
};

const AnalyticsCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
        <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
    </div>
    {children}
  </div>
);