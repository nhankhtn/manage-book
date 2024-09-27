"use client";


import { useRef, useState } from "react";

import FormInfoCustomer from "@/components/FormInfoCustomer";
import styles from "./BookSell.module.scss";
import Button from "@/components/Button";


export default function BookSell() {
    const [formInfo, setFormInfo] = useState({
        name: '',
        phone: '',
        email: '',
        address: ''
    })
    const formRef = useRef();
    const [error, setError] = useState();

    const handlePayment = async (e) => {
        try {
            if (formRef.current) {
                await formRef.current.validate();
            }
        } catch (err) {
            setError(err.message);
        }
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
            <div className={styles.info}>
                <FormInfoCustomer ref={formRef} formData={formInfo} onChange={handleChangeForm} className={styles["form-info"]} />
                <div className={styles.left}>
                    <Button>Thêm sách</Button>
                    <div className={styles.price}>
                        Tổng:
                        <strong>150.000 vnđ</strong>
                    </div>
                </div>
            </div>
            <div className={styles.content}>Table</div>
            <div className={styles["wrap-btn"]}>
                <Button>Ghi nợ</Button>
                <Button onClick={handlePayment}>Thanh toán</Button>
            </div>
        </div>
    )
}