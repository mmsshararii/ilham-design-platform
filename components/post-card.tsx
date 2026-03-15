'use client';
import { encodeId } from '@/lib/short-id';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Post } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuItem,
DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { MessageCircle, Heart, Share2, Bookmark, MoreHorizontal, Eye, Repeat2, FileText, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { Username } from "@/components/username";
const postTypeLabels = {
my_design: 'تصميمي',
design_offer: 'عرض تصميم',
design_request: 'طلب تصميم',
general: 'منشور عام',
};

const postTypeColors = {
my_design: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
design_offer: 'bg-green-500/20 text-green-300 border-green-500/30',
design_request: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
general: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
};

interface PostCardProps {
  post: (Post & {
    short_id: number | string;
    price?: number | null;
    price_negotiable?: boolean;
    profiles?: {
      username: string;
      avatar_url?: string;
      display_name?: string;
    };
  });
  onLikesUpdate?: (count: number) => void;
}

export function PostCard({ post }: PostCardProps) {
const router = useRouter();
const { user } = useAuth();
const pathname = usePathname();
const isPostPage = pathname.startsWith('/post/'); 
const [likeCount, setLikeCount] = useState(0);
const [isLiked, setIsLiked] = useState(false);
const [isFavorited, setIsFavorited] = useState(false);
const [commentCount, setCommentCount] = useState(0);
const [viewCount, setViewCount] = useState(0);
const [repostCount, setRepostCount] = useState(0);
const [attachments, setAttachments] = useState<Array<{ url: string; order: number }>>([]);

const images = Array.isArray(post.images) ? post.images : [];
const mainImage = images[0];
const thumbnails = images.slice(1);

useEffect(() => {
if (post.id) {
fetchEngagementData();
}
fetchAttachments();
}, [post.id]);

const fetchEngagementData = async () => {
const [likesRes, commentsRes, viewsRes, repostsRes, userLikeRes, userFavRes] = await Promise.all([
supabase.from('post_likes').select('id', { count: 'exact', head: true }).eq('post_id', post.id),
supabase.from('comments').select('id', { count: 'exact', head: true }).eq('post_id', post.id).is('deleted_at', null),
supabase.from('post_views').select('id', { count: 'exact', head: true }).eq('post_id', post.id),
supabase.from('post_reposts').select('id', { count: 'exact', head: true }).eq('post_id', post.id),
supabase.from('post_likes').select('id').eq('post_id', post.id).eq('user_id', user!.id).maybeSingle(),
supabase.from('post_favorites').select('id').eq('post_id', post.id).eq('user_id', user!.id).maybeSingle(),
]);

setLikeCount(likesRes.count || 0);
setCommentCount(commentsRes.count || 0);
setViewCount(viewsRes.count || 0);
setRepostCount(repostsRes.count || 0);
setIsLiked(!!userLikeRes.data);
setIsFavorited(!!userFavRes.data);
};

const fetchAttachments = () => {
const rawAttachments = (post as any).attachments;

if (Array.isArray(rawAttachments)) {
const formatted = rawAttachments.map((url: string, index: number) => ({
url,
order: index
}));

setAttachments(formatted);
}
};

const handlePostClick = () => {
const short = encodeId(Number((post as any).short_id));
router.push(`/i/${short}`);
};

const handleLike = async (e: React.MouseEvent) => {
e.stopPropagation();
if (!user) return;

if (isLiked) {
await supabase.from('post_likes').delete().eq('post_id', post.id).eq('user_id', user.id);
setLikeCount(Math.max(0, likeCount - 1));
} else {
await supabase.from('post_likes').insert({
post_id: post.id,
user_id: user.id,
});
setLikeCount(likeCount + 1);
}
setIsLiked(!isLiked);
};

const handleFavorite = async (e: React.MouseEvent) => {
e.stopPropagation();
if (!user) return;

if (isFavorited) {
await supabase
.from('post_favorites')
.delete()
.eq('post_id', post.id)
.eq('user_id', user.id);
} else {
await supabase.from('post_favorites').insert({
post_id: post.id,
user_id: user.id,
});
}
setIsFavorited(!isFavorited);
};

const handleShare = async (e: React.MouseEvent) => {
e.stopPropagation();
const postUrl = `${window.location.origin}/post/${post.id}`;

if (navigator.share) {
try {
await navigator.share({
title: 'استلهم',
text: post.description,
url: postUrl,
});
} catch (err) {
if (err instanceof Error && err.name !== 'AbortError') {
navigator.clipboard.writeText(postUrl);
toast.success('تم نسخ رابط المنشور');
}
}
} else {
navigator.clipboard.writeText(postUrl);
toast.success('تم نسخ رابط المنشور');
}
};

const handleReport = async (e: React.MouseEvent) => {
e.stopPropagation();
if (!user) return;

const reason = prompt('يرجى تحديد سبب الإبلاغ:');
if (!reason) return;

await supabase.from('post_reports').insert({
reporter_id: user.id,
post_id: post.id,
reason,
status: 'pending',
});

toast.success('تم إرسال البلاغ بنجاح');
};

const displayName = post.profiles?.display_name || post.profiles?.username;

return (
<Card
onClick={handlePostClick}
className="overflow-hidden hover:border-purple-500/30 transition-colors cursor-pointer"

>

<CardHeader className="pb-3">
<div className="flex items-start justify-between gap-3">
<Link
href={`/profile/${post.profiles?.username}`}
onClick={(e) => e.stopPropagation()}
className="flex items-center gap-3 flex-1 min-w-0"
>
<Avatar className="h-10 w-10 border-2 border-purple-500/30">
<AvatarImage src={post.profiles?.avatar_url} />
<AvatarFallback className="bg-gradient-purple text-white">
{displayName?.[0]?.toUpperCase()}
</AvatarFallback>
</Avatar>

<div className="flex-1 min-w-0">
<div className="flex items-center gap-2">
<p className="font-semibold truncate">{displayName}</p>
{post.profiles?.display_name && (
<span className="text-xs text-muted-foreground">
  <Username username={post.profiles?.username || ""} />
</span>
)}
</div>
<p className="text-xs text-muted-foreground">
{formatDistanceToNow(new Date(post.created_at), {
addSuffix: true,
locale: ar,
})}
</p>
</div>
</Link>

<div className="flex items-center gap-2">
<Badge className={postTypeColors[post.post_type]}>
{postTypeLabels[post.post_type]}
</Badge>

<DropdownMenu>
<DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
<MoreHorizontal className="h-4 w-4" />
</Button>
</DropdownMenuTrigger>

<DropdownMenuContent align="start" className="w-48">
<DropdownMenuItem className="text-sm">غير مهتم</DropdownMenuItem>
<DropdownMenuItem onClick={handleReport} className="text-sm text-destructive">
الإبلاغ عن المنشور
</DropdownMenuItem>
<DropdownMenuItem asChild>
<Link href={`/profile/${post.profiles?.username}`} className="text-sm">
عرض ملف الحساب
</Link>
</DropdownMenuItem>
</DropdownMenuContent>
</DropdownMenu>
</div>
</div>
</CardHeader>

<CardContent className="space-y-3 pb-4">

<p className="text-sm leading-relaxed whitespace-pre-wrap line-clamp-3">
{post.description}
</p>
{(post.price !== null && post.price !== undefined) && (
  <div className="flex items-center gap-2 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
    <DollarSign className="h-4 w-4 text-purple-400" />
    <div className="flex-1">
      <p className="text-sm font-semibold text-purple-300">
        {post.post_type === 'design_offer' ? 'السعر:' : 'الميزانية:'} {post.price} ريال
      </p>
      {post.price_negotiable && (
        <p className="text-xs text-purple-400">قابل للتفاوض</p>
      )}
    </div>
  </div>
)}

{images.length > 0 && (
  <div className="space-y-2">
    {mainImage && (
      <div className="relative rounded-lg overflow-hidden bg-muted aspect-video">
        <img
          src={mainImage}
          alt="Post image"
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
    )}
  </div>
)}

{post.hashtags && post.hashtags.length > 0 && (
  <div className="flex flex-wrap gap-1.5">
    {post.hashtags.map((tag, index) => (
      <Link
        key={index}
        href={`/hashtag/${encodeURIComponent(tag)}`}
        onClick={(e) => e.stopPropagation()}
        className="text-xs text-purple-400 hover:text-purple-300"
      >
        #{tag}
      </Link>
    ))}
  </div>
)}
{isPostPage && attachments.length > 0 && (

<div className="space-y-2">
<p className="text-xs font-semibold text-muted-foreground">المرفقات</p>

<div className="flex gap-[5%] flex-wrap">
{attachments.map((att, index) => (
<a
key={att.url}
href={att.url}
target="_blank"
rel="noopener noreferrer"
onClick={(e) => e.stopPropagation()}
className="flex items-center gap-2 p-2.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg transition-colors group"
>
<FileText className="h-4 w-4 text-purple-400" />
<span className="text-sm text-purple-300 group-hover:text-purple-200">
{attachments.length === 1 ? 'المرفق' : `المرفق ${index + 1}`}
</span>
</a>
))}
</div>
</div>
)}
<div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">

  <div className="flex items-center gap-4">
    <span className="flex items-center gap-1">
      <Repeat2 className="h-3.5 w-3.5" />
      {repostCount}
    </span>

    <span className="flex items-center gap-1">
      <MessageCircle className="h-3.5 w-3.5" />
      {commentCount}
    </span>

    <span className="flex items-center gap-1">
      <Heart className="h-3.5 w-3.5" />
      {likeCount}
    </span>

    <span className="flex items-center gap-1">
      <Eye className="h-3.5 w-3.5" />
      {viewCount}
    </span>
  </div>

  <div className="flex items-center gap-1">

    <Button
      variant="ghost"
      size="sm"
      onClick={handleShare}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <Share2 className="h-4 w-4" />
    </Button>

    <Button
      variant="ghost"
      size="sm"
      onClick={handleFavorite}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <Bookmark className={`h-4 w-4 ${isFavorited ? 'fill-purple-500 text-purple-500' : ''}`} />
    </Button>

    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
    </Button>

  </div>

</div>
</CardContent>
</Card>
);
}
