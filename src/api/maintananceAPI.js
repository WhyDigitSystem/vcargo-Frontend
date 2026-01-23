import apiClient from "./apiClient";

export const maintananceAPI = {
  // Fetch all maintenance records with pagination
  getAllMaintenance: async (orgId) => {
    try {
      const response = await apiClient.get(
        "/api/maintenance/getAllMaintenanceByOrgId",
        {
          params: { orgId },
        }
      );

      const data = response.data || response;

      if (!data.status) {
        throw new Error(
          data.paramObjectsMap?.message ||
          "Failed to fetch maintenance records"
        );
      }

      return {
        maintenanceRecords: parseMaintenanceResponse(data),
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
      const response = await apiClient.put(
        "/api/maintenance/createUpdateMaintenance",
        maintenanceData
      );

      const data = response.data || response;

      if (!data.status) {
        throw new Error(
          data.paramObjectsMap?.message ||
          "Failed to save maintenance record"
        );
      }

      return {
        success: true,
        data: data.paramObjectsMap?.maintenance,
        message: data.paramObjectsMap?.message || "Operation successful",
      };
    } catch (error) {
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
  if (!apiData?.paramObjectsMap?.maintenance) {
    console.warn("No maintenance data found");
    return [];
  }

  const maintenance = apiData.paramObjectsMap.maintenance;

  // ✅ CASE 1: API returns array (YOUR CURRENT API)
  if (Array.isArray(maintenance)) {
    return maintenance.map((item) => ({
      id: item.id?.toString(),
      title: item.title || "Maintenance",
      vehicleId: item.vehicle?.id?.toString(),
      vehicleName: item.vehicle?.vehicleNumber || "N/A",
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
      active: item.active ?? true,
      createdBy: item.createdBy || "System",
      branchCode: item.branchCode || "",
      branchName: item.branchName || "",
      orgId: item.orgId,
      formattedDate: formatDate(item.scheduledDate),
      formattedCompletedDate: formatDate(item.completedDate),
    }));
  }

  // ✅ CASE 2: Old paginated structure (safety)
  if (maintenance.data && Array.isArray(maintenance.data)) {
    return maintenance.data.map((item) => ({
      id: item.id?.toString(),
      title: item.title || "Maintenance",
      vehicleId: item.vehicle?.id?.toString(),
      vehicleName: item.vehicle?.vehicleNumber || "N/A",
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
      active: item.active ?? true,
      createdBy: item.createdBy || "System",
      branchCode: item.branchCode || "",
      branchName: item.branchName || "",
      orgId: item.orgId,
      formattedDate: formatDate(item.scheduledDate),
      formattedCompletedDate: formatDate(item.completedDate),
    }));
  }

  console.warn("Unexpected maintenance format:", maintenance);
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
