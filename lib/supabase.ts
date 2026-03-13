import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Profile = {
  id: string;
  username: string;
  display_name?: string;
  account_type: 'designer' | 'seeker' | 'general';
  avatar_url?: string;
  banner_url?: string;
  bio?: string;
  welcome_message?: string;
  social_links?: Record<string, string>;
  is_verified?: boolean;
  is_suspended?: boolean;
  is_banned?: boolean;
  suspension_reason?: string;
  suspension_until?: string;
  last_username_change?: string;
  follower_count?: number;
  created_at: string;
  updated_at: string;
};

export type Post = {
  id: string
  short_id: number
  user_id: string
  post_type: 'my_design' | 'design_offer' | 'design_request' | 'general'
  description: string
  hashtags: string[]
  images: string[]
  attachments?: string[]
  created_at: string
  profiles?: Profile
  price?: number | null
  price_negotiable?: boolean
  is_hidden?: boolean
};

export type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  parent_id?: string;
  content: string;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
};
