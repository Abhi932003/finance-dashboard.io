import React, { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
    BarChart3,
    TrendingUp,
    Download,
    AlertCircle
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import './InsightsPage.css';

const InsightsPage = () => {
    const { transactions, theme } = useDashboard();

    const MOCK_BUDGETS = {
        'Groceries': 15000,
        'Bills': 10000,
        'Housing': 50000,
        'Food': 12000,
        'Travel': 20000,
        'Shopping': 10000,
        'Entertainment': 5000,
        'Health': 8000,
        'Transport': 5000,
        'Other': 5000
    };

    // 1. Dynamic Calculations
    const insights = useMemo(() => {
        const now = new Date();
        // Filter transactions for calculations
        const incomeTxs = transactions.filter(t => t.type === 'income');
        const expenseTxs = transactions.filter(t => t.type === 'expense');

        const totalIncome = incomeTxs.reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = expenseTxs.reduce((sum, t) => sum + t.amount, 0);

        // Savings Rate
        const savingsRate = totalIncome > 0 
            ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) 
            : 0;

        // Category Breakdown with Budget comparison
        const categoryMap = expenseTxs.reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {});

        const sortedCategories = Object.entries(categoryMap)
            .map(([name, value]) => {
                const budget = MOCK_BUDGETS[name] || 500;
                const status = value > budget ? 'Over Budget' : 'Under Budget';
                const drillPct = Math.round((value / budget) * 100);
                
                return { 
                    label: name, 
                    value: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value),
                    amount: value,
                    budget: budget,
                    status: status,
                    drillPct: drillPct,
                    pct: Math.round((value / totalExpenses) * 100) || 0
                };
            })
            .sort((a, b) => b.amount - a.amount);

        const highestCategory = sortedCategories[0] || { label: 'None', pct: 0, amount: 0, drillPct: 0, budget: 0 };

        // Monthly Comparison (Detect Year from Data)
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyDataMap = {};

        // Find reference date for 6-month window (latest transaction or today)
        const latestTxDate = transactions.length > 0 
            ? new Date(Math.max(...transactions.map(t => new Date(t.date).getTime())))
            : new Date();

        // Pre-fill last 6 months relative to latest activity
        for (let i = 5; i >= 0; i--) {
            const d = new Date(latestTxDate);
            d.setMonth(d.getMonth() - i);
            const mName = monthNames[d.getMonth()];
            monthlyDataMap[mName] = { name: mName, income: 0, expenses: 0, sortKey: d.getTime(), year: d.getFullYear() };
        }

        transactions.forEach(t => {
            const date = new Date(t.date);
            const mName = monthNames[date.getMonth()];
            const yr = date.getFullYear();
            // Match month and year within the pre-filled window
            const targetMonth = Object.values(monthlyDataMap).find(m => m.name === mName && m.year === yr);
            if (targetMonth) {
                if (t.type === 'income') targetMonth.income += t.amount;
                else targetMonth.expenses += t.amount;
            }
        });

        const monthlyComparisonData = Object.values(monthlyDataMap).sort((a, b) => a.sortKey - b.sortKey);

        // Group by month-year for trend analysis
        const monthGroups = transactions.reduce((acc, t) => {
            if (t.type !== 'expense') return acc;
            const date = new Date(t.date);
            if (isNaN(date.getTime())) return acc;
            const myKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (!acc[myKey]) acc[myKey] = { categories: {} };
            acc[myKey].categories[t.category] = (acc[myKey].categories[t.category] || 0) + t.amount;
            return acc;
        }, {});

        // Pre-calculate categories over budget
        const overBudget = sortedCategories.filter(c => c.status === 'Over Budget');

        // Advanced Advisory Logic: Trend Analysis
        const monthYearKeys = Object.keys(monthGroups).sort();
        let trendInsight = null;

        if (monthYearKeys.length >= 2) {
            const latestMY = monthYearKeys[monthYearKeys.length - 1];
            const prevMY = monthYearKeys[monthYearKeys.length - 2];
            
            const latestCats = monthGroups[latestMY]?.categories || {};
            const prevCats = monthGroups[prevMY]?.categories || {};

            // Find category with largest increase
            let maxIncrease = -Infinity;
            let trendingCat = null;

            Object.entries(latestCats).forEach(([cat, amount]) => {
                const prevAmount = prevCats[cat] || 0;
                if (prevAmount > 0) {
                    const increase = ((amount - prevAmount) / prevAmount) * 100;
                    if (increase > maxIncrease) {
                        maxIncrease = increase;
                        trendingCat = cat;
                    }
                }
            });

            if (trendingCat && maxIncrease > 10) {
                trendInsight = {
                    id: 4,
                    text: `Trend Alert: ${trendingCat} spending has surged by ${Math.round(maxIncrease)}% recently. Recommend auditing these line items.`
                };
            }
        }
        
        const advisory = [
            { 
                id: 1, 
                text: overBudget.length > 0 
                    ? `Warning: You are over budget in ${overBudget.length} categories, notably ${overBudget[0].label}.` 
                    : `Excellent management! All active categories are currently within budget limits.` 
            },
            { 
                id: 2, 
                text: totalIncome > totalExpenses 
                    ? `Positive cash flow detected. Your net position is +${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalIncome - totalExpenses)}.`
                    : `Negative cash flow. Expenses exceeded income by ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalExpenses - totalIncome)}.` 
            },
            { 
                id: 3, 
                text: savingsRate > 20 
                    ? "Financial Health: Optimal savings rate achieved. Consider diversifying your portfolio."
                    : "Observation: High consumption detected relative to income. Target a 20% savings rate for long-term stability." 
            }
        ];

        if (trendInsight) advisory.push(trendInsight);

        return {
            savingsRate,
            highestCategory,
            monthlyComparisonData,
            sortedCategories,
            advisory,
            totalExpenses
        };
    }, [transactions]);

    const chartColors = {
        primary: theme === 'dark' ? '#3b82f6' : '#0d143c',
        secondary: theme === 'dark' ? '#94a3b8' : '#cbd5e1',
        grid: theme === 'dark' ? '#334155' : '#f1f5f9',
        text: theme === 'dark' ? '#94a3b8' : '#64748b'
    };

    return (
        <div className="insights-page fade-in">
            <div className="page-header-tx">
                <div>
                    <h1>Insights and Reports</h1>
                    <p>Dynamic analysis based on your recent activity.</p>
                </div>
                <button className="btn-export">
                    <Download size={18} />
                    Export Report
                </button>
            </div>

            <div className="insights-grid">
                <div className="card stat-card savings">
                    <div className="stat-header">
                        <div className="icon-circle"><TrendingUp size={24} color="#10b981" /></div>
                        <span className="label">Savings Rate</span>
                    </div>
                    <div className="stat-body">
                        <div className="stat-main">
                            <h2>{insights.savingsRate}%</h2>
                            <span className="trend-pct">{insights.savingsRate > 20 ? '+Optimal' : 'Needs Review'}</span>
                        </div>
                        <p className="caption">Target: 20% or higher for optimal growth.</p>
                        <div className="sparkline">
                            {[30, 45, 40, 60, 80].map((h, i) => (
                                <div key={i} className="spark-bar" style={{ height: `${h}%` }}></div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="card stat-card category-high">
                    <div className="stat-header">
                        <div className="icon-circle"><AlertCircle size={24} color="#f59e0b" /></div>
                        <span className="label">Budget Performance (Top Category)</span>
                    </div>
                    <div className="stat-body">
                        <h2>{insights.highestCategory.label} — {insights.highestCategory.drillPct}%</h2>
                        <div className="budget-progress-large">
                            <div className="bar-bg">
                                <div className="bar-fill" style={{ 
                                    width: `${Math.min(insights.highestCategory.drillPct, 100)}%`,
                                    backgroundColor: insights.highestCategory.drillPct > 100 ? 'var(--status-red)' : 'var(--status-green)'
                                }}></div>
                            </div>
                            <div className="bar-labels">
                                <span>{insights.highestCategory.value} spent</span>
                                <span>Budget: ₹{insights.highestCategory.budget.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="insights-main-grid">
                <div className="card chart-card-large">
                    <h3>Monthly Comparison</h3>
                    <div className="chart-container-large">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={insights.monthlyComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartColors.grid} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: chartColors.text, fontSize: 13 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: chartColors.text, fontSize: 12 }} />
                                <Tooltip 
                                    cursor={{ fill: theme === 'dark' ? '#1e293b' : '#f8fafc' }}
                                    contentStyle={{ 
                                        backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                                        borderColor: 'var(--border-color)',
                                        color: 'var(--text-main)' 
                                    }}
                                />
                                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px' }} />
                                <Bar dataKey="income" fill={chartColors.primary} radius={[4, 4, 0, 0]} barSize={25} name="Income" />
                                <Bar dataKey="expenses" fill={chartColors.secondary} radius={[4, 4, 0, 0]} barSize={25} name="Expenses" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card ai-insights-list">
                    <div className="ai-header">
                        <BarChart3 size={24} />
                        <h3>Strategic Advisory</h3>
                    </div>
                    <div className="insights-items">
                        {insights.advisory.map(item => (
                            <div key={item.id} className="insight-item">
                                <div className="insight-bullet" />
                                <p>{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="card detailed-breakdown">
                <div className="breakdown-header">
                    <h3>Detailed Breakdown (Actual vs Budget)</h3>
                    <button className="text-btn">Analysis by Category</button>
                </div>
                <div className="breakdown-bars">
                    {insights.sortedCategories.map((item, idx) => (
                        <div key={idx} className="breakdown-item">
                            <div className="item-labels">
                                <span className="item-name">{item.label}</span>
                                <span className="item-value">{item.value} / ₹{item.budget.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="item-bar-bg">
                                <div className="item-bar-fill" style={{ 
                                    width: `${Math.min(item.drillPct, 100)}%`,
                                    backgroundColor: item.drillPct > 100 ? 'var(--status-red)' : 'var(--status-green)'
                                }}></div>
                            </div>
                            <div className="item-status" style={{ color: item.status === 'Over Budget' ? 'var(--status-red)' : 'var(--status-green)', fontSize: '11px', fontWeight: '700', marginTop: '4px' }}>
                                {item.status.toUpperCase()} ({item.drillPct}%)
                            </div>
                        </div>
                    ))}
                    {insights.sortedCategories.length === 0 && <p className="empty-msg">No expense data available for this period.</p>}
                </div>
            </div>
        </div>
    );
};

export default InsightsPage;
