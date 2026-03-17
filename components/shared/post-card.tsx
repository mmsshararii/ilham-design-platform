'use client';

import { PostWithUser } from '@/types/post';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: PostWithUser;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
}

const postTypeLabels: Record<string, string> = {
  general: 'منشور عام',
  design: 'تصميم',
  request: 'طلب',
  offer: 'عرض',
  attachment: 'ملحق',
};

const postTypeBadgeColors: Record<string, string> = {
  general: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  design: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  request: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  offer: 'bg-green-500/10 text-green-600 border-green-500/20',
  attachment: 'bg-pink-500/10 text-pink-600 border-pink-500/20',
};

export function PostCard({ post, onLike, onComment }: PostCardProps) {
  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: ar,
  });

  return (
    <article className="border-b border-border/40 bg-background p-4 hover:bg-muted/20 transition-colors">
      <div className="flex gap-3">
        <Avatar className="h-12 w-12 border-2 border-border/40">
          <AvatarImage src={post.user?.avatar_url || undefined} />
          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
            {post.user?.username?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-foreground">
                {post.user?.display_name || post.user?.username || 'مستخدم'}
              </span>
              <span className="text-sm text-muted-foreground">
                @{post.user?.username || 'user'}
              </span>
              <span className="text-sm text-muted-foreground">·</span>
              <span className="text-sm text-muted-foreground">{timeAgo}</span>
            </div>

            <Badge
              variant="outline"
              className={cn(
                'text-xs font-medium border',
                postTypeBadgeColors[post.type] || postTypeBadgeColors.general
              )}
            >
              {postTypeLabels[post.type] || 'منشور'}
            </Badge>
          </div>

          {post.title && (
            <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
          )}

          <p className="text-foreground whitespace-pre-wrap mb-3">
            {post.description}
          </p>

          {post.images && post.images.length > 0 && (
            <div className={cn(
              "grid gap-2 mb-3 rounded-lg overflow-hidden",
              post.images.length === 1 && "grid-cols-1",
              post.images.length === 2 && "grid-cols-2",
              post.images.length >= 3 && "grid-cols-2"
            )}>
              {post.images.slice(0, 4).map((image, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "relative bg-muted overflow-hidden rounded-lg",
                    post.images.length === 1 && "aspect-video",
                    post.images.length >= 2 && "aspect-square",
                    post.images.length === 3 && idx === 0 && "col-span-2"
                  )}
                >
                  <img
                    src={image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {post.price && (
            <div className="mb-3 inline-block px-3 py-1.5 bg-green-500/10 text-green-600 rounded-lg text-sm font-semibold">
              {post.price} ر.س
            </div>
          )}

          <div className="flex items-center gap-6 text-muted-foreground">
            <button
              onClick={() => onLike?.(post.id)}
              className={cn(
                "flex items-center gap-2 hover:text-pink-600 transition-colors group",
                post.is_liked && "text-pink-600"
              )}
            >
              <Heart
                className={cn(
                  "h-5 w-5 group-hover:scale-110 transition-transform",
                  post.is_liked && "fill-current"
                )}
              />
              <span className="text-sm font-medium">{post.likes_count || 0}</span>
            </button>

            <button
              onClick={() => onComment?.(post.id)}
              className="flex items-center gap-2 hover:text-blue-600 transition-colors group"
            >
              <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">{post.comments_count || 0}</span>
            </button>

            <button className="flex items-center gap-2 hover:text-green-600 transition-colors group">
              <Share2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </button>

            {post.views_count !== undefined && (
              <span className="text-sm mr-auto">
                {post.views_count} مشاهدة
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
