'use client';

import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto p-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl">شروط الاستخدام</CardTitle>
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
                <h2 className="text-2xl font-bold mb-4">1. القبول بالشروط</h2>
                <p className="text-muted-foreground leading-relaxed">
                  باستخدامك لمنصة استلهم، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام المنصة.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. استخدام المنصة</h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  تلتزم بما يلي عند استخدام منصة استلهم:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mr-4">
                  <li>عدم نشر محتوى مخالف للقوانين أو مسيء</li>
                  <li>احترام حقوق الملكية الفكرية للآخرين</li>
                  <li>عدم انتحال هوية الآخرين أو التصرف بطريقة احتيالية</li>
                  <li>عدم استخدام المنصة لأغراض غير قانونية</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. حسابات المستخدمين</h2>
                <p className="text-muted-foreground leading-relaxed">
                  أنت مسؤول عن الحفاظ على سرية حسابك وكلمة المرور الخاصة بك. توافق على قبول المسؤولية عن جميع الأنشطة التي تحدث تحت حسابك.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. المحتوى المنشور</h2>
                <p className="text-muted-foreground leading-relaxed">
                  أنت تحتفظ بجميع حقوق المحتوى الذي تنشره على المنصة. ومع ذلك، من خلال النشر، فإنك تمنح استلهم ترخيصاً غير حصري لاستخدام وعرض وتوزيع المحتوى الخاص بك على المنصة.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. السلوك المحظور</h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  يُحظر عليك:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mr-4">
                  <li>نشر محتوى مسيء أو تمييزي أو يحض على الكراهية</li>
                  <li>التحرش أو التنمر على مستخدمين آخرين</li>
                  <li>نشر معلومات خاصة للآخرين دون إذنهم</li>
                  <li>استخدام برامج آلية أو روبوتات للوصول إلى المنصة</li>
                  <li>محاولة اختراق أو تعطيل المنصة</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. حقوق الملكية الفكرية</h2>
                <p className="text-muted-foreground leading-relaxed">
                  جميع المحتويات والمواد المتاحة على منصة استلهم، بما في ذلك النصوص والرسومات والشعارات، هي ملك لاستلهم أو مرخصيها ومحمية بموجب قوانين حقوق النشر.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">7. إخلاء المسؤولية</h2>
                <p className="text-muted-foreground leading-relaxed">
                  يتم توفير المنصة "كما هي" و"حسب التوافر". لا نضمن أن المنصة ستكون خالية من الأخطاء أو متاحة دون انقطاع.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">8. التعديلات على الشروط</h2>
                <p className="text-muted-foreground leading-relaxed">
                  نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطارك بأي تغييرات جوهرية عبر المنصة.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">9. الإنهاء</h2>
                <p className="text-muted-foreground leading-relaxed">
                  نحتفظ بالحق في تعليق أو إنهاء حسابك في أي وقت، لأي سبب، دون إشعار مسبق.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">10. الاتصال بنا</h2>
                <p className="text-muted-foreground leading-relaxed">
                  إذا كان لديك أي أسئلة حول هذه الشروط، يرجى الاتصال بنا عبر صفحة الدعم.
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
