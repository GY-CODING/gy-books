import React from 'react';
import ClientLayout from './ClientLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'WingWords',
  description: 'Tu biblioteca personal de libros',
  keywords: ['libros', 'biblioteca', 'lectura', 'gycoding'],
  authors: [{ name: 'GY Coding' }],
  openGraph: {
    title: 'WingWords',
    description: 'Tu biblioteca personal de libros',
    type: 'website',
    locale: 'es_ES',
    siteName: 'WingWords',
    images: [
      {
        url: '/gy-logo.png',
        width: 1080,
        height: 1080,
        alt: 'GY Books Logo',
      },
    ],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/gy-logo.png',
    apple: '/gy-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/gy-logo.png" />
        <meta name="theme-color" content="#161616" />
      </head>
      <body suppressHydrationWarning={true}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
