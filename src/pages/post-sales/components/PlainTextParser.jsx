import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Loader2, Check } from 'lucide-react';
import { usePostSales } from '../../../context/PostSalesContext';

const PlainTextParser = ({ onCancel, onSuccess }) => {
    const { addCustomer } = usePostSales();
    const [text, setText] = useState('');
    const [isParsing, setIsParsing] = useState(false);

    // Simulated AI parse logic
    const handleParse = () => {
        if (!text.trim()) return;

        setIsParsing(true);

        // Simulate AI delay
        setTimeout(() => {
            // For now, return an empty template since real AI parsing is bypassed
            const newCustomer = {
                name: '',
                phone: '',
                email: '',
                totalDue: 0,
                remaining: 0,
                dueDate: new Date().toISOString(),
                status: 'New'
            };

            setIsParsing(false);
            if (onSuccess) onSuccess(newCustomer);

        }, 1500);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="w-full">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Describe the Payment Details</h2>
                </div>

                {/* Content Area */}
                <div className="p-8 md:p-12 flex-1 min-h-[360px] flex flex-col justify-center">
                    <div className="space-y-3 w-full">
                        <label className="block text-sm font-semibold text-slate-800">
                            Describe the payment details in your own words
                        </label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            disabled={isParsing}
                            placeholder='e.g., "Amit owes 32,000. Paid 12,000. Balance due on 18th. His number is 9876543210."'
                            className="w-full h-32 p-4 bg-gray-50/50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-shadow text-sm text-slate-700 shadow-sm placeholder:text-gray-400 disabled:opacity-50"
                        />
                        <p className="text-[13px] text-gray-500 pt-1">
                            AI will extract customer name, phone, email, amounts, and due date from your text.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-gray-100 flex items-center justify-end gap-3 bg-white mt-auto">
                    <button
                        onClick={onCancel}
                        disabled={isParsing}
                        className="px-6 py-2 border border-gray-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleParse}
                        disabled={!text.trim() || isParsing}
                        className={`px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isParsing ? 'bg-blue-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                    >
                        {isParsing ? (
                            <>
                                <Loader2 className="w-4 h-4 text-white/90 animate-spin" /> AI is thinking...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 text-white/90" /> Process with AI <ArrowRight className="w-4 h-4 ml-1" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default PlainTextParser;
