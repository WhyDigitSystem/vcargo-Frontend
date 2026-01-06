import { AlertTriangle, Fuel, RefreshCw } from "lucide-react";
import { FuelForm } from "./FuelForm";

export const DeleteModal = ({ show, entry, onClose, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Delete Fuel Entry
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete fuel entry <span className="font-semibold">{entry?.id}</span>? 
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
            >
              Delete Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FuelEntryModal = ({ 
  show, 
  mode = "add", // 'add' or 'edit'
  entry = null,
  vehicles = [],
  drivers = [],
  onClose,
  onSave 
}) => {
  if (!show) return null;

  const handleSave = async (formData) => {
    await onSave(formData, mode);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="w-full max-w-4xl my-8">
        <FuelForm
          entry={entry}
          vehicles={vehicles}
          drivers={drivers}
          onSave={handleSave}
          onCancel={onClose}
          isEditing={mode === "edit"}
        />
      </div>
    </div>
  );
};

export const EmptyState = ({ onClearFilters }) => (
  <div className="text-center py-12">
    <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
      <Fuel className="h-12 w-12 text-gray-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
      No fuel entries found
    </h3>
    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
      No fuel entries match your current filters. Try adjusting your search or filters.
    </p>
    <button
      onClick={onClearFilters}
      className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
    >
      <RefreshCw className="h-4 w-4" />
      Clear all filters
    </button>
  </div>
);