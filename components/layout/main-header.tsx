'use client';

export function MainHeader() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-background/80 backdrop-blur border-b border-border/40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col items-center gap-1">

        {/* الشعار */}
        <h1 className="text-xl font-bold text-white">
          استلهم
        </h1>

        {/* الوصف */}
        <p className="text-xs text-muted-foreground">
          استكشف التصاميم والإبداعات
        </p>

      </div>
    </header>
  );
}