import { getSupabaseClient } from '@/lib/supabase';
import { Post, PostWithUser, CreatePostInput, UpdatePostInput } from '@/types/post';

const supabase = getSupabaseClient();

export async function createPost(userId: string, input: CreatePostInput): Promise<Post> {
  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: userId,
      type: input.type,
      status: input.status || 'open',
      title: input.title || null,
      description: input.description,
      images: input.images || [],
      attachments: input.attachments || [],
      price: input.price || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePost(
  postId: string,
  userId: string,
  input: UpdatePostInput
): Promise<Post> {
  const { data, error } = await supabase
    .from('posts')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq('id', postId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePost(postId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function getPostById(postId: string, currentUserId?: string): Promise<PostWithUser | null> {
  let query = supabase
    .from('posts')
    .select(`
      *,
      user:users_profile!posts_user_id_fkey(
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .eq('id', postId)
    .maybeSingle();

  const { data: post, error } = await query;

  if (error) throw error;
  if (!post) return null;

  let isLiked = false;
  if (currentUserId) {
    const { data: likeData } = await supabase
      .from('likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', currentUserId)
      .maybeSingle();
    isLiked = !!likeData;
  }

  return {
    ...post,
    is_liked: isLiked,
  };
}

export async function likePost(postId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('likes')
    .insert({
      post_id: postId,
      user_id: userId,
    });

  if (error) throw error;
}

export async function unlikePost(postId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function incrementPostViews(postId: string): Promise<void> {
  const { data: post } = await supabase
    .from('posts')
    .select('views_count')
    .eq('id', postId)
    .maybeSingle();

  if (post) {
    const { error } = await supabase
      .from('posts')
      .update({ views_count: post.views_count + 1 })
      .eq('id', postId);

    if (error) throw error;
  }
}

export async function getPostComments(postId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      user:users_profile!comments_user_id_fkey(
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createComment(
  postId: string,
  userId: string,
  content: string
): Promise<void> {
  const { error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      user_id: userId,
      content,
    });

  if (error) throw error;
}

export async function deleteComment(commentId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', userId);

  if (error) throw error;
}
