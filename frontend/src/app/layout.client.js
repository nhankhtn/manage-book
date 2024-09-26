"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { ModalProvider } from "@/context/Modal"
import "./globals.css";
import { useState } from "react";

export default function LayoutClient({ children }) {
    const [isShowSidebar, setShowSidebar] = useState(true);

    const toggleSidebar = () => {
        setShowSidebar(!isShowSidebar);
    }

    return <ModalProvider>
        <div className='root'>
            <Header toggleSidebar={toggleSidebar} />
            <div className='container'>
                <Sidebar show={isShowSidebar} />
                <main className='content'>
                    {children}
                </main>
            </div>
        </div>
    </ModalProvider>
}