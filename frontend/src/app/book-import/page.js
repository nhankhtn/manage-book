"use client";

import { useState } from "react";
import styles from "./BookImport.module.scss"
import useModal from "@/hooks/useModal";
import Table from "@/components/Table";
import Button from "@/components/Button";
export default function BookImport() {
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
        }
    ]);

    function deleteAt(index) {
        console.log(books.length);
        setBooks(preValues => {
            return preValues.filter((value, i) => i !== index);
        }
        );
    }
    return (
    <div className={styles.container}>
        <div className={styles.title}>
            Phiếu nhập sách
        </div>
        <div className ={styles.date_add}>
            <input id="date" type="date"/>
            <Button>Thêm sách</Button>
        </div>
        <Table data= {books} Delete= {deleteAt}/>
        <Button style={{
            marginTop: "40px",
        }}>Hoàn tất</Button>
    </div>)
}
