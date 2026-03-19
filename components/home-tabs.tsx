'use client';

import { CategoryTabs } from '@/components/layout/category-tabs';
import { FeedTab } from '@/types/feed';

interface Props {
  activeTab: FeedTab;
  onTabChange: (tab: FeedTab) => void;
}

export function HomeTabs(props: Props) {
  return <CategoryTabs {...props} />;
}