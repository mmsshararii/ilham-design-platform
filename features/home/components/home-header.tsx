export function HomeHeader() {
  return (
    <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">

      {/* يمين */}
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-semibold">استلهم</h1>

        <nav className="flex gap-4 text-sm text-gray-400">
          <span className="hover:text-white cursor-pointer">مخصص</span>
          <span className="hover:text-white cursor-pointer">منشورات عامة</span>
          <span className="hover:text-white cursor-pointer">تصاميم</span>
          <span className="hover:text-white cursor-pointer">طلبات</span>
        </nav>
      </div>

      {/* يسار */}
      <div className="flex items-center gap-4">

        {/* بحث */}
        <input
          placeholder="ابحث عن أي شيء..."
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 w-[260px] text-sm outline-none"
        />

        {/* إشعارات */}
        <div className="relative cursor-pointer">
          🔔
          <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] px-1 rounded-full">
            2
          </span>
        </div>

        {/* المستخدم */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
          <span className="text-sm">محمد</span>
        </div>

      </div>
    </div>
  );
}