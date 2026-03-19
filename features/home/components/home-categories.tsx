'use client';

export function HomeCategories() {
  const tabs = ['مخصص', 'منشورات عامة', 'تصاميم', 'طلبات', 'عروض', 'ملحقات'];

  return (
    <div className="sticky top-[104px] z-40 border-b bg-background">

      <div className="max-w-2xl mx-auto flex gap-4 overflow-x-auto px-4">

        {tabs.map((tab) => (
          <button
            key={tab}
            className="py-3 whitespace-nowrap text-sm text-muted-foreground hover:text-foreground"
          >
            {tab}
          </button>
        ))}

      </div>

    </div>
  );
}