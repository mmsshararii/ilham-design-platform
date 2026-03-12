import { redirect } from 'next/navigation'
import { decodeId } from '@/lib/short-id'
import { supabase } from '@/lib/supabase'

export default async function Page({ params }: { params: { id: string } }) {

  const number = decodeId(params.id)

  const { data } = await supabase
    .from('posts')
    .select('id')
    .eq('short_id', number)
    .single()

  if (!data) redirect('/')

  redirect(`/post/${data.id}`)
}
