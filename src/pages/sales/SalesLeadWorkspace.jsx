import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSales } from '../../context/SalesContext';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Phone, MessageSquare, Calendar, CheckCircle, Clock,
    BarChart3, BrainCircuit, Mic, PlayCircle, DownloadCloud, FileText,
    MessageCircle, Users, Zap, X, Volume2, Edit3, TrendingUp
} from 'lucide-react';

const statuses = ['New', 'Contacted', 'Interested', 'Qualified', 'Lost', 'Won'];

const SalesLeadWorkspace = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { leads, updateLeadStatus } = useSales();
    const [actionModal, setActionModal] = useState(null);

    const lead = leads.find(l => l.id.toString() === id);

    if (!lead) {
        return <div className="p-8 text-center text-gray-400 font-medium">Loading workspace...</div>;
    }

    const handleAction = (type) => {
        setActionModal({ type, lead });
    };

    const renderActionModal = () => {
        if (!actionModal) return null;
        const { type, lead: modalLead } = actionModal;

        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm"
                    onClick={() => setActionModal(null)}
                >
                    <motion.div
                        initial={{ scale: 0.96, opacity: 0, y: 16 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.96, opacity: 0, y: 16 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-sm border border-gray-200"
                    >
                        {type === 'call' && (
                            <div className="flex flex-col bg-gray-900 text-white relative" style={{ minHeight: 360 }}>
                                <button onClick={() => setActionModal(null)} className="absolute top-4 right-4 text-white/50 hover:text-white bg-white/10 p-1.5 rounded-full transition-colors">
                                    <X size={16} />
                                </button>
                                <div className="p-8 flex flex-col items-center justify-center text-center flex-1">
                                    <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-5 ring-4 ring-white/10">
                                        <Phone size={36} className="text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-1">{modalLead?.name || 'Unknown Contact'}</h3>
                                    <p className="text-gray-400 text-sm font-medium">{modalLead?.phone || '+91 98XXXXXX'}</p>
                                    <div className="flex items-center gap-2 mt-6 text-gray-300 text-xs font-medium bg-white/10 px-4 py-2 rounded-full">
                                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                        Connecting to AI Voice Agent...
                                    </div>
                                </div>
                                <div className="p-6 flex justify-center gap-6 border-t border-white/10">
                                    <button className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors text-white/70 hover:text-white">
                                        <Mic size={20} />
                                    </button>
                                    <button onClick={() => setActionModal(null)} className="w-14 h-14 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors">
                                        <Phone size={24} className="rotate-[135deg]" />
                                    </button>
                                    <button className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors text-white/70 hover:text-white">
                                        <Volume2 size={20} />
                                    </button>
                                </div>
                            </div>
                        )}
                        {type === 'whatsapp' && (
                            <div className="flex flex-col" style={{ minHeight: 360 }}>
                                <div className="bg-gray-900 text-white p-4 flex items-center gap-3">
                                    <button onClick={() => setActionModal(null)} className="text-white/60 hover:text-white transition-colors"><X size={18} /></button>
                                    <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                                        <Users size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm">{modalLead?.name || 'Contact'}</h4>
                                        <p className="text-xs text-white/50">AI Agent Active</p>
                                    </div>
                                </div>
                                <div className="flex-1 bg-gray-50 p-6 flex justify-center items-center">
                                    <p className="text-sm font-medium text-gray-500">Opening WhatsApp Web...</p>
                                </div>
                            </div>
                        )}
                        {type === 'schedule' && (
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-5">
                                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-2"><Calendar size={18} className="text-blue-600" /> Schedule Follow-up</h3>
                                    <button onClick={() => setActionModal(null)} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><X size={16} /></button>
                                </div>
                                <div className="space-y-3">
                                    <input type="date" className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" />
                                    <button onClick={() => setActionModal(null)} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-colors">
                                        Confirm Schedule
                                    </button>
                                </div>
                            </div>
                        )}
                        {type === 'note' && (
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-5">
                                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-2"><Edit3 size={18} className="text-gray-600" /> Add Note</h3>
                                    <button onClick={() => setActionModal(null)} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><X size={16} /></button>
                                </div>
                                <div className="space-y-3">
                                    <textarea
                                        rows="4"
                                        className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 resize-none"
                                        placeholder={`Notes for ${modalLead?.name || 'this lead'}...`}
                                    ></textarea>
                                    <button onClick={() => setActionModal(null)} className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg text-sm transition-colors">
                                        Save Note
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        );
    };

    return (
        <div className="font-sans text-gray-900 pb-12">
            {renderActionModal()}

            {/* Page Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-gray-100 mb-6">
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-600 font-medium transition-colors mb-1"
                    >
                        <ArrowLeft size={13} /> Back to Leads
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
                    <p className="text-gray-500 mt-0.5 text-sm">Lead workspace — interactions, communications, and AI insights.</p>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                    <button onClick={() => handleAction('call')} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm shadow-sm">
                        <Phone size={14} /> Call
                    </button>
                    <button onClick={() => handleAction('whatsapp')} className="px-4 py-2 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors flex items-center gap-2 text-sm shadow-sm">
                        <MessageSquare size={14} /> WhatsApp
                    </button>
                    <button onClick={() => handleAction('schedule')} className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm shadow-sm">
                        <Calendar size={14} /> Schedule
                    </button>
                    <button onClick={() => handleAction('note')} className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm shadow-sm">
                        <Edit3 size={14} /> Note
                    </button>
                </div>
            </div>

            {/* AI Score Stat Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'AI Score', value: lead.aiScore ?? 0, icon: BrainCircuit, suffix: '' },
                    { label: 'Deal Probability', value: `${lead.dealProbability ?? 0}%`, icon: TrendingUp, suffix: '' },
                    { label: 'Intent', value: lead.intent || 'Unknown', icon: Zap, suffix: '' },
                    { label: 'Sentiment', value: lead.sentimentLabel || 'Neutral', icon: MessageSquare, suffix: '' },
                    // eslint-disable-next-line no-unused-vars
                ].map(({ label, value, icon: IconComp }) => (
                    <div key={label} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                            <IconComp size={16} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">{label}</p>
                            <p className="text-sm font-bold text-gray-900">{value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* LEFT COLUMN */}
                <div className="lg:col-span-1 space-y-5">

                    {/* Lead Profile Card */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Lead Profile</h2>
                            <select
                                className={`text-xs font-semibold rounded-md px-2.5 py-1 appearance-none cursor-pointer border focus:outline-none focus:ring-2 focus:ring-blue-400 ${lead.status === 'Won' ? 'bg-green-50 text-green-700 border-green-200' :
                                    lead.status === 'Lost' ? 'bg-red-50 text-red-700 border-red-200' :
                                        lead.status === 'New' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                            'bg-gray-100 text-gray-700 border-gray-200'
                                    }`}
                                value={lead.status}
                                onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                            >
                                {statuses.map(s => (
                                    <option key={s} value={s}>{s === 'Won' ? 'Converted' : s}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-3">
                            {[
                                { label: 'Phone', value: lead.phone, icon: Phone },
                                { label: 'Email', value: lead.email || 'N/A', icon: null },
                                { label: 'Source', value: lead.source, icon: null },
                                { label: 'Campaign', value: lead.campaign, icon: null },
                                { label: 'Project', value: lead.project, icon: null },
                                { label: 'Lead Owner', value: lead.assignedTo || 'Unassigned', icon: null },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex justify-between items-start gap-2">
                                    <span className="text-xs text-gray-400 font-medium shrink-0 mt-0.5">{label}</span>
                                    <span className="text-xs font-semibold text-gray-900 text-right">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI Insight + Recommendation */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
                        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
                            <BrainCircuit size={15} className="text-blue-600" /> AI Insights
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Context</p>
                                <p className="text-sm text-gray-700 leading-relaxed border-l-2 border-blue-200 pl-3">
                                    {lead.insight || 'Customer engaged with the recent listing update.'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Recommended Next Steps</p>
                                <ul className="space-y-1.5">
                                    {[
                                        lead.recommendation || 'Call to discuss requirements.',
                                        'Send digital brochure.',
                                        'Schedule a site visit.',
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                            <CheckCircle size={13} className="text-blue-500 mt-0.5 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="pt-3 border-t border-gray-100 grid grid-cols-3 gap-2">
                                <button onClick={() => handleAction('call')} className="col-span-1 py-2 bg-blue-600 text-white text-xs rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 shadow-sm">
                                    <Phone size={12} /> Call
                                </button>
                                <button onClick={() => handleAction('whatsapp')} className="col-span-1 py-2 bg-gray-800 text-white text-xs rounded-lg font-semibold hover:bg-gray-900 transition-colors flex items-center justify-center gap-1 shadow-sm">
                                    <MessageSquare size={12} /> WA
                                </button>
                                <button onClick={() => handleAction('schedule')} className="col-span-1 py-2 bg-white border border-gray-200 text-gray-700 text-xs rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 shadow-sm">
                                    <Calendar size={12} /> Schedule
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Follow-ups */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                                <Clock size={14} className="text-blue-600" /> Follow-ups
                            </h2>
                            <button onClick={() => handleAction('schedule')} className="text-xs text-blue-600 font-semibold hover:underline">+ Add</button>
                        </div>
                        {lead.followups && lead.followups.length > 0 ? (
                            <div className="space-y-2">
                                {lead.followups.map(f => (
                                    <div key={f.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="flex items-start gap-2.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                                            <span className="text-sm font-medium text-gray-800">{f.task}</span>
                                        </div>
                                        <span className="text-xs font-medium text-gray-400 shrink-0 ml-2">{f.time}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 text-center py-4">No follow-ups scheduled.</p>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN — Activity Stream */}
                <div className="lg:col-span-2 space-y-5">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Activity Stream</h2>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Communications */}
                            {lead.communications && lead.communications.length > 0 ? lead.communications.map(comm => (
                                <div key={comm.id} className="border border-gray-200 rounded-xl overflow-hidden">

                                    {/* CALL */}
                                    {comm.type === 'call' && (
                                        <>
                                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="p-1.5 bg-gray-200 text-gray-600 rounded-lg"><Phone size={15} /></div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 text-sm">AI Voice Call</h4>
                                                        <p className="text-xs text-gray-400">{comm.time}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{comm.duration}</span>
                                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${comm.outcome === 'Qualified' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>{comm.outcome}</span>
                                                </div>
                                            </div>
                                            <div className="p-4 space-y-4">
                                                {comm.recording && (
                                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <button className="w-9 h-9 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm shrink-0">
                                                                <PlayCircle size={18} fill="currentColor" />
                                                            </button>
                                                            <div className="flex-1">
                                                                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-blue-500 w-1/3 rounded-full"></div>
                                                                </div>
                                                                <div className="flex justify-between mt-1 text-[10px] text-gray-400 font-medium">
                                                                    <span>0:45</span>
                                                                    <span>{comm.duration}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button className="flex-1 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-medium rounded-md hover:bg-gray-50 flex items-center justify-center gap-1.5 transition-colors">
                                                                <DownloadCloud size={13} /> Download
                                                            </button>
                                                            <button className="flex-1 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-medium rounded-md hover:bg-gray-50 flex items-center justify-center gap-1.5 transition-colors">
                                                                <FileText size={13} /> Transcript
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {comm.sentiment !== undefined && (
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs font-medium text-gray-400 shrink-0 uppercase tracking-wide">Sentiment</span>
                                                        <div className="flex-1 max-w-[180px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${comm.sentiment > 70 ? 'bg-blue-500' : comm.sentiment > 40 ? 'bg-yellow-400' : 'bg-red-400'}`}
                                                                style={{ width: `${comm.sentiment}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-700">{comm.sentiment}/100</span>
                                                    </div>
                                                )}

                                                {comm.transcript && (
                                                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                                                        <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex items-center gap-2">
                                                            <Mic size={13} className="text-gray-400" />
                                                            <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Transcript</h5>
                                                        </div>
                                                        <div className="p-4 max-h-[220px] overflow-y-auto space-y-2.5">
                                                            {comm.transcript.map((line, i) => (
                                                                <div key={i} className="text-sm">
                                                                    <span className={`font-semibold mr-1.5 ${line.speaker === 'AI' ? 'text-blue-600' : line.speaker === 'System' ? 'text-gray-400' : 'text-gray-700'}`}>
                                                                        {line.speaker}:
                                                                    </span>
                                                                    <span className="text-gray-600">{line.text}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {/* WHATSAPP */}
                                    {comm.type === 'whatsapp' && (
                                        <>
                                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-2.5">
                                                <div className="p-1.5 bg-gray-200 text-gray-600 rounded-lg"><MessageCircle size={15} /></div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 text-sm">WhatsApp Conversation</h4>
                                                    <p className="text-xs text-gray-400">AI sync</p>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-gray-50/50 space-y-3 max-h-[380px] overflow-y-auto">
                                                {comm.history && comm.history.map((msg) => (
                                                    <div key={msg.id} className={`flex flex-col ${msg.sender === 'Lead' ? 'items-end' : 'items-start'}`}>
                                                        <div className={`max-w-[80%] rounded-xl p-3 text-sm ${msg.sender === 'Lead' ? 'bg-white border border-gray-200 text-gray-900 rounded-br-sm shadow-sm' : 'bg-blue-600 text-white rounded-bl-sm'}`}>
                                                            <p className="font-medium">{msg.text}</p>
                                                            {msg.attachment && (
                                                                <div className="mt-2 text-xs flex items-center gap-1.5 pt-2 border-t border-black/10 opacity-80">
                                                                    <FileText size={12} />
                                                                    <span>{msg.attachment}</span>
                                                                    <DownloadCloud size={12} className="ml-auto cursor-pointer" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )) : (
                                <p className="text-sm text-gray-400 italic text-center py-6 border border-dashed border-gray-200 rounded-xl bg-gray-50">
                                    No communication logs recorded yet.
                                </p>
                            )}

                            {/* Timeline */}
                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-5 flex items-center gap-2">
                                    <BarChart3 size={14} className="text-blue-600" /> AI Activity Timeline
                                </h3>

                                {lead.timeline && lead.timeline.length > 0 ? (
                                    <div className="relative pl-6 space-y-5 before:absolute before:left-[7px] before:top-1 before:bottom-1 before:w-px before:bg-gray-200">
                                        {lead.timeline.map((event) => (
                                            <div key={event.id} className="relative">
                                                {/* Dot */}
                                                <div className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-white ring-1 shrink-0 ${event.type === 'call' ? 'bg-blue-500 ring-blue-200' :
                                                    event.type === 'whatsapp' ? 'bg-gray-700 ring-gray-300' :
                                                        event.type === 'ai_action' ? 'bg-blue-400 ring-blue-100' :
                                                            'bg-gray-400 ring-gray-200'
                                                    }`}></div>

                                                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:border-gray-300 transition-colors">
                                                    <div className="flex items-start justify-between gap-2 mb-1.5">
                                                        <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                                                            {event.type === 'call' ? <Phone size={12} className="text-blue-500 shrink-0" /> :
                                                                event.type === 'whatsapp' ? <MessageCircle size={12} className="text-gray-500 shrink-0" /> :
                                                                    event.type === 'capture' ? <Users size={12} className="text-gray-400 shrink-0" /> :
                                                                        <Zap size={12} className="text-blue-400 shrink-0" />}
                                                            {event.action}
                                                        </h4>
                                                        <span className="text-[10px] font-medium text-gray-400 shrink-0">{event.time}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 leading-relaxed">{event.detail}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 italic text-center py-6 border border-dashed border-gray-200 rounded-xl bg-gray-50">
                                        No timeline events recorded.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesLeadWorkspace;
