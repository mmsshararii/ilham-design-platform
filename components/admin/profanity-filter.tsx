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
import { Loader as Loader2, Plus, Trash2, TriangleAlert as AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface ProfanityWord {
  id: string;
  word: string;
  severity: 'low' | 'medium' | 'high';
  created_at: string;
}

interface ProfanityFilterProps {
  adminId: string;
}

export function ProfanityFilter({ adminId }: ProfanityFilterProps) {
  const [words, setWords] = useState<ProfanityWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [newWord, setNewWord] = useState('');
  const [newSeverity, setNewSeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  useEffect(() => {
    fetchWords();
  }, [filterSeverity]);

  const fetchWords = async () => {
    setLoading(true);
    const query = supabase
      .from('profanity_filters')
      .select('*')
      .order('created_at', { ascending: false });

    if (filterSeverity !== 'all') {
      query.eq('severity', filterSeverity);
    }

    const { data } = await query;

    if (data) {
      setWords(data);
    }
    setLoading(false);
  };

  const handleAddWord = async () => {
    if (!newWord.trim()) {
      toast.error('يرجى إدخال الكلمة');
      return;
    }

    const { error } = await supabase
      .from('profanity_filters')
      .insert({
        word: newWord.trim().toLowerCase(),
        severity: newSeverity,
      });

    if (!error) {
      await logAdminAction(adminId, 'add_profanity_word', 'profanity_filter', undefined, {
        word: newWord,
        severity: newSeverity,
      });

      toast.success('تمت إضافة الكلمة بنجاح');
      setNewWord('');
      setNewSeverity('medium');
      fetchWords();
    } else if (error.code === '23505') {
      toast.error('هذه الكلمة موجودة بالفعل');
    } else {
      toast.error('فشل إضافة الكلمة');
    }
  };

  const handleDeleteWord = async (id: string, word: string) => {
    const { error } = await supabase
      .from('profanity_filters')
      .delete()
      .eq('id', id);

    if (!error) {
      await logAdminAction(adminId, 'remove_profanity_word', 'profanity_filter', id, {
        word,
      });

      toast.success('تم حذف الكلمة بنجاح');
      fetchWords();
    } else {
      toast.error('فشل حذف الكلمة');
    }
  };

  const handleUpdateSeverity = async (id: string, word: string, severity: string) => {
    const { error } = await supabase
      .from('profanity_filters')
      .update({ severity })
      .eq('id', id);

    if (!error) {
      await logAdminAction(adminId, 'update_profanity_severity', 'profanity_filter', id, {
        word,
        new_severity: severity,
      });

      toast.success('تم تحديث مستوى الخطورة');
      fetchWords();
    } else {
      toast.error('فشل التحديث');
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'low':
        return <Badge variant="secondary">منخفض</Badge>;
      case 'medium':
        return <Badge variant="default">متوسط</Badge>;
      case 'high':
        return <Badge variant="destructive">عالي</Badge>;
      default:
        return null;
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'low': return 'منخفض';
      case 'medium': return 'متوسط';
      case 'high': return 'عالي';
      default: return severity;
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">إضافة كلمة جديدة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-col sm:flex-row">
            <Input
              placeholder="الكلمة المحظورة..."
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddWord()}
              className="flex-1"
            />
            <Select value={newSeverity} onValueChange={(v) => setNewSeverity(v as any)}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">منخفض</SelectItem>
                <SelectItem value="medium">متوسط</SelectItem>
                <SelectItem value="high">عالي</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAddWord} className="gap-2">
              <Plus className="h-4 w-4" />
              إضافة
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">الكلمات المحظورة ({words.length})</h3>
        <Select value={filterSeverity} onValueChange={setFilterSeverity}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">الكل</SelectItem>
            <SelectItem value="low">منخفض</SelectItem>
            <SelectItem value="medium">متوسط</SelectItem>
            <SelectItem value="high">عالي</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3">
        {words.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-sm font-semibold">{item.word}</span>
                  {getSeverityBadge(item.severity)}
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={item.severity}
                    onValueChange={(v) => handleUpdateSeverity(item.id, item.word, v)}
                  >
                    <SelectTrigger className="w-[120px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">منخفض</SelectItem>
                      <SelectItem value="medium">متوسط</SelectItem>
                      <SelectItem value="high">عالي</SelectItem>
                    </SelectContent>
                  </Select>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>حذف الكلمة</AlertDialogTitle>
                        <AlertDialogDescription>
                          هل أنت متأكد من حذف الكلمة "{item.word}"؟
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteWord(item.id, item.word)}>
                          حذف
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {words.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          لا توجد كلمات محظورة
        </p>
      )}
    </div>
  );
}
