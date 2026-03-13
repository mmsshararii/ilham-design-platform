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
    const { data, error } = await supabase
      .from("posts")
      .select("id")
      .eq("short_id", shortId)
      .single();

    if (error || !data) {
      return (
        <div style={{ padding: 40 }}>
          المنشور غير موجود
        </div>
      );
    }

    // تحويل المستخدم إلى صفحة المنشور الحقيقية
    redirect(`/post/${data.id}`);
  } catch (e) {
    return (
      <div style={{ padding: 40 }}>
        رابط غير صالح
      </div>
    );
  }
}