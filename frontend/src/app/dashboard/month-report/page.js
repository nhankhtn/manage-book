'use client';

import styles from "./MonthReport.module.scss";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { INVENTORY_BOOK_FIELDS, DEBT_CONSUMER_FIELDS } from "@/constants";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Modal from "@/components/Modal";
import Table from "@/components/Table";
import { useReportBooks } from "@/hooks/useReportBooks";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const mockBooksInventory = [
    {
        title: "Book Title 1",
        author: "Author 1",
        firstInventory: 100,
        interest: 20,
        lastInventory: 120
    },
    {
        title: "Book Title 2",
        author: "Author 2",
        firstInventory: 80,
        interest: 15,
        lastInventory: 95
    },
    {
        title: "Book Title 3",
        author: "Author 3",
        firstInventory: 150,
        interest: 30,
        lastInventory: 180
    },
    {
        title: "Book Title 4",
        author: "Author 4",
        firstInventory: 60,
        interest: 10,
        lastInventory: 70
    },
    {
        title: "Book Title 5",
        author: "Author 5",
        firstInventory: 200,
        interest: 40,
        lastInventory: 240
    }
];
const mockBooksDebt = [
    {
        name: "Nguyễn Văn A",
        firstDebt: 1000000,
        interest: 500000,
        lastDebt: 1500000
    },
    {
        name: "Trần Thị B",
        firstDebt: 2000000,
        interest: 300000,
        lastDebt: 2300000
    },
    {
        name: "Phạm Văn C",
        firstDebt: 500000,
        interest: 100000,
        lastDebt: 600000
    },
    {
        name: "Lê Thị D",
        firstDebt: 700000,
        interest: 200000,
        lastDebt: 900000
    }
];

export default function MonthReport() {
    const [openModalInventoryReport, setOpenModalInventoryReport] = useState(false);
    const [openModalDebtReport, setOpenModalDebtReport] = useState(false);

    const { booksInventory, booksDebt, date, booksData, debtsData, getLastThreeMonths, fetchStockReport, fetchDebtReport, setDate } = useReportBooks();

    const bookStockData = {
        labels: getLastThreeMonths().map((monthYear) => monthYear.months),
        datasets: [
            {
                label: 'Số sách tồn',
                data: booksData, // Dữ liệu số sách tồn trong 3 tháng gần nhất
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const debtData = {
        labels: getLastThreeMonths().map((monthYear) => monthYear.months),
        datasets: [
            {
                label: 'Tổng số tiền nợ',
                data: debtsData, // Dữ liệu tổng số tiền nợ của khách hàng trong 3 tháng gần nhất
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
        ],
    };
    return (<div className={styles.wrapper}>
        <h2 className={styles.heading}>Lập báo cáo</h2>

        <div className={styles['wrap-btn']}>
            <Button title="Báo cáo tồn" onClick={e => {
                setOpenModalInventoryReport(true)
                setDate(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`)
                fetchStockReport();
            }}>
                Báo cáo tồn
            </Button>
            <Button title="Báo cáo công nợ" onClick={e => {
                setOpenModalDebtReport(true)
                setDate(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`)
                fetchDebtReport();
            }}>
                Báo cáo công nợ
            </Button>
        </div>

        <div className={styles["wrapper-chart"]}>
            <div> <Bar data={bookStockData} /></div>
            <div>  <Bar data={debtData} /></div>
        </div>

        <Modal show={openModalInventoryReport} onHide={e => {
            setOpenModalInventoryReport(false)
        }}>
            <div className={styles['wrapper-content-modal']}>
                <div className={styles['heading-modal']}>
                    <h2>Báo cáo tồn</h2>
                    <div className={styles['date']}>
                        <input id="month" type="month" value={date} onChange={fetchStockReport} />
                    </div>
                </div>
                <div className={styles["list"]}>
                    <Table data={booksInventory} fieldCols={INVENTORY_BOOK_FIELDS} />
                </div>
                <div className={styles["btn-modal"]} >
                    <Button onClick={e => setOpenModalInventoryReport(false)} title="Đóng">Đóng</Button>
                </div>
            </div>
        </Modal>

        <Modal show={openModalDebtReport} onHide={e => {
            setOpenModalDebtReport(false)
        }}>
            <div className={styles['wrapper-content-modal']}>
                <div className={styles['heading-modal']}>
                    <h2>Báo cáo công nợ</h2>
                    <div className={styles['date']}>
                        <input id="month" type="month" value={date} onChange={fetchDebtReport} />
                    </div>
                </div>
                <div className={styles["list"]}>
                    <Table data={booksDebt} fieldCols={DEBT_CONSUMER_FIELDS} />
                </div>
                <div className={styles["btn-modal"]} >
                    <Button onClick={e => setOpenModalDebtReport(false)} title="Đóng">Đóng</Button>
                </div>
            </div>
        </Modal>
    </div>)
}