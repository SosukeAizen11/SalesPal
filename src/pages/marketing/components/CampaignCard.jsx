import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, ExternalLink, Facebook, Chrome, Linkedin, Pause, Play, Trash, Copy, Edit, Rocket } from 'lucide-react';
import CampaignStatusBadge from './CampaignStatusBadge';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Dropdown from '../../../components/ui/Dropdown';

const CampaignCard = ({ campaign = {}, onToggleStatus, onEdit, onDelete }) => {
    const navigate = useNavigate();
    const { id, name, status = 'draft', platforms = [], dailyBudget, leads, projectId } = campaign;

    const getPlatformIcon = (p) => {
        if (p.includes('Facebook') || p.includes('Meta')) return <Facebook key={p} className="w-4 h-4 text-[#1877F2]" />;
        if (p.includes('Google')) return <Chrome key={p} className="w-4 h-4 text-[#EA4335]" />;
        if (p.includes('LinkedIn')) return <Linkedin key={p} className="w-4 h-4 text-[#0077B5]" />;
        return null;
    };

    const handleViewDetails = () => {
        navigate(`/marketing/projects/${projectId}/campaigns/${id}`);
    };

    const renderActions = () => {
        switch (status) {
            case 'active': // Running
                return (
                    <>
                        <Button
                            variant="secondary"
                            onClick={() => onToggleStatus(campaign)}
                            className="text-orange-600 bg-orange-50 hover:bg-orange-100 border-none"
                        >
                            <Pause className="w-4 h-4 mr-2" />
                            Pause
                        </Button>
                        <Button onClick={handleViewDetails}>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Details
                        </Button>
                    </>
                );
            case 'paused':
                return (
                    <>
                        <Button
                            variant="secondary"
                            onClick={() => onToggleStatus(campaign)}
                            className="text-green-600 bg-green-50 hover:bg-green-100 border-none"
                        >
                            <Play className="w-4 h-4 mr-2" />
                            Resume
                        </Button>
                        <Button onClick={handleViewDetails}>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Details
                        </Button>
                    </>
                );
            case 'draft':
                return (
                    <>
                        <Button variant="secondary" onClick={() => onEdit(campaign)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                        <Button onClick={() => onToggleStatus(campaign)}>
                            <Rocket className="w-4 h-4 mr-2" />
                            Launch
                        </Button>
                    </>
                );
            case 'completed':
                return (
                    <Button onClick={handleViewDetails} className="w-full">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Details
                    </Button>
                );
            default:
                return null;
        }
    };

    return (
        <Card
            className="animate-fade-in-up cursor-pointer hover:shadow-md transition-all group"
            onClick={handleViewDetails}
        >
            <div className="flex items-start justify-between mb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900 text-lg group-hover:text-primary transition-colors">{name || 'Campaign'}</h3>
                        <CampaignStatusBadge status={status} />
                    </div>
                    <p className="text-sm text-gray-500">Created just now • South Mumbai Real Estate</p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Dropdown
                        trigger={
                            <button className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        }
                    >
                        {/* Common Actions */}
                        {status !== 'completed' && (
                            <Dropdown.Item onClick={() => onEdit(campaign)}>
                                <div className="flex items-center gap-2">
                                    <Edit className="w-4 h-4" />
                                    Edit Campaign
                                </div>
                            </Dropdown.Item>
                        )}

                        {status === 'completed' && (
                            <Dropdown.Item onClick={() => { }}>
                                <div className="flex items-center gap-2">
                                    <Copy className="w-4 h-4" />
                                    Duplicate Campaign
                                </div>
                            </Dropdown.Item>
                        )}

                        <Dropdown.Item variant="danger" onClick={() => onDelete(campaign)}>
                            <div className="flex items-center gap-2">
                                <Trash className="w-4 h-4" />
                                Delete Campaign
                            </div>
                        </Dropdown.Item>
                    </Dropdown>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
                <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Daily Spend</span>
                    <span className="text-base font-semibold text-gray-900">{dailyBudget || '₹0'}</span>
                </div>
                <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Est. Leads</span>
                    <span className="text-base font-semibold text-gray-900">{leads || 0} / mo</span>
                </div>
                <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Platforms</span>
                    <div className="flex items-center gap-2 mt-0.5">
                        {platforms.map(p => getPlatformIcon(p))}
                    </div>
                </div>
            </div>

            <div
                className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3"
                onClick={(e) => e.stopPropagation()}
            >
                {renderActions()}
            </div>
        </Card>
    );
};

export default CampaignCard;
