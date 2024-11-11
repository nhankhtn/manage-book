"use client";

import { BOOK_FIELDS } from "@/constants";
import { useState } from "react";
import styles from "./BookImport.module.scss"
import {  useUpdateBooks } from "@/hooks/useUpdateBooks";
import Table from "@/components/Table";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import FormAddBook from "@/components/FormAddBook/FormAddBook";

export default function BookImport() {

    const {err, loading, importBook, deleteAt, add, books } = useUpdateBooks();
    const [showModalAdd, setShowModalAdd] = useState(false);
    function handleAdd(book) {
        add(book);
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
                <div className={styles.table_container}>
                    <Table fieldCols={BOOK_FIELDS} data={books} deleteRow={deleteAt} placeholder="Ngày nhập sách" />
                </div>
                
                <Button onClick={importBook} className={styles.import_btn} disabled={loading} >{loading ? "Loading..." : "Hoàn tất"}</Button>    
                {err && <div className={styles.error}>Vui lòng thêm sách</div>}
            </div>
            <Modal show={showModalAdd} onHide={() => setShowModalAdd(false)}>
                <FormAddBook handleAdd={handleAdd} />
            </Modal>
            {/* <ModalAlert show={showModalAlert.show} success={showModalAlert.success} onHide={() => setShowModalAlert(false)} /> */}
        </>
    )
}
