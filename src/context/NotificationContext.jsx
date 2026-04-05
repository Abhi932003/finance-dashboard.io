import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, Bell } from 'lucide-react';
import './NotificationContext.css';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([
        {
            id: '1',
            title: 'Welcome Back!',
            message: 'Your monthly financial report is ready for review.',
            type: 'info',
            timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
            read: false
        },
        {
            id: '2',
            title: 'Budget Alert',
            message: 'You have spent 85% of your Entertainment budget.',
            type: 'warning',
            timestamp: new Date(Date.now() - 1000 * 6030), // 30 mins ago
            read: false
        }
    ]);
    
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info', title = '') => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast = { id, title, message, type };
        
        setToasts(prev => [...prev, newToast]);
        
        // Add to persistent notifications too
        const newNotification = {
            id: Math.random().toString(36).substr(2, 9),
            title: title || (type.charAt(0).toUpperCase() + type.slice(1)),
            message,
            type,
            timestamp: new Date(),
            read: false
        };
        setNotifications(prev => [newNotification, ...prev]);

        // Auto remove toast
        setTimeout(() => {
            removeToast(id);
        }, 5000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{ 
            notifications, 
            unreadCount, 
            showToast, 
            markAsRead, 
            markAllAsRead, 
            clearNotifications 
        }}>
            {children}
            <div className="toast-container">
                {toasts.map(toast => (
                    <div key={toast.id} className={`toast-item toast-${toast.type} fade-in`}>
                        <div className="toast-icon">
                            {toast.type === 'success' && <CheckCircle size={20} />}
                            {toast.type === 'error' && <AlertCircle size={20} />}
                            {toast.type === 'warning' && <AlertCircle size={20} />}
                            {toast.type === 'info' && <Info size={20} />}
                        </div>
                        <div className="toast-content">
                            {toast.title && <div className="toast-title">{toast.title}</div>}
                            <div className="toast-message">{toast.message}</div>
                        </div>
                        <button className="toast-close" onClick={() => removeToast(toast.id)}>
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};
