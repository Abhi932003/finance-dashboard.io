import React, { createContext, useState, useContext, useEffect } from 'react';
import { txService } from '../services/tx-service';

const DashboardContext = createContext();

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
};

export const DashboardProvider = ({ children }) => {
    // 1. Core State
    const [role, setRole] = useState(txService.getRole()); 
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState(localStorage.getItem('sovereign_theme') || 'light');
    const [activePage, setActivePage] = useState('Dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // 2. Initial Data Hydration & Theme Application
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('sovereign_theme', theme);
    }, [theme]);

    useEffect(() => {
        const hydrate = async () => {
            setLoading(true);
            try {
                const data = await txService.getTransactions();
                setTransactions(data);
            } catch (err) {
                console.error("Failed to load ledger data:", err);
            } finally {
                setLoading(false);
            }
        };
        hydrate();
    }, []);

    // 3. Actions (Async)
    const handleSetRole = (newRole) => {
        setRole(newRole);
        txService.setRole(newRole);
    };

    const handleAddTx = async (txData) => {
        setLoading(true);
        const updated = await txService.saveTransaction(txData);
        setTransactions(updated);
        setLoading(false);
    };

    const handleDeleteTx = async (id) => {
        setLoading(true);
        const updated = await txService.deleteTransaction(id);
        setTransactions(updated);
        setLoading(false);
    };

const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <DashboardContext.Provider value={{ 
            role, 
            setRole: handleSetRole, 
            transactions, 
            setTransactions, 
            addTransaction: handleAddTx,
            deleteTransaction: handleDeleteTx,
            loading, 
            setLoading,
            theme,
            toggleTheme,
            activePage,
            setActivePage,
            sidebarOpen,
            setSidebarOpen
        }}>
            {children}
        </DashboardContext.Provider>
    );
};
