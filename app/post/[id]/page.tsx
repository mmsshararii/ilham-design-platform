import PostDetail from '@/components/post-detail';

export default function Page({ params }: { params: { id: string } }) {
  return <PostDetail postId={params.id} />;
}