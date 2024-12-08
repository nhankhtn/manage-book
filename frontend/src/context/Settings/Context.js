"use client";
import { createContext } from "react";

const Context = createContext({
    state: null, setConfig: () => { }, setUser: () => { }
});
export default Context;