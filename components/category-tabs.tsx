'use client';

import { useState } from 'react';

const categories = [
  'مخصص',
  'منشورات عامة',
  'تصاميم',
  'طلبات',
  'عروض',
  'ملحقات',
];

export function CategoryTabs() {
  const [active, setActive] = useState('مخصص');

  return (
    <div className="w-full border-b border-white/10 mb-4">
      <div className="flex gap-2 overflow-x-auto px-4 py-2">

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`
              px-4 py-2 rounded-full text-sm whitespace-nowrap
              transition-all
              ${active === cat
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'bg-white/5 text-white/70 hover:bg-white/10'}
            `}
          >
            {cat}
          </button>
        ))}

      </div>
    </div>
  );
}
