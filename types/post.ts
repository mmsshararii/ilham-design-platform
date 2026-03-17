export type PostType = 'general' | 'design' | 'request' | 'offer' | 'attachment';
export type PostStatus = 'open' | 'closed' | 'completed';

export interface Post {
  id: string;
  user_id: string;
  type: PostType;
  status: PostStatus;
  title: string | null;
  description: string;
  images: string[];
  attachments: Attachment[];
  price: number | null;
  likes_count: number;
  comments_count: number;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface Attachment {
  name: string;
  url: string;
  size?: number;
  type?: string;
}

export interface PostWithUser extends Post {
  user: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
  is_liked?: boolean;
}

export interface CreatePostInput {
  type: PostType;
  status?: PostStatus;
  title?: string;
  description: string;
  images?: string[];
  attachments?: Attachment[];
  price?: number;
}

export interface UpdatePostInput {
  type?: PostType;
  status?: PostStatus;
  title?: string;
  description?: string;
  images?: string[];
  attachments?: Attachment[];
  price?: number;
}
