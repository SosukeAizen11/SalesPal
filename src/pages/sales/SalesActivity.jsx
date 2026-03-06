import React from 'react';
import { ShieldAlert, Phone, MessageSquare, Clock, Activity } from 'lucide-react';

const SalesActivity = () => {
    return (
        <div className="font-sans text-gray-900 pb-12">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-4 border-b border-gray-100 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Activity className="text-blue-600" /> Sales Activity
                    </h1>
                    <p className="text-gray-500 mt-1">Review all recent AI interactions and automated followups</p>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Activity size={20} className="text-gray-500" /> Activity Feed
                </h2>
                <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                        <div className="p-2 bg-red-100 text-red-600 rounded-lg"><ShieldAlert size={18} /></div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">Hot Lead Alert</p>
                            <p className="text-xs text-gray-500 mt-1">Clark Kent scored 98% intent. Immediate callback recommended.</p>
                            <span className="text-[10px] text-gray-400 mt-2 block">10 mins ago</span>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Phone size={18} /></div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">AI Call Completed</p>
                            <p className="text-xs text-gray-500 mt-1">Sarah Connor successfully qualified. Scheduled callback for tomorrow.</p>
                            <span className="text-[10px] text-gray-400 mt-2 block">45 mins ago</span>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                        <div className="p-2 bg-green-100 text-green-600 rounded-lg"><MessageSquare size={18} /></div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">WhatsApp Reply</p>
                            <p className="text-xs text-gray-500 mt-1">Bruce Wayne requested the Winter Promo brochure. Sent automatically.</p>
                            <span className="text-[10px] text-gray-400 mt-2 block">2 hours ago</span>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Clock size={18} /></div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">Meeting Scheduled</p>
                            <p className="text-xs text-gray-500 mt-1">AI Assitant booked Intro Demo for Diana Prince.</p>
                            <span className="text-[10px] text-gray-400 mt-2 block">4 hours ago</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesActivity;
