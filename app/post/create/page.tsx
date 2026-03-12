'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/navbar';
import { FormAlert } from '@/components/ui/form-alert';
import { ArrowRight, X, Plus } from 'lucide-react';
import { toast } from 'sonner';

const postTypes = [
  { value: 'my_design', label: 'تصميمي', description: 'شارك تصميماتك الخاصة' },
  { value: 'design_offer', label: 'عرض تصميم', description: 'قدم خدمات تصميمية' },
  { value: 'design_request', label: 'طلب تصميم', description: 'اطلب تصميماً محدداً' },
  { value: 'general', label: 'منشور عام', description: 'منشور عام أو نقاش' },
];

export default function CreatePostPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [postType, setPostType] = useState<'my_design' | 'design_offer' | 'design_request' | 'general'>('my_design');
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [attachmentInput, setAttachmentInput] = useState('');
  const [price, setPrice] = useState('');
  const [priceNegotiable, setPriceNegotiable] = useState(false);
  const [commissionAgreed, setCommissionAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">جاري التحميل...</div>
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  const addHashtag = () => {
    let tag = hashtagInput.trim().replace('#', '');
    tag = tag.replace(/\s+/g, '_');
    if (tag && hashtags.length < 5 && !hashtags.includes(tag)) {
      setHashtags([...hashtags, tag]);
      setHashtagInput('');
    }
  };

  const removeHashtag = (tag: string) => {
    setHashtags(hashtags.filter((t) => t !== tag));
  };

  const isValidImageUrl = (url: string) => {
    try {
      new URL(url);
      return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url) || url.includes('pexels') || url.includes('unsplash') || url.includes('imgur');
    } catch {
      return false;
    }
  };

  const addImage = () => {
    const url = imageInput.trim();
    if (!url) return;

    if (!isValidImageUrl(url)) {
      setError('رابط الصورة غير صالح. يرجى استخدام روابط صور صحيحة.');
      return;
    }

    if (images.length < 15 && !images.includes(url)) {
      setImages([...images, url]);
      setImageInput('');
      setError('');
    }
  };

  const addAttachment = () => {
    const url = attachmentInput.trim();
    if (!url) return;

    try {
      new URL(url);
      if (attachments.length < 4 && !attachments.includes(url)) {
        setAttachments([...attachments, url]);
        setAttachmentInput('');
      }
    } catch {
      setError('رابط المرفق غير صالح');
    }
  };

  const removeAttachment = (url: string) => {
    setAttachments(attachments.filter((att) => att !== url));
  };

  const removeImage = (url: string) => {
    setImages(images.filter((img) => img !== url));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  if (description.length > 300) {
    setError('الوصف يجب ألا يتجاوز 300 حرف');
    setLoading(false);
    return;
  }

  if ((postType === 'design_offer' || postType === 'design_request') && !commissionAgreed) {
    setError('يجب الموافقة على دفع عمولة 20٪ للموقع لنشر هذا النوع من المنشورات');
    setLoading(false);
    return;
  }
console.log("attachments:", attachments);
  const { error: insertError } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      post_type: postType,
      description,
      hashtags,
      images,
      attachments, // ← هنا يتم حفظ المرفقات مباشرة
      price: price ? parseFloat(price) : null,
      price_negotiable: priceNegotiable,
      commission_agreed: commissionAgreed,
    });

  if (insertError) {
    setError(insertError.message);
    setLoading(false);
    return;
  }

  toast.success('تم نشر المنشور بنجاح');
  router.push('/');
};

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-2xl mx-auto p-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">منشور جديد</CardTitle>
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
                <Label>نوع المنشور</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {postTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setPostType(type.value as any)}
                      className={`p-3 rounded-lg border-2 transition-all text-right ${
                        postType === type.value
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-border hover:border-purple-500/50'
                      }`}
                    >
                      <div className="font-semibold text-sm">{type.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {type.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  maxLength={300}
                  rows={6}
                  className="text-right resize-none"
                  placeholder="اكتب وصف منشورك هنا..."
                />
                <p className="text-xs text-muted-foreground text-left">
                  {description.length}/300 حرف
                </p>
              </div>

              <div className="space-y-2">
                <Label>الوسوم (اختياري)</Label>
                <div className="flex gap-2">
                  <Input
                    value={hashtagInput}
                    onChange={(e) => setHashtagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHashtag())}
                    placeholder="أضف وسم..."
                    disabled={hashtags.length >= 5}
                    className="text-right"
                  />
                  <Button
                    type="button"
                    onClick={addHashtag}
                    disabled={hashtags.length >= 5 || !hashtagInput.trim()}
                    variant="outline"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {hashtags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center gap-1 bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeHashtag(tag)}
                          className="hover:text-purple-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  {hashtags.length}/5 وسوم
                </p>
              </div>

              <div className="space-y-2">
                <Label>الصور (اختياري)</Label>
                <div className="flex gap-2">
                  <Input
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                    placeholder="رابط الصورة..."
                    disabled={images.length >= 15}
                    className="text-right"
                  />
                  <Button
                    type="button"
                    onClick={addImage}
                    disabled={images.length >= 15 || !imageInput.trim()}
                    variant="outline"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {images.map((img, index) => (
                      <div key={img} className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
                        <img
                          src={img}
                          alt={`Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(img)}
                          className="absolute top-1 left-1 bg-black/70 hover:bg-black rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3 text-white" />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-1 right-1 bg-purple-500/90 px-2 py-0.5 rounded text-xs text-white">
                            رئيسية
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  {images.length}/15 صورة
                </p>
              </div>

              {(postType === 'design_offer' || postType === 'design_request') && (
                <div className="space-y-3 p-4 border border-purple-500/30 rounded-lg bg-purple-500/5">
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      {postType === 'design_offer' ? 'سعر التصميم (ريال سعودي)' : 'الميزانية المتاحة (ريال سعودي)'}
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      className="text-right"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="negotiable"
                      checked={priceNegotiable}
                      onChange={(e) => setPriceNegotiable(e.target.checked)}
                      className="rounded border-purple-500"
                    />
                    <Label htmlFor="negotiable" className="text-sm font-normal cursor-pointer">
                      السعر قابل للتفاوض
                    </Label>
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
                    <input
                      type="checkbox"
                      id="commission"
                      checked={commissionAgreed}
                      onChange={(e) => setCommissionAgreed(e.target.checked)}
                      className="mt-1 rounded border-yellow-500"
                      required
                    />
                    <Label htmlFor="commission" className="text-sm font-normal cursor-pointer text-right flex-1">
                      أتعهد بدفع عمولة 20٪ للموقع من قيمة الاتفاق النهائي.
                    </Label>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>المرفقات (اختياري)</Label>
                <p className="text-xs text-muted-foreground">أضف روابط لملفات أو مستندات إضافية (حد أقصى 4)</p>
                <div className="flex gap-2">
                  <Input
                    value={attachmentInput}
                    onChange={(e) => setAttachmentInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAttachment())}
                    placeholder="رابط المرفق..."
                    disabled={attachments.length >= 4}
                    className="text-right"
                  />
                  <Button
                    type="button"
                    onClick={addAttachment}
                    disabled={attachments.length >= 4 || !attachmentInput.trim()}
                    variant="outline"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {attachments.length > 0 && (
                  <div className="space-y-1 mt-2">
                    {attachments.map((att, index) => (
                      <div
                        key={att}
                        className="flex items-center justify-between gap-2 p-2 bg-purple-500/10 border border-purple-500/20 rounded text-sm"
                      >
                        <span className="flex-1 truncate text-right">المرفق {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(att)}
                          className="hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  {attachments.length}/4 مرفقات
                </p>
              </div>

              {error && <FormAlert type="error" message={error} />}

              <Button
                type="submit"
                disabled={loading}
                className="w-full gradient-purple"
              >
                {loading ? 'جاري النشر...' : 'نشر المنشور'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
