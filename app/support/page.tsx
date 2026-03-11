'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Upload, X, CircleCheck as CheckCircle } from 'lucide-react';

export default function SupportPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');
  const [error, setError] = useState('');

  const addImage = () => {
    const url = imageInput.trim();
    if (url && images.length < 3 && !images.includes(url)) {
      setImages([...images, url]);
      setImageInput('');
    }
  };

  const removeImage = (url: string) => {
    setImages(images.filter((img) => img !== url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!title.trim() || !description.trim() || !email.trim()) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      setLoading(false);
      return;
    }

    const { data, error: insertError } = await supabase
      .from('support_tickets')
      .insert({
        user_id: user?.id,
        email,
        title,
        description,
        images,
        status: 'pending',
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    if (data) {
      setTicketNumber(data.ticket_number);
      setSubmitted(true);
    }

    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-2xl mx-auto p-4">
          <Card>
            <CardContent className="py-12 text-center space-y-4">
              <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
              <h2 className="text-2xl font-bold">تم استلام طلبك بنجاح</h2>
              <p className="text-muted-foreground">
                رقم التذكرة: <span className="font-mono font-bold text-purple-500">{ticketNumber}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                سنقوم بمراجعة طلبك والرد عليك في أقرب وقت ممكن عبر البريد الإلكتروني
              </p>
              <Button onClick={() => router.push('/')} className="gradient-purple mt-4">
                العودة للرئيسية
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-2xl mx-auto p-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">الإبلاغ عن مشكلة</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                رجوع
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-right"
                  placeholder="your@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">عنوان المشكلة *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  maxLength={100}
                  className="text-right"
                  placeholder="اكتب عنوان المشكلة..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">وصف المشكلة *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={6}
                  className="text-right resize-none"
                  placeholder="اشرح المشكلة بالتفصيل..."
                />
              </div>

              <div className="space-y-2">
                <Label>الصور (اختياري - حد أقصى 3)</Label>
                <div className="flex gap-2">
                  <Input
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                    placeholder="رابط الصورة..."
                    disabled={images.length >= 3}
                    className="text-right"
                  />
                  <Button
                    type="button"
                    onClick={addImage}
                    disabled={images.length >= 3 || !imageInput.trim()}
                    variant="outline"
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {images.map((img, index) => (
                      <div key={img} className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
                        <img
                          src={img}
                          alt={`صورة ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(img)}
                          className="absolute top-1 left-1 bg-black/70 hover:bg-black rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  {images.length}/3 صور
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full gradient-purple"
              >
                {loading ? 'جاري الإرسال...' : 'إرسال البلاغ'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
