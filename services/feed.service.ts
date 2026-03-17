import { getSupabaseClient } from '@/lib/supabase';
import { FeedParams, FeedResponse, FeedItem } from '@/types/feed';
import { PostWithUser } from '@/types/post';
import { getAdsForFeed, trackAdImpression } from './ads.service';
import { getUserPreferences, getFollowing } from './user.service';

const supabase = getSupabaseClient();

const AD_INJECTION_INTERVAL = 5;

export async function getFeed(params: FeedParams): Promise<FeedResponse> {
  const {
    tab,
    userId,
    page = 1,
    limit = 20,
  } = params;

  let postsQuery = supabase
    .from('posts')
    .select(`
      *,
      user:users_profile!posts_user_id_fkey(
        id,
        username,
        display_name,
        avatar_url
      )
    `, { count: 'exact' });

  switch (tab) {
    case 'custom':
      const preferences = await getUserPreferences(userId);
      const feedTypes = preferences?.custom_feed_types || ['general', 'design', 'request', 'offer', 'attachment'];
      postsQuery = postsQuery.in('type', feedTypes);
      break;

    case 'general':
      postsQuery = postsQuery.eq('type', 'general');
      break;

    case 'design':
      postsQuery = postsQuery.eq('type', 'design');
      break;

    case 'request':
      postsQuery = postsQuery.eq('type', 'request');
      break;

    case 'offer':
      postsQuery = postsQuery.eq('type', 'offer');
      break;

    case 'following':
      const followingIds = await getFollowing(userId);
      if (followingIds.length === 0) {
        return {
          items: [],
          meta: {
            page,
            limit,
            hasMore: false,
            total: 0,
          },
        };
      }
      postsQuery = postsQuery.in('user_id', followingIds);
      break;
  }

  const offset = (page - 1) * limit;
  postsQuery = postsQuery
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  const { data: posts, error, count } = await postsQuery;

  if (error) throw error;

  const postsWithLikes = await enrichPostsWithLikes(posts || [], userId);

  const ads = await getAdsForFeed(2);

  const feedItems: FeedItem[] = [];
  let adIndex = 0;

  postsWithLikes.forEach((post, index) => {
    feedItems.push({
      id: post.id,
      type: 'post',
      data: post,
    });

    if ((index + 1) % AD_INJECTION_INTERVAL === 0 && adIndex < ads.length) {
      const ad = ads[adIndex];
      feedItems.push({
        id: ad.id,
        type: 'ad',
        data: ad,
      });

      trackAdImpression(ad.id).catch(console.error);
      adIndex++;
    }
  });

  return {
    items: feedItems,
    meta: {
      page,
      limit,
      hasMore: (count || 0) > offset + limit,
      total: count || 0,
    },
  };
}

async function enrichPostsWithLikes(
  posts: PostWithUser[],
  userId: string
): Promise<PostWithUser[]> {
  if (posts.length === 0) return [];

  const postIds = posts.map(p => p.id);

  const { data: likes, error } = await supabase
    .from('likes')
    .select('post_id')
    .eq('user_id', userId)
    .in('post_id', postIds);

  if (error) throw error;

  const likedPostIds = new Set(likes?.map(l => l.post_id) || []);

  return posts.map(post => ({
    ...post,
    is_liked: likedPostIds.has(post.id),
  }));
}
