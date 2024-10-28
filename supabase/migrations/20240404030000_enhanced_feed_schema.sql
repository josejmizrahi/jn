-- Drop existing tables if they exist
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS feed_items_tags;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS engagements;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS feed_items;

-- Create an enum for post types
CREATE TYPE post_type AS ENUM (
    'text',           -- Standard text posts
    'multimedia',     -- Image/video posts
    'event',         -- Event announcements
    'education',     -- Classes and Torah study
    'fundraising',   -- Fundraising campaigns
    'governance',    -- Voting proposals
    'poll',          -- Polls and surveys
    'marketplace',   -- Products and services
    'livestream',    -- Live streams
    'collaboration'  -- Group projects
);

-- Create an enum for event types
CREATE TYPE event_type AS ENUM (
    'in_person',
    'online',
    'hybrid'
);

-- Create an enum for education levels
CREATE TYPE education_level AS ENUM (
    'beginner',
    'intermediate',
    'advanced',
    'all_levels'
);

-- Create an enum for marketplace categories
CREATE TYPE marketplace_category AS ENUM (
    'judaica',
    'books',
    'art',
    'services',
    'food',
    'clothing',
    'other'
);

-- Feed Items Table with enhanced metadata
CREATE TABLE feed_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    author_id UUID NOT NULL REFERENCES profiles(id),
    type post_type NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    media_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    -- Common metadata
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
    visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'members', 'private')),
    featured BOOLEAN DEFAULT false,
    pinned BOOLEAN DEFAULT false,
    
    -- Event specific fields
    event_type event_type,
    event_start_time TIMESTAMPTZ,
    event_end_time TIMESTAMPTZ,
    event_timezone TEXT,
    event_location TEXT,
    event_address TEXT,
    event_virtual_link TEXT,
    event_max_attendees INTEGER,
    event_current_attendees INTEGER DEFAULT 0,
    event_cost INTEGER, -- in MitzvahPoints
    event_registration_deadline TIMESTAMPTZ,
    
    -- Education specific fields
    education_level education_level,
    education_duration INTEGER, -- in minutes
    education_language TEXT[] DEFAULT ARRAY[]::TEXT[],
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
    marketplace_category marketplace_category,
    marketplace_price INTEGER, -- in MitzvahPoints
    marketplace_condition TEXT CHECK (marketplace_condition IN ('new', 'like_new', 'good', 'fair')),
    marketplace_shipping_available BOOLEAN DEFAULT false,
    marketplace_location TEXT,
    marketplace_quantity INTEGER,
    marketplace_sold BOOLEAN DEFAULT false,
    
    -- Livestream specific fields
    livestream_platform TEXT,
    livestream_url TEXT,
    livestream_start_time TIMESTAMPTZ,
    livestream_duration INTEGER, -- in minutes
    livestream_recording_url TEXT,
    
    -- Collaboration specific fields
    collaboration_type TEXT,
    collaboration_deadline TIMESTAMPTZ,
    collaboration_max_participants INTEGER,
    collaboration_current_participants INTEGER DEFAULT 0,
    collaboration_status TEXT CHECK (collaboration_status IN ('open', 'in_progress', 'completed')),
    
    -- Additional metadata
    metadata JSONB DEFAULT '{}'::JSONB,
    
    -- Constraints
    CONSTRAINT valid_event_fields CHECK (
        (type != 'event') OR 
        (event_type IS NOT NULL AND event_start_time IS NOT NULL)
    ),
    CONSTRAINT valid_education_fields CHECK (
        (type != 'education') OR 
        (education_level IS NOT NULL AND education_duration IS NOT NULL)
    ),
    CONSTRAINT valid_fundraising_fields CHECK (
        (type != 'fundraising') OR 
        (fundraising_goal IS NOT NULL AND fundraising_deadline IS NOT NULL)
    ),
    CONSTRAINT valid_marketplace_fields CHECK (
        (type != 'marketplace') OR 
        (marketplace_category IS NOT NULL AND marketplace_price IS NOT NULL)
    )
);

-- Comments Table with enhanced features
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
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'deleted', 'hidden')),
    pinned BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::JSONB
);

-- Engagements Table with enhanced tracking
CREATE TABLE engagements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    feed_item_id UUID NOT NULL REFERENCES feed_items(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (
        type IN (
            'like',
            'bookmark',
            'share',
            'attend',
            'vote',
            'donate',
            'participate',
            'purchase'
        )
    ),
    metadata JSONB DEFAULT '{}'::JSONB,
    UNIQUE(user_id, feed_item_id, type)
);

-- Tags Table with hierarchical support
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES tags(id),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    color TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::JSONB
);

