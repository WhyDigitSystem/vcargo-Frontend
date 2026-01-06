import { useState, useEffect } from "react";
import { 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  BarChart3, 
  Plus,
  Filter,
  Search,
  ChevronRight,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { TyreList } from "./TyreList";
import { TyreStats } from "./TyreStats";
import { TyreForm } from "./TyreForm";
import { TyreFilters } from "./TyreFilters";

export const TyreDashboard = ({ vehicles = [] }) => {
  const [tyres, setTyres] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTyre, setEditingTyre] = useState(null);
  const [selectedTyres, setSelectedTyres] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    vehicleId: "all",
    position: "all",
  });

  // Fetch tyres from API
  useEffect(() => {
    fetchTyres();
  }, []);

  const fetchTyres = async () => {
    // Mock data - replace with API call
    const mockTyres = [
      {
        id: "TYRE-001",
        serialNumber: "MRF001234",
        brand: "MRF",
        model: "Zapper",
        size: "205/55 R16",
        vehicleId: "V001",
        vehicleName: "Tata Ace",
        position: "Front Left",
        status: "active",
        purchaseDate: "2024-01-15",
        purchaseCost: 8500,
        odometerReading: 15000,
        treadDepth: 6.5,
        lastRotation: "2024-03-01",
        nextRotation: "2024-06-01",
        pressure: 32,
        recommendedPressure: 35,
      },
      // Add more mock data...
    ];
    setTyres(mockTyres);
  };

  const handleSaveTyre = async (tyreData) => {
    if (editingTyre) {
      // Update existing tyre
      setTyres(tyres.map(t => t.id === tyreData.id ? tyreData : t));
    } else {
      // Add new tyre
      setTyres([...tyres, { ...tyreData, id: `TYRE-${Date.now()}` }]);
    }
    setShowForm(false);
    setEditingTyre(null);
  };

  const handleDeleteTyre = async (id) => {
    setTyres(tyres.filter(t => t.id !== id));
  };

  const handleEditTyre = (tyre) => {
    setEditingTyre(tyre);
    setShowForm(true);
  };

  const filteredTyres = tyres.filter(tyre => {
    const matchesSearch = !filters.search || 
      tyre.serialNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
      tyre.brand.toLowerCase().includes(filters.search.toLowerCase()) ||
      tyre.vehicleName.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = filters.status === "all" || tyre.status === filters.status;
    const matchesVehicle = filters.vehicleId === "all" || tyre.vehicleId === filters.vehicleId;
    const matchesPosition = filters.position === "all" || tyre.position === filters.position;

    return matchesSearch && matchesStatus && matchesVehicle && matchesPosition;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tyre Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track, monitor, and maintain your vehicle tyres
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          Add New Tyre
        </button>
      </div>

      {/* Stats Cards */}
      <TyreStats tyres={tyres} />

      {/* Filters */}
      <TyreFilters 
        filters={filters}
        setFilters={setFilters}
        vehicles={vehicles}
        selectedTyres={selectedTyres}
        onBulkAction={(action) => console.log(action)}
      />

      {/* Tyre List */}
      <TyreList 
        tyres={filteredTyres}
        onEdit={handleEditTyre}
        onDelete={handleDeleteTyre}
        selectedTyres={selectedTyres}
        onSelectTyre={setSelectedTyres}
      />

      {/* Tyre Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => {
              setShowForm(false);
              setEditingTyre(null);
            }} />
            <TyreForm 
              tyre={editingTyre}
              vehicles={vehicles}
              onSave={handleSaveTyre}
              onCancel={() => {
                setShowForm(false);
                setEditingTyre(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};