import * as httpRequest from '@/utils/httpRequest';

export const updateBooks = async (data) => {
    try {
        const response = await httpRequest.put('/books', data);
        const books = response.message;
        const result = books.filter((book) => {
             return book.status==='rejected';
        });
        return result.map((book) => {
            return book.reason.sqlMessage;
        });
    } catch (error) {
        throw error;
    }
}
export const updateRules = async (data) => {
    try {
        const response = await httpRequest.put('/rules', data);
        return response;
    } catch (error) {
        throw error;
    }
}