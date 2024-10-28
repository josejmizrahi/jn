-- Add media_urls array if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'feed_items' 
        AND column_name = 'media_urls'
    ) THEN
        ALTER TABLE feed_items ADD COLUMN media_urls TEXT[] DEFAULT ARRAY[]::TEXT[];
    END IF;
END $$;

-- Add tags table if it doesn't exist
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add feed_items_tags junction table if it doesn't exist
CREATE TABLE IF NOT EXISTS feed_items_tags (
    feed_item_id UUID NOT NULL REFERENCES feed_items(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (feed_item_id, tag_id)
);

-- Add reports table if it doesn't exist
CREATE TABLE IF NOT EXISTS reports (
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

-- Create missing indexes
CREATE INDEX IF NOT EXISTS idx_feed_items_created ON feed_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feed_items_status ON feed_items(status);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_engagements_type ON engagements(type);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
CREATE INDEX IF NOT EXISTS idx_feed_items_tags_feed_item ON feed_items_tags(feed_item_id);
CREATE INDEX IF NOT EXISTS idx_feed_items_tags_tag ON feed_items_tags(tag_id);

-- Enable RLS on new tables
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_items_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create policies for tags
CREATE POLICY IF NOT EXISTS "Tags are viewable by everyone"
    ON tags FOR SELECT
    USING (true);

CREATE POLICY IF NOT EXISTS "Only moderators can manage tags"
    ON tags FOR ALL
    USING (auth.jwt()->>'role' = 'moderator');

-- Create policies for feed_items_tags
CREATE POLICY IF NOT EXISTS "Feed item tags are viewable by everyone"
    ON feed_items_tags FOR SELECT
    USING (true);

CREATE POLICY IF NOT EXISTS "Users can add tags to their own feed items"
    ON feed_items_tags FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM feed_items
            WHERE id = feed_item_id
            AND author_id = auth.uid()
        )
    );

-- Create policies for reports
CREATE POLICY IF NOT EXISTS "Only moderators can view reports"
    ON reports FOR SELECT
    USING (auth.jwt()->>'role' = 'moderator');

CREATE POLICY IF NOT EXISTS "Authenticated users can create reports"
    ON reports FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Only moderators can update reports"
    ON reports FOR UPDATE
    USING (auth.jwt()->>'role' = 'moderator');

-- Create helper function if it doesn't exist
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