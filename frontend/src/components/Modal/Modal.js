import { useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Modal.module.scss";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

export default function Modal({ show, success = true, onHide }) {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onHide();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onHide]);

    if (!show) return null;

    return <div className={styles.overlay}>
        <div className={styles.content}>
            <button type="button" title="Close" className={styles["btn-close"]} onClick={onHide}>
                <span>&times;</span>
            </button>
            {
                success ?
                    <>
                        <div className={`${styles["wrapper-icon"]} ${styles["icon-success"]}`}>
                            <FontAwesomeIcon className={styles.icon} icon={faCheck} />
                        </div>
                        <div className={styles.message}>Successfully</div>
                    </> :
                    <>
                        <div className={`${styles["wrapper-icon"]} ${styles["icon-fail"]}`}>
                            <FontAwesomeIcon className={styles.icon} icon={faXmark} />
                        </div>
                        <div className={styles.message}>Fail</div>
                    </>
            }
        </div>
    </div>
}