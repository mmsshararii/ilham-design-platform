'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const finishAuth = async () => {
      await supabase.auth.getSession()
      router.replace('/')
    }

    finishAuth()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      جاري تأكيد البريد...
    </div>
  )
}