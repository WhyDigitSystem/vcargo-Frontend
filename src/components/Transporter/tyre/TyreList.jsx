import {
  AlertTriangle,
  Car,
  CheckCircle,
  Clock,
  Edit,
  Gauge,
  Layers,
  Shield,
  Trash2,
} from "lucide-react";

export const TyreList = ({
  tyres,
  onEdit,
  onDelete,
  selectedEntries,
  onSelectEntry,
}) => {
  const handleSelectAll = () => {
    if (selectedEntries.length === tyres.length) {
      onSelectEntry([]);
    } else {
      onSelectEntry(tyres.map((t) => t.id));
    }
  };

  const handleSelectEntry = (id) => {
    if (selectedEntries.includes(id)) {
      onSelectEntry(selectedEntries.filter((tId) => tId !== id));
    } else {
      onSelectEntry([...selectedEntries, id]);
    }
  };

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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={
                tyres.length > 0 && selectedEntries.length === tyres.length
              }
              onChange={handleSelectAll}
              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tyres ({tyres.length})
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-8 text-sm text-gray-500 dark:text-gray-400">
            <span className="min-w-[100px]">Condition</span>
            <span className="min-w-[100px]">Pressure</span>
            <span className="min-w-[80px]">Tread</span>
            <span className="min-w-[80px]">Age</span>
            <span className="min-w-[60px]">Actions</span>
          </div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {tyres.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto w-16 h-16 text-gray-400 dark:text-gray-500 mb-4">
              <Layers className="w-full h-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No tyres found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Add your first tyre or adjust your filters to see results
            </p>
          </div>
        ) : (
          tyres.map((tyre) => {
            const conditionBadge = getConditionBadge(tyre.condition);
            const pressureStatus = getPressureStatus(
              tyre.pressure,
              tyre.recommendedPressure
            );
            const ConditionIcon = conditionBadge.icon;

            return (
              <div
                key={tyre.id}
                className={`px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors ${
                  selectedEntries.includes(tyre.id)
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  {/* Left Side */}
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedEntries.includes(tyre.id)}
                      onChange={() => handleSelectEntry(tyre.id)}
                      className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 flex-shrink-0"
                    />

                    {/* Tyre Info */}
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-xl ${
                          tyre.conditionColor || conditionBadge.color
                        }`}
                      >
                        <ConditionIcon
                          className={`h-5 w-5 ${
                            tyre.condition === "Critical"
                              ? "text-red-600 dark:text-red-400"
                              : tyre.condition === "Poor"
                              ? "text-orange-600 dark:text-orange-400"
                              : tyre.condition === "Fair"
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-emerald-600 dark:text-emerald-400"
                          }`}
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                            {tyre.serialNumber || "N/A"}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                tyre.status
                              )}`}
                            >
                              {tyre.status || "Unknown"}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${conditionBadge.color}`}
                            >
                              <ConditionIcon className="h-3 w-3" />
                              {conditionBadge.text}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {tyre.brand} {tyre.model} • {tyre.size} •{" "}
                            {tyre.position}
                          </p>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                            {tyre.vehicle && tyre.vehicle !== "Unassigned" ? (
                              <span className="flex items-center gap-1.5">
                                <Car className="h-3 w-3" />
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                  {tyre.vehicle}
                                </span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                                <Car className="h-3 w-3" />
                                Unassigned
                              </span>
                            )}

                            <span>•</span>

                            <span className="flex items-center gap-1.5">
                              <Gauge className="h-3 w-3" />
                              {tyre.odometerReading
                                ? `${tyre.odometerReading.toLocaleString()} km`
                                : "0 km"}
                            </span>

                            <span>•</span>

                            <span>
                              Purchased: {formatDate(tyre.purchaseDate)}
                            </span>

                            {tyre.ageMonths > 0 && (
                              <>
                                <span>•</span>
                                <span>
                                  Age: {tyre.ageMonths} month
                                  {tyre.ageMonths !== 1 ? "s" : ""}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Desktop */}
                  <div className="hidden lg:flex items-center gap-8">
                    {/* Condition */}
                    <div className="min-w-[100px]">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            tyre.condition === "Critical"
                              ? "bg-red-500"
                              : tyre.condition === "Poor"
                              ? "bg-orange-500"
                              : tyre.condition === "Fair"
                              ? "bg-yellow-500"
                              : "bg-emerald-500"
                          }`}
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {tyre.condition}
                        </span>
                      </div>
                    </div>

                    {/* Pressure */}
                    <div className="min-w-[100px]">
                      <div className="text-right">
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

                    {/* Tread Depth */}
                    <div className="min-w-[80px]">
                      <div className="text-right">
                        <div
                          className={`text-sm font-medium ${tyre.conditionColor?.replace(
                            "bg-",
                            "text-"
                          )}`}
                        >
                          {tyre.treadDepth || 0}%
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Tread
                        </div>
                      </div>
                    </div>

                    {/* Age */}
                    <div className="min-w-[80px]">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {tyre.ageMonths || 0}m
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Age
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="min-w-[60px]">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEdit(tyre)}
                          className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Edit tyre"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(tyre)}
                          className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete tyre"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info - Mobile */}
                <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Condition
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            tyre.condition === "Critical"
                              ? "bg-red-500"
                              : tyre.condition === "Poor"
                              ? "bg-orange-500"
                              : tyre.condition === "Fair"
                              ? "bg-yellow-500"
                              : "bg-emerald-500"
                          }`}
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {tyre.condition}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Pressure
                      </div>
                      <div
                        className={`text-sm font-medium ${getPressureColor(
                          pressureStatus
                        )}`}
                      >
                        {tyre.pressure || 0} PSI
                        {tyre.recommendedPressure && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                            (Rec: {tyre.recommendedPressure})
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Tread Depth
                      </div>
                      <div
                        className={`text-sm font-medium ${tyre.conditionColor?.replace(
                          "bg-",
                          "text-"
                        )}`}
                      >
                        {tyre.treadDepth || 0}%
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Age
                      </div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {tyre.ageMonths || 0} month
                        {tyre.ageMonths !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>

                  {/* Mobile Actions */}
                  <div className="mt-4 flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(tyre)}
                      className="px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(tyre)}
                      className="px-3 py-1.5 text-sm bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {tyres.length > 0 && (
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {tyres.length} tyre{tyres.length !== 1 ? "s" : ""}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span>Good</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span>Fair</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span>Poor</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span>Critical</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
