-- Drop existing tables if they exist
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS feed_items_tags;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS engagements;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS feed_items;

-- Create feed_items table with corrected schema
CREATE TABLE feed_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    author_id UUID NOT NULL REFERENCES profiles(id),
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    media_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
    category TEXT,
    
    -- Common metadata
    status TEXT NOT NULL DEFAULT 'active',
    visibility TEXT NOT NULL DEFAULT 'public',
    featured BOOLEAN DEFAULT false,
    pinned BOOLEAN DEFAULT false,
    
    -- Event specific fields
    event_type TEXT,
    event_start_time TIMESTAMPTZ,
    event_end_time TIMESTAMPTZ,
    event_timezone TEXT,
    event_location TEXT,
    event_address TEXT,
    event_virtual_link TEXT,
    event_max_attendees INTEGER,
    event_current_attendees INTEGER DEFAULT 0,
    event_cost INTEGER,
    event_registration_deadline TIMESTAMPTZ,
    
    -- Education specific fields
    education_level TEXT,
    education_duration INTEGER,
    education_language TEXT[],
    education_prerequisites TEXT,
    education_materials TEXT[],
    education_instructor_ids UUID[],
    
    -- Fundraising specific fields
    fundraising_goal INTEGER,
    fundraising_current INTEGER DEFAULT 0,
    fundraising_deadline TIMESTAMPTZ,
    fundraising_beneficiary TEXT,
    
    -- Governance specific fields
    governance_proposal_type TEXT,
    governance_voting_deadline TIMESTAMPTZ,
    governance_quorum INTEGER,
    governance_options JSONB,
    governance_results JSONB,
    
    -- Poll specific fields
    poll_options JSONB,
    poll_deadline TIMESTAMPTZ,
    poll_multiple_choice BOOLEAN DEFAULT false,
    poll_results JSONB,
    
    -- Marketplace specific fields
    marketplace_price INTEGER,
    marketplace_condition TEXT,
    marketplace_shipping_available BOOLEAN DEFAULT false,
    marketplace_location TEXT,
    marketplace_quantity INTEGER,
    marketplace_sold BOOLEAN DEFAULT false,
    
    -- Livestream specific fields
    livestream_platform TEXT,
    livestream_url TEXT,
    livestream_start_time TIMESTAMPTZ,
    livestream_duration INTEGER,
    livestream_recording_url TEXT,
    
    -- Collaboration specific fields
    collaboration_type TEXT,
    collaboration_deadline TIMESTAMPTZ,
    collaboration_max_participants INTEGER,
    collaboration_current_participants INTEGER DEFAULT 0,
    collaboration_status TEXT,
    
    metadata JSONB DEFAULT '{}'::JSONB
);

-- Create comments table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    feed_item_id UUID NOT NULL REFERENCES feed_items(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id),
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    media_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
    edited BOOLEAN DEFAULT false,
    status TEXT NOT NULL DEFAULT 'active',
    pinned BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::JSONB
);

-- Create engagements table
CREATE TABLE engagements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    feed_item_id UUID NOT NULL REFERENCES feed_items(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::JSONB,
    UNIQUE(user_id, feed_item_id, type)
);

-- Create indexes
CREATE INDEX idx_feed_items_type ON feed_items(type);
CREATE INDEX idx_feed_items_category ON feed_items(category);
CREATE INDEX idx_feed_items_status ON feed_items(status);
CREATE INDEX idx_feed_items_created ON feed_items(created_at DESC);
CREATE INDEX idx_feed_items_author ON feed_items(author_id);
CREATE INDEX idx_comments_feed_item ON comments(feed_item_id);
CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);
CREATE INDEX idx_engagements_feed_item ON engagements(feed_item_id);
CREATE INDEX idx_engagements_user ON engagements(user_id);
CREATE INDEX idx_engagements_type ON engagements(type);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_feed_items_updated_at
    BEFORE UPDATE ON feed_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE feed_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public feed items are viewable by everyone"
    ON feed_items FOR SELECT
    USING (status = 'active');

CREATE POLICY "Users can create feed items"
    ON feed_items FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own feed items"
    ON feed_items FOR UPDATE
    USING (author_id = auth.uid());

CREATE POLICY "Users can delete their own feed items"
    ON feed_items FOR DELETE
    USING (author_id = auth.uid());