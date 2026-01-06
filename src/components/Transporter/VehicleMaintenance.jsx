// pages/VehicleMaintenance.jsx
import {
  AlertTriangle,
  BarChart3,
  Battery,
  Calendar,
  Car,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  DollarSign,
  Download,
  Edit,
  Eye,
  FileText,
  FireExtinguisherIcon,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  TimerReset,
  Trash2,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const VehicleMaintenance = () => {
  const navigate = useNavigate();

  // State management
  const [maintenanceItems, setMaintenanceItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterVehicle, setFilterVehicle] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [stats, setStats] = useState({
    upcoming: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
    totalCost: 0,
    averageDowntime: 0,
    monthlyCost: 0,
    costTrend: "up",
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState(null);

  // Maintenance types
  const maintenanceTypes = [
    {
      id: "routine",
      name: "Routine Service",
      icon: <RefreshCw className="h-4 w-4" />,
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    },
    {
      id: "repair",
      name: "Repair",
      icon: <Wrench className="h-4 w-4" />,
      color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    },
    {
      id: "inspection",
      name: "Inspection",
      icon: <Eye className="h-4 w-4" />,
      color:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    },
    {
      id: "emergency",
      name: "Emergency",
      icon: <AlertTriangle className="h-4 w-4" />,
      color:
        "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    },
    {
      id: "preventive",
      name: "Preventive",
      icon: <Zap className="h-4 w-4" />,
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    },
    {
      id: "battery",
      name: "Battery",
      icon: <Battery className="h-4 w-4" />,
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    },
    {
      id: "tires",
      name: "Tires",
      icon: <TimerReset className="h-4 w-4" />,
      color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
    },
    {
      id: "engine",
      name: "Engine",
      icon: <FireExtinguisherIcon className="h-4 w-4" />,
      color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
    },
  ];

  // Sample data - replace with API calls
  const sampleVehicles = [
    {
      id: "VH-001",
      registrationNumber: "MH-12-AB-1234",
      make: "Tata",
      model: "Ultra 1518",
      status: "active",
    },
    {
      id: "VH-002",
      registrationNumber: "MH-12-CD-5678",
      make: "Ashok Leyland",
      model: "Captain 2516",
      status: "active",
    },
    {
      id: "VH-003",
      registrationNumber: "MH-12-EF-9012",
      make: "Mahindra",
      model: "Blazo X 28",
      status: "active",
    },
    {
      id: "VH-004",
      registrationNumber: "MH-12-GH-3456",
      make: "Eicher",
      model: "Pro 3015",
      status: "active",
    },
    {
      id: "VH-005",
      registrationNumber: "MH-12-IJ-7890",
      make: "Volvo",
      model: "FMX 440",
      status: "active",
    },
  ];

  const sampleMaintenance = [
    {
      id: "MNT-2024-001",
      vehicleId: "VH-001",
      vehicle: "MH-12-AB-1234",
      type: "routine",
      status: "completed",
      description: "Oil change and filter replacement",
      scheduledDate: "2024-03-10",
      completedDate: "2024-03-10",
      estimatedCost: "$150",
      actualCost: "$145",
      vendor: "AutoCare Service Center",
      odometerReading: 85000,
      downtimeDays: 1,
      priority: "medium",
      notes: "Regular maintenance completed successfully",
    },
    {
      id: "MNT-2024-002",
      vehicleId: "VH-002",
      vehicle: "MH-12-CD-5678",
      type: "repair",
      status: "in_progress",
      description: "Brake pad replacement",
      scheduledDate: "2024-03-15",
      startedDate: "2024-03-15",
      estimatedCost: "$300",
      vendor: "Brake Masters",
      odometerReading: 65000,
      priority: "high",
      notes: "Front brake pads worn out",
    },
    {
      id: "MNT-2024-003",
      vehicleId: "VH-003",
      vehicle: "MH-12-EF-9012",
      type: "inspection",
      status: "scheduled",
      description: "Annual safety inspection",
      scheduledDate: "2024-03-20",
      estimatedCost: "$100",
      odometerReading: 45000,
      priority: "low",
    },
    {
      id: "MNT-2024-004",
      vehicleId: "VH-001",
      vehicle: "MH-12-AB-1234",
      type: "tires",
      status: "overdue",
      description: "Tire rotation and balancing",
      scheduledDate: "2024-03-05",
      estimatedCost: "$80",
      odometerReading: 86000,
      priority: "high",
    },
    {
      id: "MNT-2024-005",
      vehicleId: "VH-004",
      vehicle: "MH-12-GH-3456",
      type: "engine",
      status: "scheduled",
      description: "Engine tuning and diagnostics",
      scheduledDate: "2024-03-25",
      estimatedCost: "$250",
      odometerReading: 120000,
      priority: "medium",
    },
    {
      id: "MNT-2024-006",
      vehicleId: "VH-005",
      vehicle: "MH-12-IJ-7890",
      type: "battery",
      status: "completed",
      description: "Battery replacement",
      scheduledDate: "2024-03-08",
      completedDate: "2024-03-08",
      estimatedCost: "$200",
      actualCost: "$195",
      vendor: "Battery World",
      odometerReading: 35000,
      downtimeDays: 0.5,
      priority: "medium",
    },
    {
      id: "MNT-2024-007",
      vehicleId: "VH-002",
      vehicle: "MH-12-CD-5678",
      type: "preventive",
      status: "scheduled",
      description: "Preventive maintenance check",
      scheduledDate: "2024-04-01",
      estimatedCost: "$180",
      odometerReading: 65500,
      priority: "medium",
    },
    {
      id: "MNT-2024-008",
      vehicleId: "VH-003",
      vehicle: "MH-12-EF-9012",
      type: "emergency",
      status: "completed",
      description: "Emergency repair - fuel pump",
      scheduledDate: "2024-03-12",
      completedDate: "2024-03-12",
      estimatedCost: "$450",
      actualCost: "$420",
      vendor: "QuickFix Auto",
      odometerReading: 45200,
      downtimeDays: 2,
      priority: "high",
    },
  ];

  // Initialize data
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setVehicles(sampleVehicles);
      setMaintenanceItems(sampleMaintenance);
      calculateStats(sampleMaintenance);
      setLoading(false);
    }, 1000);
  }, []);

  const calculateStats = (items) => {
    const today = new Date();

    const upcoming = items.filter(
      (item) =>
        item.status === "scheduled" && new Date(item.scheduledDate) > today
    ).length;

    const inProgress = items.filter(
      (item) => item.status === "in_progress"
    ).length;

    const completed = items.filter(
      (item) => item.status === "completed"
    ).length;

    const overdue = items.filter(
      (item) =>
        item.status === "scheduled" && new Date(item.scheduledDate) < today
    ).length;

    const totalCost = items
      .filter((item) => item.actualCost)
      .reduce(
        (sum, item) =>
          sum + parseFloat(item.actualCost.replace("$", "").replace(",", "")),
        0
      );

    const completedItems = items.filter((item) => item.status === "completed");
    const avgDowntime =
      completedItems.length > 0
        ? completedItems.reduce(
            (sum, item) => sum + (item.downtimeDays || 0),
            0
          ) / completedItems.length
        : 0;

    const monthlyCost = items
      .filter(
        (item) =>
          item.completedDate &&
          item.completedDate.startsWith("2024-03") &&
          item.actualCost
      )
      .reduce(
        (sum, item) =>
          sum + parseFloat(item.actualCost.replace("$", "").replace(",", "")),
        0
      );

    setStats({
      upcoming,
      inProgress,
      completed,
      overdue,
      totalCost: `$${totalCost.toLocaleString()}`,
      averageDowntime: avgDowntime.toFixed(1),
      monthlyCost: `$${monthlyCost.toLocaleString()}`,
      costTrend: "up",
    });
  };

  // Filtering
  useEffect(() => {
    const filtered = maintenanceItems.filter((item) => {
      const matchesStatus =
        filterStatus === "all" || item.status === filterStatus;
      const matchesType = filterType === "all" || item.type === filterType;
      const matchesVehicle =
        filterVehicle === "all" || item.vehicleId === filterVehicle;
      const matchesSearch =
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.vendor?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesType && matchesVehicle && matchesSearch;
    });
    setFilteredItems(filtered);
  }, [maintenanceItems, filterStatus, filterType, filterVehicle, searchQuery]);

  // Get items based on active tab
  const getTabItems = () => {
    switch (activeTab) {
      case "upcoming":
        return filteredItems.filter((item) =>
          ["scheduled", "in_progress", "overdue"].includes(item.status)
        );
      case "history":
        return filteredItems.filter((item) => item.status === "completed");
      case "reports":
        return filteredItems;
      default:
        return filteredItems;
    }
  };

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
      case "in_progress":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "in_progress":
        return <Clock className="h-4 w-4" />;
      case "overdue":
        return <AlertTriangle className="h-4 w-4" />;
      case "scheduled":
        return <Calendar className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // Actions
  const handleScheduleMaintenance = () => {
    navigate("/maintenance/schedule");
  };

  const handleViewDetails = (item) => {
    navigate(`/maintenance/${item.id}`);
  };

  const handleEdit = (item) => {
    navigate(`/maintenance/edit/${item.id}`);
  };

  const handleDeleteClick = (item) => {
    setSelectedForDelete(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedForDelete) {
      setMaintenanceItems((prev) =>
        prev.filter((item) => item.id !== selectedForDelete.id)
      );
      setSelectedForDelete(null);
      setShowDeleteModal(false);
    }
  };

  const handleMarkComplete = (item) => {
    setMaintenanceItems((prev) =>
      prev.map((m) =>
        m.id === item.id
          ? {
              ...m,
              status: "completed",
              completedDate: new Date().toISOString().split("T")[0],
            }
          : m
      )
    );
  };

  const handleStartMaintenance = (item) => {
    setMaintenanceItems((prev) =>
      prev.map((m) =>
        m.id === item.id
          ? {
              ...m,
              status: "in_progress",
              startedDate: new Date().toISOString().split("T")[0],
            }
          : m
      )
    );
  };

  const handleDownloadReport = (item) => {
    const reportContent = `
      MAINTENANCE REPORT
      ==================
      
      ID: ${item.id}
      Vehicle: ${item.vehicle}
      Type: ${item.type}
      Status: ${item.status}
      Scheduled Date: ${item.scheduledDate}
      Completed Date: ${item.completedDate || "Not completed"}
      Vendor: ${item.vendor || "N/A"}
      Estimated Cost: ${item.estimatedCost}
      Actual Cost: ${item.actualCost || "N/A"}
      Description: ${item.description}
      Odometer: ${item.odometerReading} km
      Priority: ${item.priority}
      
      Notes: ${item.notes || "No additional notes"}
    `;

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `maintenance-report-${item.id}.txt`;
    a.click();
  };

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleSelectAll = () => {
    const tabItems = getTabItems();
    if (selectedItems.length === tabItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(tabItems.map((item) => item.id));
    }
  };

  const handleBulkMarkComplete = () => {
    setMaintenanceItems((prev) =>
      prev.map((m) =>
        selectedItems.includes(m.id)
          ? {
              ...m,
              status: "completed",
              completedDate: new Date().toISOString().split("T")[0],
            }
          : m
      )
    );
    setSelectedItems([]);
  };

  const handleBulkDelete = () => {
    setMaintenanceItems((prev) =>
      prev.filter((m) => !selectedItems.includes(m.id))
    );
    setSelectedItems([]);
  };

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,Vehicle,Type,Status,Scheduled Date,Estimated Cost,Vendor"]
        .concat(
          selectedItems.map((id) => {
            const item = maintenanceItems.find((i) => i.id === id);
            return `"${item.id}","${item.vehicle}","${item.type}","${
              item.status
            }","${item.scheduledDate}","${item.estimatedCost}","${
              item.vendor || ""
            }"`;
          })
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "maintenance-export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Stats component inline
  const renderStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {/* Upcoming */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {stats.upcoming}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* In Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              In Progress
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {stats.inProgress}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
            <Clock className="h-6 w-6 text-amber-600" />
          </div>
        </div>
      </div>

      {/* Completed */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Completed
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {stats.completed}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
            <CheckCircle className="h-6 w-6 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Overdue */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {stats.overdue}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </div>

      {/* Total Cost */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Cost
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {stats.totalCost}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
            <DollarSign className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Avg. Downtime */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Avg. Downtime
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {stats.averageDowntime} days
            </p>
          </div>
          <div className="p-3 rounded-lg bg-cyan-50 dark:bg-cyan-900/20">
            <Car className="h-6 w-6 text-cyan-600" />
          </div>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading maintenance records...
          </p>
        </div>
      </div>
    );
  }

  const tabItems = getTabItems();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Vehicle Maintenance
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Schedule, track, and manage vehicle maintenance
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleScheduleMaintenance}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-lg"
              >
                <Plus className="h-4 w-4" />
                <span className="font-medium">Schedule Maintenance</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          {renderStats()}
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-2 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center space-x-1 overflow-x-auto">
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "upcoming"
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Upcoming & In Progress
                  <span className="ml-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                    {stats.upcoming + stats.inProgress + stats.overdue}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "history"
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Maintenance History
                  <span className="ml-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-full text-xs">
                    {stats.completed}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "reports"
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Reports & Analytics
                </div>
              </button>
            </div>

            {/* View Mode Toggle */}
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
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by vehicle, type, vendor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Status Filter */}
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Type Filter */}
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Types</option>
                  {maintenanceTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Vehicle Filter */}
              <div className="relative">
                <select
                  value={filterVehicle}
                  onChange={(e) => setFilterVehicle(e.target.value)}
                  className="appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Vehicles</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.registrationNumber}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="flex items-center gap-3 mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
              <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                {selectedItems.length} item(s) selected
              </span>
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
                {activeTab === "upcoming" && (
                  <button
                    onClick={handleBulkMarkComplete}
                    className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Mark Complete
                  </button>
                )}
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg text-sm hover:bg-red-100 dark:hover:bg-red-900/40"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Maintenance Content */}
        {activeTab === "reports" ? (
          // Reports Tab Content
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Maintenance Cost Analysis */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Maintenance Cost Analysis
              </h3>
              <div className="space-y-4">
                {maintenanceTypes.map((type) => {
                  const typeItems = maintenanceItems.filter(
                    (item) => item.type === type.id
                  );
                  const totalCost = typeItems.reduce(
                    (sum, item) =>
                      sum +
                      parseFloat(
                        (item.actualCost || item.estimatedCost || "$0")
                          .replace("$", "")
                          .replace(",", "")
                      ),
                    0
                  );

                  return (
                    <div
                      key={type.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          {type.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {type.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {typeItems.length} maintenance records
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          ${totalCost.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Total cost
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Vehicle-wise Maintenance */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Vehicle-wise Maintenance
              </h3>
              <div className="space-y-4">
                {vehicles.slice(0, 5).map((vehicle) => {
                  const vehicleItems = maintenanceItems.filter(
                    (item) => item.vehicleId === vehicle.id
                  );
                  const upcoming = vehicleItems.filter((item) =>
                    ["scheduled", "in_progress"].includes(item.status)
                  ).length;

                  return (
                    <div
                      key={vehicle.id}
                      className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      onClick={() =>
                        navigate(`/vehicles/${vehicle.id}/maintenance`)
                      }
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {vehicle.registrationNumber}
                        </h4>
                        {upcoming > 0 && (
                          <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-full text-xs">
                            {upcoming} upcoming
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Last service:{" "}
                          {vehicleItems
                            .filter((item) => item.status === "completed")
                            .sort(
                              (a, b) =>
                                new Date(b.completedDate) -
                                new Date(a.completedDate)
                            )[0]?.completedDate || "N/A"}
                        </span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          // Upcoming/History Tab Content
          <div>
            {/* Grid/List View */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {tabItems.map((item) => {
                const maintenanceType = maintenanceTypes.find(
                  (t) => t.id === item.type
                );

                return (
                  <div
                    key={item.id}
                    className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow ${
                      selectedItems.includes(item.id)
                        ? "ring-2 ring-blue-500 border-blue-500"
                        : ""
                    }`}
                  >
                    {/* Maintenance Header */}
                    <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(item.id)}
                              onChange={() => handleSelectItem(item.id)}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {item.id}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {item.vehicle} • {item.type}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              item.status
                            )}`}
                          >
                            {getStatusIcon(item.status)}
                            {item.status
                              .split("_")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")}
                          </span>
                          <div className="relative">
                            <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                              <MoreVertical className="h-4 w-4 text-gray-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Maintenance Details */}
                    <div className="p-5">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Scheduled Date
                            </p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {new Date(item.scheduledDate).toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Estimated Cost
                            </p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {item.estimatedCost}
                            </p>
                          </div>
                        </div>

                        {item.completedDate && (
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Completed Date
                            </p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {new Date(item.completedDate).toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        )}

                        {item.vendor && (
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Service Vendor
                            </p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {item.vendor}
                            </p>
                          </div>
                        )}

                        {item.odometerReading && (
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Odometer Reading
                            </p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {item.odometerReading.toLocaleString()} km
                            </p>
                          </div>
                        )}

                        {item.description && (
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Description
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Maintenance Actions */}
                    <div className="px-5 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(item)}
                            title="View Details"
                            className="p-2 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors"
                          >
                            <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                          </button>
                          <button
                            onClick={() => handleDownloadReport(item)}
                            title="Download Report"
                            className="p-2 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors"
                          >
                            <Download className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40"
                          >
                            <Edit className="h-3 w-3" />
                            Edit
                          </button>
                          {item.status === "scheduled" && (
                            <button
                              onClick={() => handleStartMaintenance(item)}
                              className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700"
                            >
                              Start
                            </button>
                          )}
                          {item.status === "in_progress" && (
                            <button
                              onClick={() => handleMarkComplete(item)}
                              className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {tabItems.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl mb-4">
                  <Wrench className="h-12 w-12 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No maintenance records found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchQuery
                    ? "No maintenance records match your search criteria"
                    : activeTab === "upcoming"
                    ? "No upcoming maintenance scheduled"
                    : "No maintenance history available"}
                </p>
                {activeTab === "upcoming" && (
                  <button
                    onClick={handleScheduleMaintenance}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="font-medium">Schedule Maintenance</span>
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {tabItems.length > 0 && (
              <div className="mt-8 flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing 1-{tabItems.length} of {filteredItems.length}{" "}
                  maintenance records
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Previous
                  </button>
                  <button className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                    1
                  </button>
                  <button className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                    2
                  </button>
                  <button className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                    3
                  </button>
                  <button className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Maintenance Record
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete maintenance record{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {selectedForDelete?.id}
              </span>{" "}
              for vehicle{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {selectedForDelete?.vehicle}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleMaintenance;
