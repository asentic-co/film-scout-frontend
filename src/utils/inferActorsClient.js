// This file contains functions for inferring lead actors based on data.

import { API_ENDPOINTS } from './apiConfig.js';

export const inferLeadActors = async (productionName, record) => {
  // Combine production name and record data for the backend
  const requestBody = {
    ...record,
    productionName: productionName
  };

  // POST the production record to the backend to infer lead actors
  const response = await fetch(API_ENDPOINTS.INFER_ACTORS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch lead actors");
  }

  const data = await response.json();
  return data.actors || [];
};

// Alias for compatibility with CastingCard.jsx
export const getCastForProduction = async (productionName, productionRecord) => {
  return inferLeadActors(productionName, productionRecord);
};