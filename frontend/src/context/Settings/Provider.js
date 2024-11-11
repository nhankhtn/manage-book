"use client";

import React, { useEffect, useReducer, useState } from "react";
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

    return (
        <Context.Provider value={{ state, dispatch }}>
            {children}
        </Context.Provider>
    );
};
export default Provider;
