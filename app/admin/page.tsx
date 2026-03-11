'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { checkAdminAccess, AdminLevel } from '@/lib/admin-auth';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader as Loader2, Users, FileText, CircleAlert as AlertCircle, TrendingUp, Shield, MessageSquare, Filter, Activity } from 'lucide-react';
import { UserManagement } from '@/components/admin/user-management';
import { PostModeration } from '@/components/admin/post-moderation';
import { ReportsManagement } from '@/components/admin/reports-management';
import { SupportTickets } from '@/components/admin/support-tickets';
import { ProfanityFilter } from '@/components/admin/profanity-filter';
import { ActivityLog } from '@/components/admin/activity-log';
import { AdvertisementManagement } from '@/components/admin/advertisement-management';

export default function AdminDashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalReports: 0,
    activeAds: 0,
    pendingTickets: 0,
  });
  const [adminLevel, setAdminLevel] = useState<AdminLevel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user && profile) {
      checkAccess();
    }
  }, [user, profile, authLoading, router]);

  const checkAccess = async () => {
    const { isAdmin, level } = await checkAdminAccess(user!.id);

    if (!isAdmin) {
      router.push('/');
      return;
    }

    setAdminLevel(level!);

    const { count: userCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const { count: postCount } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true });

    const { count: reportCount } = await supabase
      .from('post_reports')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    const { count: adCount } = await supabase
      .from('advertisements')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    const { count: ticketCount } = await supabase
      .from('support_tickets')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    setStats({
      totalUsers: userCount || 0,
      totalPosts: postCount || 0,
      totalReports: reportCount || 0,
      activeAds: adCount || 0,
      pendingTickets: ticketCount || 0,
    });

    setLoading(false);
  };

  const getAdminLevelLabel = (level: AdminLevel) => {
    switch (level) {
      case 'director': return 'مدير';
      case 'deputy': return 'نائب';
      case 'assistant': return 'مساعد';
      default: return level;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!adminLevel) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">لوحة التحكم الإدارية</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            المستوى:
            <Badge variant="default" className="gap-1">
              <Shield className="h-3 w-3" />
              {getAdminLevelLabel(adminLevel)}
            </Badge>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                المستخدمون
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4 text-green-500" />
                المنشورات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.totalPosts.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                البلاغات المعلقة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.totalReports}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-orange-500" />
                التذاكر المعلقة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.pendingTickets}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                الإعلانات النشطة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.activeAds}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              المستخدمون
            </TabsTrigger>
            <TabsTrigger value="posts" className="gap-2">
              <FileText className="h-4 w-4" />
              المنشورات
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <AlertCircle className="h-4 w-4" />
              البلاغات
            </TabsTrigger>
            <TabsTrigger value="tickets" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              التذاكر
            </TabsTrigger>
            <TabsTrigger value="ads" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              الإعلانات
            </TabsTrigger>
            <TabsTrigger value="profanity" className="gap-2">
              <Filter className="h-4 w-4" />
              الكلمات المحظورة
            </TabsTrigger>
            {adminLevel === 'director' && (
              <TabsTrigger value="log" className="gap-2">
                <Activity className="h-4 w-4" />
                سجل النشاط
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>إدارة المستخدمين</CardTitle>
              </CardHeader>
              <CardContent>
                <UserManagement adminId={user!.id} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="posts">
            <Card>
              <CardHeader>
                <CardTitle>إدارة المنشورات</CardTitle>
              </CardHeader>
              <CardContent>
                <PostModeration adminId={user!.id} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>إدارة البلاغات</CardTitle>
              </CardHeader>
              <CardContent>
                <ReportsManagement adminId={user!.id} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tickets">
            <Card>
              <CardHeader>
                <CardTitle>إدارة تذاكر الدعم</CardTitle>
              </CardHeader>
              <CardContent>
                <SupportTickets adminId={user!.id} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ads">
            <Card>
              <CardHeader>
                <CardTitle>إدارة الإعلانات</CardTitle>
              </CardHeader>
              <CardContent>
                <AdvertisementManagement adminId={user!.id} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profanity">
            <Card>
              <CardHeader>
                <CardTitle>إدارة الكلمات المحظورة</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfanityFilter adminId={user!.id} />
              </CardContent>
            </Card>
          </TabsContent>

          {adminLevel === 'director' && (
            <TabsContent value="log">
              <Card>
                <CardHeader>
                  <CardTitle>سجل النشاط الإداري</CardTitle>
                </CardHeader>
                <CardContent>
                  <ActivityLog adminId={user!.id} />
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
}
