import * as httpRequest from '@/utils/httpRequest';

export const getDebtReport = async (params) => {
    try {
        const response = await httpRequest.get('/reports/debt',{
          params
        });
        return response;
    } catch (error) {
        throw error;
    }
}