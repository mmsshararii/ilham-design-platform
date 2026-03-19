export function HomeHeader() {
  return (
    <header className="border-b border-white/10 bg-[#06070a]">

      <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">

        {/* يمين (الشعار + الاسم) */}
        <div className="flex items-center gap-3">

          {/* لوقو */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center font-bold">
            IMG
          </div>

          {/* الاسم */}
          <span className="text-lg font-semibold">محمد</span>

        </div>

        {/* الوسط (بحث) */}
        <div className="flex-1 flex justify-center">

          <input
            placeholder="ابحث عن أي شيء..."
            className="w-full max-w-[420px] bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-500 transition"
          />

        </div>

        {/* اليسار (إشعارات + أيقونات) */}
        <div className="flex items-center gap-5">

          {/* ترند */}
          <span className="text-gray-400 hover:text-white cursor-pointer text-sm">
            الترند
          </span>

          {/* المتابعين */}
          <span className="text-gray-400 hover:text-white cursor-pointer text-sm">
            المتابعين
          </span>

          {/* إشعارات */}
          <div className="relative cursor-pointer">
            🔔
            <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] px-1 rounded-full">
              2
            </span>
          </div>

        </div>

      </div>

    </header>
  );
}