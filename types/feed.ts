import { PostType } from './post';

export type FeedTab = 'custom' | 'general' | 'design' | 'request' | 'offer' | 'following';

export interface FeedParams {
  tab: FeedTab;
  userId: string;
  preferences?: string[];
  page?: number;
  limit?: number;
}

export interface FeedItem {
  id: string;
  type: 'post' | 'ad';
  data: any;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  hasMore: boolean;
  total?: number;
}

export interface FeedResponse {
  items: FeedItem[];
  meta: PaginationMeta;
}
