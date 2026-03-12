import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSpreadsheet, FileText, PenLine, MessageSquare, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AddCustomerOptionCard from './components/AddCustomerOptionCard';
import PlainTextParser from './components/PlainTextParser';

const AddCustomer = () => {
    const navigate = useNavigate();
    const [activeMethod, setActiveMethod] = useState(null);

    const OPTIONS = [
        {
            id: 'excel',
            icon: <FileSpreadsheet className="w-6 h-6" />,
            title: 'Upload Excel / CSV',
            description: 'Upload your spreadsheet with customer payment data'
        },
        {
            id: 'pdf',
            icon: <FileText className="w-6 h-6" />,
            title: 'Upload PDF',
            description: 'Upload invoices or statements in PDF format'
        },
        {
            id: 'manual',
            icon: <PenLine className="w-6 h-6" />,
            title: 'Manual Entry',
            description: 'Enter customer details using a simple form'
        },
        {
            id: 'plaintext',
            icon: <MessageSquare className="w-6 h-6" />,
            title: 'Type in Plain Text',
            description: 'Just describe it like: "Amit owes 32,000. Paid 12,000. Balance due on 18th."'
        }
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8 py-4">

            {/* Back & Header */}
            <div className="space-y-4">
                <button onClick={() => navigate('/post-sales')}
                    className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500 w-fit shrink-0">
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                        How would you like to add post-sale data?
                    </h1>
                    <p className="text-gray-500 mt-1.5">
                        Choose the method that works best for you
                    </p>
                </div>
            </div>

            {/* Grid of Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {OPTIONS.map((opt, i) => (
                    <motion.div key={opt.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <AddCustomerOptionCard
                            {...opt}
                            isActive={activeMethod === opt.id}
                            onClick={() => setActiveMethod(opt.id)}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Dynamic Render based on Selection */}
            <AnimatePresence mode="wait">
                {activeMethod === 'plaintext' && (
                    <PlainTextParser key="plaintext" />
                )}

                {/* Placeholder mock-ups for other methods */}
                {activeMethod === 'excel' && (
                    <motion.div key="excel" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-8">
                        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center text-gray-400">
                            <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 opacity-40 text-indigo-500" />
                            <p className="font-semibold text-gray-700">Drag and drop your Excel/CSV file here</p>
                            <p className="text-sm mt-1">or click to browse</p>
                        </div>
                    </motion.div>
                )}

                {activeMethod === 'pdf' && (
                    <motion.div key="pdf" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-8">
                        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center text-gray-400">
                            <FileText className="w-12 h-12 mx-auto mb-4 opacity-40 text-indigo-500" />
                            <p className="font-semibold text-gray-700">Drag and drop your PDF invoices here</p>
                            <p className="text-sm mt-1">or click to browse</p>
                        </div>
                    </motion.div>
                )}

                {activeMethod === 'manual' && (
                    <motion.div key="manual" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-8">
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                            <h3 className="font-semibold text-gray-800 mb-4 border-b border-gray-50 pb-4">Manual Entry Form</h3>
                            <div className="text-sm text-gray-400 py-6 text-center">Form fields go here (Name, Total Due, Paid, etc)</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AddCustomer;
