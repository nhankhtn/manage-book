
import { SET_CONFIG } from "~/constants";

export const setTheme = payload => {
    return {
        type: SET_CONFIG,
        payload
    };
}

