'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { CirclePlus } from 'lucide-react';

export function FABCreatePost() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push('/post/create')}
      className="fixed bottom-6 left-6 sm:hidden h-14 w-14 rounded-full shadow-lg gradient-purple p-0"
      aria-label="إنشاء منشور جديد"
    >
      <CirclePlus className="h-6 w-6" />
    </Button>
  );
}
