import React, { useRef, useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';
import { Bell, Check, Trash2, Clock, Info, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import './NotificationTray.css';

const NotificationTray = ({ onClose }) => {
    const { notifications, markAsRead, markAllAsRead, clearNotifications, unreadCount } = useNotification();
    const trayRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (trayRef.current && !trayRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const formatTimestamp = (date) => {
        const now = new Date();
        const diff = Math.floor((now - date) / 1000 / 60); // minutes
        if (diff < 1) return 'Just now';
        if (diff < 60) return `${diff}m ago`;
        const hours = Math.floor(diff / 60);
        if (hours < 24) return `${hours}h ago`;
        return date.toLocaleDateString();
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle className="text-success" size={16} />;
            case 'warning': return <AlertTriangle className="text-warning" size={16} />;
            case 'error': return <AlertCircle className="text-error" size={16} />;
            default: return <Info className="text-info" size={16} />;
        }
    };

    return (
        <div className="notification-tray fade-in" ref={trayRef}>
            <div className="tray-header">
                <div className="tray-title">
                    Notifications
                    {unreadCount > 0 && <span className="unread-badge">{unreadCount} New</span>}
                </div>
                <div className="tray-actions">
                    <button onClick={markAllAsRead} title="Mark all as read">
                        <Check size={16} />
                    </button>
                    <button onClick={clearNotifications} title="Clear all">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="tray-content">
                {notifications.length === 0 ? (
                    <div className="empty-notifications">
                        <Bell size={40} strokeWidth={1} />
                        <p>No notifications yet</p>
                    </div>
                ) : (
                    notifications.map(notification => (
                        <div 
                            key={notification.id} 
                            className={`notification-item ${!notification.read ? 'unread' : ''}`}
                            onClick={() => markAsRead(notification.id)}
                        >
                            <div className={`item-icon ${notification.type}`}>
                                {getIcon(notification.type)}
                            </div>
                            <div className="item-body">
                                <div className="item-title">{notification.title}</div>
                                <div className="item-message">{notification.message}</div>
                                <div className="item-time">
                                    <Clock size={12} />
                                    {formatTimestamp(notification.timestamp)}
                                </div>
                            </div>
                            {!notification.read && <div className="unread-dot" />}
                        </div>
                    ))
                )}
            </div>

            {notifications.length > 0 && (
                <div className="tray-footer">
                    <button>View all history</button>
                </div>
            )}
        </div>
    );
};

export default NotificationTray;
