"use client";

import { BOOK_FIELDS } from "@/constants";
import { useState } from "react";
import styles from "./BookImport.module.scss"
import useModal from "@/hooks/useModal";
import Table from "@/components/Table";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import FormAddBook from "@/components/FormAddBook/FormAddBook";
export default function BookImport() {
    const [showModalAdd, setShowModalAdd] = useState(false);   
    const [books, setBooks] = useState([
        {
            title: "Harry Potter",
            author: "J.K. Rowling",
            genre: "Fantasy",
            price: 20.00,
            quantity: 5,
        },
        {
            title: "Harry Potter",
            author: "J.K. Rowling",
            genre: "Fantasy",
            price: 20.00,
            quantity: 5,
        },
        {
            title: "Harry Potter",
            author: "J.K. Rowling",
            genre: "Fantasy",
            price: 20.00,
            quantity: 5,
        },
        {
            title: "Harry Potter",
            author: "J.K. Rowling",
            genre: "Fantasy",
            price: 20.00,
            quantity: 5,
        },
        {
            title: "Potter",
            author: "Rowling",
            genre: "Fan",
            price: 25.00,
            quantity: 5,
        },
        {
            title: "Harry",
            author: "J.K.",
            genre: "tasy",
            price: 10.00,
            quantity: 5,
        },
        {
            title: "Harry Potter",
            author: "J.K. Rowling",
            genre: "Fantasy",
            price: 20.00,
            quantity: 5,
        },
        {
            title: "Potter",
            author: "Rowling",
            genre: "Fan",
            price: 25.00,
            quantity: 5,
        },
        {
            title: "Harry",
            author: "J.K.",
            genre: "tasy",
            price: 10.00,
            quantity: 5,
        },
        {
            title: "Harry Potter",
            author: "J.K. Rowling",
            genre: "Fantasy",
            price: 20.00,
            quantity: 5,
        },
        {
            title: "Potter",
            author: "Rowling",
            genre: "Fan",
            price: 25.00,
            quantity: 5,
        },
        {
            title: "Harry",
            author: "J.K.",
            genre: "tasy",
            price: 10.00,
            quantity: 5,
        },
    ]);

    function deleteAt(index) {
        setBooks(preValues => {
            return preValues.filter((value, i) => i !== index);
        }
        );
    }
    return (
        <>
            <div className={styles.container}>
                <div className={styles.title}>
                    Phiếu nhập sách
                </div>
                <div className ={styles.date_add}>
                    <input id="date" type="date"/>
                    <Button onClick={() => setShowModalAdd(true)} >Thêm sách</Button>
                </div>
                <Table data= {books} deleteRow= {deleteAt}  placaeholder="Ngày nhập sách"/>
                <Button style={{
                    marginTop: "40px",
                }} >Hoàn tất</Button>
            </div>
            <Modal show={showModalAdd} onHide={() => setShowModalAdd(false)}>
                <FormAddBook    />
            </Modal>
        </>
    )
}
