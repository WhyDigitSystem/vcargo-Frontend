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
  X,
  Info,
  User,
  Building,
  Gauge,
  FileText,
} from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";

export const MaintenanceList = ({
  records,
  onEdit,
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
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowActionsMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [records, sortConfig]);

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

  const totalPages = Math.ceil(sortedRecords.length / ITEMS_PER_PAGE);

  const paginatedRecords = sortedRecords.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSelectAll = () => {
    const pageIds = paginatedRecords.map((r) => r.id);
    const allSelected = pageIds.every((id) =>
      selectedRecords.includes(id)
    );

    if (allSelected) {
      onSelectRecord(
        selectedRecords.filter((id) => !pageIds.includes(id))
      );
    } else {
      onSelectRecord([...new Set([...selectedRecords, ...pageIds])]);
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
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateRelative = (dateString) => {
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
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-visible">
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
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-visible">
        {/* Header with Actions */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <input
                type="checkbox"
                checked={
                  paginatedRecords.length > 0 &&
                  paginatedRecords.every((r) => selectedRecords.includes(r.id))
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
                <div className="hidden md:flex items-center gap-1 ml-auto">
                  <button
                    onClick={() => handleSort("scheduledDate")}
                    className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg ${sortConfig.key === "scheduledDate"
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
                    className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg ${sortConfig.key === "priority"
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                  >
                    <AlertCircle className="h-3 w-3" />
                    Priority
                  </button>
                  <button
                    onClick={() => handleSort("cost")}
                    className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg ${sortConfig.key === "cost"
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
              <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
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
            paginatedRecords.map((record) => {
              const statusConfig = getStatusConfig(record.status);
              const priorityConfig = getPriorityConfig(record.priority);
              const typeConfig = getTypeConfig(record.type);
              const costDisplay = getCostDisplay(record);
              const daysUntilDue = getDaysUntilDue(record);
              const overdue = isOverdue(record);

              return (
                <div
                  key={record.id}
                  className={`px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-900/20 transition-colors ${selectedRecords.includes(record.id)
                    ? "bg-blue-50 dark:bg-blue-900/10"
                    : ""
                    } ${overdue ? "border-l-4 border-red-500" : ""}`}
                >
                  {/* Compact Row */}
                  <div className="flex items-start gap-4">
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
                    <div className="flex-1 min-w-0 z-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setViewRecord(record)}
                            className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            <h4 className="font-medium text-lg truncate">
                              {record.title}
                            </h4>
                          </button>
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
                        <div className="hidden md:flex items-center gap-4">
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
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {record.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-2">
                          <Car className="h-4 w-4" />
                          <span className="truncate max-w-[120px]">
                            {record.vehicleName}
                          </span>
                        </span>
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {formatDateRelative(record.scheduledDate)}
                        </span>
                        <span className="flex items-center gap-2">
                          <Gauge className="h-4 w-4" />
                          {record.odometerReading?.toLocaleString()} km
                        </span>
                        <span className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          {typeConfig.label}
                        </span>
                      </div>

                      {/* Mobile Status & Cost */}
                      <div className="flex items-center gap-4 mt-3 md:hidden">
                        <StatusBadge status={record.status} />
                        <div
                          className={`text-sm font-medium ${costDisplay.color}`}
                        >
                          {costDisplay.amount}
                        </div>
                      </div>
                    </div>

                    {/* Actions Column */}
                    <div className="flex flex-col items-end gap-3">
                      {/* Expand/Collapse Button */}
                      <button
                        onClick={() =>
                          setExpandedId(
                            expandedId === record.id ? null : record.id
                          )
                        }
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <ChevronRight
                          className={`h-4 w-4 transition-transform ${expandedId === record.id ? "rotate-90" : ""
                            }`}
                        />
                      </button>

                      {/* Quick Actions Menu */}
                      <div className="relative" ref={menuRef}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowActionsMenu(showActionsMenu === record.id ? null : record.id);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>

                        {showActionsMenu === record.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-[9999]">
                            <div className="py-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setViewRecord(record);
                                  setShowActionsMenu(null);
                                }}
                                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <Eye className="h-4 w-4" />
                                View Details
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEdit(record);
                                  setShowActionsMenu(null);
                                }}
                                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <Edit className="h-4 w-4" />
                                Edit Record
                              </button>
                              {record.status !== "completed" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuickStatusChange(record.id, "completed");
                                    setShowActionsMenu(null);
                                  }}
                                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  Mark Complete
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedId === record.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Service Details */}
                        <div>
                          <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                            Service Details
                          </h5>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Service Center:
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {record.serviceCenter || "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Mechanic:
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {record.mechanic || "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Completed Date:
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {formatDate(record.completedDate) || "Pending"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Parts & Cost */}
                        <div>
                          <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                            Cost Breakdown
                          </h5>
                          {record.parts && record.parts.length > 0 ? (
                            <div className="space-y-2">
                              {record.parts.map((part, idx) => (
                                <div
                                  key={idx}
                                  className="flex justify-between items-center text-sm"
                                >
                                  <span className="text-gray-600 dark:text-gray-400">
                                    {part.name} × {part.quantity}
                                  </span>
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    ₹{part.cost?.toLocaleString("en-IN") || "0"}
                                  </span>
                                </div>
                              ))}
                              <div className="pt-3 mt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center font-medium">
                                <span className="text-sm text-gray-900 dark:text-white">
                                  Total Cost
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
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              No parts listed
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Notes */}
                      {record.notes && (
                        <div className="mt-4">
                          <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                            Notes
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                            {record.notes}
                          </p>
                        </div>
                      )}

                      {/* Quick Actions Footer */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewRecord(record)}
                            className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                          >
                            <Eye className="h-4 w-4" />
                            View Full Details
                          </button>
                          <button
                            onClick={() => onEdit(record)}
                            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </button>
                          {record.status !== "completed" &&
                            record.status !== "cancelled" && (
                              <button
                                onClick={() =>
                                  handleQuickStatusChange(record.id, "completed")
                                }
                                className="flex items-center gap-2 px-4 py-2 text-sm bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                              >
                                <CheckCircle className="h-4 w-4" />
                                Mark Complete
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                ‹
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(
                  Math.max(0, currentPage - 2),
                  Math.min(totalPages, currentPage + 1)
                )
                .map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border ${currentPage === page
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                  >
                    {page}
                  </button>
                ))}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Maintenance Modal - FIXED VERSION */}
      {viewRecord && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60"
          onClick={() => setViewRecord(null)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()} // prevent close on content click
          >
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800 z-10">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {viewRecord.title}
              </h3>
              <button
                onClick={() => setViewRecord(null)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Basic Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="w-32 flex-shrink-0">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Status:</p>
                        </div>
                        <div>
                          <StatusBadge status={viewRecord.status} />
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-32 flex-shrink-0">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Priority:</p>
                        </div>
                        <div>
                          <PriorityBadge priority={viewRecord.priority} />
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-32 flex-shrink-0">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Type:</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {getTypeConfig(viewRecord.type).label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Information */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Vehicle Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="w-32 flex-shrink-0">
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <Car className="h-4 w-4" />
                            Vehicle:
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {viewRecord.vehicleName}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-32 flex-shrink-0">
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <Gauge className="h-4 w-4" />
                            Odometer:
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {viewRecord.odometerReading?.toLocaleString()} km
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Schedule
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="w-32 flex-shrink-0">
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Scheduled:
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatDate(viewRecord.scheduledDate)}
                          </span>
                          {isOverdue(viewRecord) && (
                            <span className="ml-2 inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                              Overdue
                            </span>
                          )}
                        </div>
                      </div>
                      {viewRecord.completedDate && (
                        <div className="flex items-start">
                          <div className="w-32 flex-shrink-0">
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                              <CheckCircle className="h-4 w-4" />
                              Completed:
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {formatDate(viewRecord.completedDate)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Service Details */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Service Details
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="w-32 flex-shrink-0">
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            Service Center:
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {viewRecord.serviceCenter || "Not specified"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-32 flex-shrink-0">
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Mechanic:
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {viewRecord.mechanic || "Not assigned"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cost Information */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Cost Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="w-32 flex-shrink-0">
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <IndianRupee className="h-4 w-4" />
                            Total Cost:
                          </p>
                        </div>
                        <div>
                          <span className="text-lg font-semibold text-gray-900 dark:text-white">
                            {getCostDisplay(viewRecord).amount}
                          </span>
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                            ({getCostDisplay(viewRecord).label})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Description
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {viewRecord.description || "No description provided"}
                      </p>
                    </div>
                  </div>

                  {/* Notes */}
                  {viewRecord.notes && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Notes
                      </h4>
                      <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-lg">
                        <p className="text-sm text-amber-800 dark:text-amber-300">
                          {viewRecord.notes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Parts List - Full Width */}
              {viewRecord.parts && viewRecord.parts.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Parts Used
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                    <div className="space-y-2">
                      {viewRecord.parts.map((part, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {part.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Quantity: {part.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              ₹{part.cost?.toLocaleString("en-IN") || "0"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Unit price
                            </p>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-between items-center pt-3 mt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          Total Parts Cost
                        </span>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          ₹
                          {viewRecord.parts
                            .reduce((sum, part) => sum + (part.cost || 0), 0)
                            .toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 flex justify-end gap-3 px-6 py-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
              <button
                onClick={() => setViewRecord(null)}
                className="px-4 py-2 border rounded-lg text-sm"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setViewRecord(null);
                  onEdit(viewRecord);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Edit Maintenance
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};