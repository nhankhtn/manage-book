"use client";

import { BOOK_FIELDS } from "@/constants";
import { useState } from "react";
import styles from "./BookImport.module.scss"
import { updateBooks } from "@/services/updateService";
import Table from "@/components/Table";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import FormAddBook from "@/components/FormAddBook/FormAddBook";
export default function BookImport() {


    const [showModalAdd, setShowModalAdd] = useState(false);
    const [books, setBooks] = useState([
    ]);

    function deleteAt(index) {
        setBooks(preValues => {
            return preValues.filter((value, i) => i !== index);
        }
        );
    }

    async function handleImportBook() {
        const result = await updateBooks(books);
        console.log(result);
    }
    function handleAdd(book) {
        setBooks(preValues => {
            return [...preValues, book];
        });
        setShowModalAdd(false);
    }
    return (
        <>
            <div className={styles.container}>
                <div className={styles.title}>
                    Phiếu nhập sách
                </div>
                <div className={styles.date_add}>
                    <input id="date" type="date" />
                    <Button onClick={() => setShowModalAdd(true)} >Thêm sách</Button>
                </div>
                <Table fieldCols={BOOK_FIELDS} data={books} deleteRow={deleteAt} placeholder="Ngày nhập sách" />
                <Button onClick={handleImportBook} style={{
                    marginTop: "40px",
                }} >Hoàn tất</Button>
            </div>
            <Modal show={showModalAdd} onHide={() => setShowModalAdd(false)}>
                <FormAddBook handleAdd={handleAdd}/>
            </Modal>
        </>
    )
}
