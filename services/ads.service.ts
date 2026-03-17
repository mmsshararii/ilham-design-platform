import { getSupabaseClient } from '@/lib/supabase';
import { Ad, CreateAdInput } from '@/types/ad';

const supabase = getSupabaseClient();

export async function getActiveAds(): Promise<Ad[]> {
  const { data, error } = await supabase
    .from('ads')
    .select('*')
    .eq('is_active', true)
    .or(`end_date.is.null,end_date.gt.${new Date().toISOString()}`)
    .lte('start_date', new Date().toISOString())
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getAdsForFeed(limit: number = 2): Promise<Ad[]> {
  const ads = await getActiveAds();

  const eligibleAds = ads.filter(ad => {
    if (ad.impressions_limit > 0 && ad.impressions_count >= ad.impressions_limit) {
      return false;
    }
    return true;
  });

  const pinnedAds = eligibleAds.filter(ad => ad.is_pinned);
  const regularAds = eligibleAds.filter(ad => !ad.is_pinned);

  const selectedAds = [
    ...pinnedAds.slice(0, limit),
    ...regularAds.slice(0, Math.max(0, limit - pinnedAds.length))
  ];

  return selectedAds;
}

export async function trackAdImpression(adId: string): Promise<void> {
  const { error } = await supabase.rpc('increment_ad_impressions', {
    ad_uuid: adId
  });

  if (error) throw error;
}

export async function trackAdClick(adId: string, userId: string | null): Promise<void> {
  await supabase.rpc('increment_ad_clicks', {
    ad_uuid: adId
  });

  const { error } = await supabase
    .from('ad_clicks')
    .insert({
      ad_id: adId,
      user_id: userId,
    });

  if (error) throw error;
}

export async function createAd(input: CreateAdInput): Promise<Ad> {
  const { data, error } = await supabase
    .from('ads')
    .insert({
      title: input.title,
      description: input.description,
      image_url: input.image_url || null,
      link_url: input.link_url || null,
      is_pinned: input.is_pinned || false,
      impressions_limit: input.impressions_limit || 0,
      start_date: input.start_date || new Date().toISOString(),
      end_date: input.end_date || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
