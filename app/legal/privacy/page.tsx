'use client';

import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto p-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl">سياسة الخصوصية</CardTitle>
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
                <h2 className="text-2xl font-bold mb-4">1. المعلومات التي نجمعها</h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  نقوم بجمع الأنواع التالية من المعلومات:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mr-4">
                  <li>معلومات الحساب: البريد الإلكتروني، اسم المستخدم، كلمة المرور</li>
                  <li>معلومات الملف الشخصي: السيرة الذاتية، الصورة الشخصية، روابط التواصل الاجتماعي</li>
                  <li>المحتوى: المنشورات، التعليقات، الإعجابات، المفضلة</li>
                  <li>معلومات الاستخدام: سجل التصفح، التفاعلات، الإحصائيات</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. كيف نستخدم معلوماتك</h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  نستخدم المعلومات التي نجمعها للأغراض التالية:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mr-4">
                  <li>تقديم وتحسين خدماتنا</li>
                  <li>تخصيص تجربتك على المنصة</li>
                  <li>التواصل معك بشأن حسابك والتحديثات</li>
                  <li>منع الاحتيال وضمان أمان المنصة</li>
                  <li>تحليل استخدام المنصة لتحسين الأداء</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. مشاركة المعلومات</h2>
                <p className="text-muted-foreground leading-relaxed">
                  لا نبيع معلوماتك الشخصية لأطراف ثالثة. قد نشارك معلوماتك فقط في الحالات التالية:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mr-4 mt-2">
                  <li>مع موافقتك الصريحة</li>
                  <li>للامتثال للقوانين والإجراءات القانونية</li>
                  <li>لحماية حقوقنا وسلامة مستخدمينا</li>
                  <li>مع مقدمي الخدمات الذين يساعدوننا في تشغيل المنصة</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. أمان المعلومات</h2>
                <p className="text-muted-foreground leading-relaxed">
                  نتخذ تدابير أمنية معقولة لحماية معلوماتك من الوصول غير المصرح به أو التغيير أو الإفصاح أو الإتلاف. ومع ذلك، لا يمكن ضمان أمان الإنترنت بنسبة 100%.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. حقوقك</h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  لديك الحقوق التالية فيما يتعلق بمعلوماتك الشخصية:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mr-4">
                  <li>الوصول إلى معلوماتك الشخصية</li>
                  <li>تصحيح المعلومات غير الصحيحة</li>
                  <li>حذف حسابك ومعلوماتك</li>
                  <li>الاعتراض على معالجة معلوماتك</li>
                  <li>تنزيل نسخة من معلوماتك</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. ملفات تعريف الارتباط (Cookies)</h2>
                <p className="text-muted-foreground leading-relaxed">
                  نستخدم ملفات تعريف الارتباط وتقنيات مماثلة لتحسين تجربتك وتحليل استخدام المنصة. يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات المتصفح الخاص بك.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">7. خصوصية الأطفال</h2>
                <p className="text-muted-foreground leading-relaxed">
                  منصتنا غير موجهة للأطفال دون سن 13 عاماً. لا نجمع عن قصد معلومات شخصية من الأطفال دون هذا السن.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">8. التغييرات على سياسة الخصوصية</h2>
                <p className="text-muted-foreground leading-relaxed">
                  قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنخطرك بأي تغييرات جوهرية عن طريق نشر السياسة الجديدة على هذه الصفحة.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">9. الاتصال بنا</h2>
                <p className="text-muted-foreground leading-relaxed">
                  إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى الاتصال بنا عبر صفحة الدعم.
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
