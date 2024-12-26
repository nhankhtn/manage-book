"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import FormInfoCustomer from "@/components/FormInfoCustomer";
import styles from "./BookSell.module.scss";
import Button from "@/components/Button";
import Table from "@/components/Table";
import { BOOK_FIELDS, SELL_BOOK_FIELDS } from "@/constants";
import Modal from "@/components/Modal";
import { searchBooks } from "@/services/searchService";
import { formatCurrency } from "@/utils/formatNumber";
import { useStore } from "@/hooks/useStore";
import { createDebt, createInvoice } from "@/services/paymentService";
import useModalAlert from "@/hooks/useModal";
import { useDebounce } from "@/hooks/useDebounce";
import { getCustomerDB } from "@/services/getCustomer";

export default function BookSell() {
    const [booksAvailable, setBooksAvailable] = useState([]);
    const [books, setBooks] = useState([]);
    const { state: { config: { minStockAfterSale, maxDebt } } } = useStore();
    const [formInfo, setFormInfo] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        debt: 0
    })
    const debouncedName = useDebounce(formInfo.name);
    const debouncedPhone = useDebounce(formInfo.phone);
    const formRef = useRef();
    const [errorAddBooks, setErrorAddBooks] = useState();
    const [openModalAddBook, setOpenModalAddBook] = useState(false);
    const { openModalAlert, hideModalAlert } = useModalAlert();
    const [error, setError] = useState('');
    const [filterText, setFilterText] = useState("");
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

        return () => {
            setBooksAvailable([]);
        }
    }, [])
    useEffect(() => {
        async function getCustomer() {
        try {
            console.log(debouncedName, debouncedPhone);
            const response = await getCustomerDB({
            params: {
                fullName: debouncedName,
                phone: debouncedPhone,
            },
            });
            setFormInfo({
            ...formInfo,
            email: response.email,
            address: response.address,
            debt: parseFloat(response.debt),
            });
        } catch (error) {
            setFormInfo((prev) => ({
            ...prev,
            email: "",
            address: "",
            debt: 0,
            }));
        }
        }
        getCustomer();
    }, [debouncedName, debouncedPhone]);
    const handlePayment = async (e, isDebt = false) => {
        try {
            if (formRef.current) {
                await formRef.current.validate();
            }
            if(isDebt && formInfo.debt + totalPrice > maxDebt) {
                setError(`Số tiền nợ không được vượt quá ${maxDebt}, số tiền nợ hiện tại là ${formInfo.debt}`);
                return;
            }
            if (books.length === 0) {
                setError('Chưa chọn sách');
                return;
            }
            setError('');
            const data = {
                fullName: formInfo.name,
                phone: formInfo.phone,
                email: formInfo.email,
                address: formInfo.address,
                books
            }

            if (isDebt) {
                if (formInfo.email === '' && formInfo.address === '') {
                    setError('Email và địa chỉ không được để trống khi ghi nợ');
                    return;
                }
                await createDebt(data);
            } else {
                await createInvoice(data);
            }
            setBooks([]);
            setFormInfo({
                name: '',
                phone: '',
                email: '',
                address: ''
            })
            openModalAlert(true);
        } catch (err) {
            console.log(err)
            if (err.message === 'Info error') {
                return;
            }
            openModalAlert(false);
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
                    book.quantity += bookToDelete.quantity;
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
        if (booksAvailable.some(book => book.quantity - book.amount < minStockAfterSale && book.amount > 0)) {
            setErrorAddBooks(`Số lượng sách còn lại không được vượt quá ${minStockAfterSale}`);
            return;
        }

        setErrorAddBooks('');
        setBooks(prevBooks => {
            const newBooks = booksAvailable
                .filter(book => book.amount > 0)
                .map(book =>{
                    return {
                        ...book,
                        quantity: book.amount
                }}
                );

            return prevBooks.map(book => {
                const newBook = newBooks.find(nb => nb.title === book.title);
                if (newBook) {
                    return { ...book,  quantity: book.quantity + newBook.amount };
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
        setFilterText('');
        setOpenModalAddBook(true);
    }

    const handleUpdateRow = (row, key, value) => {
        setBooksAvailable(preValues => {
            return preValues.map((book, _) => {
                if (book.title === row.title) {
                    book[key] = value;
                }
                return book;
            })
        })
    }

    const totalPrice = useMemo(() => {
        return books.reduce((total, book) => total + book.quantity * book.price, 0);
    }, [books])
    const filteredBooks = booksAvailable.filter(book =>
        book.title.toLowerCase().includes(filterText.toLowerCase())
    );
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
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles["wrap-btn"]}>
                <Button onClick={(e) => handlePayment(e, true)}>Ghi nợ</Button>
                <Button onClick={(e) => handlePayment(e, false)}>Thanh toán</Button>
            </div>
            <Modal show={openModalAddBook} onHide={e => setOpenModalAddBook(false)}>
                <div className={styles['wrapper-content-modal']}>
                    <h2 className={styles['heading-modal']}>Thêm sách</h2>
                    <input
                    className={styles['filter-input']}
                    type="text"
                    placeholder="Filter by title"
                    value={filterText}
                    onChange={(e) => {setFilterText(e.target.value)}}
                    />
                    <div className={styles['list-books']}>
                        <Table data={filteredBooks} fieldCols={SELL_BOOK_FIELDS} updateRow={handleUpdateRow} />
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