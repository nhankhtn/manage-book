"use client";
import { createContext } from "react";

const Context = createContext({
    openModal: () => { },
    hideModal: () => { }
});
export default Context;