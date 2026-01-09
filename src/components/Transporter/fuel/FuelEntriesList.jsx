import {
  Calendar,
  Car,
  ChevronDown,
  ChevronUp,
  Edit,
  Eye,
  Filter,
  Fuel,
  Search,
  Trash2,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";

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
  isLoading = false,
}) => {
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    vehicle: "",
    driver: "",
    fuelType: "",
    dateRange: { start: "", end: "" },
  });

  // Filter and sort entries
  const filteredAndSortedEntries = useMemo(() => {
    let result = [...entries];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (entry) =>
          entry.vehicle.toLowerCase().includes(term) ||
          entry.driver.toLowerCase().includes(term) ||
          entry.station.toLowerCase().includes(term) ||
          entry.receiptNumber.toLowerCase().includes(term)
      );
    }

    // Apply filters
    if (filters.vehicle) {
      result = result.filter((entry) => entry.vehicle === filters.vehicle);
    }
    if (filters.driver) {
      result = result.filter((entry) => entry.driver === filters.driver);
    }
    if (filters.fuelType) {
      result = result.filter((entry) => entry.fuelType === filters.fuelType);
    }
    if (filters.dateRange.start) {
      result = result.filter((entry) => entry.date >= filters.dateRange.start);
    }
    if (filters.dateRange.end) {
      result = result.filter((entry) => entry.date <= filters.dateRange.end);
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle special cases for sorting
        if (sortConfig.key === "cost") {
          aValue = a.costValue;
          bValue = b.costValue;
        }
        if (sortConfig.key === "efficiency") {
          aValue = parseFloat(a.efficiency) || 0;
          bValue = parseFloat(b.efficiency) || 0;
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [entries, searchTerm, filters, sortConfig]);

  // Get unique values for filter dropdowns
  const uniqueVehicles = useMemo(
    () => [...new Set(entries.map((entry) => entry.vehicle))],
    [entries]
  );

  const uniqueDrivers = useMemo(
    () => [...new Set(entries.map((entry) => entry.driver))],
    [entries]
  );

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      vehicle: "",
      driver: "",
      fuelType: "",
      dateRange: { start: "", end: "" },
    });
  };

  const SortableHeader = ({ children, sortKey, className = "" }) => (
    <th
      className={`py-4 px-6 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${className}`}
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortConfig.key === sortKey &&
          (sortConfig.direction === "asc" ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          ))}
      </div>
    </th>
  );

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">
            Loading entries...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Filters and Search Bar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by vehicle, driver, station..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(searchTerm ||
              filters.vehicle ||
              filters.driver ||
              filters.fuelType) && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Clear filters
              </button>
            )}
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {filteredAndSortedEntries.length} of {entries.length} entries
            </span>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              <Car className="inline h-3 w-3 mr-1" /> Vehicle
            </label>
            <select
              value={filters.vehicle}
              onChange={(e) =>
                setFilters({ ...filters, vehicle: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="">All Vehicles</option>
              {uniqueVehicles.map((vehicle) => (
                <option key={vehicle} value={vehicle}>
                  {vehicle}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              <User className="inline h-3 w-3 mr-1" /> Driver
            </label>
            <select
              value={filters.driver}
              onChange={(e) =>
                setFilters({ ...filters, driver: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="">All Drivers</option>
              {uniqueDrivers.map((driver) => (
                <option key={driver} value={driver}>
                  {driver}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              <Fuel className="inline h-3 w-3 mr-1" /> Fuel Type
            </label>
            <select
              value={filters.fuelType}
              onChange={(e) =>
                setFilters({ ...filters, fuelType: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="">All Fuel Types</option>
              {fuelTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              <Calendar className="inline h-3 w-3 mr-1" /> Date Range
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    dateRange: { ...filters.dateRange, start: e.target.value },
                  })
                }
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    dateRange: { ...filters.dateRange, end: e.target.value },
                  })
                }
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="py-4 px-6 text-left w-12">
                <input
                  type="checkbox"
                  checked={
                    selectedEntries.length ===
                      filteredAndSortedEntries.length &&
                    filteredAndSortedEntries.length > 0
                  }
                  onChange={() => handleSelectEntry("all")}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <SortableHeader sortKey="vehicle">Vehicle</SortableHeader>
              <SortableHeader sortKey="driver">Driver</SortableHeader>
              <SortableHeader sortKey="date">Date & Time</SortableHeader>
              <SortableHeader sortKey="quantity">Quantity</SortableHeader>
              <SortableHeader sortKey="cost">Cost</SortableHeader>
              <SortableHeader sortKey="efficiency">Efficiency</SortableHeader>
              <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredAndSortedEntries.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-12 px-6 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                    <Filter className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No entries found</p>
                    <p className="text-sm">
                      {searchTerm || Object.values(filters).some((v) => v)
                        ? "Try adjusting your search or filters"
                        : "No fuel entries available"}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredAndSortedEntries.map((entry) => {
                const fuelType = fuelTypes.find((t) => t.id === entry.fuelType);
                const efficiencyValue = parseFloat(entry.efficiency) || 0;

                return (
                  <tr
                    key={entry.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
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
                          {fuelType?.icon || <Fuel className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {entry.vehicle}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            <span>📏</span>
                            {entry.odometerReading.toLocaleString()} km
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {entry.driver}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ⛽ {entry.station}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(entry.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          🕒 {entry.time}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {entry.quantity}{" "}
                          <span className="text-sm">{entry.unit}</span>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          @ {entry.costPerUnit}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-lg text-gray-900 dark:text-white">
                          {entry.cost}
                        </p>
                        {efficiencyValue > 0 && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {entry.distance} km travelled
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`px-3 py-1.5 rounded-full text-sm font-medium ${getEfficiencyColor(
                            entry.efficiency
                          )} inline-flex items-center justify-center`}
                        >
                          {entry.efficiency}
                        </span>
                        {efficiencyValue > 0 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            {entry.distance} km / {entry.quantity} L
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
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
                          title="Edit Entry"
                        />
                        <ActionButton
                          onClick={() => handleDeleteClick(entry)}
                          icon={Trash2}
                          color="red"
                          title="Delete Entry"
                        />
                      </div>
                      {entry.receiptNumber && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Receipt: {entry.receiptNumber}
                        </p>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with summary */}
      {filteredAndSortedEntries.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {selectedEntries.length > 0 ? (
                <span>
                  {selectedEntries.length} of {filteredAndSortedEntries.length}{" "}
                  entries selected
                </span>
              ) : (
                <span>Showing {filteredAndSortedEntries.length} entries</span>
              )}
            </div>

            <div className="flex items-center gap-6">
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Total Cost:{" "}
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  ₹
                  {filteredAndSortedEntries
                    .reduce((sum, entry) => sum + entry.costValue, 0)
                    .toLocaleString("en-IN")}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Total Quantity:{" "}
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {filteredAndSortedEntries.reduce(
                    (sum, entry) => sum + entry.quantity,
                    0
                  )}{" "}
                  liters
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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
      className={`p-2 text-gray-600 dark:text-gray-400 rounded-lg transition-colors ${colorClasses[color]}`}
      title={title}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
};
