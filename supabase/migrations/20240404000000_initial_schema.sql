-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    full_name TEXT,
    avatar_url TEXT,
    location TEXT,
    bio TEXT,
    languages TEXT[],
    citizenship_level INTEGER NOT NULL DEFAULT 1,
    mitzvah_points INTEGER NOT NULL DEFAULT 0,
    email TEXT NOT NULL UNIQUE,
    CONSTRAINT citizenship_level_range CHECK (citizenship_level BETWEEN 1 AND 5)
);

-- Create feed_items table
CREATE TABLE feed_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    author_id UUID NOT NULL REFERENCES profiles(id),
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::JSONB,
    image_url TEXT
);

-- Create engagements table
CREATE TABLE engagements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    feed_item_id UUID NOT NULL REFERENCES feed_items(id),
    type TEXT NOT NULL,
    UNIQUE(user_id, feed_item_id, type)
);

-- Create comments table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    feed_item_id UUID NOT NULL REFERENCES feed_items(id),
    content TEXT NOT NULL,
    parent_id UUID REFERENCES comments(id)
);

-- Create transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    type TEXT NOT NULL,
    amount INTEGER NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::JSONB
);

-- Create indexes
CREATE INDEX idx_feed_items_author ON feed_items(author_id);
CREATE INDEX idx_feed_items_type ON feed_items(type);
CREATE INDEX idx_engagements_feed_item ON engagements(feed_item_id);
CREATE INDEX idx_engagements_user ON engagements(user_id);
CREATE INDEX idx_comments_feed_item ON comments(feed_item_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_transactions_user ON transactions(user_id);

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagements ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Feed items are viewable by everyone"
    ON feed_items FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create feed items"
    ON feed_items FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own feed items"
    ON feed_items FOR UPDATE
    USING (auth.uid() = author_id);

CREATE POLICY "Engagements are viewable by everyone"
    ON engagements FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create engagements"
    ON engagements FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Comments are viewable by everyone"
    ON comments FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create comments"
    ON comments FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own comments"
    ON comments FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Transactions are viewable by own user"
    ON transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System can create transactions"
    ON transactions FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feed_items_updated_at
    BEFORE UPDATE ON feed_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();