import * as httpRequest from '@/utils/httpRequest';

export const getStockReport = async (params) => {
    try {
        const response = await httpRequest.get('/books/stocks/report',{
          params
        });
        return response;
    } catch (error) {
        throw error;
    }
}