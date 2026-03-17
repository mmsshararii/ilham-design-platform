export interface UserProfile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateUserProfileInput {
  username?: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
}

export interface UserPreferences {
  user_id: string;
  custom_feed_types: string[];
  created_at: string;
  updated_at: string;
}

export interface Follow {
  follower_id: string;
  following_id: string;
  created_at: string;
}
