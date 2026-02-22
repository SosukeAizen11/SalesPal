import React, { useEffect, useState, useRef } from 'react';
import { Building2, Globe2, Target, Wallet, ShieldCheck, CheckCircle2, AlertTriangle, MapPin, Tag, Sparkles, Pencil, Save, X as XIcon, RefreshCw, Upload, FileText, ImageIcon, Link as LinkIcon } from 'lucide-react';
import StepNavigation from '../components/StepNavigation';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

const INITIAL_DATA = {
    industry: 'E-Commerce / Food & Beverage',
    businessType: 'D2C Subscription Brand',
    keyOffering: 'Premium Arabica Coffee Beans',
    brandTone: ['Premium', 'Ethical', 'Artisanal'],
    targetAudience: {
        tags: ['Age: 25 - 45', 'White-collar Professionals', 'Coffee Enthusiasts', 'High Disposable Income'],
        description: 'Primary personas include urban professionals and home baristas who value sustainability and origin transparency.'
    },
    keySellingPoints: [
        'Ethically sourced from single-estate farms',
        'Freshly roasted less than 48 hours before delivery',
        'Subscription model saves 20% vs retail',
        'Combines convenience with cafe-quality taste'
    ],
    location: 'Mumbai, India',
    currency: 'INR (₹)',
    businessDescription: ''
};

