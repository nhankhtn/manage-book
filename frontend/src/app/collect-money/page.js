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
    const dateInputRef = useRef();
    const latestInvoiceInputRef = useRef();
    const debtInputRef = useRef();
    const moneyCollectedInputRef = useRef();

    const handleClickWrapBtn = (inputRef) => {
        inputRef?.current.focus();
    }

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
                        onClick={e => handleClickWrapBtn(dateInputRef)}
                        data-label="Ngày thu tiền:"
                    >
                        <input
                            ref={dateInputRef}
                            type="date"
                            title="Ngày thu tiền"
                            className={styles["collection-date"]}
                        />
                    </div>
                    <div
                        className={`${styles['wrap-input']} ${styles['input-money']}`}
                        data-label="Hoá đơn mới nhất:"
                        onClick={e => handleClickWrapBtn(latestInvoiceInputRef)}
                    >
                        <input
                            ref={latestInvoiceInputRef}
                            type="number"
                            title="Hoá đơn mới nhất"
                        />
                    </div>
                    <div
                        className={`${styles['wrap-input']} ${styles['input-money']}`}
                        data-label="Tiền nợ:"
                        onClick={e => handleClickWrapBtn(debtInputRef)}
                    >
                        <input
                            ref={debtInputRef}
                            type="number"
                            title="Tiền nợ"
                        />
                    </div>
                </div>
            </div>
            <div className={styles['money-collect']}>
                <div
                    className={`${styles['wrap-input']} ${styles['input-money']}`}
                    data-label="Số tiền thu:"
                    onClick={e => handleClickWrapBtn(moneyCollectedInputRef)}
                >
                    <input
                        ref={moneyCollectedInputRef}
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