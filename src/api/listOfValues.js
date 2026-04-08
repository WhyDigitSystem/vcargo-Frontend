import apiClient from "./apiClient";

export const listOfValuesAPI = {

  createUpdateListOfValues: async (payload) => {
    return await apiClient.put("/api/master/updateCreateListOfValues", payload);
  },

  getAllListOfValues: async ({ orgid }) => {
    return await apiClient.get("/api/master/getListOfValuesByOrgId", {
      params: { orgid }
    });
  },

  getListDescription: async ({ orgId, listDescription }) => {
    return await apiClient.get("/api/master/getValueDescriptionByListOfValues", {
      params: { orgId, listDescription }
    });
  },

  getListOfValuesById: async (id) => {
    return await apiClient.get(`/api/master/getListOfValuesById`, {
      params: { id }
    });
  },

};
