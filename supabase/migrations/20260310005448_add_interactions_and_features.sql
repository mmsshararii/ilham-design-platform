/*
  # Add Post Interactions, Favorites, and Moderation Features

  ## New Tables

  ### `post_likes`
  - `id` (uuid, primary key)
  - `post_id` (uuid, references posts)
  - `user_id` (uuid, references profiles)
  - `created_at` (timestamptz)

  ### `post_favorites`
  - `id` (uuid, primary key)
  - `post_id` (uuid, references posts)
  - `user_id` (uuid, references profiles)
  - `created_at` (timestamptz)

  ### `post_views`
  - `id` (uuid, primary key)
  - `post_id` (uuid, references posts)
  - `user_id` (uuid, references profiles)
  - `created_at` (timestamptz)

  ### `post_reposts`
  - `id` (uuid, primary key)
  - `post_id` (uuid, references posts)
  - `user_id` (uuid, references profiles)
  - `created_at` (timestamptz)

  ### `user_follows`
  - `id` (uuid, primary key)
  - `follower_id` (uuid, references profiles)
  - `following_id` (uuid, references profiles)
  - `created_at` (timestamptz)

  ### `user_blocks`
  - `id` (uuid, primary key)
  - `blocker_id` (uuid, references profiles)
  - `blocked_id` (uuid, references profiles)
  - `created_at` (timestamptz)

  ### `user_mutes`
  - `id` (uuid, references profiles)
  - `muted_id` (uuid, references profiles)
  - `created_at` (timestamptz)

  ### `custom_lists`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `name` (text)
  - `created_at` (timestamptz)

  ### `list_members`
  - `id` (uuid, primary key)
  - `list_id` (uuid, references custom_lists)
  - `user_id` (uuid, references profiles)

  ### `post_reports`
  - `id` (uuid, primary key)
  - `post_id` (uuid, references posts)
  - `reporter_id` (uuid, references profiles)
  - `reason` (text)
  - `status` ('pending', 'reviewed', 'resolved')
  - `created_at` (timestamptz)

  ### `comment_deletion_requests`
  - `id` (uuid, primary key)
  - `comment_id` (uuid, references comments)
  - `user_id` (uuid, references profiles)
  - `reason` (text)
  - `status` ('pending', 'approved', 'rejected')
  - `created_at` (timestamptz)

  ### `user_ranks`
  - `user_id` (uuid, primary key, references profiles)
  - `rank` (text) - 'member', 'distinguished', 'creative', 'professional', 'unique'
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `user_settings`
  - `user_id` (uuid, primary key, references profiles)
  - `post_limit` (int) - default 20 per 12 hours
  - `unlimited_posts` (boolean) - default false
  - `created_at` (timestamptz)

  ## Modified Tables

  ### `comments`
  - Add `edit_count` (int, default 0)
  - Add `deleted_at` (timestamptz)

  ### `posts`
  - Add `post_limit_window` (timestamptz) - for tracking 12-hour posting window

  ## Security
  - Enable RLS on all new tables
  - Add policies for user interactions
*/

-- Post Likes
CREATE TABLE IF NOT EXISTS post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Post Favorites
CREATE TABLE IF NOT EXISTS post_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Post Views
CREATE TABLE IF NOT EXISTS post_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Post Reposts
CREATE TABLE IF NOT EXISTS post_reposts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- User Follows
CREATE TABLE IF NOT EXISTS user_follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- User Blocks
CREATE TABLE IF NOT EXISTS user_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(blocker_id, blocked_id),
  CHECK (blocker_id != blocked_id)
);

-- User Mutes
CREATE TABLE IF NOT EXISTS user_mutes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  muter_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  muted_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(muter_id, muted_id),
  CHECK (muter_id != muted_id)
);

-- Custom Lists
CREATE TABLE IF NOT EXISTS custom_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- List Members
CREATE TABLE IF NOT EXISTS list_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id uuid NOT NULL REFERENCES custom_lists(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  UNIQUE(list_id, user_id)
);

-- Post Reports
CREATE TABLE IF NOT EXISTS post_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  reporter_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at timestamptz DEFAULT now()
);

-- Comment Deletion Requests
CREATE TABLE IF NOT EXISTS comment_deletion_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now()
);

