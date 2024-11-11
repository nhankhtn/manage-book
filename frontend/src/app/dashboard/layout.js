"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { ModalAlertProvider } from "@/context/ModalAlert"
import AuthGuard from "@/guard/AuthGuard";
import { useState } from "react";

export default function LayoutClient({ children }) {
    const [isShowSidebar, setShowSidebar] = useState(true);

    const toggleSidebar = () => {
        setShowSidebar(!isShowSidebar);
    }

    return (
        <AuthGuard>
            <ModalAlertProvider>
                <div className='root'>
                    <Sidebar show={isShowSidebar} />
                    <div className='container'>
                        <Header show={isShowSidebar} toggleSidebar={toggleSidebar} />
                        <main className='content'>
                            {children}
                        </main>
                    </div>
                </div>
            </ModalAlertProvider>
        </AuthGuard>
    )
}