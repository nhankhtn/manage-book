"use client";
import { useCallback, useState } from "react";

import styles from "./BookSearch.module.scss";
import Button from "@/components/Button";
import Table from "@/components/Table";
import { SEARCH_BOOK_FIELDS } from "@/constants";
import FormInfoBook from "@/components/FormInfoBook";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSearchBooks } from "@/hooks/useSearchBooks";

export default function BookSearch() {
    const { books, error, isLoading, handleSearch } = useSearchBooks();
    const [formInfo, setFormInfo] = useState({
        title: '',
        author: '',
        category: '',
        price: ''
    });

    const handleChangeForm = useCallback((e) => {
        const { name, value } = e.target;
        setFormInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    return (
        <div className={styles.wrapper}>
            <div className={styles.info}>
                <FormInfoBook formData={formInfo} onChange={handleChangeForm} className={styles["form-info"]} />
                <div className={styles.left}>
                    <Button title="Tra cứu" onClick={e => handleSearch(formInfo)}>Tra cứu</Button>
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