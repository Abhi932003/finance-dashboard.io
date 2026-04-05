import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, AlertCircle } from 'lucide-react';
import './AddTransactionModal.css';

const AddTransactionModal = ({ isOpen, onClose, onSave, transactionToEdit }) => {
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: 'Miscellaneous',
        type: 'expense'
    });
    
    const [errors, setErrors] = useState({});

    const categories = [
        'Groceries', 'Income', 'Bills', 'Investments', 
        'Housing', 'Food', 'Travel', 'Business', 
        'Entertainment', 'Health', 'Transport', 'Miscellaneous'
    ];

    useEffect(() => {
        if (transactionToEdit) {
            setFormData({
                description: transactionToEdit.description || '',
                amount: transactionToEdit.amount?.toString() || '',
                date: transactionToEdit.date || new Date().toISOString().split('T')[0],
                category: transactionToEdit.category || 'Miscellaneous',
                type: transactionToEdit.type || 'expense'
            });
        } else {
            setFormData({
                description: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                category: 'Miscellaneous',
                type: 'expense'
            });
        }
        setErrors({});
    }, [transactionToEdit, isOpen]);

    if (!isOpen) return null;

    const validate = () => {
        const newErrors = {};
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.amount || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
            newErrors.amount = 'Valid amount is required';
        }
        if (!formData.date) newErrors.date = 'Date is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSave({
                ...formData,
                id: transactionToEdit?.id,
                amount: parseFloat(formData.amount)
            });
            onClose();
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content card fade-in" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{transactionToEdit ? 'Update Ledger Entry' : 'New Ledger Entry'}</h3>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group full-width">
                        <label>Description</label>
                        <input 
                            type="text" 
                            name="description"
                            placeholder="Nature of transaction..."
                            value={formData.description}
                            onChange={handleChange}
                            className={errors.description ? 'error' : ''}
                        />
                        {errors.description && <span className="error-text"><AlertCircle size={12} /> {errors.description}</span>}
                    </div>

                    <div className="form-row">
                        <div className="form-group mb-0">
                            <label>Amount (₹)</label>
                            <input 
                                type="number" 
                                name="amount"
                                step="0.01"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={handleChange}
                                className={errors.amount ? 'error' : ''}
                            />
                            {errors.amount && <span className="error-text"><AlertCircle size={12} /> {errors.amount}</span>}
                        </div>

                        <div className="form-group mb-0">
                            <label>Transaction Type</label>
                            <div className="segmented-control">
                                <button 
                                    type="button" 
                                    className={formData.type === 'income' ? 'active income' : ''}
                                    onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
                                >
                                    Income
                                </button>
                                <button 
                                    type="button" 
                                    className={formData.type === 'expense' ? 'active expense' : ''}
                                    onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
                                >
                                    Expense
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group mb-0">
                            <label>Date</label>
                            <input 
                                type="date" 
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className={errors.date ? 'error' : ''}
                            />
                            {errors.date && <span className="error-text"><AlertCircle size={12} /> {errors.date}</span>}
                        </div>

                        <div className="form-group mb-0">
                            <label>Category</label>
                            <select 
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Discard</button>
                        <button type="submit" className="btn-save">
                            <Save size={18} />
                            {transactionToEdit ? 'Commit Changes' : 'Append to Ledger'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default AddTransactionModal;
