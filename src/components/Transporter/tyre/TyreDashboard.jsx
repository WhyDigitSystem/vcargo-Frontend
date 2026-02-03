import { AlertTriangle, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import vehicleAPI from "../../../api/TvehicleAPI";
import { tyreAPI } from "../../../api/tyreAPI";

// import { DeleteModal } from "./DeleteModal";
import { useSelector } from "react-redux";
import { LoadingSpinner } from "../../../utils/LoadingSpinner";
import { toast } from "../../../utils/toast";
import { TyreForm } from "./TyreForm";
import { TyreList } from "./TyreList";
import { TyreStats } from "./TyreStats";

export const TyreDashboard = ({ vehicles = [] }) => {
  const [tyreEntries, setTyreEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [vehiclesList, setVehiclesList] = useState(vehicles);
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTyre, setEditingTyre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    vehicleId: "all",
    position: "all",
    condition: "all",
  });
  const [stats, setStats] = useState({
    totalTyres: 0,
    totalCost: "₹0",
    avgCost: "₹0",
    avgTreadDepth: "0%",
    needsAttention: 0,
    byPosition: { front: 0, rear: 0, spare: 0 },
    byCondition: { critical: 0, poor: 0, fair: 0, good: 0 },
    byStatus: { new: 0, used: 0, damaged: 0, replaced: 0 },
  });

  const { user } = useSelector((state) => state.auth);
  const orgId = user.orgId;

  // Format currency in Indian style
  const formatIndianCurrency = (amount) => {
    const numAmount = parseFloat(amount) || 0;
    if (numAmount >= 10000000) {
      return `₹${(numAmount / 10000000).toFixed(2)} Cr`;
    } else if (numAmount >= 100000) {
      return `₹${(numAmount / 100000).toFixed(2)} L`;
    } else if (numAmount >= 1000) {
      return `₹${numAmount}`;
    }
    return `₹${numAmount.toFixed(2)}`;
  };

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      // Load vehicles from API if not provided as prop
      if (vehicles.length === 0) {
        const vehiclesResponse = await vehicleAPI.getVehicles(orgId);
        const vehicleList = vehiclesResponse.vehicles.map((vehicle) => ({
          id: vehicle.id,
          vehicleId: vehicle.vehicleNumber,
          registrationNumber: vehicle.vehicleNumber,
          make: vehicle.type || "Unknown",
          model: vehicle.model || "",
        }));
        setVehiclesList(vehicleList);
      } else {
        setVehiclesList(vehicles);
      }

      // Load tyre entries
      await loadTyre();
    } catch (error) {
      console.error("Error loading initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadTyre = async () => {
    try {
      setLoading(true);

      const response = await tyreAPI.getAllTyre(orgId);

      console.log("Tyre API raw response:", response);

      if (!response?.tyreEntries || response.tyreEntries.length === 0) {
        setTyreEntries([]);
        setFilteredEntries([]);
        calculateTyreStats([]);
        return;
      }

      const formattedEntries = response.tyreEntries.map((entry) => {

        const purchaseDate = entry.purchaseDate
          ? new Date(entry.purchaseDate)
          : new Date();

        const today = new Date();
        const ageInMonths = Math.floor(
          (today - purchaseDate) / (1000 * 60 * 60 * 24 * 30)
        );

        const treadDepth = parseFloat(entry.treadDepth) || 0;

        let condition = "Good";
        let conditionColor = "text-green-600 bg-green-100";

        if (treadDepth < 30) {
          condition = "Critical";
          conditionColor = "text-red-600 bg-red-100";
        } else if (treadDepth < 50) {
          condition = "Poor";
          conditionColor = "text-orange-600 bg-orange-100";
        } else if (treadDepth < 70) {
          condition = "Fair";
          conditionColor = "text-yellow-600 bg-yellow-100";
        }

        const pressure = parseFloat(entry.pressure) || 0;
        const recommendedPressure =
          parseFloat(entry.recommendedPressure) || 0;

        let pressureStatus = "Normal";
        let pressureColor = "text-green-600 bg-green-100";

        if (recommendedPressure > 0) {
          const diff = Math.abs(pressure - recommendedPressure);
          if (diff > 15) {
            pressureStatus = "Critical";
            pressureColor = "text-red-600 bg-red-100";
          } else if (diff > 8) {
            pressureStatus = "Low";
            pressureColor = "text-orange-600 bg-orange-100";
          }
        }

        return {
          id: `TYRE-${entry.id}`,
          entryId: entry.id,
          serialNumber: entry.serialNumber || "N/A",
          brand: entry.brand || "Unknown",
          model: entry.model || "",
          size: entry.size || "",
          position: entry.position || "front",
          status: entry.status || "new",
          vehicleId: String(entry.vehicleId || ""),
          vehicle:
            typeof entry.vehicle === "object"
              ? entry.vehicle.vehicleNumber || "Unassigned"
              : entry.vehicle || "Unassigned",
          purchaseDate:
            entry.purchaseDate ||
            new Date().toISOString().split("T")[0],
          purchaseCost: parseFloat(entry.purchaseCost) || 0,
          odometerReading: parseFloat(entry.odometerReading) || 0,
          treadDepth,
          recommendedPressure,
          pressure,
          notes: entry.notes || "",
          active: entry.active !== undefined ? entry.active : true,
          branchCode: entry.branchCode || "MAIN",
          branchName: entry.branchName || "Main Branch",
          createdAt: entry.createdAt,
          updatedAt: entry.updatedAt,
          createdBy: entry.createdBy,
          ageMonths: ageInMonths,
          condition,
          conditionColor,
          pressureStatus,
          pressureColor,

          costFormatted: formatIndianCurrency(
            parseFloat(entry.purchaseCost) || 0
          ),
        };
      });

      console.log("Formatted tyre entries:", formattedEntries);

      setTyreEntries(formattedEntries);
      setFilteredEntries(formattedEntries);
      calculateTyreStats(formattedEntries);
    } catch (error) {
      console.error("Error loading tyre entries:", error);

      setTyreEntries([]);
      setFilteredEntries([]);
      calculateTyreStats([]);

      toast.error("Failed to load tyre data");
    } finally {
      setLoading(false);
    }
  };

  const calculateTyreStats = (entries) => {
    const totalTyres = entries.length;
    const totalCost = entries.reduce(
      (sum, entry) => sum + entry.purchaseCost,
      0
    );
    const avgCost =
      totalTyres > 0 ? Math.round(totalCost / totalTyres) : 0;

    // Count by position
    const byPosition = {
      front: entries.filter((e) => e.position === "front").length,
      rear: entries.filter((e) => e.position === "rear").length,
      spare: entries.filter((e) => e.position === "spare").length,
    };

    // Count by condition
    const byCondition = {
      critical: entries.filter((e) => e.condition === "Critical").length,
      poor: entries.filter((e) => e.condition === "Poor").length,
      fair: entries.filter((e) => e.condition === "Fair").length,
      good: entries.filter((e) => e.condition === "Good").length,
    };

    // Count by status
    const byStatus = {
      new: entries.filter((e) => e.status === "new").length,
      used: entries.filter((e) => e.status === "used").length,
      damaged: entries.filter((e) => e.status === "damaged").length,
      replaced: entries.filter((e) => e.status === "replaced").length,
    };

    // Calculate average tread depth
    const totalTreadDepth = entries.reduce(
      (sum, entry) => sum + entry.treadDepth,
      0
    );
    const avgTreadDepth =
      totalTyres > 0 ? (totalTreadDepth / totalTyres).toFixed(1) : 0;

    // Count tyres needing attention (tread < 50% or pressure critical)
    const needsAttention = entries.filter(
      (entry) => entry.treadDepth < 50 || entry.pressureStatus === "Critical"
    ).length;

    setStats({
      totalTyres: totalTyres,
      totalCost: formatIndianCurrency(totalCost),
      avgCost: formatIndianCurrency(avgCost),
      avgTreadDepth: `${avgTreadDepth}%`,
      needsAttention: needsAttention,
      byPosition: byPosition,
      byCondition: byCondition,
      byStatus: byStatus,
    });
  };

  // Filter entries based on filters and search
  useEffect(() => {
    const filtered = tyreEntries.filter((entry) => {
      // Search filter
      const matchesSearch =
        filters.search === "" ||
        entry.serialNumber
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        entry.brand.toLowerCase().includes(filters.search.toLowerCase()) ||
        entry.model.toLowerCase().includes(filters.search.toLowerCase()) ||
        entry.vehicle.toLowerCase().includes(filters.search.toLowerCase());

      // Status filter
      const matchesStatus =
        filters.status === "all" || entry.status === filters.status;

      // Vehicle filter
      const matchesVehicle =
        filters.vehicleId === "all" || entry.vehicleId === filters.vehicleId;

      // Position filter
      const matchesPosition =
        filters.position === "all" || entry.position === filters.position;

      // Condition filter
      const matchesCondition =
        filters.condition === "all" ||
        entry.condition.toLowerCase() === filters.condition.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesVehicle &&
        matchesPosition &&
        matchesCondition
      );
    });

    setFilteredEntries(filtered);
  }, [tyreEntries, filters]);

  // Action handlers
  const handleAddTyre = () => {
    setEditingTyre(null);
    setShowForm(true);
  };

  const handleEditTyre = (tyre) => {
    setEditingTyre(tyre);
    setShowForm(true);
  };

  const handleDeleteClick = (tyre) => {
    setSelectedForDelete(tyre);
    setShowDeleteModal(true);
  };

  const handleSaveTyre = async (tyreData) => {
    console.log("tyreData", tyreData);

    try {
      setLoading(true);

      // Prepare payload for API
      const userId = JSON.parse(localStorage.getItem("user"))?.usersId || "";

      const tyrePayload = {
        serialNumber: tyreData.serialNumber,
        brand: tyreData.brand,
        model: tyreData.model,
        size: tyreData.size,
        position: tyreData.position,
        status: tyreData.status,
        purchaseDate: tyreData.purchaseDate,
        purchaseCost: parseFloat(tyreData.purchaseCost),
        odometerReading: parseFloat(tyreData.odometerReading),
        treadDepth: parseFloat(tyreData.treadDepth),
        recommendedPressure: parseFloat(tyreData.recommendedPressure),
        pressure: parseFloat(tyreData.pressure),
        notes: tyreData.notes,
        active: tyreData.active !== undefined ? tyreData.active : true,
        vehicleId: tyreData.vehicleId,
        vehicle: tyreData.vehicleName,
        branchCode: "MAIN",
        branchName: "Main Branch",
        orgId: orgId,
        createdBy: userId,
      };

      // Add ID if editing
      if (editingTyre && editingTyre.entryId) {
        tyrePayload.id = editingTyre.entryId;
      }

      console.log("Sending tyre payload:", tyrePayload);

      // Call API
      const response = await tyreAPI.createUpdateTyre(tyrePayload);

      if (response.statusFlag === "Ok") {
        // Reload tyre entries
        await loadTyre();
        setShowForm(false);
        setEditingTyre(null);

        toast.success(
          `Tyre ${editingTyre ? "updated" : "added"} successfully!`
        );
      } else {
        throw new Error(response.message || "Failed to save tyre");
      }
    } catch (error) {
      console.error("Error saving tyre:", error);
      alert(`Failed to save tyre: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEntry = (id) => {
    if (id === "all") {
      if (selectedEntries.length === filteredEntries.length) {
        setSelectedEntries([]);
      } else {
        setSelectedEntries(filteredEntries.map((entry) => entry.id));
      }
    } else {
      if (selectedEntries.includes(id)) {
        setSelectedEntries(selectedEntries.filter((entryId) => entryId !== id));
      } else {
        setSelectedEntries([...selectedEntries, id]);
      }
    }
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      status: "all",
      vehicleId: "all",
      position: "all",
      condition: "all",
    });
  };

  if (loading && tyreEntries.length === 0) {
    return <LoadingSpinner message="Loading tyre management data..." />;
  }

  return (
    <div className="space-y-6 p-3">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tyre Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track, monitor, and maintain your vehicle tyres
          </p>
        </div>
        <button
          onClick={handleAddTyre}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          <Plus className="h-4 w-4" />
          Add New Tyre
        </button>
      </div>

      {/* Stats Cards */}
      <TyreStats stats={stats} loading={loading} />

      {/* Results count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredEntries.length} of {tyreEntries.length} tyres
          {filters.search && ` for "${filters.search}"`}
        </p>
      </div>

      {/* Tyre List */}
      {filteredEntries.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No tyres found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {filters.search ||
              filters.status !== "all" ||
              filters.vehicleId !== "all" ||
              filters.position !== "all"
              ? "Try adjusting your filters"
              : "Add your first tyre to get started"}
          </p>
          {(filters.search ||
            filters.status !== "all" ||
            filters.vehicleId !== "all" ||
            filters.position !== "all") && (
              <button
                onClick={handleClearFilters}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Clear all filters
              </button>
            )}
        </div>
      ) : (
        <TyreList
          tyres={filteredEntries}
          onEdit={handleEditTyre}
          onDelete={handleDeleteClick}
          selectedEntries={selectedEntries}
          onSelectEntry={handleSelectEntry}
        />
      )}

      {/* Tyre Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => {
                setShowForm(false);
                setEditingTyre(null);
              }}
            />
            <TyreForm
              tyre={editingTyre}
              vehicles={vehiclesList}
              onSave={handleSaveTyre}
              onCancel={() => {
                setShowForm(false);
                setEditingTyre(null);
              }}
              loading={loading}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {/* <DeleteModal
        show={showDeleteModal}
        entry={selectedForDelete}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
      /> */}
    </div>
  );
};
