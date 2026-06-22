import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: { default: 'FejosBaba TV', template: '%s | FejosBaba TV' },
  description: 'Watch premium Nigerian films and series on FejosBaba TV.',
  keywords: ['Nigerian movies', 'Nollywood', 'film streaming', 'FejosBaba'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
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