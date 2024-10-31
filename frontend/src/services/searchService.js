import * as httpRequest from '@/utils/httpRequest';

export const searchBooks = async (params) => {
    try {
        const response = await httpRequest.get('/books', { params });
        return response;
    } catch (error) {
        throw error;
    }
}