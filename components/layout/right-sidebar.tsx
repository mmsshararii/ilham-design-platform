export function RightSidebar() {
  return (
    <div className="space-y-4">

      {/* زر إنشاء منشور */}
      <button className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:opacity-90 transition">
        إنشاء منشور
      </button>

      {/* كرت القائمة */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">

        <div className="flex items-center justify-between text-sm text-white">
          <span>الرئيسية</span>
          <span>🏠</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-400 hover:text-white cursor-pointer">
          <span>ملفي الشخصي</span>
          <span>👤</span>
        </div>

      </div>

      {/* كرت الهاشتاقات */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">

        <h3 className="text-sm text-gray-300 mb-3">الهاشتاقات الأكثر تداول</h3>

        <div className="space-y-2 text-sm">

          <div className="flex justify-between text-purple-400">
            <span>#تصميم_شعارات</span>
            <span className="text-gray-500">2.5k</span>
          </div>

          <div className="flex justify-between text-purple-400">
            <span>#هوية_بصرية</span>
            <span className="text-gray-500">1.8k</span>
          </div>

          <div className="flex justify-between text-purple-400">
            <span>#تصميم_واجهات</span>
            <span className="text-gray-500">1.5k</span>
          </div>

          <div className="flex justify-between text-purple-400">
            <span>#موشن_جرافيك</span>
            <span className="text-gray-500">1.2k</span>
          </div>

        </div>

      </div>

    </div>
  );
}