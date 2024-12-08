
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { object, string } from "yup";
import styles from "./FormInfoCustomer.module.scss";

const phone_PATTERN = /^(\+?\d{1,3}[- ]?)?\d{10}$/

const FormInfoCustomer = ({ formData, onChange, className }, ref) => {
    const [errors, setErrors] = useState({});

    let userSchema = object({
        name: string().required("Bạn chưa điền tên"),
        phone: string()
            .matches(phone_PATTERN, 'Số điện thoại không hợp lệ')
            .required("Vui lòng điền số điện thoại"),
        email: string().email('Địa chỉ email không hợp lệ'),
        address: string()
    })

    const validate = async () => {
        try {
            await userSchema.validate(formData, { abortEarly: false });
            setErrors({});
        } catch (validationErrors) {
            const formattedErrors = {};
            validationErrors.inner.forEach(error => {
                formattedErrors[error.path] = error.message;
            });
            setErrors(formattedErrors);
            throw Error("Info error")
        }
    };

    useImperativeHandle(ref, () => ({
        validate
    }));

    return <div className={`${styles.wrapper} ${className}`}>
        <h2 className={styles.heading}>Thông tin khách hàng</h2>
        <div className={styles["form-item"]}>
            <div className={styles["info-main"]}>
                <div className={styles["form-item"]}>
                    <label htmlFor="name">Tên khách hàng</label>
                    <input type="text" name="name" id="name" title="Tên khách hàng" value={formData.name} onChange={onChange} />
                </div>
                <div className={styles["form-item"]}>
                    <label htmlFor="phone">Số điện thoại</label>
                    <input type="text" name="phone" id="phone" title="Số điện thoại" value={formData.phone} onChange={onChange} />
                </div>
            </div>
            {(errors?.name || errors?.phone) && <span className={styles.message}>{errors?.name || errors?.phone}</span>}
        </div>
        <div className={styles["form-item"]}>
            <label htmlFor="email">Email</label>
            <input type="text" name="email" id="email" title="Email" value={formData.email} onChange={onChange} />
            {errors.email && <span className={styles.message}>{errors.email}</span>}
        </div>
        <div className={styles["form-item"]}>
            <label htmlFor="address">Địa chỉ</label>
            <input type="text" name="address" id="address" title="Địa chỉ" value={formData.address} onChange={onChange} />
            {errors.address && <span className={styles.message}>{errors.address}</span>}
        </div>
    </div>
}
export default React.memo(forwardRef(FormInfoCustomer));
