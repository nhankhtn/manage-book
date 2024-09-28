"use client";


import { useState } from "react";

import styles from "./BookSearch.module.scss";
import Button from "@/components/Button";
import Table from "@/components/Table";
import { SEARCH_BOOK_FIELDS } from "@/constants";
import FormInfoBook from "@/components/FormInfoBook";
import { faL, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function BookSearch() {
    const [books, setBooks] = useState([
        {
            title: "Harry Potter",
            author: "J.K. Rowling",
            genre: "Fantasy",
            price: 20.00,
            available: 20
        },
        {
            title: "Harry Potter",
            author: "J.K. Rowling",
            genre: "Fantasy",
            price: 20.00,
            available: 20
        },
        {
            title: "Harry Potter",
            author: "J.K. Rowling",
            genre: "Fantasy",
            price: 20.00,
            available: 20
        },
        {
            title: "Harry Potter",
            author: "J.K. Rowling",
            genre: "Fantasy",
            price: 20.00,
            available: 20
        },

    ]);
    const [formInfo, setFormInfo] = useState({
        title: '',
        author: '',
        genre: '',
        available: ''
    })
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const handleChangeForm = (e) => {
        const { name, value } = e.target;
        setFormInfo(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handSearch = () => {
        if (!formInfo.title && !formInfo.author && !formInfo.genre && !formInfo.available) {
            setError("Vui lòng điền ít nhất một thông tin sách")
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            // fetch API ....
            setError('');
            setIsLoading(false);
        }, 3000)
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.info}>
                <FormInfoBook formData={formInfo} onChange={handleChangeForm} className={styles["form-info"]} />
                <div className={styles.left}>
                    <Button title="Tra cứu" onClick={handSearch}>Tra cứu</Button>
                    {isLoading && (
                        <FontAwesomeIcon className={styles.loading} icon={faSpinner} />
                    )}
                    {error && <div className={styles.message}>
                        {error}
                    </div>}
                </div>
            </div>
            <div className={styles.content}>
                <Table data={books} fieldCols={SEARCH_BOOK_FIELDS} />
            </div>
        </div>
    )
}