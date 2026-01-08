import {
  AlertTriangle,
  ChevronDown,
  Download,
  Filter,
  Search,
  Trash2,
  X,
} from "lucide-react";

export const TyreFilters = ({
  filters,
  setFilters,
  vehicles,
  selectedEntries,
  onExport,
  onBulkDelete,
  onClearFilters,
}) => {
  const statusOptions = [
    { id: "all", name: "All Status" },
    { id: "new", name: "New" },
    { id: "used", name: "Used" },
    { id: "damaged", name: "Damaged" },
    { id: "replaced", name: "Replaced" },
  ];

  const positionOptions = [
    { id: "all", name: "All Positions" },
    { id: "front", name: "Front" },
    { id: "rear", name: "Rear" },
    { id: "spare", name: "Spare" },
  ];

  const conditionOptions = [
    { id: "all", name: "All Conditions" },
    { id: "good", name: "Good" },
    { id: "fair", name: "Fair" },
    { id: "poor", name: "Poor" },
    { id: "critical", name: "Critical" },
  ];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    if (onClearFilters) {
      onClearFilters();
    } else {
      setFilters({
        search: "",
        status: "all",
        vehicleId: "all",
        position: "all",
        condition: "all",
      });
    }
  };

  const hasActiveFilters =
    filters.search ||
    filters.status !== "all" ||
    filters.vehicleId !== "all" ||
    filters.position !== "all" ||
    filters.condition !== "all";

  const getVehicleOptions = () => {
    const baseOptions = [
      { id: "all", name: "All Vehicles", registrationNumber: "All Vehicles" },
    ];

    if (!vehicles || vehicles.length === 0) {
      return baseOptions;
    }

    return [
      ...baseOptions,
      ...vehicles.map((vehicle) => ({
        id: vehicle.vehicleId || vehicle.id,
        name: vehicle.registrationNumber || vehicle.make || "Unknown Vehicle",
        registrationNumber:
          vehicle.registrationNumber || `${vehicle.make} ${vehicle.model}`,
      })),
    ];
  };

  const vehicleOptions = getVehicleOptions();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filters
          </h3>
        </div>

        {/* Bulk Actions */}
        {selectedEntries.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedEntries.length} selected
            </span>
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 text-xs font-medium transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
            <button
              onClick={onBulkDelete}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 text-xs font-medium transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search by serial number, brand, model, vehicle..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {filters.search && (
              <button
                onClick={() => handleFilterChange("search", "")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="h-3 w-3 text-gray-400 dark:text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <FilterSelect
            value={filters.status}
            onChange={(value) => handleFilterChange("status", value)}
            options={statusOptions}
            label="Status"
            icon="status"
          />
          <FilterSelect
            value={filters.position}
            onChange={(value) => handleFilterChange("position", value)}
            options={positionOptions}
            label="Position"
            icon="position"
          />
          <FilterSelect
            value={filters.condition}
            onChange={(value) => handleFilterChange("condition", value)}
            options={conditionOptions}
            label="Condition"
            icon="condition"
          />
          <FilterSelect
            value={filters.vehicleId}
            onChange={(value) => handleFilterChange("vehicleId", value)}
            options={vehicleOptions}
            label="Vehicle"
            icon="vehicle"
          />
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
              Active filters:
            </span>

            {filters.search && (
              <FilterChip
                label={`Search: "${filters.search}"`}
                onRemove={() => handleFilterChange("search", "")}
              />
            )}

            {filters.status !== "all" && (
              <FilterChip
                label={`Status: ${
                  statusOptions.find((s) => s.id === filters.status)?.name
                }`}
                onRemove={() => handleFilterChange("status", "all")}
              />
            )}

            {filters.position !== "all" && (
              <FilterChip
                label={`Position: ${
                  positionOptions.find((p) => p.id === filters.position)?.name
                }`}
                onRemove={() => handleFilterChange("position", "all")}
              />
            )}

            {filters.condition !== "all" && (
              <FilterChip
                label={`Condition: ${
                  conditionOptions.find((c) => c.id === filters.condition)?.name
                }`}
                onRemove={() => handleFilterChange("condition", "all")}
              />
            )}

            {filters.vehicleId !== "all" && (
              <FilterChip
                label={`Vehicle: ${
                  vehicleOptions.find((v) => v.id === filters.vehicleId)
                    ?.registrationNumber || filters.vehicleId
                }`}
                onRemove={() => handleFilterChange("vehicleId", "all")}
              />
            )}

            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 ml-2 font-medium"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* No Vehicles Warning */}
      {vehicleOptions.length === 1 && (
        <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                No vehicles found. Tyres cannot be assigned to vehicles until
                vehicles are added to the system.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FilterSelect = ({ value, onChange, options, label, icon }) => {
  const getIconColor = () => {
    switch (icon) {
      case "status":
        return "text-purple-500";
      case "position":
        return "text-blue-500";
      case "condition":
        return "text-emerald-500";
      case "vehicle":
        return "text-orange-500";
      default:
        return "text-gray-500";
    }
  };

  const getSelectedLabel = () => {
    if (value === "all") return label;
    const option = options.find((opt) => opt.id === value);
    return option ? option.name : label;
  };

  return (
    <div className="relative group">
      <div
        className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${getIconColor()}`}
      >
        <div className="w-2 h-2 rounded-full bg-current"></div>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg pl-8 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm hover:border-gray-400 dark:hover:border-gray-500 transition-all cursor-pointer"
      >
        {options?.map((option) => (
          <option
            key={option.id}
            value={option.id}
            className="text-gray-900 dark:text-gray-100 py-2"
          >
            {option.name}
          </option>
        ))}
      </select>
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
      </div>
      <div className="absolute -top-2 left-2 px-1 text-xs bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
        {label}
      </div>
    </div>
  );
};

const FilterChip = ({ label, onRemove }) => (
  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium group hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
    <span className="flex items-center gap-1.5">
      <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
      {label}
    </span>
    <button
      onClick={onRemove}
      className="p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800 rounded transition-colors"
      aria-label="Remove filter"
    >
      <X className="h-3 w-3" />
    </button>
  </div>
);
