import { SettingsContext } from "@/context/Settings";
import { useContext } from "react";

export const useStore = () => {
    const { state, setConfig, setUser } = useContext(SettingsContext);

    return { state, setConfig, setUser };
}