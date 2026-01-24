import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, ExternalLink, Facebook, Chrome, Linkedin, Pause, Play, Trash, Copy, Edit } from 'lucide-react';
import CampaignStatusBadge from './CampaignStatusBadge';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Dropdown from '../../../components/ui/Dropdown';

const CampaignCard = ({ campaign = {}, onToggleStatus, onEdit, onDelete }) => {
    const navigate = useNavigate();
    const { id, name, status, platforms = [], dailyBudget, leads, projectId } = campaign;

    const getPlatformIcon = (p) => {
        if (p.includes('Facebook')) return <Facebook key={p} className="w-4 h-4 text-[#1877F2]" />;
        if (p.includes('Google')) return <Chrome key={p} className="w-4 h-4 text-[#EA4335]" />;
        if (p.includes('LinkedIn')) return <Linkedin key={p} className="w-4 h-4 text-[#0077B5]" />;
        return null;
    };

    const isRunning = status === 'active';

    return (
        <Card className="animate-fade-in-up">
            <div className="flex items-start justify-between mb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900 text-lg">{name || 'Campaign'}</h3>
                        <CampaignStatusBadge status={status || 'draft'} />
                    </div>
                    <p className="text-sm text-gray-500">Created just now • South Mumbai Real Estate</p>
                </div>
                <Dropdown
                    trigger={
                        <button className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    }
                >
                    <Dropdown.Item onClick={() => onEdit(campaign)}>
                        <div className="flex items-center gap-2">
                            <Edit className="w-4 h-4" />
                            Edit Campaign
                        </div>
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => {/* Duplicate Mock */ }}>
                        <div className="flex items-center gap-2">
                            <Copy className="w-4 h-4" />
                            Duplicate Campaign
                        </div>
                    </Dropdown.Item>
                    <Dropdown.Item variant="danger" onClick={() => onDelete(campaign)}>
                        <div className="flex items-center gap-2">
                            <Trash className="w-4 h-4" />
                            Delete Campaign
                        </div>
                    </Dropdown.Item>
                </Dropdown>
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

            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <Button
                    variant="secondary"
                    onClick={() => onToggleStatus(campaign)}
                >
                    {isRunning ? (
                        <>
                            <Pause className="w-4 h-4 mr-2" />
                            Pause Campaign
                        </>
                    ) : (
                        <>
                            <Play className="w-4 h-4 mr-2" />
                            Resume Campaign
                        </>
                    )}
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => navigate(`/marketing/projects/${projectId}/campaigns/${id}`)}
                    className="bg-secondary/10 text-secondary border-none hover:bg-secondary/20"
                >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Details
                </Button>
            </div>
        </Card>
    );
};

export default CampaignCard;
