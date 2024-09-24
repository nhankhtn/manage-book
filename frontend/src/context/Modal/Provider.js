"use client";

import React, { useState } from "react";
import Modal from "@/components/Modal";
import Context from "./Context";

const Provider = ({ children }) => {
    const [isOpenModal, setOpenModal] = useState();
    const [successModal, setSuccessModal] = useState(true);

    const openModal = (success) => {
        setSuccessModal(success)
        setOpenModal(true);
    }

    const hideModal = () => {
        setOpenModal(false);
    }

    return (
        <Context.Provider value={{ openModal, hideModal }}>
            {children}
            <Modal show={isOpenModal} success={successModal} onHide={hideModal} />
        </Context.Provider>
    );
};
export default Provider;
