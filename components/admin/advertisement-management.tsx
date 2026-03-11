'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { logAdminAction } from '@/lib/admin-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Loader as Loader2, Plus, CircleCheck as CheckCircle, Pause, Trash2, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface Advertisement {
  id: string;
  advertiser_id: string | null;
  title: string;
  description: string | null;
  image_url: string | null;
  redirect_url: string | null;
  duration_days: number | null;
  impressions_limit: number | null;
  impressions_used: number;
  keywords: string[];
  status: 'pending' | 'approved' | 'active' | 'paused' | 'expired';
  is_promoted: boolean;
  created_at: string;
  expires_at: string | null;
  profiles: {
    username: string;
  } | null;
}

interface AdvertisementManagementProps {
  adminId: string;
}

export function AdvertisementManagement({ adminId }: AdvertisementManagementProps) {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [newAd, setNewAd] = useState({
    title: '',
    description: '',
    image_url: '',
    redirect_url: '',
    duration_days: '30',
    impressions_limit: '10000',
    keywords: '',
  });

  useEffect(() => {
    fetchAds();
  }, [activeTab]);

  const fetchAds = async () => {
    setLoading(true);
    const query = supabase
      .from('advertisements')
      .select('*, profiles(username)')
      .order('created_at', { ascending: false });

    if (activeTab !== 'all') {
      query.eq('status', activeTab);
    }

    const { data } = await query;

    if (data) {
      setAds(data as any);
    }
    setLoading(false);
  };

  const handleCreateAd = async () => {
    if (!newAd.title.trim()) {
      toast.error('يرجى إدخال عنوان الإعلان');
      return;
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parseInt(newAd.duration_days));

    const { error } = await supabase
      .from('advertisements')
      .insert({
        title: newAd.title,
        description: newAd.description || null,
        image_url: newAd.image_url || null,
        redirect_url: newAd.redirect_url || null,
        duration_days: parseInt(newAd.duration_days),
        impressions_limit: parseInt(newAd.impressions_limit),
        keywords: newAd.keywords ? newAd.keywords.split(',').map(k => k.trim()) : [],
        status: 'approved',
        expires_at: expiresAt.toISOString(),
      });

    if (!error) {
      await logAdminAction(adminId, 'create_ad', 'advertisement', undefined, {
        title: newAd.title,
      });

      toast.success('تم إنشاء الإعلان بنجاح');
      setNewAd({
        title: '',
        description: '',
        image_url: '',
        redirect_url: '',
        duration_days: '30',
        impressions_limit: '10000',
        keywords: '',
      });
      setIsCreateDialogOpen(false);
      fetchAds();
    } else {
      toast.error('فشل إنشاء الإعلان');
    }
  };

  const handleApproveAd = async (adId: string) => {
    const { error } = await supabase
      .from('advertisements')
      .update({ status: 'approved' })
      .eq('id', adId);

    if (!error) {
      await logAdminAction(adminId, 'approve_ad', 'advertisement', adId);
      toast.success('تمت الموافقة على الإعلان');
      fetchAds();
    } else {
      toast.error('فشلت العملية');
    }
  };

  const handlePauseAd = async (adId: string) => {
    const { error } = await supabase
      .from('advertisements')
      .update({ status: 'paused' })
      .eq('id', adId);

    if (!error) {
      await logAdminAction(adminId, 'pause_ad', 'advertisement', adId);
      toast.success('تم إيقاف الإعلان');
      fetchAds();
    } else {
      toast.error('فشلت العملية');
    }
  };

  const handleActivateAd = async (adId: string) => {
    const { error } = await supabase
      .from('advertisements')
      .update({ status: 'active' })
      .eq('id', adId);

    if (!error) {
      await logAdminAction(adminId, 'activate_ad', 'advertisement', adId);
      toast.success('تم تفعيل الإعلان');
      fetchAds();
    } else {
      toast.error('فشلت العملية');
    }
  };

  const handleDeleteAd = async (adId: string) => {
    const { error } = await supabase
      .from('advertisements')
      .delete()
      .eq('id', adId);

    if (!error) {
      await logAdminAction(adminId, 'delete_ad', 'advertisement', adId);
      toast.success('تم حذف الإعلان');
      fetchAds();
    } else {
      toast.error('فشل حذف الإعلان');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">قيد المراجعة</Badge>;
      case 'approved':
        return <Badge variant="default">موافق عليه</Badge>;
      case 'active':
        return <Badge variant="default" className="bg-green-500">نشط</Badge>;
      case 'paused':
        return <Badge variant="outline">متوقف</Badge>;
      case 'expired':
        return <Badge variant="destructive">منتهي</Badge>;
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">إدارة الإعلانات</h3>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              إنشاء إعلان
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>إنشاء إعلان جديد</DialogTitle>
              <DialogDescription>
                أدخل تفاصيل الإعلان الجديد
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>عنوان الإعلان *</Label>
                <Input
                  value={newAd.title}
                  onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
                  placeholder="عنوان جذاب للإعلان"
                />
              </div>
              <div>
                <Label>الوصف</Label>
                <Textarea
                  value={newAd.description}
                  onChange={(e) => setNewAd({ ...newAd, description: e.target.value })}
                  placeholder="وصف الإعلان..."
                  rows={3}
                />
              </div>
              <div>
                <Label>رابط الصورة</Label>
                <Input
                  value={newAd.image_url}
                  onChange={(e) => setNewAd({ ...newAd, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <Label>رابط التوجيه</Label>
                <Input
                  value={newAd.redirect_url}
                  onChange={(e) => setNewAd({ ...newAd, redirect_url: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>المدة (أيام)</Label>
                  <Input
                    type="number"
                    value={newAd.duration_days}
                    onChange={(e) => setNewAd({ ...newAd, duration_days: e.target.value })}
                  />
                </div>
                <div>
                  <Label>حد الظهور</Label>
                  <Input
                    type="number"
                    value={newAd.impressions_limit}
                    onChange={(e) => setNewAd({ ...newAd, impressions_limit: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>الكلمات المفتاحية (مفصولة بفواصل)</Label>
                <Input
                  value={newAd.keywords}
                  onChange={(e) => setNewAd({ ...newAd, keywords: e.target.value })}
                  placeholder="تصميم, جرافيك, شعارات"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleCreateAd}>إنشاء</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">قيد المراجعة</TabsTrigger>
          <TabsTrigger value="approved">موافق عليها</TabsTrigger>
          <TabsTrigger value="active">نشطة</TabsTrigger>
          <TabsTrigger value="paused">متوقفة</TabsTrigger>
          <TabsTrigger value="all">الكل</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <div className="grid gap-4">
            {ads.map((ad) => (
              <Card key={ad.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base">{ad.title}</CardTitle>
                      {ad.profiles && (
                        <p className="text-sm text-muted-foreground">
                          المعلن: @{ad.profiles.username}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        تم الإنشاء في {new Date(ad.created_at).toLocaleDateString('ar')}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      {getStatusBadge(ad.status)}
                      {ad.is_promoted && (
                        <Badge variant="default" className="gap-1">
                          <TrendingUp className="h-3 w-3" />
                          مروج
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {ad.description && (
                    <p className="text-sm text-muted-foreground">{ad.description}</p>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="font-semibold">الظهور:</span>{' '}
                      {ad.impressions_used.toLocaleString()} / {ad.impressions_limit?.toLocaleString() || '∞'}
                    </div>
                    {ad.expires_at && (
                      <div>
                        <span className="font-semibold">ينتهي في:</span>{' '}
                        {new Date(ad.expires_at).toLocaleDateString('ar')}
                      </div>
                    )}
                  </div>

                  {ad.keywords && ad.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {ad.keywords.map((keyword, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {ad.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleApproveAd(ad.id)}
                        className="gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        الموافقة
                      </Button>
                    )}

                    {(ad.status === 'approved' || ad.status === 'paused') && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleActivateAd(ad.id)}
                      >
                        تفعيل
                      </Button>
                    )}

                    {ad.status === 'active' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePauseAd(ad.id)}
                        className="gap-2"
                      >
                        <Pause className="h-4 w-4" />
                        إيقاف
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteAd(ad.id)}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      حذف
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {ads.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              لا توجد إعلانات
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
