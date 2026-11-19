'use client'

import { usePathname } from 'next/navigation'
import { Bell, UserCheck, ExternalLink, Menu } from 'lucide-react'
import { useSidebar } from './SidebarContext'

export default function Header() {
  const pathname = usePathname()
  const { toggleMobileSidebar } = useSidebar()

  if (pathname === '/login') return null

  return (
    <header className="h-16 border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-3 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors shrink-0">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile Hamburger Menu Toggle Button */}
        <button
          type="button"
          onClick={toggleMobileSidebar}
          aria-label="Open mobile navigation"
          className="lg:hidden p-2 -ml-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-4 shrink-0">
        {/* Link to public website - responsive button */}
        <a
          href={process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3002'}
          target="_blank"
          rel="noreferrer"
          title="View Live Site (localhost:3002)"
          className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
        >
          <span className="hidden sm:inline">View Live Site</span>
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
        </a>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-500" />
        </button>

        {/* User preview */}
        <div className="flex items-center gap-2 sm:gap-2.5 pl-2 sm:pl-3 border-l border-slate-200 text-sm">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shadow-sm shrink-0">
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight">Admin User</p>
            <p className="text-[10px] text-slate-500 leading-tight">admin@docme.com</p>
          </div>
        </div>
      </div>
    </header>
  )
}
