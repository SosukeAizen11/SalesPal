import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSales } from '../../context/SalesContext';

import { AnimatePresence } from 'framer-motion';
import {
    Users,
    Phone,
    MessageSquare,
    PieChart as PieChartIcon,
    Clock,
    Zap,
    DownloadCloud,
    Filter,
    X,
    Cpu,
    CheckCircle,
    Activity,
    BrainCircuit,
    ThumbsUp,
    ShieldAlert,
    ChevronRight,
    Calendar,
    FileText,
    Mic,
    MessageCircle,
    BarChart3,
    Volume2,
    Send,
    Check
} from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

const SalesDashboard = () => {
    const { leads } = useSales();
    const navigate = useNavigate();

    // UI States
    const [filterStatus, setFilterStatus] = useState('All');
    const [actionModal, setActionModal] = useState(null); // { type, lead }

    const handleAction = (type, lead) => {
        setActionModal({ type, lead });
    };

    // Metrics calculation
    const metrics = useMemo(() => {
        const totalLeads = leads.length;
        const hotLeads = leads.filter(l => l.scoreLabel === 'Hot').length;
        const callCount = 124; // Mock
        const waCount = 312; // Mock
        const dealsClosed = leads.filter(l => l.status === 'Converted').length;
        const pendingFollowups = leads.filter(l => ['New', 'Contacted'].includes(l.status)).length;

        // Lead Sources
        const sourceMap = {};
        leads.forEach(l => {
            sourceMap[l.source] = (sourceMap[l.source] || 0) + 1;
        });

        // Ensure all required sources are represented for UI purposes
        const predefinedSources = ['Meta Ads', 'Google Ads', 'Website', 'Manual Entry', 'WhatsApp', 'CSV Upload'];
        predefinedSources.forEach(s => {
            if (!sourceMap[s]) sourceMap[s] = 0;
        });

        const sourceData = Object.entries(sourceMap).map(([name, value]) => ({ name, value })).filter(d => d.value > 0);

        return {
            totalLeads,
            hotLeads,
            callCount,
            waCount,
            dealsClosed,
            pendingFollowups,
            sourceData,
            sourceMap
        };
    }, [leads]);

    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#0088FE'];

    // Filtering logic for the Leads Table
    const filteredLeads = useMemo(() => {
        if (filterStatus === 'All') return leads;
        if (['Hot', 'Warm', 'Cold'].includes(filterStatus)) {
            return leads.filter(l => l.scoreLabel === filterStatus);
        }
        return leads.filter(l => l.status === filterStatus);
    }, [leads, filterStatus]);



    const renderActionModal = () => {
        if (!actionModal) return null;

        const { type, lead } = actionModal;

        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
                    onClick={() => setActionModal(null)}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className={`bg-white rounded-2xl shadow-xl overflow-hidden w-full ${type === 'whatsapp' || type === 'whatsappLogs' ? 'max-w-md' : 'max-w-sm'}`}
                    >
                        {type === 'call' && (
                            <div className="flex flex-col h-full bg-gradient-to-b from-blue-900 to-blue-950 text-white relative">
                                <button onClick={() => setActionModal(null)} className="absolute top-4 right-4 text-white/50 hover:text-white bg-white/10 p-2 rounded-full transition-colors"><X size={16} /></button>
                                <div className="p-8 flex flex-col items-center justify-center text-center mt-4">
                                    <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-6 relative">
                                        <div className="absolute inset-0 rounded-full border-4 border-emerald-500/40 animate-ping"></div>
                                        <Phone size={40} className="text-white relative z-10" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-1">{lead?.name || 'Unknown Contact'}</h3>
                                    <p className="text-blue-200 font-medium tracking-widest">{lead?.phone || '+91 98XXXXXX'}</p>

                                    <div className="flex items-center gap-2 mt-8 text-emerald-300 text-sm font-bold bg-white/10 px-4 py-2 rounded-full border border-white/10">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                        Connecting to AI Agent...
                                    </div>
                                </div>
                                <div className="p-8 mt-4 flex justify-center gap-6 pb-12">
                                    <button className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors shadow-inner text-white/70 hover:text-white">
                                        <Mic size={24} />
                                    </button>
                                    <button onClick={() => setActionModal(null)} className="w-16 h-16 bg-red-500 hover:bg-red-600 shadow-xl shadow-red-500/20 rounded-full flex items-center justify-center transition-transform hover:scale-105">
                                        <Phone size={28} className="rotate-[135deg]" />
                                    </button>
                                    <button className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors shadow-inner text-white/70 hover:text-white">
                                        <Volume2 size={24} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {type === 'whatsapp' && (
                            <div className="flex flex-col h-[500px]">
                                <div className="bg-[#075E54] text-white p-4 flex items-center gap-4 shadow-md z-10">
                                    <button onClick={() => setActionModal(null)} className="text-white/80 hover:text-white transition-colors"><X size={20} /></button>
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                                        <Users size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-sm leading-tight">{lead?.name || 'Contact'}</h3>
                                        <p className="text-xs text-white/70">Online</p>
                                    </div>
                                </div>
                                <div className="flex-1 bg-[#ECE5DD] p-4 overflow-y-auto space-y-4 flex flex-col pt-6">
                                    <div className="flex justify-center mb-2">
                                        <span className="bg-[#E1F3FB] text-gray-600 shadow-sm text-[11px] font-bold px-3 py-1 rounded-lg">Today</span>
                                    </div>
                                    <div className="bg-white max-w-[85%] self-start p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-gray-800">
                                        Hi, I was looking at the new project details.
                                        <div className="text-[10px] text-gray-400 text-right mt-1">10:45 AM</div>
                                    </div>
                                    <div className="bg-[#DCF8C6] max-w-[85%] self-end p-3 rounded-2xl rounded-tr-none shadow-sm text-sm text-gray-800">
                                        Hello {lead?.name?.split(' ')[0] || ''}, thanks for your interest! Allow me to send over our newest digital brochure. 👇
                                        <div className="text-[10px] text-gray-500 text-right mt-1 flex items-center justify-end gap-1">
                                            10:46 AM <Check size={12} className="text-blue-500" />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 bg-gray-100 flex items-center gap-3">
                                    <div className="bg-white rounded-full flex-1 flex items-center px-4 py-2 shadow-sm border border-gray-200">
                                        <input type="text" placeholder="Type a message..." className="w-full text-sm outline-none bg-transparent" />
                                        <FileText size={18} className="text-gray-400 rotate-45 transform ml-2 cursor-pointer hover:text-gray-600" />
                                    </div>
                                    <button className="w-10 h-10 bg-[#128C7E] text-white rounded-full flex items-center justify-center shrink-0 hover:bg-[#075E54] transition-colors shadow-sm">
                                        <Send size={16} className="ml-1" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {type === 'schedule' && (
                            <div className="p-6 text-left">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Calendar size={20} className="text-indigo-600" /> Schedule Meeting</h3>
                                    <button onClick={() => setActionModal(null)} className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"><X size={16} /></button>
                                </div>
                                <div className="space-y-5">
                                    <p className="text-sm text-gray-600">Creating appointment for <span className="font-bold text-gray-900">{lead?.name}</span></p>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Date</label>
                                        <input type="date" className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-900 outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100 transition-all font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Time Slot (AI Verified)</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM', '06:00 PM'].map(time => (
                                                <button key={time} className="py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all bg-white shadow-sm">
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <button onClick={() => setActionModal(null)} className="w-full py-3 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2">
                                        <Check size={18} /> Confirm Appointment
                                    </button>
                                </div>
                            </div>
                        )}

                        {type === 'note' && (
                            <div className="p-6 text-left">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2"><FileText size={20} className="text-gray-600" /> Add Quick Note</h3>
                                    <button onClick={() => setActionModal(null)} className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"><X size={16} /></button>
                                </div>
                                <div className="space-y-4">
                                    <textarea
                                        rows="5"
                                        className="w-full p-4 border border-gray-200 rounded-lg text-sm font-medium bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none leading-relaxed"
                                        placeholder={`Enter CRM insights or tags for ${lead?.name || 'Contact'}...`}
                                    ></textarea>
                                    <button onClick={() => setActionModal(null)} className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-lg shadow-sm transition-colors">
                                        Save Note
                                    </button>
                                </div>
                            </div>
                        )}

                        {(type === 'callLogs' || type === 'whatsappLogs' || type === 'analytics' || type === 'templates') && (
                            <div className="p-8 text-center text-left">
                                <div className="flex justify-end mb-2">
                                    <button onClick={() => setActionModal(null)} className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"><X size={16} /></button>
                                </div>
                                <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 shadow-sm border ${type === 'callLogs' || type === 'analytics' ? 'bg-indigo-50 text-indigo-500 border-indigo-100' : 'bg-green-50 text-green-500 border-green-100'}`}>
                                    {(type === 'callLogs' || type === 'analytics') ? <Phone size={32} /> : <MessageSquare size={32} />}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Global {type === 'callLogs' ? 'Call' : type === 'whatsappLogs' ? 'Chat' : type === 'analytics' ? 'Analytics' : 'Templates'} Metrics
                                </h3>
                                <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-[280px] mx-auto">
                                    The global activity stream is monitored passively. Click individual leads to view detailed deep-dive reports.
                                </p>
                                <button onClick={() => setActionModal(null)} className="mt-8 px-6 py-2.5 bg-gray-100 font-bold text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">Dismiss</button>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        );
    }

    return (
        <div className="font-sans text-gray-900 pb-12">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Activity className="text-blue-600" /> Sales Dashboard
                </h1>
                <p className="text-gray-500 mt-1">AI-powered unified sales operations</p>
            </div>

            {/* SECTION 1 – TOP METRICS */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
                <MetricCard title="Total Leads" value={metrics.totalLeads} desc="All captured leads" actionText="View Leads" icon={Users} color="text-blue-600" bg="bg-blue-50" onClick={() => navigate('/sales/leads')} />
                <MetricCard title="Hot Leads" value={metrics.hotLeads} desc="Ready to Close" actionText="Filter Hot" icon={Zap} color="text-red-600" bg="bg-red-50" onClick={() => setFilterStatus('Hot')} />
                <MetricCard title="AI Calls" value={metrics.callCount} desc="Completed calls" actionText="Call Logs" icon={Phone} color="text-indigo-600" bg="bg-indigo-50" onClick={() => handleAction('callLogs')} />
                <MetricCard title="WhatsApp Conversations" value={metrics.waCount} desc="Active conversations" actionText="View Chats" icon={MessageSquare} color="text-green-600" bg="bg-green-50" onClick={() => handleAction('whatsappLogs')} />
                <MetricCard title="Deals Closed" value={metrics.dealsClosed} desc="Converted leads" actionText="Converted" icon={PieChartIcon} color="text-emerald-600" bg="bg-emerald-50" onClick={() => setFilterStatus('Converted')} />
                <MetricCard title="Followups Pending" value={metrics.pendingFollowups} desc="Pending actions" actionText="Followups" icon={Clock} color="text-orange-600" bg="bg-orange-50" onClick={() => setFilterStatus('New')} />
            </div>

            {/* 🔥 HOT LEAD ALERTS */}
            <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 mb-8">
                <h2 className="text-sm font-bold text-red-800 mb-3 flex items-center gap-2 uppercase tracking-wide">
                    🔥 HOT LEAD ALERT
                </h2>
                <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-between border border-red-100 flex-wrap gap-3">
                        <div>
                            <span className="font-bold text-gray-900 block sm:inline">Priya Sharma</span> <span className="text-gray-500 text-sm">requested a site visit.</span>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleAction('call', leads[0])} className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors">Call Now</button>
                            <button onClick={() => handleAction('whatsapp', leads[0])} className="px-3 py-1.5 text-xs font-bold text-green-600 bg-green-50 hover:bg-green-100 rounded-md transition-colors">Send WhatsApp</button>
                            <button onClick={() => navigate(`/sales/leads/${leads[0].id}`)} className="px-3 py-1.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">View Lead</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* LEFT / RIGHT SPLIT */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

                {/* LEFT: LEAD SOURCES */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-full min-h-[350px]">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Lead Sources</h2>
                    <div className="flex-1 w-full relative">
                        {metrics.sourceData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={metrics.sourceData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {metrics.sourceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 text-sm">No data available</div>
                        )}
                    </div>
                </div>

                {/* RIGHT: AI COMMUNICATION */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-full min-h-[350px]">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">AI Communication Systems</h2>
                    <div className="flex-1 flex flex-col gap-4">
                        <div className="flex-1 bg-indigo-50 border border-indigo-100 rounded-xl p-5 flex flex-col justify-center relative group">
                            <div className="flex justify-between items-start mb-2">
                                <div className="bg-white p-2 text-indigo-600 rounded-lg shadow-sm"><Phone size={20} /></div>
                                <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-1 rounded-full flex items-center gap-1"><span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse"></span> Active</span>
                            </div>
                            <h3 className="font-bold text-indigo-900 mt-1 mb-1">AI Voice Caller</h3>
                            <ul className="text-sm text-indigo-700 space-y-1 mb-4">
                                <li>• Outbound: 9am‑9pm</li>
                                <li>• Inbound: 24x7</li>
                            </ul>
                            <div className="flex gap-2 mt-auto">
                                <button onClick={() => handleAction('callLogs')} className="flex-1 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 rounded-md transition-colors whitespace-nowrap">View Call Logs</button>
                                <button onClick={() => handleAction('analytics')} className="flex-1 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 rounded-md transition-colors whitespace-nowrap">Open Analytics</button>
                            </div>
                        </div>
                        <div className="flex-1 bg-green-50 border border-green-100 rounded-xl p-5 flex flex-col justify-center relative group">
                            <div className="flex justify-between items-start mb-2">
                                <div className="bg-white p-2 text-green-600 rounded-lg shadow-sm"><MessageSquare size={20} /></div>
                                <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></span> Active</span>
                            </div>
                            <h3 className="font-bold text-green-900 mt-1 mb-1">WhatsApp AI Agent</h3>
                            <ul className="text-sm text-green-700 mb-4">
                                <li>• Active 24x7</li>
                                <li>• Multi-language</li>
                            </ul>
                            <div className="flex gap-2 mt-auto">
                                <button onClick={() => handleAction('whatsappLogs')} className="flex-1 py-1.5 text-xs font-bold text-green-700 bg-green-100 hover:bg-green-200 rounded-md transition-colors whitespace-nowrap">View Conversations</button>
                                <button onClick={() => handleAction('templates')} className="flex-1 py-1.5 text-xs font-bold text-green-700 bg-green-100 hover:bg-green-200 rounded-md transition-colors whitespace-nowrap">Message Templates</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* AI LEAD SCORING */}
            <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">AI Lead Scoring</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ScoreCard tier="🔥 Hot Leads" threshold="" color="red" desc="" count={metrics.hotLeads} onClick={() => setFilterStatus('Hot')} />
                    <ScoreCard tier="🌡 Warm Leads" threshold="" color="orange" desc="" count={leads.filter(l => l.scoreLabel === 'Warm').length} onClick={() => setFilterStatus('Warm')} />
                    <ScoreCard tier="❄ Cold Leads" threshold="" color="blue" desc="" count={leads.filter(l => l.scoreLabel === 'Cold').length} onClick={() => setFilterStatus('Cold')} />
                </div>
            </div>

            {/* LEADS LIST */}
            <div className="border border-gray-200 bg-white rounded-xl shadow-sm flex flex-col mb-8">
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-lg font-bold text-gray-900">Leads List</h2>

                    {/* Filters */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                        <Filter size={16} className="text-gray-400 mr-1" />
                        {['All', 'New', 'Contacted', 'Hot', 'Warm', 'Cold', 'Converted'].map(fp => (
                            <button
                                key={fp}
                                onClick={() => setFilterStatus(fp)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-full cursor-pointer whitespace-nowrap transition-colors ${filterStatus === fp
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {fp}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto w-full flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 bg-gray-50/50">
                                <th className="py-3 px-5 font-medium min-w-[160px]">Name</th>
                                <th className="py-3 px-5 font-medium min-w-[120px]">Phone</th>
                                <th className="py-3 px-5 font-medium min-w-[120px]">Source</th>
                                <th className="py-3 px-5 font-medium min-w-[120px]">Project</th>
                                <th className="py-3 px-5 font-medium min-w-[100px]">AI Score</th>
                                <th className="py-3 px-5 font-medium min-w-[120px]">Status</th>
                                <th className="py-3 px-5 font-medium min-w-[150px]">Last Interaction</th>
                                <th className="py-3 px-5 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {filteredLeads.map((lead) => (
                                <tr
                                    key={lead.id}
                                    onClick={() => navigate(`/sales/leads/${lead.id}`)}
                                    className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors group"
                                >
                                    <td className="py-4 px-5 shrink-0">
                                        <p className="font-bold text-gray-900">{lead.name}</p>
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className="text-sm text-gray-600">{lead.phone}</p>
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className="font-medium text-gray-700">{lead.source}</p>
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className="text-sm text-gray-600">{lead.project}</p>
                                    </td>
                                    <td className="py-4 px-5">
                                        <span className={`font-bold ${lead.scoreLabel === 'Hot' ? 'text-red-600' : lead.scoreLabel === 'Warm' ? 'text-orange-600' : 'text-blue-600'}`}>
                                            {lead.aiScore}%
                                        </span>
                                    </td>
                                    <td className="py-4 px-5 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${lead.status === 'Converted' ? 'bg-emerald-100 text-emerald-800' :
                                            lead.status === 'Contacted' ? 'bg-blue-100 text-blue-800' :
                                                lead.status === 'New' ? 'bg-gray-100 text-gray-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-5 text-gray-600 text-sm whitespace-nowrap">{lead.lastInteraction}</td>
                                    <td className="py-4 px-5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => handleAction('call', lead)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Call">
                                                <Phone className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleAction('whatsapp', lead)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="WhatsApp">
                                                <MessageSquare className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleAction('schedule', lead)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Schedule">
                                                <Calendar className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleAction('note', lead)} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" title="Add Note">
                                                <FileText className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredLeads.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-gray-500">
                                        No leads match the selected filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ACTIVITY FEED */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Activity size={20} className="text-gray-500" /> Activity Feed
                </h2>
                <div className="space-y-3">
                    <p className="text-sm text-gray-700 font-medium">
                        • <span className="text-gray-500">2 min ago</span> – Hot lead alert triggered
                    </p>
                    <p className="text-sm text-gray-700 font-medium">
                        • <span className="text-gray-500">15 min ago</span> – AI call completed
                    </p>
                    <p className="text-sm text-gray-700 font-medium">
                        • <span className="text-gray-500">32 min ago</span> – WhatsApp message sent
                    </p>
                    <p className="text-sm text-gray-700 font-medium">
                        • <span className="text-gray-500">1 hour ago</span> – Follow-up scheduled
                    </p>
                </div>
            </div>

            {/* Render Layers */}
            {renderActionModal()}

        </div>
    );
};

// Sub-components

const MetricCard = ({ title, value, desc, actionText, onClick }) => (
    <div
        className={`bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between group ${onClick ? 'cursor-pointer hover:border-blue-300 hover:shadow-md transition-all duration-200' : ''}`}
        onClick={onClick}
    >
        <div className="flex items-start justify-between mb-3">
            <div className={`shadow-sm`}>
                {/* removed Icon completely */}
            </div>
            {actionText && (
                <span className="text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ml-2">
                    [{actionText}]
                </span>
            )}
        </div>
        <div>
            <p className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{value}</p>
            <p className="text-sm font-bold text-gray-900 mt-1">{title}</p>
            {desc && <p className="text-xs text-gray-500 mt-1">{desc}</p>}
        </div>
    </div>
);

// eslint-disable-next-line no-unused-vars
const ProcessingStep = ({ icon: Icon, title, desc, status }) => (
    <div className="relative pl-10 flex gap-4">
        <div className={`absolute left-0 top-1 w-10 flex justify-center`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white ${status === 'active' ? 'bg-blue-100 text-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'bg-gray-100 text-gray-400'}`}>
                <Icon size={18} />
            </div>
        </div>
        <div className={`pb-8 ${status === 'active' ? 'opacity-100' : 'opacity-60'}`}>
            <h4 className="text-sm font-bold text-gray-900">{title}</h4>
            <p className="text-xs text-gray-500 mt-1">{desc}</p>
            {status === 'active' && <p className="text-[10px] font-bold text-green-600 mt-2 bg-green-50 px-2 py-0.5 rounded-full inline-block">Complete</p>}
        </div>
    </div>
);

const ScoreCard = ({ tier, threshold, color, desc, count, alert, onClick }) => {
    const colorMap = {
        red: 'bg-red-50 text-red-600 border-red-100',
        orange: 'bg-orange-50 text-orange-600 border-orange-100',
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
    };

    return (
        <div
            className={`p-4 rounded-xl border ${colorMap[color]} relative overflow-hidden flex flex-col ${onClick ? 'cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all duration-200' : ''}`}
            onClick={onClick}
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <span className="font-black text-lg">{tier}</span>
                    <span className="text-xs font-bold px-2 py-1 rounded bg-white/60 backdrop-blur tracking-widest">{threshold}</span>
                </div>
                {alert && <ShieldAlert size={20} className="text-red-500 animate-pulse" />}
            </div>
            <p className="text-xs font-medium opacity-90 mb-4">{desc}</p>
            <div className="mt-auto flex justify-between items-baseline pt-2 border-t border-black/5">
                <span className="text-xs font-bold opacity-75">CURRENT LEADS</span>
                <span className="text-xl font-black">{count}</span>
            </div>
        </div>
    )
}

export default SalesDashboard;
