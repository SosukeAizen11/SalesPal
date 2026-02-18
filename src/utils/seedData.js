export const seedProjects = [
    {
        id: "proj_acme_re",
        name: "Acme Real Estate",
        status: "active",
        createdAt: new Date().toISOString()
    },
    {
        id: "proj_zenith_ecom",
        name: "Zenith E-commerce",
        status: "active",
        createdAt: new Date().toISOString()
    }
];

export const seedCampaigns = [
    // --- ACME REAL ESTATE ---
    // 1. Strong Performer (Meta)
    {
        id: "cmp_acme_001",
        projectId: "proj_acme_re",
        name: "Acme - Luxury Apts - Lead Gen",
        platform: "Meta Ads",
        status: "active",
        dailyBudget: 5000,   // raw INR — use formatCurrency() to display
        spend: 2500,
        impressions: 25000,
        clicks: 300,
        conversions: 40,
        revenue: 12000, // ROAS: 4.8
        reach: 18000,
        createdAt: new Date().toISOString()
    },
    // 2. Average Performer (Google)
    {
        id: "cmp_acme_002",
        projectId: "proj_acme_re",
        name: "Acme - Brand Search",
        platform: "Google Ads",
        status: "active",
        dailyBudget: 2500,
        spend: 1200,
        impressions: 10000,
        clicks: 800,
        conversions: 25,
        revenue: 3600, // ROAS: 3.0
        reach: 8000,
        createdAt: new Date().toISOString()
    },
    // 3. Bleeder (Google - Burn Alert Trigger)
    {
        id: "cmp_acme_003",
        projectId: "proj_acme_re",
        name: "Acme - Display Retargeting",
        platform: "Google Ads",
        status: "active",
        dailyBudget: 1500,
        spend: 650,
        impressions: 45000,
        clicks: 450,
        conversions: 0,
        revenue: 0, // ROAS: 0
        reach: 30000,
        createdAt: new Date().toISOString()
    },
    // 4. Learning (Meta)
    {
        id: "cmp_acme_004",
        projectId: "proj_acme_re",
        name: "Acme - New Creative Test",
        platform: "Meta Ads",
        status: "learning",
        dailyBudget: 1000,
        spend: 150,
        impressions: 1200,
        clicks: 40,
        conversions: 2,
        revenue: 200, // ROAS: 1.33
        reach: 900,
        createdAt: new Date().toISOString()
    },

    // --- ZENITH E-COMMERCE ---
    // 1. Opportunity (Google - High ROAS, Lower Spend)
    {
        id: "cmp_zenith_001",
        projectId: "proj_zenith_ecom",
        name: "Zenith - Shop - Top Products",
        platform: "Google Ads",
        status: "active",
        dailyBudget: 3000,
        spend: 1800,
        impressions: 35000,
        clicks: 1200,
        conversions: 150,
        revenue: 10800, // ROAS: 6.0
        reach: 28000,
        createdAt: new Date().toISOString()
    },
    // 2. Good Volume (Meta - Lower ROAS, Higher Spend)
    {
        id: "cmp_zenith_002",
        projectId: "proj_zenith_ecom",
        name: "Zenith - Catalog Sales",
        platform: "Meta Ads",
        status: "active",
        dailyBudget: 6000,
        spend: 3500,
        impressions: 80000,
        clicks: 2500,
        conversions: 210,
        revenue: 10500, // ROAS: 3.0
        reach: 65000,
        createdAt: new Date().toISOString()
    },
    // 3. Average (Meta)
    {
        id: "cmp_zenith_003",
        projectId: "proj_zenith_ecom",
        name: "Zenith - Story Ads",
        platform: "Meta Ads",
        status: "active",
        dailyBudget: 2000,
        spend: 800,
        impressions: 15000,
        clicks: 600,
        conversions: 30,
        revenue: 1600, // ROAS: 2.0
        reach: 12000,
        createdAt: new Date().toISOString()
    }
];
