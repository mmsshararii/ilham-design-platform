export function RightSidebar() {
  return (
    <div className="space-y-4">

      <button className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500">
        إنشاء منشور
      </button>

      <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
        <p className="text-sm text-gray-300">الرئيسية</p>
        <p className="text-sm text-gray-300 mt-2">ملفي الشخصي</p>
      </div>

      <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
        <p className="text-sm text-gray-400">الهاشتاقات</p>
      </div>

    </div>
  );
}