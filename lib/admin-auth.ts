import { supabase } from './supabase';

export type AdminLevel = 'assistant' | 'deputy' | 'director';

export interface AdminUser {
  id: string;
  level: AdminLevel;
  promoted_by: string | null;
  promoted_at: string;
}

export async function checkAdminAccess(userId: string): Promise<{ isAdmin: boolean; level?: AdminLevel }> {
  const { data } = await supabase
    .from('admin_hierarchy')
    .select('level')
    .eq('user_id', userId)
    .maybeSingle();

  return {
    isAdmin: !!data,
    level: data?.level as AdminLevel | undefined,
  };
}

export async function logAdminAction(
  adminId: string,
  action: string,
  targetType?: string,
  targetId?: string,
  details?: Record<string, any>
) {
  await supabase.from('admin_activity_log').insert({
    admin_id: adminId,
    action,
    target_type: targetType,
    target_id: targetId,
    details: details || {},
  });
}

export function canManageStaff(level?: AdminLevel): boolean {
  return level === 'director';
}

export function canManageAds(level?: AdminLevel): boolean {
  return level === 'director' || level === 'deputy';
}

export function canViewActivityLog(level?: AdminLevel): boolean {
  return level === 'director';
}
