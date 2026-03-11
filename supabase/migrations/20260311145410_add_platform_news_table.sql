/*
  # Add Platform News Table

  ## New Tables
  
  ### `platform_news`
  - `id` (uuid, primary key)
  - `title` (text) - News title
  - `content` (text) - News content
  - `category` (text) - 'update', 'feature', 'maintenance', 'announcement'
  - `created_at` (timestamptz)
  - `created_by` (uuid, references profiles) - Admin who created the news

  ## Security
  - Enable RLS on platform_news
  - Platform news readable by all authenticated users
  - Platform news only created/updated by admins in admin_hierarchy table
*/

-- Platform News Table
CREATE TABLE IF NOT EXISTS platform_news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL CHECK (category IN ('update', 'feature', 'maintenance', 'announcement')),
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE platform_news ENABLE ROW LEVEL SECURITY;

-- Platform News Policies
CREATE POLICY "Anyone can view platform news"
  ON platform_news FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can create platform news"
  ON platform_news FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_hierarchy
      WHERE admin_hierarchy.user_id = auth.uid()
    )
  );

CREATE POLICY "Only admins can update platform news"
  ON platform_news FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_hierarchy
      WHERE admin_hierarchy.user_id = auth.uid()
    )
  );

CREATE POLICY "Only admins can delete platform news"
  ON platform_news FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_hierarchy
      WHERE admin_hierarchy.user_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_platform_news_created_at ON platform_news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_platform_news_category ON platform_news(category);
