'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase, Post, Comment } from '@/lib/supabase';
import { Navbar } from '@/components/navbar';
import { PostCard } from '@/components/post-card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowRight, Loader as Loader2, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useRouter } from 'next/navigation';

export default function PostDetail({ postId }: { postId: string }) {

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && postId) {
      fetchPost();
    }
  }, [user, postId]);

  useEffect(() => {
    if (post?.id) {
      fetchComments();
    }
  }, [post]);

  const fetchPost = async () => {
    const { data } = await supabase
      .from('posts')
      .select(`*, profiles (*)`)
      .eq('id', postId)
      .maybeSingle();

    if (data) setPost(data);
    setLoading(false);
  };

  const fetchComments = async () => {
    if (!post?.id) return;

    const { data } = await supabase
      .from('comments')
      .select(`*, profiles (*)`)
      .eq('post_id', post.id)
      .order('created_at', { ascending: true });

    if (data) setComments(data);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentText.trim() || !user || !post) return;

    setSubmitting(true);

    const { data: newComment } = await supabase
      .from('comments')
      .insert({
        post_id: post.id,
        user_id: user.id,
        parent_id: replyingTo,
        content: commentText,
      })
      .select(`*, profiles (*)`)
      .single();

    if (newComment) {
      setComments([...comments, newComment]);
      setCommentText('');
      setReplyingTo(null);
    }

    setSubmitting(false);
  };

  if (authLoading || !user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-2xl mx-auto p-4 text-center">
          <p className="text-muted-foreground">المنشور غير موجود</p>
        </div>
      </div>
    );
  }

  const topLevelComments = comments.filter((c) => !c.parent_id);
  const getReplies = (id: string) => comments.filter((c) => c.parent_id === id);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-2xl mx-auto p-4">

        <Button variant="ghost" onClick={() => router.back()} className="mb-4 gap-2">
          <ArrowRight className="h-4 w-4" />
          رجوع
        </Button>

        <PostCard post={post} />

        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-bold">التعليقات</h2>

          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmitComment} className="space-y-3">

                <Textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="اكتب تعليقك..."
                  rows={3}
                  className="text-right resize-none"
                />

                <Button type="submit" disabled={submitting || !commentText.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  إرسال
                </Button>

              </form>
            </CardContent>
          </Card>

          {topLevelComments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              لا توجد تعليقات بعد
            </p>
          ) : (
            topLevelComments.map((c) => (
              <Card key={c.id}>
                <CardContent className="pt-4">
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={c.profiles?.avatar_url} />
                      <AvatarFallback>
                        {c.profiles?.username?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex gap-2 text-sm">
                        <span className="font-semibold">
                          {c.profiles?.username}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {formatDistanceToNow(new Date(c.created_at), {
                            addSuffix: true,
                            locale: ar,
                          })}
                        </span>
                      </div>

                      <p className="text-sm mt-1">{c.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}

        </div>

      </main>
    </div>
  );
}