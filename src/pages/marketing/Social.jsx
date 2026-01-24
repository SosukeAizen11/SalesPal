import React, { useState } from 'react';
import { Wand2, Send, CheckCircle2 } from 'lucide-react';
import PostTypeSelector from './components/social/PostTypeSelector';
import SocialPreview from './components/social/SocialPreview';
import ScheduleSelector from './components/social/ScheduleSelector';
import EngagementMetrics from './components/social/EngagementMetrics';

const Social = () => {
    const [postType, setPostType] = useState('image');
    const [content, setContent] = useState("Just listed! ✨ Experience the height of luxury at our new South Mumbai residence. Sea-facing views, premium amenities, and more. DM for a private tour! 🏠 #LuxuryRealEstate #MumbaiHomes");
    const [scheduleMode, setScheduleMode] = useState('now');
    const [isPublished, setIsPublished] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);

    const handlePublish = () => {
        setIsPublishing(true);
        setTimeout(() => {
            setIsPublishing(false);
            setIsPublished(true);
        }, 1500);
    };

    const handleNewPost = () => {
        setIsPublished(false);
        setContent("");
    };

    return (
        <div className="space-y-6 md:space-y-8 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Social Studio</h2>
                    <p className="text-gray-500 mt-1">Create, schedule, and optimize your social content</p>
                </div>
                {isPublished && (
                    <button
                        onClick={handleNewPost}
                        className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light transition-colors"
                    >
                        Create Another Post
                    </button>
                )}
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Left Column: Creator (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-gray-900">Create New Post</h3>
                            <PostTypeSelector selectedType={postType} onSelect={setPostType} />
                        </div>

                        {!isPublished ? (
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
                                        className="w-full h-32 p-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary resize-none"
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
                                    <button
                                        onClick={handlePublish}
                                        disabled={isPublishing}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-light transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isPublishing ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>Publishing...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                <span>{scheduleMode === 'now' ? 'Publish Now' : 'Schedule Post'}</span>
                                            </>
                                        )}
                                    </button>
                                    <button className="px-6 py-3 text-gray-600 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                                        Save Draft
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in-up">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Post Published!</h3>
                                <p className="text-gray-500 max-w-sm">
                                    Your post is live on Instagram. We'll start tracking engagement metrics immediately.
                                </p>
                                <div className="w-full max-w-md pt-6">
                                    <EngagementMetrics />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Preview (5 cols) */}
                <div className="lg:col-span-5">
                    <div className="sticky top-8 space-y-4">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider pl-1">Preview</h3>
                        <SocialPreview content={content} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Social;
