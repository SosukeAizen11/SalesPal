import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, CreditCard, Smartphone, Globe, Wallet, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PaymentModal = ({ isOpen, onClose, item }) => {
    const [step, setStep] = useState(1); // 1: Summary, 2: Method, 3: Processing, 4: Success
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) setStep(1);
    }, [isOpen]);

    if (!isOpen || !item) return null;

    // Price Calculation
    const cleanPrice = Number(String(item.price).replace(/,/g, ''));
    const gst = cleanPrice * 0.18;
    const convenienceFee = 0; // Mock 0 for now
    const total = cleanPrice + gst + convenienceFee;

    const handleProceed = () => {
        setStep(2);
    };

    const handlePayment = (method) => {
        setStep(3);
        // Simulate Payment Processing
        setTimeout(() => {
            setStep(4);
        }, 2000);
    };

    const handleClose = () => {
        onClose();
        if (step === 4) {
            // Refresh data or whatever
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-green-600" />
                        Secure Payment
                    </h3>
                    <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">

                    {/* STEP 1: SUMMARY */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <h4 className="font-semibold text-gray-900 mb-4">Order Summary</h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>{item.name || item.title}</span>
                                        <span className="font-medium">₹{cleanPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500">
                                        <span>GST (18%)</span>
                                        <span>₹{gst.toLocaleString()}</span>
                                    </div>
                                    {convenienceFee > 0 && (
                                        <div className="flex justify-between text-gray-500">
                                            <span>Convenience Fee</span>
                                            <span>₹{convenienceFee}</span>
                                        </div>
                                    )}
                                    <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between text-base font-bold text-gray-900">
                                        <span>Total Payable</span>
                                        <span>₹{total.toLocaleString()}</span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2 text-center">
                                    (Exclusive of GST & convenience fee)
                                </p>
                            </div>

                            <button
                                onClick={handleProceed}
                                className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                            >
                                Proceed to Pay ₹{total.toLocaleString()}
                            </button>
                        </div>
                    )}

                    {/* STEP 2: METHOD */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-500 font-medium">Select Payment Method</p>

                            <div className="grid gap-3">
                                {[
                                    { id: 'card', name: 'Credit / Debit Card', icon: CreditCard },
                                    { id: 'upi', name: 'UPI (GPay, PhonePe)', icon: Smartphone },
                                    { id: 'netbanking', name: 'Net Banking', icon: Globe },
                                    { id: 'wallet', name: 'Wallets', icon: Wallet }
                                ].map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() => handlePayment(method.id)}
                                        className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-left group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                                            <method.icon className="w-5 h-5 text-gray-600 group-hover:text-primary" />
                                        </div>
                                        <span className="font-medium text-gray-900">{method.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 3: PROCESSING */}
                    {step === 3 && (
                        <div className="py-12 flex flex-col items-center justify-center text-center">
                            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                            <h4 className="text-lg font-semibold text-gray-900">Processing Payment...</h4>
                            <p className="text-sm text-gray-500">Please do not close this window.</p>
                        </div>
                    )}

                    {/* STEP 4: SUCCESS */}
                    {step === 4 && (
                        <div className="py-8 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in-up">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-900">Payment Successful!</h4>
                                <p className="text-gray-500 mt-1">Your plan/credits have been activated.</p>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg w-full text-sm text-gray-600 border border-gray-100 mt-4 flex justify-between items-center">
                                <span>Transaction ID: <span className="font-mono text-gray-900">TXN_{Math.floor(Math.random() * 1000000)}</span></span>
                                <button className="text-blue-600 hover:text-blue-800 text-xs font-semibold hover:underline">
                                    Download Invoice
                                </button>
                            </div>

                            <button
                                onClick={handleClose}
                                className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all mt-4"
                            >
                                Done
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer / Trust Badges */}
                <div className="bg-gray-50 p-3 border-t border-gray-100 flex justify-center gap-4 text-gray-400">
                    <CreditCard className="w-4 h-4 opacity-50" />
                    <Smartphone className="w-4 h-4 opacity-50" />
                    <ShieldCheck className="w-4 h-4 opacity-50" />
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
