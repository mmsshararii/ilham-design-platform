'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormAlert } from '@/components/ui/form-alert';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      setLoading(false);
      return;
    }

    router.push('/');
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
            مرحباً بك مجدداً في منصة المصممين
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
                className="text-right"
                placeholder="••••••••"
              />
            </div>

            {error && <FormAlert type="error" message={error} />}

            <Button
              type="submit"
              disabled={loading}
              className="w-full gradient-purple hover:opacity-90"
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>

            <div className="flex flex-col gap-2">
              <Link
                href="/auth/forgot-password"
                className="text-center text-sm text-purple-400 hover:text-purple-300"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            <div className="pt-4 border-t border-border space-y-2">
              <p className="text-center text-sm text-muted-foreground">
                ليس لديك حساب؟{' '}
                <Link href="/auth/signup" className="text-purple-400 hover:text-purple-300">
                  إنشاء حساب جديد
                </Link>
              </p>

              <div className="flex justify-center gap-4 text-xs text-muted-foreground">
                <Link href="/support" className="hover:text-purple-400">
                  الدعم والمساعدة
                </Link>
                <span>•</span>
                <Link href="/platform-news" className="hover:text-purple-400">
                  أخبار المنصة
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
