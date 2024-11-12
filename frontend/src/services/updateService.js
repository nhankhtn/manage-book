import * as httpRequest from '@/utils/httpRequest';

export const updateBooks = async (data) => {
    try {
        const response = await httpRequest.put('/books', data);
        return response;
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