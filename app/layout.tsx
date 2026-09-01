import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'DMHCA Email Signature Generator | Official Corporate Signatures',
  description: 'Generate, preview, copy and download email-safe HTML signatures for DMHCA staff with fixed 600px landscape composition.',
  keywords: ['DMHCA', 'Email Signature', 'Signature Generator', 'Healthcare', 'Email Template'],
  authors: [{ name: 'DMHCA Tech Team' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-[#020617] text-slate-100 selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
