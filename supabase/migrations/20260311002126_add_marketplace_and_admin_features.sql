/*
  # Add Marketplace, Advertising, and Admin Features

  ## New Tables

  ### `designer_services`
  - `id` (uuid, primary key)
  - `designer_id` (uuid, references profiles)
  - `title` (text) - service title
  - `description` (text)
  - `price` (numeric)
  - `delivery_days` (int)
  - `category` (text)
  - `is_active` (boolean, default true)
  - `created_at` (timestamptz)

  ### `advertisements`
  - `id` (uuid, primary key)
  - `advertiser_id` (uuid, references profiles, nullable)
  - `title` (text)
  - `description` (text)
  - `image_url` (text)
  - `redirect_url` (text)
  - `duration_days` (int)
  - `impressions_limit` (int)
  - `impressions_used` (int, default 0)
  - `keywords` (text array)
  - `status` (text) - 'pending', 'approved', 'active', 'paused', 'expired'
  - `is_promoted` (boolean, default false)
  - `created_at` (timestamptz)
  - `expires_at` (timestamptz)

  ### `ad_impressions`
  - `id` (uuid, primary key)
  - `ad_id` (uuid, references advertisements)
  - `user_id` (uuid, references profiles)
  - `created_at` (timestamptz)

  ### `post_attachments`
  - `id` (uuid, primary key)
  - `post_id` (uuid, references posts)
  - `url` (text)
  - `order` (int)
  - `created_at` (timestamptz)

  ### `designer_verification`
  - `id` (uuid, primary key)
  - `designer_id` (uuid, references profiles)
  - `verified_by` (uuid, references profiles)
  - `verified_at` (timestamptz)
  - `is_verified` (boolean, default false)

  ### `admin_activity_log`
  - `id` (uuid, primary key)
  - `admin_id` (uuid, references profiles)
  - `action` (text) - type of action
  - `target_type` (text) - 'post', 'user', 'comment', 'ad', etc.
  - `target_id` (uuid)
  - `details` (jsonb)
  - `created_at` (timestamptz)

  ### `reserved_usernames`
  - `id` (uuid, primary key)
  - `username` (text, unique)
  - `reason` (text)
  - `reserved_at` (timestamptz)

  ### `admin_hierarchy`
  - `user_id` (uuid, primary key, references profiles)
  - `level` (text) - 'assistant', 'deputy', 'director'
  - `promoted_by` (uuid, references profiles)
  - `promoted_at` (timestamptz)

  ### `moderator_hierarchy`
  - `user_id` (uuid, primary key, references profiles)
  - `level` (text) - 'moderator', 'senior'
  - `promoted_by` (uuid, references profiles)
  - `promoted_at` (timestamptz)

  ## Modified Tables

  ### `profiles`
  - Add `is_verified` (boolean, default false)
  - Add `is_suspended` (boolean, default false)
  - Add `is_banned` (boolean, default false)
  - Add `suspension_reason` (text)
  - Add `suspension_until` (timestamptz)
  - Add `last_username_change` (timestamptz)

  ### `user_settings`
  - Add `is_premium` (boolean, default false)
  - Add `premium_until` (timestamptz)

  ### `posts`
  - Add `is_hidden` (boolean, default false)
  - Add `is_sponsored` (boolean, default false)
  - Add `sponsor_id` (uuid, references advertisements)

  ## Security
  - Enable RLS on all new tables
  - Admin-only policies for sensitive operations
*/

-- Designer Services
CREATE TABLE IF NOT EXISTS designer_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  designer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  price numeric NOT NULL,
  delivery_days int NOT NULL,
  category text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Advertisements
CREATE TABLE IF NOT EXISTS advertisements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  advertiser_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  image_url text,
  redirect_url text,
  duration_days int,
  impressions_limit int,
  impressions_used int DEFAULT 0,
  keywords text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'active', 'paused', 'expired')),
  is_promoted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

