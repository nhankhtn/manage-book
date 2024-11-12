"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import FormInfoCustomer from "@/components/FormInfoCustomer";
import styles from "./BookSell.module.scss";
import Button from "@/components/Button";
import Table from "@/components/Table";
import { date } from "yup";
import { BOOK_FIELDS, SELL_BOOK_FIELDS } from "@/constants";
import Modal from "@/components/Modal";
import { searchBooks } from "@/services/searchService";
import { formatCurrency } from "@/utils/formatNumber";
import { useStore } from "@/hooks/useStore";

export default function BookSell() {
    const [booksAvailable, setBooksAvailable] = useState([]);
    const [books, setBooks] = useState([]);
    const { state: { config: { minStockAfterSale } } } = useStore();

    const [formInfo, setFormInfo] = useState({
        name: '',
        phone: '',
        email: '',
        address: ''
    })
    const formRef = useRef();
    const [error, setError] = useState();
    const [errorAddBooks, setErrorAddBooks] = useState();
    const [openModalAddBook, setOpenModalAddBook] = useState(false);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const resp = await searchBooks();
                resp.data.forEach(book => {
                    book.amount = 0;
                });

                setBooksAvailable(resp.data);
            } catch (error) {
                console.log(error.message);
            } finally {
            }
        }
        fetchBooks();
    }, [])

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
        });
        const bookToDelete = books[index];
        setBooksAvailable(prevBooks => {
            return prevBooks.map(book => {
                if (book.title === bookToDelete.title) {
                    book.quantity += bookToDelete.amount;
                }
                return book;
            });
        });
    }

    const handleAddBooks = () => {
        if (booksAvailable.some(book => book.amount > book.quantity)) {
            setErrorAddBooks('Số lượng sách không đủ');
            return;
        }
        console.log(booksAvailable);
        if (booksAvailable.some(book => book.quantity < minStockAfterSale && book.amount > 0)) {
            setErrorAddBooks(`Số lượng sách còn lại không được vượt quá ${minStockAfterSale}`);
            return;
        }

        setErrorAddBooks('');
        setBooks(prevBooks => {
            const newBooks = booksAvailable
                .filter(book => book.amount > 0)
                .map(book => ({ ...book }));

            return prevBooks.map(book => {
                const newBook = newBooks.find(nb => nb.title === book.title);
                if (newBook) {
                    return { ...book, amount: book.amount + newBook.amount };
                }
                return book;
            }).concat(
                newBooks.filter(newBook => !prevBooks.some(book => book.title === newBook.title))
            );
        });
        setBooksAvailable(preValues => {
            return preValues.map(book => {
                book.quantity -= book.amount;
                return book;
            })
        })

        setOpenModalAddBook(false);
    }

    const handleOpenModalAddBook = () => {
        setBooksAvailable(preValues => {
            return preValues.map(book => {
                book.amount = 0;
                return book;
            })
        })
        setOpenModalAddBook(true);
    }

    const handleUpdateRow = (indexRow, key, value) => {
        setBooksAvailable(preValues => {
            return preValues.map((book, index) => {
                if (index === indexRow) {
                    book[key] = value;
                }
                return book;
            })
        })
    }

    const totalPrice = useMemo(() => {
        return books.reduce((total, book) => total + book.amount * book.price, 0);
    }, [books])

    return (
        <div className={styles.wrapper}>
            <div className={styles.info}>
                <FormInfoCustomer ref={formRef} formData={formInfo} onChange={handleChangeForm} className={styles["form-info"]} />
                <div className={styles.left}>
                    <Button title="Thêm sách" onClick={handleOpenModalAddBook}>Thêm sách</Button>
                    <div className={styles.price}>
                        Tổng:
                        <strong>{formatCurrency(totalPrice)}</strong>
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
                        <Table data={booksAvailable} fieldCols={SELL_BOOK_FIELDS} updateRow={handleUpdateRow} />
                    </div>
                    {errorAddBooks && <p className={styles['error-add-books']}>{errorAddBooks}</p>}
                    <div className={styles["btn-modal"]} >
                        <Button onClick={e => setOpenModalAddBook(false)} title="Đóng" outline>Đóng</Button>
                        <Button onClick={handleAddBooks} title="Thêm sách">Thêm</Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}