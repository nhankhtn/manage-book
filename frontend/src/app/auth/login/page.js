'use client'

import { useState } from 'react'
import styles from './Login.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import paths from '@/paths'
import { useStore } from '@/hooks/useStore'

export default function Component() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    const [error, setError] = useState('');
    const router = useRouter();
    const { setUser } = useStore();

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')
        if (!formData.username || !formData.password) {
            setError('Vui lòng nhập đầy đủ thông tin')
            return
        }
        if (formData.username !== 'admin' || formData.password !== 'admin') {
            setError('Tên đăng nhập hoặc mật khẩu không chính xác')
            return
        }
        setUser({
            username: formData.username,
            role: 'admin'
        })

        router.push(paths.dashboard.bookImport);
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <div className={styles.container}>
            <form className={styles.loginForm} onSubmit={handleSubmit}>
                <h1 className={styles.title}>
                    HỆ THỐNG QUẢN LÝ<br />
                    NHÀ SÁCH ABC
                </h1>

                <div className={styles.inputGroup}>
                    <FontAwesomeIcon icon={faUser} className={styles.icon} />
                    <input
                        type="text"
                        name="username"
                        placeholder="Tên đăng nhập"
                        value={formData.username}
                        onChange={handleChange}

                    />
                </div>

                <div className={styles.inputGroup}>
                    <FontAwesomeIcon icon={faLock} className={styles.icon} />
                    <input
                        type="password"
                        name="password"
                        placeholder="Mật khẩu"
                        value={formData.password}
                        onChange={handleChange}

                    />
                </div>

                {error && <p className={styles.error}>{error}</p>}

                <button type="submit" className={styles.submitButton}>
                    Đăng nhập
                </button>
            </form>
        </div>
    )
}