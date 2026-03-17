'use client';

import { FeedTab } from '@/types/feed';

interface FeedTabsProps {
  activeTab: FeedTab;
  onTabChange: (tab: FeedTab) => void;
}

const TABS: { value: FeedTab; label: string }[] = [
  { value: 'custom', label: 'مخصص' },
  { value: 'general', label: 'منشورات عامة' },
  { value: 'design', label: 'تصاميم' },
  { value: 'request', label: 'طلبات' },
  { value: 'offer', label: 'عروض' },
  { value: 'following', label: 'المتابعة' },
];

export function FeedTabs({ activeTab, onTabChange }: FeedTabsProps) {
  return (
    <div className="border-b bg-white sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4">
        <nav className="flex gap-1 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              className={`
                px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors
                border-b-2 -mb-px
                ${
                  activeTab === tab.value
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
