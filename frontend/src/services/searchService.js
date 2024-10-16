import * as httpRequest from '@/utils/httpRequest';

export const searchBooks = async (params) => {
    try {
        const response = await httpRequest.get('/books/search', { params });
        return response;
    } catch (error) {
        throw error;
    }
}