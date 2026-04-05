import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Calendar, 
  Filter, 
  ChevronDown, 
  Pencil, 
  Trash2, 
  Plus,
  ChevronLeft,
  ChevronRight,
  Home as HomeIcon,
  ShoppingBag,
  Zap,
  Coffee,
  Landmark,
  TrendingUp,
  Wallet,
  Car,
  Utensils,
  Target
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { exportService } from '../services/export-service';
import AddTransactionModal from '../components/AddTransactionModal';
import './TransactionsPage.css';
import { Download, FileText, Database, Layers, List } from 'lucide-react';

const ITEMS_PER_PAGE = 8;

const TransactionsPage = () => {
    const { 
        transactions, 
        addTransaction, 
        deleteTransaction, 
        role, 
        loading 
    } = useDashboard();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [filterCategory, setFilterCategory] = useState('All');
    const [isGrouped, setIsGrouped] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTx, setEditingTx] = useState(null);
    
    // Derived Categories
    const categories = useMemo(() => {
        const cats = new Set(transactions.map(t => t.category));
        return ['All', ...Array.from(cats)];
    }, [transactions]);

    // Filter logic
    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx => {
            const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType === 'All' || tx.type.toLowerCase() === filterType.toLowerCase();
            const matchesCategory = filterCategory === 'All' || tx.category === filterCategory;
            return matchesSearch && matchesType && matchesCategory;
        });
    }, [transactions, searchTerm, filterType, filterCategory]);

    // Grouping Logic
    const groupedTransactions = useMemo(() => {
        if (!isGrouped) return null;
        const groups = {};
        filteredTransactions.forEach(tx => {
            if (!groups[tx.category]) groups[tx.category] = { category: tx.category, amount: 0, items: [] };
            groups[tx.category].amount += tx.type === 'expense' ? -tx.amount : tx.amount;
            groups[tx.category].items.push(tx);
        });
        return Object.values(groups);
    }, [filteredTransactions, isGrouped]);

    // Pagination logic
    const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
    const paginatedTxs = filteredTransactions.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleDelete = async (id) => {
        if (role !== 'Admin') return;
        if (window.confirm('Are you sure you want to delete this transaction from the ledger?')) {
            await deleteTransaction(id);
        }
    };

    const handleAdd = () => {
        if (role !== 'Admin') return;
        setEditingTx(null);
        setIsModalOpen(true);
    };

    const handleEdit = (tx) => {
        if (role !== 'Admin') return;
        setEditingTx(tx);
        setIsModalOpen(true);
    };

    const handleSave = async (txData) => {
        await addTransaction(txData);
        if (!editingTx) setCurrentPage(1); // Back to page 1 for new entries
    };

    const getCategoryIcon = (category) => {
        switch (category.toLowerCase()) {
            case 'groceries': return <ShoppingBag size={14} />;
            case 'income': return <Landmark size={14} />;
            case 'bills': return <Zap size={14} />;
            case 'investments': return <TrendingUp size={14} />;
            case 'housing': return <HomeIcon size={14} />;
            case 'food': return <Utensils size={14} />;
            case 'travel': return <Car size={14} />;
            case 'business': return <Wallet size={14} />;
            default: return <Target size={14} />;
        }
    };

    return (
        <div className="transactions-page fade-in">
            <div className="page-header-tx">
                <div>
                    <h1>Ledger Management</h1>
                    <p>Financial history for <strong>{role === 'Admin' ? 'Bharat Administrator' : 'Viewer Account'}</strong></p>
                </div>
                
                <div className="action-bar-tx">
                    <button className="btn-utility-tx" onClick={() => setIsGrouped(!isGrouped)} title="Toggle category grouping">
                        {isGrouped ? <List size={18} /> : <Layers size={18} />}
                        {isGrouped ? 'Show Flat List' : 'Group by Category'}
                    </button>
                    
                    <div className="export-btns">
                        <button className="btn-utility-tx" onClick={() => exportService.exportLedgerAsCSV(filteredTransactions)}>
                            <FileText size={18} />
                            CSV
                        </button>
                        <button className="btn-utility-tx" onClick={() => exportService.exportLedgerAsJSON(filteredTransactions)}>
                            <Database size={18} />
                            JSON
                        </button>
                    </div>

                    {role === 'Admin' ? (
                        <button className="btn-new-tx-top" onClick={handleAdd}>
                            <Plus size={18} />
                            Append Entry
                        </button>
                    ) : (
                        <div className="read-only-badge">READ ONLY ACCESS</div>
                    )}
                </div>
            </div>

            <div className="filters-container card">
                <div className="search-ledger">
                    <label>SEARCH DESCRIPTION</label>
                    <div className="search-input-tx">
                        <Search size={16} />
                        <input 
                            type="text" 
                            placeholder="Find description..." 
                            value={searchTerm}
                            onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                        />
                    </div>
                </div>

                <div className="filter-group">
                    <label>LEDGER CATEGORY</label>
                    <div className="select-wrapper-tx">
                        <select 
                            className="filter-select-tx"
                            value={filterCategory}
                            onChange={(e) => {setFilterCategory(e.target.value); setCurrentPage(1);}}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <ChevronDown size={16} className="select-arrow-tx" />
                    </div>
                </div>

                <div className="filter-group-type">
                    <label>TRANSACTION TYPE</label>
                    <div className="type-toggle">
                        <button 
                            className={`type-btn ${filterType === 'Income' ? 'active income' : ''}`}
                            onClick={() => {setFilterType(filterType === 'Income' ? 'All' : 'Income'); setCurrentPage(1);}}
                        >
                            INCOME
                        </button>
                        <button 
                            className={`type-btn ${filterType === 'Expense' ? 'active expense' : ''}`}
                            onClick={() => {setFilterType(filterType === 'Expense' ? 'All' : 'Expense'); setCurrentPage(1);}}
                        >
                            EXPENSE
                        </button>
                    </div>
                </div>
            </div>

            <div className="transactions-card card">
                <div className="table-responsive">
                    <table className="tx-table">
                        <thead>
                            <tr>
                                <th>DATE</th>
                                <th>DESCRIPTION</th>
                                <th>CATEGORY</th>
                                <th>TYPE</th>
                                <th>AMOUNT</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isGrouped ? (
                                groupedTransactions.map(group => (
                                    <React.Fragment key={group.category}>
                                        <tr className="group-header-row">
                                            <td colSpan="4" className="group-title">
                                                {getCategoryIcon(group.category)}
                                                {group.category.toUpperCase()}
                                            </td>
                                            <td className={`group-total ${group.amount < 0 ? 'expense' : 'income'}`}>
                                                {group.amount < 0 ? '-' : '+'}₹{Math.abs(group.amount).toLocaleString('en-IN', {minimumFractionDigits: 2})}
                                            </td>
                                            <td></td>
                                        </tr>
                                        {group.items.map(tx => (
                                            <tr key={tx.id} className="grouped-item-row">
                                                <td className="tx-date">{tx.date}</td>
                                                <td className="tx-desc-cell">
                                                    <div className="tx-desc-main">{tx.description}</div>
                                                </td>
                                                <td></td> {/* Category handled by header */}
                                                <td>
                                                    <span className={`type-tag ${tx.type}`}>
                                                        {tx.type.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className={`tx-amount-cell ${tx.type}`}>
                                                    {tx.type === 'expense' ? '-' : '+'}₹{tx.amount.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                                                </td>
                                                <td>
                                                    <div className="tx-actions">
                                                        {role === 'Admin' ? (
                                                            <>
                                                                <button className="action-btn" onClick={() => handleEdit(tx)} title="Edit entry"><Pencil size={14} /></button>
                                                                <button className="action-btn delete" onClick={() => handleDelete(tx.id)} title="Remove entry"><Trash2 size={14} /></button>
                                                            </>
                                                        ) : (
                                                            <span className="lock-icon" title="Permissions required"><Plus size={14} style={{transform: 'rotate(45deg)', opacity: 0.5}} /></span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))
                            ) : paginatedTxs.length > 0 ? (
                                paginatedTxs.map(tx => (
                                    <tr key={tx.id}>
                                        <td className="tx-date">{tx.date}</td>
                                        <td className="tx-desc-cell">
                                            <div className="tx-desc-main">{tx.description}</div>
                                            <div className="tx-desc-sub">Reference ID: TX-{tx.id.toString().slice(-6)}</div>
                                        </td>
                                        <td className="tx-category-cell">
                                            <div className="category-tag">
                                                {getCategoryIcon(tx.category)}
                                                <span>{tx.category}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`type-tag ${tx.type}`}>
                                                {tx.type.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className={`tx-amount-cell ${tx.type}`}>
                                            {tx.type === 'expense' ? '-' : '+'}₹{tx.amount.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                                        </td>
                                        <td>
                                            <div className="tx-actions">
                                                {role === 'Admin' ? (
                                                    <>
                                                        <button className="action-btn" onClick={() => handleEdit(tx)} title="Edit entry"><Pencil size={16} /></button>
                                                        <button className="action-btn delete" onClick={() => handleDelete(tx.id)} title="Remove entry"><Trash2 size={16} /></button>
                                                    </>
                                                ) : (
                                                    <span className="lock-icon" title="Permissions required"><Plus size={16} style={{transform: 'rotate(45deg)', opacity: 0.5}} /></span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="empty-state">
                                        No entries match your filtering criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="pagination">
                    <span>Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)} of {filteredTransactions.length} records</span>
                    <div className="pagination-ctrls">
                        <button 
                            className="page-nav" 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                            <ChevronLeft size={18} />
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button 
                                key={page} 
                                className={`page-num ${currentPage === page ? 'active' : ''}`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}
                        
                        <button 
                            className="page-nav" 
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
            <AddTransactionModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSave}
                transactionToEdit={editingTx}
            />
        </div>
    );
};

export default TransactionsPage;
