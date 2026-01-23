import {
  BarChart3,
  FileText,
  Fuel,
  Plus,
  Thermometer,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { driverAPI } from "../../api/driverAPI";
import { fuelAPI } from "../../api/fuelAPI";
import vehicleAPI from "../../api/TvehicleAPI";
import { LoadingSpinner } from "../../utils/LoadingSpinner";
import { toast } from "../../utils/toast";
import { FuelAnalytics } from "./fuel/FuelAnalytics";
import { FuelEntriesGrid } from "./fuel/FuelEntriesGrid";
import { FuelEntriesList } from "./fuel/FuelEntriesList";
import { DeleteModal, EmptyState, FuelEntryModal } from "./fuel/FuelModals";
import { FuelReports } from "./fuel/FuelReports";
import { FuelStats } from "./fuel/FuelStats";

const FuelManagement = () => {
  const navigate = useNavigate();

  // State
  const [fuelEntries, setFuelEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [filterVehicle, setFilterVehicle] = useState("all");
  const [filterDriver, setFilterDriver] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("list");
  const [activeTab, setActiveTab] = useState("entries");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFuelModal, setShowFuelModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedForDelete, setSelectedForDelete] = useState(null);
  const [selectedForEdit, setSelectedForEdit] = useState(null);
  const [editingFuel, setEditingFuel] = useState(null);
  const [stats, setStats] = useState({
    totalFuel: 0,
    totalCost: "₹0",
    avgEfficiency: 0,
    avgCost: "₹0",
    monthlyCost: "₹0",
    monthlyTrend: "up",
    efficiencyTrend: "up",
    totalEntries: 0,
  });

  const { user } = useSelector((state) => state.auth);
  const orgId = user.orgId;

  // Fuel types for UI
  const fuelTypes = [
    {
      id: "diesel",
      name: "Diesel",
      icon: <Fuel className="h-4 w-4" />,
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    },
    {
      id: "petrol",
      name: "Petrol",
      icon: <Fuel className="h-4 w-4" />,
      color:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    },
    {
      id: "cng",
      name: "CNG",
      icon: <Thermometer className="h-4 w-4" />,
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    },
    {
      id: "electric",
      name: "Electric",
      icon: <Zap className="h-4 w-4" />,
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    },
  ];

  // Load initial data
  useEffect(() => {
    loadInitialData();
    loadFuel();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      // Load vehicles from API
      const vehiclesResponse = await vehicleAPI.getAllVehicles(1, 100, orgId);
      const vehicleList = vehiclesResponse.vehicles.map((vehicle) => ({
        id: vehicle.id,
        vehicleId: vehicle.vehicleNumber,
        registrationNumber: vehicle.vehicleNumber,
        make: vehicle.type || "Unknown",
        model: vehicle.model || "",
        fuelType: "diesel", // Default - you might want to add fuelType to vehicle model
        currentOdometer: 0,
      }));
      setVehicles(vehicleList);

      // Load drivers from API
      const driversResponse = await driverAPI.getDrivers();
      const driverList = driversResponse.drivers.map((driver) => ({
        id: driver.id,
        driverId: driver.id,
        name: driver.name,
        license: driver.licenseNumber,
        phone: driver.phone,
      }));
      setDrivers(driverList);

      // Load fuel entries
      await loadFuel();
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

  const loadFuel = async () => {
    try {
      setLoading(true);

      const response = await fuelAPI.getAllFuel(orgId);

      if (response.fuelEntries?.length > 0) {
        const formattedEntries = response.fuelEntries.map((entry) => {
          const odometerReading = parseFloat(entry.odometerReading) || 0;
          const previousOdometer = parseFloat(entry.previousOdometer) || 0;
          const quantity = parseFloat(entry.quantity) || 0;

          const distance =
            odometerReading > 0 && previousOdometer > 0
              ? odometerReading - previousOdometer
              : 0;

          const efficiencyValue =
            distance > 0 && quantity > 0 ? distance / quantity : 0;

          return {
            id: entry.id,
            entryId: entry.id,
            vehicleId: entry.vehicleId,
            // vehicle: entry.vehicle,
            vehicle: entry.vehicle?.vehicleNumber || "",
            driverId: entry.driverId,
            // driver: entry.driver,
            driver: entry.driver?.name || "",
            fuelType: (entry.fuelType || "diesel").toLowerCase(),
            quantity,
            unit: "liters",
            cost: formatIndianCurrency(entry.cost),
            costValue: parseFloat(entry.cost) || 0,
            costPerUnit:
              quantity > 0
                ? `₹${(parseFloat(entry.cost) / quantity).toFixed(2)}`
                : "₹0",
            odometerReading,
            previousOdometer,
            distance,
            efficiencyValue: parseFloat(efficiencyValue.toFixed(2)),
            efficiency: `${efficiencyValue.toFixed(2)} km/l`,
            station: entry.station || "Unknown Station",
            date: entry.date,
            time: entry.time || "00:00",
            receiptNumber: entry.receiptNumber || "N/A",
            notes: entry.notes || "",
          };
        });

        setFuelEntries(formattedEntries);
        setFilteredEntries(formattedEntries);
        calculateStats(formattedEntries);
      }
    } catch (error) {
      console.error("Error loading fuel entries:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format currency in Indian style
  const formatIndianCurrency = (amount) => {
    const numAmount = parseFloat(amount) || 0;
    if (numAmount >= 10000000) {
      return `${(numAmount / 10000000).toFixed(2)} `;
    } else if (numAmount >= 100000) {
      return `${(numAmount / 100000).toFixed(2)} `;
    } else if (numAmount >= 1000) {
      return `${numAmount} `;
    }
    return `₹${numAmount.toFixed(2)}`;
  };

  // Calculate statistics
  const calculateStats = (entries) => {
    const totalFuel = entries.reduce(
      (sum, entry) => sum + (entry.quantity || 0),
      0
    );

    const totalCost = entries.reduce(
      (sum, entry) => sum + (entry.costValue || 0),
      0
    );

    const avgCost =
      entries.length > 0 ? totalCost / entries.length : 0;

    // ✅ Collect valid efficiency values
    const efficiencies = entries
      .map((entry) => entry.efficiencyValue)
      .filter((val) => val && val > 0);

    const avgEfficiency =
      efficiencies.length > 0
        ? efficiencies.reduce((a, b) => a + b, 0) / efficiencies.length
        : 0;

    // ✅ Monthly cost calculation
    const currentMonth = new Date().toISOString().slice(0, 7);

    const monthlyCost = entries
      .filter((entry) => entry.date?.startsWith(currentMonth))
      .reduce((sum, entry) => sum + (entry.costValue || 0), 0);

    // ✅ Previous month for trend
    const previousMonth = new Date();
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    const prevMonthStr = previousMonth.toISOString().slice(0, 7);

    const previousMonthlyCost = entries
      .filter((entry) => entry.date?.startsWith(prevMonthStr))
      .reduce((sum, entry) => sum + (entry.costValue || 0), 0);

    const monthlyTrend =
      monthlyCost > previousMonthlyCost
        ? "up"
        : monthlyCost < previousMonthlyCost
          ? "down"
          : "stable";

    // ✅ Efficiency trend logic
    const efficiencyTrend =
      avgEfficiency > 6.5
        ? "up"
        : avgEfficiency > 4
          ? "stable"
          : "down";

    setStats({
      totalFuel: totalFuel.toFixed(1),
      totalCost: formatIndianCurrency(totalCost),
      avgEfficiency: avgEfficiency.toFixed(2),
      avgCost: formatIndianCurrency(avgCost),
      monthlyCost: formatIndianCurrency(monthlyCost),
      monthlyTrend,
      efficiencyTrend,
      totalEntries: entries.length,
    });
  };

  // Filter entries based on filters and search
  useEffect(() => {
    const filtered = fuelEntries.filter((entry) => {
      // Vehicle filter
      const matchesVehicle =
        filterVehicle === "all" || entry.vehicleId === filterVehicle;

      // Driver filter
      const matchesDriver =
        filterDriver === "all" || entry.driverId === filterDriver;

      // Period filter
      const matchesPeriod =
        filterPeriod === "all" ||
        (filterPeriod === "today" &&
          entry.date === new Date().toISOString().split("T")[0]) ||
        (filterPeriod === "week" && isWithinWeek(entry.date)) ||
        (filterPeriod === "month" && isWithinMonth(entry.date));

      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        String(entry.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(entry.vehicle).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(entry.driver).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(entry.station).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(entry.receiptNumber).toLowerCase().includes(searchQuery.toLowerCase());

      return matchesVehicle && matchesDriver && matchesPeriod && matchesSearch;
    });

    setFilteredEntries(filtered);
  }, [fuelEntries, filterVehicle, filterDriver, filterPeriod, searchQuery]);

  // Helper functions for date filtering
  const isWithinWeek = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    return date >= weekAgo && date <= today;
  };

  const isWithinMonth = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const monthAgo = new Date(today);
    monthAgo.setMonth(today.getMonth() - 1);
    return date >= monthAgo && date <= today;
  };

  // Helper functions for UI
  const getFuelTypeColor = (type) => {
    const fuelType = fuelTypes.find((t) => t.id === type);
    return (
      fuelType?.color ||
      "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    );
  };

  const getEfficiencyColor = (efficiency) => {
    const match = efficiency.match(/(\d+\.?\d*)/);
    const kmpl = match ? parseFloat(match[0]) : 0;
    if (kmpl > 6)
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
    if (kmpl > 4)
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
  };

  // Action handlers
  const handleAddFuelEntry = () => {
    setModalMode("add");
    setSelectedForEdit(null);
    setShowFuelModal(true);
  };

  const handleViewDetails = (entry) => {
    console.log("Viewing details for:", entry);
    // Could implement a detailed view modal
    alert(
      `Fuel Entry Details:\n\n` +
      `ID: ${entry.id}\n` +
      `Vehicle: ${entry.vehicle}\n` +
      `Driver: ${entry.driver}\n` +
      `Date: ${entry.date} ${entry.time}\n` +
      `Fuel Type: ${entry.fuelType}\n` +
      `Quantity: ${entry.quantity} L\n` +
      `Cost: ${entry.cost}\n` +
      `Station: ${entry.station}\n` +
      `Efficiency: ${entry.efficiency}`
    );
  };

  const handleEdit = (entry) => {
    console.log("Edit==>", entry);
    setModalMode("edit");
    setSelectedForEdit(entry);
    setShowFuelModal(true);
  };

  const handleDeleteClick = (entry) => {
    setSelectedForDelete(entry);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedForDelete) {
      try {
        // Extract original ID
        const originalId =
          selectedForDelete.entryId ||
          selectedForDelete.id.replace("FUEL-", "");

        // TODO: Uncomment when delete API is implemented
        // await fuelAPI.deleteFuel(originalId);

        // Update local state
        const updatedEntries = fuelEntries.filter(
          (entry) => entry.id !== selectedForDelete.id
        );
        setFuelEntries(updatedEntries);
        setFilteredEntries(
          updatedEntries.filter((entry) => entry.id !== selectedForDelete.id)
        );
        calculateStats(updatedEntries);

        // Clear selection
        setSelectedEntries(
          selectedEntries.filter((id) => id !== selectedForDelete.id)
        );

        setSelectedForDelete(null);
        setShowDeleteModal(false);
      } catch (error) {
        console.error("Error deleting fuel entry:", error);
        alert("Failed to delete fuel entry. Please try again.");
      }
    }
  };

  const handleSaveFuelEntry = async (formData, mode) => {
    console.log("FormData==>", formData);
    try {
      setLoading(true);

      // Prepare payload for API
      const userId = JSON.parse(localStorage.getItem("user"))?.usersId || "";

      const distance =
        parseFloat(formData.odometerReading) -
        parseFloat(formData.previousOdometer);

      const efficiency =
        distance > 0 && parseFloat(formData.quantity) > 0
          ? parseFloat((distance / parseFloat(formData.quantity)).toFixed(2))
          : 0;

      const fuelPayload = {
        date: formData.date,
        time:
          formData.time ||
          new Date().toTimeString().split(" ")[0].substring(0, 5),
        vehicle: formData.vehicleId,
        driver: formData.driverId,
        fuelType: formData.fuelType,
        quantity: parseFloat(formData.quantity),
        cost: parseFloat(formData.cost),
        station: formData.station,
        receiptNumber: formData.receiptNumber,
        odometerReading: parseFloat(formData.odometerReading),
        previousOdometer: parseFloat(formData.previousOdometer),
        efficiency: efficiency, // ✅ NOW DEFINED
        notes: formData.notes,
        branchCode: "MAIN",
        branchName: "Main Branch",
        orgId: orgId,
        createdBy: userId,
      };

      console.log("MODE", mode);

      // Add ID if editing
      if (mode === "edit" && formData.id) {
        fuelPayload.id = formData.id;
      }

      console.log("Sending fuel payload:", fuelPayload);

      // Call API with JSON data (not FormData)
      const response = await fuelAPI.createUpdateFuel(fuelPayload);

      if (response.statusFlag === "Ok") {
        // Reload fuel entries
        await loadFuel();
        setShowFuelModal(false);
        setSelectedForEdit(null);

        toast.success(
          `Fuel entry ${mode === "add" ? "added" : "updated"} successfully`
        );
      } else {
        throw new Error(response.message || "Failed to save fuel entry");
      }
    } catch (error) {
      console.error("Error saving fuel entry:", error);
      alert(`Failed to save fuel entry: ${error.message}`);
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

  const handleBulkDelete = () => {
    if (selectedEntries.length === 0) {
      alert("Please select entries to delete");
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete ${selectedEntries.length} selected entries?`
      )
    ) {
      const updatedEntries = fuelEntries.filter(
        (entry) => !selectedEntries.includes(entry.id)
      );
      setFuelEntries(updatedEntries);
      setFilteredEntries(
        updatedEntries.filter((entry) => !selectedEntries.includes(entry.id))
      );
      calculateStats(updatedEntries);
      setSelectedEntries([]);
    }
  };

  const handleExport = () => {
    if (selectedEntries.length === 0) {
      alert("Please select entries to export");
      return;
    }

    const entriesToExport =
      selectedEntries.length > 0
        ? fuelEntries.filter((entry) => selectedEntries.includes(entry.id))
        : fuelEntries;

    const csvContent = [
      "ID,Vehicle,Driver,Date,Time,Fuel Type,Quantity (L),Cost,Cost/L,Station,Odometer,Previous Odometer,Distance,Efficiency,Receipt Number,Notes",
      ...entriesToExport.map(
        (entry) =>
          `"${entry.id}","${entry.vehicle}","${entry.driver}","${entry.date}","${entry.time}",` +
          `"${entry.fuelType}","${entry.quantity}","${entry.cost}","${entry.costPerUnit}",` +
          `"${entry.station}","${entry.odometerReading}","${entry.previousOdometer}",` +
          `"${entry.distance}","${entry.efficiency}","${entry.receiptNumber}","${entry.notes}"`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `fuel-entries-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilterVehicle("all");
    setFilterDriver("all");
    setFilterPeriod("all");
  };

  // Sample data for fallback
  const sampleData = {
    vehicles: [
      {
        id: "VH-001",
        vehicleId: "MH-12-AB-1234",
        registrationNumber: "MH-12-AB-1234",
        make: "Tata",
        model: "Ultra 1518",
        fuelType: "diesel",
        currentOdometer: 85100,
      },
      {
        id: "VH-002",
        vehicleId: "MH-12-CD-5678",
        registrationNumber: "MH-12-CD-5678",
        make: "Ashok Leyland",
        model: "Captain 2516",
        fuelType: "diesel",
        currentOdometer: 65100,
      },
    ],
    drivers: [
      {
        id: "DR-001",
        driverId: "DR-001",
        name: "Rajesh Kumar",
        license: "DL-123456",
        phone: "9876543210",
      },
      {
        id: "DR-002",
        driverId: "DR-002",
        name: "Amit Sharma",
        license: "DL-234567",
        phone: "9876543211",
      },
    ],
    fuelEntries: [
      {
        id: "FUEL-2024-001",
        entryId: 1,
        vehicleId: "MH-12-AB-1234",
        vehicle: "MH-12-AB-1234",
        driverId: "DR-001",
        driver: "Rajesh Kumar",
        fuelType: "diesel",
        quantity: 150.5,
        unit: "liters",
        cost: "₹18,550",
        costValue: 18550,
        costPerUnit: "₹123.26",
        odometerReading: 85000,
        previousOdometer: 84750,
        distance: 250,
        efficiency: "6.6 km/l",
        station: "Indian Oil, Mumbai",
        date: "2024-03-15",
        time: "10:30 AM",
        receiptNumber: "RCPT-7890",
        notes: "Full tank refill before trip",
      },
      {
        id: "FUEL-2024-002",
        entryId: 2,
        vehicleId: "MH-12-CD-5678",
        vehicle: "MH-12-CD-5678",
        driverId: "DR-002",
        driver: "Amit Sharma",
        fuelType: "diesel",
        quantity: 120.0,
        unit: "liters",
        cost: "₹14,400",
        costValue: 14400,
        costPerUnit: "₹120.00",
        odometerReading: 65100,
        previousOdometer: 64900,
        distance: 200,
        efficiency: "5.0 km/l",
        station: "HP Petrol Pump, Pune",
        date: "2024-03-14",
        time: "02:15 PM",
        receiptNumber: "RCPT-7891",
        notes: "Regular refill",
      },
    ],
  };

  if (loading && fuelEntries.length === 0) {
    return <LoadingSpinner message="Loading fuel management data..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Fuel Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Track, analyze, and optimize fuel consumption
              </p>
            </div>
            <button
              onClick={handleAddFuelEntry}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <Plus className="h-4 w-4" />
              <span className="font-medium">Add Fuel Entry</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <FuelStats stats={stats} loading={loading} />

        {/* Tabs & Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-2 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Tabs */}
            <div className="flex items-center space-x-1 overflow-x-auto">
              <button
                onClick={() => setActiveTab("entries")}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "entries"
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
              >
                <Fuel className="h-4 w-4" />
                Fuel Entries
                <span className="ml-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                  {fuelEntries.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "analytics"
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "reports"
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
              >
                <FileText className="h-4 w-4" />
                Reports
              </button>
            </div>

            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${viewMode === "grid"
                  ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${viewMode === "list"
                  ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/*        
        <FuelFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterVehicle={filterVehicle}
          setFilterVehicle={setFilterVehicle}
          filterDriver={filterDriver}
          setFilterDriver={setFilterDriver}
          filterPeriod={filterPeriod}
          setFilterPeriod={setFilterPeriod}
          vehicles={vehicles}
          drivers={drivers}
          selectedEntries={selectedEntries}
          handleExport={handleExport}
          handleBulkDelete={handleBulkDelete}
          onClearFilters={handleClearFilters}
        /> */}

        {/* Content based on active tab */}
        {activeTab === "analytics" ? (
          <FuelAnalytics
            vehicles={vehicles}
            fuelEntries={fuelEntries}
            drivers={drivers}
          />
        ) : activeTab === "reports" ? (
          <FuelReports fuelEntries={fuelEntries} />
        ) : (
          <>
            <div className="mb-4">
              {/* <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredEntries.length} of {fuelEntries.length} fuel
                entries
                {searchQuery && ` for "${searchQuery}"`}
              </p> */}
            </div>

            {filteredEntries.length === 0 ? (
              <EmptyState onClearFilters={handleClearFilters} />
            ) : viewMode === "grid" ? (
              <FuelEntriesGrid
                entries={filteredEntries}
                selectedEntries={selectedEntries}
                handleSelectEntry={handleSelectEntry}
                handleViewDetails={handleViewDetails}
                handleEdit={handleEdit}
                handleDeleteClick={handleDeleteClick}
                fuelTypes={fuelTypes}
                getFuelTypeColor={getFuelTypeColor}
                getEfficiencyColor={getEfficiencyColor}
              />
            ) : (
              <FuelEntriesList
                entries={filteredEntries}
                selectedEntries={selectedEntries}
                handleSelectEntry={handleSelectEntry}
                handleViewDetails={handleViewDetails}
                handleEdit={handleEdit}
                handleDeleteClick={handleDeleteClick}
                fuelTypes={fuelTypes}
                getFuelTypeColor={getFuelTypeColor}
                getEfficiencyColor={getEfficiencyColor}
              />
            )}
          </>
        )}

        {/* Modals */}
        <DeleteModal
          show={showDeleteModal}
          entry={selectedForDelete}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
        />

        <FuelEntryModal
          show={showFuelModal}
          mode={modalMode}
          entry={selectedForEdit}
          vehicles={vehicles}
          drivers={drivers}
          onClose={() => {
            setShowFuelModal(false);
            setSelectedForEdit(null);
          }}
          onSave={handleSaveFuelEntry}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default FuelManagement;
