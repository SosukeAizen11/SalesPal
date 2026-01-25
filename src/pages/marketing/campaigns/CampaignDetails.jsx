import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMarketing } from '../../../context/MarketingContext';
import CampaignHeader from './components/CampaignHeader';
import CampaignOverview from './components/CampaignOverview';
import CampaignInsights from './components/CampaignInsights';
import { Minimize2, RefreshCw, TrendingUp } from 'lucide-react';
import AIActionList from '../components/AIActionList';
import ActionResultBanner from '../components/ActionResultBanner';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import ConfirmationModal from '../../../components/ui/ConfirmationModal';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

export default function CampaignDetails() {
    const { campaignId } = useParams();
    const navigate = useNavigate();
    const { getCampaignById, applyAIAction } = useMarketing();
    const [campaign, setCampaign] = useState(null);
    const [actionResult, setActionResult] = useState(null);
    const [appliedActions, setAppliedActions] = useState([]);

    useEffect(() => {
        const foundCampaign = getCampaignById(campaignId);
        if (foundCampaign) {
            setCampaign(foundCampaign);
        }
    }, [campaignId, getCampaignById, appliedActions]); // Re-fetch when actions applied

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editData, setEditData] = useState({ dailyBudget: '', status: 'active' });
    const { updateCampaign, deleteCampaign } = useMarketing();

    useEffect(() => {
        if (campaign) {
            setEditData({
                dailyBudget: campaign.dailyBudget || '',
                status: campaign.status || 'active'
            });
        }
    }, [campaign]);

    const handleUpdateCampaign = (e) => {
        e.preventDefault();
        updateCampaign(campaignId, editData);
        setIsEditModalOpen(false);
        setCampaign(prev => ({ ...prev, ...editData }));
    };

    const handleDeleteCampaign = () => {
        deleteCampaign(campaignId);
        navigate(`/marketing/projects/${campaign.projectId}`);
    };

    const handleApplyAction = (actionType) => {
        if (window.confirm("Are you sure you want to apply this AI optimization?")) {
            applyAIAction(campaignId, actionType);
            setAppliedActions(prev => [...prev, actionType]);

            let message = "Optimization applied successfully.";
            if (actionType === 'SCALE_CAMPAIGN') message = "Budget scaled by 20% successfully.";
            if (actionType === 'OPTIMIZE_BUDGET') message = "Budget reallocated to top platforms.";
            if (actionType === 'ROTATE_CREATIVES') message = "Creative rotation scheduled.";

            setActionResult(message);
        }
    };

    if (!campaign) {
        return <div className="p-8 text-center text-gray-500">Loading campaign...</div>;
    }

    const ACTIONS = [
        {
            type: 'OPTIMIZE_BUDGET',
            title: 'Optimize Budget',
            description: 'Automatically reallocate budget to high-performing ad sets',
            impact: '+15% Efficiency'
        },
        {
            type: 'ROTATE_CREATIVES',
            title: 'Rotate Creatives',
            description: 'Switch underperforming creatives with new AI-generated variants',
            impact: 'Freshness Boost'
        },
        {
            type: 'SCALE_CAMPAIGN',
            title: 'Scale Campaign',
            description: 'Increase reach by expanding to lookalike audiences (increases budget)',
            impact: '+20% Reach'
        }
    ];

    return (
        <div className="py-8 animate-fade-in-up">
            <ActionResultBanner message={actionResult} onClose={() => setActionResult(null)} />

            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CampaignHeader campaign={campaign} />
                <div className="flex gap-2 shrink-0">
                    <Button
                        variant="secondary"
                        onClick={() => setIsEditModalOpen(true)}
                    >
                        Edit Campaign
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => setIsDeleteModalOpen(true)}
                    >
                        Delete
                    </Button>
                </div>
            </div>

            <CampaignOverview campaign={campaign} />
            <CampaignInsights />

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-6">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-slate-900">Recommended Actions</h2>
                    <p className="text-sm text-slate-500">AI-driven suggestions to improve campaign performance</p>
                </div>
                <AIActionList
                    actions={ACTIONS}
                    onApplyAction={handleApplyAction}
                    appliedActions={appliedActions}
                />
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Campaign"
            >
                <form onSubmit={handleUpdateCampaign} className="space-y-4">
                    <Input
                        label="Daily Budget"
                        value={editData.dailyBudget}
                        onChange={(e) => setEditData({ ...editData, dailyBudget: e.target.value })}
                        placeholder="e.g. ₹5,000"
                    />
                    <Select
                        label="Status"
                        value={editData.status}
                        onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                    >
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="draft">Draft</option>
                        <option value="ended">Ended</option>
                    </Select>
                    <div className="flex justify-end gap-2 mt-6">
                        <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Save Changes</Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteCampaign}
                title="Delete Campaign"
                message="Are you sure you want to delete this campaign? This action cannot be undone."
                confirmText="Delete Campaign"
            />
        </div>
    );
}
