import * as httpRequest from '@/utils/httpRequest';

export const getCustomerDB = async (params) => {
    try {
      console.log(params);
        const response = await httpRequest.get('/customers/get-customer',
          params
        );
        return response;
    } catch (error) {
        throw error;
    }
}