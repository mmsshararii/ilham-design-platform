'use client';

import { decodeId } from '@/lib/short-id';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase, Post } from '@/lib/supabase';
import PostDetailPage from '@/app/post/[id]/page';

export default function ShortPostPage() {

  const params = useParams();
  const code = params.id as string;

  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {

    const loadPost = async () => {

      const shortId = decodeId(code);

      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('short_id', shortId)
        .maybeSingle();

      if (data) {
        setPost(data);
      }

    };

    loadPost();

  }, [code]);

  if (!post) {
    return <div style={{ padding: 40 }}>جاري التحميل...</div>;
  }

  return <PostDetailPage postId={post.id} />;
}