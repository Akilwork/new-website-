'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  LayoutDashboard,
  Layers,
  Image as ImageIcon,
  Users,
  ChevronDown,
  LogOut,
  Home,
  Info,
  Briefcase,
  FolderGit2,
  PhoneCall,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Newspaper,
  Building2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSidebar } from './SidebarContext'

interface SubMenuItem {
  label: string
  href: string
  pageKey: string
  icon: React.ElementType
}

const pagesSubMenu: SubMenuItem[] = [
  { label: 'Home', href: '/pages?page=home', pageKey: 'home', icon: Home },
  { label: 'About', href: '/pages?page=about', pageKey: 'about', icon: Info },
  { label: 'Service', href: '/pages?page=service', pageKey: 'service', icon: Briefcase },
  { label: 'Portfolio', href: '/pages?page=portfolio', pageKey: 'portfolio', icon: FolderGit2 },
  { label: 'Contact', href: '/pages?page=contact', pageKey: 'contact', icon: PhoneCall },
]

export default function Sidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentPageParam = searchParams.get('page')

  const {
    isMobileOpen,
    closeMobileSidebar,
    isDesktopCollapsed,
    toggleDesktopCollapsed,
  } = useSidebar()

  const isPagesActive = pathname === '/pages' || pathname.startsWith('/pages/')
  const [pagesOpen, setPagesOpen] = useState(true)

  // Keep submenu expanded if user is navigating within pages
  useEffect(() => {
    if (isPagesActive) {
      setPagesOpen(true)
    }
  }, [isPagesActive])

  // Don't render sidebar on login page
  if (pathname === '/login') return null

  const isDashboardActive = pathname === '/dashboard' || pathname === '/'
  const isMediaActive = pathname === '/media' || pathname.startsWith('/media/')
  const isClientLogosActive = pathname === '/client-logos' || pathname.startsWith('/client-logos/')
  const isBlogsActive = pathname === '/blogs' || pathname.startsWith('/blogs/')
  const isUsersActive = pathname === '/users' || pathname.startsWith('/users/')

  const navContent = (isMobile: boolean) => (
    <div className="flex flex-col h-full select-none">
      {/* ================= Header ================= */}
      <div className="h-16 px-4 sm:px-5 border-b border-zinc-800/80 flex items-center justify-between shrink-0">
        <Link
          href="/dashboard"
          onClick={() => isMobile && closeMobileSidebar()}
          className="flex items-center gap-3 group transition-transform active:scale-[0.98] overflow-hidden"
        >
          <img
            src="/Docme.png"
            alt="DocMe Logo"
            className="w-7 h-7 object-contain shrink-0"
          />
          {(!isDesktopCollapsed || isMobile) && (
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm tracking-tight text-white truncate">
                  DocMe CMS
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 shrink-0">
                  PRO
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 truncate">Website Admin</span>
            </div>
          )}
        </Link>

        {/* Mobile Close Button */}
        {isMobile && (
          <button
            type="button"
            onClick={closeMobileSidebar}
            aria-label="Close sidebar"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Desktop Collapse Toggle */}
        {!isMobile && (
          <button
            type="button"
            onClick={toggleDesktopCollapsed}
            title={isDesktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isDesktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            {isDesktopCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* ================= Navigation Content ================= */}
      <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto overflow-x-hidden scrollbar-thin">
        {/* Main Menu Group */}
        <div className="space-y-1">
          {/* Group Label */}
          {(!isDesktopCollapsed || isMobile) && (
            <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
              Main Menu
            </div>
          )}

          {/* 1. Dashboard */}
          <Link
            href="/dashboard"
            onClick={() => isMobile && closeMobileSidebar()}
            title={isDesktopCollapsed && !isMobile ? 'Dashboard' : undefined}
            className={cn(
              'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
              isDesktopCollapsed && !isMobile ? 'justify-center px-2' : '',
              isDashboardActive
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/60'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
            )}
          >
            <LayoutDashboard
              className={cn(
                'w-4 h-4 shrink-0 transition-colors',
                isDashboardActive ? 'text-white' : 'text-zinc-400 group-hover:text-white'
              )}
            />
            {(!isDesktopCollapsed || isMobile) && <span>Dashboard</span>}
          </Link>

          {/* 2. Pages & Sections with Submenu */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => {
                if (isDesktopCollapsed && !isMobile) {
                  toggleDesktopCollapsed()
                  setPagesOpen(true)
                } else {
                  setPagesOpen(!pagesOpen)
                }
              }}
              title={isDesktopCollapsed && !isMobile ? 'Pages & Sections' : undefined}
              className={cn(
                'w-full group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left',
                isDesktopCollapsed && !isMobile ? 'justify-center px-2' : '',
                isPagesActive
                  ? 'bg-zinc-800/90 text-white border border-zinc-700/50'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Layers
                  className={cn(
                    'w-4 h-4 shrink-0 transition-colors',
                    isPagesActive ? 'text-white' : 'text-zinc-400 group-hover:text-white'
                  )}
                />
                {(!isDesktopCollapsed || isMobile) && (
                  <span className="truncate">Pages &amp; Sections</span>
                )}
              </div>
              {(!isDesktopCollapsed || isMobile) && (
                <ChevronDown
                  className={cn(
                    'w-4 h-4 text-zinc-400 transition-transform duration-200 shrink-0',
                    pagesOpen ? 'rotate-180 text-zinc-200' : ''
                  )}
                />
              )}
            </button>

            {/* Submenu: Home, About, Service, Portfolio, Contact */}
            {pagesOpen && (!isDesktopCollapsed || isMobile) && (
              <div className="pl-4 space-y-1 pt-1 pb-1">
                {pagesSubMenu.map((sub) => {
                  const SubIcon = sub.icon
                  const isSubActive =
                    isPagesActive &&
                    (currentPageParam ? currentPageParam === sub.pageKey : sub.pageKey === 'home')

                  return (
                    <Link
                      key={sub.pageKey}
                      href={sub.href}
                      onClick={() => isMobile && closeMobileSidebar()}
                      className={cn(
                        'group flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all',
                        isSubActive
                          ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
                      )}
                    >
                      <SubIcon
                        className={cn(
                          'w-3.5 h-3.5 shrink-0 transition-colors',
                          isSubActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'
                        )}
                      />
                      <span className="truncate">{sub.label}</span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* 3. Client Logos */}
          <Link
            href="/client-logos"
            onClick={() => isMobile && closeMobileSidebar()}
            title={isDesktopCollapsed && !isMobile ? 'Client Logos' : undefined}
            className={cn(
              'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
              isDesktopCollapsed && !isMobile ? 'justify-center px-2' : '',
              isClientLogosActive
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/60'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
            )}
          >
            <Building2
              className={cn(
                'w-4 h-4 shrink-0 transition-colors',
                isClientLogosActive ? 'text-white' : 'text-zinc-400 group-hover:text-white'
              )}
            />
            {(!isDesktopCollapsed || isMobile) && <span>Client Logos</span>}
          </Link>

          {/* 4. Media Library */}
          <Link
            href="/media"
            onClick={() => isMobile && closeMobileSidebar()}
            title={isDesktopCollapsed && !isMobile ? 'Media Library' : undefined}
            className={cn(
              'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
              isDesktopCollapsed && !isMobile ? 'justify-center px-2' : '',
              isMediaActive
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/60'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
            )}
          >
            <ImageIcon
              className={cn(
                'w-4 h-4 shrink-0 transition-colors',
                isMediaActive ? 'text-white' : 'text-zinc-400 group-hover:text-white'
              )}
            />
            {(!isDesktopCollapsed || isMobile) && <span>Media Library</span>}
          </Link>

          {/* 4. Blogs */}
          <Link
            href="/blogs"
            onClick={() => isMobile && closeMobileSidebar()}
            title={isDesktopCollapsed && !isMobile ? 'Blogs' : undefined}
            className={cn(
              'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
              isDesktopCollapsed && !isMobile ? 'justify-center px-2' : '',
              isBlogsActive
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/60'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
            )}
          >
            <Newspaper
              className={cn(
                'w-4 h-4 shrink-0 transition-colors',
                isBlogsActive ? 'text-white' : 'text-zinc-400 group-hover:text-white'
              )}
            />
            {(!isDesktopCollapsed || isMobile) && <span>Blogs</span>}
          </Link>

          {/* 4. User & Role */}
          <Link
            href="/users"
            onClick={() => isMobile && closeMobileSidebar()}
            title={isDesktopCollapsed && !isMobile ? 'User & Role' : undefined}
            className={cn(
              'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
              isDesktopCollapsed && !isMobile ? 'justify-center px-2' : '',
              isUsersActive
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/60'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
            )}
          >
            <Users
              className={cn(
                'w-4 h-4 shrink-0 transition-colors',
                isUsersActive ? 'text-white' : 'text-zinc-400 group-hover:text-white'
              )}
            />
            {(!isDesktopCollapsed || isMobile) && <span>User &amp; Role</span>}
          </Link>
        </div>
      </div>

      {/* ================= Footer ================= */}
      <div className="p-3 border-t border-zinc-800/80 space-y-2 shrink-0">
        <div
          className={cn(
            'flex items-center justify-between p-2 rounded-lg bg-zinc-950 border border-zinc-800/70',
            isDesktopCollapsed && !isMobile ? 'justify-center p-1.5' : ''
          )}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-semibold text-white shrink-0">
              AD
            </div>
            {(!isDesktopCollapsed || isMobile) && (
              <div className="truncate">
                <p className="text-xs font-medium text-white truncate">Admin User</p>
                <p className="text-[11px] text-zinc-400 truncate">admin@docme.com</p>
              </div>
            )}
          </div>
          {(!isDesktopCollapsed || isMobile) && (
            <Link
              href="/login"
              title="Sign out"
              aria-label="Sign out"
              className="p-1.5 rounded-md text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* ================= MOBILE / TABLET DRAWER OVERLAY ================= */}
      <div
        className={cn(
          'fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300',
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none invisible'
        )}
        onClick={closeMobileSidebar}
        aria-hidden="true"
      />

      {/* Mobile Drawer Panel */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-black text-zinc-100 border-r border-zinc-800 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden flex flex-col',
          isMobileOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none invisible'
        )}
        data-sidebar="mobile-drawer"
        aria-label="Mobile Navigation"
      >
        {navContent(true)}
      </aside>

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-black text-zinc-100 border-r border-zinc-800/80 min-h-screen shrink-0 transition-all duration-300 sticky top-0 h-screen',
          isDesktopCollapsed ? 'w-20' : 'w-64'
        )}
        data-sidebar="desktop-sidebar"
        aria-label="Desktop Navigation"
      >
        {navContent(false)}
      </aside>
    </>
  )
}
