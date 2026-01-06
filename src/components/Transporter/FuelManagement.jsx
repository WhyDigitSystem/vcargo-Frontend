import {
  BarChart3,
  FileText,
  Fuel,
  Plus,
  Thermometer,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../../utils/LoadingSpinner";
import { FuelAnalytics } from "./fuel/FuelAnalytics";
import { FuelEntriesGrid } from "./fuel/FuelEntriesGrid";
import { FuelEntriesList } from "./fuel/FuelEntriesList";
import { FuelFilters } from "./fuel/FuelFilters";
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
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [selectedForDelete, setSelectedForDelete] = useState(null);
  const [selectedForEdit, setSelectedForEdit] = useState(null);
  const [stats, setStats] = useState({
    totalFuel: 0,
    totalCost: "$0",
    avgEfficiency: 0,
    avgCost: "$0",
    monthlyCost: "$0",
    monthlyTrend: "up",
    efficiencyTrend: "up",
    totalEntries: 0,
  });

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

  // Sample data
  const sampleData = {
    vehicles: [
      {
        id: "VH-001",
        registrationNumber: "MH-12-AB-1234",
        make: "Tata",
        model: "Ultra 1518",
        fuelType: "diesel",
        currentOdometer: 85100,
      },
      {
        id: "VH-002",
        registrationNumber: "MH-12-CD-5678",
        make: "Ashok Leyland",
        model: "Captain 2516",
        fuelType: "diesel",
        currentOdometer: 65100,
      },
      {
        id: "VH-003",
        registrationNumber: "MH-12-EF-9012",
        make: "Mahindra",
        model: "Blazo X 28",
        fuelType: "diesel",
        currentOdometer: 45100,
      },
      {
        id: "VH-004",
        registrationNumber: "MH-12-GH-3456",
        make: "Eicher",
        model: "Pro 3015",
        fuelType: "diesel",
        currentOdometer: 120100,
      },
      {
        id: "VH-005",
        registrationNumber: "MH-12-IJ-7890",
        make: "Volvo",
        model: "FMX 440",
        fuelType: "diesel",
        currentOdometer: 35100,
      },
    ],
    drivers: [
      {
        id: "DR-001",
        name: "Rajesh Kumar",
        license: "DL-123456",
        phone: "9876543210",
      },
      {
        id: "DR-002",
        name: "Amit Sharma",
        license: "DL-234567",
        phone: "9876543211",
      },
      {
        id: "DR-003",
        name: "Suresh Patel",
        license: "DL-345678",
        phone: "9876543212",
      },
      {
        id: "DR-004",
        name: "Vikram Singh",
        license: "DL-456789",
        phone: "9876543213",
      },
    ],
    fuelEntries: [
      {
        id: "FUEL-2024-001",
        vehicleId: "VH-001",
        vehicle: "MH-12-AB-1234",
        driverId: "DR-001",
        driver: "Rajesh Kumar",
        fuelType: "diesel",
        quantity: 150.5,
        unit: "liters",
        cost: "₹18,550", // Changed to ₹
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
      // ... more entries
    ],
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setVehicles(sampleData.vehicles);
      setDrivers(sampleData.drivers);
      setFuelEntries(sampleData.fuelEntries);
      calculateStats(sampleData.fuelEntries);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const filtered = fuelEntries.filter((entry) => {
      const matchesVehicle =
        filterVehicle === "all" || entry.vehicleId === filterVehicle;
      const matchesDriver =
        filterDriver === "all" || entry.driverId === filterDriver;
      const matchesSearch =
        entry.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.station.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesVehicle && matchesDriver && matchesSearch;
    });
    setFilteredEntries(filtered);
  }, [fuelEntries, filterVehicle, filterDriver, searchQuery]);

  const calculateStats = (entries) => {
    const totalFuel = entries.reduce((sum, entry) => sum + entry.quantity, 0);
    const totalCost = entries.reduce((sum, entry) => {
      // Remove any currency symbol and convert to number
      const costValue = parseFloat(entry.cost.replace(/[₹$,]/g, ""));
      return sum + costValue;
    }, 0);
    const avgCost = entries.length > 0 ? totalCost / entries.length : 0;

    const efficiencies = entries.map((entry) =>
      parseFloat(entry.efficiency.split(" ")[0])
    );
    const avgEfficiency =
      efficiencies.length > 0
        ? efficiencies.reduce((sum, eff) => sum + eff, 0) / efficiencies.length
        : 0;

    const monthlyCost = entries
      .filter((entry) => entry.date.startsWith("2024-03"))
      .reduce((sum, entry) => {
        const costValue = parseFloat(entry.cost.replace(/[₹$,]/g, ""));
        return sum + costValue;
      }, 0);

    // Format numbers in Indian style
    const formatIndianCurrency = (amount) => {
      if (amount >= 10000000) {
        return `₹${(amount / 10000000).toFixed(2)} Cr`;
      } else if (amount >= 100000) {
        return `₹${(amount / 100000).toFixed(2)} L`;
      } else if (amount >= 1000) {
        return `₹${(amount / 1000).toFixed(2)} K`;
      }
      return `₹${amount.toFixed(2)}`;
    };

    setStats({
      totalFuel: totalFuel.toFixed(1),
      totalCost: formatIndianCurrency(totalCost), // Indian format
      avgEfficiency: avgEfficiency.toFixed(2),
      avgCost: formatIndianCurrency(avgCost), // Indian format
      monthlyCost: formatIndianCurrency(monthlyCost), // Indian format
      monthlyTrend: "up",
      efficiencyTrend: avgEfficiency > 6.5 ? "up" : "down",
      totalEntries: entries.length,
    });
  };

  // Helper functions
  const getFuelTypeColor = (type) => {
    const fuelType = fuelTypes.find((t) => t.id === type);
    return (
      fuelType?.color ||
      "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    );
  };

  const getEfficiencyColor = (efficiency) => {
    const kmpl = parseFloat(efficiency.split(" ")[0]);
    if (kmpl > 6)
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
    if (kmpl > 4)
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
  };

  // Calculate efficiency
  const calculateEfficiency = (distance, quantity) => {
    if (quantity === 0) return "0 km/l";
    const efficiency = distance / quantity;
    return `${efficiency.toFixed(2)} km/l`;
  };

  // Actions
  const handleAddFuelEntry = () => {
    setModalMode("add");
    setSelectedForEdit(null);
    setShowFuelModal(true);
  };

  const handleViewDetails = (entry) => {
    // You can implement a details modal or page
    alert(
      `Details for ${entry.id}\nVehicle: ${entry.vehicle}\nDriver: ${entry.driver}\nCost: ${entry.cost}`
    );
  };

  const handleEdit = (entry) => {
    setModalMode("edit");
    setSelectedForEdit(entry);
    setShowFuelModal(true);
  };

  const handleDeleteClick = (entry) => {
    setSelectedForDelete(entry);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedForDelete) {
      setFuelEntries((prev) =>
        prev.filter((entry) => entry.id !== selectedForDelete.id)
      );
      setSelectedForDelete(null);
      setShowDeleteModal(false);
      calculateStats(
        fuelEntries.filter((entry) => entry.id !== selectedForDelete.id)
      );
    }
  };

  const handleSaveFuelEntry = async (formData, mode) => {
    // Calculate distance and efficiency
    const distance =
      formData.odometerReading - (formData.previousOdometer || 0);
    const efficiency = calculateEfficiency(distance, formData.quantity);

    const newEntry = {
      ...formData,
      id: mode === "add" ? `FUEL-${Date.now()}` : formData.id,
      vehicle:
        vehicles.find((v) => v.id === formData.vehicleId)?.registrationNumber ||
        "",
      driver: drivers.find((d) => d.id === formData.driverId)?.name || "",
      unit: "liters",
      cost: `$${parseFloat(formData.cost).toFixed(2)}`,
      costPerUnit: `$${(
        parseFloat(formData.cost) / parseFloat(formData.quantity)
      ).toFixed(2)}`,
      distance,
      efficiency,
    };

    if (mode === "add") {
      setFuelEntries((prev) => [newEntry, ...prev]);
      calculateStats([newEntry, ...fuelEntries]);
    } else {
      setFuelEntries((prev) =>
        prev.map((entry) => (entry.id === formData.id ? newEntry : entry))
      );
      calculateStats(
        fuelEntries.map((entry) =>
          entry.id === formData.id ? newEntry : entry
        )
      );
    }

    setShowFuelModal(false);
    setSelectedForEdit(null);
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
    setFuelEntries((prev) =>
      prev.filter((entry) => !selectedEntries.includes(entry.id))
    );
    calculateStats(
      fuelEntries.filter((entry) => !selectedEntries.includes(entry.id))
    );
    setSelectedEntries([]);
  };

  const handleExport = () => {
    if (selectedEntries.length === 0) {
      alert("Please select entries to export");
      return;
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,Vehicle,Driver,Date,Quantity (L),Cost,Station,Efficiency"]
        .concat(
          selectedEntries.map((id) => {
            const entry = fuelEntries.find((e) => e.id === id);
            return `"${entry.id}","${entry.vehicle}","${entry.driver}","${entry.date}","${entry.quantity}","${entry.cost}","${entry.station}","${entry.efficiency}"`;
          })
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "fuel-entries-export.csv");
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

  if (loading)
    return <LoadingSpinner message="Loading fuel management data..." />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header onAddEntry={handleAddFuelEntry} />

        {/* Stats */}
        <FuelStats stats={stats} />

        {/* Tabs & Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-2 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <Tabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              entriesCount={fuelEntries.length}
            />
            <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
          </div>
        </div>

        {/* Filters */}
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
        />

        {/* Content based on active tab */}
        {activeTab === "analytics" ? (
          <FuelAnalytics
            vehicles={vehicles}
            fuelEntries={fuelEntries}
            drivers={drivers}
          />
        ) : activeTab === "reports" ? (
          <FuelReports />
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredEntries.length} of {fuelEntries.length} fuel
                entries
              </p>
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
        />
      </div>
    </div>
  );
};

const Header = ({ onAddEntry }) => (
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
        onClick={onAddEntry}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-lg"
      >
        <Plus className="h-4 w-4" />
        <span className="font-medium">Add Fuel Entry</span>
      </button>
    </div>
  </div>
);

const Tabs = ({ activeTab, setActiveTab, entriesCount }) => (
  <div className="flex items-center space-x-1 overflow-x-auto">
    <TabButton
      active={activeTab === "entries"}
      onClick={() => setActiveTab("entries")}
      icon={Fuel}
      text="Fuel Entries"
      count={entriesCount}
    />
    <TabButton
      active={activeTab === "analytics"}
      onClick={() => setActiveTab("analytics")}
      icon={BarChart3}
      text="Analytics"
    />
    <TabButton
      active={activeTab === "reports"}
      onClick={() => setActiveTab("reports")}
      icon={FileText}
      text="Reports"
    />
  </div>
);

const TabButton = ({ active, onClick, icon: Icon, text, count }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      active
        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
    }`}
  >
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4" />
      {text}
      {count !== undefined && (
        <span className="ml-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-xs">
          {count}
        </span>
      )}
    </div>
  </button>
);

const ViewToggle = ({ viewMode, setViewMode }) => (
  <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
    <button
      onClick={() => setViewMode("grid")}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        viewMode === "grid"
          ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      }`}
    >
      Grid
    </button>
    <button
      onClick={() => setViewMode("list")}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        viewMode === "list"
          ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      }`}
    >
      List
    </button>
  </div>
);

export default FuelManagement;
