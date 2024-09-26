"use client";

import { MENU_ITEMS } from "@/constants";
import styles from "./Sidebar.module.scss";
import Button from "../Button";
import { usePathname } from "next/navigation";

export default function Sidebar({ show }) {
    const pathname = usePathname();

    return <aside className={`${styles.wrapper} ${!show ? styles.hidden : ""}`}>
        <div className={styles["wrapper-menu"]}>
            {MENU_ITEMS.map((item, index) => (
                <Button key={index} active={item.to === pathname} to={item.to} className={styles['menu-item']}>{item.title}</Button>
            ))}
        </div>
    </aside>
}