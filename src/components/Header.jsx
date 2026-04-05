import React, { useState } from 'react';
import { Search, Bell, Settings, User, Menu, RefreshCw, Sun, Moon } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { useNotification } from '../context/NotificationContext';
import NotificationTray from './NotificationTray';
import SettingsDropdown from './SettingsDropdown';
import './Header.css';

const Header = () => {
    const { role, setRole, setSidebarOpen, loading, theme, toggleTheme, setActivePage } = useDashboard();
    const { unreadCount } = useNotification();

    const [showNotifications, setShowNotifications] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    return (
        <header className="page-header">
            <button className="menu-toggle-btn" onClick={() => setSidebarOpen(true)}>
                <Menu size={24} />
            </button>

            <div className="header-left">
                <button
                    className="theme-toggle-btn"
                    onClick={toggleTheme}
                    title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                {loading && (
                    <div className="sync-indicator">
                        <RefreshCw size={14} className="spin" />
                        <span>Syncing...</span>
                    </div>
                )}
            </div>

            <div className="search-bar">
                <Search size={18} className="search-icon" />
                <input type="text" placeholder="Search accounts or data..." />
            </div>

            <div className="header-actions">
                <div className="role-switcher">
                    <button
                        className={`role-btn ${role === 'Admin' ? 'active' : ''}`}
                        onClick={() => setRole('Admin')}
                    >
                        Admin
                    </button>
                    <button
                        className={`role-btn ${role === 'Viewer' ? 'active' : ''}`}
                        onClick={() => setRole('Viewer')}
                    >
                        Viewer
                    </button>
                </div>

                <div className="utility-btns">
                    <div className="header-dropdown-parent">
                        <button
                            className={`utility-btn ${showNotifications ? 'active' : ''}`}
                            onClick={() => {
                                setShowNotifications(!showNotifications);
                                setShowSettings(false);
                            }}
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && <span className="notification-dot" />}
                        </button>
                        {showNotifications && (
                            <NotificationTray onClose={() => setShowNotifications(false)} />
                        )}
                    </div>

                    <div className="header-dropdown-parent">
                        <button
                            className={`utility-btn ${showSettings ? 'active' : ''}`}
                            onClick={() => {
                                setShowSettings(!showSettings);
                                setShowNotifications(false);
                            }}
                        >
                            <Settings size={20} />
                        </button>
                        {showSettings && (
                            <SettingsDropdown onClose={() => setShowSettings(false)} />
                        )}
                    </div>
                </div>

                <div className="user-profile" onClick={() => { setActivePage('Profile'); setShowNotifications(false); setShowSettings(false); }} style={{ cursor: 'pointer' }}>
                    <div className="user-avatar">
                        <img src="/IMG-20260327-WA0017.jpg.jpeg" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="user-info">
                        <span className="user-name">Abhishek Watmode</span>
                        <span className="user-role">{role}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