-- Feed Items Tags Junction Table
CREATE TABLE feed_items_tags (
    feed_item_id UUID NOT NULL REFERENCES feed_items(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (feed_item_id, tag_id)
);

-- Reports Table with enhanced moderation support
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reporter_id UUID NOT NULL REFERENCES profiles(id),
    feed_item_id UUID REFERENCES feed_items(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    details TEXT,
    category TEXT NOT NULL CHECK (
        category IN (
            'inappropriate',
            'spam',
            'harassment',
            'misinformation',
            'copyright',
            'other'
        )
    ),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (
        status IN (
            'pending',
            'investigating',
            'resolved',
            'dismissed'
        )
    ),
    resolution_notes TEXT,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES profiles(id),
    metadata JSONB DEFAULT '{}'::JSONB,
    
    -- Ensure either feed_item_id or comment_id is provided, but not both
    CONSTRAINT valid_report_target CHECK (
        (feed_item_id IS NOT NULL AND comment_id IS NULL) OR
        (feed_item_id IS NULL AND comment_id IS NOT NULL)
    )
);

-- Create indexes for better query performance
CREATE INDEX idx_feed_items_type ON feed_items(type);
CREATE INDEX idx_feed_items_status ON feed_items(status);
CREATE INDEX idx_feed_items_created ON feed_items(created_at DESC);
CREATE INDEX idx_feed_items_author ON feed_items(author_id);
CREATE INDEX idx_feed_items_event_time ON feed_items(event_start_time)
    WHERE type = 'event';
CREATE INDEX idx_feed_items_marketplace ON feed_items(marketplace_category, marketplace_sold)
    WHERE type = 'marketplace';
CREATE INDEX idx_feed_items_fundraising ON feed_items(fundraising_deadline)
    WHERE type = 'fundraising';

CREATE INDEX idx_comments_feed_item ON comments(feed_item_id);
CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);
CREATE INDEX idx_comments_status ON comments(status);

CREATE INDEX idx_engagements_feed_item ON engagements(feed_item_id);
CREATE INDEX idx_engagements_user ON engagements(user_id);
CREATE INDEX idx_engagements_type ON engagements(type);

CREATE INDEX idx_tags_parent ON tags(parent_id);
CREATE INDEX idx_tags_slug ON tags(slug);

CREATE INDEX idx_feed_items_tags_feed_item ON feed_items_tags(feed_item_id);
CREATE INDEX idx_feed_items_tags_tag ON feed_items_tags(tag_id);

CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_category ON reports(category);

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
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_items_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public feed items are viewable by everyone"
    ON feed_items FOR SELECT
    USING (
        visibility = 'public' 
        AND status = 'active'
    );

CREATE POLICY "Members can view members-only feed items"
    ON feed_items FOR SELECT
    USING (
        visibility IN ('public', 'members') 
        AND status = 'active' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Users can create feed items"
    ON feed_items FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own feed items"
    ON feed_items FOR UPDATE
    USING (author_id = auth.uid());

CREATE POLICY "Users can delete their own feed items"
    ON feed_items FOR DELETE
    USING (author_id = auth.uid());

-- Helper functions
CREATE OR REPLACE FUNCTION get_feed_item_engagement(item_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'likes', (
            SELECT COUNT(*) 
            FROM engagements 
            WHERE feed_item_id = item_id AND type = 'like'
        ),
        'bookmarks', (
            SELECT COUNT(*) 
            FROM engagements 
            WHERE feed_item_id = item_id AND type = 'bookmark'
        ),
        'shares', (
            SELECT COUNT(*) 
            FROM engagements 
            WHERE feed_item_id = item_id AND type = 'share'
        ),
        'comments', (
            SELECT COUNT(*) 
            FROM comments 
            WHERE feed_item_id = item_id AND status = 'active'
        ),
        'attendees', (
            SELECT COUNT(*) 
            FROM engagements 
            WHERE feed_item_id = item_id AND type = 'attend'
        ),
        'votes', (
            SELECT COUNT(*) 
            FROM engagements 
            WHERE feed_item_id = item_id AND type = 'vote'
        ),
        'donations', (
            SELECT COUNT(*) 
            FROM engagements 
            WHERE feed_item_id = item_id AND type = 'donate'
        ),
        'participants', (
            SELECT COUNT(*) 
            FROM engagements 
            WHERE feed_item_id = item_id AND type = 'participate'
        ),
        'purchases', (
            SELECT COUNT(*) 
            FROM engagements 
            WHERE feed_item_id = item_id AND type = 'purchase'
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's engagement with a feed item
CREATE OR REPLACE FUNCTION get_user_feed_item_engagement(item_id UUID, user_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'liked', EXISTS (
            SELECT 1 
            FROM engagements 
            WHERE feed_item_id = item_id 
            AND user_id = user_id 
            AND type = 'like'
        ),
        'bookmarked', EXISTS (
            SELECT 1 
            FROM engagements 
            WHERE feed_item_id = item_id 
            AND user_id = user_id 
            AND type = 'bookmark'
        ),
        'shared', EXISTS (
            SELECT 1 
            FROM engagements 
            WHERE feed_item_id = item_id 
            AND user_id = user_id 
            AND type = 'share'
        ),
        'attending', EXISTS (
            SELECT 1 
            FROM engagements 
            WHERE feed_item_id = item_id 
            AND user_id = user_id 
            AND type = 'attend'
        ),
        'voted', EXISTS (
            SELECT 1 
            FROM engagements 
            WHERE feed_item_id = item_id 
            AND user_id = user_id 
            AND type = 'vote'
        ),
        'donated', EXISTS (
            SELECT 1 
            FROM engagements 
            WHERE feed_item_id = item_id 
            AND user_id = user_id 
            AND type = 'donate'
        ),
        'participating', EXISTS (
            SELECT 1 
            FROM engagements 
            WHERE feed_item_id = item_id 
            AND user_id = user_id 
            AND type = 'participate'
        ),
        'purchased', EXISTS (
            SELECT 1 
            FROM engagements 
            WHERE feed_item_id = item_id 
            AND user_id = user_id 
            AND type = 'purchase'
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;