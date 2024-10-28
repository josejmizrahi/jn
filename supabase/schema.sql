-- Drop existing tables and functions in the correct order
drop trigger if exists update_profiles_updated_at on profiles;
drop trigger if exists update_feed_items_updated_at on feed_items;
drop trigger if exists update_comments_updated_at on comments;
drop trigger if exists on_auth_user_created on auth.users;

-- Drop tables in correct order (dependent tables first)
drop table if exists comments;
drop table if exists engagements;
drop table if exists feed_items;
drop table if exists transactions;
drop table if exists profiles;

-- Drop functions after their dependent objects
drop function if exists update_updated_at_column();
drop function if exists handle_new_user_signup();

-- Create a table for user profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  full_name text,
  avatar_url text,
  location text,
  bio text,
  languages text[],
  citizenship_level integer default 1 not null,
  mitzvah_points integer default 0 not null,
  email text not null unique,
  
  constraint citizenship_level_range check (citizenship_level between 1 and 5)
);

-- Create feed_items table
create table feed_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  author_id uuid references profiles(id) not null,
  type text not null,
  title text not null,
  content text not null,
  metadata jsonb default '{}'::jsonb,
  image_url text
);

-- Create engagements table
create table engagements (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now() not null,
  user_id uuid references profiles(id) not null,
  feed_item_id uuid references feed_items(id) not null,
  type text not null,
  unique(user_id, feed_item_id, type)
);

-- Create comments table
create table comments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  user_id uuid references profiles(id) not null,
  feed_item_id uuid references feed_items(id) not null,
  content text not null,
  parent_id uuid references comments(id)
);

-- Create transactions table
create table transactions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now() not null,
  user_id uuid references profiles(id) not null,
  type text not null,
  amount integer not null,
  description text not null,
  metadata jsonb default '{}'::jsonb
);

-- Create indexes
create index profiles_citizenship_level_idx on profiles (citizenship_level);
create index profiles_email_idx on profiles (email);
create index feed_items_author_idx on feed_items(author_id);
create index feed_items_type_idx on feed_items(type);
create index engagements_feed_item_idx on engagements(feed_item_id);
create index engagements_user_idx on engagements(user_id);
create index comments_feed_item_idx on comments(feed_item_id);
create index comments_user_idx on comments(user_id);
create index transactions_user_idx on transactions(user_id);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;
alter table feed_items enable row level security;
alter table engagements enable row level security;
alter table comments enable row level security;
alter table transactions enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can insert their own profile"
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = id);

create policy "Feed items are viewable by everyone"
  on feed_items for select using (true);

create policy "Authenticated users can create feed items"
  on feed_items for insert with check (auth.role() = 'authenticated');

create policy "Users can update own feed items"
  on feed_items for update using (auth.uid() = author_id);

create policy "Engagements are viewable by everyone"
  on engagements for select using (true);

create policy "Authenticated users can create engagements"
  on engagements for insert with check (auth.role() = 'authenticated');

create policy "Comments are viewable by everyone"
  on comments for select using (true);

create policy "Authenticated users can create comments"
  on comments for insert with check (auth.role() = 'authenticated');

create policy "Users can update own comments"
  on comments for update using (auth.uid() = user_id);

create policy "Transactions are viewable by own user"
  on transactions for select using (auth.uid() = user_id);

-- Function to handle new user signup
create or replace function public.handle_new_user_signup()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

-- Function to automatically update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user_signup();

create trigger update_profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at_column();

create trigger update_feed_items_updated_at
  before update on feed_items
  for each row execute function update_updated_at_column();

create trigger update_comments_updated_at
  before update on comments
  for each row execute function update_updated_at_column();