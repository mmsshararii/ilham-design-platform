'use client';

import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function CommissionPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto p-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl">سياسة العمولة</CardTitle>
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
          <CardContent className="prose prose-invert max-w-none">
            <div className="space-y-6 text-right">
              <section>
                <h2 className="text-2xl font-bold mb-4">1. نظرة عامة</h2>
                <p className="text-muted-foreground leading-relaxed">
                  تطبق منصة استلهم نظام عمولة على المعاملات التي تتم عبر المنصة بين المصممين والعملاء. هذه السياسة توضح كيفية عمل نظام العمولة.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. نسبة العمولة</h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  تبلغ نسبة العمولة <strong className="text-purple-400">20%</strong> من قيمة الاتفاق النهائي بين الطرفين.
                </p>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mt-4">
                  <p className="font-semibold text-purple-400 mb-2">مثال توضيحي:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground mr-4">
                    <li>قيمة الاتفاق: 1000 ريال</li>
                    <li>عمولة المنصة (20%): 200 ريال</li>
                    <li>المبلغ الذي يحصل عليه المصمم: 800 ريال</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. المنشورات الخاضعة للعمولة</h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  تطبق العمولة على الأنواع التالية من المنشورات:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mr-4">
                  <li><strong>عروض التصميم:</strong> عندما يقدم مصمم خدمة تصميمية</li>
                  <li><strong>طلبات التصميم:</strong> عندما يطلب عميل تصميماً محدداً</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  المنشورات من نوع "تصميمي" و "منشور عام" <strong>لا تخضع</strong> لنظام العمولة.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. الموافقة على العمولة</h2>
                <p className="text-muted-foreground leading-relaxed">
                  عند إنشاء منشور من نوع "عرض تصميم" أو "طلب تصميم"، يجب على المستخدم الموافقة على التعهد التالي:
                </p>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mt-4">
                  <p className="text-yellow-300 text-center font-semibold">
                    "أتعهد بدفع عمولة 20٪ للموقع من قيمة الاتفاق النهائي."
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  لا يمكن نشر المنشور دون الموافقة على هذا التعهد.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. آلية الدفع</h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  يتم احتساب العمولة وفقاً للخطوات التالية:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground mr-4">
                  <li>يتفق الطرفان على السعر النهائي</li>
                  <li>يقوم صاحب المنشور بقبول العرض (تمييز التعليق المقبول)</li>
                  <li>يتم احتساب العمولة (20%) من القيمة المتفق عليها</li>
                  <li>يتم إصدار فاتورة بالعمولة</li>
                  <li>بعد دفع العمولة، يمكن للطرفين إتمام المعاملة</li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. حماية الطرفين</h2>
                <p className="text-muted-foreground leading-relaxed">
                  نظام العمولة يوفر الحماية التالية:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mr-4 mt-2">
                  <li>توثيق الاتفاقات بين الطرفين</li>
                  <li>توفير سجل واضح للمعاملات</li>
                  <li>إمكانية الرجوع للمنصة في حالة النزاعات</li>
                  <li>ضمان جودة الخدمات المقدمة</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">7. المخالفات والعقوبات</h2>
                <p className="text-muted-foreground leading-relaxed">
                  في حالة محاولة التهرب من دفع العمولة أو إتمام المعاملات خارج المنصة بعد الاتفاق عليها داخل المنصة، تحتفظ استلهم بالحق في:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mr-4 mt-2">
                  <li>تعليق الحساب</li>
                  <li>منع المستخدم من نشر عروض أو طلبات تصميم</li>
                  <li>إنهاء الحساب نهائياً في حالات التكرار</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">8. الاستثناءات</h2>
                <p className="text-muted-foreground leading-relaxed">
                  لا تطبق العمولة في الحالات التالية:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mr-4 mt-2">
                  <li>المنشورات من نوع "تصميمي" (مشاركة تصاميم فقط)</li>
                  <li>المنشورات العامة والنقاشات</li>
                  <li>الاتفاقات التي تتم خارج المنصة تماماً</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">9. التعديلات على السياسة</h2>
                <p className="text-muted-foreground leading-relaxed">
                  نحتفظ بالحق في تعديل نسبة العمولة أو شروط السياسة. سيتم إخطار المستخدمين بأي تغييرات جوهرية قبل 30 يوماً من تطبيقها.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">10. الاستفسارات</h2>
                <p className="text-muted-foreground leading-relaxed">
                  لأي استفسارات حول سياسة العمولة، يرجى التواصل معنا عبر صفحة الدعم.
                </p>
              </section>

              <div className="pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
