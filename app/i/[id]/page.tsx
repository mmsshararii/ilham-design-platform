'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { decodeId } from '@/lib/short-id'
import { supabase } from '@/lib/supabase'

export default function ShortPostPage() {

  const params = useParams()
  const router = useRouter()

  useEffect(() => {

    const load = async () => {

      const code = params.id as string
      const shortId = decodeId(code)

      const { data } = await supabase
        .from('posts')
        .select('id')
        .eq('short_id', shortId)
        .single()

      if (data) {
        router.replace(`/post/${data.id}`)
      }

    }

    load()

  }, [])

  return (
    <div style={{padding:40}}>
      جاري فتح المنشور...
    </div>
  )

}