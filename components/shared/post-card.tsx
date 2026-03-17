'use client';

import { PostWithUser, PostType, PostStatus } from '@/types/post';
import { Heart, MessageCircle, Eye } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface PostCardProps {
  post: PostWithUser;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
}

const POST_TYPE_LABELS: Record<PostType, string> = {
  general: 'عام',
  design: 'تصميم',
  request: 'طلب',
  offer: 'عرض',
  attachment: 'مرفق',
};

const POST_TYPE_COLORS: Record<PostType, string> = {
  general: 'bg-gray-100 text-gray-800',
  design: 'bg-blue-100 text-blue-800',
  request: 'bg-orange-100 text-orange-800',
  offer: 'bg-green-100 text-green-800',
  attachment: 'bg-purple-100 text-purple-800',
};

const POST_STATUS_LABELS: Record<PostStatus, string> = {
  open: 'مفتوح',
  closed: 'مغلق',
  completed: 'مكتمل',
};

const POST_STATUS_COLORS: Record<PostStatus, string> = {
  open: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
  completed: 'bg-blue-100 text-blue-800',
};

export function PostCard({ post, onLike, onComment }: PostCardProps) {
  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 mb-4">
        <Avatar>
          <AvatarImage src={post.user.avatar_url || undefined} />
          <AvatarFallback>
            {post.user.display_name?.[0] || post.user.username[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-sm">
              {post.user.display_name || post.user.username}
            </h3>
            <span className="text-gray-500 text-xs">@{post.user.username}</span>
            <span className="text-gray-400 text-xs">
              {new Date(post.created_at).toLocaleDateString('ar-SA')}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={POST_TYPE_COLORS[post.type]}>
              {POST_TYPE_LABELS[post.type]}
            </Badge>
            <Badge className={POST_STATUS_COLORS[post.status]}>
              {POST_STATUS_LABELS[post.status]}
            </Badge>
          </div>
        </div>
      </div>

      {post.title && (
        <h2 className="text-lg font-bold mb-2">{post.title}</h2>
      )}

      <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.description}</p>

      {post.images && post.images.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {post.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Post image ${index + 1}`}
              className="rounded-lg w-full h-48 object-cover"
            />
          ))}
        </div>
      )}

      {post.attachments && post.attachments.length > 0 && (
        <div className="mb-4 space-y-2">
          {post.attachments.map((attachment, index) => (
            <a
              key={index}
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm text-blue-600">{attachment.name}</span>
            </a>
          ))}
        </div>
      )}

      {post.price && (
        <div className="mb-4">
          <span className="text-lg font-bold text-green-600">
            {post.price.toLocaleString('ar-SA')} ر.س
          </span>
        </div>
      )}

      <div className="flex items-center gap-6 pt-4 border-t">
        <button
          onClick={() => onLike?.(post.id)}
          className={`flex items-center gap-2 text-sm transition-colors ${
            post.is_liked
              ? 'text-red-600 hover:text-red-700'
              : 'text-gray-600 hover:text-red-600'
          }`}
        >
          <Heart
            className="w-5 h-5"
            fill={post.is_liked ? 'currentColor' : 'none'}
          />
          <span>{post.likes_count}</span>
        </button>

        <button
          onClick={() => onComment?.(post.id)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span>{post.comments_count}</span>
        </button>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Eye className="w-5 h-5" />
          <span>{post.views_count}</span>
        </div>
      </div>
    </Card>
  );
}
