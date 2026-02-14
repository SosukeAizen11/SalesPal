import React, { useState, useRef } from 'react';
import { Upload, Camera } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../components/ui/Toast';

const ProfileTab = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        fullName: user?.name || 'Demo User',
        email: user?.email || 'demo@salespal.ai',
        role: 'Product Manager',
        phone: '+1 (555) 123-4567'
    });
    const [avatar, setAvatar] = useState(null);
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef(null);

    const getInitials = (name) => {
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setIsDirty(true);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
                setIsDirty(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        setIsDirty(false);
        showToast({ title: 'Success', description: 'Profile updated successfully', variant: 'success' });
    };

    return (
        <div className="space-y-6">
            {/* Profile Information Card */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>

                {/* Avatar Upload */}
                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Profile Picture</label>
                    <div className="flex items-center gap-6">
                        {/* Avatar Display */}
                        <div className="relative group">
                            {avatar ? (
                                <img
                                    src={avatar}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-semibold border-4 border-gray-100">
                                    {getInitials(formData.fullName)}
                                </div>
                            )}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            >
                                <Camera className="w-6 h-6 text-white" />
                            </button>
                        </div>

                        {/* Upload Button */}
                        <div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                            <Button
                                variant="secondary"
                                onClick={() => fileInputRef.current?.click()}
                                className="mb-2"
                            >
                                <Upload size={16} className="mr-2" />
                                Upload Photo
                            </Button>
                            <p className="text-xs text-gray-500">JPG, PNG or GIF. Max 2MB.</p>
                        </div>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Email (Read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            disabled
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Role / Job Title
                        </label>
                        <input
                            type="text"
                            value={formData.role}
                            onChange={(e) => handleInputChange('role', e.target.value)}
                            placeholder="e.g., Product Manager"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="+1 (555) 123-4567"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Save Button */}
                {isDirty && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <Button
                            onClick={handleSave}
                            isLoading={isSaving}
                            className="px-6"
                        >
                            Save Changes
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
};
export default ProfileTab;
