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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.website) return;

        const newProject = createProject(formData);
        navigate(`/marketing/projects/${newProject.id}`);
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

                    <div className="pt-4 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate('/marketing/projects')}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            Create Project
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
