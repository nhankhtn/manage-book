"use client";

import { MENU_ITEMS } from "@/constants";
import styles from "./Sidebar.module.scss";
import Button from "../Button";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useStore } from "@/hooks/useStore";

export default function Sidebar({ show }) {
    const pathname = usePathname();
    const { setUser } = useStore()

    return <aside className={`${styles.wrapper} ${!show ? styles.hidden : ""}`}>
        <div className={styles.heading}>
            <FontAwesomeIcon className={styles.avatar} icon={faUser} />
            <span className={styles.quote}>Xin chào,</span>
            <p className={styles.role}>Người quản lí</p>
        </div>
        <div className={styles["wrapper-menu"]}>
            {MENU_ITEMS.map((item, index) => (
                <Button key={index} active={item.to === pathname} to={item.to} className={styles['menu-item']}>{item.title}</Button>
            ))}
        </div>
        <div className={styles.footing}>
            <div className={styles['wrap-btn']}>
                <button type="button" title="Đăng xuất" onClick={() => setUser(null)} className={styles['btn-logout']}>
                    <FontAwesomeIcon className={styles['btn-icon']} icon={faRightFromBracket} />
                </button>
                <button type="button" title="Cài đặt">
                    <FontAwesomeIcon className={styles['btn-icon']} icon={faGear} />
                </button>
            </div>
        </div>
    </aside>
}