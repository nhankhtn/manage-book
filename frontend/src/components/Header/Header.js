"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Header.module.scss";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export default function Header({ show, toggleSidebar }) {
    const handleClick = () => {
        toggleSidebar();
    }

    return <header className={styles.wrapper}>
        {!show && <button type="button" onClick={handleClick} title="Menu" className={styles['btn-menu']}>
            <FontAwesomeIcon icon={faBars} />
        </button>}
        <h1 className={styles.heading}>NHÀ SÁCH ABC</h1>
    </header>
}