# Ilham Platform - Implementation Guide

## Architecture Overview

### Frontend Stack
- **Framework**: Next.js 13 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Library**: shadcn/ui
- **Icons**: Lucide React
- **Date Formatting**: date-fns with Arabic locale
- **Direction**: RTL (Arabic)

### Backend Stack
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime (via Supabase JS client)
- **API**: RESTful via Supabase PostgREST

## Key Implementation Details

### 1. Post Card Component (`components/post-card.tsx`)
- Displays compact post preview with 15% smaller images
- Clickable entire card to open post detail
- Interactive buttons: Like, Favorite, Share (no click propagation)
- Post type badge and menu dropdown
- Hashtags are clickable links to hashtag pages
- Shows engagement metrics: views, likes, comments, reposts

### 2. Feed Optimization
- Images use `aspect-video` for main image (wider format)
- Thumbnails use `aspect-square` with `grid-cols-4`
- Truncated descriptions with `line-clamp-3`
- Compact gap spacing for mobile-first layout

### 3. Search Implementation (`app/search/page.tsx`)
- Three-tab search: Posts, Designers, Hashtags
- Real-time search as user types
- Case-insensitive using `ilike` in Supabase
- Displays results count in tabs

### 4. Hashtag Pages (`app/hashtag/[tag]/page.tsx`)
- Uses Supabase `contains` operator for array matching
- Strips # prefix in URL and adds back for display
- Shows post count for the hashtag

### 5. Favorites System
- Separate table `post_favorites` tracks saved posts
- User can only view their own favorites (RLS policy)
- Dedicated `/favorites` page lists all saved posts

### 6. Admin Dashboard (`app/admin/dashboard/page.tsx`)
- Protected by rank system (Professional & Unique only)
- Two tabs: Reports and Deletion Requests
- Action buttons to approve/resolve items
- Real-time status updates

### 7. Comment System Features
- **Edit Count**: Tracks edits (max 3 allowed)
- **Deletion Timeline**: 2-hour delete window
- **Soft Delete**: `deleted_at` timestamp for logical deletion
- **Threading**: `parent_id` for reply relationships

### 8. User Rank System
- Auto-created on profile creation via trigger
- Determines admin access and posting limits
- Stored in `user_ranks` table

### 9. Posting Limits
- Default: 20 posts per 12-hour window
- Tracked via `post_limit_window` on posts
- Unlimited posts available for premium members
- Enforced via `user_settings.unlimited_posts` flag

## Database Design Decisions

### Why Separate Interaction Tables?
- Each like/view/favorite/repost is a separate row
- Allows efficient counting via `COUNT(*)` aggregation
- UNIQUE constraints prevent duplicate interactions
- Scales better than JSON arrays in posts table

### Why Soft Delete for Comments?
- `deleted_at` timestamp allows soft deletion
- Maintains referential integrity for reply chains
- Admins can undelete if needed
- Query: `WHERE deleted_at IS NULL`

### RLS Policies Strategy
- Views are public (anyone can see engagement metrics)
- Favorites are private (only user can see their saves)
- Reports require authentication but are readable by admins

## Performance Optimizations

1. **Image Handling**: External URLs only (no file uploads)
2. **Hashtag Indexing**: Array operations on text[] type
3. **View Tracking**: UNIQUE constraint prevents re-counting
4. **Pagination**: Implemented via `limit()` in queries
5. **N+1 Prevention**: Selects include profiles() joins

## Security Considerations

1. **Input Validation**:
   - Max 40 chars username
   - Max 300 chars description
   - Max 5 hashtags
   - Max 15 images

2. **Authorization**:
   - RLS policies on all tables
   - Admin features locked to Professional/Unique ranks
   - Users can only modify their own content

3. **No Secrets Exposed**:
   - All Supabase keys are environment variables
   - Client-side only uses ANON key (limited RLS policies)

## Common Workflows

### Liking a Post
```typescript
// Check existing like
const { data: existing } = await supabase
  .from('post_likes')
  .select()
  .eq('post_id', postId)
  .eq('user_id', user.id)
  .maybeSingle();

// Toggle
if (existing) {
  await supabase.from('post_likes').delete()...
} else {
  await supabase.from('post_likes').insert(...)
}

// Get count
const { count } = await supabase
  .from('post_likes')
  .select('*', { count: 'exact', head: true })
  .eq('post_id', postId);
```

### Reporting a Post
```typescript
await supabase.from('post_reports').insert({
  post_id: postId,
  reporter_id: user.id,
  reason: userReason,
  status: 'pending'
});
```

### Requesting Comment Deletion (After 2 Hours)
```typescript
const createdTime = new Date(comment.created_at);
const twoHoursLater = new Date(createdTime.getTime() + 2 * 60 * 60 * 1000);

if (new Date() > twoHoursLater) {
  await supabase.from('comment_deletion_requests').insert({
    comment_id: commentId,
    user_id: user.id,
    reason: userReason,
    status: 'pending'
  });
}
```

## Future Enhancements

1. **Notification System**: Real-time updates for likes/comments
2. **Message System**: Direct messaging between users
3. **Portfolio Pages**: Professional designer portfolios
4. **Collaboration**: Team projects and shared portfolios
5. **Payment Integration**: Stripe for designer services
6. **AI Moderation**: Automated content detection
7. **Trending**: Trending posts/hashtags algorithm
8. **Recommendations**: Personalized feed algorithm
