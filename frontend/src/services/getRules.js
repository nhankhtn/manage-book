import * as httpRequest from '@/utils/httpRequest';

export const getRules = async () => {
    try {
        const response = await httpRequest.get('/rules');
        return response;
    } catch (error) {
        throw error;
    }
}