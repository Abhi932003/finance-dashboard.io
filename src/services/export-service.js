// Professional Data Export Service for CSV and JSON

export const exportService = {
    // 1. Array to CSV Conversion
    toCSV: (data) => {
        if (!data || !data.length) return '';
        
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(row => {
            return Object.values(row).map(val => {
                // Handle commas/strings in descriptions
                const str = String(val).replace(/"/g, '""');
                return `"${str}"`;
            }).join(',');
        });
        
        return [headers, ...rows].join('\n');
    },

    // 2. Browser File Download Helper
    downloadFile: (content, fileName, contentType) => {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    // 3. High-level export actions
    exportLedgerAsCSV: (transactions) => {
        const csv = exportService.toCSV(transactions);
        exportService.downloadFile(csv, `sovereign-ledger-${Date.now()}.csv`, 'text/csv;charset=utf-8;');
    },

    exportLedgerAsJSON: (transactions) => {
        const json = JSON.stringify(transactions, null, 2);
        exportService.downloadFile(json, `sovereign-ledger-${Date.now()}.json`, 'application/json;charset=utf-8;');
    }
};
