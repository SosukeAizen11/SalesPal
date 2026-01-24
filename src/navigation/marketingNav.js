import { LayoutDashboard, Megaphone, BarChart3, Settings, Share2 } from 'lucide-react';

export const marketingNav = [
    {
        name: 'Dashboard',
        path: '/marketing',
        icon: LayoutDashboard
    },
    {
        name: 'Projects',
        path: '/marketing/projects',
        icon: Megaphone
    },
    {
        name: 'Social',
        path: '/marketing/social',
        icon: Share2
    },
    {
        name: 'Analytics',
        path: '/marketing/analytics',
        icon: BarChart3
    },
    {
        name: 'Settings',
        path: '/marketing/settings',
        icon: Settings
    }
];
