import apiClient from "./apiClient";

const driverAPI = {
  // Get all drivers from real API
  getDrivers: async (page = 1, count = 10, orgId) => {
    try {
      const response = await apiClient.get(
        "/api/transaction/getTdriverByOrgId",
        {
          params: {
            orgId: orgId,
            count: count,
            page: page,
            orgId: orgId,
          },
        }
      );

      const data = response;

      if (!data.status) {
        throw new Error(
          data.paramObjectsMap?.message || "Failed to fetch drivers"
        );
      }

      // Assuming API returns data in similar structure as vehicles
      const drivers =
        data.paramObjectsMap?.tdriverVO?.data?.map((driver) => ({
          id: driver.id,
          name: driver.name,
          phone: driver.phone,
          email: driver.email,
          active: driver.active,
          licenseNumber: driver.licenseNumber,
          licenseExpiry: driver.licenseExpiry,
          aadharNumber: driver.aadharNumber,
          address: driver.address,
          status: driver.status,
          experience: driver.experience,
          salary: driver.salary,
          assignedVehicle: driver.assignedVehicle,
          currentLocation: driver.currentLocation,
          bloodGroup: driver.bloodGroup,
          emergencyContact: driver.emergencyContact,
          performance: driver.performance || "4.5/5",
          joinedDate: driver.joinedDate,
          lastTrip: driver.lastTrip,
          orgId: driver.orgId || orgId,
          branchCode: driver.branchCode || "MAIN",
          branchName: driver.branchName || "Main Branch",
          createdBy: driver.createdBy,
          updatedBy: driver.updatedBy,
          createdAt: driver.commonDate?.createdon,
          updatedAt: driver.commonDate?.modifiedon,
          cancel: driver.cancel || false,

          // ✅ FIXED DOCUMENT HANDLING
          documents: driver.documents?.map((doc) => doc.documentType) || [],
          documentObjects: driver.documents || [],
        })) || [];

      return {
        drivers: drivers,
        pagination: {
          isFirst: data.paramObjectsMap?.tdriverVO?.isFirst || true,
          isLast: data.paramObjectsMap?.tdriverVO?.isLast || true,
          totalPages: data.paramObjectsMap?.tdriverVO?.totalPages || 1,
          pageSize: data.paramObjectsMap?.tdriverVO?.pageSize || drivers.length,
          currentPage: data.paramObjectsMap?.tdriverVO?.currentPage || 1,
          totalCount:
            data.paramObjectsMap?.tdriverVO?.totalCount || drivers.length,
        },
      };
    } catch (error) {
      console.error("Error fetching drivers:", error);

      // Fallback to localStorage if API fails
      try {
        const stored = localStorage.getItem("drivers");
        if (stored) {
          console.warn("Using cached drivers from localStorage");
          const drivers = JSON.parse(stored);
          return {
            drivers: drivers,
            pagination: {
              isFirst: true,
              isLast: true,
              totalPages: 1,
              pageSize: drivers.length,
              currentPage: 1,
              totalCount: drivers.length,
            },
          };
        }
      } catch (localStorageError) {
        console.error("Error reading from localStorage:", localStorageError);
      }

      // Return empty array if everything fails
      return {
        drivers: [],
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

  // Create or Update driver using the real API
  createUpdateDriver: async (driverFormData) => {
    console.log("driverFormData", driverFormData);

    try {
      console.log("Saving driver with FormData...");

      // Try the FormData approach directly
      const response = await apiClient.put(
        "/api/transaction/createUpdateTdriver",
        driverFormData,
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
          response?.paramObjectsMap?.message || "Failed to save driver"
        );
      }
    } catch (error) {
      console.error("Error saving driver:", error);

      // Log more details if available
      if (error.response) {
        console.error("Response error:", error.response.data);
        console.error("Response status:", error.response.status);
      }

      // Fallback to JSON approach if FormData fails
      if (error.response?.status === 400 || error.response?.status === 415) {
        console.log("FormData failed, trying JSON...");

        try {
          // Extract driver data from FormData
          const driverDataBlob = driverFormData.get("tdriverDTO");
          if (driverDataBlob) {
            const driverDataText = await driverDataBlob.text();
            const driverData = JSON.parse(driverDataText);

            // Call the original JSON endpoint
            const jsonResponse = await apiClient.put(
              "/api/transaction/createUpdateTdriver",
              driverData,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (jsonResponse && jsonResponse.statusFlag === "Ok") {
              return jsonResponse;
            }
          }
        } catch (jsonError) {
          console.error("JSON approach also failed:", jsonError);
        }
      }

      // Fallback to localStorage if API fails
      try {
        console.warn("API failed, falling back to localStorage");

        // Extract driver data from FormData for localStorage
        const driverDataBlob = driverFormData.get("tdriverDTO");
        let driverData = {};
        if (driverDataBlob) {
          const driverDataText = await driverDataBlob.text();
          driverData = JSON.parse(driverDataText);
        }

        const { drivers } = await driverAPI.getDrivers(1, 1000);
        let newDriver;
        let driversArray = drivers;

        if (driverData.id && driverData.id !== 0) {
          // Update existing driver
          const index = driversArray.findIndex((d) => d.id === driverData.id);
          if (index === -1) {
            throw new Error("Driver not found in localStorage");
          }

          newDriver = {
            ...driversArray[index],
            ...driverData,
            updatedAt: new Date().toISOString(),
          };
          driversArray[index] = newDriver;
        } else {
          // Create new driver
          const newId = Math.max(0, ...driversArray.map((d) => d.id || 0)) + 1;
          newDriver = {
            id: newId,
            ...driverData,
            status: driverData.status || "active",
            active: (driverData.status || "active") === "active",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          driversArray.push(newDriver);
        }

        localStorage.setItem("drivers", JSON.stringify(driversArray));

        return {
          statusFlag: "Ok",
          status: true,
          message: "Driver saved to local storage (API unavailable)",
          data: newDriver,
        };
      } catch (fallbackError) {
        console.error("LocalStorage fallback also failed:", fallbackError);
        throw new Error(`Failed to save driver: ${error.message}`);
      }
    }
  },

  // Delete driver
  deleteDriver: async (id) => {
    try {
      // First try API if available
      try {
        const response = await apiClient.delete(
          `/api/transaction/deleteTdriver/${id}`,
          {
            params: {
              updatedBy: localStorage.getItem("userId") || "admin",
            },
          }
        );

        if (response && response.statusFlag === "Ok") {
          return true;
        }
      } catch (apiError) {
        console.warn(
          "API delete failed, using localStorage fallback:",
          apiError
        );
      }

      // Fallback to localStorage
      const { drivers } = await driverAPI.getDrivers(1, 1000);
      const filteredDrivers = drivers.filter((d) => d.id !== id);
      localStorage.setItem("drivers", JSON.stringify(filteredDrivers));
      return true;
    } catch (error) {
      console.error(`Error deleting driver ${id}:`, error);
      throw error;
    }
  },

  // Get single driver by ID
  getDriverById: async (id) => {
    try {
      // Try API first
      try {
        const response = await apiClient.get(
          `/api/transaction/getTdriverById/${id}`
        );

        if (response && response.status) {
          const driverData = response.paramObjectsMap?.tdriverVO;
          if (driverData) {
            return {
              id: driverData.id,
              name: driverData.name,
              phone: driverData.phone,
              email: driverData.email,
              licenseNumber: driverData.licenseNumber,
              licenseExpiry: driverData.licenseExpiry,
              aadharNumber: driverData.aadharNumber,
              address: driverData.address,
              status:
                driverData.status ||
                (driverData.active ? "active" : "inactive"),
              experience: driverData.experience,
              salary: driverData.salary,
              assignedVehicle: driverData.assignedVehicle,
              currentLocation: driverData.currentLocation,
              bloodGroup: driverData.bloodGroup,
              emergencyContact: driverData.emergencyContact,
              performance: driverData.performance || "4.5/5",
              joinedDate: driverData.joinedDate,
              lastTrip: driverData.lastTrip,
              orgId: driverData.orgId,
              branchCode: driverData.branchCode,
              branchName: driverData.branchName,
              active: driverData.active,
              documents: driverData.tdriverDocumentsVO?.map(
                (doc) => doc.documentType
              ) || ["License", "Aadhar", "PAN"],
            };
          }
        }
      } catch (apiError) {
        console.warn("API get by ID failed, using fallback:", apiError);
      }

      // Fallback to getting from localStorage
      const { drivers } = await driverAPI.getDrivers(1, 1000);
      const driver = drivers.find((d) => d.id === id);

      if (!driver) {
        throw new Error(`Driver with ID ${id} not found`);
      }

      return driver;
    } catch (error) {
      console.error(`Error fetching driver ${id}:`, error);
      throw error;
    }
  },

  // Get drivers by status
  getDriversByStatus: async (status) => {
    try {
      const { drivers } = await driverAPI.getDrivers(1, 1000);
      return drivers.filter((driver) => driver.status === status);
    } catch (error) {
      console.error(`Error fetching drivers by status ${status}:`, error);
      throw error;
    }
  },

  // Get drivers with expiring licenses (within 30 days)
  getDriversWithExpiringLicenses: async () => {
    try {
      const { drivers } = await driverAPI.getDrivers(1, 1000);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      return drivers.filter((driver) => {
        if (!driver.licenseExpiry) return false;
        const expiryDate = new Date(driver.licenseExpiry);
        return expiryDate <= thirtyDaysFromNow;
      });
    } catch (error) {
      console.error("Error fetching drivers with expiring licenses:", error);
      throw error;
    }
  },

  // Search drivers by name, phone, or license number
  searchDrivers: async (searchTerm) => {
    try {
      const { drivers } = await driverAPI.getDrivers(1, 1000);
      const lowerSearchTerm = searchTerm.toLowerCase();

      return drivers.filter(
        (driver) =>
          driver.name.toLowerCase().includes(lowerSearchTerm) ||
          driver.phone.includes(searchTerm) ||
          driver.licenseNumber.toLowerCase().includes(lowerSearchTerm) ||
          driver.aadharNumber.includes(searchTerm)
      );
    } catch (error) {
      console.error("Error searching drivers:", error);
      throw error;
    }
  },

  // Update driver status
  updateDriverStatus: async (id, status) => {
    try {
      const driver = await driverAPI.getDriverById(id);
      const updatedDriver = {
        ...driver,
        status: status,
        active: status === "active",
      };

      return await driverAPI.createUpdateDriver(updatedDriver);
    } catch (error) {
      console.error(`Error updating driver ${id} status:`, error);
      throw error;
    }
  },

  // Assign vehicle to driver
  assignVehicleToDriver: async (driverId, vehicleNumber) => {
    try {
      const driver = await driverAPI.getDriverById(driverId);
      const updatedDriver = {
        ...driver,
        assignedVehicle: vehicleNumber,
      };

      return await driverAPI.createUpdateDriver(updatedDriver);
    } catch (error) {
      console.error(`Error assigning vehicle to driver ${driverId}:`, error);
      throw error;
    }
  },
};

export default driverAPI;
