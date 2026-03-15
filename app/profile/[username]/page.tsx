'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase, Profile } from '@/lib/supabase';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowRight, Loader as Loader2, CreditCard as Edit2, UserPlus, UserMinus } from 'lucide-react';
import { socialPlatforms } from "@/lib/social-platforms";
export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const isOwnProfile = user && profile && user.id === profile.id;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && username) {
      fetchProfile();
    }
  }, [user, username]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    if (data) {
      setProfile(data);
      checkFollowStatus(data.id);
    }
    setLoading(false);
  };

  const checkFollowStatus = async (profileId: string) => {
    if (!user) return;

    const { data } = await supabase
      .from('user_follows')
      .select('id')
      .eq('follower_id', user.id)
      .eq('following_id', profileId)
      .maybeSingle();

    setIsFollowing(!!data);
  };

  const handleFollow = async () => {
    if (!user || !profile) return;

    setFollowLoading(true);

    if (isFollowing) {
      await supabase
        .from('user_follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', profile.id);

      setIsFollowing(false);
    } else {
      await supabase.from('user_follows').insert({
        follower_id: user.id,
        following_id: profile.id,
      });

      await supabase.from('notifications').insert({
        user_id: profile.id,
        type: 'follow',
        content: `بدأ ${user.email} بمتابعتك`,
        related_id: user.id,
      });

      setIsFollowing(true);
    }

    setFollowLoading(false);
  };


  if (authLoading || !user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-2xl mx-auto p-4 text-center">
          <p className="text-muted-foreground">المستخدم غير موجود</p>
        </div>
      </div>
    );
  }

  const accountTypeLabels = {
    designer: 'مصمم',
    seeker: 'باحث عن تصميم',
    general: 'حساب عام',
  };

  const socialLabels: Record<string, string> = {
    twitter: 'تويتر',
    instagram: 'إنستغرام',
    behance: 'بيهانس',
    dribbble: 'دريبل',
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-3xl mx-auto">
        <Card className="rounded-none border-0 border-b">
          {/* Section 1 - Banner */}
          <div className="h-48 sm:h-64 bg-gradient-to-r from-blue-500/20 via-teal-500/20 to-emerald-500/20 overflow-hidden">
            {profile.banner_url ? (
              <img
                src={profile.banner_url}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500/10 via-teal-500/10 to-emerald-500/10" />
            )}
          </div>

          <CardContent className="pt-0 pb-8">
            {/* Section 2 - Avatar and Identity */}
            <div className="flex flex-col items-center -mt-16 sm:-mt-20 relative z-10">
              <Avatar className="h-32 w-32 sm:h-40 sm:w-40 border-4 border-background shadow-xl ring-2 ring-blue-500/20">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-white text-4xl font-bold">
                  {(profile.display_name || profile.username)[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="mt-4 text-center space-y-1">
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                  {profile.display_name || profile.username}
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground">
                  @{profile.username}
                </p>
                <p className="text-sm sm:text-base text-blue-500 font-medium">
                  {accountTypeLabels[profile.account_type as keyof typeof accountTypeLabels]}
                </p>
              </div>
            </div>

            {/* Section 3 - Action Button */}
            <div className="mt-6 flex justify-center">
              {isOwnProfile ? (
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 px-8 border-2 hover:border-blue-500 hover:bg-blue-500/10"
                  onClick={() => router.push('/profile/edit')}
                >
                  <Edit2 className="h-5 w-5" />
                  تعديل الملف الشخصي
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={handleFollow}
                  disabled={followLoading}
                  className={isFollowing
                    ? 'px-8 bg-muted text-foreground hover:bg-muted/80 border-2 border-border'
                    : 'px-8 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white border-0'
                  }
                >
                  {isFollowing ? (
                    <>
                      <UserMinus className="h-5 w-5 ml-2" />
                      إلغاء المتابعة
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-5 w-5 ml-2" />
                      متابعة
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Section 4 - Welcome Message */}
            {profile.welcome_message && (
              <div className="mt-8 px-4 sm:px-8">
                <div className="bg-gradient-to-r from-blue-500/5 via-teal-500/5 to-emerald-500/5 border border-blue-500/20 rounded-lg p-6 text-center">
                  <p className="text-lg sm:text-xl text-foreground/90 leading-relaxed font-medium">
                    {profile.welcome_message}
                  </p>
                </div>
              </div>
            )}

            {/* Section 5 - Bio Section */}
            {profile.bio && (
              <div className="mt-8 px-4 sm:px-8">
                <div className="space-y-2">
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    نبذة عني
                  </h2>
                  <p className="text-base sm:text-lg leading-relaxed text-foreground">
                    {profile.bio}
                  </p>
                </div>
              </div>
            )}

            {/* Section 6 - Social Links */}
{Array.isArray(profile.social_links) && profile.social_links.length > 0 && (
  <div className="mt-8 px-4 sm:px-8">
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        روابط التواصل
      </h2>

      <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
        {profile.social_links.map((link: any, index: number) => {

          const platform = socialPlatforms[link.platform as keyof typeof socialPlatforms];
          const Icon = platform?.icon;

          return (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-white text-blue-500 hover:bg-gray-100 rounded-full border border-gray-300 transition-all duration-200 hover:scale-105"
            >
              {Icon && <Icon className="h-4 w-4" />}
              {platform?.label || link.platform}
            </a>
          );
        })}
      </div>
    </div>
  </div>
)}

            {/* Section 7 - Extended Introduction (using bio as extended info if available) */}
            {profile.bio && profile.bio.length > 100 && (
              <div className="mt-8 px-4 sm:px-8">
                <div className="border-t border-border pt-6">
                  <div className="prose prose-lg max-w-none dark:prose-invert">
                    <div className="bg-muted/30 rounded-lg p-6 border border-border">
                      <h2 className="text-xl font-bold mb-4 text-foreground">عن المصمم</h2>
                      <p className="text-base leading-relaxed text-foreground/80 whitespace-pre-wrap">
                        {profile.bio}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
