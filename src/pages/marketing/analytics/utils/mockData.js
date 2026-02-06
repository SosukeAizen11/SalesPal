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
            revenue: Array.from({ length: 7 }, () => Math.floor(Math.random() * 2000 * baseModifier)), // Reduced max to be realistic vs spend
            roas: Array.from({ length: 7 }, () => (1.5 + Math.random() * 4).toFixed(2)), // Random ROAS 1.5x - 5.5x
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
            roas: { value: (3.5 + Math.random()).toFixed(2) + 'x', trend: '+12%' },
            totalSpend: { value: '$' + (Math.floor(12450 * baseModifier)).toLocaleString(), trend: '+8%' },
            totalLeads: { value: Math.floor(850 * baseModifier).toLocaleString(), trend: '+12%' },
            convRate: { value: (3.2 * (1 + Math.random() * 0.1)).toFixed(1) + '%', trend: '+0.5%' },
            avgCpc: { value: '$' + (2.50 + Math.random()).toFixed(2), trend: '-4%' },
            frequency: {
                value: (1.2 + Math.random() * 3.5).toFixed(2),
                trend: '+0.1',
                // Fatigue logic: if frequency > 4.0, mark as high fatigue
                isFatigue: (1.2 + Math.random() * 3.5) > 4.0
            },
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
        campaigns: Array.from({ length: 5 }, (_, i) => {
            const platform = ['Meta', 'Google', 'Meta', 'LinkedIn', 'Google'][i];
            const baseSpend = Math.random() * 2000 * baseModifier;

            return {
                id: `cmp-${i}`,
                name: `${['Summer', 'Intercom', 'Retargeting', 'Brand', 'Competitor'][i]} Promo ${2024 + i}`,
                projectName: `Project ${['Alpha', 'Beta', 'Gamma'][i % 3]}`,
                platform: platform,
                status: i === 1 ? 'Paused' : 'Running',
                spend: '$' + Math.floor(baseSpend).toLocaleString(),
                leads: Math.floor(Math.random() * 50 * baseModifier),
                cpl: '$' + (10 + Math.random() * 20).toFixed(2),
                ctr: (1 + Math.random() * 2).toFixed(2) + '%',
                details: {
                    cpm: '$' + (15 + Math.random() * 10).toFixed(2),
                    roas: (2 + Math.random() * 3).toFixed(2),
                    convValue: '$' + Math.floor(baseSpend * (1.5 + Math.random() * 3)).toLocaleString(),
                    device: [
                        { name: 'Mobile', value: 65, color: '#3b82f6' },
                        { name: 'Desktop', value: 35, color: '#8b5cf6' }
                    ],
                    dayPerf: ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => ({
                        day: d,
                        value: Math.floor(Math.random() * 100)
                    })),
                    creatives: [
                        { name: 'Video Variant A', ctr: '2.1%', cpa: '$12.50', spend: '$500' },
                        { name: 'Static Image #2', ctr: '1.8%', cpa: '$15.20', spend: '$300' },
                        { name: 'Carousel Story', ctr: '3.5%', cpa: '$8.50', spend: '$800' }
                    ],
                    platformScore: platform === 'Google'
                        ? { label: 'Quality Score', value: (7 + Math.floor(Math.random() * 3)) + '/10', sub: 'Exp. CTR: Above Average' }
                        : { label: 'Relevance Score', value: 'High', sub: 'Feedback: Positive' },
                    impShare: platform === 'Google' ? (70 + Math.floor(Math.random() * 29)) + '%' : null,
                    clickSplit: platform === 'Meta' ? { link: 65, all: 100 } : null,
                    // Deep Drilldown Data
                    demographics: {
                        age: [
                            { range: '18-24', value: 15 },
                            { range: '25-34', value: 45 },
                            { range: '35-44', value: 25 },
                            { range: '45+', value: 15 }
                        ],
                        gender: [
                            { name: 'Male', value: 40, color: '#60a5fa' },
                            { name: 'Female', value: 55, color: '#f472b6' },
                            { name: 'Unknown', value: 5, color: '#9ca3af' }
                        ],
                        location: [
                            { name: 'New York', value: 35 },
                            { name: 'California', value: 25 },
                            { name: 'Texas', value: 15 },
                            { name: 'Other', value: 25 }
                        ]
                    },
                    landingPage: {
                        bounceRate: (40 + Math.random() * 20).toFixed(1) + '%',
                        avgTime: '1m ' + (10 + Math.floor(Math.random() * 50)) + 's',
                        loadTime: (0.8 + Math.random() * 1.5).toFixed(1) + 's'
                    },
                    competitive: {
                        myImpShare: (40 + Math.random() * 30),
                        competitors: [
                            { name: 'Comp A', value: 25, color: '#9ca3af' },
                            { name: 'Comp B', value: 15, color: '#d1d5db' },
                            { name: 'Others', value: 20, color: '#e5e7eb' }
                        ],
                        lostToRank: Math.floor(Math.random() * 20) + '%',
                        lostToBudget: Math.floor(Math.random() * 15) + '%'
                    }
                }
            };
        }),
        insights: [
            // 1. ROAS Signal (Critical financial health)
            {
                id: 'ins-roas',
                title: 'ROAS Drop Alert',
                severity: 'high',
                scope: { type: 'Global', name: 'All Projects' },
                metric: 'ROAS',
                trend: '-15%',
                desc: 'Return on Ad Spend has dropped below the 3.0x threshold.'
            },
            // 2. CPC Signal (Market cost efficiency)
            {
                id: 'ins-cpc',
                title: 'CPC Spike Detected',
                severity: 'medium',
                scope: { type: 'Platform', name: 'Google Ads' },
                metric: 'CPC',
                trend: '+22%',
                desc: 'Average Cost Per Click surged to $4.85 today.'
            },
            // 3. Frequency Signal (Fatigue warning)
            {
                id: 'ins-freq',
                title: 'Ad Fatigue Warning',
                severity: 'medium',
                scope: { type: 'Project', name: 'Global' },
                metric: 'Frequency',
                trend: '> 4.0',
                desc: 'Global frequency has exceeded 4.0. Audience saturation likely.'
            },
            // 4. LP Conversion Signal (Funnel health)
            {
                id: 'ins-lp',
                title: 'Landing Page Drop',
                severity: 'high',
                scope: { type: 'Funnel', name: 'LP Conversion' },
                metric: 'CvR',
                trend: '-20%',
                desc: 'Landing page conversion rate fell significantly vs. 7d average.'
            },
            // 5. Spend Signal (Budget pacing)
            {
                id: 'ins-spend',
                title: 'Budget Underspend',
                severity: 'low',
                scope: { type: 'Project', name: 'Global' },
                metric: 'Spend',
                trend: '-12%',
                desc: 'You are currently utilizing only 65% of your daily budget cap.'
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
