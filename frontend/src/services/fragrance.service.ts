import { Fragrance } from "../types";

const API_BASE_URL = "http://localhost:3001";

export const searchFragrances = async(query: string): Promise<Fragrance[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({query})
        });

        if (!response.ok) {
            throw new Error('Search request failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Error searching fragrances:', error);
        throw error;
    }
}

export const selectFragrance = async (itemId: string): Promise<{url: string}> => {
    try {
        const response = await fetch(`${API_BASE_URL}/select`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
        
            },
            body: JSON.stringify({itemId}),
        });

        if (!response.ok) {
            throw new Error('Selection request failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Error selecting fragrance', error);
        throw error;
    }
}