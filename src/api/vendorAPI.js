import apiClient from "./apiClient";

export const vendorAPI = {
  createUpdateVendor: async (payload) => {
    return await apiClient.put("/api/vendor/createUpdateVendor", payload);
  },

  getAllVendor: async ({ count, page, search, orgId }) => {
    return await apiClient.get("/api/vendor/getVendorByOrgId", {
      params: { count, page, search, orgId },
    });
  },

  getVendorById: async (id) => {
    return await apiClient.get(`/api/vendor/getVendorById`, {
      params: { id },
    });
  },

  uploadVendorDocuments: async (formData) => {
    return await apiClient.post("/api/vendor/uploadVendorDocuments", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  getVendorName: async ({orgId}) => {
    return await apiClient.get("/api/vendor/getOrganizationAndCodeList", {
      params: { orgId },
    });
  },
};
