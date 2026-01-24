import React, { useState } from 'react';
import { Wand2, Send, CheckCircle2, Trash2, Calendar, Image as ImageIcon } from 'lucide-react';
import { useMarketing } from '../../context/MarketingContext'; // Fixed import path
import PostTypeSelector from './components/social/PostTypeSelector';
import SocialPreview from './components/social/SocialPreview';
import ScheduleSelector from './components/social/ScheduleSelector';
import EngagementMetrics from './components/social/EngagementMetrics';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const Social = () => {
    const { addSocialPost, socialPosts, deleteSocialPost } = useMarketing();
    const [postType, setPostType] = useState('image');
    const [content, setContent] = useState("Just listed! ✨ Experience the height of luxury at our new South Mumbai residence. Sea-facing views, premium amenities, and more. DM for a private tour! 🏠 #LuxuryRealEstate #MumbaiHomes");
    const [scheduleMode, setScheduleMode] = useState('now');
    const [activeTab, setActiveTab] = useState('create');
    const [isPublishing, setIsPublishing] = useState(false);

    const handlePublish = () => {
        setIsPublishing(true);
        setTimeout(() => {
            addSocialPost({
                content,
                type: postType,
                scheduledFor: scheduleMode === 'now' ? 'Published Now' : 'Scheduled',
                timestamp: new Date().toISOString()
            });
            setIsPublishing(false);
            setActiveTab('history');
            setContent("");
        }, 1500);
    };

    return (
        <div className="space-y-6 md:space-y-8 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Social Studio</h2>
                    <p className="text-gray-500 mt-1">Create, schedule, and optimize your social content</p>
                </div>
                <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                    <button
                        onClick={() => setActiveTab('create')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'create' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Create Post
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'history' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        History ({socialPosts.length})
                    </button>
                </div>
            </div>

            {activeTab === 'create' ? (
                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Left Column: Creator (7 cols) */}
                    <div className="lg:col-span-7 space-y-6">
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-semibold text-gray-900">Create New Post</h3>
                                <PostTypeSelector selectedType={postType} onSelect={setPostType} />
                            </div>

                            <div className="space-y-6">
                                {/* Content Input */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-gray-700">Caption</label>
                                        <button className="flex items-center gap-1.5 text-xs font-medium text-secondary hover:text-secondary-dark transition-colors">
                                            <Wand2 className="w-3 h-3" />
                                            AI Reword
                                        </button>
                                    </div>
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        className="w-full h-32 p-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none transition-colors"
                                        placeholder="Write your caption here..."
                                    />
                                    <div className="flex gap-2">
                                        {['#RealEstate', '#Mumbai', '#Luxury'].map(tag => (
                                            <span key={tag} className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded cursor-pointer hover:bg-blue-100">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Scheduling */}
                                <div className="pt-6 border-t border-gray-100">
                                    <ScheduleSelector scheduleMode={scheduleMode} onModeChange={setScheduleMode} />
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-6 flex items-center gap-4">
                                    <Button
                                        onClick={handlePublish}
                                        isLoading={isPublishing}
                                        className="flex-1"
                                    >
                                        <Send className="w-4 h-4 mr-2" />
                                        {scheduleMode === 'now' ? 'Publish Now' : 'Schedule Post'}
                                    </Button>
                                    <Button variant="secondary">
                                        Save Draft
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Preview (5 cols) */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-8 space-y-4">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider pl-1">Preview</h3>
                            <SocialPreview content={content} />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {socialPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {socialPosts.map(post => (
                                <Card key={post.id} className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center text-primary">
                                                {post.type === 'video' ? '🎥' : <ImageIcon className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {post.scheduledFor === 'Published Now' ? 'Published' : 'Scheduled'}
                                                </p>
                                                <p className="text-xs text-gray-500">{new Date(post.timestamp).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (window.confirm('Delete this post?')) deleteSocialPost(post.id);
                                            }}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">{post.content}</p>
                                    {post.scheduledFor === 'Published Now' && (
                                        <div className="pt-4 border-t border-gray-100">
                                            <EngagementMetrics />
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="p-12 text-center flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
                                <Send className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                            <p className="text-gray-500 max-w-sm mb-6">Create and publish your first social media post to see it here.</p>
                            <Button onClick={() => setActiveTab('create')}>
                                Create First Post
                            </Button>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
};

export default Social;
