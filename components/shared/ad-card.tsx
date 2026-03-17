'use client';

import { Ad } from '@/types/ad';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

interface AdCardProps {
  ad: Ad;
  onAdClick?: (adId: string) => void;
}

export function AdCard({ ad, onAdClick }: AdCardProps) {
  const handleClick = () => {
    onAdClick?.(ad.id);
    if (ad.link_url) {
      window.open(ad.link_url, '_blank');
    }
  };

  return (
    <Card
      className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <Badge variant="secondary" className="bg-blue-600 text-white">
          إعلان
        </Badge>
        {ad.is_pinned && (
          <Badge variant="secondary" className="bg-yellow-500 text-white">
            مثبت
          </Badge>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{ad.title}</h3>
        <p className="text-gray-700 mb-4">{ad.description}</p>

        {ad.image_url && (
          <img
            src={ad.image_url}
            alt={ad.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}

        {ad.link_url && (
          <div className="flex items-center gap-2 text-blue-600 font-medium">
            <span>اعرف المزيد</span>
            <ExternalLink className="w-4 h-4" />
          </div>
        )}
      </div>
    </Card>
  );
}
