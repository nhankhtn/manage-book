import * as httpRequest from '@/utils/httpRequest';

export const createInvoice = async (data) => {
    try {
        const response = await httpRequest.post('/customers/pay-invoice', data);
        return response;
    } catch (error) {
        throw error;
    }
}
export const createDebt = async (data) => {
    try {
        const response = await httpRequest.post('/customers/pay-debt', data);
        return response;
    } catch (error) {
        throw error;
    }
}
export const createPaymentReceipt = async (data) => {
    try {
        const response = await httpRequest.post('/customers/payment', data);
        return response;
    } catch (error) {
        throw error;
    }
}