import React from 'react';
import { FileText, Download, ArrowRight, CheckCircle2 } from 'lucide-react';

const RECENT_INVOICES = [
    { id: 'INV-2026-003', date: 'Feb 01, 2026', amount: '7,079', status: 'Paid' },
    { id: 'INV-2026-002', date: 'Jan 15, 2026', amount: '1,769', status: 'Paid' },
];

const RecentInvoicesCard = ({ onViewAll }) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-500" /> Recent Invoices
                </h3>
                <button
                    onClick={onViewAll}
                    className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center hover:underline"
                >
                    View All <ArrowRight className="w-3 h-3 ml-1" />
                </button>
            </div>

            <div className="space-y-3">
                {RECENT_INVOICES.map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100">
                        <div>
                            <div className="text-sm font-semibold text-gray-900">₹{inv.amount}</div>
                            <div className="text-xs text-gray-500">{inv.date}</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700 border border-green-200">
                                <CheckCircle2 className="w-2.5 h-2.5" /> {inv.status}
                            </span>
                            <button className="text-gray-400 hover:text-gray-600 transition-colors" title="Download Invoice">
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentInvoicesCard;
