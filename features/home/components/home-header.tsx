'use client';

import { Search, Bell, Flame, Users } from 'lucide-react';

export function HomeHeader() {
  return (
    <div className="fixed top-0 right-0 left-0 h-16 border-b border-border/40 bg-background/80 backdrop-blur z-50">

      <div className="max-w-7xl mx-auto h-full flex items-center gap-6 px-4">

        {/* 1️⃣ اللوقو */}
        <div className="font-bold text-xl whitespace-nowrap">
          استلهم
        </div>

        {/* 2️⃣ البحث */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

            <input
              type="text"
              placeholder="ابحث عن أي شيء..."
              className="w-full pr-10 pl-4 py-2 rounded-md bg-white/5 border border-border/40 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* 3️⃣ الترند */}
        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition whitespace-nowrap">
          <Flame className="w-4 h-4" />
          الترند
        </button>

        {/* 4️⃣ المتابعين */}
        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition whitespace-nowrap">
          <Users className="w-4 h-4" />
          المتابعين
        </button>

        {/* 5️⃣ الاشعارات */}
        <button className="relative text-muted-foreground hover:text-foreground transition">
          <Bell className="w-5 h-5" />

          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* 6️⃣ اسم المستخدم */}
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          محمد
        </div>

        {/* 7️⃣ الصورة المستطيلة */}
        <div className="w-14 h-8 rounded-md bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold">
          IMG
        </div>

      </div>

    </div>
  );
}