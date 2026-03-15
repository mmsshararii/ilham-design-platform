'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormAlert } from '@/components/ui/form-alert';
import { ArrowRight, Loader as Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function EditProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [lastUsernameChange, setLastUsernameChange] = useState<string | null>(null);
  const [canChangeUsername, setCanChangeUsername] = useState(true);
  const [daysUntilChange, setDaysUntilChange] = useState(0);
  const [socialLinks, setSocialLinks] = useState<
  { platform: string; url: string }[]
>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
  if (user && loading) {
    fetchProfile();
  }
}, [user, loading]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user!.id)
      .maybeSingle();

    if (data) {
      setUsername(data.username || '');
      setDisplayName(data.display_name || '');
      setBio(data.bio || '');
      setAvatarUrl(data.avatar_url || '');
      setBannerUrl(data.banner_url || '');
      setWelcomeMessage(data.welcome_message || '');
      setLastUsernameChange(data.last_username_change || null);

      if (data.last_username_change) {
        const lastChange = new Date(data.last_username_change);
        const now = new Date();
        const daysSinceChange = Math.floor((now.getTime() - lastChange.getTime()) / (1000 * 60 * 60 * 24));
        const daysRemaining = 60 - daysSinceChange;

        if (daysRemaining > 0) {
          setCanChangeUsername(false);
          setDaysUntilChange(daysRemaining);
        }
      }

      if (data.social_links && Array.isArray(data.social_links)) {
  setSocialLinks(data.social_links);
}
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const trimmedUsername = username.trim().toLowerCase();

    if (trimmedUsername.length < 3 || trimmedUsername.length > 40) {
      setError('يجب أن يكون اسم المستخدم بين 3 و 40 حرفاً');
      setSaving(false);
      return;
    }

    if (!/^[a-z0-9_]+$/.test(trimmedUsername)) {
      setError('اسم المستخدم يجب أن يحتوي على أحرف إنجليزية صغيرة وأرقام و _ فقط');
      setSaving(false);
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user!.id)
      .maybeSingle();

    const usernameChanged = profile && trimmedUsername !== profile.username;

    if (usernameChanged && !canChangeUsername) {
      setError(`لا يمكن تغيير اسم المستخدم. يجب الانتظار ${daysUntilChange} يوم`);
      setSaving(false);
      return;
    }

    if (usernameChanged) {
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', trimmedUsername)
        .maybeSingle();

      if (existingUser) {
        setError('اسم المستخدم مستخدم بالفعل');
        setSaving(false);
        return;
      }

      const { data: reservedUsername } = await supabase
        .from('reserved_usernames')
        .select('id')
        .eq('username', trimmedUsername)
        .maybeSingle();

      if (reservedUsername) {
        setError('اسم المستخدم محجوز ولا يمكن استخدامه');
        setSaving(false);
        return;
      }
    }
// منع الروابط في النبذة ورسالة الترحيب
const containsLink = (text: string) => {
  const urlPattern = /(https?:\/\/|www\.|\.com|\.net|\.org|\.io)/i;
  return urlPattern.test(text);
};

if (containsLink(bio) || containsLink(welcomeMessage)) {
  setError('لا يسمح بإضافة روابط في النبذة أو رسالة الترحيب');
  setSaving(false);
  return;
}
    const updates: any = {
      display_name: displayName.trim() || null,
      bio: bio.trim() || null,
      avatar_url: avatarUrl.trim() || null,
      banner_url: bannerUrl.trim() || null,
      welcome_message: welcomeMessage.trim() || null,
      social_links: socialLinks
  .filter((l) => l.url.trim() !== '')
  .map((l) => ({
    platform: l.platform,
    url: l.url.trim(),
  })),
      updated_at: new Date().toISOString(),
    };

    if (usernameChanged) {
      updates.username = trimmedUsername;
      updates.last_username_change = new Date().toISOString();
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user!.id);

    if (error) {
      setError('حدث خطأ أثناء حفظ التعديلات');
    } else {
      toast.success('تم حفظ التعديلات بنجاح');
      router.push(`/profile/${trimmedUsername}`);
    }

    setSaving(false);
  };

  if (authLoading || !user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-2xl mx-auto p-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">تعديل الملف الشخصي</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                رجوع
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">اسم المستخدم</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  placeholder="username123"
                  className="text-left"
                  maxLength={40}
                  disabled={!canChangeUsername}
                />
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    أحرف إنجليزية صغيرة وأرقام و _ فقط (3-40 حرف)
                  </p>
                  {!canChangeUsername && (
                    <p className="text-xs text-amber-500">
                      ⚠️ لا يمكن تغيير اسم المستخدم. يجب الانتظار {daysUntilChange} يوم
                    </p>
                  )}
                  {canChangeUsername && lastUsernameChange && (
                    <p className="text-xs text-green-500">
                      ✓ يمكنك تغيير اسم المستخدم الآن (آخر تغيير كان منذ أكثر من 60 يوم)
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">الاسم المعروض (عربي اختياري)</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="الاسم بالعربية"
                  className="text-right"
                  maxLength={50}
                />
                <p className="text-xs text-muted-foreground">
                  سيظهر هذا الاسم بجانب اسم المستخدم في المنشورات والتعليقات
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">نبذة عنك</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="اكتب نبذة مختصرة عنك..."
                  className="text-right resize-none"
                  rows={4}
                  maxLength={200}
                />
                <p className="text-xs text-amber-500">
لا يسمح بإضافة روابط في النبذة
</p>
                <p className="text-xs text-muted-foreground text-left">
                  {bio.length}/200 حرف
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="welcomeMessage">رسالة الترحيب</Label>
                <Textarea
                  id="welcomeMessage"
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  placeholder="رسالة ترحيبية تظهر في ملفك الشخصي..."
                  className="text-right resize-none"
                  rows={3}
                  maxLength={150}
                />
                <p className="text-xs text-amber-500">
لا يسمح بإضافة روابط في رسالة الترحيب
</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatarUrl">رابط الصورة الشخصية</Label>
                <Input
                  id="avatarUrl"
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bannerUrl">رابط صورة الغلاف</Label>
                <Input
                  id="bannerUrl"
                  type="url"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  placeholder="https://example.com/banner.jpg"
                  className="text-right"
                />
              </div>

<div className="space-y-4 p-4 border border-border rounded-lg">
  <h3 className="font-semibold">روابط التواصل الاجتماعي</h3>

  {socialLinks.map((link, index) => (
    <div key={index} className="flex gap-2">
      <select
        value={link.platform}
        onChange={(e) => {
          const updated = [...socialLinks];
          updated[index].platform = e.target.value;
          setSocialLinks(updated);
        }}
        className="border rounded-md px-2 bg-background"
      >
        <option value="twitter">Twitter / X</option>
        <option value="instagram">Instagram</option>
        <option value="behance">Behance</option>
        <option value="dribbble">Dribbble</option>
        <option value="linkedin">LinkedIn</option>
        <option value="youtube">YouTube</option>
        <option value="github">GitHub</option>
        <option value="website">Website</option>
      </select>

      <Input
        type="url"
        value={link.url}
        placeholder="https://..."
        onChange={(e) => {
          const updated = [...socialLinks];
          updated[index].url = e.target.value;
          setSocialLinks(updated);
        }}
        className="flex-1 text-right"
      />

      <Button
        type="button"
        variant="ghost"
        onClick={() => {
          setSocialLinks(socialLinks.filter((_, i) => i !== index));
        }}
      >
        حذف
      </Button>
    </div>
  ))}

  <Button
    type="button"
    variant="outline"
    onClick={() =>
      setSocialLinks([...socialLinks, { platform: 'twitter', url: '' }])
    }
  >
    + إضافة حساب
  </Button>
</div>

              {error && <FormAlert type="error" message={error} />}
              {success && <FormAlert type="success" message={success} />}

              <Button
                type="submit"
                disabled={saving}
                className="w-full gradient-purple"
              >
                {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
