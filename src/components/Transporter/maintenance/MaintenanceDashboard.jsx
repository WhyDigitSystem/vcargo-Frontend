import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { MaintenanceFilters } from "./MaintenanceFilters";
import { MaintenanceForm } from "./MaintenanceForm";
import { MaintenanceList } from "./MaintenanceList";
import { MaintenanceSchedule } from "./MaintenanceSchedule";
import { MaintenanceStats } from "./MaintenanceStats";

export const MaintenanceDashboard = ({ vehicles = [] }) => {
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    vehicleId: "all",
    type: "all",
    priority: "all",
  });

  // Fetch maintenance records
  useEffect(() => {
    fetchMaintenanceRecords();
  }, []);

  const fetchMaintenanceRecords = async () => {
    // Mock data
    const mockRecords = [
      {
        id: "MAINT-001",
        title: "Engine Oil Change",
        vehicleId: "V001",
        vehicleName: "Tata Ace",
        type: "preventive",
        status: "completed",
        priority: "medium",
        scheduledDate: "2024-03-15",
        completedDate: "2024-03-14",
        odometerReading: 15000,
        cost: 4500,
        serviceCenter: "AutoCare Service",
        mechanic: "Rajesh Kumar",
        description: "Complete engine oil change with filter replacement",
        parts: [
          { name: "Engine Oil", quantity: 4, cost: 3200 },
          { name: "Oil Filter", quantity: 1, cost: 800 },
          { name: "Labor", quantity: 1, cost: 500 },
        ],
        notes: "Next oil change at 20,000 km",
      },
      {
        id: "MAINT-002",
        title: "Brake Pad Replacement",
        vehicleId: "V002",
        vehicleName: "Ashok Leyland Dost",
        type: "corrective",
        status: "in_progress",
        priority: "high",
        scheduledDate: "2024-03-20",
        odometerReading: 25000,
        estimatedCost: 8500,
        serviceCenter: "Brake Masters",
        mechanic: "Amit Sharma",
        description: "Front brake pad replacement",
        parts: [
          { name: "Brake Pads", quantity: 2, cost: 4500 },
          { name: "Labor", quantity: 1, cost: 4000 },
        ],
      },
      // Add more records...
    ];
    setMaintenanceRecords(mockRecords);
  };

  const handleSaveRecord = async (recordData) => {
    if (editingRecord) {
      setMaintenanceRecords((records) =>
        records.map((r) => (r.id === recordData.id ? recordData : r))
      );
    } else {
      setMaintenanceRecords((records) => [
        ...records,
        { ...recordData, id: `MAINT-${Date.now()}` },
      ]);
    }
    setShowForm(false);
    setEditingRecord(null);
  };

  const handleDeleteRecord = async (id) => {
    setMaintenanceRecords((records) => records.filter((r) => r.id !== id));
  };

  const handleEditRecord = (record) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  const handleStatusChange = (id, status) => {
    setMaintenanceRecords((records) =>
      records.map((record) =>
        record.id === id ? { ...record, status } : record
      )
    );
  };

  const filteredRecords = maintenanceRecords.filter((record) => {
    const matchesSearch =
      !filters.search ||
      record.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      record.vehicleName.toLowerCase().includes(filters.search.toLowerCase()) ||
      record.serviceCenter
        ?.toLowerCase()
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
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            New Maintenance
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <MaintenanceStats records={maintenanceRecords} />

      {/* Filters */}
      <MaintenanceFilters
        filters={filters}
        setFilters={setFilters}
        vehicles={vehicles}
        selectedRecords={selectedRecords}
        onBulkAction={(action) => console.log(action)}
      />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Maintenance List */}
        <div className="lg:col-span-2">
          <MaintenanceList
            records={filteredRecords}
            onEdit={handleEditRecord}
            onDelete={handleDeleteRecord}
            onStatusChange={handleStatusChange}
            selectedRecords={selectedRecords}
            onSelectRecord={setSelectedRecords}
          />
        </div>

        {/* Maintenance Schedule */}
        <div className="lg:col-span-1">
          <MaintenanceSchedule
            vehicles={vehicles}
            records={maintenanceRecords}
          />
        </div>
      </div>

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
