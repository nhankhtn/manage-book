//make advantage of page month-report to create a custom hook
'use client';

import { useState } from "react";
import { getStockReport } from "@/services/getStockReport";
import { getDebtReport } from "@/services/getDebtReport";
import { useEffect } from "react";

export const useReportBooks = () => {
    const [booksInventory, setBooksInventory] = useState([]); // biến này dùng cho stock trong modal
    const [booksDebt, setBooksDebt] = useState([]); // biến này dùng cho nợ trong modal
    const [date, setDate] = useState(`${new Date().getFullYear()}-${new Date().getMonth() + 1}`); // biến này dùng cho lấy tháng năm trong input của modal
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
    async function fetchData(month,year, stock = true){ // stock = true -> lấy dữ liệu cho stock, ngược lại lấy dữ liệu cho nợ vào tháng năm cụ thể
        var response;
        try {
            if(stock) response = await getStockReport({month, year});
            else response = await getDebtReport({month, year});
        } catch (error) {
            throw error;
        }
        return response;
    }
    async function fetchStockReport(e) {
        var currentYear, currentMonth ;
        if(e)
        {
            [currentYear, currentMonth] = e.target.value.split("-");
            setDate(e.target.value);
        }
        else [currentYear, currentMonth] = [new Date().getFullYear(), new Date().getMonth() + 1];
        console.log(currentYear, currentMonth);
       try {
            const response = await fetchData(currentMonth, currentYear, true);
            console.log(response);
            setBooksInventory(response);
        } catch (error) {
            console.error("Error fetching stock report:", error);
        }
    }

    async function fetchDebtReport(e) {
        var currentYear, currentMonth ;
        if(e)
        {
            [currentYear, currentMonth] = e.target.value.split("-");
            setDate(e.target.value);
        }
        else [currentYear, currentMonth] = [new Date().getFullYear(), new Date().getMonth() + 1];
        console.log(currentYear, currentMonth);
       try {
            const response = await fetchData(currentMonth, currentYear, false);
            console.log(response);
            setBooksDebt(response);
        } catch (error) {
            console.error("Error fetching stock report:", error);
        }
    }

    const [booksData, setBooksData] = useState([10, 10, 10]);  // biến này dùng cho tính stock 3 tháng gần nhất
    const [debtsData, setDebtsData] = useState([10, 10, 10]);  // biến này dùng cho nợ  3 tháng gần nhất
    useEffect(() => {
        async function fetchDataMonths() {
            try {
                const year = new Date().getFullYear() ;
                const lastThreeMonths = getLastThreeMonths();
                const stockPromises = lastThreeMonths.map(monthYear => {
                    const month = monthYear.split(" ")[1];
                    return fetchData(month, year,true);
                });
                const debtPromises = lastThreeMonths.map(monthYear => {
                    const month = monthYear.split(" ")[1];
                    return fetchData(month, year,false);
                });
                let stockResponses = await Promise.all(stockPromises);
                let debtResponses = await Promise.all(debtPromises);
                stockResponses = stockResponses.map(response => response.reduce((acc, book) => acc + parseFloat(book.final_stock), 0));
                debtResponses= debtResponses.map(response => response.reduce((acc, book) => acc +parseFloat(book.final_debt), 0));
                setBooksData(stockResponses);
                setDebtsData(debtResponses);
                console.log(stockResponses, debtResponses);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchDataMonths(); // lấy dữ liệu cho 3 tháng gần nhất
    }, []);
    return { booksInventory, booksDebt, date, booksData, debtsData,getLastThreeMonths, fetchStockReport, fetchDebtReport, setDate };
}