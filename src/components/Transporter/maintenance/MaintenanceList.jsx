import {
  AlertCircle,
  Calendar,
  Car,
  CheckCircle,
  ChevronRight,
  Clock,
  Download,
  Edit,
  Eye,
  Filter,
  IndianRupee,
  MoreVertical,
  Printer,
  SortAsc,
  Trash2,
  Wrench,
} from "lucide-react";
import { useMemo, useState } from "react";

export const MaintenanceList = ({
  records,
  onEdit,
  onDelete,
  onStatusChange,
  selectedRecords,
  onSelectRecord,
  loading = false,
}) => {
  const [expandedId, setExpandedId] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "scheduledDate",
    direction: "desc",
  });
  const [showActionsMenu, setShowActionsMenu] = useState(null);
  const [viewRecord, setViewRecord] = useState(null);

  // Memoized sorted records
  const sortedRecords = useMemo(() => {
    const sortableRecords = [...records];
    if (sortConfig.key) {
      sortableRecords.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableRecords;
  }, [records, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSelectAll = () => {
    if (selectedRecords.length === sortedRecords.length) {
      onSelectRecord([]);
    } else {
      onSelectRecord(sortedRecords.map((r) => r.id));
    }
  };

  const handleSelectRecord = (id) => {
    if (selectedRecords.includes(id)) {
      onSelectRecord(selectedRecords.filter((rId) => rId !== id));
    } else {
      onSelectRecord([...selectedRecords, id]);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      completed: {
        color: "bg-emerald-500",
        text: "Completed",
        icon: "✓",
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
        textColor: "text-emerald-700 dark:text-emerald-300",
      },
      in_progress: {
        color: "bg-blue-500",
        text: "In Progress",
        icon: "⟳",
        bg: "bg-blue-50 dark:bg-blue-900/20",
        textColor: "text-blue-700 dark:text-blue-300",
      },
      pending: {
        color: "bg-amber-500",
        text: "Pending",
        icon: "⏳",
        bg: "bg-amber-50 dark:bg-amber-900/20",
        textColor: "text-amber-700 dark:text-amber-300",
      },
      scheduled: {
        color: "bg-cyan-500",
        text: "Scheduled",
        icon: "📅",
        bg: "bg-cyan-50 dark:bg-cyan-900/20",
        textColor: "text-cyan-700 dark:text-cyan-300",
      },
      cancelled: {
        color: "bg-gray-500",
        text: "Cancelled",
        icon: "✗",
        bg: "bg-gray-50 dark:bg-gray-800",
        textColor: "text-gray-700 dark:text-gray-300",
      },
    };
    return configs[status] || configs.pending;
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      urgent: {
        color: "bg-red-100 dark:bg-red-900/30",
        textColor: "text-red-800 dark:text-red-300",
        icon: "🚨",
      },
      high: {
        color: "bg-orange-100 dark:bg-orange-900/30",
        textColor: "text-orange-800 dark:text-orange-300",
        icon: "⚠️",
      },
      medium: {
        color: "bg-amber-100 dark:bg-amber-900/30",
        textColor: "text-amber-800 dark:text-amber-300",
        icon: "🔶",
      },
      low: {
        color: "bg-blue-100 dark:bg-blue-900/30",
        textColor: "text-blue-800 dark:text-blue-300",
        icon: "🔷",
      },
    };
    return configs[priority] || configs.medium;
  };

  const getTypeConfig = (type) => {
    const configs = {
      preventive: {
        icon: "🛡️",
        color: "bg-emerald-100 dark:bg-emerald-900/20",
        label: "Preventive",
      },
      corrective: {
        icon: "🔧",
        color: "bg-blue-100 dark:bg-blue-900/20",
        label: "Corrective",
      },
      emergency: {
        icon: "🚨",
        color: "bg-red-100 dark:bg-red-900/20",
        label: "Emergency",
      },
      routine: {
        icon: "🔄",
        color: "bg-amber-100 dark:bg-amber-900/20",
        label: "Routine",
      },
    };
    return configs[type] || configs.preventive;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  const isOverdue = (record) => {
    if (record.status === "pending" || record.status === "scheduled") {
      const scheduled = new Date(record.scheduledDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return scheduled < today;
    }
    return false;
  };

  const getDaysUntilDue = (record) => {
    if (record.status === "completed" || record.status === "cancelled")
      return null;

    const scheduled = new Date(record.scheduledDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = scheduled - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const handleQuickStatusChange = (id, newStatus) => {
    if (onStatusChange) {
      onStatusChange(id, newStatus);
      setExpandedId(null); // Collapse after status change
    }
  };

  const getCostDisplay = (record) => {
    if (record.cost) {
      return {
        amount: `₹${record.cost.toLocaleString("en-IN")}`,
        label: "Actual",
        color: "text-emerald-600 dark:text-emerald-400",
      };
    } else if (record.estimatedCost) {
      return {
        amount: `~₹${record.estimatedCost.toLocaleString("en-IN")}`,
        label: "Estimated",
        color: "text-amber-600 dark:text-amber-400",
      };
    }
    return {
      amount: "₹0",
      label: "No cost",
      color: "text-gray-500 dark:text-gray-400",
    };
  };

  const StatusBadge = ({ status }) => {
    const config = getStatusConfig(status);
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.textColor}`}
      >
        <span className="text-xs">{config.icon}</span>
        <span>{config.text}</span>
      </div>
    );
  };

  const PriorityBadge = ({ priority }) => {
    const config = getPriorityConfig(priority);
    return (
      <div
        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${config.color} ${config.textColor}`}
      >
        <span>{config.icon}</span>
        <span className="capitalize">{priority}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-4">
            <Wrench className="h-6 w-6 text-blue-600 dark:text-blue-400 animate-pulse" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Loading records...
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Please wait while we fetch maintenance records
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header with Actions */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <input
              type="checkbox"
              checked={
                sortedRecords.length > 0 &&
                selectedRecords.length === sortedRecords.length
              }
              onChange={handleSelectAll}
              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex items-center gap-4 flex-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {sortedRecords.length} maintenance record
                {sortedRecords.length !== 1 ? "s" : ""}
                {selectedRecords.length > 0 &&
                  ` (${selectedRecords.length} selected)`}
              </span>

              {/* Quick Sort Buttons */}
              <div className="hidden md:flex items-center gap-1">
                <button
                  onClick={() => handleSort("scheduledDate")}
                  className={`flex items-center gap-1 px-2 py-1 text-xs rounded ${sortConfig.key === "scheduledDate"
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                >
                  <Calendar className="h-3 w-3" />
                  <SortAsc
                    className={`h-3 w-3 transition-transform ${sortConfig.key === "scheduledDate" &&
                      sortConfig.direction === "desc"
                      ? "rotate-180"
                      : ""
                      }`}
                  />
                </button>
                <button
                  onClick={() => handleSort("priority")}
                  className={`flex items-center gap-1 px-2 py-1 text-xs rounded ${sortConfig.key === "priority"
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                >
                  <AlertCircle className="h-3 w-3" />
                  Priority
                </button>
                <button
                  onClick={() => handleSort("cost")}
                  className={`flex items-center gap-1 px-2 py-1 text-xs rounded ${sortConfig.key === "cost"
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                >
                  <IndianRupee className="h-3 w-3" />
                  Cost
                </button>
              </div>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            {selectedRecords.length > 0 && (
              <div className="hidden md:flex items-center gap-2">
                <button className="px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40">
                  Export
                </button>
                <button className="px-3 py-1.5 text-sm bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40">
                  Bulk Delete
                </button>
              </div>
            )}
            <button className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Records List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {sortedRecords.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto w-12 h-12 text-gray-400 dark:text-gray-500 mb-4">
              <Wrench className="w-full h-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No maintenance records found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Add your first maintenance record or adjust your filters
            </p>
          </div>
        ) : (
          sortedRecords.map((record) => {
            const statusConfig = getStatusConfig(record.status);
            const priorityConfig = getPriorityConfig(record.priority);
            const typeConfig = getTypeConfig(record.type);
            const costDisplay = getCostDisplay(record);
            const daysUntilDue = getDaysUntilDue(record);
            const overdue = isOverdue(record);

            return (
              <div
                key={record.id}
                className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900/20 transition-colors ${selectedRecords.includes(record.id)
                  ? "bg-blue-50 dark:bg-blue-900/10"
                  : ""
                  } ${overdue ? "border-l-2 border-red-500" : ""}`}
              >
                {/* Compact Row */}
                <div className="flex items-start gap-3">
                  {/* Selection & Type */}
                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      checked={selectedRecords.includes(record.id)}
                      onChange={() => handleSelectRecord(record.id)}
                      className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    <div className={`p-2 rounded-lg ${typeConfig.color}`}>
                      <span className="text-sm">{typeConfig.icon}</span>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900 dark:text-white truncate">
                          {record.title}
                        </h4>
                        <PriorityBadge priority={record.priority} />
                        {overdue && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                            <Clock className="h-3 w-3" />
                            Overdue
                          </span>
                        )}
                        {daysUntilDue !== null &&
                          daysUntilDue <= 3 &&
                          daysUntilDue >= 0 &&
                          !overdue && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
                              <Clock className="h-3 w-3" />
                              {daysUntilDue === 0
                                ? "Due today"
                                : `${daysUntilDue}d left`}
                            </span>
                          )}
                      </div>
                      <div className="hidden md:flex items-center gap-3">
                        {/* Status Badge - Desktop */}
                        <StatusBadge status={record.status} />

                        {/* Cost - Desktop */}
                        <div className="text-right">
                          <div
                            className={`text-sm font-medium ${costDisplay.color}`}
                          >
                            {costDisplay.amount}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {costDisplay.label}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description & Meta */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                      {record.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Car className="h-3 w-3" />
                        <span className="truncate max-w-[120px]">
                          {record.vehicleName}
                        </span>
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(record.scheduledDate)}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span>{record.odometerReading?.toLocaleString()} km</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline">
                        {typeConfig.label}
                      </span>
                    </div>

                    {/* Mobile Status & Cost */}
                    <div className="flex items-center gap-3 mt-2 md:hidden">
                      <StatusBadge status={record.status} />
                      <div
                        className={`text-sm font-medium ${costDisplay.color}`}
                      >
                        {costDisplay.amount}
                      </div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-col items-end gap-2">
                    {/* Expand/Collapse Button */}
                    <button
                      onClick={() =>
                        setExpandedId(
                          expandedId === record.id ? null : record.id
                        )
                      }
                      className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <ChevronRight
                        className={`h-4 w-4 transition-transform ${expandedId === record.id ? "rotate-90" : ""
                          }`}
                      />
                    </button>

                    {/* Quick Actions Menu */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setShowActionsMenu(
                            showActionsMenu === record.id ? null : record.id
                          )
                        }
                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {showActionsMenu === record.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                onEdit(record);
                                setShowActionsMenu(null);
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <Edit className="h-4 w-4" />
                              Edit Record
                            </button>
                            <button
                              onClick={() => {
                                handleQuickStatusChange(record.id, "completed");
                                setShowActionsMenu(null);
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Mark Complete
                            </button>
                            <button
                              onClick={() => {
                                setViewRecord(record);
                                setShowActionsMenu(null);
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <Eye className="h-4 w-4" />
                              View Details
                            </button>
                            <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                            {/* <button
                              onClick={() => {
                                onDelete(record.id);
                                setShowActionsMenu(null);
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete Record
                            </button> */}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === record.id && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Service Details */}
                      <div>
                        <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                          Service Details
                        </h5>
                        <div className="space-y-2">
                          {[
                            {
                              label: "Service Center",
                              value: record.serviceCenter || "N/A",
                            },
                            {
                              label: "Mechanic",
                              value: record.mechanic || "N/A",
                            },
                            {
                              label: "Completed Date",
                              value:
                                formatDate(record.completedDate) || "Pending",
                            },
                          ].map((item, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {item.label}:
                              </span>
                              <span className="text-xs font-medium text-gray-900 dark:text-white">
                                {item.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Parts & Cost */}
                      <div>
                        <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                          Cost Breakdown
                        </h5>
                        {record.parts && record.parts.length > 0 ? (
                          <div className="space-y-1">
                            {record.parts.map((part, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between text-xs"
                              >
                                <span className="text-gray-600 dark:text-gray-400">
                                  {part.name} × {part.quantity}
                                </span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  ₹{part.cost?.toLocaleString("en-IN") || "0"}
                                </span>
                              </div>
                            ))}
                            <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between font-medium">
                              <span className="text-sm text-gray-900 dark:text-white">
                                Total
                              </span>
                              <span className="text-sm text-gray-900 dark:text-white">
                                ₹
                                {record.parts
                                  .reduce(
                                    (sum, part) => sum + (part.cost || 0),
                                    0
                                  )
                                  .toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            No parts listed
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Notes */}
                    {record.notes && (
                      <div className="mt-3">
                        <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                          Notes
                        </h5>
                        <p className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                          {record.notes}
                        </p>
                      </div>
                    )}

                    {/* Quick Actions Footer */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEdit(record)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30"
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </button>
                        {record.status !== "completed" &&
                          record.status !== "cancelled" && (
                            <button
                              onClick={() =>
                                handleQuickStatusChange(record.id, "completed")
                              }
                              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                            >
                              <CheckCircle className="h-3 w-3" />
                              Mark Complete
                            </button>
                          )}
                      </div>
                      <button
                        onClick={() => onDelete(record.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Summary */}
      {sortedRecords.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span>
                {selectedRecords.length > 0
                  ? `${selectedRecords.length} selected`
                  : "All records"}
              </span>
              <span className="hidden md:inline">
                • Sorted by {sortConfig.key} ({sortConfig.direction})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <Download className="h-4 w-4" />
              </button>
              <button className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <Printer className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Maintenance Modal */}
      {viewRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-3xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Maintenance Details
              </h3>
              <button
                onClick={() => setViewRecord(null)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Title</p>
                <p className="font-medium">{viewRecord.title}</p>
              </div>

              <div>
                <p className="text-gray-500">Status</p>
                <StatusBadge status={viewRecord.status} />
              </div>

              <div>
                <p className="text-gray-500">Vehicle</p>
                <p className="font-medium">{viewRecord.vehicleName}</p>
              </div>

              <div>
                <p className="text-gray-500">Priority</p>
                <PriorityBadge priority={viewRecord.priority} />
              </div>

              <div>
                <p className="text-gray-500">Scheduled Date</p>
                <p className="font-medium">
                  {formatDate(viewRecord.scheduledDate)}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Odometer</p>
                <p className="font-medium">
                  {viewRecord.odometerReading?.toLocaleString()} km
                </p>
              </div>

              <div>
                <p className="text-gray-500">Service Center</p>
                <p className="font-medium">
                  {viewRecord.serviceCenter || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Mechanic</p>
                <p className="font-medium">
                  {viewRecord.mechanic || "N/A"}
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-gray-500">Description</p>
                <p className="font-medium">{viewRecord.description}</p>
              </div>

              {viewRecord.notes && (
                <div className="md:col-span-2">
                  <p className="text-gray-500">Notes</p>
                  <p className="text-sm bg-gray-50 dark:bg-gray-900/40 p-3 rounded">
                    {viewRecord.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 px-4 py-3 border-t dark:border-gray-700">
              <button
                onClick={() => setViewRecord(null)}
                className="px-3 py-1.5 border rounded text-sm"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setViewRecord(null);
                  onEdit(viewRecord);
                }}
                className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
