import * as httpRequest from '@/utils/httpRequest';

export const updateBooks = async (data) => {
    try {
        const response = await httpRequest.put('/books/update', data);
        return response;
    } catch (error) {
        throw error;
    }
}