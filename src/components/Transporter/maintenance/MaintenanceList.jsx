import {
  Calendar,
  Car,
  CheckCircle,
  ChevronRight,
  Edit,
  IndianRupee,
  Trash2,
  Wrench,
} from "lucide-react";
import { useState } from "react";

export const MaintenanceList = ({
  records,
  onEdit,
  onDelete,
  onStatusChange,
  selectedRecords,
  onSelectRecord,
}) => {
  const [expandedId, setExpandedId] = useState(null);

  const handleSelectAll = () => {
    if (selectedRecords.length === records.length) {
      onSelectRecord([]);
    } else {
      onSelectRecord(records.map((r) => r.id));
    }
  };

  const handleSelectRecord = (id) => {
    if (selectedRecords.includes(id)) {
      onSelectRecord(selectedRecords.filter((rId) => rId !== id));
    } else {
      onSelectRecord([...selectedRecords, id]);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500";
      case "in_progress":
        return "bg-blue-500";
      case "pending":
        return "bg-amber-500";
      case "scheduled":
        return "bg-cyan-500";
      case "cancelled":
        return "bg-gray-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in_progress":
        return "In Progress";
      case "pending":
        return "Pending";
      case "scheduled":
        return "Scheduled";
      case "cancelled":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
      case "high":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300";
      case "medium":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300";
      case "low":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "preventive":
        return "🛡️";
      case "corrective":
        return "🔧";
      case "emergency":
        return "🚨";
      case "routine":
        return "🔄";
      default:
        return "⚙️";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isOverdue = (record) => {
    if (record.status === "pending" || record.status === "scheduled") {
      const scheduled = new Date(record.scheduledDate);
      const today = new Date();
      return scheduled < today;
    }
    return false;
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
                records.length > 0 && selectedRecords.length === records.length
              }
              onChange={handleSelectAll}
              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Maintenance Records ({records.length})
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <span className="hidden md:inline">Status</span>
            <span className="hidden lg:inline">Cost</span>
            <span className="hidden xl:inline">Actions</span>
          </div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {records.length === 0 ? (
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
          records.map((record) => (
            <div
              key={record.id}
              className={`px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors ${
                selectedRecords.includes(record.id)
                  ? "bg-blue-50 dark:bg-blue-900/20"
                  : ""
              } ${isOverdue(record) ? "border-l-4 border-red-500" : ""}`}
            >
              <div className="flex items-center justify-between">
                {/* Left Side */}
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedRecords.includes(record.id)}
                    onChange={() => handleSelectRecord(record.id)}
                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                  />

                  {/* Record Info */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-xl ${
                        record.type === "emergency"
                          ? "bg-red-100 dark:bg-red-900/20"
                          : record.type === "preventive"
                          ? "bg-emerald-100 dark:bg-emerald-900/20"
                          : "bg-blue-100 dark:bg-blue-900/20"
                      }`}
                    >
                      <div className="text-lg">{getTypeIcon(record.type)}</div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-white truncate">
                          {record.title}
                        </h4>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                            record.priority
                          )}`}
                        >
                          {record.priority}
                        </span>
                        {isOverdue(record) && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                            Overdue
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {record.description}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Car className="h-3 w-3" />
                          {record.vehicleName}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(record.scheduledDate)}
                        </span>
                        <span>•</span>
                        <span>
                          {record.odometerReading?.toLocaleString()} km
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-8">
                  {/* Status */}
                  <div className="hidden md:block">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${getStatusColor(
                          record.status
                        )}`}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {getStatusText(record.status)}
                      </span>
                    </div>
                  </div>

                  {/* Cost */}
                  <div className="hidden lg:block">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white">
                        <IndianRupee className="h-3 w-3" />
                        {record.cost || record.estimatedCost || 0}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Cost
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {record.status !== "completed" &&
                      record.status !== "cancelled" && (
                        <button
                          onClick={() => onStatusChange(record.id, "completed")}
                          className="p-2 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg"
                          title="Mark as completed"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                    <button
                      onClick={() => onEdit(record)}
                      className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                      title="Edit record"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(record.id)}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      title="Delete record"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        setExpandedId(
                          expandedId === record.id ? null : record.id
                        )
                      }
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      <ChevronRight
                        className={`h-4 w-4 transition-transform ${
                          expandedId === record.id ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === record.id && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Service Details */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Service Details
                      </h5>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Service Center:
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {record.serviceCenter || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Mechanic:
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {record.mechanic || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Completed Date:
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatDate(record.completedDate) || "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Parts & Cost Breakdown */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Cost Breakdown
                      </h5>
                      {record.parts && record.parts.length > 0 ? (
                        <div className="space-y-2">
                          {record.parts.map((part, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-gray-600 dark:text-gray-400">
                                {part.name} × {part.quantity}
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                ₹{part.cost}
                              </span>
                            </div>
                          ))}
                          <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between font-medium">
                            <span className="text-gray-900 dark:text-white">
                              Total
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              ₹
                              {record.parts.reduce(
                                (sum, part) => sum + (part.cost || 0),
                                0
                              )}
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
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Notes
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                        {record.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
