import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  TrendingUp, TrendingDown, Target, Wallet, ArrowUpCircle, ArrowDownCircle,
  ShoppingBag, Landmark, Coffee, Zap, Home, Car, Utensils
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { useNotification } from '../context/NotificationContext';
import './DashboardHome.css';

// Patterns for static charts that are hard to derive from just 8 mock transactions
const TREND_DATA = [
  { name: 'Jan', balance: 12000 },
  { name: 'Feb', balance: 14500 },
  { name: 'Mar', balance: 13200 },
  { name: 'Apr', balance: 19800 },
  { name: 'May', balance: 22000 },
  { name: 'Jun', balance: 26000 },
  { name: 'Jul', balance: 24500 },
  { name: 'Aug', balance: 29000 },
  { name: 'Sep', balance: 34000 },
  { name: 'Oct', balance: 31000 },
  { name: 'Nov', balance: 39000 },
  { name: 'Dec', balance: 45230 },
];

const DashboardHome = () => {
  const { transactions, theme, setActivePage } = useDashboard();
  const { showToast } = useNotification();

  React.useEffect(() => {
    // Show a welcome notification on first load
    const timer = setTimeout(() => {
      showToast('Welcome back, Alex! Your portfolio is looking strong today.', 'success', 'Dashboard Ready');
    }, 1000);
    return () => clearTimeout(timer);
  }, [showToast]);
  
  // Theme-aware colors
  const chartColors = {
    primary: theme === 'dark' ? '#3b82f6' : '#1e40af',
    secondary: '#10b981',
    grid: theme === 'dark' ? '#334155' : '#f1f5f9',
    text: theme === 'dark' ? '#94a3b8' : '#64748b'
  };

  const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  
  // Dynamic Calculations
  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const incomeTxs = transactions.filter(t => t.type === 'income');
  const expenseTxs = transactions.filter(t => t.type === 'expense');

  const totalIncome = incomeTxs.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenseTxs.reduce((sum, t) => sum + t.amount, 0);
  const totalBalance = totalIncome - totalExpenses;

  // Breakdown Data derivation
  const categoryTotals = expenseTxs.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const BREAKDOWN_DATA = Object.entries(categoryTotals).map(([name, value], index) => ({
    name,
    value,
    color: PIE_COLORS[index % PIE_COLORS.length]
  }));

  const recentTransactions = transactions.slice(0, 4);

  // Icon Mapper
  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'groceries': return <ShoppingBag size={20} />;
      case 'income': return <Landmark size={20} />;
      case 'bills': return <Zap size={20} />;
      case 'investments': return <TrendingUp size={20} />;
      case 'housing': return <Home size={20} />;
      case 'food': return <Utensils size={20} />;
      case 'travel': return <Car size={20} />;
      case 'business': return <Wallet size={20} />;
      default: return <Target size={20} />;
    }
  };

  return (
    <div className="dashboard-home fade-in">
      <div className="card-grid">
        {/* Total Balance Card */}
        <div className="card balance-card">
          <div className="card-content">
            <span className="card-title">TOTAL BALANCE</span>
            <h1 className="card-value">{formatCurrency(totalBalance)}</h1>
            <div className="card-trend trend-up">
              <TrendingUp size={16} />
              <span>+8.4% from last month</span>
            </div>
          </div>
        </div>

        {/* Monthly Income Card */}
        <div className="card summary-mini">
          <div className="card-header">
            <span className="card-title">MONTHLY INCOME</span>
            <ArrowUpCircle color="#10b981" size={24} />
          </div>
          <h2 className="card-value">{formatCurrency(totalIncome)}</h2>
          <div className="goal-progress">
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: '85%' }}></div>
            </div>
            <div className="progress-labels">
              <span>85% OF TARGET</span>
              <span>Target: ₹2.5L</span>
            </div>
          </div>
        </div>

        {/* Monthly Expenses Card */}
        <div className="card summary-mini">
          <div className="card-header">
            <span className="card-title">MONTHLY EXPENSES</span>
            <ArrowDownCircle color="#ef4444" size={24} />
          </div>
          <h2 className="card-value">{formatCurrency(totalExpenses)}</h2>
          <div className="budget-status">
            <div className="budget-circles">
              <div className="circle" style={{ backgroundColor: '#ffe4e6' }}></div>
              <div className="circle" style={{ backgroundColor: '#fecdd3' }}></div>
              <div className="circle" style={{ backgroundColor: '#fda4af' }}></div>
            </div>
            <span className="badge">OPTIMIZED</span>
          </div>
        </div>
      </div>

      <div className="dashboard-charts">
        {/* Balance Trend */}
        <div className="card chart-card trend-chart">
          <div className="chart-header">
            <div>
              <h3>Portfolio Projection</h3>
              <p>Estimated growth over 12 months</p>
            </div>
            <select className="chart-select">
              <option>Yearly</option>
              <option>Monthly</option>
            </select>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={TREND_DATA}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.1} />
                    <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartColors.grid} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: chartColors.text, fontSize: 12 }} dy={10} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-main)' 
                  }} 
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke={chartColors.primary}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorBalance)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spending Breakdown */}
        <div className="card chart-card pie-chart">
          <h3>Expense Distribution</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={BREAKDOWN_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {BREAKDOWN_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-main)' 
                    }} 
                  />
                </PieChart>
            </ResponsiveContainer>
            <div className="total-center">
              <strong>{formatCurrency(totalExpenses / 1000)}k</strong>
              <span>TOTAL</span>
            </div>
          </div>
          <div className="pie-legend">
            {BREAKDOWN_DATA.slice(0, 3).map((item, idx) => (
              <div key={idx} className="legend-item">
                <span className="dot" style={{ backgroundColor: item.color }}></span>
                <span className="name">{item.name}</span>
                <span className="percent">{Math.round(item.value / totalExpenses * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-bottom">
        {/* Recent Transactions */}
        <div className="card recent-tx-card">
          <div className="card-header">
            <h3>Recent Activity</h3>
            <button className="view-all" onClick={() => setActivePage('Transactions')}>See All Activity</button>
          </div>
          <div className="transaction-list">
            {recentTransactions.map(tx => (
              <div key={tx.id} className="transaction-item" onClick={() => setActivePage('Transactions')}>
                <div className={`tx-icon bg-${tx.category.toLowerCase()}`}>
                  {getCategoryIcon(tx.category)}
                </div>
                <div className="tx-info">
                  <span className="tx-desc">{tx.description}</span>
                  <span className="tx-meta">{tx.date} • {tx.category}</span>
                </div>
                <div className={`tx-amount ${tx.type}`}>
                  {tx.type === 'expense' ? '-' : '+'}₹{tx.amount.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggestion Card */}
        <div className="card suggestion-card">
          <div className="suggestion-badge">INSIGHT</div>
          <h3>Portfolio Analysis</h3>
          <p>Your current allocation in <strong>{BREAKDOWN_DATA[0]?.name || 'Housing'}</strong> is above target. Consider rebalancing for better diversification.</p>
          <button className="btn-optimize">Run Analysis</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
