"use client";

import React, { useEffect, useReducer, useState } from "react";
import Context from "./Context";
import reducer, { initState } from "./reducer";

const Provider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initState);

    useEffect(() => {

    }, []);

    return (
        <Context.Provider value={{ openModal, hideModal }}>
            {children}
        </Context.Provider>
    );
};
export default Provider;
