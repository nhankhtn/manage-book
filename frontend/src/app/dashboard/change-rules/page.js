"use client"
import Button from "@/components/Button";
import styles from "./ChangeRules.module.scss";
import Input from "@/components/Input";
import { useEffect, useState } from "react";
import { useStore } from "@/hooks/useStore";
import useModalAlert from "@/hooks/useModal";
import { updateRules } from "@/services/updateService";

export default function ChangeRules() {
    const { state: { config: initialConfig }, setConfig: updateConfig } = useStore();

    const [config, setConfig] = useState({
        minImportQuantity: 0,
        minStockQuantityBeforeImport: 0,
        maxDebt: 0,
        minStockAfterSale: 0,
        allowOverpayment: true
    });
    const { openModalAlert } = useModalAlert()

    useEffect(() => {
        if (initialConfig) {
            setConfig(initialConfig);
        }
    }, [initialConfig]);
    const handleChange = (name, value) => {
        setConfig(prevConfig => ({
            ...prevConfig,
            [name]: value
        }));
    };
    const handleSubmit = async () => {
        try {
            if (JSON.stringify(config) === JSON.stringify(initialConfig)) {
                console.log("No changes made");
                return;
            }
            await updateRules(Object.fromEntries(
                Object.entries(config).map(([key, value]) => [key, String(value)])
            ));
            updateConfig(config)
            openModalAlert(true)
        } catch (error) {
            console.log(error);
            openModalAlert(false)
        }
    }
    return (<div className={styles.wrapper}>
        <h2 className={styles.heading}>Thay đổi quy định</h2>
        <div className={styles['wrap-item']}>
            <p>Số lượng nhập tối thiểu</p>
            <Input
                type='number'
                value={config.minImportQuantity}
                onChange={(value) => handleChange('minImportQuantity', value)}
            />
        </div>
        <div className={styles['wrap-item']}>
            <p>Lượng tồn tối thiểu trước khi nhập</p>
            <Input
                type='number'
                value={config.minStockQuantityBeforeImport}
                onChange={(value) => handleChange('minStockQuantityBeforeImport', value)}
            />
        </div>
        <div className={styles['wrap-item']}>
            <p>Số tiền nợ tối đa</p>
            <Input
                type='number'
                value={config.maxDebt}
                onChange={(value) => handleChange('maxDebt', value)}
            />
        </div>
        <div className={styles['wrap-item']}>
            <p>Lượng tồn tối thiểu sau khi bán</p>
            <Input
                type='number'
                value={config.minStockAfterSale}
                onChange={(value) => handleChange('minStockAfterSale', value)}
            />
        </div>
        <div className={styles['wrap-item']}>
            <p>Số tiền thu có thể vượt quá số tiền khách hàng đang nợ</p>
            <Input
                type='checkbox'
                checked={config.allowOverpayment === true}
                onChange={(value) => handleChange('allowOverpayment', value)}
                className={styles['wrap-input']}
            />
        </div>
        <div className={styles['wrap-btn']}>
            <Button className={styles['btn-save']} title="Lưu" onClick={handleSubmit}>Lưu thay đổi</Button>
        </div>
    </div>)
}

export function InputToggleSwitch() {
    return <div className={styles.wrap}>
        <input type="checkbox" id="toggle" />
        <label htmlFor="toggle" className={styles.switch} />
    </div >
}