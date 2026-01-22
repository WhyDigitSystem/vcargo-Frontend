import { Search, Filter, Download, Navigation, MapPin, Calendar, ChevronDown, X } from "lucide-react";

export const TripFilters = ({
  filters,
  setFilters,
  vehicles = [],
  drivers = [],
  customers = [],
  selectedTrips,
  onBulkAction
}) => {
  const statusOptions = [
    { id: "all", name: "ALL STATUS" },
    { id: "SCHEDULED", name: "SCHEDULED" },
    { id: "PENDING", name: "PENDING" },
    { id: "IN_PROGRESS", name: "IN_PROGRESS" },
    { id: "COMPLETED", name: "COMPLETED" },
    { id: "CANCELLED", name: "CANCELLED" },
  ];

  const dateRangeOptions = [
    { id: "all", name: "All Time" },
    { id: "today", name: "Today" },
    { id: "week", name: "This Week" },
    { id: "month", name: "This Month" },
    { id: "upcoming", name: "Upcoming" },
  ];

  const tripTypeOptions = [
    { id: "all", name: "All Types" },
    { id: "freight", name: "Freight" },
    { id: "passenger", name: "Passenger" },
    { id: "return", name: "Return" },
    { id: "local", name: "Local" },
    { id: "long_haul", name: "Long Haul" },
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "all",
      vehicleId: "all",
      driverId: "all",
      customerId: "all",
      dateRange: "all",
    });
  };

  const hasActiveFilters = Object.values(filters).some(
    value => value !== "" && value !== "all"
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-center">
        {/* Search */}
        <div className="w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search by trip number, customer, source, destination..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {filters.search && (
              <button
                onClick={() => handleFilterChange("search", "")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X className="h-3 w-3 text-gray-400 dark:text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3 justify-end flex-wrap">
          <FilterSelect
            value={filters.status}
            onChange={(value) => handleFilterChange("status", value)}
            options={statusOptions}
            label="All Status"
          />
          <FilterSelect
            value={filters.vehicleId}
            onChange={(value) => handleFilterChange("vehicleId", value)}
            options={vehicles}
            label="All Vehicles"
            useRegistration={true}
          />
          <FilterSelect
            value={filters.driverId}
            onChange={(value) => handleFilterChange("driverId", value)}
            options={drivers}
            label="All Drivers"
            useName={true}
          />
          <FilterSelect
            value={filters.customerId}
            onChange={(value) => handleFilterChange("customerId", value)}
            options={customers}
            label="All Customers"
            useName={true}
          />
        </div>
      </div>

      {/* Additional Filters */}
      <div className="mt-4 flex items-center gap-3">
        <FilterSelect
          value={filters.dateRange}
          onChange={(value) => handleFilterChange("dateRange", value)}
          options={dateRangeOptions}
          label="Date Range"
        />
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600">
          <Filter className="h-4 w-4" />
          More Filters
        </button>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-500 dark:text-gray-400">Active filters:</span>

            {filters.search && (
              <FilterChip
                label={`Search: "${filters.search}"`}
                onRemove={() => handleFilterChange("search", "")}
              />
            )}

            {filters.status !== "all" && (
              <FilterChip
                label={`Status: ${statusOptions.find(s => s.id === filters.status)?.name}`}
                onRemove={() => handleFilterChange("status", "all")}
              />
            )}

            {filters.vehicleId !== "all" && (
              <FilterChip
                label={`Vehicle: ${vehicles.find(v => v.id === filters.vehicleId)?.registrationNumber}`}
                onRemove={() => handleFilterChange("vehicleId", "all")}
              />
            )}

            {filters.driverId !== "all" && (
              <FilterChip
                label={`Driver: ${drivers.find(d => d.id === filters.driverId)?.name}`}
                onRemove={() => handleFilterChange("driverId", "all")}
              />
            )}

            {filters.customerId !== "all" && (
              <FilterChip
                label={`Customer: ${customers.find(c => c.id === filters.customerId)?.name}`}
                onRemove={() => handleFilterChange("customerId", "all")}
              />
            )}

            {filters.dateRange !== "all" && (
              <FilterChip
                label={`Date: ${dateRangeOptions.find(d => d.id === filters.dateRange)?.name}`}
                onRemove={() => handleFilterChange("dateRange", "all")}
              />
            )}

            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 ml-2"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedTrips.length > 0 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
              <div>
                <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {selectedTrips.length} trip(s) selected
                </div>
                <div className="text-xs text-blue-600/70 dark:text-blue-400/70">
                  Total distance: {selectedTrips.reduce((sum, id) => {
                    const trip = selectedTrips.find(t => t.id === id);
                    return sum + (trip?.distance || 0);
                  }, 0)} km
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onBulkAction("export")}
                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <button
                onClick={() => onBulkAction("start")}
                className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium"
              >
                <Navigation className="h-4 w-4" />
                Start Selected
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FilterSelect = ({ value, onChange, options, label, useName = false, useRegistration = false }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-w-[140px] hover:border-gray-400 dark:hover:border-gray-500"
    >
      <option value="all" className="text-gray-500 dark:text-gray-400">{label}</option>
      {options?.map((option) => (
        <option key={option.id} value={option.id} className="text-gray-900 dark:text-gray-100">
          {useName ? option.name : useRegistration ? option.registrationNumber : option.name}
        </option>
      ))}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
  </div>
);

const FilterChip = ({ label, onRemove }) => (
  <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm">
    {label}
    <button
      onClick={onRemove}
      className="p-0.5 hover:bg-blue-100 dark:hover:bg-blue-800 rounded"
    >
      <X className="h-3 w-3" />
    </button>
  </div>
);