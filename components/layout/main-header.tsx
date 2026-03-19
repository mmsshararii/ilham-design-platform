'use client';

export function MainHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">

        {/* RIGHT: Logo + Text */}
        <div className="flex flex-col items-start">
          <span className="text-lg font-bold">استلهم</span>
          <span className="text-xs text-muted-foreground">
            استكشف التصاميم والإبداعات
          </span>
        </div>

        {/* LEFT: Trend */}
        <div className="flex items-center gap-4">
          <button className="text-sm text-muted-foreground hover:text-foreground">
            الترند ↗
          </button>
        </div>

      </div>
    </header>
  );
}