-- Ad Impressions
CREATE TABLE IF NOT EXISTS ad_impressions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id uuid NOT NULL REFERENCES advertisements(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Post Attachments
CREATE TABLE IF NOT EXISTS post_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  url text NOT NULL,
  "order" int NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Designer Verification
CREATE TABLE IF NOT EXISTS designer_verification (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  designer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  verified_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  verified_at timestamptz DEFAULT now(),
  is_verified boolean DEFAULT false,
  UNIQUE(designer_id)
);

-- Admin Activity Log
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action text NOT NULL,
  target_type text,
  target_id uuid,
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Reserved Usernames
CREATE TABLE IF NOT EXISTS reserved_usernames (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  reason text,
  reserved_at timestamptz DEFAULT now()
);

-- Admin Hierarchy
CREATE TABLE IF NOT EXISTS admin_hierarchy (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  level text NOT NULL CHECK (level IN ('assistant', 'deputy', 'director')),
  promoted_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  promoted_at timestamptz DEFAULT now()
);

-- Moderator Hierarchy
CREATE TABLE IF NOT EXISTS moderator_hierarchy (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  level text NOT NULL CHECK (level IN ('moderator', 'senior')),
  promoted_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  promoted_at timestamptz DEFAULT now()
);

-- Add columns to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_verified'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_verified boolean DEFAULT false;
    ALTER TABLE profiles ADD COLUMN is_suspended boolean DEFAULT false;
    ALTER TABLE profiles ADD COLUMN is_banned boolean DEFAULT false;
    ALTER TABLE profiles ADD COLUMN suspension_reason text;
    ALTER TABLE profiles ADD COLUMN suspension_until timestamptz;
    ALTER TABLE profiles ADD COLUMN last_username_change timestamptz;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_settings' AND column_name = 'is_premium'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN is_premium boolean DEFAULT false;
    ALTER TABLE user_settings ADD COLUMN premium_until timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'is_hidden'
  ) THEN
    ALTER TABLE posts ADD COLUMN is_hidden boolean DEFAULT false;
    ALTER TABLE posts ADD COLUMN is_sponsored boolean DEFAULT false;
    ALTER TABLE posts ADD COLUMN sponsor_id uuid REFERENCES advertisements(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_designer_services_designer_id ON designer_services(designer_id);
CREATE INDEX IF NOT EXISTS idx_advertisements_status ON advertisements(status);
CREATE INDEX IF NOT EXISTS idx_advertisements_expires_at ON advertisements(expires_at);
CREATE INDEX IF NOT EXISTS idx_ad_impressions_ad_id ON ad_impressions(ad_id);
CREATE INDEX IF NOT EXISTS idx_post_attachments_post_id ON post_attachments(post_id);
CREATE INDEX IF NOT EXISTS idx_designer_verification_designer_id ON designer_verification(designer_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_created_at ON admin_activity_log(created_at DESC);

-- Enable RLS
ALTER TABLE designer_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_impressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE designer_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserved_usernames ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_hierarchy ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderator_hierarchy ENABLE ROW LEVEL SECURITY;

-- RLS Policies for designer_services
CREATE POLICY "Anyone can view active services"
  ON designer_services FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Designers can manage their services"
  ON designer_services FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = designer_id);

CREATE POLICY "Designers can update their services"
  ON designer_services FOR UPDATE
  TO authenticated
  USING (auth.uid() = designer_id);

-- RLS Policies for advertisements
CREATE POLICY "Anyone can view approved active ads"
  ON advertisements FOR SELECT
  TO authenticated
  USING (status IN ('active', 'approved') OR advertiser_id = auth.uid());

CREATE POLICY "Advertisers can create ads"
  ON advertisements FOR INSERT
  TO authenticated
  WITH CHECK (advertiser_id = auth.uid() OR advertiser_id IS NULL);

-- RLS Policies for ad_impressions
CREATE POLICY "Anyone can create impressions"
  ON ad_impressions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for post_attachments
CREATE POLICY "Anyone can view attachments"
  ON post_attachments FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for designer_verification
CREATE POLICY "Anyone can view verifications"
  ON designer_verification FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for admin_activity_log
CREATE POLICY "Only admins can view logs"
  ON admin_activity_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_hierarchy
      WHERE admin_hierarchy.user_id = auth.uid()
    )
  );

CREATE POLICY "Only admins can create logs"
  ON admin_activity_log FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_hierarchy
      WHERE admin_hierarchy.user_id = auth.uid()
    )
  );

-- RLS Policies for reserved_usernames
CREATE POLICY "Anyone can check reserved usernames"
  ON reserved_usernames FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for admin_hierarchy
CREATE POLICY "Anyone can view admin hierarchy"
  ON admin_hierarchy FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for moderator_hierarchy
CREATE POLICY "Anyone can view moderator hierarchy"
  ON moderator_hierarchy FOR SELECT
  TO authenticated
  USING (true);
