"use client";

import { BOOK_FIELDS } from "@/constants";
import { useState } from "react";
import styles from "./BookImport.module.scss";
import { useUpdateBooks } from "@/hooks/useUpdateBooks";
import Table from "@/components/Table";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import FormAddBook from "@/components/FormAddBook/FormAddBook";
import { useStore } from "@/hooks/useStore";

export default function BookImport() {
    const { state : {config} } = useStore();
    console.log(config);
  const BOOK_ERR = [
    {
      title: "Tên sách",
      name: "title",
      type: "text",
    },
    {
      title: "Số lượng tồn",
      name: "quantity",
      type: "text",
    },
  ];
  const {
    err,
    loading,
    importBook,
    deleteAt,
    add,
    books,
    showModalBooksErr,
    setShowModalBooksErr,
    booksErr,
  } = useUpdateBooks();
  const [showModalAdd, setShowModalAdd] = useState(false);
  function handleAdd(book) {
    add(book);
    setShowModalAdd(false);
  }
  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>Phiếu nhập sách</div>
        <div className={styles.date_add}>
          <input id="date" type="date" />
          <Button onClick={() => setShowModalAdd(true)}>Thêm sách</Button>
        </div>
        <div className={styles.table_container}>
          <Table
            fieldCols={BOOK_FIELDS}
            data={books}
            deleteRow={deleteAt}
            placeholder="Ngày nhập sách"
          />
        </div>
        <Button
          onClick={importBook}
          className={styles.import_btn}
          disabled={loading}
        >
          {loading ? "Loading..." : "Hoàn tất"}
        </Button>
        {err && <div className={styles.error}>Vui lòng thêm sách</div>}
      </div>
      <Modal show={showModalAdd} onHide={() => setShowModalAdd(false)}>
        <FormAddBook handleAdd={handleAdd} />
      </Modal>
      <Modal show={showModalAdd} onHide={() => setShowModalAdd(false)}>
        <FormAddBook handleAdd={handleAdd} />
      </Modal>
      <Modal
        show={showModalBooksErr}
        onHide={() => setShowModalBooksErr(false)}
      >
        <div className={styles.book_err_container}>
            <div className={styles.err_title}>
                <div className={styles.title}>Các sách lỗi</div>
                <div className={styles.sub_title}>Số lượng tồn lớn hơn {config?.minStockQuantityBeforeImport}</div>
            </div>
            <div className={styles.table_err_container}>
                <Table fieldCols={BOOK_ERR} data={booksErr} placeholder="Sách lỗi" />
            </div>
            
        </div>
        
      </Modal>
      {/* <ModalAlert show={showModalAlert.show} success={showModalAlert.success} onHide={() => setShowModalAlert(false)} /> */}
    </>
  );
}
