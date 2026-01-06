import apiClient from "./apiClient";

export const vendorRateAPI = {

  createUpdateVendorRate: async (payload) => {
    return await apiClient.put("/api/master/createUpdateVendorRate", payload);
  },

  getAllVendorRate: async ({ count, page, search, orgId }) => {
    return await apiClient.get("/api/master/getVendorRateByOrgId", {
      params: { count, page, search, orgId }
    });
  },

  getVendorRateById: async (id) => {
    return await apiClient.get(`/api/master/getVendorRateById`, {
      params: { id }
    });
  },

   getVendorRate: async ({ orgId }) => {
    return await apiClient.get("/api/master/getVendorRateAndOriginList", {
      params: { orgId }
    })}

};
