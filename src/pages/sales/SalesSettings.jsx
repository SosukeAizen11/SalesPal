import React, { useState } from 'react';
import {
    Settings,
    PhoneCall,
    MessageSquare,
    Zap,
    Clock,
    Database,
    Bell,
    BrainCircuit,
    ChevronDown,
    ChevronRight,
    Save
} from 'lucide-react';

const SalesSettings = () => {
    const [openSection, setOpenSection] = useState('calling');

    const sections = [
        {
            id: 'calling',
            title: 'AI Calling Settings',
            icon: PhoneCall,
            content: (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-gray-900">Outbound Call Hours</p>
                            <p className="text-sm text-gray-500">Define active hours for outbound AI voice agent.</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <input type="time" defaultValue="09:00" className="border border-gray-200 rounded-md p-2 bg-gray-50" />
                            <span>to</span>
                            <input type="time" defaultValue="21:00" className="border border-gray-200 rounded-md p-2 bg-gray-50" />
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'whatsapp',
            title: 'WhatsApp Automation',
            icon: MessageSquare,
            content: (
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <input type="checkbox" id="wa-active" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                        <div>
                            <label htmlFor="wa-active" className="font-semibold text-gray-900 block">Enable 24/7 AI WhatsApp Agent</label>
                            <p className="text-sm text-gray-500">Respond automatically to inbound messages directly from the WhatsApp API.</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'scoring',
            title: 'Lead Scoring Rules',
            icon: Zap,
            content: (
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">Adjust thresholds defining Lead heat classifications.</p>
                    <div className="grid grid-cols-3 gap-6">
                        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                            <p className="font-bold text-red-900 mb-1">🔥 Hot Lead</p>
                            <input type="number" defaultValue={80} className="w-full border border-gray-200 rounded-md p-2 text-sm" />
                            <span className="text-xs text-gray-500 mt-1 block">Minimum Score</span>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                            <p className="font-bold text-orange-900 mb-1">🌡 Warm Lead</p>
                            <input type="number" defaultValue={40} className="w-full border border-gray-200 rounded-md p-2 text-sm" />
                            <span className="text-xs text-gray-500 mt-1 block">Minimum Score</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'followups',
            title: 'Follow-up Automation',
            icon: Clock,
            content: (
                <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-sm text-gray-600">Configure delays for automatic actions after a lead becomes cold or remains uncontacted.</p>
                    {/* Placeholder config controls */}
                    <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-700">Initial Contact Delay</span>
                        <select className="border border-gray-200 rounded-md p-1.5 text-sm bg-gray-50">
                            <option>Immediate</option>
                            <option>15 Minutes</option>
                            <option>1 Hour</option>
                        </select>
                    </div>
                </div>
            )
        },
        {
            id: 'sources',
            title: 'Lead Sources',
            icon: Database,
            content: (
                <div className="space-y-3">
                    <p className="text-sm text-gray-600 mb-2">Connected entry points.</p>
                    <div className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                        <span className="font-semibold text-gray-800">Meta Ads Integration</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Connected</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                        <span className="font-semibold text-gray-800">Website Forms API</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Connected</span>
                    </div>
                </div>
            )
        },
        {
            id: 'notifications',
            title: 'Team Notifications',
            icon: Bell,
            content: (
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <input type="checkbox" id="notify-hot" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                        <div>
                            <label htmlFor="notify-hot" className="font-semibold text-gray-900 block">Alert sales team on HOT new leads.</label>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <input type="checkbox" id="notify-meetings" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                        <div>
                            <label htmlFor="notify-meetings" className="font-semibold text-gray-900 block">Alert when AI successfully books a meeting.</label>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'behavior',
            title: 'AI Behavior & Scripts',
            icon: BrainCircuit,
            content: (
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">Configure global prompt behavior governing AI outbound scripts and tones.</p>
                    <textarea
                        className="w-full h-32 p-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
                        defaultValue="Act as a helpful virtual assistant. Keep answers brief and attempt to push the user towards scheduling a calendar evaluation."
                    ></textarea>
                </div>
            )
        }
    ];

    return (
        <div className="max-w-4xl mx-auto pb-12 font-sans">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Settings className="text-blue-600 w-6 h-6" /> Sales Settings
                    </h1>
                    <p className="text-gray-500 mt-1">Configure automation and AI behaviors.</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm">
                    <Save size={18} /> Save Settings
                </button>
            </div>

            {/* Accordion Layout */}
            <div className="space-y-4">
                {sections.map(section => (
                    <div
                        key={section.id}
                        className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-all duration-200 ${openSection === section.id ? 'border-blue-200 ring-1 ring-blue-50' : 'border-gray-200'}`}
                    >
                        <button
                            className="w-full flex items-center justify-between p-5 focus:outline-none bg-white hover:bg-gray-50 transition-colors"
                            onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${openSection === section.id ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-500'}`}>
                                    <section.icon size={20} />
                                </div>
                                <h2 className={`font-bold ${openSection === section.id ? 'text-blue-900' : 'text-gray-800'}`}>{section.title}</h2>
                            </div>
                            {openSection === section.id ? (
                                <ChevronDown className="text-blue-500" size={20} />
                            ) : (
                                <ChevronRight className="text-gray-400" size={20} />
                            )}
                        </button>

                        {openSection === section.id && (
                            <div className="p-6 border-t border-gray-100 bg-white">
                                {section.content}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SalesSettings;
