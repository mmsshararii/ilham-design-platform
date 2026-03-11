'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { logAdminAction } from '@/lib/admin-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Search, Ban, UserX, Award, Eye, Loader as Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Profile {
  id: string;
  username: string;
  account_type: string;
  is_verified: boolean;
  is_suspended: boolean;
  is_banned: boolean;
  suspension_reason?: string;
  suspension_until?: string;
  created_at: string;
}

interface UserRank {
  rank: string;
}

interface UserManagementProps {
  adminId: string;
}

export function UserManagement({ adminId }: UserManagementProps) {
  const [users, setUsers] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [suspensionDays, setSuspensionDays] = useState('7');
  const [banReason, setBanReason] = useState('');
  const [newRank, setNewRank] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (data) {
      setUsers(data);
    }
    setLoading(false);
  };

  const searchUsers = async () => {
    if (!searchQuery.trim()) {
      fetchUsers();
      return;
    }

    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .ilike('username', `%${searchQuery}%`)
      .limit(50);

    if (data) {
      setUsers(data);
    }
    setLoading(false);
  };

  const handleSuspendUser = async (userId: string) => {
    if (!suspensionReason.trim()) {
      toast.error('يرجى إدخال سبب الإيقاف');
      return;
    }

    const days = parseInt(suspensionDays);
    const suspensionUntil = new Date();
    suspensionUntil.setDate(suspensionUntil.getDate() + days);

    const { error } = await supabase
      .from('profiles')
      .update({
        is_suspended: true,
        suspension_reason: suspensionReason,
        suspension_until: suspensionUntil.toISOString(),
      })
      .eq('id', userId);

    if (!error) {
      await logAdminAction(adminId, 'suspend_user', 'profile', userId, {
        reason: suspensionReason,
        days,
      });

      toast.success('تم إيقاف المستخدم بنجاح');
      setSuspensionReason('');
      setSelectedUser(null);
      fetchUsers();
    } else {
      toast.error('فشل إيقاف المستخدم');
    }
  };

  const handleUnsuspendUser = async (userId: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({
        is_suspended: false,
        suspension_reason: null,
        suspension_until: null,
      })
      .eq('id', userId);

    if (!error) {
      await logAdminAction(adminId, 'unsuspend_user', 'profile', userId);
      toast.success('تم إلغاء إيقاف المستخدم');
      fetchUsers();
    }
  };

  const handleBanUser = async (userId: string) => {
    if (!banReason.trim()) {
      toast.error('يرجى إدخال سبب الحظر');
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        is_banned: true,
        suspension_reason: banReason,
      })
      .eq('id', userId);

    if (!error) {
      await logAdminAction(adminId, 'ban_user', 'profile', userId, {
        reason: banReason,
      });

      toast.success('تم حظر المستخدم بنجاح');
      setBanReason('');
      setSelectedUser(null);
      fetchUsers();
    } else {
      toast.error('فشل حظر المستخدم');
    }
  };

  const handleUnbanUser = async (userId: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({
        is_banned: false,
        suspension_reason: null,
      })
      .eq('id', userId);

    if (!error) {
      await logAdminAction(adminId, 'unban_user', 'profile', userId);
      toast.success('تم إلغاء حظر المستخدم');
      fetchUsers();
    }
  };

  const handleChangeRank = async (userId: string) => {
    if (!newRank) {
      toast.error('يرجى اختيار رتبة');
      return;
    }

    const { error } = await supabase
      .from('user_ranks')
      .upsert({
        user_id: userId,
        rank: newRank,
        updated_at: new Date().toISOString(),
      });

    if (!error) {
      await logAdminAction(adminId, 'change_rank', 'user_rank', userId, {
        new_rank: newRank,
      });

      toast.success('تم تغيير الرتبة بنجاح');
      setNewRank('');
      setSelectedUser(null);
    } else {
      toast.error('فشل تغيير الرتبة');
    }
  };

  const getUserRank = async (userId: string): Promise<string> => {
    const { data } = await supabase
      .from('user_ranks')
      .select('rank')
      .eq('user_id', userId)
      .maybeSingle();

    return data?.rank || 'member';
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
            placeholder="البحث عن مستخدم..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchUsers()}
            className="pr-10"
          />
        </div>
        <Button onClick={searchUsers}>بحث</Button>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base flex items-center gap-2">
                    {user.username}
                    {user.is_verified && (
                      <Badge variant="default" className="text-xs">موثق</Badge>
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {user.account_type === 'designer' ? 'مصمم' : user.account_type === 'seeker' ? 'باحث' : 'عام'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    انضم في {new Date(user.created_at).toLocaleDateString('ar')}
                  </p>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  {user.is_suspended && (
                    <Badge variant="destructive">موقوف</Badge>
                  )}
                  {user.is_banned && (
                    <Badge variant="destructive">محظور</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {(user.is_suspended || user.is_banned) && user.suspension_reason && (
                <div className="text-sm">
                  <p className="font-semibold">السبب:</p>
                  <p className="text-muted-foreground">{user.suspension_reason}</p>
                  {user.suspension_until && (
                    <p className="text-xs text-muted-foreground">
                      حتى {new Date(user.suspension_until).toLocaleDateString('ar')}
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(`/profile/${user.username}`, '_blank')}
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  عرض الملف
                </Button>

                {user.is_suspended ? (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => handleUnsuspendUser(user.id)}
                  >
                    إلغاء الإيقاف
                  </Button>
                ) : !user.is_banned && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        onClick={() => setSelectedUser(user)}
                      >
                        <UserX className="h-4 w-4" />
                        إيقاف
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>إيقاف المستخدم</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-3">
                          <Textarea
                            placeholder="سبب الإيقاف..."
                            value={suspensionReason}
                            onChange={(e) => setSuspensionReason(e.target.value)}
                          />
                          <Select value={suspensionDays} onValueChange={setSuspensionDays}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">يوم واحد</SelectItem>
                              <SelectItem value="3">3 أيام</SelectItem>
                              <SelectItem value="7">7 أيام</SelectItem>
                              <SelectItem value="14">14 يوم</SelectItem>
                              <SelectItem value="30">30 يوم</SelectItem>
                            </SelectContent>
                          </Select>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSuspensionReason('')}>
                          إلغاء
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleSuspendUser(user.id)}>
                          إيقاف
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}

                {user.is_banned ? (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => handleUnbanUser(user.id)}
                  >
                    إلغاء الحظر
                  </Button>
                ) : (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="gap-2"
                        onClick={() => setSelectedUser(user)}
                      >
                        <Ban className="h-4 w-4" />
                        حظر
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>حظر المستخدم</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-3">
                          <p>هل أنت متأكد من حظر هذا المستخدم نهائياً؟</p>
                          <Textarea
                            placeholder="سبب الحظر..."
                            value={banReason}
                            onChange={(e) => setBanReason(e.target.value)}
                          />
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setBanReason('')}>
                          إلغاء
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleBanUser(user.id)}>
                          حظر
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      onClick={() => setSelectedUser(user)}
                    >
                      <Award className="h-4 w-4" />
                      تغيير الرتبة
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>تغيير رتبة المستخدم</AlertDialogTitle>
                      <AlertDialogDescription className="space-y-3">
                        <Select value={newRank} onValueChange={setNewRank}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الرتبة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="member">عضو</SelectItem>
                            <SelectItem value="distinguished">متميز</SelectItem>
                            <SelectItem value="creative">مبدع</SelectItem>
                            <SelectItem value="professional">محترف</SelectItem>
                            <SelectItem value="unique">فريد</SelectItem>
                          </SelectContent>
                        </Select>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setNewRank('')}>
                        إلغاء
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleChangeRank(user.id)}>
                        تغيير
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          لا توجد نتائج
        </p>
      )}
    </div>
  );
}
