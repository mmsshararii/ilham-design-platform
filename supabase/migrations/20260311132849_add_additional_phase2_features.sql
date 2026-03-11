/*
  # Additional Phase 2 Features

  ## New Tables
  
  ### `support_tickets`
  - `id` (uuid, primary key)
  - `ticket_number` (text, unique) - Auto-generated ticket number
  - `user_id` (uuid, references profiles)
  - `email` (text)
  - `title` (text)
  - `description` (text)
  - `images` (text array) - Up to 3 image URLs
  - `status` (text) - 'pending', 'in_progress', 'resolved', 'rejected'
  - `admin_response` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `notifications`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `type` (text) - 'like', 'comment', 'follow', 'offer_accepted', 'report', 'verification'
  - `content` (text)
  - `related_id` (uuid) - ID of related post/comment/user
  - `is_read` (boolean, default false)
  - `created_at` (timestamptz)

  ### `profanity_filters`
  - `id` (uuid, primary key)
  - `word` (text, unique)
  - `severity` (text) - 'low', 'medium', 'high'
  - `created_at` (timestamptz)

  ### `accepted_offers`
  - `id` (uuid, primary key)
  - `post_id` (uuid, references posts)
  - `comment_id` (uuid, references comments)
  - `accepted_by` (uuid, references profiles)
  - `created_at` (timestamptz)

  ## Modified Tables

  ### `profiles`
  - Add `display_name` (text) - Arabic display name
  - Add `welcome_message` (text) - Profile welcome message
  - Add `follower_count` (int, default 0) - Cached follower count

  ### `posts`
  - Add `price` (numeric) - For design offers/requests
  - Add `price_negotiable` (boolean, default false)
  - Add `commission_agreed` (boolean, default false) - 20% commission agreement

  ### `user_settings`
  - Add `last_post_time` (timestamptz) - For spam protection
  - Add `posts_in_window` (int, default 0) - Posts in current time window

  ## Indexes
  - Index on notifications user_id and is_read
  - Index on support_tickets status
  - Index on profanity_filters word
  - Index on profiles follower_count
*/

-- Support Tickets
CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number text UNIQUE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  email text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  images text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'rejected')),
  admin_response text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('like', 'comment', 'follow', 'offer_accepted', 'report', 'verification', 'admin')),
  content text NOT NULL,
  related_id uuid,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Profanity Filters
CREATE TABLE IF NOT EXISTS profanity_filters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  word text UNIQUE NOT NULL,
  severity text NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
  created_at timestamptz DEFAULT now()
);

-- Accepted Offers
CREATE TABLE IF NOT EXISTS accepted_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  comment_id uuid NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  accepted_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id)
);

-- Add columns to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'display_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN display_name text;
    ALTER TABLE profiles ADD COLUMN welcome_message text;
    ALTER TABLE profiles ADD COLUMN follower_count int DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'price'
  ) THEN
    ALTER TABLE posts ADD COLUMN price numeric;
    ALTER TABLE posts ADD COLUMN price_negotiable boolean DEFAULT false;
    ALTER TABLE posts ADD COLUMN commission_agreed boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_settings' AND column_name = 'last_post_time'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN last_post_time timestamptz;
    ALTER TABLE user_settings ADD COLUMN posts_in_window int DEFAULT 0;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_profanity_filters_word ON profanity_filters(word);
CREATE INDEX IF NOT EXISTS idx_profiles_follower_count ON profiles(follower_count DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Enable RLS
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE profanity_filters ENABLE ROW LEVEL SECURITY;
ALTER TABLE accepted_offers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for support_tickets
CREATE POLICY "Users can view their own tickets"
  ON support_tickets FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create tickets"
  ON support_tickets FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for profanity_filters
CREATE POLICY "Anyone can view profanity filters"
  ON profanity_filters FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for accepted_offers
CREATE POLICY "Anyone can view accepted offers"
  ON accepted_offers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Post owners can accept offers"
  ON accepted_offers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = post_id AND posts.user_id = auth.uid()
    )
  );

-- Function to generate ticket numbers
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS text AS $$
DECLARE
  new_number text;
BEGIN
  new_number := 'TKT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::text, 4, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate ticket numbers
CREATE OR REPLACE FUNCTION set_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ticket_number IS NULL THEN
    NEW.ticket_number := generate_ticket_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_ticket_number
  BEFORE INSERT ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION set_ticket_number();

-- Function to update follower count
CREATE OR REPLACE FUNCTION update_follower_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles
    SET follower_count = follower_count + 1
    WHERE id = NEW.following_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles
    SET follower_count = follower_count - 1
    WHERE id = OLD.following_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_follower_count
  AFTER INSERT OR DELETE ON user_follows
  FOR EACH ROW
  EXECUTE FUNCTION update_follower_count();
