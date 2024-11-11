
import { SET_CONFIG } from "~/constants";

export const setConfig = payload => {
    return {
        type: SET_CONFIG,
        payload
    };
}

