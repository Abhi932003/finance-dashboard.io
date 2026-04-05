import React from 'react';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  BarChart3, 
  Settings, 
  HelpCircle,
  PlusCircle,
  Building2
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import './Sidebar.css';

const Sidebar = () => {
  const { activePage, setActivePage, role, sidebarOpen, setSidebarOpen } = useDashboard();

  const handleNavClick = (id) => {
    setActivePage(id);
    setSidebarOpen(false); // Close on click for mobile
  };

  const menuItems = [
    { id: 'Dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { id: 'Transactions', icon: <ArrowLeftRight size={20} />, label: 'Transactions' },
    { id: 'Insights', icon: <BarChart3 size={20} />, label: 'Insights' },
  ];

  const secondaryItems = [
    { id: 'Settings', icon: <Settings size={20} />, label: 'Settings' },
    { id: 'Support', icon: <HelpCircle size={20} />, label: 'Support' },
  ];

  return (
    <div className={`sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
      <div className="logo-container">
        <Building2 size={32} color="#1e40af" />
        <div className="logo-text">
          <h2>Bharat Ledger</h2>
          <span>Account Intelligence</span>
        </div>
      </div>
      <button className="mobile-close-btn" onClick={() => setSidebarOpen(false)}>
        <PlusCircle style={{ transform: 'rotate(45deg)' }} size={24} />
      </button>

      <nav className="sidebar-nav main-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <button 
                className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
                {activePage === item.id && <div className="active-indicator" />}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {role === 'Admin' && (
        <div className="new-transaction-container">
          <button className="btn-new-transaction" onClick={() => handleNavClick('Transactions')}>
            <PlusCircle size={20} />
            <span>New Transaction</span>
          </button>
        </div>
      )}

      <nav className="sidebar-nav secondary-nav">
        <ul>
          {secondaryItems.map((item) => (
            <li key={item.id}>
              <button 
                className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
