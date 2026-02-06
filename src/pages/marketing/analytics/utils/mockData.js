export const getMockAnalyticsData = (timeRange, projectId, channel) => {
    // Multipliers for varying data based on filters
    const timeMultiplier = timeRange === 'today' ? 1 : timeRange === '7d' ? 7 : 30;
    const projectMultiplier = projectId === 'all' ? 3 : 1; // "All" aggregates ~3 projects
    const channelMultiplier = channel === 'all' ? 1 : 0.4; // Single channel is subset

    const baseModifier = timeMultiplier * projectMultiplier * channelMultiplier;

    return {
        trends: {
            dates: Array.from({ length: timeRange === 'today' ? 24 : 7 }, (_, i) =>
                timeRange === 'today' ? `${i}:00` : `Day ${i + 1}`
            ),
            leads: Array.from({ length: 7 }, () => Math.floor(Math.random() * 50 * baseModifier)),
            spend: Array.from({ length: 7 }, () => Math.floor(Math.random() * 500 * baseModifier)),
            conversions: Array.from({ length: 7 }, () => Math.floor(Math.random() * 5 * baseModifier)),
        },
        spendAnalysis: {
            total: 12450 * baseModifier,
            dailyAvg: (12450 * baseModifier) / timeMultiplier,
            trend: '+12.5%'
        },
        platformSplit: [
            { name: 'Meta Ads', value: 45, color: '#1877F2' },
            { name: 'Google Ads', value: 35, color: '#DB4437' },
            { name: 'LinkedIn', value: 20, color: '#0A66C2' },
        ],
        kpis: {
            activeProjects: { value: Math.floor(12 * projectMultiplier), trend: null }, // distinct from total projects
            cpl: { value: '$' + (12.5 * (1 + Math.random() * 0.2)).toFixed(2), trend: '-2.1%' },
            convRate: { value: (3.2 * (1 + Math.random() * 0.1)).toFixed(1) + '%', trend: '+0.5%' },
            totalSpend: { value: '$' + (Math.floor(12450 * baseModifier)).toLocaleString(), trend: '+8%' },
            totalLeads: { value: Math.floor(850 * baseModifier).toLocaleString(), trend: '+12%' },
        },
        funnel: {
            impressions: Math.floor(150000 * baseModifier),
            clicks: Math.floor(4500 * baseModifier),
            leads: Math.floor(450 * baseModifier),
            conversions: Math.floor(45 * baseModifier),
            rates: {
                ctr: '3.0%',
                leadCvR: '10.0%',
                dealCvR: '10.0%'
            }
        },
        attribution: {
            model: 'Last Click',
            breakdown: [
                { channel: 'Meta Ads', value: 45, color: '#1877F2' },
                { channel: 'Google Ads', value: 35, color: '#DB4437' },
                { channel: 'LinkedIn', value: 20, color: '#0A66C2' }
            ]
        },
        campaigns: Array.from({ length: 5 }, (_, i) => ({
            id: `cmp-${i}`,
            name: `${['Summer', 'Intercom', 'Retargeting', 'Brand', 'Competitor'][i]} Promo ${2024 + i}`,
            projectName: `Project ${['Alpha', 'Beta', 'Gamma'][i % 3]}`,
            platform: ['Meta', 'Google', 'Meta', 'LinkedIn', 'Google'][i],
            status: i === 1 ? 'Paused' : 'Running',
            spend: '$' + Math.floor(Math.random() * 2000 * baseModifier).toLocaleString(),
            leads: Math.floor(Math.random() * 50 * baseModifier),
            cpl: '$' + (10 + Math.random() * 20).toFixed(2),
            ctr: (1 + Math.random() * 2).toFixed(2) + '%'
        })),
        insights: [
            {
                id: 'ins-1',
                title: 'CTR Drop Detected',
                severity: 'high',
                scope: { type: 'Platform', name: 'Meta Ads' },
                metric: 'CTR',
                trend: '-15%',
                desc: 'Click-through rate dropped significantly below 30-day average.'
            },
            {
                id: 'ins-2',
                title: 'CPL Optimization Opp',
                severity: 'medium',
                scope: { type: 'Campaign', name: 'Summer Promo' },
                metric: 'CPL',
                trend: '+8%',
                desc: 'Cost per lead is trending up. Consider refreshing creatives.'
            },
            {
                id: 'ins-3',
                title: 'Budget Underspend',
                severity: 'low',
                scope: { type: 'Project', name: 'Global' },
                metric: 'Spend',
                trend: '-5%',
                desc: 'You are currently underspending your daily budget cap.'
            }
        ],
        recommendations: [
            {
                id: 'rec-1',
                title: 'Shift Budget to LinkedIn',
                subtext: 'High performing channel',
                impact: ['+15% Leads', '-10% CPL'],
                risk: 'medium',
                target: 'Campaign: B2B Q3',
                previewData: {
                    before: { spend: '$50/day', leads: '12', cpl: '$4.16' },
                    after: { spend: '$80/day', leads: '21', cpl: '$3.80' }
                }
            },
            {
                id: 'rec-2',
                title: 'Pause "Competitor" Ad Set',
                subtext: 'Low conversion rate',
                impact: ['Save $200/wk', '+2% ROI'],
                risk: 'low',
                target: 'Ad Set: Comp Keywords',
                previewData: {
                    before: { spend: '$250/wk', leads: '2', cpl: '$125' },
                    after: { spend: '$0/wk', leads: '0', cpl: '$0' }
                }
            }
        ],
        actionHistory: [
            { id: 1, action: 'Increased Budget (Google)', status: 'Applied', date: '2 hrs ago', scope: 'Campaign A' },
            { id: 2, action: 'Paused Creative #4', status: 'Applied', date: 'Yesterday', scope: 'Ad Set B' },
            { id: 3, action: 'Bid Strategy Change', status: 'Ignored', date: '2 days ago', scope: 'Campaign C' }
        ]
    };
};
