'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader as Loader2, Search, Shield, UserX, Ban, Trash2, Eye, FileText } from 'lucide-react';

interface ActivityLog {
  id: string;
  admin_id: string;
  action: string;
  target_type: string | null;
  target_id: string | null;
  details: Record<string, any>;
  created_at: string;
  profiles: {
    username: string;
  };
}

interface ActivityLogProps {
  adminId: string;
}

export function ActivityLog({ adminId }: ActivityLogProps) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 50;

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const fetchLogs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('admin_activity_log')
      .select('*, profiles(username)')
      .order('created_at', { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (data) {
      setLogs(data as any);
    }
    setLoading(false);
  };

  const searchLogs = async () => {
    if (!searchQuery.trim()) {
      fetchLogs();
      return;
    }

    setLoading(true);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id')
      .ilike('username', `%${searchQuery}%`);

    if (profiles && profiles.length > 0) {
      const adminIds = profiles.map(p => p.id);
      const { data } = await supabase
        .from('admin_activity_log')
        .select('*, profiles(username)')
        .in('admin_id', adminIds)
        .order('created_at', { ascending: false })
        .limit(50);

      if (data) {
        setLogs(data as any);
      }
    } else {
      setLogs([]);
    }
    setLoading(false);
  };

  const getActionIcon = (action: string) => {
    if (action.includes('suspend')) return <UserX className="h-4 w-4" />;
    if (action.includes('ban')) return <Ban className="h-4 w-4" />;
    if (action.includes('delete')) return <Trash2 className="h-4 w-4" />;
    if (action.includes('hide') || action.includes('unhide')) return <Eye className="h-4 w-4" />;
    if (action.includes('report')) return <FileText className="h-4 w-4" />;
    return <Shield className="h-4 w-4" />;
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      suspend_user: 'إيقاف مستخدم',
      unsuspend_user: 'إلغاء إيقاف مستخدم',
      ban_user: 'حظر مستخدم',
      unban_user: 'إلغاء حظر مستخدم',
      change_rank: 'تغيير رتبة',
      hide_post: 'إخفاء منشور',
      unhide_post: 'إظهار منشور',
      delete_post: 'حذف منشور',
      report_reviewed: 'مراجعة بلاغ',
      report_resolved: 'حل بلاغ',
      delete_report: 'حذف بلاغ',
      respond_ticket: 'الرد على تذكرة',
      update_ticket_status: 'تحديث حالة تذكرة',
      add_profanity_word: 'إضافة كلمة محظورة',
      remove_profanity_word: 'حذف كلمة محظورة',
      update_profanity_severity: 'تحديث خطورة كلمة',
      create_ad: 'إنشاء إعلان',
      approve_ad: 'الموافقة على إعلان',
      pause_ad: 'إيقاف إعلان',
      delete_ad: 'حذف إعلان',
    };
    return labels[action] || action;
  };

  const getActionColor = (action: string) => {
    if (action.includes('delete') || action.includes('ban')) return 'destructive';
    if (action.includes('suspend') || action.includes('hide')) return 'secondary';
    if (action.includes('approve') || action.includes('resolved')) return 'default';
    return 'outline';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="البحث باسم المشرف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchLogs()}
            className="pr-10"
          />
        </div>
        <Button onClick={searchLogs}>بحث</Button>
      </div>

      <div className="grid gap-3">
        {logs.map((log) => (
          <Card key={log.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {getActionIcon(log.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-sm">@{log.profiles.username}</span>
                    <Badge variant={getActionColor(log.action) as any} className="text-xs">
                      {getActionLabel(log.action)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(log.created_at).toLocaleDateString('ar', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </p>
                  {log.details && Object.keys(log.details).length > 0 && (
                    <div className="mt-2 text-xs bg-muted p-2 rounded">
                      {log.details.reason && (
                        <p><span className="font-semibold">السبب:</span> {log.details.reason}</p>
                      )}
                      {log.details.days && (
                        <p><span className="font-semibold">المدة:</span> {log.details.days} يوم</p>
                      )}
                      {log.details.new_rank && (
                        <p><span className="font-semibold">الرتبة الجديدة:</span> {log.details.new_rank}</p>
                      )}
                      {log.details.new_status && (
                        <p><span className="font-semibold">الحالة الجديدة:</span> {log.details.new_status}</p>
                      )}
                      {log.details.word && (
                        <p><span className="font-semibold">الكلمة:</span> {log.details.word}</p>
                      )}
                      {log.details.severity && (
                        <p><span className="font-semibold">الخطورة:</span> {log.details.severity}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {logs.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          لا توجد سجلات
        </p>
      )}

      {logs.length === pageSize && (
        <div className="flex justify-center gap-2">
          {page > 0 && (
            <Button variant="outline" onClick={() => setPage(page - 1)}>
              السابق
            </Button>
          )}
          <Button variant="outline" onClick={() => setPage(page + 1)}>
            التالي
          </Button>
        </div>
      )}
    </div>
  );
}
