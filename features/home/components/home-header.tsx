export function HomeHeader() {
  return (
    <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold">استلهم</h1>
      <input
        placeholder="ابحث عن أي شيء..."
        className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 w-[300px] text-sm"
      />
    </div>
  );
}