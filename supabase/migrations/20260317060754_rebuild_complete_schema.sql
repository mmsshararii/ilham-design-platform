/*
  # Complete Platform Rebuild - Strict Schema

  1. New Tables
    - `users_profile`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text, unique, required)
      - `display_name` (text)
      - `avatar_url` (text)
      - `bio` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `posts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users_profile)
      - `type` (enum: general, design, request, offer, attachment)
      - `status` (enum: open, closed, completed)
      - `title` (text)
      - `description` (text)
      - `images` (text array)
      - `attachments` (jsonb array)
      - `price` (decimal, optional)
      - `likes_count` (integer, default 0)
      - `comments_count` (integer, default 0)
      - `views_count` (integer, default 0)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `ads`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `image_url` (text)
      - `link_url` (text)
      - `is_pinned` (boolean, default false)
      - `impressions_limit` (integer)
      - `impressions_count` (integer, default 0)
      - `clicks_count` (integer, default 0)
      - `start_date` (timestamptz)
      - `end_date` (timestamptz)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz)
    
    - `user_preferences`
      - `user_id` (uuid, primary key, references users_profile)
      - `custom_feed_types` (text array, default all types)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `follows`
      - `follower_id` (uuid, references users_profile)
      - `following_id` (uuid, references users_profile)
      - `created_at` (timestamptz)
      - Primary key (follower_id, following_id)
    
    - `likes`
      - `user_id` (uuid, references users_profile)
      - `post_id` (uuid, references posts)
      - `created_at` (timestamptz)
      - Primary key (user_id, post_id)
    
    - `comments`
      - `id` (uuid, primary key)
      - `post_id` (uuid, references posts)
      - `user_id` (uuid, references users_profile)
      - `content` (text)
      - `created_at` (timestamptz)
    
    - `ad_clicks`
      - `id` (uuid, primary key)
      - `ad_id` (uuid, references ads)
      - `user_id` (uuid, references users_profile, nullable)
      - `clicked_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Ensure data isolation and proper access control
*/

-- Drop existing tables if they exist (complete rebuild)
DROP TABLE IF EXISTS ad_clicks CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS follows CASCADE;
DROP TABLE IF EXISTS user_preferences CASCADE;
DROP TABLE IF EXISTS ads CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS users_profile CASCADE;

-- Drop existing types if they exist
DROP TYPE IF EXISTS post_type CASCADE;
DROP TYPE IF EXISTS post_status CASCADE;

-- Create ENUMS for post types and status
CREATE TYPE post_type AS ENUM ('general', 'design', 'request', 'offer', 'attachment');
CREATE TYPE post_status AS ENUM ('open', 'closed', 'completed');

-- Users Profile Table
CREATE TABLE users_profile (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON users_profile FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users_profile FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users_profile FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Posts Table
CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  type post_type NOT NULL DEFAULT 'general',
  status post_status NOT NULL DEFAULT 'open',
  title text,
  description text NOT NULL,
  images text[] DEFAULT '{}',
  attachments jsonb DEFAULT '[]',
  price decimal(10, 2),
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  views_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view posts"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Ads Table
CREATE TABLE ads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text,
  link_url text,
  is_pinned boolean DEFAULT false,
  impressions_limit integer DEFAULT 0,
  impressions_count integer DEFAULT 0,
  clicks_count integer DEFAULT 0,
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active ads"
  ON ads FOR SELECT
  TO authenticated
  USING (is_active = true AND (end_date IS NULL OR end_date > now()));

-- User Preferences Table
CREATE TABLE user_preferences (
  user_id uuid PRIMARY KEY REFERENCES users_profile(id) ON DELETE CASCADE,
  custom_feed_types text[] DEFAULT ARRAY['general', 'design', 'request', 'offer', 'attachment'],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Follows Table
CREATE TABLE follows (
  follower_id uuid NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id)
);

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all follows"
  ON follows FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own follows"
  ON follows FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete own follows"
  ON follows FOR DELETE
  TO authenticated
  USING (auth.uid() = follower_id);

-- Likes Table
CREATE TABLE likes (
  user_id uuid NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all likes"
  ON likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own likes"
  ON likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes"
  ON likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Comments Table
CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all comments"
  ON comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Ad Clicks Table
CREATE TABLE ad_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id uuid NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users_profile(id) ON DELETE SET NULL,
  clicked_at timestamptz DEFAULT now()
);

ALTER TABLE ad_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create ad clicks"
  ON ad_clicks FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Indexes for performance
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_type ON posts(type);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);
CREATE INDEX idx_likes_post ON likes(post_id);
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_ads_active ON ads(is_active, start_date, end_date) WHERE is_active = true;

-- Function to increment post likes count
CREATE OR REPLACE FUNCTION increment_post_likes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_like_created
  AFTER INSERT ON likes
  FOR EACH ROW
  EXECUTE FUNCTION increment_post_likes();

-- Function to decrement post likes count
CREATE OR REPLACE FUNCTION decrement_post_likes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_like_deleted
  AFTER DELETE ON likes
  FOR EACH ROW
  EXECUTE FUNCTION decrement_post_likes();

-- Function to increment post comments count
CREATE OR REPLACE FUNCTION increment_post_comments()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_comment_created
  AFTER INSERT ON comments
  FOR EACH ROW
  EXECUTE FUNCTION increment_post_comments();

-- Function to decrement post comments count
CREATE OR REPLACE FUNCTION decrement_post_comments()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_comment_deleted
  AFTER DELETE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION decrement_post_comments();

-- Function to increment ad impressions
CREATE OR REPLACE FUNCTION increment_ad_impressions(ad_uuid uuid)
RETURNS void AS $$
BEGIN
  UPDATE ads SET impressions_count = impressions_count + 1 WHERE id = ad_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to increment ad clicks
CREATE OR REPLACE FUNCTION increment_ad_clicks(ad_uuid uuid)
RETURNS void AS $$
BEGIN
  UPDATE ads SET clicks_count = clicks_count + 1 WHERE id = ad_uuid;
END;
$$ LANGUAGE plpgsql;