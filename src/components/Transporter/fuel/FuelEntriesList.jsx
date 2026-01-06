import { Edit, Eye, Trash2 } from "lucide-react";

export const FuelEntriesList = ({
  entries,
  selectedEntries,
  handleSelectEntry,
  handleViewDetails,
  handleEdit,
  handleDeleteClick,
  fuelTypes,
  getFuelTypeColor,
  getEfficiencyColor,
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th className="py-4 px-6 text-left w-12">
              <input
                type="checkbox"
                checked={
                  selectedEntries.length === entries.length &&
                  entries.length > 0
                }
                onChange={() => handleSelectEntry("all")}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </th>
            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Vehicle
            </th>
            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Driver
            </th>
            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Date
            </th>
            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Quantity
            </th>
            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Cost
            </th>
            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Efficiency
            </th>
            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {entries.map((entry) => {
            const fuelType = fuelTypes.find((t) => t.id === entry.fuelType);
            return (
              <tr
                key={entry.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/30"
              >
                <td className="py-4 px-6">
                  <input
                    type="checkbox"
                    checked={selectedEntries.includes(entry.id)}
                    onChange={() => handleSelectEntry(entry.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${getFuelTypeColor(
                        entry.fuelType
                      )}`}
                    >
                      {fuelType?.icon}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {entry.vehicle}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {entry.odometerReading.toLocaleString()} km
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <p className="text-gray-900 dark:text-white">
                    {entry.driver}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {entry.station}
                  </p>
                </td>
                <td className="py-4 px-6">
                  <p className="text-gray-900 dark:text-white">{entry.date}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {entry.time}
                  </p>
                </td>
                <td className="py-4 px-6">
                  <p className="text-gray-900 dark:text-white">
                    {entry.quantity} {entry.unit}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {entry.costPerUnit}
                  </p>
                </td>
                <td className="py-4 px-6">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {entry.cost}
                  </p>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getEfficiencyColor(
                      entry.efficiency
                    )}`}
                  >
                    {entry.efficiency}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <ActionButton
                      onClick={() => handleViewDetails(entry)}
                      icon={Eye}
                      color="blue"
                    />
                    <ActionButton
                      onClick={() => handleEdit(entry)}
                      icon={Edit}
                      color="emerald"
                    />
                    <ActionButton
                      onClick={() => handleDeleteClick(entry)}
                      icon={Trash2}
                      color="red"
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

const ActionButton = ({ onClick, icon: Icon, color }) => {
  const colorClasses = {
    blue: "hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20",
    emerald:
      "hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20",
    red: "hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20",
  };

  return (
    <button
      onClick={onClick}
      className={`p-2 text-gray-600 dark:text-gray-400 rounded-lg ${colorClasses[color]}`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
};
