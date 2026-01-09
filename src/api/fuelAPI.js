import apiClient from "./apiClient";

export const fuelAPI = {
  getAllFuel: async (page = 1, count = 10, orgId) => {
    try {
      console.log(
        `Fetching fuel entries - Page: ${page}, Count: ${count}, OrgId: ${orgId}`
      );

      const response = await apiClient.get("/api/fuel/getAllFuelByOrgId", {
        params: {
          orgId: orgId,
          count: count,
          page: page,
        },
      });

      const data = response;

      if (!data.status) {
        throw new Error(
          data.paramObjectsMap?.message || "Failed to fetch fuel entries"
        );
      }

      // Assuming API returns data in tfuelVO structure similar to tdriverVO
      const fuelEntries =
        data.paramObjectsMap?.fuel?.data?.map((fuel) => ({
          id: fuel.id,
          date: fuel.date,
          time: fuel.time,
          vehicle: fuel.vehicle,
          driver: fuel.driver,
           vehicleId: fuel.vehicleId,
          driverId: fuel.driverId,
          fuelType: fuel.fuelType,
          quantity: parseFloat(fuel.quantity) || 0,
          cost: parseFloat(fuel.cost) || 0,
          station: fuel.station,
          receiptNumber: fuel.receiptNumber,
          odometerReading: parseFloat(fuel.odometerReading) || 0,
          previousOdometer: parseFloat(fuel.previousOdometer) || 0,
          notes: fuel.notes,
          branchCode: fuel.branchCode || "MAIN",
          branchName: fuel.branchName || "Main Branch",
          orgId: fuel.orgId || orgId,
          createdBy: fuel.createdBy,
          updatedBy: fuel.updatedBy,
          createdAt: fuel.commonDate?.createdon,
          updatedAt: fuel.commonDate?.modifiedon,
          cancel: fuel.cancel || false,
          // Calculate derived fields
          unitPrice:
            fuel.cost && fuel.quantity
              ? (fuel.cost / fuel.quantity).toFixed(2)
              : 0,
          // Handle receipt files if they exist
          receipt: fuel.receipt || null,
          receiptPath: fuel.receiptPath || null,
        })) || [];

      return {
        fuelEntries: fuelEntries,
        pagination: {
          isFirst: data.paramObjectsMap?.fuel?.isFirst || true,
          isLast: data.paramObjectsMap?.fuel?.isLast || true,
          totalPages: data.paramObjectsMap?.fuel?.totalPages || 1,
          pageSize: data.paramObjectsMap?.fuel?.pageSize || fuelEntries.length,
          currentPage: data.paramObjectsMap?.fuel?.currentPage || 1,
          totalCount:
            data.paramObjectsMap?.fuel?.totalCount || fuelEntries.length,
        },
      };
    } catch (error) {
      console.error("Error fetching fuel entries:", error);

      // Fallback to localStorage if API fails
      try {
        const stored = localStorage.getItem("fuelEntries");
        if (stored) {
          console.warn("Using cached fuel entries from localStorage");
          const fuelEntries = JSON.parse(stored);

          // Apply pagination to localStorage data
          const startIndex = (page - 1) * count;
          const endIndex = startIndex + count;
          const paginatedEntries = fuelEntries.slice(startIndex, endIndex);

          return {
            fuelEntries: paginatedEntries.map((fuel) => ({
              ...fuel,
              // Ensure numeric fields are numbers
              quantity: parseFloat(fuel.quantity) || 0,
              cost: parseFloat(fuel.cost) || 0,
              odometerReading: parseFloat(fuel.odometerReading) || 0,
              previousOdometer: parseFloat(fuel.previousOdometer) || 0,
              unitPrice:
                fuel.cost && fuel.quantity
                  ? (fuel.cost / fuel.quantity).toFixed(2)
                  : 0,
            })),
            pagination: {
              isFirst: page === 1,
              isLast: endIndex >= fuelEntries.length,
              totalPages: Math.ceil(fuelEntries.length / count),
              pageSize: count,
              currentPage: page,
              totalCount: fuelEntries.length,
            },
          };
        }
      } catch (localStorageError) {
        console.error("Error reading from localStorage:", localStorageError);
      }

      // Return empty array if everything fails
      return {
        fuelEntries: [],
        pagination: {
          isFirst: true,
          isLast: true,
          totalPages: 0,
          pageSize: count,
          currentPage: page,
          totalCount: 0,
        },
      };
    }
  },

createUpdateFuel: async (fuelData) => {
  console.log("Fuel data to API:", fuelData);

  try {
    console.log("Saving fuel entry with JSON...");

    // Get user info
    const userId = JSON.parse(localStorage.getItem("user"))?.usersId || "";
    const orgId = localStorage.getItem("orgId") || 1001;
    const userName = localStorage.getItem("userName") || "Admin User";

    // Prepare the payload
    const formatDate = (dateString) => {
      if (!dateString) return null;
      try {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      } catch (e) {
        console.error("Error formatting date:", dateString, e);
        return null;
      }
    };

    // Create payload
    const payload = {
      date: formatDate(fuelData.date) || formatDate(new Date().toISOString().split("T")[0]),
      time: fuelData.time || new Date().toTimeString().split(" ")[0].substring(0, 5),
      vehicle: fuelData.vehicle || "",
      driver: fuelData.driver || "",
      fuelType: fuelData.fuelType || "Diesel",
      quantity: parseFloat(fuelData.quantity) || 0,
      cost: parseFloat(fuelData.cost) || 0,
      station: fuelData.station || "",
      receiptNumber: fuelData.receiptNumber || "",
      odometerReading: parseFloat(fuelData.odometerReading) || 0,
      previousOdometer: parseFloat(fuelData.previousOdometer) || 0,
      notes: fuelData.notes || "",
      branchCode: fuelData.branchCode || "MAIN",
      branchName: fuelData.branchName || "Main Branch",
      orgId: parseInt(orgId),
      createdBy: userId,
      userName: userName,
    };

    // Add ID if editing
    if (fuelData.id && fuelData.id !== 0) {
      payload.id = fuelData.id;
      payload.updatedBy = userId;
    }

    console.log("Sending fuel payload:", JSON.stringify(payload, null, 2));

    // Send as JSON
    const response = await apiClient.put(
      "/api/fuel/createUpdateFuel",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Save response:", response);

    if (response && response.statusFlag === "Ok") {
      return response;
    } else {
      throw new Error(
        response?.paramObjectsMap?.message || "Failed to save fuel entry"
      );
    }
  } catch (error) {
    console.error("Error saving fuel entry:", error);

    // Log more details if available
    if (error.response) {
      console.error("Response error:", error.response.data);
      console.error("Response status:", error.response.status);
    }

    // Fallback to localStorage if API fails
    try {
      console.warn("API failed, falling back to localStorage");

      // Get existing fuel entries from localStorage
      const fuelEntries = JSON.parse(
        localStorage.getItem("fuelEntries") || "[]"
      );
      let newFuelEntry;
      let updatedFuelEntries = [...fuelEntries];

      const formatDateForStorage = (dateString) => {
        if (!dateString) return new Date().toISOString().split("T")[0];
        try {
          return new Date(dateString).toISOString().split("T")[0];
        } catch (e) {
          return new Date().toISOString().split("T")[0];
        }
      };

      const formatTimeForStorage = (timeString) => {
        if (!timeString)
          return new Date().toTimeString().split(" ")[0].substring(0, 5);
        return timeString;
      };

      if (fuelData.id && fuelData.id !== 0) {
        // Update existing fuel entry
        const index = updatedFuelEntries.findIndex(
          (f) => f.id === fuelData.id
        );
        if (index === -1) {
          throw new Error("Fuel entry not found in localStorage");
        }

        newFuelEntry = {
          ...updatedFuelEntries[index],
          ...fuelData,
          date: formatDateForStorage(fuelData.date),
          time: formatTimeForStorage(fuelData.time),
          // Ensure numeric fields
          quantity: parseFloat(fuelData.quantity) || 0,
          cost: parseFloat(fuelData.cost) || 0,
          odometerReading: parseFloat(fuelData.odometerReading) || 0,
          previousOdometer: parseFloat(fuelData.previousOdometer) || 0,
          orgId: parseInt(fuelData.orgId) || 1001,
          updatedAt: new Date().toISOString(),
        };
        updatedFuelEntries[index] = newFuelEntry;
      } else {
        // Create new fuel entry
        const newId =
          Math.max(0, ...updatedFuelEntries.map((f) => f.id || 0)) + 1;
        newFuelEntry = {
          id: newId,
          ...fuelData,
          date: formatDateForStorage(fuelData.date),
          time: formatTimeForStorage(fuelData.time),
          // Ensure numeric fields
          quantity: parseFloat(fuelData.quantity) || 0,
          cost: parseFloat(fuelData.cost) || 0,
          odometerReading: parseFloat(fuelData.odometerReading) || 0,
          previousOdometer: parseFloat(fuelData.previousOdometer) || 0,
          orgId: parseInt(fuelData.orgId) || 1001,
          // Default values
          branchCode: fuelData.branchCode || "MAIN",
          branchName: fuelData.branchName || "Main Branch",
          fuelType: fuelData.fuelType || "Diesel",
          station: fuelData.station || "",
          vehicle: fuelData.vehicle || "",
          driver: fuelData.driver || "",
          receiptNumber: fuelData.receiptNumber || "",
          notes: fuelData.notes || "",
          createdBy:
            fuelData.createdBy ||
            JSON.parse(localStorage.getItem("user"))?.usersId ||
            "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        updatedFuelEntries.push(newFuelEntry);
      }

      localStorage.setItem("fuelEntries", JSON.stringify(updatedFuelEntries));

      return {
        statusFlag: "Ok",
        status: true,
        message: "Fuel entry saved to local storage (API unavailable)",
        data: newFuelEntry,
      };
    } catch (fallbackError) {
      console.error("LocalStorage fallback also failed:", fallbackError);
      throw new Error(`Failed to save fuel entry: ${error.message}`);
    }
  }
},

  // Helper function to get fuel by ID
  getFuelById: async (fuelId) => {
    try {
      const response = await apiClient.get(`/api/fuel/getFuelById/${fuelId}`);

      const data = response;

      if (!data.status) {
        throw new Error(
          data.paramObjectsMap?.message || "Failed to fetch fuel entry"
        );
      }

      // Assuming API returns data in tfuelVO structure
      const fuelData = data.paramObjectsMap?.fuel?.data?.[0] || {};

      return {
        id: fuelData.id,
        date: fuelData.date,
        time: fuelData.time,
        vehicle: fuelData.vehicle,
        driver: fuelData.driver,
        fuelType: fuelData.fuelType,
        quantity: parseFloat(fuelData.quantity) || 0,
        cost: parseFloat(fuelData.cost) || 0,
        station: fuelData.station,
        receiptNumber: fuelData.receiptNumber,
        odometerReading: parseFloat(fuelData.odometerReading) || 0,
        previousOdometer: parseFloat(fuelData.previousOdometer) || 0,
        notes: fuelData.notes,
        branchCode: fuelData.branchCode || "MAIN",
        branchName: fuelData.branchName || "Main Branch",
        orgId: fuelData.orgId,
        createdBy: fuelData.createdBy,
        updatedBy: fuelData.updatedBy,
        createdAt: fuelData.commonDate?.createdon,
        updatedAt: fuelData.commonDate?.modifiedon,
        cancel: fuelData.cancel || false,
        // Calculate derived field
        unitPrice:
          fuelData.cost && fuelData.quantity
            ? (fuelData.cost / fuelData.quantity).toFixed(2)
            : 0,
        // Handle receipt files
        receipt: fuelData.receipt,
        receiptPath: fuelData.receiptPath,
      };
    } catch (error) {
      console.error("Error fetching fuel entry by ID:", error);

      // Fallback to localStorage
      try {
        const stored = localStorage.getItem("fuelEntries");
        if (stored) {
          const fuelEntries = JSON.parse(stored);
          const fuelEntry = fuelEntries.find((f) => f.id === fuelId);

          if (fuelEntry) {
            console.warn("Found fuel entry in localStorage fallback");
            return {
              ...fuelEntry,
              quantity: parseFloat(fuelEntry.quantity) || 0,
              cost: parseFloat(fuelEntry.cost) || 0,
              odometerReading: parseFloat(fuelEntry.odometerReading) || 0,
              previousOdometer: parseFloat(fuelEntry.previousOdometer) || 0,
              unitPrice:
                fuelEntry.cost && fuelEntry.quantity
                  ? (fuelEntry.cost / fuelEntry.quantity).toFixed(2)
                  : 0,
            };
          }
        }
      } catch (localStorageError) {
        console.error("Error reading from localStorage:", localStorageError);
      }

      throw new Error(`Failed to fetch fuel entry: ${error.message}`);
    }
  },

  // Optional: Delete fuel entry
  deleteFuel: async (fuelId) => {
    try {
      const response = await apiClient.delete(`/api/fuel/deleteFuel/${fuelId}`);

      if (response && response.statusFlag === "Ok") {
        // Also remove from localStorage if exists
        try {
          const stored = localStorage.getItem("fuelEntries");
          if (stored) {
            const fuelEntries = JSON.parse(stored);
            const updatedEntries = fuelEntries.filter((f) => f.id !== fuelId);
            localStorage.setItem("fuelEntries", JSON.stringify(updatedEntries));
          }
        } catch (e) {
          // Ignore localStorage errors
        }

        return response;
      } else {
        throw new Error(
          response?.paramObjectsMap?.message || "Failed to delete fuel entry"
        );
      }
    } catch (error) {
      console.error("Error deleting fuel entry:", error);
      throw new Error(`Failed to delete fuel entry: ${error.message}`);
    }
  },

  // Get fuel statistics
  getFuelStatistics: async () => {
    try {
      const { fuelEntries } = await fuelAPI.getAllFuel(1, 1000);

      // Calculate statistics
      const statistics = {
        totalEntries: fuelEntries.length,
        totalCost: fuelEntries.reduce((sum, entry) => sum + entry.cost, 0),
        totalQuantity: fuelEntries.reduce(
          (sum, entry) => sum + entry.quantity,
          0
        ),
        avgCostPerLiter: 0,
        avgEfficiency: 0,
      };

      if (statistics.totalQuantity > 0) {
        statistics.avgCostPerLiter = (
          statistics.totalCost / statistics.totalQuantity
        ).toFixed(2);
      }

      return statistics;
    } catch (error) {
      console.error("Error calculating statistics:", error);
      return {
        totalEntries: 0,
        totalCost: 0,
        totalQuantity: 0,
        avgCostPerLiter: 0,
        avgEfficiency: 0,
      };
    }
  },
};