-- User Ranks
CREATE TABLE IF NOT EXISTS user_ranks (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  rank text NOT NULL DEFAULT 'member' CHECK (rank IN ('member', 'distinguished', 'creative', 'professional', 'unique')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Settings
CREATE TABLE IF NOT EXISTS user_settings (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  post_limit int DEFAULT 20,
  unlimited_posts boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Add columns to comments table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'comments' AND column_name = 'edit_count'
  ) THEN
    ALTER TABLE comments ADD COLUMN edit_count int DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'comments' AND column_name = 'deleted_at'
  ) THEN
    ALTER TABLE comments ADD COLUMN deleted_at timestamptz;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'post_limit_window'
  ) THEN
    ALTER TABLE posts ADD COLUMN post_limit_window timestamptz DEFAULT now();
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_post_favorites_user_id ON post_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_post_views_post_id ON post_views(post_id);
CREATE INDEX IF NOT EXISTS idx_post_reposts_post_id ON post_reposts(post_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following ON user_follows(following_id);
CREATE INDEX IF NOT EXISTS idx_post_reports_post_id ON post_reports(post_id);

-- Enable RLS
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_reposts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_mutes ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE list_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_deletion_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ranks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for post_likes
CREATE POLICY "Anyone can view post likes"
  ON post_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own likes"
  ON post_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
  ON post_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for post_favorites
CREATE POLICY "Users can view their own favorites"
  ON post_favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create favorites"
  ON post_favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their favorites"
  ON post_favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for post_views
CREATE POLICY "Users can create views"
  ON post_views FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view post view counts"
  ON post_views FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for post_reposts
CREATE POLICY "Anyone can view reposts"
  ON post_reposts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reposts"
  ON post_reposts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their reposts"
  ON post_reposts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for user_follows
CREATE POLICY "Anyone can view follows"
  ON user_follows FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can follow others"
  ON user_follows FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
  ON user_follows FOR DELETE
  TO authenticated
  USING (auth.uid() = follower_id);

-- RLS Policies for user_blocks
CREATE POLICY "Users can view their blocks"
  ON user_blocks FOR SELECT
  TO authenticated
  USING (auth.uid() = blocker_id);

CREATE POLICY "Users can block others"
  ON user_blocks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = blocker_id);

CREATE POLICY "Users can unblock"
  ON user_blocks FOR DELETE
  TO authenticated
  USING (auth.uid() = blocker_id);

-- RLS Policies for user_mutes
CREATE POLICY "Users can view their mutes"
  ON user_mutes FOR SELECT
  TO authenticated
  USING (auth.uid() = muter_id);

CREATE POLICY "Users can mute others"
  ON user_mutes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = muter_id);

CREATE POLICY "Users can unmute"
  ON user_mutes FOR DELETE
  TO authenticated
  USING (auth.uid() = muter_id);

-- RLS Policies for custom_lists
CREATE POLICY "Users can view their lists"
  ON custom_lists FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create lists"
  ON custom_lists FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their lists"
  ON custom_lists FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their lists"
  ON custom_lists FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for list_members
CREATE POLICY "Users can view their list members"
  ON list_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM custom_lists
      WHERE custom_lists.id = list_members.list_id
      AND custom_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add to their lists"
  ON list_members FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM custom_lists
      WHERE custom_lists.id = list_members.list_id
      AND custom_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove from lists"
  ON list_members FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM custom_lists
      WHERE custom_lists.id = list_members.list_id
      AND custom_lists.user_id = auth.uid()
    )
  );

-- RLS Policies for post_reports
CREATE POLICY "Users can create reports"
  ON post_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Admins can view reports"
  ON post_reports FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_ranks
      WHERE user_ranks.user_id = auth.uid()
      AND user_ranks.rank IN ('professional', 'unique')
    )
  );

-- RLS Policies for comment_deletion_requests
CREATE POLICY "Users can view their requests"
  ON comment_deletion_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create deletion requests"
  ON comment_deletion_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_ranks
CREATE POLICY "Anyone can view ranks"
  ON user_ranks FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for user_settings
CREATE POLICY "Users can view their settings"
  ON user_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their settings"
  ON user_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Auto-create user settings and rank on profile creation
CREATE OR REPLACE FUNCTION create_user_defaults()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_ranks (user_id, rank) VALUES (NEW.id, 'member');
  INSERT INTO user_settings (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_created ON profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_user_defaults();
