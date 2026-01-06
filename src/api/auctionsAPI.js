import apiClient from "./apiClient";

export const auctionsAPI = {
  createUpdateAuctions: async (payload) => {
    return await apiClient.put(
      "/api/transaction/createUpdateAuctions",
      payload,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  },

  getAllAuctionsList: async ({ count, page, search = "", orgId }) => {
    return await apiClient.get("/api/transaction/getAuctionsByOrgId", {
      params: { count, page, search, orgId },
    });
  },

  getAuctionsReportList: async ({ count, page, userId, search = "" }) => {
    return await apiClient.get("/api/transaction/getAuctionsReportByOrgId", {
      params: { count, page, search, userId },
    });
  },

  getAuctionsReport: async ({ count, page, orgId }) => {
    return await apiClient.get("/api/transaction/getAuctionReportByOrgId", {
      params: { count, page, orgId },
    });
  },

  getAuctionsById: async (id) => {
    return await apiClient.get("/api/transaction/getAuctionsById", {
      params: { id },
    });
  },
};
