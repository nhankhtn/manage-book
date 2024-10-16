import axios from 'axios';

const httpRequest = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const get = async (url, options = {}) => {
    try {
        const response = await httpRequest.get(url, options);
        return response.data;
    } catch (error) {
        throw error;
    }
}