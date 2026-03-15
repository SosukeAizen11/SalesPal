import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { usePostSales } from '../../context/PostSalesContext';

const formatCurrency = (a) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(a);
const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const formatRelativeTime = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Just now';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(dateString);
};

const statusBadge = {
    'Due Today': 'bg-red-50 text-red-700 ring-1 ring-red-200',
    'Upcoming': 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    'pending': 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    'Verified': 'bg-gray-50 text-gray-700 ring-1 ring-gray-200',
};

const CustomerRow = ({ customer }) => {
    const navigate = useNavigate();
    const { updateCustomer } = usePostSales();

    return (
        <tr className="hover:bg-gray-50/50 transition-colors">
            <td className="px-5 py-4">
                <p className="font-semibold text-gray-900 text-sm">{customer.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{customer.phone}</p>
            </td>
            <td className="px-4 py-4 font-medium text-gray-600">{formatCurrency(customer.totalDue)}</td>
            <td className={`px-4 py-4 font-semibold ${customer.remaining === 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {formatCurrency(customer.remaining)}
            </td>
            <td className="px-4 py-4 text-gray-500 text-xs">{formatDate(customer.dueDate)}</td>
            <td className="px-4 py-4">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadge[customer.status] || 'bg-gray-100 text-gray-600'}`}>
                    {customer.status === 'pending' ? 'Confirm Payment' : customer.status}
                </span>
            </td>
            <td className="px-4 py-4 text-gray-500 text-xs">{formatRelativeTime(customer.lastContact)}</td>
            <td className="px-5 py-4">
                <div className="flex items-center justify-center gap-2">
                    {customer.status === 'pending' ? (
                        <button onClick={() => updateCustomer(customer.id, { status: 'Verified', remaining: 0 })}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-lg transition-colors">
                            Confirm
                        </button>
                    ) : (
                        <button onClick={() => navigate('/post-sales/automations', { state: { customerId: customer.id } })}
                            className="w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-indigo-600 flex items-center justify-center transition-colors mx-auto">
                            <Bell className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default CustomerRow;
