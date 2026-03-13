import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { decodeId } from "@/lib/short-id";

export default async function Page({ params }: any) {

  const code = params.id;

  const shortId = decodeId(code);

  const { data } = await supabase
    .from("posts")
    .select("id")
    .eq("short_id", shortId)
    .limit(1);

  const post = data?.[0];

  if (!post) {
    return <div style={{ padding: 40 }}>رابط غير صالح</div>;
  }

  redirect(`/post/${post.id}`);
}