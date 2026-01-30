import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { tripAPI } from "../../../api/TtripAPI";
import { toast } from "../../../utils/toast";
import { TripFilters } from "./TripFilters";
import { TripForm } from "./TripForm";
import { TripList } from "./TripList";
import { TripMapView } from "./TripMapView";
import TripMapViewSim from "./TripMapViewSim";
import { TripStats } from "./TripStats";
import { TripTimeline } from "./TripTimeline";

export const TripDashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showMapSim, setShowMapSim] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedTrips, setSelectedTrips] = useState([]);
  const [filterCustomers, setFilterCustomers] = useState([]);
  const [filterDrivers, setFilterDrivers] = useState([]);
  const [filterVehicles, setFilterVehicles] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    vehicleId: "all",
    driverId: "all",
    customerId: "all",
    dateRange: "all",
  });

  const { user } = useSelector((state) => state.auth);
  const orgId = user.orgId;

  useEffect(() => {
    fetchTrips();
  }, [filters]);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await tripAPI.getAllTrips(orgId);

      const apiTrips = response?.paramObjectsMap?.trip?.reverse() || [];

      const mappedTrips = apiTrips.map((trip) => ({
        id: trip.id,
        tripNumber: `TRIP-${trip.id}`,
        customerId: trip.customer,
        customerName: trip.customer,
        vehicleId:
          typeof trip.vehicle === "object" ? trip.vehicle.id : trip.vehicleId,
        vehicleName:
          typeof trip.vehicle === "object"
            ? trip.vehicle.vehicleNumber
            : trip.vehicle || "Unassigned",
        driverId:
          typeof trip.driver === "object" ? trip.driver.id : trip.driverId,
        driverName:
          typeof trip.driver === "object"
            ? trip.driver.name
            : trip.driver || "Unassigned",
        source: trip.source,
        destination: trip.destination,
        distance: trip.distance,
        estimatedDuration: trip.estimatedDuration,
        startDate: trip.startDate,
        startTime: trip.startTime?.slice(0, 5),
        endDate: trip.endDate,
        endTime: trip.endTime?.slice(0, 5),
        status: trip.status?.toUpperCase(),
        tripType: trip.tripType,
        goodsType: trip.goodsType,
        goodsWeight: trip.goodsWeight,
        goodsValue: trip.goodsValue,
        tripCost: trip.tripCost,
        revenue: trip.revenue,
        profit: trip.profit,
        fuelCost: trip.fuelCost,
        tollCharges: trip.tollCharges,
        otherExpenses: trip.otherExpenses,
        notes: trip.notes,
        waypoints: trip.waypoints || [],
        active: trip.active,
      }));

      setTrips(mappedTrips);

      const uniqueCustomers = Array.from(
        new Map(
          mappedTrips
            .filter((t) => t.customerId)
            .map((t) => [
              t.customerId,
              { id: t.customerId, name: t.customerName },
            ]),
        ).values(),
      );

      const uniqueDrivers = Array.from(
        new Map(
          mappedTrips
            .filter((t) => t.driverId)
            .map((t) => [t.driverId, { id: t.driverId, name: t.driverName }]),
        ).values(),
      );

      const uniqueVehicles = Array.from(
        new Map(
          mappedTrips
            .filter((t) => t.vehicleId)
            .map((t) => [
              t.vehicleId,
              {
                id: t.vehicleId,
                registrationNumber: t.vehicleName,
                name: t.vehicleName,
              },
            ]),
        ).values(),
      );

      setFilterCustomers(uniqueCustomers);
      setFilterDrivers(uniqueDrivers);
      setFilterVehicles(uniqueVehicles);
    } catch (error) {
      console.error("Failed to load trips:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTrip = async (tripData) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user")) || {};
      const userId = storedUser.usersId || storedUser.userId || "";

      const payload = {
        ...(editingTrip && {
          id: editingTrip.id ? parseInt(editingTrip.id, 10) : 0,
        }),
        orgId: parseInt(orgId, 10) || 0,
        branchCode: "MAIN",
        branchName: "Main Branch",
        createdBy: userId.toString(),
        user: parseInt(userId, 10) || 0,
        customer: tripData.customer,
        source: tripData.source || "",
        destination: tripData.destination || "",
        vehicle: tripData.vehicleId,
        driver: tripData.driverId,
        tripType: tripData.tripType || "",
        status: tripData.status || "",
        distance: parseInt(tripData.distance || 0, 10),
        estimatedDuration: tripData.estimatedDuration || "",
        goodsType: tripData.goodsType || "",
        goodsWeight: parseFloat(tripData.goodsWeight || 0),
        goodsValue: parseFloat(tripData.goodsValue || 0),
        tripCost: parseFloat(tripData.tripCost || 0),
        revenue: parseFloat(tripData.revenue || 0),
        profit: parseFloat(tripData.profit || 0),
        fuelCost: parseFloat(tripData.fuelCost || 0),
        tollCharges: parseFloat(tripData.tollCharges || 0),
        otherExpenses: parseFloat(tripData.otherExpenses || 0),
        startDate: tripData.startDate || new Date().toISOString().split("T")[0],
        endDate:
          tripData.endDate ||
          tripData.startDate ||
          new Date().toISOString().split("T")[0],
        startTime: tripData.startTime,
        endTime: tripData.endTime,
        notes: tripData.notes || "",
        waypoints: (tripData.waypoints || []).map((wp, index) => ({
          location: wp.location || "",
          sequenceNo: index + 1,
        })),
      };

      if (editingTrip) {
        payload.id = parseInt(editingTrip.id, 10);
      }

      const response = await tripAPI.createUpdateTrip(payload);

      if (
        response?.statusFlag === "Ok" ||
        response?.success === true ||
        response?.status === 200
      ) {
        toast.success(
          editingTrip
            ? "Trip updated successfully!"
            : "Trip created successfully!",
        );
        setShowForm(false);
        setEditingTrip(null);
        await fetchTrips(); // Refresh the list
      } else {
        throw new Error(response?.message || "Trip save failed");
      }
    } catch (error) {
      console.error("SAVE TRIP ERROR:", error);
      toast.error("Failed to save trip!");
    }
  };

  const handleDeleteTrip = async (id) => {
    setTrips(trips.filter((t) => t.id !== id));
  };

  const handleEditTrip = async (trip) => {
    try {
      setLoading(true);

      const response = await tripAPI.getTripById(trip.id);

      if (response?.paramObjectsMap?.trip) {
        const apiTrip = response.paramObjectsMap.trip;

        const tripForEdit = {
          id: apiTrip.id,
          tripNumber: `TRIP-${apiTrip.id}`,
          customer: apiTrip.customer,
          customerName: apiTrip.customer,
          vehicleId: apiTrip.vehicleId,
          vehicleName: apiTrip.vehicle,
          driverId: apiTrip.driverId,
          driverName: apiTrip.driver,
          source: apiTrip.source,
          destination: apiTrip.destination,
          distance: apiTrip.distance,
          estimatedDuration: apiTrip.estimatedDuration,
          startDate: apiTrip.startDate,
          startTime: apiTrip.startTime?.slice(0, 5),
          endDate: apiTrip.endDate,
          endTime: apiTrip.endTime?.slice(0, 5),
          status: apiTrip.status,
          tripType: apiTrip.tripType,
          goodsType: apiTrip.goodsType,
          goodsWeight: apiTrip.goodsWeight,
          goodsValue: apiTrip.goodsValue,
          tripCost: apiTrip.tripCost,
          revenue: apiTrip.revenue,
          profit: apiTrip.profit,
          fuelCost: apiTrip.fuelCost,
          tollCharges: apiTrip.tollCharges,
          otherExpenses: apiTrip.otherExpenses,
          notes: apiTrip.notes,
          waypoints: apiTrip.waypoints || [],
          active: apiTrip.active,

          waypoints:
            apiTrip.waypoints?.map((wp) => ({
              location: wp.location,
              sequenceNo: wp.sequenceNo,
            })) || [],
        };

        setEditingTrip(tripForEdit);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to fetch trip details:", error);
      alert("Failed to load trip details for editing");
    } finally {
      setLoading(false);
    }
  };

  const handleViewMap = (trip) => {
    setSelectedTrip(trip);
    setShowMap(true);
  };

  const handleViewMapSim = (trip) => {
    setSelectedTrip(trip);
    setShowMapSim(true);
  };

  // const handleTripStatusChange = (tripId, newStatus) => {
  //   // Update local trips state
  //   setTrips((prevTrips) =>
  //     prevTrips.map((trip) =>
  //       trip.id === tripId ? { ...trip, status: newStatus } : trip
  //     )
  //   );
  // };

  // const handleStartTrip = (id) => {
  //   const tripToUpdate = trips.find((t) => t.id === id);
  //   if (tripToUpdate) {
  //     setTrips(
  //       trips.map((trip) =>
  //         trip.id === id
  //           ? {
  //               ...trip,
  //               status: "in_progress",
  //               startDate: new Date().toISOString().split("T")[0],
  //               startTime: new Date().toTimeString().slice(0, 5),
  //               currentLocation: trip.source,
  //             }
  //           : trip
  //       )
  //     );
  //   }
  // };

  // const handleCompleteTrip = (id) => {
  //   setTrips(
  //     trips.map((trip) =>
  //       trip.id === id
  //         ? {
  //             ...trip,
  //             status: "completed",
  //             endDate: new Date().toISOString().split("T")[0],
  //             endTime: new Date().toTimeString().slice(0, 5),
  //             currentLocation: trip.destination,
  //           }
  //         : trip
  //     )
  //   );
  // };

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
      filters.vehicleId === "all" ||
      trip.vehicleId.toString() === filters.vehicleId.toString();
    const matchesDriver =
      filters.driverId === "all" ||
      trip.driverId.toString() === filters.driverId.toString();
    const matchesCustomer =
      filters.customerId === "all" ||
      trip.customerId.toString() === filters.customerId.toString();

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

  if (loading && trips.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading trips...
          </p>
        </div>
      </div>
    );
  }

  if (error && trips.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-red-600 dark:text-red-400 font-medium">
            Error loading trips
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{error}</p>
          <button
            onClick={fetchTrips}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
          {/* <button
            onClick={() => setShowMap(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
          >
            <Navigation className="h-4 w-4" />
            Map View
          </button> */}
        </div>
      </div>

      {/* Stats Cards */}
      <TripStats trips={trips} />

      {/* Filters */}
      <TripFilters
        filters={filters}
        setFilters={setFilters}
        vehicles={filterVehicles}
        drivers={filterDrivers}
        customers={filterCustomers}
        selectedTrips={selectedTrips}
        // onBulkAction={(action) => {
        //   if (action === "export") {
        //     console.log("Exporting:", selectedTrips);
        //   } else if (action === "start") {
        //     selectedTrips.forEach((id) => handleStartTrip(id));
        //   }
        // }}
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
            onViewMapSim={handleViewMapSim}
            selectedTrips={selectedTrips}
            onSelectTrip={setSelectedTrips}
            onRefresh={fetchTrips}
          />
        </div>

        {/* Trip Timeline */}
        <div className="lg:col-span-1">
          <TripTimeline
            trips={trips}
            // onStatusChange={handleTripStatusChange}
            onRefresh={fetchTrips}
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
              vehicles={filterVehicles}
              drivers={filterDrivers}
              customers={filterCustomers}
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

      {showMapSim && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowMapSim(false)}
            />
            <TripMapViewSim
              trip={selectedTrip}
              trips={trips.filter((t) => t.status === "in_progress")}
              onClose={() => setShowMapSim(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
