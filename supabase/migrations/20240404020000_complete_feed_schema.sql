-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS feed_items_tags;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS engagements;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS feed_items;

-- Feed Items Table
CREATE TABLE feed_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    author_id UUID NOT NULL REFERENCES profiles(id),
    type TEXT NOT NULL CHECK (type IN ('post', 'event', 'product', 'class', 'fundraising', 'proposal')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    media_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
    metadata JSONB DEFAULT '{}'::JSONB,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
    visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'members', 'private'))
);

-- Comments Table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    feed_item_id UUID NOT NULL REFERENCES feed_items(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id),
    content TEXT NOT NULL,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'deleted'))
);

-- Engagements Table (likes, bookmarks, etc.)
CREATE TABLE engagements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    feed_item_id UUID NOT NULL REFERENCES feed_items(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('like', 'bookmark', 'share')),
    UNIQUE(user_id, feed_item_id, type)
);

-- Tags Table
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Feed Items Tags Junction Table
CREATE TABLE feed_items_tags (
    feed_item_id UUID NOT NULL REFERENCES feed_items(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (feed_item_id, tag_id)
);

-- Reports Table (for content moderation)
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reporter_id UUID NOT NULL REFERENCES profiles(id),
    feed_item_id UUID REFERENCES feed_items(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
    resolution_notes TEXT,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES profiles(id),
    CHECK (
        (feed_item_id IS NOT NULL AND comment_id IS NULL) OR
        (feed_item_id IS NULL AND comment_id IS NOT NULL)
    )
);

-- Create indexes for better query performance
CREATE INDEX idx_feed_items_author ON feed_items(author_id);
CREATE INDEX idx_feed_items_type ON feed_items(type);
CREATE INDEX idx_feed_items_created ON feed_items(created_at DESC);
CREATE INDEX idx_feed_items_status ON feed_items(status);
CREATE INDEX idx_feed_items_visibility ON feed_items(visibility);

CREATE INDEX idx_comments_feed_item ON comments(feed_item_id);
CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);
CREATE INDEX idx_comments_status ON comments(status);

CREATE INDEX idx_engagements_feed_item ON engagements(feed_item_id);
CREATE INDEX idx_engagements_user ON engagements(user_id);
CREATE INDEX idx_engagements_type ON engagements(type);

CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_feed_items_tags_feed_item ON feed_items_tags(feed_item_id);
CREATE INDEX idx_feed_items_tags_tag ON feed_items_tags(tag_id);

CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_reporter ON reports(reporter_id);
CREATE INDEX idx_reports_feed_item ON reports(feed_item_id);
CREATE INDEX idx_reports_comment ON reports(comment_id);

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

-- Create policies for feed_items
CREATE POLICY "Public feed items are viewable by everyone"
    ON feed_items FOR SELECT
    USING (visibility = 'public' AND status = 'active');

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

-- Create policies for comments
CREATE POLICY "Comments are viewable by everyone"
    ON comments FOR SELECT
    USING (status = 'active');

CREATE POLICY "Authenticated users can create comments"
    ON comments FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own comments"
    ON comments FOR UPDATE
    USING (author_id = auth.uid());

CREATE POLICY "Users can delete their own comments"
    ON comments FOR DELETE
    USING (author_id = auth.uid());

-- Create policies for engagements
CREATE POLICY "Engagements are viewable by everyone"
    ON engagements FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create engagements"
    ON engagements FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own engagements"
    ON engagements FOR DELETE
    USING (user_id = auth.uid());

-- Create policies for tags
CREATE POLICY "Tags are viewable by everyone"
    ON tags FOR SELECT
    USING (true);

CREATE POLICY "Only moderators can manage tags"
    ON tags FOR ALL
    USING (auth.jwt()->>'role' = 'moderator');

-- Create policies for feed_items_tags
CREATE POLICY "Feed item tags are viewable by everyone"
    ON feed_items_tags FOR SELECT
    USING (true);

CREATE POLICY "Users can add tags to their own feed items"
    ON feed_items_tags FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM feed_items
            WHERE id = feed_item_id
            AND author_id = auth.uid()
        )
    );

-- Create policies for reports
CREATE POLICY "Only moderators can view reports"
    ON reports FOR SELECT
    USING (auth.jwt()->>'role' = 'moderator');

CREATE POLICY "Authenticated users can create reports"
    ON reports FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only moderators can update reports"
    ON reports FOR UPDATE
    USING (auth.jwt()->>'role' = 'moderator');

-- Create helper functions
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
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user's engagement with a feed item
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
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;