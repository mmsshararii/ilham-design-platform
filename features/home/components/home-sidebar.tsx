'use client';

export function HomeSidebar() {
  return (
    <aside className="fixed right-0 top-16 w-72 h-full border-l bg-background p-4 flex flex-col justify-between">

      <div className="space-y-4">
        <button className="w-full text-right">➕ إنشاء منشور</button>
        <button className="w-full text-right">👤 ملفي الشخصي</button>
      </div>

      <div>
        <button className="text-red-500 w-full text-right">
          تسجيل الخروج
        </button>
      </div>

    </aside>
  );
}