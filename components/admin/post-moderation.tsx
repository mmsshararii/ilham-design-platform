'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { logAdminAction } from '@/lib/admin-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Trash2, EyeOff, Loader as Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Post {
  id: string;
  user_id: string;
  post_type: string;
  description: string;
  hashtags: string[];
  images: any;
  is_hidden: boolean;
  created_at: string;
  profiles: {
    username: string;
  };
}

interface PostModerationProps {
  adminId: string;
}

export function PostModeration({ adminId }: PostModerationProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [reportedPosts, setReportedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteReason, setDeleteReason] = useState('');

  useEffect(() => {
    fetchPosts();
    fetchReportedPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(username)')
      .order('created_at', { ascending: false })
      .limit(50);

    if (data) {
      setPosts(data as any);
    }
    setLoading(false);
  };

  const fetchReportedPosts = async () => {
    const { data: reports } = await supabase
      .from('post_reports')
      .select('post_id')
      .eq('status', 'pending');

    if (reports && reports.length > 0) {
      const uniquePostIds = new Set(reports.map(r => r.post_id));
      const postIds = Array.from(uniquePostIds);

      const { data } = await supabase
        .from('posts')
        .select('*, profiles(username)')
        .in('id', postIds);

      if (data) {
        setReportedPosts(data as any);
      }
    }
  };

  const handleHidePost = async (postId: string, hide: boolean) => {
    const { error } = await supabase
      .from('posts')
      .update({ is_hidden: hide })
      .eq('id', postId);

    if (!error) {
      await logAdminAction(adminId, hide ? 'hide_post' : 'unhide_post', 'post', postId);
      toast.success(hide ? 'تم إخفاء المنشور' : 'تم إظهار المنشور');
      fetchPosts();
      fetchReportedPosts();
    } else {
      toast.error('فشلت العملية');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!deleteReason.trim()) {
      toast.error('يرجى إدخال سبب الحذف');
      return;
    }

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (!error) {
      await logAdminAction(adminId, 'delete_post', 'post', postId, {
        reason: deleteReason,
      });

      toast.success('تم حذف المنشور بنجاح');
      setDeleteReason('');
      fetchPosts();
      fetchReportedPosts();
    } else {
      toast.error('فشل حذف المنشور');
    }
  };

  const getPostTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      my_design: 'تصميمي',
      design_offer: 'عرض تصميم',
      design_request: 'طلب تصميم',
      general: 'عام',
    };
    return types[type] || type;
  };

  const renderPostCard = (post: Post) => (
    <Card key={post.id}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base flex items-center gap-2">
              @{post.profiles.username}
              <Badge variant="secondary" className="text-xs">
                {getPostTypeLabel(post.post_type)}
              </Badge>
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {new Date(post.created_at).toLocaleDateString('ar', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          {post.is_hidden && (
            <Badge variant="destructive">مخفي</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm">{post.description}</p>

        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.hashtags.map((tag, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open(`/post/${post.id}`, '_blank')}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            عرض المنشور
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => handleHidePost(post.id, !post.is_hidden)}
            className="gap-2"
          >
            {post.is_hidden ? (
              <>
                <Eye className="h-4 w-4" />
                إظهار
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4" />
                إخفاء
              </>
            )}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="destructive" className="gap-2">
                <Trash2 className="h-4 w-4" />
                حذف
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>حذف المنشور</AlertDialogTitle>
                <AlertDialogDescription className="space-y-3">
                  <p>هل أنت متأكد من حذف هذا المنشور؟ هذا الإجراء لا يمكن التراجع عنه.</p>
                  <Textarea
                    placeholder="سبب الحذف..."
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                  />
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeleteReason('')}>
                  إلغاء
                </AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeletePost(post.id)}>
                  حذف
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <Tabs defaultValue="all" className="space-y-4">
      <TabsList>
        <TabsTrigger value="all">جميع المنشورات ({posts.length})</TabsTrigger>
        <TabsTrigger value="reported">المبلغ عنها ({reportedPosts.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-4">
        <div className="grid gap-4">
          {posts.map(renderPostCard)}
        </div>
        {posts.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            لا توجد منشورات
          </p>
        )}
      </TabsContent>

      <TabsContent value="reported" className="space-y-4">
        <div className="grid gap-4">
          {reportedPosts.map(renderPostCard)}
        </div>
        {reportedPosts.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            لا توجد منشورات مبلغ عنها
          </p>
        )}
      </TabsContent>
    </Tabs>
  );
}
