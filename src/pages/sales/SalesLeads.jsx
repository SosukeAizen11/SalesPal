import React from 'react';
import { useSales } from '../../context/SalesContext';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const statuses = ['New', 'Contacted', 'Interested', 'Qualified', 'Lost', 'Won'];

const statusColors = {
    Won: 'bg-green-100 text-green-800',
    Lost: 'bg-red-100 text-red-800',
    New: 'bg-blue-100 text-blue-800',
    Qualified: 'bg-emerald-100 text-emerald-800',
    Contacted: 'bg-indigo-100 text-indigo-800',
    Interested: 'bg-orange-100 text-orange-800',
};

const SalesLeads = () => {
    const { leads, updateLeadStatus } = useSales();
    const navigate = useNavigate();

    return (
        <div className="font-sans text-gray-900 pb-12">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-4 border-b border-gray-100 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Leads Management</h1>
                    <p className="text-gray-500 mt-1">Click any row to open the full lead workspace.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto w-full min-h-[400px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider bg-gray-50/60">
                                <th className="py-3 px-5 font-medium">Name</th>
                                <th className="py-3 px-5 font-medium">Phone</th>
                                <th className="py-3 px-5 font-medium">Source</th>
                                <th className="py-3 px-5 font-medium">Project</th>
                                <th className="py-3 px-5 font-medium">Campaign</th>
                                <th className="py-3 px-5 font-medium">Status</th>
                                <th className="py-3 px-5 font-medium">Assigned To</th>
                                <th className="py-3 px-5 font-medium">Created Date</th>
                                <th className="py-3 px-5 font-medium text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-50">
                            {leads.map((lead) => (
                                <tr
                                    key={lead.id}
                                    onClick={() => navigate(`/sales/leads/${lead.id}`)}
                                    className="hover:bg-blue-50/30 cursor-pointer transition-colors group"
                                >
                                    <td className="py-3.5 px-5">
                                        <span className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                                            {lead.name}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-5 text-gray-600 whitespace-nowrap">{lead.phone}</td>
                                    <td className="py-3.5 px-5 text-gray-600 whitespace-nowrap">{lead.source}</td>
                                    <td className="py-3.5 px-5 text-gray-600">{lead.project}</td>
                                    <td className="py-3.5 px-5 text-gray-600">{lead.campaign}</td>
                                    <td className="py-3.5 px-5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                        <select
                                            className={`text-xs font-semibold rounded-full px-2.5 py-1 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 border-0 ${statusColors[lead.status] || 'bg-gray-100 text-gray-800'}`}
                                            value={lead.status}
                                            onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                        >
                                            {statuses.map(s => (
                                                <option key={s} value={s}>{s === 'Won' ? 'Converted' : s}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="py-3.5 px-5 text-gray-600 whitespace-nowrap">{lead.assignedTo}</td>
                                    <td className="py-3.5 px-5 text-gray-600 whitespace-nowrap">
                                        {new Date(lead.createdDate).toLocaleDateString()}
                                    </td>
                                    <td className="py-3.5 px-5 text-right">
                                        <ChevronRight
                                            className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors ml-auto"
                                        />
                                    </td>
                                </tr>
                            ))}
                            {leads.length === 0 && (
                                <tr>
                                    <td colSpan="9" className="py-12 text-center text-gray-400 italic">
                                        No leads available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SalesLeads;
