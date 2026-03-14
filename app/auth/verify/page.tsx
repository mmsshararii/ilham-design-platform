'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function VerifyPage() {

  const params = useSearchParams();
  const router = useRouter();
  const email = params.get('email') || '';

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

const handleVerify = async () => {

  setLoading(true);
  setError('');

  const { error } = await supabase.auth.verifyOtp({
    email,
    token: code,
    type: 'email'
  });

  if (error) {
    setError('الكود غير صحيح');
    setLoading(false);
    return;
  }

  // تسجيل الخروج مباشرة بعد التحقق
  await supabase.auth.signOut();

  // تحويل المستخدم إلى صفحة تسجيل الدخول
  router.push('/auth/login');
};

  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="w-full max-w-sm space-y-4">

        <h2 className="text-xl font-bold text-center">
          أدخل كود التحقق
        </h2>

        <Input
          placeholder="123456"
          value={code}
          onChange={(e)=>setCode(e.target.value)}
        />

        {error && (
          <p className="text-red-500 text-sm text-center">
            {error}
          </p>
        )}

        <Button
          onClick={handleVerify}
          disabled={loading}
          className="w-full"
        >
          تأكيد
        </Button>

      </div>

    </div>
  );
}