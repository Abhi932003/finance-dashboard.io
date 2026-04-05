import React, { useRef, useEffect, useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { useNotification } from '../context/NotificationContext';
import { 
    User, 
    Settings, 
    Bell, 
    Lock, 
    HelpCircle, 
    LogOut, 
    ChevronRight,
    Globe,
    Moon,
    Sun,
    Monitor
} from 'lucide-react';
import './SettingsDropdown.css';

const SettingsDropdown = ({ onClose }) => {
    const { theme, toggleTheme, role, setActivePage } = useDashboard();
    const { showToast } = useNotification();
    const dropdownRef = useRef(null);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleFeatureMock = (feature) => {
        showToast(`${feature} settings are not available in the demo version.`, 'info');
    };

    const navigateToProfile = () => {
        setActivePage('Profile');
        onClose();
    };

    return (
        <div className="settings-dropdown fade-in" ref={dropdownRef}>
            <div className="dropdown-profile" onClick={navigateToProfile} style={{ cursor: 'pointer' }}>
                <div className="profile-avatar">
                    AM
                </div>
                <div className="profile-details">
                    <div className="profile-name">Arjun Mehra</div>
                    <div className="profile-email">arjun@bharatledger.in</div>
                    <div className="profile-role-tag">{role}</div>
                </div>
            </div>

            <div className="dropdown-divider" />

            <div className="dropdown-section">
                <div className="section-title">Preferences</div>
                
                <div className="menu-item" onClick={toggleTheme}>
                    <div className="menu-icon">
                        {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                    </div>
                    <span>Dark Mode</span>
                    <div className="menu-toggle">
                        <div className={`toggle-track ${theme === 'dark' ? 'active' : ''}`}>
                            <div className="toggle-thumb" />
                        </div>
                    </div>
                </div>

                <div className="menu-item" onClick={() => setNotificationsEnabled(!notificationsEnabled)}>
                    <div className="menu-icon">
                        <Bell size={18} />
                    </div>
                    <span>Notifications</span>
                    <div className="menu-toggle">
                        <div className={`toggle-track ${notificationsEnabled ? 'active' : ''}`}>
                            <div className="toggle-thumb" />
                        </div>
                    </div>
                </div>

                <div className="menu-item" onClick={() => handleFeatureMock('Language')}>
                    <div className="menu-icon">
                        <Globe size={18} />
                    </div>
                    <span>Language</span>
                    <div className="menu-value">English</div>
                    <ChevronRight size={16} className="chevron" />
                </div>
            </div>

            <div className="dropdown-divider" />

            <div className="dropdown-section">
                <div className="section-title">Account</div>
                
                <div className="menu-item" onClick={navigateToProfile}>
                    <div className="menu-icon">
                        <User size={18} />
                    </div>
                    <span>My Profile</span>
                    <ChevronRight size={16} className="chevron" />
                </div>

                <div className="menu-item" onClick={() => handleFeatureMock('Security')}>
                    <div className="menu-icon">
                        <Lock size={18} />
                    </div>
                    <span>Security</span>
                    <ChevronRight size={16} className="chevron" />
                </div>
            </div>

            <div className="dropdown-divider" />

            <div className="dropdown-footer">
                <button className="logout-btn" onClick={() => handleFeatureMock('Logout')}>
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default SettingsDropdown;
