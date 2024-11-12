"use client";

import React, { useCallback, useEffect, useReducer, useState } from "react";
import Context from "./Context";
import reducer, { initState } from "./reducer";
import { getRules } from "@/services/getRules";

const Provider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initState);

    useEffect(async () => {
        try {
            const resp = await getRules();
        } catch (error) {
            console.log(error);
        }
    }, []);

    const setConfig = useCallback((config) => {
        dispatch({ type: "SET_CONFIG", payload: config });
    }, []);

    const setUser = useCallback((user) => {
        dispatch({ type: "SET_USER", payload: user });
    }, []);

    return (
        <Context.Provider value={{ state, setConfig, setUser }}>
            {children}
        </Context.Provider>
    );
};
export default Provider;
