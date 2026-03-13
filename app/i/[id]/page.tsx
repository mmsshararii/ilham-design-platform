'use client';

import { decodeId } from '@/lib/short-id';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase, Post } from '@/lib/supabase';
import { Navbar } from '@/components/navbar';
import { PostCard } from '@/components/post-card';
import { Loader2 } from "lucide-react";

export default function ShortPostPage() {

  const params = useParams();
  const code = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadPost = async () => {

      const shortId = decodeId(code);

      const { data } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (*)
        `)
        .eq('short_id', shortId)
        .maybeSingle();

      if (data) {
        setPost(data);
      }

      setLoading(false);
    };

    loadPost();

  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!post) {
    return <div style={{padding:40}}>المنشور غير موجود</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-2xl mx-auto p-4">
        <PostCard post={post} />
      </main>
    </div>
  );
}