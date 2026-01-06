import apiClient from "./apiClient";

export const indentAPI = {
  createUpdateIndent: async (formData) => {
    return await apiClient.put("/api/master/createUpdateIndents", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  getAllIndentList: async ({ count, page, search = "", orgId }) => {
    return await apiClient.get("/api/master/getIndentsByOrgId", {
      params: { count, page, search, orgId },
    });
  },

  getIndentedById: async (id) => {
    return await apiClient.get("/api/master/getIndentsById", {
      params: { id },
    });
  },
};