"use client";

import FormInfoCustomer from "@/components/FormInfoCustomer";
import styles from "./CollectMoney.module.scss";
import Button from "@/components/Button";
import { useRef, useState } from "react";

export default function CollectMoney() {
    const [formInfo, setFormInfo] = useState({
        name: '',
        phone: '',
        email: '',
        address: ''
    })
    const formRef = useRef();

    const handleChangeForm = (e) => {
        const { name, value } = e.target;
        setFormInfo(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <FormInfoCustomer
                    ref={formRef}
                    formData={formInfo}
                    onChange={handleChangeForm}
                    className={styles["form-info"]}
                />
                <div className={styles["info-invoice"]}>
                    <div
                        className={styles['wrap-input']}
                    >
                        <label htmlFor="collection-date">Ngày thu tiền:</label>
                        <input
                            type="date"
                            id="collection-date"
                            name="collection-date"
                            title="Ngày thu tiền"
                        />
                    </div>
                    <div
                        className={`${styles['wrap-input']} ${styles['input-money']}`}
                    >
                        <label htmlFor="latest-invoice">Hoá đơn mới nhất:</label>
                        <input
                            type="number"
                            id="latest-invoice"
                            name="latest-invoice"
                            title="Hoá đơn mới nhất"
                        />
                    </div>
                    <div
                        className={`${styles['wrap-input']} ${styles['input-money']}`}
                    >
                        <label htmlFor="debt">Tiền nợ:</label>
                        <input
                            type="number"
                            id="debt"
                            name="debt"
                            title="Tiền nợ"
                        />
                    </div>
                </div>
            </div>
            <div className={styles['money-collect']}>
                <div
                    className={`${styles['wrap-input']} ${styles['input-money']}`}
                >
                    <label htmlFor="money-collected">Số tiền thu:</label>
                    <input
                        id="money-collected"
                        name="money-collected"
                        type="number"
                        title="Số tiền thu"
                    />
                </div>
            </div>
            <div className={styles['wrap-btn']}>
                <Button title="In phiéu">In phiếu</Button>
            </div>
        </div >
    )
}