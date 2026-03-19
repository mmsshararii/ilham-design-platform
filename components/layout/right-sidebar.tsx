export function RightSidebar() {
  return (
    <div className="space-y-4">

      <button className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white">
        إنشاء منشور
      </button>

      <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-2">
        <p>الرئيسية</p>
        <p>ملفي الشخصي</p>
        <p>المصممين</p>
        <p>تسجيل خروج</p>
      </div>

    </div>
  );
}