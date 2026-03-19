'use client';

export function HomeHeader() {
  return (
    <div className="fixed top-0 right-0 left-0 h-16 border-b bg-background z-50 flex items-center justify-between px-6">

      {/* اللوقو */}
      <div className="font-bold text-xl">
        استلهم
      </div>

      {/* الترند */}
      <div className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
        الترند ↗
      </div>

    </div>
  );
}