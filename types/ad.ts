export interface Ad {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  link_url: string | null;
  is_pinned: boolean;
  impressions_limit: number;
  impressions_count: number;
  clicks_count: number;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
}

export interface AdClick {
  id: string;
  ad_id: string;
  user_id: string | null;
  clicked_at: string;
}

export interface CreateAdInput {
  title: string;
  description: string;
  image_url?: string;
  link_url?: string;
  is_pinned?: boolean;
  impressions_limit?: number;
  start_date?: string;
  end_date?: string;
}
