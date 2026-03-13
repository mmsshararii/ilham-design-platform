'use client';

import { decodeId } from '@/lib/short-id';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PostDetail from '@/components/post-detail';
import { Loader2 } from 'lucide-react';

export default function ShortPostPage() {

  const params = useParams();
  const code = params.id as string;

  const [postId, setPostId] = useState<string | null>(null);

  useEffect(() => {

    const load = async () => {

      const shortId = decodeId(code);

      const { data } = await supabase
        .from('posts')
        .select('id')
        .eq('short_id', shortId)
        .maybeSingle();

      if (data?.id) setPostId(data.id);

    };

    load();

  }, [code]);

  if (!postId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
      </div>
    );
  }

  return <PostDetail postId={postId} />;
}