const StepAIAnalysis = ({ onComplete, onBack, data, ai }) => {
    const [isAnalyzing, setIsAnalyzing] = useState(!ai?.analysisDone);
    const [progress, setProgress] = useState(0);

    // Editable State
    const [analysisData, setAnalysisData] = useState(INITIAL_DATA);
    const [editMode, setEditMode] = useState({
        business: false,
        audience: false,
        sellingPoints: false,
        location: false
    });

    // Temporary state for edits (before save)
    const [tempData, setTempData] = useState(INITIAL_DATA);

    // Re-analysis simulation
    const [isReanalyzing, setIsReanalyzing] = useState(false);
    const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);

    // File Upload State
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [websiteUrl, setWebsiteUrl] = useState('');

    // Mock Analysis Process (Initial)
    useEffect(() => {
        if (!ai?.analysisDone) {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setIsAnalyzing(false);
                        return 100;
                    }
                    return prev + 2;
                });
            }, 40);
            return () => clearInterval(interval);
        } else {
            setProgress(100);
        }
    }, [ai?.analysisDone]);

    const handleNext = () => {
        if (onComplete) {
            onComplete({
                analysisTimestamp: new Date().toISOString(),
                ...analysisData
            });
        }
    };

    // --- Edit Handlers ---

    const startEdit = (section) => {
        setTempData({ ...analysisData }); // Reset temp data to current data
        setEditMode(prev => ({ ...prev, [section]: true }));
    };

    const cancelEdit = (section) => {
        setEditMode(prev => ({ ...prev, [section]: false }));
        setTempData({ ...analysisData }); // Revert changes
    };

    const saveEdit = (section) => {
        setEditMode(prev => ({ ...prev, [section]: false }));
        setAnalysisData({ ...tempData });
        triggerReanalysis();
    };

    const triggerReanalysis = () => {
        setIsReanalyzing(true);
        setTimeout(() => {
            setIsReanalyzing(false);
            setShowUpdateSuccess(true);
            setTimeout(() => setShowUpdateSuccess(false), 3000);
        }, 2000);
    };

    // Generic Change Handler
    const handleTempChange = (field, value) => {
        setTempData(prev => ({ ...prev, [field]: value }));
    };

    const handleNestedTempChange = (parent, field, value) => {
        setTempData(prev => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [field]: value
            }
        }));
    };

    // Array/Tag Handlers
    const handleTagRemove = (parent, type, index) => { // parent=null if top level array
        if (parent) {
            const newTags = [...tempData[parent][type]];
            newTags.splice(index, 1);
            handleNestedTempChange(parent, type, newTags);
        } else {
            // For brandTone which is top level array
            const newTags = [...tempData[type]];
            newTags.splice(index, 1);
            handleTempChange(type, newTags);
        }
    };

    const handleTagAdd = (parent, type, value) => {
        if (!value) return;
        if (parent) {
            const newTags = [...tempData[parent][type], value];
            handleNestedTempChange(parent, type, newTags);
        } else {
            const newTags = [...tempData[type], value];
            handleTempChange(type, newTags);
        }
    };

    // Check for modifications
    const isModified = (section) => {
        return JSON.stringify(analysisData[section]) !== JSON.stringify(INITIAL_DATA[section]);
    };

    const resetSection = (section) => {
        setAnalysisData(prev => ({ ...prev, [section]: INITIAL_DATA[section] }));
        if (editMode[section]) {
            setTempData(prev => ({ ...prev, [section]: INITIAL_DATA[section] }));
        }
    };

    const ModificationLabel = ({ section }) => {
        if (isModified(section)) {
            return (
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 whitespace-nowrap">
                        Edited by You
                    </span>
                    <button
                        onClick={() => resetSection(section)}
                        className="text-[10px] text-gray-400 hover:text-red-500 underline decoration-dotted"
                        title="Reset to AI Suggestion"
                    >
                        Reset
                    </button>
                </div>
            );
        }
        return (
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100 whitespace-nowrap">
                AI Suggested
            </span>
        );
    };

    const fileInputRef = useRef(null);

    const handleFileUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newFiles = files.map(file => ({
                name: file.name,
                size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                type: file.type
            }));
            setUploadedFiles(prev => [...prev, ...newFiles]);
        }
    };

    const handleFileRemove = (index) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    if (isAnalyzing) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] animate-fade-in py-12">
                <div className="mb-8 relative">
                    <div className="w-24 h-24 border-4 border-gray-100 rounded-full"></div>
                    <div className="w-24 h-24 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                    <div className="absolute inset-0 flex items-center justify-center font-bold text-gray-700 text-lg">
                        {progress}%
                    </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Analyzing your Business</h3>
                <p className="text-gray-500 max-w-md text-center">
                    Our AI is scanning your inputs, identifying your ideal customer profile, and generating key selling points...
                </p>

                <div className="mt-8 space-y-3 w-full max-w-xs mx-auto pl-8">
                    <div className={`flex items-center gap-3 text-sm transition-colors ${progress > 20 ? 'text-green-600' : 'text-gray-300'}`}>
                        <CheckCircle2 className="w-4 h-4" /> <span> Analyzing Business Type</span>
                    </div>
                    <div className={`flex items-center gap-3 text-sm transition-colors ${progress > 50 ? 'text-green-600' : 'text-gray-300'}`}>
                        <CheckCircle2 className="w-4 h-4" /> <span> Identifying Target Audience</span>
                    </div>
                    <div className={`flex items-center gap-3 text-sm transition-colors ${progress > 80 ? 'text-green-600' : 'text-gray-300'}`}>
                        <CheckCircle2 className="w-4 h-4" /> <span> Detecting Currency & Location</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in-up space-y-8">

            {/* Top Grid: Business & Audience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* 1. Business Summary */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-gray-400" />
                            <h3 className="font-semibold text-gray-900">Business Summary</h3>
                            <ModificationLabel section='business' />
                        </div>
                        {!editMode.business ? (
                            <button onClick={() => startEdit('business')} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-blue-600 transition-colors">
                                <Pencil className="w-4 h-4" />
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button onClick={() => saveEdit('business')} className="p-1 hover:bg-green-50 rounded text-green-600 transition-colors" title="Save">
                                    <Save className="w-4 h-4" />
                                </button>
                                <button onClick={() => cancelEdit('business')} className="p-1 hover:bg-red-50 rounded text-red-500 transition-colors" title="Cancel">
                                    <XIcon className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                    <div className={`bg-gray-50 rounded-xl p-5 border transition-all ${editMode.business ? 'border-blue-300 ring-4 ring-blue-50 bg-white' : 'border-gray-100'}`}>
                        <div className="space-y-3">
                            {/* Industry */}
                            <div className="grid grid-cols-3 gap-2 text-sm items-center">
                                <span className="text-gray-500">Industry</span>
                                <div className="col-span-2">
                                    {editMode.business ? (
                                        <Input
                                            value={tempData.industry}
                                            onChange={(e) => handleTempChange('industry', e.target.value)}
                                            className="h-8 text-sm"
                                        />
                                    ) : (
                                        <span className="font-medium text-gray-900">{analysisData.industry}</span>
                                    )}
                                </div>
                            </div>
                            {/* Business Type */}
                            <div className="grid grid-cols-3 gap-2 text-sm items-center">
                                <span className="text-gray-500">Business Type</span>
                                <div className="col-span-2">
                                    {editMode.business ? (
                                        <Input
                                            value={tempData.businessType}
                                            onChange={(e) => handleTempChange('businessType', e.target.value)}
                                            className="h-8 text-sm"
                                        />
                                    ) : (
                                        <span className="font-medium text-gray-900">{analysisData.businessType}</span>
                                    )}
                                </div>
                            </div>
                            {/* Key Offering */}
                            <div className="grid grid-cols-3 gap-2 text-sm items-center">
                                <span className="text-gray-500">Key Offering</span>
                                <div className="col-span-2">
                                    {editMode.business ? (
                                        <Input
                                            value={tempData.keyOffering}
                                            onChange={(e) => handleTempChange('keyOffering', e.target.value)}
                                            className="h-8 text-sm"
                                        />
                                    ) : (
                                        <span className="font-medium text-gray-900">{analysisData.keyOffering}</span>
                                    )}
                                </div>
                            </div>
                            {/* Brand Tone */}
                            <div className="grid grid-cols-3 gap-2 text-sm items-start">
                                <span className="text-gray-500 mt-1">Brand Tone</span>
                                <div className="col-span-2">
                                    {editMode.business ? (
                                        <div className="flex flex-wrap gap-2">
                                            {tempData.brandTone.map((tag, i) => (
                                                <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                                    {tag}
                                                    <button onClick={() => handleTagRemove(null, 'brandTone', i)}><XIcon className="w-3 h-3" /></button>
                                                </span>
                                            ))}
                                            <input
                                                type="text"
                                                placeholder="+ Add"
                                                className="text-xs bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none w-16"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleTagAdd(null, 'brandTone', e.target.value);
                                                        e.target.value = '';
                                                    }
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <span className="font-medium text-gray-900">{analysisData.brandTone.join(', ')}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        {editMode.business && <div className="mt-3 text-xs text-blue-600 font-medium">✨ Saving will refresh recommendations</div>}
                    </div>
                </div>

                {/* 2. Target Audience */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-gray-400" />
                            <h3 className="font-semibold text-gray-900">Target Audience</h3>
                            <ModificationLabel section='audience' />
                        </div>
                        {!editMode.audience ? (
                            <button onClick={() => startEdit('audience')} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-blue-600 transition-colors">
                                <Pencil className="w-4 h-4" />
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button onClick={() => saveEdit('audience')} className="p-1 hover:bg-green-50 rounded text-green-600 transition-colors">
                                    <Save className="w-4 h-4" />
                                </button>
                                <button onClick={() => cancelEdit('audience')} className="p-1 hover:bg-red-50 rounded text-red-500 transition-colors">
                                    <XIcon className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                    <div className={`bg-gray-50 rounded-xl p-5 border transition-all ${editMode.audience ? 'border-blue-300 ring-4 ring-blue-50 bg-white' : 'border-gray-100'}`}>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {(editMode.audience ? tempData.targetAudience.tags : analysisData.targetAudience.tags).map((tag, i) => (
                                <span key={i} className={`px-3 py-1 border rounded-full text-xs font-medium shadow-sm ${editMode.audience ? 'bg-blue-50 border-blue-200 text-blue-800 pr-2' : 'bg-white border-gray-200 text-gray-700'}`}>
                                    {tag}
                                    {editMode.audience && (
                                        <button onClick={() => handleTagRemove('targetAudience', 'tags', i)} className="ml-2 hover:text-red-500">
                                            <XIcon className="w-3 h-3 inline" />
                                        </button>
                                    )}
                                </span>
                            ))}
                            {editMode.audience && (
                                <input
                                    type="text"
                                    placeholder="+ Add Tag"
                                    className="px-3 py-1 bg-white border border-dashed border-gray-300 rounded-full text-xs focus:border-blue-500 outline-none min-w-[80px]"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleTagAdd('targetAudience', 'tags', e.target.value);
                                            e.target.value = '';
                                        }
                                    }}
                                />
                            )}
                        </div>

                        {/* Description */}
                        {editMode.audience ? (
                            <textarea
                                value={tempData.targetAudience.description}
                                onChange={(e) => handleNestedTempChange('targetAudience', 'description', e.target.value)}
                                className="w-full text-xs text-gray-700 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
                                rows={3}
                            />
                        ) : (
                            <p className="text-xs text-gray-500 leading-relaxed">
                                {analysisData.targetAudience.description}
                            </p>
                        )}
                        {editMode.audience && <div className="mt-2 text-xs text-blue-600 font-medium">✨ Update analysis to refine targeting</div>}
                    </div>
                </div>
            </div>

            <div className="h-px bg-gray-100 w-full" />

            {/* Middle: USPs and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* 3. Key Selling Points */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-gray-400" />
                            <h3 className="font-semibold text-gray-900">Key Selling Points</h3>
                            <ModificationLabel section='sellingPoints' />
                        </div>
                        {!editMode.sellingPoints ? (
                            <button onClick={() => startEdit('sellingPoints')} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-blue-600 transition-colors">
                                <Pencil className="w-4 h-4" />
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button onClick={() => saveEdit('sellingPoints')} className="p-1 hover:bg-green-50 rounded text-green-600 transition-colors">
                                    <Save className="w-4 h-4" />
                                </button>
                                <button onClick={() => cancelEdit('sellingPoints')} className="p-1 hover:bg-red-50 rounded text-red-500 transition-colors">
                                    <XIcon className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                    <div className={`rounded-xl p-5 border transition-all ${editMode.sellingPoints ? 'border-blue-300 ring-4 ring-blue-50 bg-white' : 'border-gray-100 bg-white shadow-sm'}`}>
                        <ul className="space-y-3">
                            {(editMode.sellingPoints ? tempData.keySellingPoints : analysisData.keySellingPoints).map((point, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-gray-700 group">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                    {editMode.sellingPoints ? (
                                        <div className="flex-1 flex items-center gap-2">
                                            <input
                                                value={point}
                                                onChange={(e) => {
                                                    const newPoints = [...tempData.keySellingPoints];
                                                    newPoints[i] = e.target.value;
                                                    handleTempChange('keySellingPoints', newPoints);
                                                }}
                                                className="flex-1 text-sm border-b border-gray-300 focus:border-blue-500 outline-none bg-transparent py-1"
                                            />
                                            <button onClick={() => handleTagRemove(null, 'keySellingPoints', i)} className="text-gray-400 hover:text-red-500">
                                                <XIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <span>{point}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                        {editMode.sellingPoints && (
                            <button
                                onClick={() => handleTagAdd(null, 'keySellingPoints', 'New Selling Point')}
                                className="mt-4 text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                            >
                                + Add Point
                            </button>
                        )}
                    </div>
                </div>

                {/* 4. Location & Compliance */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-gray-400" />
                                <h3 className="font-semibold text-gray-900">Location Settings</h3>
                            </div>
                            {!editMode.location ? (
                                <button onClick={() => startEdit('location')} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-blue-600 transition-colors">
                                    <Pencil className="w-4 h-4" />
                                </button>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <button onClick={() => saveEdit('location')} className="p-1 hover:bg-green-50 rounded text-green-600 transition-colors">
                                        <Save className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => cancelEdit('location')} className="p-1 hover:bg-red-50 rounded text-red-500 transition-colors">
                                        <XIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className={`p-4 rounded-xl border transition-all ${editMode.location ? 'border-blue-300 ring-4 ring-blue-50 bg-white' : 'border-gray-200 bg-white'}`}>
                            <div className="flex gap-4">
                                <div className={`flex-1 px-4 py-2 bg-blue-50 text-blue-800 rounded-lg text-sm font-medium border border-blue-100 flex items-center gap-2`}>
                                    <span className="shrink-0">📍</span>
                                    {editMode.location ? (
                                        <input
                                            value={tempData.location}
                                            onChange={(e) => handleTempChange('location', e.target.value)}
                                            className="bg-transparent border-none outline-none w-full text-blue-800 placeholder-blue-400"
                                        />
                                    ) : (
                                        <span>{analysisData.location}</span>
                                    )}
                                </div>
                                <div className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200 flex items-center justify-center min-w-[80px]">
                                    {editMode.location ? (
                                        <input
                                            value={tempData.currency}
                                            onChange={(e) => handleTempChange('currency', e.target.value)}
                                            className="bg-transparent border-none outline-none w-full text-center text-gray-700"
                                        />
                                    ) : (
                                        <span>{analysisData.currency}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <ShieldCheck className="w-5 h-5 text-gray-400" />
                            <h3 className="font-semibold text-gray-900">Compliance Check</h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-4 py-3 rounded-lg border border-green-100">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>Business category eligible for Meta & Google Ads.</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* NEW: Add More Business Information */}
            <div className="mt-8 pt-8 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Add More Business Information</h3>
                        <p className="text-sm text-gray-500">Provide additional files or links to improve AI recommendations.</p>
                    </div>
                    {/* Only show update button if files added, url changed, or description changed */}
                    {(uploadedFiles.length > 0 || websiteUrl || analysisData.businessDescription !== INITIAL_DATA.businessDescription) && (
                        <Button
                            variant="secondary"
                            onClick={triggerReanalysis}
                            disabled={isReanalyzing}
                            icon={RefreshCw}
                            className={isReanalyzing ? "animate-pulse" : ""}
                        >
                            {isReanalyzing ? "Updating Analysis..." : "Update Analysis"}
                        </Button>
                    )}
                </div>

                {/* Business Description Field */}
                <div className="mb-8">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Business Description</label>
                    <textarea
                        className="w-full p-4 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none min-h-[120px] transition-all"
                        placeholder="Describe your business, products, services, target audience, and unique value proposition."
                        value={analysisData.businessDescription}
                        onChange={(e) => setAnalysisData(prev => ({ ...prev, businessDescription: e.target.value }))}
                        maxLength={1000}
                    />
                    <div className="mt-2 flex justify-between items-center">
                        <p className="text-xs text-gray-500">
                            This helps generate more accurate ad targeting and creative suggestions.
                        </p>
                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                            {analysisData.businessDescription?.length || 0} / 1000
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* File Upload */}
                    <div className="border border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer" onClick={handleFileUpload}>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            multiple
                            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                        />
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3">
                            <Upload className="w-6 h-6" />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">Upload Documents</h4>
                        <p className="text-xs text-gray-500 mb-4">PDF, DOCX, or Images (Max 10MB)</p>
                        <Button size="sm" variant="outline">Select Files</Button>
                    </div>

                    {/* URL Input */}
                    <div className="border border-gray-200 rounded-xl p-6">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <Globe2 className="w-4 h-4 text-gray-400" />
                            <span>Website / Landing Page</span>
                        </h4>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="url"
                                    placeholder="https://example.com"
                                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                                    value={websiteUrl}
                                    onChange={(e) => setWebsiteUrl(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Attached Files</h5>
                            {uploadedFiles.length === 0 ? (
                                <p className="text-xs text-gray-400 italic">No files attached yet.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {uploadedFiles.map((file, i) => (
                                        <li key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100 text-xs">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <FileText className="w-3 h-3 text-blue-500" />
                                                <span className="truncate max-w-[150px]">{file.name}</span>
                                                <span className="text-gray-400">({file.size})</span>
                                            </div>
                                            <button
                                                onClick={() => handleFileRemove(i)}
                                                className="text-gray-400 hover:text-red-500"
                                            >
                                                <XIcon className="w-3 h-3" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Update Success Toast */}
            {showUpdateSuccess && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 animate-fade-in-up z-50">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium">AI Analysis Updated Successfully!</span>
                </div>
            )}

            {/* Footer Actions */}
            <div className="pt-8 mt-8 border-t border-gray-100">
                <StepNavigation
                    onNext={handleNext}
                    onBack={onBack}
                    nextLabel="Continue to Ad Creation →"
                />
            </div>
        </div>
    );
};

export default StepAIAnalysis;

