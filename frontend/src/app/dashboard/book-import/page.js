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
import TableBooksError from "@/components/TableBooksError";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay, faWarning} from "@fortawesome/free-solid-svg-icons";

export default function BookImport() {
  const {
    state: { config },
  } = useStore();
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
    showModalDuplicate,
    setShowModalDuplicate,
    duplicateBook,
    addQuantityToExistingBook
  } = useUpdateBooks();
  const [showModalAdd, setShowModalAdd] = useState(false);
  function handleAdd(book) {
    setShowModalAdd(false);
    add(book);
  }
  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>Phiếu nhập sách</div>
        <div className={styles.date_add}>
          <div>
            <input
              id="date"
              type="date"
              value={new Date().toISOString().split("T")[0]}
              disabled
            />
            <span>
              <FontAwesomeIcon icon={faCalendarDay} />
            </span>
          </div>
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
            <h2 className={styles.title}>
            <FontAwesomeIcon className={styles["alert-icon"]} icon={faWarning} />
              Các sách lỗi
            </h2>
            <p className={styles.sub_title}>
              Số lượng tồn lớn hơn {config?.minStockQuantityBeforeImport}
            </p>
          </div>
          <div className={styles.table_err_container}>
            <TableBooksError
              fieldCols={BOOK_ERR}
              data={booksErr}
              placeholder="Sách lỗi"
            />
          </div>
        </div>
      </Modal>

      
      <Modal show={showModalDuplicate} onHide={() => setShowModalDuplicate(false)}>
        <div className={styles.duplicate_container}>
          <h2>Phát hiện sách trùng lặp</h2>
          <div className={styles["modal-content"]}>
            <FontAwesomeIcon className={styles["warn-icon"]} icon={faWarning} />
            <div>
              <h3>Sách đã tồn tại</h3>
              <p> 
                "{duplicateBook.title}" đã tồn tại trong kho với {duplicateBook.currentQuantity} bản sao.
                Bạn có muốn thêm {duplicateBook.quantity} vào số lượng tồn kho hiện tại không?
              </p>
            </div>
          </div>
          <div className={styles["modal-actions"]}>
              <button className={styles["cancel"]} onClick={() => setShowModalDuplicate(false)}>Hủy</button>
              <button className={styles["confirm"]} onClick={() => addQuantityToExistingBook(duplicateBook)}>Cập nhật</button>
            </div>
        </div>
      
      </Modal>
    </>
  );
}
