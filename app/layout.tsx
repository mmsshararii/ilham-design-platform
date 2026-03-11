import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth-context';
import { FABCreatePost } from '@/components/fab-create-post';

export const metadata: Metadata = {
  title: 'استلهم - منصة المصممين والمبدعين',
  description: 'منصة عربية لمشاركة التصاميم وطلب الخدمات التصميمية',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <AuthProvider>
          {children}
          <FABCreatePost />
        </AuthProvider>
      </body>
    </html>
  );
}
