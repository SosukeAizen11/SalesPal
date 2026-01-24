import React from 'react';
import { DollarSign, Users, TrendingUp, Target } from 'lucide-react';

export default function CampaignOverview({ campaign }) {
    const { dailyBudget, leads, totalSpend, cpl } = campaign || {};

    const metrics = [
        {
            label: 'Daily Budget',
            value: dailyBudget || '₹0',
            icon: DollarSign,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            label: 'Leads Generated',
            value: leads || '0',
            icon: Users,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
        },
        {
            label: 'Spend So Far',
            value: totalSpend || '₹0',
            icon: TrendingUp,
            color: 'text-purple-600',
            bg: 'bg-purple-50'
        },
        {
            label: 'Cost Per Lead',
            value: cpl || '₹0',
            icon: Target,
            color: 'text-amber-600',
            bg: 'bg-amber-50'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {metrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                    <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 rounded-lg ${metric.bg}`}>
                                <Icon className={`w-5 h-5 ${metric.color}`} />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">{metric.label}</p>
                            <h3 className="text-2xl font-bold text-slate-900">{metric.value}</h3>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
