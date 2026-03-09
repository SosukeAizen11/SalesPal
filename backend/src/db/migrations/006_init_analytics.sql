-- 006_init_analytics.sql
-- Materialized analytics views and daily snapshots

-- Daily campaign metrics snapshot (populated by a cron/Cloud Scheduler)
CREATE TABLE IF NOT EXISTS campaign_daily_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    spend NUMERIC(12, 2) DEFAULT 0,
    revenue NUMERIC(12, 2) DEFAULT 0,
    reach INTEGER DEFAULT 0,
    ctr NUMERIC(8, 4) DEFAULT 0,
    cpc NUMERIC(12, 4) DEFAULT 0,
    cpm NUMERIC(12, 4) DEFAULT 0,
    roas NUMERIC(8, 4) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(campaign_id, metric_date)
);

CREATE INDEX IF NOT EXISTS idx_campaign_daily_metrics_campaign_id ON campaign_daily_metrics(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_daily_metrics_org_id ON campaign_daily_metrics(org_id);
CREATE INDEX IF NOT EXISTS idx_campaign_daily_metrics_metric_date ON campaign_daily_metrics(metric_date);

-- Lead tracking
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    source VARCHAR(100),
    channel VARCHAR(100),
    status VARCHAR(50) DEFAULT 'new',
    score INTEGER DEFAULT 0,
    value NUMERIC(12, 2) DEFAULT 0,
    converted_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_org_id ON leads(org_id);
CREATE INDEX IF NOT EXISTS idx_leads_campaign_id ON leads(campaign_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
