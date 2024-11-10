import styles from "./auth.module.scss"

export default function AuthLayout({
    children,
}) {
    return (
        <div className={styles.container}>
            {children}
        </div>
    );
}