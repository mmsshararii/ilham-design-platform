export function HomeCategories() {
  const tabs = ['مخصص', 'منشورات عامة', 'تصاميم', 'طلبات'];

  return (
    <div className="flex gap-4 border-b border-white/10 pb-2">
      {tabs.map((tab) => (
        <button key={tab} className="text-sm text-gray-400 hover:text-white">
          {tab}
        </button>
      ))}
    </div>
  );
}