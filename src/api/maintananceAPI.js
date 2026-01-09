import apiClient from "./apiClient";

export const maintananceAPI = {
  // Fetch all maintenance records with pagination
  getAllMaintenance: async (page = 1, count = 10, orgId, filters = {}) => {
    try {
      const params = {
        orgId: orgId,
        count: count,
        page: page,
        ...filters,
      };

      console.log("Fetching maintenance with params:", params);

      const response = await apiClient.get(
        "/api/maintenance/getAllMaintenanceByOrgId",
        {
          params: params,
        }
      );

      const data = response.data || response;
      console.log("Maintenance API response:", data);

      // Check if API call was successful
      if (!data.status) {
        throw new Error(
          data.paramObjectsMap?.message || "Failed to fetch maintenance records"
        );
      }

      // Parse maintenance records
      const maintenanceRecords = parseMaintenanceResponse(data);

      // Return formatted response
      return {
        maintenanceRecords: maintenanceRecords,
        pagination: {
          isFirst: data.paramObjectsMap?.maintenance?.isFirst || true,
          isLast: data.paramObjectsMap?.maintenance?.isLast || true,
          totalPages: data.paramObjectsMap?.maintenance?.totalPages || 1,
          pageSize: data.paramObjectsMap?.maintenance?.pageSize || 10,
          currentPage: data.paramObjectsMap?.maintenance?.currentPage || page,
          totalCount: data.paramObjectsMap?.maintenance?.totalCount || 0,
        },
        message: data.paramObjectsMap?.message || "Success",
      };
    } catch (error) {
      console.error("Error fetching maintenance records:", error);
      throw error;
    }
  },


// services/maintenanceService.js - Add this method
createUpdateMaintenance: async (maintenanceData) => {
  try {
    console.log("Sending maintenance data:", maintenanceData);
    
    const response = await apiClient.put(
      "/api/maintenance/createUpdateMaintenance",
      maintenanceData
    );

    const data = response.data || response;
    console.log("Create/Update response:", data);

    if (!data.status) {
      throw new Error(
        data.paramObjectsMap?.message || "Failed to save maintenance record"
      );
    }

    return {
      success: true,
      data: data.paramObjectsMap?.maintenance,
      message: data.paramObjectsMap?.message || "Operation successful"
    };
  } catch (error) {
    console.error("Error creating/updating maintenance:", error);
    
    // Handle specific error cases
    if (error.response) {
      const errorData = error.response.data;
      throw new Error(
        errorData.paramObjectsMap?.message || 
        errorData.message || 
        "Failed to save maintenance record"
      );
    }
    
    throw error;
  }
},


  // Get single maintenance record by ID
  getMaintenanceById: async (id, orgId) => {
    try {
      const response = await apiClient.get(`/api/maintenance/${id}`, {
        params: { orgId },
      });

      const data = response.data || response;
      console.log("Maintenance detail API response:", data);

      if (!data.status) {
        throw new Error(
          data.paramObjectsMap?.message || "Failed to fetch maintenance record"
        );
      }

      const maintenanceRecord = parseSingleMaintenanceResponse(data);

      return {
        maintenanceRecord: maintenanceRecord,
        message: data.paramObjectsMap?.message || "Success",
      };
    } catch (error) {
      console.error(`Error fetching maintenance record ${id}:`, error);
      throw error;
    }
  },
};

// Helper function to parse maintenance response
const parseMaintenanceResponse = (apiData) => {
  if (!apiData.paramObjectsMap || !apiData.paramObjectsMap.maintenance) {
    console.warn("No maintenance data found in response");
    return [];
  }

  const maintenance = apiData.paramObjectsMap.maintenance;

  // Check if data array exists
  if (maintenance.data && Array.isArray(maintenance.data)) {
    return maintenance.data.map((item) => ({
      id: item.id?.toString() || `MAINT-${Date.now()}`,
      title: item.title || "Maintenance",
      vehicleId: item.vehicleId?.toString(),
      vehicleName: item.vehicle || "N/A",
      type: item.type || "preventive",
      status: item.status || "pending",
      priority: item.priority || "medium",
      scheduledDate: item.scheduledDate,
      completedDate: item.completedDate,
      odometerReading: item.odometerReading || 0,
      cost: item.totalCost || item.estimatedCost || 0,
      estimatedCost: item.estimatedCost || 0,
      serviceCenter: item.serviceCenter || "N/A",
      mechanic: item.mechanic || "N/A",
      description: item.description || "",
      parts: item.parts || [],
      notes: item.notes || "",
      active: item.active !== undefined ? item.active : true,
      createdBy: item.createdBy || "System",
      branchCode: item.branchCode || "MAIN",
      branchName: item.branchName || "Main Branch",
      orgId: item.orgId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      // For display purposes
      formattedDate: formatDate(item.scheduledDate),
      formattedCompletedDate: formatDate(item.completedDate),
    }));
  }

  console.warn("Maintenance data is not an array:", maintenance);
  return [];
};

// Helper function to parse single maintenance response
const parseSingleMaintenanceResponse = (apiData) => {
  if (!apiData.paramObjectsMap || !apiData.paramObjectsMap.maintenance) {
    return null;
  }

  const maintenance = apiData.paramObjectsMap.maintenance;

  // If it's a single object (not in data array)
  if (maintenance.id) {
    return {
      id: maintenance.id?.toString(),
      title: maintenance.title || "Maintenance",
      vehicleId: maintenance.vehicleId?.toString(),
      vehicleName: maintenance.vehicle || "N/A",
      type: maintenance.type || "preventive",
      status: maintenance.status || "pending",
      priority: maintenance.priority || "medium",
      scheduledDate: maintenance.scheduledDate,
      completedDate: maintenance.completedDate,
      odometerReading: maintenance.odometerReading || 0,
      cost: maintenance.totalCost || maintenance.estimatedCost || 0,
      estimatedCost: maintenance.estimatedCost || 0,
      serviceCenter: maintenance.serviceCenter || "N/A",
      mechanic: maintenance.mechanic || "N/A",
      description: maintenance.description || "",
      parts: maintenance.parts || [],
      notes: maintenance.notes || "",
      active: maintenance.active !== undefined ? maintenance.active : true,
      createdBy: maintenance.createdBy || "System",
      branchCode: maintenance.branchCode || "MAIN",
      branchName: maintenance.branchName || "Main Branch",
      orgId: maintenance.orgId,
    };
  }

  // If it's in data array
  if (
    maintenance.data &&
    Array.isArray(maintenance.data) &&
    maintenance.data.length > 0
  ) {
    const item = maintenance.data[0];
    return {
      id: item.id?.toString(),
      title: item.title || "Maintenance",
      vehicleId: item.vehicleId?.toString(),
      vehicleName: item.vehicle || "N/A",
      type: item.type || "preventive",
      status: item.status || "pending",
      priority: item.priority || "medium",
      scheduledDate: item.scheduledDate,
      completedDate: item.completedDate,
      odometerReading: item.odometerReading || 0,
      cost: item.totalCost || item.estimatedCost || 0,
      estimatedCost: item.estimatedCost || 0,
      serviceCenter: item.serviceCenter || "N/A",
      mechanic: item.mechanic || "N/A",
      description: item.description || "",
      parts: item.parts || [],
      notes: item.notes || "",
      active: item.active !== undefined ? item.active : true,
      createdBy: item.createdBy || "System",
      branchCode: item.branchCode || "MAIN",
      branchName: item.branchName || "Main Branch",
      orgId: item.orgId,
    };
  }

  return null;
};

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch (error) {
    return dateString;
  }
};
