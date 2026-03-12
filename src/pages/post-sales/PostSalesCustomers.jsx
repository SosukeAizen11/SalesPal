import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSpreadsheet, FileText, PenLine, MessageSquare, X, Upload, Sparkles, ArrowRight, CheckCircle2, Loader2, Check } from 'lucide-react';
import AddCustomerOptionCard from './components/AddCustomerOptionCard';
import PlainTextParser from './components/PlainTextParser';
import ExtractedDetailsView from './components/ExtractedDetailsView';

const PostSalesCustomers = () => {
    const [activeMethod, setActiveMethod] = useState(null);

    // Form States
    const [excelFile, setExcelFile] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [manualForm, setManualForm] = useState({ name: '', phone: '', amount: '', date: '' });

    // Processing & Success States
    const [isProcessing, setIsProcessing] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [extractedData, setExtractedData] = useState(null);

    const isManualValid = manualForm.name.trim() && manualForm.phone.trim() && manualForm.amount.trim() && manualForm.date.trim();

    const OPTIONS = [
        { id: 'excel', icon: <FileSpreadsheet className="w-6 h-6" />, title: 'Upload Excel / CSV', description: 'Upload your spreadsheet with customer payment data' },
        { id: 'pdf', icon: <FileText className="w-6 h-6" />, title: 'Upload PDF', description: 'Upload invoices or statements in PDF format' },
        { id: 'manual', icon: <PenLine className="w-6 h-6" />, title: 'Manual Entry', description: 'Enter customer details using a simple form' },
        { id: 'plaintext', icon: <MessageSquare className="w-6 h-6" />, title: 'Type in Plain Text', description: 'Just describe it like: "Amit owes 32,000. Paid 12,000. Balance due on 18th."' }
    ];

    const handleFileDrop = (e, setter) => {
        e.preventDefault();
        const file = e.dataTransfer?.files[0];
        if (file) setter(file);
    };

    const handleFileChange = (e, setter) => {
        const file = e.target.files[0];
        if (file) setter(file);
    };

    const processData = () => {
        setIsProcessing(true);
        // Simulate Processing Delay
        setTimeout(() => {
            setIsProcessing(false);
            setShowToast(true);

            // Generate extracted data purely from the form (no mock data)
            const extracted = {
                name: manualForm.name || '',
                phone: manualForm.phone || '',
                email: '',
                dueDate: manualForm.date ? new Date(manualForm.date).toISOString() : new Date().toISOString(),
                totalDue: parseInt(manualForm.amount) || 0,
                remaining: parseInt(manualForm.amount) || 0,
                status: 'New'
            };

            setExtractedData(extracted);

            // Auto close toast
            setTimeout(() => {
                setShowToast(false);
            }, 3000);
        }, 1500);
    };

    const resetFlow = () => {
        setExtractedData(null);
        setActiveMethod(null);
        setExcelFile(null);
        setPdfFile(null);
        setManualForm({ name: '', phone: '', amount: '', date: '' });
    };

    // Shared Button Style
    const SubmitButton = ({ disabled }) => (
        <button
            disabled={disabled || isProcessing}
            onClick={processData}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isProcessing ? 'bg-blue-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
            {isProcessing ? (
                <>
                    <Loader2 className="w-4 h-4 text-white/90 animate-spin" /> AI is thinking...
                </>
            ) : (
                <>
                    <Sparkles className="w-4 h-4 text-white/90" /> Process with AI <ArrowRight className="w-4 h-4 ml-1" />
                </>
            )}
        </button>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-12 py-8 px-4 relative">
            {/* Success Toast */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-8 right-8 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-gray-100 flex items-center gap-3 px-5 py-4 z-50 pointer-events-none"
                    >
                        <div className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5 text-white stroke-[3.5]" />
                        </div>
                        <span className="text-slate-800 font-semibold text-[15px] pr-2">AI successfully extracted the details!</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {!activeMethod && !extractedData && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
                    <div className="text-center space-y-3">
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">How would you like to add post-sale data?</h1>
                        <p className="text-gray-500 text-[15px]">Choose the method that works best for you</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
                        {OPTIONS.map((opt, i) => (
                            <motion.div key={opt.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="h-full">
                                <AddCustomerOptionCard {...opt} isActive={activeMethod === opt.id} onClick={() => setActiveMethod(opt.id)} />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            <AnimatePresence mode="wait">
                {extractedData && (
                    <motion.div key="extracted" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="max-w-4xl mx-auto">
                        <ExtractedDetailsView
                            customerData={extractedData}
                            onCancel={() => setExtractedData(null)}
                            onEdit={() => setExtractedData(null)}
                        />
                    </motion.div>
                )}

                {!extractedData && activeMethod === 'plaintext' && (
                    <motion.div key="plaintext" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="max-w-4xl mx-auto">
                        <button onClick={resetFlow} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 font-medium mb-4 transition-colors text-sm">
                            <X className="w-4 h-4" /> Back to methods
                        </button>
                        <PlainTextParser key="plaintext" onCancel={resetFlow}
                            onSuccess={(data) => {
                                setExtractedData(data);
                                setShowToast(true);
                                setTimeout(() => {
                                    setShowToast(false);
                                }, 3000);
                            }}
                        />
                    </motion.div>
                )}

                {!extractedData && activeMethod === 'excel' && (
                    <motion.div key="excel" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="max-w-4xl mx-auto">
                        <button onClick={resetFlow} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 font-medium mb-4 transition-colors text-sm">
                            <X className="w-4 h-4" /> Back to methods
                        </button>
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-gray-100"><h2 className="text-xl font-bold text-slate-800 tracking-tight">Upload Excel / CSV</h2></div>
                            <div className="p-8 md:p-12 flex-1 min-h-[360px] flex items-center justify-center">
                                <label
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => handleFileDrop(e, setExcelFile)}
                                    className={`w-full h-full border-2 border-dashed ${excelFile ? 'border-indigo-300 bg-indigo-50/30' : 'border-gray-200 hover:border-indigo-300'} rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors p-12`}
                                >
                                    <input type="file" className="hidden" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={(e) => handleFileChange(e, setExcelFile)} />
                                    {excelFile ? (
                                        <>
                                            <CheckCircle2 className="w-12 h-12 text-indigo-500 mb-3" />
                                            <p className="font-semibold text-slate-800">{excelFile.name}</p>
                                            <p className="text-sm text-gray-500 mt-1">Ready to process</p>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-10 h-10 text-slate-600 mb-4" strokeWidth={1.5} />
                                            <h3 className="font-semibold text-slate-800 text-[17px] mb-1">Drop your Excel/CSV file here</h3>
                                            <p className="text-gray-400 text-[15px] mb-6 font-medium">or click to browse</p>
                                            <div className="px-5 py-2.5 bg-gray-50 border border-gray-200 text-slate-700 rounded-lg text-[15px] font-semibold hover:bg-gray-100 transition-colors">Choose File</div>
                                        </>
                                    )}
                                </label>
                            </div>
                            <div className="p-5 border-t border-gray-100 flex items-center justify-end gap-3 bg-white mt-auto">
                                <button onClick={resetFlow} className="px-6 py-2 border border-gray-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
                                <SubmitButton disabled={!excelFile} />
                            </div>
                        </div>
                    </motion.div>
                )}

                {!extractedData && activeMethod === 'pdf' && (
                    <motion.div key="pdf" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="max-w-4xl mx-auto">
                        <button onClick={resetFlow} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 font-medium mb-4 transition-colors text-sm">
                            <X className="w-4 h-4" /> Back to methods
                        </button>
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-gray-100"><h2 className="text-xl font-bold text-slate-800 tracking-tight">Upload PDF</h2></div>
                            <div className="p-8 md:p-12 flex-1 min-h-[360px] flex items-center justify-center">
                                <label
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => handleFileDrop(e, setPdfFile)}
                                    className={`w-full h-full border-2 border-dashed ${pdfFile ? 'border-indigo-300 bg-indigo-50/30' : 'border-gray-200 hover:border-indigo-300'} rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors p-12`}
                                >
                                    <input type="file" className="hidden" accept=".pdf" onChange={(e) => handleFileChange(e, setPdfFile)} />
                                    {pdfFile ? (
                                        <>
                                            <CheckCircle2 className="w-12 h-12 text-indigo-500 mb-3" />
                                            <p className="font-semibold text-slate-800">{pdfFile.name}</p>
                                            <p className="text-sm text-gray-500 mt-1">Ready to process</p>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-10 h-10 text-slate-600 mb-4" strokeWidth={1.5} />
                                            <h3 className="font-semibold text-slate-800 text-[17px] mb-1">Drop your PDF file here</h3>
                                            <p className="text-gray-400 text-[15px] mb-6 font-medium">or click to browse</p>
                                            <div className="px-5 py-2.5 bg-gray-50 border border-gray-200 text-slate-700 rounded-lg text-[15px] font-semibold hover:bg-gray-100 transition-colors">Choose File</div>
                                        </>
                                    )}
                                </label>
                            </div>
                            <div className="p-5 border-t border-gray-100 flex items-center justify-end gap-3 bg-white mt-auto">
                                <button onClick={resetFlow} className="px-6 py-2 border border-gray-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
                                <SubmitButton disabled={!pdfFile} />
                            </div>
                        </div>
                    </motion.div>
                )}

                {!extractedData && activeMethod === 'manual' && (
                    <motion.div key="manual" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="max-w-4xl mx-auto">
                        <button onClick={resetFlow} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 font-medium mb-4 transition-colors text-sm">
                            <X className="w-4 h-4" /> Back to methods
                        </button>
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-gray-100"><h2 className="text-xl font-bold text-slate-800 tracking-tight">Enter Customer Details</h2></div>
                            <div className="p-8 space-y-6 flex-1 min-h-[360px] flex items-center justify-center">
                                <div className="w-full">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-slate-800">Customer Name <span className="text-gray-500">*</span></label>
                                            <input type="text" value={manualForm.name} onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })} placeholder="e.g., Amit Sharma" className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-colors placeholder:text-gray-400 text-sm" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-slate-800">Phone / WhatsApp <span className="text-gray-500">*</span></label>
                                            <input type="tel" value={manualForm.phone} onChange={(e) => setManualForm({ ...manualForm, phone: e.target.value })} placeholder="+91 98765 43210" className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-colors placeholder:text-gray-400 text-sm" />
                                        </div>
                                    </div>
                                    <div className="space-y-2 mb-6">
                                        <label className="block text-sm font-semibold text-slate-800">Email (optional)</label>
                                        <input type="email" placeholder="amit@email.com" className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-colors placeholder:text-gray-400 text-sm" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-slate-800">Total Amount <span className="text-gray-500">*</span></label>
                                            <input type="number" value={manualForm.amount} onChange={(e) => setManualForm({ ...manualForm, amount: e.target.value })} placeholder="32000" className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-colors placeholder:text-gray-400 text-sm" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-slate-800">Already Paid</label>
                                            <input type="number" placeholder="12000" className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-colors placeholder:text-gray-400 text-sm" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-slate-800">Due Date <span className="text-gray-500">*</span></label>
                                            <input type="date" value={manualForm.date} onChange={(e) => setManualForm({ ...manualForm, date: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-colors text-slate-700 text-sm" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 border-t border-gray-100 flex items-center justify-end gap-3 bg-white mt-auto">
                                <button onClick={resetFlow} className="px-6 py-2 border border-gray-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
                                <SubmitButton disabled={!isManualValid} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PostSalesCustomers;
