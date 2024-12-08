"use client";

import React, { useCallback, useEffect, useReducer, useState } from "react";
import Context from "./Context";
import reducer, { initState } from "./reducer";
import { getRules } from "@/services/getRules";

const Provider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initState);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await getRules();

                const configData = resp.reduce((acc, rule) => {
                    let value;

                    if (!isNaN(Number(rule.rule_value))) {
                        value = Number(rule.rule_value);
                    } else if (rule.rule_value === "true" || rule.rule_value === "false") {
                        value = rule.rule_value === "true";
                    } else {
                        value = rule.rule_value;
                    }

                    acc[rule.rule_name] = value;
                    return acc;
                }, {});
                dispatch({
                    type: "SET_CONFIG", payload: configData
                });
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();

        return () => {
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
