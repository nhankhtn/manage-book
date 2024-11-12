import { SET_CONFIG, SET_USER } from "@/constants";

const initState = {
    config: {
        minImportQuantity: 0,
        minStockQuantityBeforeImport: 0,
        maxDebt: 0,
        minStockAfterSale: 0,
        maxDebtCollection: true,
    },
    user: null
}

function reducer(state, action) {
    switch (action.type) {
        case SET_CONFIG:
            return {
                ...state,
                config: action.payload
            }
        case SET_USER:
            return {
                ...state,
                user: action.payload
            }
        default:
            return state;
    }
}

export { initState };
export default reducer;