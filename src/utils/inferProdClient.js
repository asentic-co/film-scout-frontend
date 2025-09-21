import { API_ENDPOINTS } from './apiConfig.js';

export const inferProductionData = async (record) => {
  try {
    const response = await fetch(API_ENDPOINTS.INFER_PRODUCTION, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });
    const data = await response.json();
    console.log("inferProductionData API response:", data);
    return data;
  } catch (error) {
    console.error("Error inferring production data:", error);
    return { productionName: "Unknown", record: { company: "Unknown" } };
  }
};