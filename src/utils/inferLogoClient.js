import { API_ENDPOINTS } from './apiConfig.js';

export async function fetchCompanyLogo(companyName) {
  try {
    const res = await fetch(API_ENDPOINTS.COMPANY_LOGO, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyName }),
    });
    const data = await res.json();
    return data.url || null;
  } catch {
    return null;
  }
}