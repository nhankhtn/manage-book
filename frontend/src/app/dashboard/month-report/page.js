'use client';

import styles from "./MonthReport.module.scss";
import { useState } from "react";
import Button from "@/components/Button";
import { INVENTORY_BOOK_FIELDS, DEBT_CONSUMER_FIELDS } from "@/constants";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Modal from "@/components/Modal";
import Table from "@/components/Table";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const mockBooks = [
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


export default function MonthReport() {
    const [openModalInventoryReport, setOpenModalInventoryReport] = useState(false);
    const [openModalDebtReport, setOpenModalDebtReport] = useState(false);
    const [books, setBooks] = useState(mockBooks);

    const getLastThreeMonths = () => {
        const months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
        const today = new Date();
        const currentMonth = today.getMonth();
        const lastThreeMonths = [
            months[(currentMonth - 2 + 12) % 12],
            months[(currentMonth - 1 + 12) % 12],
            months[currentMonth]
        ];
        return lastThreeMonths;
    };

    const bookStockData = {
        labels: getLastThreeMonths(),
        datasets: [
            {
                label: 'Số sách tồn',
                data: [50, 75, 100], // Dữ liệu số sách tồn trong 3 tháng gần nhất
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const debtData = {
        labels: getLastThreeMonths(),
        datasets: [
            {
                label: 'Tổng số tiền nợ',
                data: [2000000, 1500000, 1000000], // Dữ liệu tổng số tiền nợ của khách hàng trong 3 tháng gần nhất
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (<div className={styles.wrapper}>
        <h2 className={styles.heading}>Lập báo cáo</h2>

        <div className={styles['wrap-btn']}>
            <Button title="Báo cáo tồn" onClick={e => setOpenModalInventoryReport(true)}>
                Báo cáo tồn
            </Button>
            <Button title="Báo cáo công nợ" onClick={e => setOpenModalDebtReport(true)}>
                Báo cáo công nợ
            </Button>
        </div>

        <div className={styles["wrapper-chart"]}>
          <div> <Bar data={bookStockData} /></div> 
          <div>  <Bar data={debtData} /></div> 
        </div>

        <Modal show={openModalInventoryReport} onHide={e => setOpenModalInventoryReport(false)}>
            <div className={styles['wrapper-content-modal']}>
                <div className={styles['heading-modal']}>
                    <h2>Báo cáo tồn</h2>
                    <div className={styles['date']}>
                        <input id="month" type="month" />
                    </div>
                </div>                
                <div className={styles["list"]}>
                    <Table data={books} fieldCols={INVENTORY_BOOK_FIELDS}/>
                </div>
                <div className={styles["btn-modal"]} >
                    <Button onClick={e => setOpenModalInventoryReport(false)} title="Đóng" outline>Đóng</Button>
                </div>
            </div>
        </Modal>

        <Modal show={openModalDebtReport} onHide={e => setOpenModalDebtReport(false)}>
            <div className={styles['wrapper-content-modal']}>
                <div className={styles['heading-modal']}>
                    <h2>Báo cáo công nợ</h2>
                    <div className={styles['date']}>
                        <input id="month" type="month" />
                    </div>
                </div>                
                <div className={styles["list"]}>
                    <Table data={books} fieldCols={DEBT_CONSUMER_FIELDS}/>
                </div>
                <div className={styles["btn-modal"]} >
                    <Button onClick={e => setOpenModalDebtReport(false)} title="Đóng" outline>Đóng</Button>
                </div>
            </div>
        </Modal>
    </div>)
}