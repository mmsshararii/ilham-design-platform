'use client';

import { decodeId } from '@/lib/short-id';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PostDetailPage from '@/app/post/[id]/page';
import { Loader2 } from "lucide-react";

export default function ShortPostPage() {

  const params = useParams();
  const code = params.id as string;

  const [postId, setPostId] = useState<string | null>(null);

  useEffect(() => {

    const loadPost = async () => {

      const shortId = decodeId(code);

      const { data } = await supabase
        .from('posts')
        .select('id')
        .eq('short_id', shortId)
        .maybeSingle();

      if (data) {
        setPostId(data.id);
      }

    };

    loadPost();

  }, [code]);

  if (!postId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
      </div>
    );
  }

  return <PostDetailPage params={{ id: postId }} />;
}