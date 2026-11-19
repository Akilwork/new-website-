import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'
import './globals.css'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { SidebarProvider } from '../components/SidebarContext'

export const metadata: Metadata = {
  title: 'DocMe CMS - Admin Portal',
  description: 'DocMe Content Management System',
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/favicon-light.png',
        sizes: '32x32',
        type: 'image/png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/favicon-dark.png',
        sizes: '32x32',
        type: 'image/png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
    ],
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#f8fafc] text-slate-900 min-h-screen antialiased">
        <SidebarProvider>
          <div className="flex min-h-screen w-full relative">
            <Suspense fallback={<div className="hidden lg:block w-64 bg-black min-h-screen shrink-0" />}>
              <Sidebar />
            </Suspense>
            <div className="flex-1 flex flex-col min-h-screen min-w-0 bg-[#f8fafc] overflow-x-hidden">
              <Header />
              <main className="flex-1 p-3.5 sm:p-6 lg:p-8 overflow-y-auto min-w-0">{children}</main>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}
