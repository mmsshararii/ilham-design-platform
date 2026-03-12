
'use client'

import { useParams, redirect } from 'next/navigation'
import { decodeId } from '@/lib/short-id'
import { supabase } from '@/lib/supabase'

export default async function ShortLinkPage() {

  const params = useParams()
  const code = params.id as string

  const number = decodeId(code)

  const { data } = await supabase
    .from('posts')
    .select('id')
    .eq('short_id', number)
    .single()

  if (!data) {
    redirect('/')
  }

  redirect(`/post/${data.id}`)
}
