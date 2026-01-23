import apiClient from "./apiClient";

const vehicleAPI = {
  // Get all vehicles from real API
  getVehicles: async (orgId) => {
    try {
      const response = await apiClient.get(
        "/api/transaction/getTvehiclesByOrgId",
        { params: { orgId } }
      );

      const data = response;

      if (!data.status) {
        throw new Error(
          data.paramObjectsMap?.message || "Failed to fetch vehicles"
        );
      }

      const vehicles =
        data.paramObjectsMap?.tvehicleVO?.map((vehicle) => ({
          id: vehicle.id,
          vehicleNumber: vehicle.vehicleNumber,
          type: vehicle.type,
          model: vehicle.model,
          capacity: vehicle.capacity,
          status: (vehicle.active || "ACTIVE").toLowerCase(),
          insuranceExpiry: vehicle.insuranceExpiry,
          fitnessExpiry: vehicle.fitnessExpiry,
          lastService: vehicle.lastService,
          nextService: vehicle.nextService,

          // 🔴 IMPORTANT: normalize driver (STRING ONLY)
          driver:
            typeof vehicle.driver === "object"
              ? vehicle.driver?.name || "Not assigned"
              : vehicle.driver || "Not assigned",

          driverPhone: vehicle.driverPhone,
          currentLocation: vehicle.currentLocation || "Not specified",
          fuelEfficiency: vehicle.fuelEfficiency || "N/A",

          documents: vehicle.documents?.map((d) => d.documentType) || [],
          documentObjects: vehicle.documents || [],

          maintenanceRequired: vehicle.maintenanceRequired || false,
          year: vehicle.year,
          chassisNumber: vehicle.chassisNumber,
          engineNumber: vehicle.engineNumber,
          permitType: vehicle.permitType,
          registrationType: vehicle.registrationType,
          ownerName: vehicle.ownerName,
          orgId: vehicle.orgId,
          branchCode: vehicle.branchCode,
          branchName: vehicle.branchName,
          createdBy: vehicle.createdBy,
          updatedBy: vehicle.updatedBy,
          createdAt: vehicle.commonDate?.createdon,
          updatedAt: vehicle.commonDate?.modifiedon,
          cancel: vehicle.cancel,
        })) || [];

      return { vehicles };
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      return { vehicles: [] };
    }
  },

  // Create or Update vehicle using the real API
  createUpdateVehicle: async (formData) => {
    try {
      console.log("Sending vehicle with files to API...");

      // Send FormData directly to API
      const response = await apiClient.put(
        "/api/transaction/createUpdateTvehicle",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Save response:", response);

      if (response && response.statusFlag === "Ok") {
        return response;
      } else {
        throw new Error(
          response?.paramObjectsMap?.message || "Failed to save vehicle"
        );
      }
    } catch (error) {
      console.error("Error saving vehicle:", error);

      // Fallback to localStorage if API fails
      try {
        // Extract non-file data from FormData for fallback
        const vehicleData = {};
        formData.forEach((value, key) => {
          // Only store non-file data (skip file parameters)
          if (
            !["RC", "INSURANCE", "FC", "PERMIT", "PUC", "OTHER"].includes(key)
          ) {
            vehicleData[key] = value;
          }
        });

        const { vehicles } = await vehicleAPI.getVehicles();
        let newVehicle;

        const vehicleId = vehicleData.id;

        if (vehicleId && vehicleId !== "0") {
          // Update existing vehicle
          const index = vehicles.findIndex((v) => v.id === parseInt(vehicleId));
          if (index === -1) {
            throw new Error("Vehicle not found");
          }

          newVehicle = {
            ...vehicles[index],
            ...vehicleData,
            updatedAt: new Date().toISOString(),
          };
          vehicles[index] = newVehicle;
        } else {
          // Create new vehicle
          newVehicle = {
            id: Math.max(0, ...vehicles.map((v) => v.id)) + 1,
            ...vehicleData,
            status: "active",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          vehicles.push(newVehicle);
        }

        localStorage.setItem("vehicles", JSON.stringify(vehicles));

        return {
          statusFlag: "Ok",
          status: true,
          message: "Vehicle saved to local storage (API unavailable)",
        };
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
        throw new Error(`Failed to save vehicle: ${error.message}`);
      }
    }
  },

  // Delete vehicle (keep as fallback for now)
  deleteVehicle: async (id) => {
    try {
      const { vehicles } = await vehicleAPI.getVehicles();
      const filteredVehicles = vehicles.filter((v) => v.id !== id);
      localStorage.setItem("vehicles", JSON.stringify(filteredVehicles));
      return true;
    } catch (error) {
      console.error(`Error deleting vehicle ${id}:`, error);
      throw error;
    }
  },

  // Get single vehicle by ID
  getVehicleById: async (id) => {
    try {
      const { vehicles } = await vehicleAPI.getVehicles();
      const vehicle = vehicles.find((v) => v.id === id);

      if (!vehicle) {
        throw new Error(`Vehicle with ID ${id} not found`);
      }

      return vehicle;
    } catch (error) {
      console.error(`Error fetching vehicle ${id}:`, error);
      throw error;
    }
  },
};

export default vehicleAPI;
