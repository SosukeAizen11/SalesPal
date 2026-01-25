import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, Image as ImageIcon, Send } from 'lucide-react';
import { useMarketing } from '../../../context/MarketingContext';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import PostTypeSelector from '../components/social/PostTypeSelector';
import ScheduleSelector from '../components/social/ScheduleSelector';
import SocialPreview from '../components/social/SocialPreview';

const SocialCreate = () => {
    const navigate = useNavigate();
    const { addSocialPost } = useMarketing();

    // Editor State
    const [content, setContent] = useState("");
    const [postType, setPostType] = useState('image');
    const [scheduleMode, setScheduleMode] = useState('now');
    const [isSaving, setIsSaving] = useState(false);
    const [media, setMedia] = useState([]);

    const handleDrop = (e) => {
        e.preventDefault();
        setMedia([...media, { id: Date.now(), url: '#' }]);
    };

    const handleSaveDraft = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        const newPost = {
            id: Date.now().toString(),
            content,
            type: postType,
            status: 'draft',
            timestamp: new Date().toISOString(),
            platforms: ['Facebook', 'Instagram']
        };

        addSocialPost(newPost);
        setIsSaving(false);
        navigate('/marketing/social/drafts');
    };

    const handlePublish = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        const status = scheduleMode === 'now' ? 'published' : 'scheduled';
        const newPost = {
            id: Date.now().toString(),
            content,
            type: postType,
            status: status,
            scheduledFor: scheduleMode === 'now' ? 'Published Now' : 'Scheduled',
            timestamp: new Date().toISOString(),
            platforms: ['Facebook', 'Instagram']
        };

        addSocialPost(newPost);
        setIsSaving(false);
        navigate(status === 'published' ? '/marketing/social/published' : '/marketing/social/scheduled');
    };

    return (
        <div className="max-w-7xl mx-auto h-full pb-8 animate-fade-in-up">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
                <p className="text-gray-500">Compose and schedule your content across platforms.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column: Editor (2 cols) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* 1. Content Composition */}
                    <Card className="overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <label className="text-sm font-medium text-gray-700">Content Type</label>
                            <PostTypeSelector selectedType={postType} onSelect={setPostType} />
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Caption */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-medium text-gray-700">Caption</label>
                                    <button className="flex items-center gap-1.5 text-xs font-medium text-purple-600 hover:bg-purple-50 px-2 py-1 rounded transition-colors">
                                        <Wand2 className="w-3 h-3" />
                                        AI Assist
                                    </button>
                                </div>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full h-40 p-3 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary transition-colors resize-none placeholder-gray-400"
                                    placeholder="What's on your mind? Type @ to mention..."
                                />
                                <div className="flex gap-2 mt-2">
                                    {['#NewListing', '#RealEstate', '#DreamHome'].map(tag => (
                                        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200 cursor-pointer">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Media Upload */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Media</label>
                                <div
                                    className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all"
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleDrop}
                                >
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3">
                                        <ImageIcon className="w-5 h-5" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">Drag & drop photos or videos</p>
                                    <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG, MP4 up to 50MB</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* 2. Scheduling & Publishing */}
                    <Card>
                        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                            <label className="text-sm font-medium text-gray-700">Publishing Options</label>
                        </div>
                        <div className="p-6 space-y-6">
                            <ScheduleSelector scheduleMode={scheduleMode} onModeChange={setScheduleMode} />

                            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                                <Button variant="secondary" onClick={handleSaveDraft} disabled={isSaving}>
                                    Save as Draft
                                </Button>
                                <Button onClick={handlePublish} isLoading={isSaving} disabled={!content}>
                                    <Send className="w-4 h-4 mr-2" />
                                    {scheduleMode === 'now' ? 'Publish Now' : 'Schedule Post'}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Preview (1 col) */}
                <div className="lg:col-span-1 sticky top-24">
                    <div className="mb-3 flex items-center justify-between px-1">
                        <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Live Preview</label>
                        <span className="text-xs text-gray-400">Updates automatically</span>
                    </div>
                    <SocialPreview content={content} />

                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800">
                        <p className="font-medium mb-1">💡 Pro Tip</p>
                        <p className="opacity-90">Adding a location tag can increase engagement by up to 35%.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialCreate;
