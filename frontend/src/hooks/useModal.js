import { useContext } from "react";
import { ModalContext } from "@/context/Modal";

export default function useModal() {
    const context = useContext(ModalContext);

    return context;
}