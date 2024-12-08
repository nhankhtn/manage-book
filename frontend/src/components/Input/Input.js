"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Input.module.scss';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

export default function Input({ type, className, value, onChange, step = 1, ...passProps }) {
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleUp = () => {
        const newValue = parseInt(inputValue) + parseInt(step);
        setInputValue(newValue);
        if (onChange) onChange(newValue);
    }

    const handleDown = () => {
        const newValue = parseInt(inputValue) - parseInt(step);
        setInputValue(newValue);
        if (onChange) onChange(newValue);
    }

    const handleChange = (e) => {
        let newValue = type === 'checkbox' ? e.target.checked : e.target.value;

        if (type === 'number') {
            newValue = isNaN(newValue) ? 0 : parseFloat(newValue);
        }

        setInputValue(newValue);
        if (onChange) onChange(newValue);
    }

    if (type === 'checkbox') return (
        <div className={`${styles['wrapper-checkbox']} ${className}`}>
            <input
                type="checkbox"
                id="toggle"
                checked={inputValue}
                onChange={handleChange}
                {...passProps} />
            <label htmlFor="toggle" className={styles.switch} />
        </div>
    )

    if (type === 'number') return (
        <div className={`${styles['wrapper-number']} ${className}`}>
            <input
                type='number'
                value={inputValue}
                onChange={handleChange}
                {...passProps}
            />
            <div className={styles['wrap-btn']}>
                <button type='button' title='up' className={styles['btn-up']} onClick={handleUp}>
                    <FontAwesomeIcon icon={faChevronUp} />
                </button>
                <button type='button' title='down' className={styles['btn-down']} onClick={handleDown}>
                    <FontAwesomeIcon icon={faChevronDown} />
                </button>
            </div>
        </div>
    )

    return <input className={className} {...passProps} />
}