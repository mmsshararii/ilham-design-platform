import { supabase } from '@/lib/supabase'

export interface FeedParams {
  limit?: number
  cursor?: string | null
}

export async function getFeed({ limit = 10, cursor = null }: FeedParams) {
  let query = supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (cursor) {
    query = query.lt('created_at', cursor)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  return data
}