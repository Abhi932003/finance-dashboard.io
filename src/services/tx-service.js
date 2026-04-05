// Mock Transaction Service with localStorage persistence
// Simulates asynchronous behavior with random network delays.

const STORAGE_KEY = 'bharat_ledger_data';
const ROLE_KEY = 'bharat_ledger_role';

const INITIAL_DATA = [
    { id: 1, date: '2024-05-24', description: 'BigBasket Online', category: 'Groceries', type: 'expense', amount: 3450.50 },
    { id: 2, date: '2024-05-22', description: 'Monthly Salary - Infosys', category: 'Income', type: 'income', amount: 125000.00 },
    { id: 3, date: '2024-05-20', description: 'Bescom Electricity Bill', category: 'Bills', type: 'expense', amount: 2450.20 },
    { id: 4, date: '2024-10-24', description: 'Nifty 50 Dividends', category: 'Investments', type: 'income', amount: 15400.00 },
    { id: 5, date: '2024-10-22', description: 'Prestige Apartment Rent', category: 'Housing', type: 'expense', amount: 45000.00 },
    { id: 6, date: '2024-10-20', description: 'Freelance Design Project', category: 'Business', type: 'income', amount: 65000.00 },
    { id: 7, date: '2024-10-19', description: 'Zomato - Biryani Central', category: 'Food', type: 'expense', amount: 1240.25 },
    { id: 8, date: '2024-10-18', description: 'IndiGo - BLR to Mumbai', category: 'Travel', type: 'expense', amount: 8500.00 },
];

// Helper for artificial delay
const delay = (ms = Math.random() * 400 + 200) => new Promise(res => setTimeout(res, ms));

export const txService = {
    // 1. Fetch all transactions
    getTransactions: async () => {
        await delay();
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
            return INITIAL_DATA;
        }
        return JSON.parse(raw);
    },

    // 2. Add or Update a transaction
    saveTransaction: async (tx) => {
        await delay();
        const raw = localStorage.getItem(STORAGE_KEY);
        const current = raw ? JSON.parse(raw) : INITIAL_DATA;
        
        let next;
        if (tx.id && current.find(t => t.id === tx.id)) {
            // Update
            next = current.map(t => t.id === tx.id ? { ...t, ...tx } : t);
        } else {
            // Create
            const newTx = { ...tx, id: tx.id || Date.now() };
            next = [newTx, ...current];
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
    },

    // 3. Delete a transaction
    deleteTransaction: async (id) => {
        await delay();
        const raw = localStorage.getItem(STORAGE_KEY);
        const current = raw ? JSON.parse(raw) : INITIAL_DATA;
        const next = current.filter(t => t.id !== id);
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
    },

    // 4. Role Persistence
    getRole: () => {
        return localStorage.getItem(ROLE_KEY) || 'Admin';
    },

    setRole: (role) => {
        localStorage.setItem(ROLE_KEY, role);
    }
};
