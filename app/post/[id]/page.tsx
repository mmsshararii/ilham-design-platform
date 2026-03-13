'use client';

import { decodeId } from '@/lib/short-id';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

export default function PostDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();

  const code = (params.id as string).replace('i', '');
  const postNumber = decodeId(code);

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
    if (user && postNumber) {
      fetchPost();
    }
  }, [user, postNumber]);

  useEffect(() => {
    if (post?.id) {
      fetchComments();
    }
  }, [post]);

  const fetchPost = async () => {
    const { data } = await supabase
      .from('posts')
      .select(`
        *,
        profiles (*)
      `)
      .eq('short_id', postNumber)
      .maybeSingle();

    if (data) {
      setPost(data);
    }

    setLoading(false);
  };

  const fetchComments = async () => {
    if (!post?.id) return;

    const { data } = await supabase
      .from('comments')
      .select(`
        *,
        profiles (*)
      `)
      .eq('post_id', post.id)
      .order('created_at', { ascending: true });

    if (data) {
      setComments(data);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentText.trim() || !user || !post) return;

    setSubmitting(true);

    const { data: newComment, error } = await supabase
      .from('comments')
      .insert({
        post_id: post.id,
        user_id: user.id,
        parent_id: replyingTo,
        content: commentText,
      })
      .select(`
        *,
        profiles (*)
      `)
      .single();

    if (!error && newComment) {
      setComments([...comments, newComment]);
      setCommentText('');
      setReplyingTo(null);

      if (post.user_id !== user.id) {
        await supabase.from('notifications').insert({
          user_id: post.user_id,
          type: 'comment',
          content: `علق ${user.email} على منشورك`,
          related_id: post.id,
        });
      }
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

  const getReplies = (commentId: string) =>
    comments.filter((c) => c.parent_id === commentId);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-2xl mx-auto p-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 gap-2"
        >
          <ArrowRight className="h-4 w-4" />
          رجوع
        </Button>

        <PostCard post={post} />

        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-bold">التعليقات</h2>

          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmitComment} className="space-y-3">

                {replyingTo && (
                  <div className="flex items-center justify-between bg-muted/50 px-3 py-2 rounded-lg text-sm">
                    <span>الرد على تعليق...</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyingTo(null)}
                    >
                      إلغاء
                    </Button>
                  </div>
                )}

                <Textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="اكتب تعليقك..."
                  rows={3}
                  className="text-right resize-none"
                />

                <div className="flex justify-start">
                  <Button
                    type="submit"
                    disabled={submitting || !commentText.trim()}
                    className="gradient-purple gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {submitting ? 'جاري الإرسال...' : 'إرسال'}
                  </Button>
                </div>

              </form>
            </CardContent>
          </Card>

          {topLevelComments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              لا توجد تعليقات بعد
            </p>
          ) : (
            <div className="space-y-4">
              {topLevelComments.map((comment) => {

                const replies = getReplies(comment.id);

                return (
                  <Card key={comment.id}>
                    <CardContent className="pt-4">

                      <div className="flex items-start gap-3">

                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.profiles?.avatar_url} />
                          <AvatarFallback>
                            {comment.profiles?.username?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-2">

                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">
                              {comment.profiles?.username}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(
                                new Date(comment.created_at),
                                { addSuffix: true, locale: ar }
                              )}
                            </span>
                          </div>

                          <p className="text-sm">{comment.content}</p>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setReplyingTo(comment.id)}
                          >
                            رد
                          </Button>

                          {replies.length > 0 && (
                            <div className="mr-6 mt-3 space-y-3 border-r-2 pr-4">
                              {replies.map((reply) => (
                                <div key={reply.id} className="flex gap-3">

                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={reply.profiles?.avatar_url} />
                                    <AvatarFallback>
                                      {reply.profiles?.username?.[0]?.toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>

                                  <div>
                                    <span className="font-semibold text-xs">
                                      {reply.profiles?.username}
                                    </span>
                                    <p className="text-xs">{reply.content}</p>
                                  </div>

                                </div>
                              ))}
                            </div>
                          )}

                        </div>

                      </div>

                    </CardContent>
                  </Card>
                );

              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
