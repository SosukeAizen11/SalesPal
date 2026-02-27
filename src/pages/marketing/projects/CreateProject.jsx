import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useMarketing } from '../../../context/MarketingContext';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

export default function CreateProject() {
    const navigate = useNavigate();
    const { createProject } = useMarketing();
    const [formData, setFormData] = useState({
        name: '',
        industry: '',
        website: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.website || isSubmitting) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const data = await createProject(formData);

            if (data?.id) {
                navigate(`/marketing/projects/${data.id}`);
            } else {
                setError('Failed to create project. Please try again.');
            }
        } catch (err) {
            console.error('Error creating project:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <button
                onClick={() => navigate('/marketing/projects')}
                className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Projects
            </button>

            <Card className="p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Project</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Project Name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Q1 Marketing Drive"
                        required
                    />

                    <Select
                        label="Industry"
                        value={formData.industry}
                        onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                        required
                    >
                        <option value="">Select industry</option>
                        <option value="SaaS">SaaS</option>
                        <option value="Real Estate">Real Estate</option>
                        <option value="E-commerce">E-commerce</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Education">Education</option>
                    </Select>

                    <Input
                        type="url"
                        label="Website URL"
                        value={formData.website}
                        onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                        placeholder="https://example.com"
                        required
                    />

                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="pt-4 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate('/marketing/projects')}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create Project'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
