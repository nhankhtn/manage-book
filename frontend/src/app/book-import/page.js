"use client";

import { BOOK_FIELDS } from "@/constants";
import { useState } from "react";
import styles from "./BookImport.module.scss"
import { updateBooks } from "@/services/updateService";
import Table from "@/components/Table";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import FormAddBook from "@/components/FormAddBook/FormAddBook";
import ModalAlert from "@/components/ModalAlert";
export default function BookImport() {
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [showModalAlert, setShowModalAlert] = useState({
        show: false,
        success: false,
    });
    // err khi chưa thêm sách
    const [err, setErr] = useState(false);
    const [books, setBooks] = useState([
    ]);
    const [loading, setLoading] = useState(false);
    function deleteAt(index) {
        setBooks(preValues => {
            return preValues.filter((value, i) => i !== index);
        }
        );
    }

    async function handleImportBook() {
     
        if(books.length === 0) {
            setErr(true);
            return;
        }
        try{
            setLoading(true);
            const result = await updateBooks(books);
            if(result.message === "Lỗi khi cập nhật sách") {
                setShowModalAlert({
                    show: true,
                    success: false,
                });
            }
            else{
                setShowModalAlert({
                    show: true,
                    success: true,
                });
                setBooks([]);
            }
        }
        catch(error) {
            setShowModalAlert({
                show: true,
                success: false,
            });
        }
        finally {
            setLoading(false);
        }
     
    }
    function handleAdd(book) {
        setBooks(preValues => {
            return [...preValues, book];
        });
        setShowModalAdd(false);
        setErr(false);
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
                <Button onClick={handleImportBook} className={styles.import_btn} disabled={loading} >{loading ? "Loading..." : "Hoàn tất"}</Button>    
                {err && <div className={styles.error}>Vui lòng thêm sách</div>}
            </div>
            <Modal show={showModalAdd} onHide={() => setShowModalAdd(false)}>
                <FormAddBook handleAdd={handleAdd} />
            </Modal>
            <ModalAlert show={showModalAlert.show} success={showModalAlert.success} onHide={() => setShowModalAlert(false)} />
        </>
    )
}
