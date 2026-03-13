import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { decodeId } from "@/lib/short-id";

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const short = params.id;

  try {
    // فك الترميز من الرابط
    const shortId = decodeId(short);

    // البحث عن المنشور
const { data } = await supabase
  .from("posts")
  .select("id")
  .eq("short_id", shortId)
  .limit(1);

const post = data?.[0];

if (!post) {
  return (
    <div style={{ padding: 40 }}>
      المنشور غير موجود
    </div>
  );
}

    // تحويل المستخدم إلى صفحة المنشور الحقيقية
    redirect(`/post/${post.id}`);
  } catch (e) {
    return (
      <div style={{ padding: 40 }}>
        رابط غير صالح
      </div>
    );
  }
}