import { Navigation, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { TripFilters } from "./TripFilters";
import { TripForm } from "./TripForm";
import { TripList } from "./TripList";
import { TripMapView } from "./TripMapView";
import { TripStats } from "./TripStats";
import { TripTimeline } from "./TripTimeline";

export const TripDashboard = ({
  vehicles = [],
  drivers = [],
  customers = [],
}) => {
  const [trips, setTrips] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedTrips, setSelectedTrips] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    vehicleId: "all",
    driverId: "all",
    customerId: "all",
    dateRange: "all",
  });

  // Fetch trips
  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    // Mock data
    const mockTrips = [
      {
        id: "TRIP-2024-001",
        tripNumber: "TRIP-2024-001",
        customerId: "CUST-001",
        customerName: "Reliance Industries",
        customerContact: "+91 9876543210",
        vehicleId: "V001",
        vehicleName: "Tata Ace",
        driverId: "D001",
        driverName: "Rajesh Kumar",
        source: "Mumbai, Maharashtra",
        destination: "Pune, Maharashtra",
        distance: 150, // km
        estimatedDuration: "3 hours",
        actualDuration: "2.5 hours",
        startDate: "2024-03-15",
        startTime: "08:00",
        endDate: "2024-03-15",
        endTime: "10:30",
        status: "completed",
        tripType: "freight",
        goodsType: "Electronics",
        goodsWeight: 2, // tons
        goodsValue: 500000,
        tripCost: 25000,
        revenue: 35000,
        profit: 10000,
        fuelCost: 5000,
        tollCharges: 1500,
        otherExpenses: 2000,
        route: [
          { location: "Mumbai", lat: 19.076, lng: 72.8777 },
          { location: "Pune", lat: 18.5204, lng: 73.8567 },
        ],
        waypoints: [{ location: "Lonavala", lat: 18.7522, lng: 73.4058 }],
        notes: "Delivered electronics goods safely",
        documents: [
          { name: "Delivery Challan", type: "pdf", url: "#" },
          { name: "E-Way Bill", type: "pdf", url: "#" },
        ],
        milestones: [
          {
            id: "M1",
            name: "Trip Started",
            time: "08:00",
            status: "completed",
          },
          {
            id: "M2",
            name: "Goods Loaded",
            time: "08:30",
            status: "completed",
          },
          { id: "M3", name: "Toll Paid", time: "09:15", status: "completed" },
          {
            id: "M4",
            name: "Goods Unloaded",
            time: "10:30",
            status: "completed",
          },
          {
            id: "M5",
            name: "Trip Completed",
            time: "10:30",
            status: "completed",
          },
        ],
      },
      {
        id: "TRIP-2024-002",
        tripNumber: "TRIP-2024-002",
        customerId: "CUST-002",
        customerName: "Tata Motors",
        customerContact: "+91 9876543211",
        vehicleId: "V002",
        vehicleName: "Ashok Leyland Dost",
        driverId: "D002",
        driverName: "Amit Sharma",
        source: "Pune, Maharashtra",
        destination: "Bangalore, Karnataka",
        distance: 450,
        estimatedDuration: "8 hours",
        actualDuration: "",
        startDate: "2024-03-16",
        startTime: "06:00",
        endDate: "2024-03-16",
        endTime: "",
        status: "in_progress",
        tripType: "freight",
        goodsType: "Auto Parts",
        goodsWeight: 3.5,
        goodsValue: 750000,
        tripCost: 45000,
        revenue: 65000,
        profit: 20000,
        currentLocation: "Satara, Maharashtra",
        lastUpdate: "2024-03-16T10:30:00",
        notes: "Urgent delivery of auto parts",
      },
      {
        id: "TRIP-2024-003",
        tripNumber: "TRIP-2024-003",
        customerId: "CUST-003",
        customerName: "Aditya Birla Group",
        customerContact: "+91 9876543212",
        vehicleId: "V003",
        vehicleName: "Mahindra Bolero",
        driverId: "D003",
        driverName: "Suresh Patel",
        source: "Mumbai, Maharashtra",
        destination: "Ahmedabad, Gujarat",
        distance: 525,
        estimatedDuration: "9 hours",
        actualDuration: "",
        startDate: "2024-03-17",
        startTime: "07:00",
        endDate: "2024-03-17",
        endTime: "",
        status: "scheduled",
        tripType: "freight",
        goodsType: "Textiles",
        goodsWeight: 4,
        goodsValue: 300000,
        tripCost: 35000,
        revenue: 45000,
        profit: 10000,
        notes: "Textile shipment to Ahmedabad",
      },
      {
        id: "TRIP-2024-004",
        tripNumber: "TRIP-2024-004",
        customerId: "CUST-001",
        customerName: "Reliance Industries",
        customerContact: "+91 9876543210",
        vehicleId: "V001",
        vehicleName: "Tata Ace",
        driverId: "D001",
        driverName: "Rajesh Kumar",
        source: "Pune, Maharashtra",
        destination: "Mumbai, Maharashtra",
        distance: 150,
        estimatedDuration: "3 hours",
        actualDuration: "",
        startDate: "2024-03-18",
        startTime: "10:00",
        endDate: "2024-03-18",
        endTime: "",
        status: "pending",
        tripType: "return",
        goodsType: "Empty",
        goodsWeight: 0,
        tripCost: 18000,
        revenue: 22000,
        profit: 4000,
        notes: "Return trip from Pune",
      },
    ];
    setTrips(mockTrips);
  };

  const handleSaveTrip = async (tripData) => {
    if (editingTrip) {
      setTrips(trips.map((t) => (t.id === tripData.id ? tripData : t)));
    } else {
      const tripNumber = `TRIP-${new Date().getFullYear()}-${String(
        trips.length + 1
      ).padStart(3, "0")}`;
      setTrips([
        ...trips,
        {
          ...tripData,
          id: `TRIP-${Date.now()}`,
          tripNumber,
          status: "scheduled",
          currentLocation: tripData.source,
        },
      ]);
    }
    setShowForm(false);
    setEditingTrip(null);
  };

  const handleDeleteTrip = async (id) => {
    setTrips(trips.filter((t) => t.id !== id));
  };

  const handleEditTrip = (trip) => {
    setEditingTrip(trip);
    setShowForm(true);
  };

  const handleViewMap = (trip) => {
    setSelectedTrip(trip);
    setShowMap(true);
  };

  const handleStatusChange = (id, status) => {
    setTrips(
      trips.map((trip) =>
        trip.id === id
          ? {
              ...trip,
              status,
              endDate:
                status === "completed"
                  ? new Date().toISOString().split("T")[0]
                  : trip.endDate,
              endTime:
                status === "completed"
                  ? new Date().toTimeString().slice(0, 5)
                  : trip.endTime,
            }
          : trip
      )
    );
  };

  const handleStartTrip = (id) => {
    setTrips(
      trips.map((trip) =>
        trip.id === id
          ? {
              ...trip,
              status: "in_progress",
              startDate: new Date().toISOString().split("T")[0],
              startTime: new Date().toTimeString().slice(0, 5),
              currentLocation: trip.source,
            }
          : trip
      )
    );
  };

  const handleCompleteTrip = (id) => {
    setTrips(
      trips.map((trip) =>
        trip.id === id
          ? {
              ...trip,
              status: "completed",
              endDate: new Date().toISOString().split("T")[0],
              endTime: new Date().toTimeString().slice(0, 5),
              currentLocation: trip.destination,
            }
          : trip
      )
    );
  };

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      !filters.search ||
      trip.tripNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
      trip.customerName.toLowerCase().includes(filters.search.toLowerCase()) ||
      trip.source.toLowerCase().includes(filters.search.toLowerCase()) ||
      trip.destination.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStatus =
      filters.status === "all" || trip.status === filters.status;
    const matchesVehicle =
      filters.vehicleId === "all" || trip.vehicleId === filters.vehicleId;
    const matchesDriver =
      filters.driverId === "all" || trip.driverId === filters.driverId;
    const matchesCustomer =
      filters.customerId === "all" || trip.customerId === filters.customerId;

    // Date range filter
    let matchesDate = true;
    if (filters.dateRange !== "all") {
      const tripDate = new Date(trip.startDate);
      const today = new Date();

      switch (filters.dateRange) {
        case "today":
          matchesDate = tripDate.toDateString() === today.toDateString();
          break;
        case "week":
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          matchesDate = tripDate >= weekAgo;
          break;
        case "month":
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          matchesDate = tripDate >= monthAgo;
          break;
        case "upcoming":
          matchesDate = tripDate >= today && trip.status === "scheduled";
          break;
      }
    }

    return (
      matchesSearch &&
      matchesStatus &&
      matchesVehicle &&
      matchesDriver &&
      matchesCustomer &&
      matchesDate
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Trip Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Plan, track, and manage your transport trips efficiently
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            New Trip
          </button>
          <button
            onClick={() => setShowMap(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
          >
            <Navigation className="h-4 w-4" />
            Map View
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <TripStats trips={trips} />

      {/* Filters */}
      <TripFilters
        filters={filters}
        setFilters={setFilters}
        vehicles={vehicles}
        drivers={drivers}
        customers={customers}
        selectedTrips={selectedTrips}
        onBulkAction={(action) => {
          if (action === "export") {
            console.log("Exporting:", selectedTrips);
          } else if (action === "start") {
            selectedTrips.forEach((id) => handleStartTrip(id));
          }
        }}
      />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trip List */}
        <div className="lg:col-span-2">
          <TripList
            trips={filteredTrips}
            onEdit={handleEditTrip}
            onDelete={handleDeleteTrip}
            onViewMap={handleViewMap}
            onStatusChange={handleStatusChange}
            onStartTrip={handleStartTrip}
            onCompleteTrip={handleCompleteTrip}
            selectedTrips={selectedTrips}
            onSelectTrip={setSelectedTrips}
          />
        </div>

        {/* Trip Timeline */}
        <div className="lg:col-span-1">
          <TripTimeline
            trips={trips.filter((t) => t.status === "in_progress")}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>

      {/* Trip Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => {
                setShowForm(false);
                setEditingTrip(null);
              }}
            />
            <TripForm
              trip={editingTrip}
              vehicles={vehicles}
              drivers={drivers}
              customers={customers}
              onSave={handleSaveTrip}
              onCancel={() => {
                setShowForm(false);
                setEditingTrip(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Map View Modal */}
      {showMap && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowMap(false)}
            />
            <TripMapView
              trip={selectedTrip}
              trips={trips.filter((t) => t.status === "in_progress")}
              onClose={() => setShowMap(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
