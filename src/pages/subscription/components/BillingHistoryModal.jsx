import React from 'react';
import { X, Download, FileText, CheckCircle2 } from 'lucide-react';

const INVOICES = [
    { id: 'INV-2026-003', date: 'Feb 01, 2026', item: 'SalesPal Marketing Plan (Monthly)', amount: '7,079', status: 'Paid' },
    { id: 'INV-2026-002', date: 'Jan 15, 2026', item: 'Top-Up: 200 WhatsApp Conversations', amount: '1,769', status: 'Paid' },
    { id: 'INV-2026-001', date: 'Jan 01, 2026', item: 'SalesPal Marketing Plan (Monthly)', amount: '7,079', status: 'Paid' },
    { id: 'INV-2025-012', date: 'Dec 01, 2025', item: 'SalesPal Marketing Plan (Monthly)', amount: '7,079', status: 'Paid' },
];

const BillingHistoryModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const handleDownload = (id) => {
        alert(`Downloading invoice ${id}... (Mock PDF)`);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <FileText className="w-6 h-6 text-gray-700" />
                            Billing History
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">View and download past invoices.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Table Content */}
                <div className="overflow-y-auto p-6">
                    <div className="overflow-hidden border border-gray-200 rounded-xl">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 text-sm">
                                {INVOICES.map((invoice) => (
                                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600 font-medium">
                                            {invoice.date}
                                        </td>
                                        <td className="px-6 py-4 text-gray-900 font-medium">
                                            {invoice.item}
                                            <div className="text-xs text-gray-400 mt-0.5">{invoice.id}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-bold">
                                            ₹{invoice.amount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                <CheckCircle2 className="w-3 h-3" /> {invoice.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => handleDownload(invoice.id)}
                                                className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-1.5 transition-colors p-1.5 hover:bg-blue-50 rounded-lg"
                                                title="Download PDF"
                                            >
                                                <Download className="w-4 h-4" /> Download
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BillingHistoryModal;
