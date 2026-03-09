-- 004_init_marketing.sql
-- Campaigns and campaign drafts for the marketing module

CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    project_id UUID,
    name VARCHAR(255) NOT NULL,
    platform VARCHAR(50) DEFAULT 'meta',
    objective VARCHAR(100),
    status VARCHAR(50) DEFAULT 'draft',
    daily_budget NUMERIC(12, 2),
    total_budget NUMERIC(12, 2),
    start_date DATE,
    end_date DATE,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    spend NUMERIC(12, 2) DEFAULT 0,
    revenue NUMERIC(12, 2) DEFAULT 0,
    reach INTEGER DEFAULT 0,
    ad_platforms TEXT[] DEFAULT '{}',
    ad_format VARCHAR(50),
    headline TEXT,
    primary_text TEXT,
    cta VARCHAR(100),
    media_type VARCHAR(50),
    media_url TEXT,
    budget_platforms TEXT[] DEFAULT '{}',
    budget_split JSONB DEFAULT '{}',
    currency VARCHAR(10) DEFAULT 'INR',
    metadata JSONB DEFAULT '{}',
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaigns_org_id ON campaigns(org_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_project_id ON campaigns(project_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_platform ON campaigns(platform);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_by ON campaigns(created_by);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON campaigns(created_at);

-- Campaign drafts (wizard state machine)
CREATE TABLE IF NOT EXISTS campaign_drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    project_id UUID,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    wizard_step INTEGER DEFAULT 0,
    draft_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaign_drafts_org_id ON campaign_drafts(org_id);
CREATE INDEX IF NOT EXISTS idx_campaign_drafts_user_id ON campaign_drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_campaign_drafts_project_id ON campaign_drafts(project_id);
