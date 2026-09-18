import { useState } from "react";
import { Outlet } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

import Header from "../../components/navigation/Header/Header";
import Sidebar from "../../components/navigation/Sidebar/Sidebar";
import Footer from "../../components/navigation/Footer/Footer";

import "./AppLayout.css";

function AppLayout() {
    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const [sidebarCollapsed, setSidebarCollapsed] =
        useState(false);

    const { user } = useAuth();

    const handleMenuToggle = () => {
        if (window.innerWidth <= 1023) {
            setSidebarOpen(
                (current) => !current
            );

            return;
        }

        setSidebarCollapsed(
            (current) => !current
        );
    };

    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

    return (
        <div
            className={`app-layout ${
                sidebarCollapsed
                    ? "app-layout--sidebar-collapsed"
                    : ""
            }`}
        >
            <Header
                onMenuToggle={handleMenuToggle}
            />

            <Sidebar
                user={user}
                isOpen={sidebarOpen}
                isCollapsed={sidebarCollapsed}
                onClose={handleSidebarClose}
            />

            <div className="app-layout__body">
                <main className="app-layout__main">
                    <div className="app-layout__content">
                        <Outlet />
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
}

export default AppLayout;