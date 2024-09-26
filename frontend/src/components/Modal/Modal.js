import { useEffect } from "react";

import styles from "./Modal.module.scss";


export default function Modal({ show, onHide, children, className }) {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onHide();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onHide]);

    const classes = `${styles.content} ${className}`

    if (!show) return null;

    return <div className={styles.overlay}>
        <div className={classes}>
            <button type="button" title="Close" className={styles["btn-close"]} onClick={onHide}>
                <span>&times;</span>
            </button>
            {children}
        </div>
    </div>
}