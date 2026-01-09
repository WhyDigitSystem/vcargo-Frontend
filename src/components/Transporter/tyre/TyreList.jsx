import {
  AlertCircle,
  AlertTriangle,
  Battery,
  Car,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Download,
  Edit,
  Eye,
  Gauge,
  Layers,
  RefreshCw,
  Search,
  Shield,
  Thermometer,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";

export const TyreList = ({
  tyres,
  onEdit,
  onDelete,
  selectedEntries,
  onSelectEntry,
  onViewDetails,
  onBulkAction,
  isLoading = false,
}) => {
  const [sortConfig, setSortConfig] = useState({
    key: "purchaseDate",
    direction: "desc",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    condition: "",
    vehicle: "",
    minTread: "",
    maxTread: "",
  });

  // Filter and sort tyres
  const filteredAndSortedTyres = useMemo(() => {
    let result = [...tyres];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (tyre) =>
          (tyre.serialNumber?.toLowerCase() || "").includes(term) ||
          (tyre.brand?.toLowerCase() || "").includes(term) ||
          (tyre.model?.toLowerCase() || "").includes(term) ||
          (tyre.vehicle?.toLowerCase() || "").includes(term)
      );
    }

    // Apply filters
    if (filters.status) {
      result = result.filter(
        (tyre) => tyre.status?.toLowerCase() === filters.status.toLowerCase()
      );
    }
    if (filters.condition) {
      result = result.filter(
        (tyre) =>
          tyre.condition?.toLowerCase() === filters.condition.toLowerCase()
      );
    }
    if (filters.vehicle) {
      result = result.filter((tyre) => tyre.vehicle === filters.vehicle);
    }
    if (filters.minTread) {
      result = result.filter(
        (tyre) => (tyre.treadDepth || 0) >= parseFloat(filters.minTread)
      );
    }
    if (filters.maxTread) {
      result = result.filter(
        (tyre) => (tyre.treadDepth || 0) <= parseFloat(filters.maxTread)
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle special cases for sorting
        if (sortConfig.key === "condition") {
          const conditionOrder = { critical: 0, poor: 1, fair: 2, good: 3 };
          aValue = conditionOrder[a.condition?.toLowerCase()] || 4;
          bValue = conditionOrder[b.condition?.toLowerCase()] || 4;
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
  }, [tyres, searchTerm, filters, sortConfig]);

  // Get unique values for filters
  const uniqueVehicles = useMemo(
    () => [...new Set(tyres.map((t) => t.vehicle).filter(Boolean))],
    [tyres]
  );

  const uniqueConditions = useMemo(
    () => ["Critical", "Poor", "Fair", "Good"],
    []
  );

  const uniqueStatuses = useMemo(
    () => ["New", "Used", "Damaged", "Replaced"],
    []
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
      status: "",
      condition: "",
      vehicle: "",
      minTread: "",
      maxTread: "",
    });
  };

  const handleBulkDelete = () => {
    if (
      selectedEntries.length > 0 &&
      window.confirm(`Delete ${selectedEntries.length} selected tyres?`)
    ) {
      onBulkAction?.("delete", selectedEntries);
    }
  };

  const handleExport = () => {
    const data = filteredAndSortedTyres.map((tyre) => ({
      Serial: tyre.serialNumber,
      Brand: tyre.brand,
      Model: tyre.model,
      Size: tyre.size,
      Position: tyre.position,
      Condition: tyre.condition,
      Status: tyre.status,
      Vehicle: tyre.vehicle,
      Tread: `${tyre.treadDepth}%`,
      Pressure: `${tyre.pressure} PSI`,
      Age: `${tyre.ageMonths} months`,
      Odometer: `${tyre.odometerReading?.toLocaleString()} km`,
    }));

    console.log("Export data:", data);
    // Implement actual export logic here
    alert(`Exported ${data.length} tyres`);
  };

  const getTreadDepthColor = (treadDepth) => {
    if (treadDepth >= 80) return "text-emerald-600 dark:text-emerald-400";
    if (treadDepth >= 50) return "text-yellow-600 dark:text-yellow-400";
    if (treadDepth >= 30) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  const getAgeWarning = (ageMonths) => {
    if (ageMonths >= 60)
      return { color: "text-red-600", icon: AlertCircle, text: "Replace soon" };
    if (ageMonths >= 48)
      return {
        color: "text-orange-600",
        icon: AlertCircle,
        text: "Monitor closely",
      };
    return null;
  };

  const SortableHeader = ({ children, sortKey, className = "" }) => (
    <button
      onClick={() => handleSort(sortKey)}
      className={`flex items-center gap-1 text-xs font-semibold uppercase tracking-wider hover:text-gray-900 dark:hover:text-white transition-colors ${className}`}
    >
      {children}
      {sortConfig.key === sortKey &&
        (sortConfig.direction === "asc" ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        ))}
    </button>
  );

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex flex-col items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400 mb-4" />
          <span className="text-gray-600 dark:text-gray-400">
            Loading tyres...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header with Filters */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={
                filteredAndSortedTyres.length > 0 &&
                selectedEntries.length === filteredAndSortedTyres.length
              }
              onChange={() => {
                if (selectedEntries.length === filteredAndSortedTyres.length) {
                  onSelectEntry([]);
                } else {
                  onSelectEntry(filteredAndSortedTyres.map((t) => t.id));
                }
              }}
              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tyres ({filteredAndSortedTyres.length})
              {selectedEntries.length > 0 &&
                ` • ${selectedEntries.length} selected`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {selectedEntries.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 text-sm bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Selected
              </button>
            )}
            <button
              onClick={handleExport}
              className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tyres by serial, brand, vehicle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="">All Status</option>
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <select
              value={filters.condition}
              onChange={(e) =>
                setFilters({ ...filters, condition: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="">All Conditions</option>
              {uniqueConditions.map((cond) => (
                <option key={cond} value={cond}>
                  {cond}
                </option>
              ))}
            </select>

            <select
              value={filters.vehicle}
              onChange={(e) =>
                setFilters({ ...filters, vehicle: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="">All Vehicles</option>
              {uniqueVehicles.map((vehicle) => (
                <option key={vehicle} value={vehicle}>
                  {vehicle}
                </option>
              ))}
              <option value="Unassigned">Unassigned</option>
            </select>

            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min tread %"
                value={filters.minTread}
                onChange={(e) =>
                  setFilters({ ...filters, minTread: e.target.value })
                }
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                min="0"
                max="100"
              />
              <input
                type="number"
                placeholder="Max tread %"
                value={filters.maxTread}
                onChange={(e) =>
                  setFilters({ ...filters, maxTread: e.target.value })
                }
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                min="0"
                max="100"
              />
            </div>

            {(searchTerm || Object.values(filters).some((v) => v)) && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table Header - Desktop */}
      <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 dark:text-white">
        <div className="col-span-5">
          <SortableHeader sortKey="serialNumber">Tyre Details</SortableHeader>
        </div>
        <div className="col-span-1">
          <SortableHeader sortKey="condition">Condition</SortableHeader>
        </div>
        <div className="col-span-1">
          <SortableHeader sortKey="pressure">Pressure</SortableHeader>
        </div>
        <div className="col-span-1">
          <SortableHeader sortKey="treadDepth">Tread</SortableHeader>
        </div>
        <div className="col-span-1">
          <SortableHeader sortKey="ageMonths">Age</SortableHeader>
        </div>
        <div className="col-span-1">
          <SortableHeader sortKey="odometerReading">Odometer</SortableHeader>
        </div>
        <div className="col-span-2 text-right">Actions</div>
      </div>

      {/* Tyres List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredAndSortedTyres.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto w-16 h-16 text-gray-400 dark:text-gray-500 mb-4">
              <Layers className="w-full h-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No tyres found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {searchTerm || Object.values(filters).some((v) => v)
                ? "Try adjusting your search or filters"
                : "Add your first tyre to get started"}
            </p>
          </div>
        ) : (
          filteredAndSortedTyres.map((tyre) => {
            const conditionBadge = getConditionBadge(tyre.condition);
            const ConditionIcon = conditionBadge.icon;
            const pressureStatus = getPressureStatus(
              tyre.pressure,
              tyre.recommendedPressure
            );
            const ageWarning = getAgeWarning(tyre.ageMonths);
            const treadColor = getTreadDepthColor(tyre.treadDepth);

            return (
              <div
                key={tyre.id}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors ${
                  selectedEntries.includes(tyre.id)
                    ? "bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500"
                    : ""
                }`}
              >
                {/* Mobile Layout */}
                <div className="lg:hidden space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedEntries.includes(tyre.id)}
                        onChange={() => onSelectEntry(tyre.id)}
                        className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 mt-1"
                      />

                      <div className={`p-3 rounded-xl ${conditionBadge.color}`}>
                        <ConditionIcon className="h-5 w-5" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {tyre.serialNumber || "N/A"}
                          </h4>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                              tyre.status
                            )}`}
                          >
                            {tyre.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {tyre.brand} {tyre.model} • {tyre.size}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Car className="h-3 w-3" />
                            {tyre.vehicle || "Unassigned"}
                          </span>
                          <span>•</span>
                          <span>{tyre.position}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Condition
                      </div>
                      <div className="flex items-center gap-2 dark:text-white">
                        <div
                          className={`w-2 h-2 rounded-full  ${getConditionColor(
                            tyre.condition
                          )}`}
                        />
                        <span className="text-sm font-medium">
                          {tyre.condition}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Pressure
                      </div>
                      <div className="flex items-center gap-1">
                        <Thermometer
                          className={`h-4 w-4 ${getPressureColor(
                            pressureStatus
                          )}`}
                        />
                        <span
                          className={`text-sm font-medium ${getPressureColor(
                            pressureStatus
                          )}`}
                        >
                          {tyre.pressure || 0} PSI
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Tread Depth
                      </div>
                      <div className="flex items-center gap-1">
                        <Battery className={`h-4 w-4 ${treadColor}`} />
                        <span className={`text-sm font-medium ${treadColor}`}>
                          {tyre.treadDepth || 0}%
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Age
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">
                          {tyre.ageMonths || 0}m
                        </span>
                        {ageWarning && (
                          <AlertCircle
                            className={`h-3 w-3 ml-1 ${ageWarning.color}`}
                            title={ageWarning.text}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Gauge className="h-3 w-3" />
                        {tyre.odometerReading?.toLocaleString() || 0} km
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewDetails?.(tyre)}
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit?.(tyre)}
                        className="p-2 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete?.(tyre)}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-5">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedEntries.includes(tyre.id)}
                        onChange={() => onSelectEntry(tyre.id)}
                        className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                      />

                      <div className={`p-2 rounded-lg ${conditionBadge.color}`}>
                        <ConditionIcon className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 dark:text-white truncate">
                            {tyre.serialNumber || "N/A"}
                          </h4>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(
                              tyre.status
                            )}`}
                          >
                            {tyre.status}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {tyre.brand} {tyre.model} • {tyre.size}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Car className="h-3 w-3" />
                              {tyre.vehicle || "Unassigned"}
                            </span>
                            <span>•</span>
                            <span>Position: {tyre.position}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <div className="flex items-center gap-2 dark:text-gray-400">
                      <div
                        className={`w-2 h-2 rounded-full ${getConditionColor(
                          tyre.condition
                        )}`}
                      />
                      <span className="text-sm">{tyre.condition}</span>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <div className="flex items-center gap-1">
                      <Thermometer
                        className={`h-4 w-4 ${getPressureColor(
                          pressureStatus
                        )}`}
                      />
                      <div>
                        <div
                          className={`text-sm font-medium ${getPressureColor(
                            pressureStatus
                          )}`}
                        >
                          {tyre.pressure || 0} PSI
                        </div>
                        {tyre.recommendedPressure && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Rec: {tyre.recommendedPressure} PSI
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <div className="flex items-center gap-1">
                      <Battery className={`h-4 w-4 ${treadColor}`} />
                      <div>
                        <div className={`text-sm font-medium ${treadColor}`}>
                          {tyre.treadDepth || 0}%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <div className="flex items-center gap-1 dark:text-gray-400">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium">
                          {tyre.ageMonths || 0}m
                        </div>
                        {ageWarning && (
                          <div className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {ageWarning.text}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {tyre.odometerReading?.toLocaleString() || 0} km
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onViewDetails?.(tyre)}
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(tyre.serialNumber)
                        }
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        title="Copy Serial Number"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit?.(tyre)}
                        className="p-2 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete?.(tyre)}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer with Statistics */}
      {filteredAndSortedTyres.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="px-6 py-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredAndSortedTyres.length} tyre
                {filteredAndSortedTyres.length !== 1 ? "s" : ""}
                {selectedEntries.length > 0 &&
                  ` • ${selectedEntries.length} selected`}
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-gray-600 dark:text-gray-400">
                      Good
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span className="text-gray-600 dark:text-gray-400">
                      Fair
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span className="text-gray-600 dark:text-gray-400">
                      Poor
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-gray-600 dark:text-gray-400">
                      Critical
                    </span>
                  </div>
                </div>

                <div className="hidden lg:block">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500 dark:text-gray-400">
                      Avg Tread:{" "}
                      {Math.round(
                        filteredAndSortedTyres.reduce(
                          (sum, t) => sum + (t.treadDepth || 0),
                          0
                        ) / filteredAndSortedTyres.length
                      )}
                      %
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      Critical:{" "}
                      {
                        filteredAndSortedTyres.filter(
                          (t) => t.condition?.toLowerCase() === "critical"
                        ).length
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions (unchanged from your original)
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "new":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";
    case "used":
      return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
    case "damaged":
      return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
    case "replaced":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300";
  }
};

const getConditionBadge = (condition) => {
  switch (condition?.toLowerCase()) {
    case "critical":
      return {
        color: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
        icon: AlertTriangle,
        text: "Critical",
      };
    case "poor":
      return {
        color:
          "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
        icon: AlertTriangle,
        text: "Poor",
      };
    case "fair":
      return {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
        icon: Clock,
        text: "Fair",
      };
    case "good":
      return {
        color:
          "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
        icon: CheckCircle,
        text: "Good",
      };
    default:
      return {
        color:
          "bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300",
        icon: Shield,
        text: "Unknown",
      };
  }
};

const getPressureStatus = (pressure, recommendedPressure) => {
  if (!pressure || !recommendedPressure) return "unknown";

  const diff = Math.abs(pressure - recommendedPressure);
  if (diff > 15) return "critical";
  if (diff > 8) return "low";
  return "normal";
};

const getPressureColor = (status) => {
  switch (status) {
    case "critical":
      return "text-red-600 dark:text-red-400";
    case "low":
      return "text-amber-600 dark:text-amber-400";
    case "normal":
      return "text-emerald-600 dark:text-emerald-400";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
};

const getConditionColor = (condition) => {
  switch (condition?.toLowerCase()) {
    case "critical":
      return "bg-red-500";
    case "poor":
      return "bg-orange-500";
    case "fair":
      return "bg-yellow-500";
    case "good":
      return "bg-emerald-500";
    default:
      return "bg-gray-500";
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (e) {
    return dateString;
  }
};
