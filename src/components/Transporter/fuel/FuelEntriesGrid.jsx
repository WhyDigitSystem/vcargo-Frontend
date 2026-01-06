import { Edit, Eye, Trash2 } from "lucide-react";

export const FuelEntriesGrid = ({
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
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {entries.map((entry) => {
      const fuelType = fuelTypes.find((t) => t.id === entry.fuelType);
      return (
        <div
          key={entry.id}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="p-5">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={selectedEntries.includes(entry.id)}
                    onChange={() => handleSelectEntry(entry.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                    {entry.id}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {entry.vehicle}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {entry.driver}
                </p>
              </div>
              <div
                className={`px-3 py-1 rounded-full flex items-center gap-1 text-sm ${getFuelTypeColor(
                  entry.fuelType
                )}`}
              >
                {fuelType?.icon}
                {fuelType?.name}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-6">
              <DetailRow
                label="Quantity"
                value={`${entry.quantity} ${entry.unit}`}
              />
              <DetailRow
                label="Cost"
                value={`${entry.cost} (${entry.costPerUnit})`}
              />
              <DetailRow
                label="Efficiency"
                value={
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getEfficiencyColor(
                      entry.efficiency
                    )}`}
                  >
                    {entry.efficiency}
                  </span>
                }
              />
              <DetailRow
                label="Date & Time"
                value={`${entry.date} • ${entry.time}`}
              />
              <DetailRow label="Station" value={entry.station} truncate />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <ActionButton
                  onClick={() => handleViewDetails(entry)}
                  icon={Eye}
                  color="blue"
                  title="View Details"
                />
                <ActionButton
                  onClick={() => handleEdit(entry)}
                  icon={Edit}
                  color="emerald"
                  title="Edit"
                />
                <ActionButton
                  onClick={() => handleDeleteClick(entry)}
                  icon={Trash2}
                  color="red"
                  title="Delete"
                />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Receipt: {entry.receiptNumber}
              </span>
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

const DetailRow = ({ label, value, truncate = false }) => (
  <div className="flex justify-between">
    <span className="text-gray-600 dark:text-gray-400">{label}</span>
    {truncate ? (
      <span className="font-medium text-gray-900 dark:text-white truncate ml-2 max-w-[150px]">
        {value}
      </span>
    ) : (
      <span className="font-medium text-gray-900 dark:text-white">{value}</span>
    )}
  </div>
);

const ActionButton = ({ onClick, icon: Icon, color, title }) => {
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
      title={title}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
};
