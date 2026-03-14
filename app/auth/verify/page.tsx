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
  const [success, setSuccess] = useState(false);

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

  // تسجيل الخروج
  await supabase.auth.signOut();

  // إظهار رسالة النجاح
  setSuccess(true);

  // الانتظار قليلاً ثم تحويل المستخدم
  setTimeout(() => {
    router.push('/auth/login');
  }, 1500);
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
{success && (
  <p className="text-green-500 text-sm text-center">
    تم تفعيل الحساب بنجاح
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