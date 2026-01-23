// MaintenanceDashboard.js
import { Plus, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { maintananceAPI } from "../../../api/maintananceAPI";
import vehicleAPI from "../../../api/TvehicleAPI";
import { MaintenanceForm } from "./MaintenanceForm";
import { MaintenanceList } from "./MaintenanceList";
import { MaintenanceSchedule } from "./MaintenanceSchedule";
import { MaintenanceStats } from "./MaintenanceStats";
import { useSelector } from "react-redux";

export const MaintenanceDashboard = () => {
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const [vehicles, setVehicles] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    vehicleId: "all",
    type: "all",
    priority: "all",
  });

  // Organization ID - should come from auth context or props
  const { user } = useSelector((state) => state.auth);
  const orgId = user.orgId;

  // Fetch maintenance records
  // useEffect(() => {
  //   fetchMaintenanceRecords();
  // }, [pagination.page, pagination.count]);

  useEffect(() => {
    fetchMaintenanceRecords();
  }, []);

  useEffect(() => {
    loadVehicles();
  }, []);

  const fetchMaintenanceRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      // Prepare filters for API
      const apiFilters = {};

      // Only add filters that are not "all"
      if (filters.status !== "all") apiFilters.status = filters.status;
      if (filters.vehicleId !== "all") apiFilters.vehicleId = filters.vehicleId;
      if (filters.type !== "all") apiFilters.type = filters.type;
      if (filters.priority !== "all") apiFilters.priority = filters.priority;
      if (filters.search) apiFilters.search = filters.search;

      console.log("Fetching maintenance with filters:", apiFilters);

      const response = await maintananceAPI.getAllMaintenance(orgId);

      console.log("Maintenance API Response:", response);

      setMaintenanceRecords(response.maintenanceRecords || []);

      if (response.message) {
        // toast.success(response.message);
      }
    } catch (err) {
      console.error("Error fetching maintenance records:", err);
      setError(err.message || "Failed to load maintenance records");
      toast.error(err.message || "Failed to load maintenance records");
    } finally {
      setLoading(false);
    }
  };

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const vehiclesResponse = await vehicleAPI.getVehicles(orgId);
      const vehicleList = vehiclesResponse.vehicles.map((vehicle) => ({
        id: vehicle.id,
        vehicleId: vehicle.Id,
        registrationNumber: vehicle.vehicleNumber,
        make: vehicle.type || "Unknown",
        model: vehicle.model || "",
      }));
      setVehicles(vehicleList);
    } catch (error) {
      console.error("Error loading initial data:", error);
      // Fallback to sample data if API fails
      // setVehicles(sampleData.vehicles);
      // setDrivers(sampleData.drivers);
      // setFuelEntries(sampleData.fuelEntries);
      // setFilteredEntries(sampleData.fuelEntries);
      // calculateStats(sampleData.fuelEntries);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecord = async (recordData) => {
    try {
      // TODO: Implement create/update API calls
      console.log("Saving record:", recordData);

      if (editingRecord) {
        // Update existing record
        toast.success("Maintenance record updated successfully");
      } else {
        // Create new record
        toast.success("Maintenance record created successfully");
      }

      // Refresh the list after save
      await fetchMaintenanceRecords();
      setShowForm(false);
      setEditingRecord(null);
    } catch (error) {
      console.error("Error saving maintenance record:", error);
      toast.error(error.message || "Failed to save maintenance record");
    }
  };

  const handleDeleteRecord = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this maintenance record?"
      )
    ) {
      return;
    }

    try {
      // TODO: Implement delete API call
      console.log("Deleting record:", id);

      // For now, just filter out from local state
      setMaintenanceRecords((prev) =>
        prev.filter((record) => record.id !== id)
      );
      toast.success("Maintenance record deleted successfully");
    } catch (error) {
      console.error("Error deleting maintenance record:", error);
      toast.error("Failed to delete maintenance record");
    }
  };

  const handleEditRecord = (record) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  const handleStatusChange = async (id, status) => {
    try {
      // TODO: Implement status update API call
      console.log("Updating status:", id, status);

      // Update local state
      setMaintenanceRecords((prev) =>
        prev.map((record) =>
          record.id === id ? { ...record, status } : record
        )
      );

      toast.success(`Status updated to ${status.replace("_", " ")}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedRecords.length === 0) {
      toast.error("Please select records to perform bulk action");
      return;
    }

    try {
      // TODO: Implement bulk action API calls
      console.log("Bulk action:", action, "on records:", selectedRecords);

      switch (action) {
        case "delete":
          if (
            window.confirm(`Delete ${selectedRecords.length} selected records?`)
          ) {
            // For now, just filter out from local state
            setMaintenanceRecords((prev) =>
              prev.filter((record) => !selectedRecords.includes(record.id))
            );
            setSelectedRecords([]);
            toast.success("Selected records deleted successfully");
          }
          break;

        case "status_pending":
        case "status_in_progress":
        case "status_completed":
          const status = action.split("_")[1];
          setMaintenanceRecords((prev) =>
            prev.map((record) =>
              selectedRecords.includes(record.id)
                ? { ...record, status }
                : record
            )
          );
          toast.success(`Status updated for ${selectedRecords.length} records`);
          break;

        default:
          toast.info(`Bulk action "${action}" executed`);
      }
    } catch (error) {
      console.error("Error in bulk action:", error);
      toast.error("Failed to perform bulk action");
    }
  };

  const handleRefresh = () => {
    fetchMaintenanceRecords();
  };

  // Apply local filters
  const filteredRecords = maintenanceRecords.filter((record) => {
    const matchesSearch =
      !filters.search ||
      record.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      record.vehicleName.toLowerCase().includes(filters.search.toLowerCase()) ||
      (record.serviceCenter || "")
        .toLowerCase()
        .includes(filters.search.toLowerCase()) ||
      (record.description || "")
        .toLowerCase()
        .includes(filters.search.toLowerCase()) ||
      (record.mechanic || "")
        .toLowerCase()
        .includes(filters.search.toLowerCase());

    const matchesStatus =
      filters.status === "all" || record.status === filters.status;
    const matchesVehicle =
      filters.vehicleId === "all" || record.vehicleId === filters.vehicleId;
    const matchesType = filters.type === "all" || record.type === filters.type;
    const matchesPriority =
      filters.priority === "all" || record.priority === filters.priority;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesVehicle &&
      matchesType &&
      matchesPriority
    );
  });

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-800 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Repair & Maintenance
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage vehicle repairs, maintenance schedules, and service records
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            <Plus className="h-4 w-4" />
            New Maintenance
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <MaintenanceStats records={maintenanceRecords} />

      {/* Filters */}
      {/* <MaintenanceFilters
        filters={filters}
        setFilters={setFilters}
        vehicles={vehicles}
        selectedRecords={selectedRecords}
        onBulkAction={handleBulkAction}
        loading={loading}
        onRefresh={handleRefresh}
      /> */}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading maintenance records...
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!loading && (
        <>
          {/* Records Count */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredRecords.length} records
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Maintenance List */}
            <div className="lg:col-span-3">
              <MaintenanceList
                records={filteredRecords}
                onEdit={handleEditRecord}
                onDelete={handleDeleteRecord}
                onStatusChange={handleStatusChange}
                selectedRecords={selectedRecords}
                onSelectRecord={setSelectedRecords}
                loading={loading}
              />
            </div>

            {/* Maintenance Schedule */}
            {/* <div className="lg:col-span-1">
              <MaintenanceSchedule
                vehicles={vehicles}
                records={maintenanceRecords}
              />
            </div> */}
          </div>

          <MaintenanceSchedule
            vehicles={vehicles}
            records={maintenanceRecords}
          />
        </>
      )}

      {/* Maintenance Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => {
                setShowForm(false);
                setEditingRecord(null);
              }}
            />
            <MaintenanceForm
              record={editingRecord}
              vehicles={vehicles}
              onSave={handleSaveRecord}
              onCancel={() => {
                setShowForm(false);
                setEditingRecord(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
