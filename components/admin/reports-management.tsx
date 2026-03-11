'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { logAdminAction } from '@/lib/admin-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, CircleCheck as CheckCircle, Circle as XCircle, Loader as Loader2, CircleAlert as AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Report {
  id: string;
  post_id: string;
  reporter_id: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved';
  created_at: string;
  posts: {
    description: string;
    profiles: {
      username: string;
    };
  };
  profiles: {
    username: string;
  };
}

interface ReportsManagementProps {
  adminId: string;
}

export function ReportsManagement({ adminId }: ReportsManagementProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchReports();
  }, [activeTab]);

  const fetchReports = async () => {
    setLoading(true);
    const query = supabase
      .from('post_reports')
      .select(`
        *,
        posts(description, profiles(username)),
        profiles(username)
      `)
      .order('created_at', { ascending: false });

    if (activeTab !== 'all') {
      query.eq('status', activeTab);
    }

    const { data } = await query;

    if (data) {
      setReports(data as any);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (reportId: string, status: 'reviewed' | 'resolved') => {
    const { error } = await supabase
      .from('post_reports')
      .update({ status })
      .eq('id', reportId);

    if (!error) {
      await logAdminAction(adminId, `report_${status}`, 'post_report', reportId);
      toast.success(status === 'reviewed' ? 'تم وضع علامة كمراجع' : 'تم حل البلاغ');
      fetchReports();
    } else {
      toast.error('فشلت العملية');
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    const { error } = await supabase
      .from('post_reports')
      .delete()
      .eq('id', reportId);

    if (!error) {
      await logAdminAction(adminId, 'delete_report', 'post_report', reportId);
      toast.success('تم حذف البلاغ');
      fetchReports();
    } else {
      toast.error('فشل حذف البلاغ');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="destructive">معلق</Badge>;
      case 'reviewed':
        return <Badge variant="secondary">تم المراجعة</Badge>;
      case 'resolved':
        return <Badge variant="default">مكتمل</Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList>
        <TabsTrigger value="pending" className="gap-2">
          <AlertCircle className="h-4 w-4" />
          معلقة
        </TabsTrigger>
        <TabsTrigger value="reviewed">تم المراجعة</TabsTrigger>
        <TabsTrigger value="resolved">مكتملة</TabsTrigger>
        <TabsTrigger value="all">الكل</TabsTrigger>
      </TabsList>

      <TabsContent value={activeTab} className="space-y-4">
        <div className="grid gap-4">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">
                      بلاغ من @{report.profiles.username}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      ضد منشور @{report.posts.profiles.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(report.created_at).toLocaleDateString('ar', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {getStatusBadge(report.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-semibold mb-1">سبب البلاغ:</p>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                    {report.reason}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-1">محتوى المنشور المبلغ عنه:</p>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md line-clamp-3">
                    {report.posts.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`/post/${report.post_id}`, '_blank')}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    عرض المنشور
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`/profile/${report.profiles.username}`, '_blank')}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    ملف المبلغ
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`/profile/${report.posts.profiles.username}`, '_blank')}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    ملف المبلغ عنه
                  </Button>

                  {report.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleUpdateStatus(report.id, 'reviewed')}
                        className="gap-2"
                      >
                        تم المراجعة
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleUpdateStatus(report.id, 'resolved')}
                        className="gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        حل البلاغ
                      </Button>
                    </>
                  )}

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteReport(report.id)}
                    className="gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    حذف البلاغ
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {reports.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            لا توجد بلاغات
          </p>
        )}
      </TabsContent>
    </Tabs>
  );
}
