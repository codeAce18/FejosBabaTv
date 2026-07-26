import type { Metadata } from 'next';
import { Oswald, Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Providers from '@/components/Providers';
import { defaultMetadata } from '@/lib/seo';

const oswald = Oswald({ subsets: ['latin'], variable: '--font-display', weight: ['400', '500', '600', '700'] });
const inter = Inter({ subsets: ['latin'], variable: '--font-body', weight: ['300', '400', '500', '600'] });

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${oswald.variable} ${inter.variable} font-body bg-cinema-black text-ink-primary antialiased`}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#14141F',
                color: '#FFFFFF',
                border: '1px solid #2A2A3D',
                borderRadius: '10px',
              },
              success: { iconTheme: { primary: '#FF7200', secondary: '#FFFFFF' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#FFFFFF' } },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}