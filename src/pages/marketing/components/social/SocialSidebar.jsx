import React from 'react';
import { Plus, Facebook, Linkedin, Twitter, FileText, Calendar, CheckCircle2, Instagram } from 'lucide-react';
import Card from '../../../../components/ui/Card';
import Badge from '../../../../components/ui/Badge';

const SocialSidebar = ({
    activeTab,
    onTabChange,
    posts = [],
    selectedPostId,
    onSelectPost,
    onCreateNew
}) => {

    const filteredPosts = posts.filter(post => {
        if (activeTab === 'drafts') return post.status === 'draft' || !post.status; // Default to draft if status missing
        if (activeTab === 'scheduled') return post.status === 'scheduled';
        if (activeTab === 'published') return post.status === 'published';
        return true;
    });

    const getIcon = (type) => {
        if (type === 'image') return '🖼️';
        if (type === 'video') return '🎥';
        return '📝';
    };

    return (
        <div className="h-full flex flex-col bg-white border-r border-gray-200">
            {/* Account Selector (Mock) */}
            <div className="p-4 border-b border-gray-100">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Connected Accounts</h3>
                <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center cursor-pointer hover:ring-2 ring-blue-200 transition-all">
                        <Facebook className="w-4 h-4" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center cursor-pointer hover:ring-2 ring-pink-200 transition-all">
                        <Instagram className="w-4 h-4" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0077B5] flex items-center justify-center cursor-pointer hover:ring-2 ring-blue-100 transition-all">
                        <Linkedin className="w-4 h-4" />
                    </div>
                    <div className="w-8 h-8 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-400 cursor-pointer hover:border-gray-400 hover:text-gray-600">
                        <Plus className="w-4 h-4" />
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-100">
                <button
                    onClick={() => onTabChange('drafts')}
                    className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'drafts' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Drafts
                </button>
                <button
                    onClick={() => onTabChange('scheduled')}
                    className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'scheduled' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Scheduled
                </button>
                <button
                    onClick={() => onTabChange('published')}
                    className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'published' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Sent
                </button>
            </div>

            {/* Post List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                <button
                    onClick={onCreateNew}
                    className="w-full mb-2 p-3 flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-primary hover:text-primary transition-all group"
                >
                    <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Create New Post</span>
                </button>

                {filteredPosts.length === 0 ? (
                    <div className="text-center py-8 px-4">
                        <p className="text-sm text-gray-400">No {activeTab} posts found.</p>
                    </div>
                ) : (
                    filteredPosts.map(post => (
                        <div
                            key={post.id}
                            onClick={() => onSelectPost(post)}
                            className={`p-3 rounded-lg text-left cursor-pointer transition-all hover:bg-gray-50 border ${selectedPostId === post.id ? 'border-primary bg-blue-50/30 ring-1 ring-primary/20' : 'border-transparent'}`}
                        >
                            <div className="flex items-start justify-between mb-1">
                                <span className="text-xs font-medium text-gray-500">
                                    {new Date(post.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                </span>
                                <span className="text-xs" title={post.type}>{getIcon(post.type)}</span>
                            </div>
                            <p className="text-sm text-gray-900 line-clamp-2 md:line-clamp-2 font-medium">
                                {post.content || <span className="text-gray-400 italic">Untitled Draft</span>}
                            </p>
                            <div className="mt-2 flex items-center gap-1">
                                {post.platforms?.map(p => (
                                    <div key={p} className="w-1.5 h-1.5 rounded-full bg-gray-300" title={p} />
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SocialSidebar;
