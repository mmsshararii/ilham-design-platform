# استلهم (Ilham) - Platform Features

## Core Features Implemented

### 1. Authentication & User Management
- Email/password signup and login
- Three account types: Designer, Design Seeker, General Account
- User profiles with:
  - Username (max 40 characters)
  - Avatar image
  - Banner image
  - Bio section
  - Social media links

### 2. Feed & Discovery
- **Homepage Feed**: Displays all posts chronologically
- **Search**: Multi-tab search for posts, designers, and hashtags
- **Hashtag Pages**: Click any hashtag to view all posts with that tag
- **Favorites**: Save posts to personal favorites dashboard
- **Mobile-First**: Fully responsive design optimized for mobile devices

### 3. Post System
- **Post Types**:
  - تصميمي (My Design)
  - عرض تصميم (Design Offer)
  - طلب تصميم (Design Request)
  - منشور عام (General Post)

- **Post Content**:
  - Text description (max 300 characters)
  - Up to 5 hashtags
  - Up to 15 images (first image as main preview, others as thumbnail grid)
  - 15% smaller image sizes for compact feed

- **Post Interactions**:
  - Likes counter
  - Comments counter
  - Reposts counter
  - View counter
  - Save to favorites
  - Share post button
  - Post menu with options (report, block, mute, add to custom list, follow)

### 4. Comments System
- **Threading**: Main comments with replies
- **Editing**: Users can edit comments up to 3 times
- **Deletion Rules**:
  - Delete within 2 hours without approval
  - After 2 hours: request deletion with reason (admin approval required)
- **Deletion Requests**: Admin dashboard to manage requests

### 5. User Interactions
- **Following System**: Follow/unfollow other users
- **Blocking**: Block users (blocks appear in user settings)
- **Muting**: Mute users to hide their content
- **Custom Lists**: Create custom lists and add users to them

### 6. Membership & Rank System
Membership Ranks:
- **Member**: Default rank for all users
- **Distinguished Member**: Active community participant
- **Creative**: Professional designer/creator
- **Professional**: High-quality contributor (gets admin/mod access)
- **Unique**: Elite creator status (gets admin/mod access)

### 7. Post Limitations
- **Default**: 20 posts per 12-hour window
- **Unlimited**: Available for premium members

### 8. Moderation System

**Admin/Moderator Dashboard** (for Professional & Unique ranks):
- **Report Management**: Review and resolve post reports
  - View pending reports
  - Mark as reviewed
  - Resolve issues
- **Comment Management**: Approve/reject comment deletion requests
  - View pending deletion requests
  - Approve deletions
  - Reject deletions
- **User Moderation**: Manage user actions
- **Content Moderation**: Control inappropriate content

### 9. Design & UX
- **Language**: Arabic (RTL)
- **Theme**: Dark mode with purple accent color
- **Font**: Cairo (Google Fonts)
- **Layout**: Mobile-first responsive design
- **Components**: Built with shadcn/ui and Tailwind CSS

## Database Tables

### Core Tables
- `profiles`: User profiles with metadata
- `posts`: All published posts
- `comments`: Comments and replies on posts

### Interaction Tables
- `post_likes`: Like tracking
- `post_favorites`: Saved posts
- `post_views`: View tracking
- `post_reposts`: Repost tracking

### Social Tables
- `user_follows`: Follow relationships
- `user_blocks`: Block relationships
- `user_mutes`: Mute relationships
- `custom_lists`: User-created lists
- `list_members`: List membership

### Moderation Tables
- `post_reports`: Post reports
- `comment_deletion_requests`: Deletion requests
- `user_ranks`: User membership ranks
- `user_settings`: Per-user settings (post limits, etc.)

## Pages
- `/` - Homepage feed
- `/auth/login` - Login page
- `/auth/signup` - Signup with account type selection
- `/post/create` - Create new post
- `/post/[id]` - Post detail with comments
- `/profile/[username]` - User profile
- `/search` - Multi-tab search
- `/hashtag/[tag]` - Posts with specific hashtag
- `/favorites` - Saved posts
- `/admin/dashboard` - Admin/mod panel

## Routing
All user routes are protected - non-authenticated users are redirected to login.

## Security
- Row Level Security (RLS) enabled on all tables
- Policies ensure users can only access their own data
- Admin-only features protected by rank system
- All user inputs validated and sanitized
