import apiClient from "./apiClient";

export const tyreAPI = {
  getAllTyre: async (orgId) => {
    try {
      const response = await apiClient.get(
        "/api/tyre/getAllTyreByOrgId",
        { params: { orgId } }
      );

      const data = response;

      if (!data.status) {
        throw new Error(
          data.paramObjectsMap?.message || "Failed to fetch tyre entries"
        );
      }

      const tyreEntries = Array.isArray(data.paramObjectsMap?.tyre)
        ? data.paramObjectsMap.tyre.map(tyre => ({
          id: tyre.id,
          serialNumber: tyre.serialNumber,
          brand: tyre.brand,
          model: tyre.model,
          size: tyre.size,
          position: tyre.position,
          status: tyre.status,
          purchaseDate: tyre.purchaseDate,
          purchaseCost: parseFloat(tyre.purchaseCost) || 0,
          odometerReading: parseFloat(tyre.odometerReading) || 0,
          treadDepth: parseFloat(tyre.treadDepth) || 0,
          recommendedPressure: parseFloat(tyre.recommendedPressure) || 0,
          pressure: parseFloat(tyre.pressure) || 0,
          notes: tyre.notes,
          active: tyre.active ?? true,
          vehicleId: String(tyre.vehicleId),
          vehicle: tyre.vehicle || "Unassigned",
          branchCode: tyre.branchCode || "MAIN",
          branchName: tyre.branchName || "Main Branch",
          createdAt: tyre.commonDate?.createdon,
          updatedAt: tyre.commonDate?.modifiedon,
        }))
        : [];

      return { tyreEntries };
    } catch (error) {
      console.error("Error fetching tyre entries:", error);
      return { tyreEntries: [] };
    }
  },

  createUpdateTyre: async (tyreData) => {
    try {
      console.log("Saving tyre entry:", tyreData);

      // Get user info
      const userId = JSON.parse(localStorage.getItem("user"))?.usersId || "";
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
        serialNumber: tyreData.serialNumber || "",
        brand: tyreData.brand || "",
        model: tyreData.model || "",
        size: tyreData.size || "",
        position: tyreData.position || "front",
        status: tyreData.status || "new",
        purchaseDate:
          formatDate(tyreData.purchaseDate) ||
          formatDate(new Date().toISOString().split("T")[0]),
        purchaseCost: parseFloat(tyreData.purchaseCost) || 0,
        odometerReading: parseFloat(tyreData.odometerReading) || 0,
        treadDepth: parseFloat(tyreData.treadDepth) || 0,
        recommendedPressure: parseFloat(tyreData.recommendedPressure) || 0,
        pressure: parseFloat(tyreData.pressure) || 0,
        notes: tyreData.notes || "",
        active: tyreData.active !== undefined ? tyreData.active : true,
        branchCode: tyreData.branchCode || "MAIN",
        branchName: tyreData.branchName || "Main Branch",
        orgId: tyreData.orgId,
        // vehicle: tyreData.vehicle || "",
        vehicleId: tyreData.vehicleId,
        user: userId,
        createdBy: userName,
      };

      // Add ID if editing
      if (tyreData.id && tyreData.id !== 0) {
        payload.id = tyreData.id;
        payload.updatedBy = userName;
      }

      console.log("Sending tyre payload:", JSON.stringify(payload, null, 2));

      // Send as JSON
      const response = await apiClient.put(
        "/api/tyre/createUpdateTyre",
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
          response?.paramObjectsMap?.message || "Failed to save tyre entry"
        );
      }
    } catch (error) {
      console.error("Error saving tyre entry:", error);

      // Log more details if available
      if (error.response) {
        console.error("Response error:", error.response.data);
        console.error("Response status:", error.response.status);
      }

      // Fallback to localStorage if API fails
      try {
        console.warn("API failed, falling back to localStorage");

        // Get existing tyre entries from localStorage
        const tyreEntries = JSON.parse(
          localStorage.getItem("tyreEntries") || "[]"
        );
        let newTyreEntry;
        let updatedTyreEntries = [...tyreEntries];

        if (tyreData.id && tyreData.id !== 0) {
          // Update existing tyre entry
          const index = updatedTyreEntries.findIndex(
            (t) => t.id === tyreData.id
          );
          if (index === -1) {
            throw new Error("Tyre entry not found in localStorage");
          }

          newTyreEntry = {
            ...updatedTyreEntries[index],
            ...tyreData,
            purchaseCost: parseFloat(tyreData.purchaseCost) || 0,
            odometerReading: parseFloat(tyreData.odometerReading) || 0,
            treadDepth: parseFloat(tyreData.treadDepth) || 0,
            recommendedPressure: parseFloat(tyreData.recommendedPressure) || 0,
            pressure: parseFloat(tyreData.pressure) || 0,
            updatedAt: new Date().toISOString(),
          };
          updatedTyreEntries[index] = newTyreEntry;
        } else {
          // Create new tyre entry
          const newId =
            Math.max(0, ...updatedTyreEntries.map((t) => t.id || 0)) + 1;
          newTyreEntry = {
            id: newId,
            ...tyreData,
            purchaseCost: parseFloat(tyreData.purchaseCost) || 0,
            odometerReading: parseFloat(tyreData.odometerReading) || 0,
            treadDepth: parseFloat(tyreData.treadDepth) || 0,
            recommendedPressure: parseFloat(tyreData.recommendedPressure) || 0,
            pressure: parseFloat(tyreData.pressure) || 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          updatedTyreEntries.push(newTyreEntry);
        }

        localStorage.setItem("tyreEntries", JSON.stringify(updatedTyreEntries));

        return {
          statusFlag: "Ok",
          status: true,
          message: "Tyre entry saved to local storage (API unavailable)",
          data: newTyreEntry,
        };
      } catch (fallbackError) {
        console.error("LocalStorage fallback also failed:", fallbackError);
        throw new Error(`Failed to save tyre entry: ${error.message}`);
      }
    }
  },

  getTyreById: async (tyreId) => {
    try {
      const response = await apiClient.get(`/api/tyre/getTyreById/${tyreId}`);

      const data = response;

      if (!data.status) {
        throw new Error(
          data.paramObjectsMap?.message || "Failed to fetch tyre entry"
        );
      }

      // Assuming API returns data in ttyreVO structure
      const tyreData = data.paramObjectsMap?.tyre || {};

      return {
        id: tyreData.id,
        serialNumber: tyreData.serialNumber,
        brand: tyreData.brand,
        model: tyreData.model,
        size: tyreData.size,
        position: tyreData.position,
        status: tyreData.status,
        purchaseDate: tyreData.purchaseDate,
        purchaseCost: parseFloat(tyreData.purchaseCost) || 0,
        odometerReading: parseFloat(tyreData.odometerReading) || 0,
        treadDepth: parseFloat(tyreData.treadDepth) || 0,
        recommendedPressure: parseFloat(tyreData.recommendedPressure) || 0,
        pressure: parseFloat(tyreData.pressure) || 0,
        notes: tyreData.notes,
        active: tyreData.active || true,
        createdBy: tyreData.createdBy,
        updatedBy: tyreData.updatedBy,
        cancel: tyreData.cancel || false,
        branchCode: tyreData.branchCode || "MAIN",
        branchName: tyreData.branchName || "Main Branch",
        orgId: tyreData.orgId,
        vehicle: tyreData.vehicle,
        user: tyreData.user,
      };
    } catch (error) {
      console.error("Error fetching tyre entry by ID:", error);

      // Fallback to localStorage
      try {
        const stored = localStorage.getItem("tyreEntries");
        if (stored) {
          const tyreEntries = JSON.parse(stored);
          const tyreEntry = tyreEntries.find((t) => t.id === tyreId);

          if (tyreEntry) {
            console.warn("Found tyre entry in localStorage fallback");
            return {
              ...tyreEntry,
              purchaseCost: parseFloat(tyreEntry.purchaseCost) || 0,
              odometerReading: parseFloat(tyreEntry.odometerReading) || 0,
              treadDepth: parseFloat(tyreEntry.treadDepth) || 0,
              recommendedPressure:
                parseFloat(tyreEntry.recommendedPressure) || 0,
              pressure: parseFloat(tyreEntry.pressure) || 0,
            };
          }
        }
      } catch (localStorageError) {
        console.error("Error reading from localStorage:", localStorageError);
      }

      throw new Error(`Failed to fetch tyre entry: ${error.message}`);
    }
  },

  deleteTyre: async (tyreId) => {
    try {
      const response = await apiClient.delete(`/api/tyre/deleteTyre/${tyreId}`);

      if (response && response.statusFlag === "Ok") {
        // Also remove from localStorage if exists
        try {
          const stored = localStorage.getItem("tyreEntries");
          if (stored) {
            const tyreEntries = JSON.parse(stored);
            const updatedEntries = tyreEntries.filter((t) => t.id !== tyreId);
            localStorage.setItem("tyreEntries", JSON.stringify(updatedEntries));
          }
        } catch (e) {
          // Ignore localStorage errors
        }

        return response;
      } else {
        throw new Error(
          response?.paramObjectsMap?.message || "Failed to delete tyre entry"
        );
      }
    } catch (error) {
      console.error("Error deleting tyre entry:", error);
      throw new Error(`Failed to delete tyre entry: ${error.message}`);
    }
  },
};
