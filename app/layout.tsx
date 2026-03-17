import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth-context';
import { FloatingLogout } from '@/components/floating-logout';

export const metadata: Metadata = {
  title: 'ILHAM - منصة التواصل والتصاميم',
  description: 'منصة عربية لمشاركة التصاميم والمحتوى',
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
          <FloatingLogout />
        </AuthProvider>
      </body>
    </html>
  );
}
