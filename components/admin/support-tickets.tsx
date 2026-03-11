'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { logAdminAction } from '@/lib/admin-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader as Loader2, MessageSquare, CircleCheck as CheckCircle, Clock, Circle as XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SupportTicket {
  id: string;
  ticket_number: string;
  user_id: string | null;
  email: string;
  title: string;
  description: string;
  images: string[];
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  admin_response: string | null;
  created_at: string;
  updated_at: string;
  profiles: {
    username: string;
  } | null;
}

interface SupportTicketsProps {
  adminId: string;
}

export function SupportTickets({ adminId }: SupportTicketsProps) {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [response, setResponse] = useState('');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchTickets();
  }, [activeTab]);

  const fetchTickets = async () => {
    setLoading(true);
    const query = supabase
      .from('support_tickets')
      .select('*, profiles(username)')
      .order('created_at', { ascending: false });

    if (activeTab !== 'all') {
      query.eq('status', activeTab);
    }

    const { data } = await query;

    if (data) {
      setTickets(data as any);
    }
    setLoading(false);
  };

  const handleRespondToTicket = async (ticketId: string) => {
    if (!response.trim()) {
      toast.error('يرجى إدخال الرد');
      return;
    }

    const updateData: any = {
      admin_response: response,
      updated_at: new Date().toISOString(),
    };

    if (newStatus) {
      updateData.status = newStatus;
    }

    const { error } = await supabase
      .from('support_tickets')
      .update(updateData)
      .eq('id', ticketId);

    if (!error) {
      await logAdminAction(adminId, 'respond_ticket', 'support_ticket', ticketId, {
        response: response.substring(0, 100),
        new_status: newStatus,
      });

      toast.success('تم إرسال الرد بنجاح');
      setResponse('');
      setNewStatus('');
      setSelectedTicket(null);
      fetchTickets();
    } else {
      toast.error('فشل إرسال الرد');
    }
  };

  const handleUpdateStatus = async (ticketId: string, status: string) => {
    const { error } = await supabase
      .from('support_tickets')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', ticketId);

    if (!error) {
      await logAdminAction(adminId, 'update_ticket_status', 'support_ticket', ticketId, {
        new_status: status,
      });

      toast.success('تم تحديث حالة التذكرة');
      fetchTickets();
    } else {
      toast.error('فشل تحديث الحالة');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="destructive" className="gap-1"><Clock className="h-3 w-3" />معلق</Badge>;
      case 'in_progress':
        return <Badge variant="secondary" className="gap-1"><MessageSquare className="h-3 w-3" />قيد المعالجة</Badge>;
      case 'resolved':
        return <Badge variant="default" className="gap-1"><CheckCircle className="h-3 w-3" />تم الحل</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="gap-1"><XCircle className="h-3 w-3" />مرفوض</Badge>;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'معلق';
      case 'in_progress': return 'قيد المعالجة';
      case 'resolved': return 'تم الحل';
      case 'rejected': return 'مرفوض';
      default: return status;
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
        <TabsTrigger value="pending">معلقة</TabsTrigger>
        <TabsTrigger value="in_progress">قيد المعالجة</TabsTrigger>
        <TabsTrigger value="resolved">محلولة</TabsTrigger>
        <TabsTrigger value="rejected">مرفوضة</TabsTrigger>
        <TabsTrigger value="all">الكل</TabsTrigger>
      </TabsList>

      <TabsContent value={activeTab} className="space-y-4">
        <div className="grid gap-4">
          {tickets.map((ticket) => (
            <Card key={ticket.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      {ticket.title}
                      <span className="text-xs text-muted-foreground font-normal">
                        #{ticket.ticket_number}
                      </span>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {ticket.profiles ? `@${ticket.profiles.username}` : ticket.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(ticket.created_at).toLocaleDateString('ar', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {getStatusBadge(ticket.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-semibold mb-1">الوصف:</p>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                    {ticket.description}
                  </p>
                </div>

                {ticket.images && ticket.images.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-2">الصور المرفقة:</p>
                    <div className="flex gap-2 flex-wrap">
                      {ticket.images.map((img, i) => (
                        <a
                          key={i}
                          href={img}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-500 hover:underline"
                        >
                          صورة {i + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {ticket.admin_response && (
                  <div>
                    <p className="text-sm font-semibold mb-1">رد الإدارة:</p>
                    <p className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950 p-3 rounded-md border border-blue-200 dark:border-blue-800">
                      {ticket.admin_response}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="default"
                        className="gap-2"
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setResponse(ticket.admin_response || '');
                        }}
                      >
                        <MessageSquare className="h-4 w-4" />
                        {ticket.admin_response ? 'تحديث الرد' : 'الرد'}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>الرد على التذكرة #{ticket.ticket_number}</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-3">
                          <div>
                            <label className="text-sm font-semibold text-foreground block mb-2">
                              الرد:
                            </label>
                            <Textarea
                              placeholder="اكتب ردك هنا..."
                              value={response}
                              onChange={(e) => setResponse(e.target.value)}
                              rows={6}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-semibold text-foreground block mb-2">
                              تحديث الحالة (اختياري):
                            </label>
                            <Select value={newStatus} onValueChange={setNewStatus}>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر الحالة الجديدة" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="in_progress">قيد المعالجة</SelectItem>
                                <SelectItem value="resolved">تم الحل</SelectItem>
                                <SelectItem value="rejected">مرفوض</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                          setResponse('');
                          setNewStatus('');
                        }}>
                          إلغاء
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleRespondToTicket(ticket.id)}>
                          إرسال الرد
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  {ticket.status !== 'in_progress' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(ticket.id, 'in_progress')}
                    >
                      بدء المعالجة
                    </Button>
                  )}

                  {ticket.status !== 'resolved' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(ticket.id, 'resolved')}
                      className="gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      حل
                    </Button>
                  )}

                  {ticket.status !== 'rejected' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(ticket.id, 'rejected')}
                      className="gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      رفض
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {tickets.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            لا توجد تذاكر
          </p>
        )}
      </TabsContent>
    </Tabs>
  );
}
