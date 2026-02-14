import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ToastContext = createContext(null);

let idCounter = 0;

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback(({ title, description, variant = 'success', duration = 3000 }) => {
        const id = ++idCounter;

        setToasts((current) => [
            ...current,
            {
                id,
                title,
                description,
                variant,
                duration
            }
        ]);

        return id;
    }, []);

    useEffect(() => {
        if (toasts.length === 0) return;

        const timers = toasts.map((toast) =>
            setTimeout(() => {
                removeToast(toast.id);
            }, toast.duration || 3000)
        );

        return () => {
            timers.forEach(clearTimeout);
        };
    }, [toasts, removeToast]);

    const value = { showToast, removeToast };

    return (
        <ToastContext.Provider value={value}>
            {children}

            {/* Toast viewport */}
            <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-3 max-w-sm">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`bg-white/95 backdrop-blur-sm border rounded-xl shadow-lg px-4 py-3 flex items-start gap-3 transition-transform duration-200`}
                    >
                        <div className="flex-1">
                            {toast.title && (
                                <p className="text-sm font-semibold text-gray-900">
                                    {toast.title}
                                </p>
                            )}
                            {toast.description && (
                                <p className="mt-0.5 text-xs text-gray-600">
                                    {toast.description}
                                </p>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => removeToast(toast.id)}
                            className="ml-2 text-gray-400 hover:text-gray-600 text-xs"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return ctx;
};

