import { API_ENDPOINTS } from './apiConfig.js';

export async function fetchActorImage(actorName) {
  try {
    const res = await fetch(API_ENDPOINTS.ACTOR_IMAGE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actorName }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.url || null;
  } catch (error) {
    console.error(`Failed to fetch image for ${actorName}:`, error);
    return null;
  }
}