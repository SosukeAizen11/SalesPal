import React from 'react';
import { CreditCard, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';

const BillingTab = () => {
    const navigate = useNavigate();

    const billingInfo = {
        plan: 'SalesPal 360',
        billingCycle: 'Monthly',
        nextBillingDate: 'March 14, 2026',
        paymentMethod: {
            type: 'Visa',
            last4: '4242'
        },
        amount: '$99.00'
    };

    return (
        <div className="space-y-6">
            {/* Plan & Billing Card */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Plan & Billing</h2>

                <div className="space-y-6">
                    {/* Current Plan */}
                    <div className="flex items-start justify-between pb-6 border-b border-gray-200">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">{billingInfo.plan}</h3>
                                <Badge variant="primary" className="text-xs">Active</Badge>
                            </div>
                            <p className="text-sm text-gray-500">
                                {billingInfo.billingCycle} billing • {billingInfo.amount}/month
                            </p>
                        </div>
                        <Button
                            variant="secondary"
                            onClick={() => navigate('/subscription')}
                        >
                            Change Plan
                        </Button>
                    </div>

                    {/* Next Billing Date */}
                    <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Calendar size={24} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Next Billing Date</p>
                            <p className="text-lg font-semibold text-gray-900">{billingInfo.nextBillingDate}</p>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                            <CreditCard size={24} className="text-gray-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-700">Payment Method</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {billingInfo.paymentMethod.type} ending in {billingInfo.paymentMethod.last4}
                            </p>
                        </div>
                        <Button variant="ghost" size="sm">
                            Update
                        </Button>
                    </div>
                </div>

                {/* Manage Billing Button */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <Button
                        onClick={() => navigate('/subscription')}
                        className="w-full sm:w-auto"
                    >
                        Manage Billing
                        <ArrowRight size={16} className="ml-2" />
                    </Button>
                </div>
            </Card>

            {/* Billing History Card */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing History</h2>

                <div className="space-y-3">
                    {[
                        { date: 'Feb 14, 2026', amount: '$99.00', status: 'Paid', invoice: '#INV-001' },
                        { date: 'Jan 14, 2026', amount: '$99.00', status: 'Paid', invoice: '#INV-002' },
                        { date: 'Dec 14, 2025', amount: '$99.00', status: 'Paid', invoice: '#INV-003' }
                    ].map((transaction, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                                    <CreditCard size={20} className="text-gray-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{transaction.invoice}</p>
                                    <p className="text-sm text-gray-500">{transaction.date}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">{transaction.amount}</p>
                                    <Badge variant="success" className="text-xs mt-1">{transaction.status}</Badge>
                                </div>
                                <Button variant="ghost" size="sm">
                                    Download
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default BillingTab;
