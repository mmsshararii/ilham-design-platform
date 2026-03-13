'use client'

import { decodeId } from '@/lib/short-id'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2 } from "lucide-react"

export default function ShortPostPage() {

  const params = useParams()
  const router = useRouter()
  const code = params.id as string

  useEffect(() => {

    const loadPost = async () => {

      const shortId = decodeId(code)

      const { data } = await supabase
        .from('posts')
        .select('id')
        .eq('short_id', shortId)
        .maybeSingle()

      if (data?.id) {
        console.log("SHORT CODE:", code)
        console.log("POST UUID:", data?.id)
        router.push(`/post/${data.id}`)
      }

    }

    loadPost()

  }, [code, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
    </div>
  )
}