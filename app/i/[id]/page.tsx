'use client'

import { useParams } from 'next/navigation'
import { decodeId } from '@/lib/short-id'
import PostDetailPage from '@/app/post/[id]/page'

export default function ShortPostPage() {

  const params = useParams()
  const code = params.id as string
  const number = decodeId(code.replace('i',''))

  return <PostDetailPage id={number} />

}