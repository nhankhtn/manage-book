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

export const post = async (url, data, options = {}) => {
    try {
        const response = await httpRequest.post(url, data, options);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const put = async (url, data, options = {}) => {
    try {
        const response = await httpRequest.put(url, data, options);
        return response.data;
    } catch (error) {
        throw error;
    }
}