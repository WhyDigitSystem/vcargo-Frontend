import apiClient from "./apiClient";

export const quoteAPI = {
  createUpdateQuote: async (payload) => {
    return await apiClient.put("/api/transaction/createUpdateQuote", payload);
  },

  getAllQuotesList: async ({ count, page, userId, search = "" }) => {
    return await apiClient.get("/api/transaction/getQuoteByOrgId", {
      params: { count, page, userId, search },
    });
  },

  getQuotesListByUser: async ({ count, page, userId, search = "" }) => {
    return await apiClient.get("/api/transaction/getUserAuctionsQuoteByOrgId", {
      params: { count, page, userId, search },
    });
  },

  getQuoteById: async (id) => {
    return await apiClient.get("/api/transaction/getQuoteById", {
      params: { id },
    });
  },

   getQuotesByUserId: async ({ count, page, userId, search = "" }) => {
    return await apiClient.get("/api/transaction/getQuoteByUserId", {
      params: { count, page, userId, search },
    });
  },

  // ⭐ NEW API — Approve Quote
  createApprovalQuote: async ({ action, actionBy, auctionId, quotesId }) => {
    return await apiClient.put(
      "/api/transaction/createApprovalQuote",
      null,
      {
        params: {
          action,
          actionBy,
          auctionId,
          quotesId,
        },
      }
    );
  },
};
