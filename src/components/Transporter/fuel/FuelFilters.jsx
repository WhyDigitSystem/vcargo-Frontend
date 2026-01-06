import { ChevronDown, Download, Filter, Search, Trash2, X } from "lucide-react";
import { useState } from "react";

export const FuelFilters = ({
  searchQuery,
  setSearchQuery,
  filterVehicle,
  setFilterVehicle,
  filterDriver,
  setFilterDriver,
  filterPeriod,
  setFilterPeriod,
  vehicles,
  drivers,
  selectedEntries,
  handleExport,
  handleBulkDelete,
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 mb-6 shadow-sm">
      {/* Main Filter Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Search Input */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search by vehicle, driver, station, receipt..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:placeholder-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X className="h-3 w-3 text-gray-400 dark:text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Desktop Filter Controls */}
        <div className="hidden md:flex items-center gap-3">
          <FilterSelect
            value={filterVehicle}
            onChange={setFilterVehicle}
            options={vehicles}
            label="All Vehicles"
            icon={<ChevronDown className="h-4 w-4" />}
          />
          <FilterSelect
            value={filterDriver}
            onChange={setFilterDriver}
            options={drivers}
            label="All Drivers"
            icon={<ChevronDown className="h-4 w-4" />}
          />
          <FilterSelect
            value={filterPeriod}
            onChange={setFilterPeriod}
            options={periods}
            label="All Time"
            icon={<ChevronDown className="h-4 w-4" />}
          />
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300"
        >
          <Filter className="h-4 w-4" />
          Filters
          {(filterVehicle !== "all" ||
            filterDriver !== "all" ||
            filterPeriod !== "all") && (
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          )}
        </button>
      </div>

      {/* Mobile Filters Dropdown */}
      {showMobileFilters && (
        <div className="md:hidden mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filters
            </span>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            >
              <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <div className="space-y-3">
            <FilterSelect
              value={filterVehicle}
              onChange={setFilterVehicle}
              options={vehicles}
              label="All Vehicles"
              fullWidth
            />
            <FilterSelect
              value={filterDriver}
              onChange={setFilterDriver}
              options={drivers}
              label="All Drivers"
              fullWidth
            />
            <FilterSelect
              value={filterPeriod}
              onChange={setFilterPeriod}
              options={periods}
              label="All Time"
              fullWidth
            />
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedEntries.length > 0 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
              <div>
                <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {selectedEntries.length} entry(s) selected
                </div>
                <div className="text-xs text-blue-600/70 dark:text-blue-400/70">
                  Perform actions on selected entries
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-sm font-medium"
              >
                <Trash2 className="h-4 w-4" />
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters */}
      {(filterVehicle !== "all" ||
        filterDriver !== "all" ||
        filterPeriod !== "all" ||
        searchQuery) && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Active filters:
            </span>

            {searchQuery && (
              <FilterChip
                label={`Search: "${searchQuery}"`}
                onRemove={() => setSearchQuery("")}
              />
            )}

            {filterVehicle !== "all" && (
              <FilterChip
                label={`Vehicle: ${
                  vehicles.find((v) => v.id === filterVehicle)
                    ?.registrationNumber || filterVehicle
                }`}
                onRemove={() => setFilterVehicle("all")}
              />
            )}

            {filterDriver !== "all" && (
              <FilterChip
                label={`Driver: ${
                  drivers.find((d) => d.id === filterDriver)?.name ||
                  filterDriver
                }`}
                onRemove={() => setFilterDriver("all")}
              />
            )}

            {filterPeriod !== "all" && (
              <FilterChip
                label={`Period: ${
                  periods.find((p) => p.id === filterPeriod)?.name
                }`}
                onRemove={() => setFilterPeriod("all")}
              />
            )}

            {(filterVehicle !== "all" ||
              filterDriver !== "all" ||
              filterPeriod !== "all" ||
              searchQuery) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterVehicle("all");
                  setFilterDriver("all");
                  setFilterPeriod("all");
                }}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 ml-2"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const FilterSelect = ({
  value,
  onChange,
  options,
  label,
  icon,
  fullWidth = false,
}) => (
  <div className={`relative ${fullWidth ? "w-full" : ""}`}>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`
        appearance-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
        border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2.5 pr-10 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
        text-sm ${fullWidth ? "w-full" : "min-w-[140px]"}
        hover:border-gray-400 dark:hover:border-gray-500 transition-colors
      `}
    >
      <option value="all" className="text-gray-500 dark:text-gray-400">
        {label}
      </option>
      {options?.map((option) => (
        <option
          key={option.id}
          value={option.id}
          className="text-gray-900 dark:text-gray-100"
        >
          {option.name || option.registrationNumber}
        </option>
      ))}
    </select>
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
      {icon || <ChevronDown className="h-4 w-4" />}
    </div>
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

const periods = [
  { id: "all", name: "All Time" },
  { id: "today", name: "Today" },
  { id: "week", name: "This Week" },
  { id: "month", name: "This Month" },
  { id: "quarter", name: "This Quarter" },
  { id: "year", name: "This Year" },
  { id: "custom", name: "Custom Range" },
];
