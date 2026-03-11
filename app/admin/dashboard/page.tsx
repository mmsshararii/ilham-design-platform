'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CircleAlert as AlertCircle, Loader as Loader2, CircleCheck as CheckCircle, Circle as XCircle, Eye } from 'lucide-react';

interface Report {
  id: string;
  post_id: string;
  reporter_id: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved';
  created_at: string;
}

interface DeletionRequest {
  id: string;
  comment_id: string;
  user_id: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export default function AdminDashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [deletionRequests, setDeletionRequests] = useState<DeletionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user && profile) {
      checkAdminStatus();
    }
  }, [user, profile, authLoading, router]);

  const checkAdminStatus = async () => {
    const { data } = await supabase
      .from('user_ranks')
      .select('rank')
      .eq('user_id', user!.id)
      .maybeSingle();

    const adminRank = data?.rank === 'professional' || data?.rank === 'unique';
    setIsAdmin(adminRank);

    if (!adminRank) {
      router.push('/');
      return;
    }

    await Promise.all([fetchReports(), fetchDeletionRequests()]);
    setLoading(false);
  };

  const fetchReports = async () => {
    const { data } = await supabase
      .from('post_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setReports(data);
    }
  };

  const fetchDeletionRequests = async () => {
    const { data } = await supabase
      .from('comment_deletion_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setDeletionRequests(data);
    }
  };

  const handleReportAction = async (
    reportId: string,
    action: 'reviewed' | 'resolved'
  ) => {
    await supabase
      .from('post_reports')
      .update({ status: action })
      .eq('id', reportId);

    await fetchReports();
  };

  const handleDeletionRequest = async (
    requestId: string,
    action: 'approved' | 'rejected'
  ) => {
    await supabase
      .from('comment_deletion_requests')
      .update({ status: action })
      .eq('id', requestId);

    await fetchDeletionRequests();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-6xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">لوحة التحكم</h1>
          <p className="text-muted-foreground">إدارة التقارير والطلبات</p>
        </div>

        <Tabs defaultValue="reports" className="space-y-4">
          <TabsList>
            <TabsTrigger value="reports" className="gap-2">
              <AlertCircle className="h-4 w-4" />
              البلاغات ({reports.length})
            </TabsTrigger>
            <TabsTrigger value="deletions" className="gap-2">
              <Eye className="h-4 w-4" />
              طلبات الحذف ({deletionRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-4">
            {reports.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                لا توجد بلاغات
              </p>
            ) : (
              <div className="grid gap-4">
                {reports.map((report) => (
                  <Card key={report.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">
                            بلاغ رقم {report.id.slice(0, 8)}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {new Date(report.created_at).toLocaleDateString('ar')}
                          </p>
                        </div>
                        <Badge
                          variant={
                            report.status === 'pending'
                              ? 'destructive'
                              : report.status === 'reviewed'
                              ? 'secondary'
                              : 'default'
                          }
                        >
                          {report.status === 'pending'
                            ? 'معلق'
                            : report.status === 'reviewed'
                            ? 'تم المراجعة'
                            : 'مكتمل'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold mb-2">السبب:</p>
                        <p className="text-sm text-muted-foreground">
                          {report.reason}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {report.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleReportAction(report.id, 'reviewed')
                              }
                            >
                              تم المراجعة
                            </Button>
                            <Button
                              size="sm"
                              className="gap-2"
                              onClick={() =>
                                handleReportAction(report.id, 'resolved')
                              }
                            >
                              <CheckCircle className="h-4 w-4" />
                              حل المشكلة
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="deletions" className="space-y-4">
            {deletionRequests.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                لا توجد طلبات حذف معلقة
              </p>
            ) : (
              <div className="grid gap-4">
                {deletionRequests.map((request) => (
                  <Card key={request.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">
                            طلب حذف رقم {request.id.slice(0, 8)}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {new Date(request.created_at).toLocaleDateString('ar')}
                          </p>
                        </div>
                        <Badge
                          variant={
                            request.status === 'pending'
                              ? 'destructive'
                              : request.status === 'approved'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {request.status === 'pending'
                            ? 'معلق'
                            : request.status === 'approved'
                            ? 'موافق عليه'
                            : 'مرفوض'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold mb-2">السبب:</p>
                        <p className="text-sm text-muted-foreground">
                          {request.reason}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {request.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              className="gap-2"
                              onClick={() =>
                                handleDeletionRequest(request.id, 'approved')
                              }
                            >
                              <CheckCircle className="h-4 w-4" />
                              الموافقة
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleDeletionRequest(request.id, 'rejected')
                              }
                            >
                              <XCircle className="h-4 w-4" />
                              الرفض
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
