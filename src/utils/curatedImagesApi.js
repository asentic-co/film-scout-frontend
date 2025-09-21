// Utility functions for interacting with the curated images backend API
import { API_ENDPOINTS } from './apiConfig';

export async function addCuratedImage({ url, title, searchPhrase }) {
    const response = await fetch(`${API_ENDPOINTS.CURATED_IMAGES}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, title, searchPhrase })
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to add curated image');
    }
    return response.json();
}

export async function fetchCuratedImages() {
    const response = await fetch(`${API_ENDPOINTS.CURATED_IMAGES}/`);
    if (!response.ok) {
        throw new Error('Failed to fetch curated images');
    }
    return response.json();
}

export async function deleteCuratedImage(id) {
    const response = await fetch(`${API_ENDPOINTS.CURATED_IMAGES}/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Failed to delete curated image');
    }
    return response.json();
}
