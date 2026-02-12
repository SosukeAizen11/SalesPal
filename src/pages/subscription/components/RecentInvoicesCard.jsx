import React from 'react';
import { FileText, Download, ArrowRight, CheckCircle2 } from 'lucide-react';

const RECENT_INVOICES = [
    { id: 'INV-2026-003', date: 'Feb 01, 2026', amount: '7,079', status: 'Paid' },
    { id: 'INV-2026-002', date: 'Jan 15, 2026', amount: '1,769', status: 'Paid' },
];

const RecentInvoicesCard = ({ onViewAll }) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" /> Recent Invoices
                </h3>
                <button
                    onClick={onViewAll}
                    className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 flex items-center transition-colors"
                >
                    View All <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </button>
            </div>

            <div className="space-y-4">
                {RECENT_INVOICES.map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-all border border-gray-100 group">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors">
                                <FileText className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">₹{inv.amount}</div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{inv.date}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                                <CheckCircle2 className="w-3 h-3" /> {inv.status}
                            </span>
                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all" title="Download PDF">
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
