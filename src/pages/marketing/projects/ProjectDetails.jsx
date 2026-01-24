import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, FolderOpen, Globe, Settings } from 'lucide-react';
import { useMarketing } from '../../../context/MarketingContext';
import CampaignCard from '../components/CampaignCard';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Card from '../../../components/ui/Card';
import Modal from '../../../components/ui/Modal';
import ConfirmationModal from '../../../components/ui/ConfirmationModal';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

export default function ProjectDetails() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { getProjectById, getCampaignsByProject, updateProject, deleteProject } = useMarketing();

    // Modals state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editData, setEditData] = useState({ name: '', industry: '', website: '' });

    // Campaign Modals state
    const [isCampaignEditModalOpen, setIsCampaignEditModalOpen] = useState(false);
    const [isCampaignDeleteModalOpen, setIsCampaignDeleteModalOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [campaignEditData, setCampaignEditData] = useState({ dailyBudget: '', status: 'active' });

    // Safety check if hooks run before data loads or invalid ID
    const project = getProjectById(projectId);
    const campaigns = getCampaignsByProject(projectId);

    useEffect(() => {
        if (project) {
            setEditData({
                name: project.name,
                industry: project.industry,
                website: project.website || ''
            });
        }
    }, [project]);

    const handleUpdateProject = (e) => {
        e.preventDefault();
        updateProject(projectId, editData);
        setIsEditModalOpen(false);
    };

    const handleDeleteProject = () => {
        deleteProject(projectId);
        navigate('/marketing/projects');
    };

    const handleCampaignEditClick = (campaign) => {
        setSelectedCampaign(campaign);
        setCampaignEditData({
            dailyBudget: campaign.dailyBudget || '',
            status: campaign.status || 'active'
        });
        setIsCampaignEditModalOpen(true);
    };

    const handleCampaignDeleteClick = (campaign) => {
        setSelectedCampaign(campaign);
        setIsCampaignDeleteModalOpen(true);
    };

    const handleCampaignToggleStatus = (campaign) => {
        const newStatus = campaign.status === 'active' ? 'paused' : 'active';
        updateCampaign(campaign.id, { status: newStatus });
    };

    const handleUpdateCampaign = (e) => {
        e.preventDefault();
        if (selectedCampaign) {
            updateCampaign(selectedCampaign.id, campaignEditData);
            setIsCampaignEditModalOpen(false);
            setSelectedCampaign(null);
        }
    };

    const handleDeleteCampaignConfirm = () => {
        if (selectedCampaign) {
            deleteCampaign(selectedCampaign.id);
            setIsCampaignDeleteModalOpen(false);
            setSelectedCampaign(null);
        }
    };

    // ... existing Project handlers ...

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <FolderOpen className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">Project not found</h3>
                <p className="text-gray-500 mb-6">The project you are looking for does not exist or has been deleted.</p>
                <Button onClick={() => navigate('/marketing/projects')}>
                    Back to Projects
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
            {/* Header ... */}
            <div>
                <button
                    onClick={() => navigate('/marketing/projects')}
                    className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Projects
                </button>
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                            <FolderOpen className="w-8 h-8 text-blue-600" />
                            {project.name}
                        </h1>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <Badge variant="primary">
                                {project.industry}
                            </Badge>
                            {project.website && (
                                <span className="flex items-center gap-1 text-gray-500">
                                    <Globe className="w-3 h-3" />
                                    {project.website}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => setIsEditModalOpen(true)}
                        >
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                        </Button>
                        <Button
                            onClick={() => navigate(`/marketing/projects/${projectId}/campaigns/new`)}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            New Campaign
                        </Button>
                    </div>
                </div>
            </div>

            {/* Edit Project Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Project Settings"
            >
                <form onSubmit={handleUpdateProject} className="space-y-4">
                    <Input
                        label="Project Name"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        required
                    />
                    <Select
                        label="Industry"
                        value={editData.industry}
                        onChange={(e) => setEditData(prev => ({ ...prev, industry: e.target.value }))}
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
                        label="Website"
                        value={editData.website}
                        onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                    />
                    <div className="pt-4 flex justify-between items-center border-t border-gray-100 mt-6">
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => {
                                setIsEditModalOpen(false);
                                setIsDeleteModalOpen(true);
                            }}
                        >
                            Delete Project
                        </Button>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setIsEditModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </form>
            </Modal>

            {/* Delete Project Confirmation Modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteProject}
                title="Delete Project"
                message="Are you sure you want to delete this project? This action cannot be undone and will delete all associated campaigns."
                confirmText="Delete Project"
            />

            {/* Campaigns List */}
            <div className="border-t border-gray-200 pt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Campaigns</h2>

                {campaigns.length > 0 ? (
                    <div className="space-y-4">
                        {campaigns.map(campaign => (
                            <CampaignCard
                                key={campaign.id}
                                campaign={campaign}
                                onEdit={handleCampaignEditClick}
                                onDelete={handleCampaignDeleteClick}
                                onToggleStatus={handleCampaignToggleStatus}
                            />
                        ))}
                    </div>
                ) : (
                    <Card noPadding className="bg-gray-50 border-dashed p-12 text-center">
                        <p className="text-gray-500 mb-4">No campaigns created for this project yet.</p>
                        <Button
                            variant="link"
                            onClick={() => navigate(`/marketing/projects/${projectId}/campaigns/new`)}
                        >
                            Create your first campaign
                        </Button>
                    </Card>
                )}
            </div>

            {/* Edit Campaign Modal */}
            <Modal
                isOpen={isCampaignEditModalOpen}
                onClose={() => setIsCampaignEditModalOpen(false)}
                title="Edit Campaign"
            >
                <form onSubmit={handleUpdateCampaign} className="space-y-4">
                    <Input
                        label="Name"
                        value={selectedCampaign?.name || ''}
                        disabled
                        helperText="Campaign name cannot be changed."
                    />
                    <Input
                        label="Daily Budget"
                        value={campaignEditData.dailyBudget}
                        onChange={(e) => setCampaignEditData({ ...campaignEditData, dailyBudget: e.target.value })}
                        placeholder="e.g. ₹5,000"
                    />
                    <Select
                        label="Status"
                        value={campaignEditData.status}
                        onChange={(e) => setCampaignEditData({ ...campaignEditData, status: e.target.value })}
                    >
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="draft">Draft</option>
                        <option value="ended">Ended</option>
                    </Select>
                    <div className="flex justify-end gap-2 mt-6">
                        <Button type="button" variant="secondary" onClick={() => setIsCampaignEditModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Save Changes</Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Campaign Modal */}
            <ConfirmationModal
                isOpen={isCampaignDeleteModalOpen}
                onClose={() => setIsCampaignDeleteModalOpen(false)}
                onConfirm={handleDeleteCampaignConfirm}
                title="Delete Campaign?"
                message="This action cannot be undone. This campaign will be permanently removed."
                confirmText="Delete"
                variant="danger"
            />
        </div>
    );
}
