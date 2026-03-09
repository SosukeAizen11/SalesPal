-- 008_init_projects.sql
-- Projects table

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active',
    industry VARCHAR(100),
    metadata JSONB DEFAULT '{}',
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_org_id ON projects(org_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

-- Add foreign key from campaigns to projects
ALTER TABLE campaigns
    ADD CONSTRAINT fk_campaigns_project_id
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;

-- Add foreign key from campaign_drafts to projects
ALTER TABLE campaign_drafts
    ADD CONSTRAINT fk_campaign_drafts_project_id
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;
