import { Search, Filter, Download, Trash2, ChevronDown, X, Printer, Mail, CheckCircle } from "lucide-react";

export const MaintenanceFilters = ({ 
  filters, 
  setFilters, 
  vehicles, 
  selectedRecords, 
  onBulkAction 
}) => {
  const statusOptions = [
    { id: "all", name: "All Status" },
    { id: "pending", name: "Pending" },
    { id: "scheduled", name: "Scheduled" },
    { id: "in_progress", name: "In Progress" },
    { id: "completed", name: "Completed" },
    { id: "cancelled", name: "Cancelled" },
  ];

  const typeOptions = [
    { id: "all", name: "All Types" },
    { id: "preventive", name: "Preventive" },
    { id: "corrective", name: "Corrective" },
    { id: "emergency", name: "Emergency" },
    { id: "routine", name: "Routine" },
  ];

  const priorityOptions = [
    { id: "all", name: "All Priorities" },
    { id: "low", name: "Low" },
    { id: "medium", name: "Medium" },
    { id: "high", name: "High" },
    { id: "urgent", name: "Urgent" },
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "all",
      vehicleId: "all",
      type: "all",
      priority: "all",
    });
  };

  const hasActiveFilters = Object.values(filters).some(
    value => value !== "" && value !== "all"
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search by title, vehicle, service center..."
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
        <div className="flex items-center gap-3 flex-wrap">
          <FilterSelect
            value={filters.status}
            onChange={(value) => handleFilterChange("status", value)}
            options={statusOptions}
            label="All Status"
          />
          <FilterSelect
            value={filters.type}
            onChange={(value) => handleFilterChange("type", value)}
            options={typeOptions}
            label="All Types"
          />
          <FilterSelect
            value={filters.priority}
            onChange={(value) => handleFilterChange("priority", value)}
            options={priorityOptions}
            label="All Priorities"
          />
          <FilterSelect
            value={filters.vehicleId}
            onChange={(value) => handleFilterChange("vehicleId", value)}
            options={vehicles}
            label="All Vehicles"
            useRegistration={true}
          />
        </div>
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
            
            {filters.type !== "all" && (
              <FilterChip 
                label={`Type: ${typeOptions.find(t => t.id === filters.type)?.name}`}
                onRemove={() => handleFilterChange("type", "all")}
              />
            )}
            
            {filters.priority !== "all" && (
              <FilterChip 
                label={`Priority: ${priorityOptions.find(p => p.id === filters.priority)?.name}`}
                onRemove={() => handleFilterChange("priority", "all")}
              />
            )}
            
            {filters.vehicleId !== "all" && (
              <FilterChip 
                label={`Vehicle: ${vehicles.find(v => v.id === filters.vehicleId)?.registrationNumber}`}
                onRemove={() => handleFilterChange("vehicleId", "all")}
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
      {selectedRecords.length > 0 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
              <div>
                <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {selectedRecords.length} record(s) selected
                </div>
                <div className="text-xs text-blue-600/70 dark:text-blue-400/70">
                  Perform actions on selected records
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
                onClick={() => onBulkAction("print")}
                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium"
              >
                <Printer className="h-4 w-4" />
                Print
              </button>
              <button
                onClick={() => onBulkAction("status")}
                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium"
              >
                <CheckCircle className="h-4 w-4" />
                Mark Complete
              </button>
              <button
                onClick={() => onBulkAction("delete")}
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 text-sm font-medium"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FilterSelect = ({ value, onChange, options, label, useRegistration = false }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-w-[120px] hover:border-gray-400 dark:hover:border-gray-500"
    >
      <option value="all" className="text-gray-500 dark:text-gray-400">{label}</option>
      {options?.map((option) => (
        <option key={option.id} value={option.id} className="text-gray-900 dark:text-gray-100">
          {useRegistration ? option.registrationNumber : option.name}
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