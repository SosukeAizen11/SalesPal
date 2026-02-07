export const getMockAnalyticsData = (timeRange, projectId, channel) => {
    // Multipliers for varying data based on filters
    const timeMultiplier = timeRange === 'today' ? 1 : timeRange === '7d' ? 7 : 30;
    const projectMultiplier = projectId === 'all' ? 3 : 1; // "All" aggregates ~3 projects
    const channelMultiplier = channel === 'all' ? 1 : 0.4; // Single channel is subset

    const baseModifier = timeMultiplier * projectMultiplier * channelMultiplier;

    return {
        // Aggregates for Dashboard (Raw Totals Only)
        overview: {
            spend: Math.floor(12450 * baseModifier),
            revenue: Math.floor(45000 * baseModifier),
            impressions: Math.floor(150000 * baseModifier),
            clicks: Math.floor(4500 * baseModifier),
            conversions: Math.floor(450 * baseModifier),
            leads: Math.floor(450 * baseModifier),
        },
        // Graph/Trend Data (Raw Arrays)
        trends: {
            dates: Array.from({ length: timeRange === 'today' ? 24 : 7 }, (_, i) =>
                timeRange === 'today' ? `${i}:00` : `Day ${i + 1}`
            ),
            spend: Array.from({ length: 7 }, () => Math.floor(Math.random() * 500 * baseModifier)),
            revenue: Array.from({ length: 7 }, () => Math.floor(Math.random() * 2000 * baseModifier)),
            leads: Array.from({ length: 7 }, () => Math.floor(Math.random() * 50 * baseModifier)),
            impressions: Array.from({ length: 7 }, () => Math.floor(Math.random() * 10000 * baseModifier)),
            clicks: Array.from({ length: 7 }, () => Math.floor(Math.random() * 500 * baseModifier)),
        },
        // Canonical Campaign List
        campaigns: Array.from({ length: 5 }, (_, i) => {
            const platform = ['Meta', 'Google', 'Meta', 'LinkedIn', 'Google'][i];
            const baseSpend = Math.floor(Math.random() * 2000 * baseModifier);
            const conversions = Math.floor(Math.random() * 50 * baseModifier);
            const clicks = Math.floor(baseSpend / (2 + Math.random() * 5));
            const impressions = Math.floor(clicks * (20 + Math.random() * 30));
            const revenue = Math.floor(baseSpend * (1.5 + Math.random() * 3));

            return {
                id: `cmp-${i}`,
                name: `${['Summer', 'Intercom', 'Retargeting', 'Brand', 'Competitor'][i]} Promo ${2024 + i}`,
                projectId: `Project ${['Alpha', 'Beta', 'Gamma'][i % 3]}`,
                platform: platform,
                status: i === 1 ? 'Paused' : 'Running',

                // RAW METRICS
                spend: baseSpend,
                impressions: impressions,
                clicks: clicks,
                conversions: conversions,
                leads: conversions, // keeping synonym for now if UI expects 'leads' specifically
                revenue: revenue,
                reach: Math.floor(impressions * 0.8),

                // DETAILED RAW BREAKDOWNS
                details: {
                    // Device: Raw counts only. UI calculates %
                    device: [
                        { name: 'Mobile', impressions: Math.floor(impressions * 0.65), clicks: Math.floor(clicks * 0.7), spend: Math.floor(baseSpend * 0.6) },
                        { name: 'Desktop', impressions: Math.floor(impressions * 0.35), clicks: Math.floor(clicks * 0.3), spend: Math.floor(baseSpend * 0.4) }
                    ],
                    // Day Performance: Raw counts
                    dayPerf: ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => ({
                        day: d,
                        impressions: Math.floor(impressions / 7),
                        clicks: Math.floor(clicks / 7),
                        conversions: Math.floor(conversions / 7)
                    })),
                    // Creatives: Raw counts
                    creatives: [
                        { name: 'Video Variant A', impressions: Math.floor(impressions * 0.4), clicks: Math.floor(clicks * 0.45), spend: Math.floor(baseSpend * 0.4), conversions: Math.floor(conversions * 0.5) },
                        { name: 'Static Image #2', impressions: Math.floor(impressions * 0.3), clicks: Math.floor(clicks * 0.25), spend: Math.floor(baseSpend * 0.3), conversions: Math.floor(conversions * 0.2) },
                        { name: 'Carousel Story', impressions: Math.floor(impressions * 0.3), clicks: Math.floor(clicks * 0.3), spend: Math.floor(baseSpend * 0.3), conversions: Math.floor(conversions * 0.3) }
                    ],
                    // Platform Specific: Raw values only
                    platformSpecific: platform === 'Google'
                        ? { qualityScore: 7 + Math.floor(Math.random() * 3), impressionShare: 0.75 }
                        : { relevanceScore: 8 }, // standardized generic value

                    // Demographics: Raw counts
                    demographics: {
                        age: [
                            { range: '18-24', impressions: Math.floor(impressions * 0.15) },
                            { range: '25-34', impressions: Math.floor(impressions * 0.45) },
                            { range: '35-44', impressions: Math.floor(impressions * 0.25) },
                            { range: '45+', impressions: Math.floor(impressions * 0.15) }
                        ],
                        gender: [
                            { name: 'Male', impressions: Math.floor(impressions * 0.4) },
                            { name: 'Female', impressions: Math.floor(impressions * 0.55) },
                            { name: 'Unknown', impressions: Math.floor(impressions * 0.05) }
                        ]
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
                    before: { spend: 50, leads: 12, cpl: 4.16 },
                    after: { spend: 80, leads: 21, cpl: 3.80 }
                }
            },
            {
                id: 'rec-2',
                title: 'Pause "Competitor" Ad Set',
                subtext: 'Low conversion rate',
                impact: ['Save $200/wk', '+2% ROI'], // Strings in UI text are OK as they are static labels, but data should be raw. Kept impact as strings for now as they look like bullet points.
                risk: 'low',
                target: 'Ad Set: Comp Keywords',
                previewData: {
                    before: { spend: 250, leads: 2, cpl: 125 },
                    after: { spend: 0, leads: 0, cpl: 0 }
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
