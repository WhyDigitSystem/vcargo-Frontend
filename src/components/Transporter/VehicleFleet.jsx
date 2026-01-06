import React, { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Truck,
  Car,
  Bike,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Wrench,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Edit3,
  Trash2,
  Eye,
  Phone,
  MessageCircle,
  Star,
  IndianRupee,
  Clock,
  Users,
  Shield,
  Battery,
  Thermometer,
} from "lucide-react";
import AddVehicleModal from "./AddVehicleModal";

const VehicleFleet = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Add this state to your VehicleFleet component
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add this function to handle new vehicle addition
  const handleVehicleAdded = (newVehicle) => {
    // In real app, you would update your state or make API call
    setVehicles((prev) => [newVehicle, ...prev]);
  };

  // Sample vehicle data with Indian context
  const [vehicles, setVehicles ] = useState([
    {
      id: 1,
      vehicleNumber: "MH-12-AB-1234",
      type: "truck",
      model: "Tata Ultra T.7",
      capacity: "7.5 Tons",
      driver: "Rajesh Kumar",
      driverPhone: "+91 98765 43210",
      status: "active",
      location: "Mumbai, MH",
      lastService: "2024-01-15",
      nextService: "2024-03-15",
      fuelEfficiency: "4.2 km/l",
      insuranceExpiry: "2024-12-31",
      currentTrip: "Mumbai to Delhi",
      rating: 4.8,
      tripsCompleted: 47,
      revenue: "₹12.5L",
      documents: ["RC", "Insurance", "PUC", "Fitness"],
      features: ["GPS", "AC", "Fleet Management"],
    },
    {
      id: 2,
      vehicleNumber: "DL-01-CD-5678",
      type: "container",
      model: "Ashok Leyland Captain",
      capacity: "15 Tons",
      driver: "Amit Sharma",
      driverPhone: "+91 98765 43211",
      status: "active",
      location: "Delhi, DL",
      lastService: "2024-02-01",
      nextService: "2024-04-01",
      fuelEfficiency: "3.8 km/l",
      insuranceExpiry: "2024-11-30",
      currentTrip: "Delhi to Kolkata",
      rating: 4.6,
      tripsCompleted: 32,
      revenue: "₹8.7L",
      documents: ["RC", "Insurance", "PUC"],
      features: ["GPS", "Temp Control"],
    },
    {
      id: 3,
      vehicleNumber: "KA-05-EF-9012",
      type: "mini-truck",
      model: "Mahindra Bolero Maxi",
      capacity: "2.5 Tons",
      driver: "Suresh Patel",
      driverPhone: "+91 98765 43212",
      status: "maintenance",
      location: "Bangalore, KA",
      lastService: "2024-02-10",
      nextService: "2024-02-25",
      fuelEfficiency: "12.5 km/l",
      insuranceExpiry: "2024-10-15",
      currentTrip: null,
      rating: 4.9,
      tripsCompleted: 28,
      revenue: "₹6.2L",
      documents: ["RC", "Insurance", "PUC"],
      features: ["GPS"],
    },
    {
      id: 4,
      vehicleNumber: "TN-09-GH-3456",
      type: "truck",
      model: "Eicher Pro 2095",
      capacity: "9.5 Tons",
      driver: "Vikram Singh",
      driverPhone: "+91 98765 43213",
      status: "inactive",
      location: "Chennai, TN",
      lastService: "2024-01-20",
      nextService: "2024-03-20",
      fuelEfficiency: "4.0 km/l",
      insuranceExpiry: "2024-09-30",
      currentTrip: null,
      rating: 4.4,
      tripsCompleted: 19,
      revenue: "₹5.8L",
      documents: ["RC", "Insurance"],
      features: ["GPS", "AC"],
    },
    {
      id: 5,
      vehicleNumber: "GJ-01-IJ-7890",
      type: "container",
      model: "Volvo FM 420",
      capacity: "25 Tons",
      driver: "Priya Desai",
      driverPhone: "+91 98765 43214",
      status: "active",
      location: "Ahmedabad, GJ",
      lastService: "2024-02-05",
      nextService: "2024-04-05",
      fuelEfficiency: "3.5 km/l",
      insuranceExpiry: "2025-01-15",
      currentTrip: "Ahmedabad to Mumbai",
      rating: 4.7,
      tripsCompleted: 54,
      revenue: "₹15.2L",
      documents: ["RC", "Insurance", "PUC", "Fitness", "Permit"],
      features: ["GPS", "AC", "Fleet Management", "Temp Control"],
    },
    {
      id: 6,
      vehicleNumber: "UP-16-KL-2468",
      type: "mini-truck",
      model: "Tata Ace Gold",
      capacity: "1 Ton",
      driver: "Anil Verma",
      driverPhone: "+91 98765 43215",
      status: "active",
      location: "Lucknow, UP",
      lastService: "2024-02-12",
      nextService: "2024-03-12",
      fuelEfficiency: "18.2 km/l",
      insuranceExpiry: "2024-08-20",
      currentTrip: "Lucknow to Delhi",
      rating: 4.5,
      tripsCompleted: 35,
      revenue: "₹4.3L",
      documents: ["RC", "Insurance", "PUC"],
      features: ["GPS"],
    },
  ]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "maintenance":
        return <Wrench className="h-4 w-4 text-yellow-500" />;
      case "inactive":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getVehicleIcon = (type) => {
    switch (type) {
      case "truck":
        return <Truck className="h-6 w-6 text-blue-600" />;
      case "container":
        return <Car className="h-6 w-6 text-purple-600" />;
      case "mini-truck":
        return <Truck className="h-6 w-6 text-green-600" />;
      default:
        return <Truck className="h-6 w-6 text-gray-600" />;
    }
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || vehicle.status === statusFilter;
    const matchesType = typeFilter === "all" || vehicle.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/20 dark:from-gray-900 dark:via-blue-950/20 dark:to-cyan-950/10 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Vehicle Fleet Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your fleet of {vehicles.length} vehicles across India
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 sm:mt-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5" />
            Add New Vehicle
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Vehicles
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {vehicles.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Truck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Vehicles
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {vehicles.filter((v) => v.status === "active").length}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                In Maintenance
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {vehicles.filter((v) => v.status === "maintenance").length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
              <Wrench className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Revenue
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ₹52.7L
              </p>
            </div>
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
              <IndianRupee className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by vehicle number, driver, or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="truck">Truck</option>
              <option value="container">Container</option>
              <option value="mini-truck">Mini Truck</option>
            </select>

            <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              <Filter className="h-5 w-5" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Vehicles List */}
      <div className="space-y-4">
        {filteredVehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Left Section - Vehicle Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white">
                    {getVehicleIcon(vehicle.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {vehicle.vehicleNumber}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            vehicle.status
                          )}`}
                        >
                          {getStatusIcon(vehicle.status)}
                          {vehicle.status.charAt(0).toUpperCase() +
                            vehicle.status.slice(1)}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm font-medium">
                            {vehicle.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {vehicle.model}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Gauge className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {vehicle.capacity}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Fuel className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {vehicle.fuelEfficiency}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {vehicle.location}
                        </span>
                      </div>
                    </div>

                    {/* Driver Info */}
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {vehicle.driver}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {vehicle.driverPhone}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
                            <Phone className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                            <MessageCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Current Trip */}
                    {vehicle.currentTrip && (
                      <div className="mt-3 flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                          On trip: {vehicle.currentTrip}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Section - Actions and Stats */}
                <div className="flex flex-col gap-3">
                  {/* Quick Stats */}
                  <div className="flex gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {vehicle.tripsCompleted}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Trips
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {vehicle.revenue}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Revenue
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium">
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-sm font-medium">
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Features and Documents */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Documents: {vehicle.documents.join(", ")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredVehicles.length === 0 && (
        <div className="text-center py-12">
          <Truck className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No vehicles found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setTypeFilter("all");
            }}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
          >
            <Filter className="h-5 w-5" />
            Clear Filters
          </button>
        </div>
      )}
      <AddVehicleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onVehicleAdded={handleVehicleAdded}
      />
    </div>
  );
};

export default VehicleFleet;
