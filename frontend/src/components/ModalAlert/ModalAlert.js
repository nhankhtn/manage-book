"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../Modal";
import styles from "./ModalAlert.module.scss";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";

export default function ModalAlert({ show, success = true, onHide }) {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onHide();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onHide]);

    if (success) return <Modal show={show} onHide={onHide}>
        <div className={`${styles["wrapper-icon"]} ${styles["icon-success"]}`}>
            <FontAwesomeIcon className={styles.icon} icon={faCheck} />
        </div>
        <div className={styles.message}>Thành công</div>
    </Modal>

    return <Modal show={show} onHide={onHide}>
        <div className={`${styles["wrapper-icon"]} ${styles["icon-fail"]}`}>
            <FontAwesomeIcon className={styles.icon} icon={faXmark} />
        </div>
        <div className={styles.message}>Thất bại</div>
    </Modal>
}