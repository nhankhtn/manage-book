"use client"
import Button from "@/components/Button";
import styles from "./ChangeRules.module.scss";
import Input from "@/components/Input";
import { useState } from "react";


export default function ChangeRules() {
    const [value, setValue] = useState(150);

    const handelChange = (value) => {
        setValue(value);
    }

    return (<div className={styles.wrapper}>
        <h2 className={styles.heading}>Thay đổi quy định</h2>
        <div className={styles['wrap-item']}>
            <p>Số lượng nhập tối thiểu</p>
            <Input type='number' value={value} onChange={handelChange} />
        </div>
        <div className={styles['wrap-item']}>
            <p>Lượng tồn tối thiểu trước khi nhập</p>
            <Input type='number' defaultValue={200} />
        </div>
        <div className={styles['wrap-item']}>
            <p>Số tiền nợ tối đa</p>
            <Input type='number' defaultValue={200} />
        </div>
        <div className={styles['wrap-item']}>
            <p>Lượng tồn tối thiểu sau khi bán</p>
            <Input type='number' defaultValue={200} />
        </div>
        <div className={styles['wrap-item']}>
            <p>Số tiền thu không vượt quá số tiền khách hàng đang nợ</p>
            <Input type='checkbox' className={styles['wrap-input']} />
        </div>
        <div className={styles['wrap-btn']}>
            <Button className={styles['btn-save']} title="Lưu">Lưu thay đổi</Button>
        </div>
    </div>)
}

export function InputToggleSwitch() {
    return <div className={styles.wrap}>
        <input type="checkbox" id="toggle" />
        <label htmlFor="toggle" className={styles.switch} />
    </div >
}