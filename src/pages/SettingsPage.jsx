import React, { useState } from 'react';
import { 
    Settings, 
    Bell, 
    Moon, 
    Sun, 
    Monitor, 
    Globe, 
    Lock, 
    Eye, 
    Database, 
    Smartphone,
    HelpCircle,
    ChevronRight,
    CreditCard
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { useNotification } from '../context/NotificationContext';
import './SettingsPage.css';

const SettingsPage = () => {
    const { theme, toggleTheme } = useDashboard();
    const { showToast } = useNotification();
    
    const [settings, setSettings] = useState({
        notifications: {
            email: true,
            push: true,
            security: true,
            marketing: false
        },
        language: 'English (India)',
        currency: 'INR (₹)',
        privacy: 'Public'
    });

    const handleToggle = (section, key) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: !prev[section][key]
            }
        }));
        showToast('Setting updated successfully.', 'info');
    };

    const handleFeatureMock = (name) => {
        showToast(`${name} is a demo feature.`, 'info');
    };

    return (
        <div className="settings-page fade-in">
            <div className="settings-header">
                <div className="header-icon">
                    <Settings size={24} />
                </div>
                <div>
                    <h1>System Settings</h1>
                    <p>Manage your account preferences and application configuration.</p>
                </div>
            </div>

            <div className="settings-grid">
                <div className="settings-sidebar-nav">
                    <button className="side-nav-item active">
                        <Monitor size={18} />
                        Appearance
                    </button>
                    <button className="side-nav-item" onClick={() => handleFeatureMock('Notifications')}>
                        <Bell size={18} />
                        Notifications
                    </button>
                    <button className="side-nav-item" onClick={() => handleFeatureMock('Security')}>
                        <Lock size={18} />
                        Security & Privacy
                    </button>
                    <button className="side-nav-item" onClick={() => handleFeatureMock('Billing')}>
                        <CreditCard size={18} />
                        Billing
                    </button>
                    <button className="side-nav-item" onClick={() => handleFeatureMock('Language')}>
                        <Globe size={18} />
                        Language
                    </button>
                </div>

                <div className="settings-content">
                    {/* Appearance Section */}
                    <div className="settings-section">
                        <h3 className="section-title">Appearance</h3>
                        <div className="setting-card">
                            <div className="setting-info">
                                <strong>Theme Mode</strong>
                                <p>Select how Sovereign Ledger looks on your device.</p>
                            </div>
                            <div className="theme-options">
                                <div 
                                    className={`theme-box light ${theme === 'light' ? 'active' : ''}`}
                                    onClick={() => theme === 'dark' && toggleTheme()}
                                >
                                    <div className="theme-preview" />
                                    <Sun size={16} />
                                    <span>Light</span>
                                </div>
                                <div 
                                    className={`theme-box dark ${theme === 'dark' ? 'active' : ''}`}
                                    onClick={() => theme === 'light' && toggleTheme()}
                                >
                                    <div className="theme-preview" />
                                    <Moon size={16} />
                                    <span>Dark</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notifications Section */}
                    <div className="settings-section">
                        <h3 className="section-title">Email Notifications</h3>
                        <div className="setting-card-list">
                            <div className="setting-item">
                                <div className="item-info">
                                    <strong>Transaction Alerts</strong>
                                    <p>Get notified when large transactions occur in your ledger.</p>
                                </div>
                                <div className={`toggle-track ${settings.notifications.email ? 'active' : ''}`} onClick={() => handleToggle('notifications', 'email')}>
                                    <div className="toggle-thumb" />
                                </div>
                            </div>
                            <div className="setting-item">
                                <div className="item-info">
                                    <strong>Security Alerts</strong>
                                    <p>Receive notifications about new logins and security changes.</p>
                                </div>
                                <div className={`toggle-track ${settings.notifications.security ? 'active' : ''}`} onClick={() => handleToggle('notifications', 'security')}>
                                    <div className="toggle-thumb" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Regional Section */}
                    <div className="settings-section">
                        <h3 className="section-title">Regional & Language</h3>
                        <div className="setting-card-list">
                            <div className="setting-item clickable" onClick={() => handleFeatureMock('Language')}>
                                <div className="item-info">
                                    <strong>Display Language</strong>
                                    <p>{settings.language}</p>
                                </div>
                                <ChevronRight size={18} className="chevron" />
                            </div>
                            <div className="setting-item clickable" onClick={() => handleFeatureMock('Currency')}>
                                <div className="item-info">
                                    <strong>Primary Currency</strong>
                                    <p>{settings.currency}</p>
                                </div>
                                <ChevronRight size={18} className="chevron" />
                            </div>
                        </div>
                    </div>

                    {/* Data Section */}
                    <div className="settings-section">
                        <h3 className="section-title">Data Management</h3>
                        <div className="setting-card danger-zone">
                            <div className="setting-info">
                                <strong>Clear Local History</strong>
                                <p>Permanently remove all cached transactions and settings from this browser.</p>
                            </div>
                            <button className="btn-danger" onClick={() => handleFeatureMock('Clear Data')}>Clear Data</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
