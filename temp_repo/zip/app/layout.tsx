import type {Metadata} from 'next';
import { Geist } from 'next/font/google';
import './globals.css'; // Global styles

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
});

export const metadata: Metadata = {
  title: 'Rajneesh Sharma | Portfolio',
  description: 'Portfolio of Rajneesh Sharma, SDE and Ex-Adobe.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={geist.variable}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
