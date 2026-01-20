import apiClient from "./apiClient";

export const fasttagAPI = {
  getToken: async () => {
    const response = await apiClient.post("/api/fasttag/getToken");
    console.log("Response", response);
    return response;
  },

    getFastagDetails: async (payload) => {
    const response = await apiClient.post(
      "/api/fasttag/fastag",
      payload
    );
    return response;
  },
};
