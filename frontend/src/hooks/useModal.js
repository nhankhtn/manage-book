import { useContext } from "react";
import { ModalAlertContext } from "@/context/ModalAlert";

export default function useModalAlert() {
    const {
        openModal: openModalAlert,
        hideModal: hideModalAlert
    } = useContext(ModalAlertContext);

    return { openModalAlert, hideModalAlert };
}
