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


export const selectFragrance = async (fragrance: Fragrance): Promise<void> => {
    try {
        const response = await fetch('http://localhost:3001/search/select', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                itemId: fragrance.id 
            }),
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log('Selection successful:', data);
    } catch (error) {
        console.error('Error selecting fragrance:', error);
        throw error; 
    }
};

