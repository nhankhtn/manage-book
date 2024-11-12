"use client";


import { useRef, useState } from "react";

import FormInfoCustomer from "@/components/FormInfoCustomer";
import styles from "./BookSell.module.scss";
import Button from "@/components/Button";
import Table from "@/components/Table";
import { date } from "yup";
import { BOOK_FIELDS, SELL_BOOK_FIELDS } from "@/constants";
import Modal from "@/components/Modal";

export default function BookSell() {
    const [books, setBooks] = useState([
        {
            title: "Harry Potter",
            author: "J.K. Rowling",
            category: "Fantasy",
            price: 20.00,
            quantity: 5,
            available: 20
        },
        {
            title: "Harry Potter",
            author: "J.K. Rowling",
            category: "Fantasy",
            price: 20.00,
            quantity: 5,
            available: 20
        },
        {
            title: "Harry Potter",
            author: "J.K. Rowling",
            category: "Fantasy",
            price: 20.00,
            quantity: 5,
            available: 20
        },
        {
            title: "Harry Potter",
            author: "J.K. Rowling",
            category: "Fantasy",
            price: 20.00,
            quantity: 5,
            available: 20
        },
        {
            title: "Harry Potter",
            author: "J.K. Rowling",
            category: "Fantasy",
            price: 20.00,
            quantity: 5,
            available: 20
        },
        {
            title: "Harry Potter",
            author: "J.K. Rowling",
            category: "Fantasy",
            price: 20.00,
            quantity: 5,
            available: 20
        },
        {
            title: "Harry Potter",
            author: "J.K. Rowling",
            category: "Fantasy",
            price: 20.00,
            quantity: 5,
            available: 20
        },
        {
            title: "Harry Potter",
            author: "J.K. Rowling",
            category: "Fantasy",
            price: 20.00,
            quantity: 5,
            available: 20
        },
        {
            title: "Harry Potter",
            author: "J.K. Rowling",
            category: "Fantasy",
            price: 20.00,
            quantity: 5,
            available: 20
        },

    ]);
    const [formInfo, setFormInfo] = useState({
        name: '',
        phone: '',
        email: '',
        address: ''
    })
    const formRef = useRef();
    const [error, setError] = useState();
    const [openModalAddBook, setOpenModalAddBook] = useState(false);

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
    function deleteAt(index) {
        setBooks(preValues => {
            return preValues.filter((value, i) => i !== index);
        }
        );
    }
    return (
        <div className={styles.wrapper}>
            <div className={styles.info}>
                <FormInfoCustomer ref={formRef} formData={formInfo} onChange={handleChangeForm} className={styles["form-info"]} />
                <div className={styles.left}>
                    <Button title="Thêm sách" onClick={e => setOpenModalAddBook(true)}>Thêm sách</Button>
                    <div className={styles.price}>
                        Tổng:
                        <strong>150.000 vnđ</strong>
                    </div>
                </div>
            </div>
            <div className={styles.content}>
                <Table data={books} fieldCols={BOOK_FIELDS} deleteRow={deleteAt} />
            </div>
            <div className={styles["wrap-btn"]}>
                <Button>Ghi nợ</Button>
                <Button onClick={handlePayment}>Thanh toán</Button>
            </div>
            <Modal show={openModalAddBook} onHide={e => setOpenModalAddBook(false)}>
                <div className={styles['wrapper-content-modal']}>
                    <h2 className={styles['heading-modal']}>Thêm sách</h2>
                    <div className={styles['list-books']}>
                        <Table data={books} fieldCols={SELL_BOOK_FIELDS} deleteRow={deleteAt} />
                    </div>
                    <div className={styles["btn-modal"]} >
                        <Button onClick={e => setOpenModalAddBook(false)} title="Đóng" outline>Đóng</Button>
                        <Button title="Thêm sách">Thêm</Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}