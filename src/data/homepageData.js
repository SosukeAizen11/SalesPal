import { BarChart3, Users, Phone, Cpu, Zap, Bot, CheckCircle2, Shield, Layout } from 'lucide-react';

export const problems = [
    {
        icon: BarChart3,
        title: "Wasted Ad Spend",
        desc: "Businesses lose 30% of budget on unoptimized campaigns.",
        color: "text-red-400"
    },
    {
        icon: Users,
        title: "Missed Leads",
        desc: "Sales teams can't follow up with every lead instantly.",
        color: "text-orange-400"
    },
    {
        icon: Phone,
        title: "Overloaded Support",
        desc: "Support agents drown in repetitive queries.",
        color: "text-yellow-400"
    },
    {
        icon: Cpu,
        title: "Manual Processes",
        desc: "Scaling is impossible with manual workflows.",
        color: "text-blue-400"
    }
];

export const modules = [
    {
        id: "marketing",
        title: "AI Business Analysis",
        icon: Zap,
        features: [
            "Analyzes market trends 24/7",
            "Identifies high-value audiences",
            "Predicts campaign performance",
            "Competitor ad strategy tracking"
        ]
    },
    {
        id: "sales",
        title: "Automated Ad Creation",
        icon: BarChart3,
        features: [
            "Generates high-converting ad copy",
            "Creates visuals & video assets",
            "A/B tests thousands of variations",
            "Auto-optimizes for ROI"
        ]
    },
    {
        id: "support",
        title: "Real-time Budget Optimization",
        icon: Bot,
        features: [
            "Allocates budget to best channels",
            "Stops bleeding campaigns",
            "Scales winning ads instantly",
            "Cross-platform attribution"
        ]
    }
];

export const plans = [
    {
        title: "Growth Starter",
        price: 9999,
        features: [
            "AI Business Analysis",
            "Basic Ad Creation",
            "1 Platform Connection",
            "Email support"
        ],
        ctaText: "Start Free Trial",
        isPopular: false
    },
    {
        title: "Business Pro",
        price: 24999,
        features: [
            "Advanced Market Analysis",
            "Unlimited Ad Variations",
            "3 Platform Connections",
            "Budget Optimization AI",
            "Priority support"
        ],
        ctaText: "Start Free Trial",
        isPopular: true,
        isMint: true
    },
    {
        title: "Enterprise Scale",
        price: 39999,
        features: [
            "Full AI Suite",
            "Custom API Access",
            "Unlimited Connections",
            "Dedicated Account Manager",
            "SLA Guarantees"
        ],
        ctaText: "Contact Sales",
        isPopular: false
    }
];

export const steps = [
    {
        number: "01",
        title: "Connect Your Platforms",
        description: "Securely link your ad accounts (Meta, Google, LinkedIn). SalesPal instantly analyzes historical data to find opportunities."
    },
    {
        number: "02",
        title: "Select AI Agents",
        description: "Choose your AI workforce: Business Analyst, Ad Creator, or Budget Optimizer. Activate them instantly."
    },
    {
        number: "03",
        title: "Launch & Optimize",
        description: "AI generates campaigns, you approve. The system then monitors and optimizes 24/7 to maximize ROI."
    },
    {
        number: "04",
        title: "Scale Results",
        description: "As performance improves, AI automatically scales winning strategies and cuts wasted spend."
    }
];

export const trustLogos = [
    { name: "LODHA" },
    { name: "GODREJ" },
    { name: "MAHINDRA" },
    { name: "DLF" }
];

export const comparisonPoints = [
    {
        title: "Optimization Speed",
        traditional: "Manual weekly reviews",
        salespal: "Real-time 24/7 adjustment"
    },
    {
        title: "Ad Creative",
        traditional: "Expensive agency fees",
        salespal: "Unlimited AI-generated variations"
    },
    {
        title: "Data Analysis",
        traditional: "Spreadsheet chaos",
        salespal: "Instant actionable insights"
    },
    {
        title: "Scalability",
        traditional: "Hire more staff",
        salespal: "Click to add more compute"
    },
    {
        title: "Implementation",
        traditional: "Months of onboarding",
        salespal: "Live in minutes"
    }
];
