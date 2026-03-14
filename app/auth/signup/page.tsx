'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Check, X, Loader as Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [accountType, setAccountType] = useState<'designer' | 'seeker' | 'general'>('general');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUsername = async () => {
      if (username.length < 3) {
        setUsernameAvailable(null);
        return;
      }

      setCheckingUsername(true);

      const [reservedRes, existingRes] = await Promise.all([
        supabase.from('reserved_usernames').select('id').eq('username', username.toLowerCase()).maybeSingle(),
        supabase.from('profiles').select('id').eq('username', username.toLowerCase()).maybeSingle(),
      ]);

      const available = !reservedRes.data && !existingRes.data;
      setUsernameAvailable(available);
      setCheckingUsername(false);
    };

    const debounce = setTimeout(checkUsername, 500);
    return () => clearTimeout(debounce);
  }, [username]);

const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

// الحد الأقصى لطول اسم المستخدم
if (username.length > 25) {
  setError('اسم المستخدم يجب ألا يتجاوز 25 حرفاً');
  setLoading(false);
  return;
}

// السماح بالحروف الإنجليزية والأرقام والشرطة السفلية فقط
const usernameRegex = /^[a-zA-Z0-9_]+$/;

if (!usernameRegex.test(username)) {
  setError('اسم المستخدم يسمح بالحروف الإنجليزية والأرقام والشرطة السفلية فقط');
  setLoading(false);
  return;
}

  // التحقق هل الاسم محجوز
  const { data: reserved } = await supabase
    .from('reserved_usernames')
    .select('id')
    .eq('username', username.toLowerCase())
    .maybeSingle();

  if (reserved) {
    setError('اسم المستخدم غير متاح للتسجيل');
    setLoading(false);
    return;
  }

  // التحقق هل الاسم مستخدم
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username.toLowerCase())
    .maybeSingle();

  if (existing) {
    setError('اسم المستخدم غير متاح للتسجيل');
    setLoading(false);
    return;
  }

  // إرسال كود التحقق للبريد
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true
    }
  });

  if (error) {
    setError(error.message);
    setLoading(false);
    return;
  }

  // نقل المستخدم لصفحة إدخال الكود
  router.push(`/auth/verify?email=${encodeURIComponent(email)}`);

  setLoading(false);
};

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-900/20 to-background">
      <Card className="w-full max-w-md border-purple-500/20">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-purple rounded-2xl">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gradient">استلهم</CardTitle>
          <CardDescription className="text-base">
            انضم إلى منصة المصممين والمبدعين
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-right"
                placeholder="email@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="text-right"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">اسم المستخدم</Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  maxLength={25}
                  className="text-right pl-10"
                  placeholder="اسم المستخدم"
                />
                {username.length >= 3 && (
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    {checkingUsername ? (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : usernameAvailable === true ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : usernameAvailable === false ? (
                      <X className="h-4 w-4 text-red-500" />
                    ) : null}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between text-xs">
                <div>
                  {username.length >= 3 && !checkingUsername && usernameAvailable === true && (
                    <span className="text-green-500 flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      اسم المستخدم متاح
                    </span>
                  )}
                  {username.length >= 3 && !checkingUsername && usernameAvailable === false && (
                    <span className="text-red-500 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      اسم المستخدم غير متاح للتسجيل
                    </span>
                  )}
                </div>
                <span className="text-muted-foreground">
                  {username.length}/25 حرف
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>نوع الحساب</Label>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => setAccountType('designer')}
                  className={`p-4 rounded-lg border-2 transition-all text-right ${
                    accountType === 'designer'
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-border hover:border-purple-500/50'
                  }`}
                >
                  <div className="font-semibold">مصمم</div>
                  <div className="text-sm text-muted-foreground">
                    أعرض تصاميمي وخدماتي
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType('seeker')}
                  className={`p-4 rounded-lg border-2 transition-all text-right ${
                    accountType === 'seeker'
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-border hover:border-purple-500/50'
                  }`}
                >
                  <div className="font-semibold">باحث عن تصميم</div>
                  <div className="text-sm text-muted-foreground">
                    أبحث عن مصممين ومشاريع
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType('general')}
                  className={`p-4 rounded-lg border-2 transition-all text-right ${
                    accountType === 'general'
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-border hover:border-purple-500/50'
                  }`}
                >
                  <div className="font-semibold">حساب عام</div>
                  <div className="text-sm text-muted-foreground">
                    للتصفح والمتابعة
                  </div>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full gradient-purple hover:opacity-90"
            >
              {loading ? 'جاري الإنشاء...' : 'إنشاء حساب'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              لديك حساب بالفعل؟{' '}
              <Link href="/auth/login" className="text-purple-400 hover:text-purple-300">
                تسجيل الدخول
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
