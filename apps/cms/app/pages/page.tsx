'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import SideDrawer from '@/components/SideDrawer'
import PortfolioInnerSectionModal from '@/components/PortfolioInnerSectionModal'
import ServiceInnerSectionModal from '@/components/ServiceInnerSectionModal'
import ProductShowcaseModal from '@/components/ProductShowcaseModal'
import { initialSectionsData, SectionItem } from '@/lib/sectionsData'
import {
  FileText,
  Eye,
  Edit3,
  Layers,
  Search,
  LayoutGrid,
  List,
  CheckCircle2,
  Image as ImageIcon,
  ArrowRight,
  Newspaper,
  EyeOff,
  Globe,
  BarChart3,
  Link as LinkIcon,
  Sliders,
  Plus,
  Video,
  Users,
  Briefcase,
  FolderPlus,
  HelpCircle,
  Sparkles,
  Monitor,
  Trash2,
} from 'lucide-react'
import ConfirmModal from '@/components/ConfirmModal'

const STORAGE_KEY = 'docme_cms_sections_v13'

interface ScreenActionConfig {
  pageKey: string
  buttonLabel: string
  buttonIcon: any
  iconColor: string
  badgeLabel: string
  actionHint: string
  createItem: (existingCount: number) => SectionItem
}


// 5 Separate Screen Action Configurations - completely different functionality per screen
const screenActionConfigs: Record<string, ScreenActionConfig> = {
  home: {
    pageKey: 'home',
    buttonLabel: 'Add',
    buttonIcon: Plus,
    iconColor: 'text-indigo-300',
    badgeLabel: 'Hero Banner Section',
    actionHint: 'Add new homepage Hero video banner with fresh data',
    createItem: (existingCount) => ({
      id: `sec-home-hero-${Date.now()}`,
      pageKey: 'home',
      pageTitle: 'Home',
      pageSlug: '/',
      key: existingCount === 0 ? 'hero' : `hero_${Date.now()}`,
      title: '',
      type: 'Hero Video Banner',
      heading: '',
      description: '',
      image: '',
      mediaType: 'video',
      status: 'Published',
      order: existingCount + 1,
      lastModified: new Date().toISOString().split('T')[0],
    }),
  },
  about: {
    pageKey: 'about',
    buttonLabel: 'Add Section',
    buttonIcon: Plus,
    iconColor: 'text-sky-400',
    badgeLabel: 'About Us Page Sections',
    actionHint: 'Add a new section or highlight module to the About Us page',
    createItem: (existingCount) => ({
      id: `sec-about-custom-${Date.now()}`,
      pageKey: 'about',
      pageTitle: 'About Us',
      pageSlug: '/about',
      key: `about_section_${Date.now()}`,
      title: `About Section #${existingCount + 1}`,
      type: 'Text & Media Highlight',
      heading: 'New About Section',
      description:
        'Docme is dedicated to building intelligent digital ecosystems and empowering organizations worldwide with future-ready platforms.',
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80',
      mediaType: 'image',
      badgeText: '* Docme * Docme * Docme *',
      badgeColor: '#F1BE48',
      cta: { label: 'Discover DocMe', url: '/about#about' },
      status: 'Published',
      order: existingCount + 1,
      lastModified: new Date().toISOString().split('T')[0],
    }),
  },
  service: {
    pageKey: 'service',
    buttonLabel: 'Add Service Offering',
    buttonIcon: Briefcase,
    iconColor: 'text-amber-400',
    badgeLabel: 'Service Offering Stack',
    actionHint: 'Add a new enterprise service capability module with SLA guarantees',
    createItem: (existingCount) => ({
      id: `sec-serv-${Date.now()}`,
      pageKey: 'service',
      pageTitle: 'Services',
      pageSlug: '/services',
      key: `service_offering_${Date.now()}`,
      title: `Service Capability #${existingCount + 1}`,
      type: 'Service Offering',
      heading: '',
      description: '',
      image: '',
      mediaType: 'image',
      features: [
        'Enterprise System Integration',
        'Automated Workflow Engine',
        '24/7 Monitoring & Support',
      ],
      stats: [],
      cta: { label: '', url: '/services' },
      status: 'Published',
      order: existingCount + 1,
      lastModified: new Date().toISOString().split('T')[0],
    }),
  },
  portfolio: {
    pageKey: 'portfolio',
    buttonLabel: 'Add Portfolio Project',
    buttonIcon: FolderPlus,
    iconColor: 'text-emerald-400',
    badgeLabel: 'Portfolio Showcase',
    actionHint: 'Add a verified portfolio showcase item with screenshots and platform tags',
    createItem: (existingCount) => ({
      id: `sec-port-${Date.now()}`,
      pageKey: 'portfolio',
      pageTitle: 'Portfolio',
      pageSlug: `/portfolio/project-${Date.now().toString().slice(-4)}`,
      key: `project_${Date.now()}`,
      title: 'New Portfolio Project',
      type: 'Portfolio Project',
      heading: 'Enterprise Digital Product',
      description:
        'Unified cross-platform system engineered for multi-tenant scalability, mobile responsiveness, and high-volume real-time sync.',
      image: '/assets/Teacher app/10 (dark, light, color).jpg',
      mediaType: 'image',
      galleryImages: [
        '/assets/Teacher app/10 (dark, light, color).jpg',
        '/assets/Teacher app/014.png',
        '/assets/Teacher app/015.png',
      ],
      stats: [
        { value: 'iOS, Android & Web', label: 'Platforms' },
        { value: 'Real-time', label: 'Cloud Sync' },
        { value: '2026', label: 'Release' },
      ],
      cta: {
        label: 'View Project Details',
        url: `/portfolio/project-${Date.now().toString().slice(-4)}`,
      },
      status: 'Published',
      order: existingCount + 1,
      lastModified: new Date().toISOString().split('T')[0],
    }),
  },
  contact: {
    pageKey: 'contact',
    buttonLabel: 'Add FAQ Question',
    buttonIcon: HelpCircle,
    iconColor: 'text-rose-400',
    badgeLabel: 'FAQ & Support',
    actionHint: 'Add a frequently asked question and answer for onboarding clients',
    createItem: (existingCount) => ({
      id: `sec-cont-faq-${Date.now()}`,
      pageKey: 'contact',
      pageTitle: 'Contact',
      pageSlug: '/contact',
      key: `contact_faq_${Date.now()}`,
      title: 'Frequently Asked Question',
      type: 'FAQ Accordion',
      heading: 'Frequently Asked Question',
      description:
        'Provide clear, concise answers to help prospective clients and institutions understand onboarding, deployment schedules, and support agreements.',
      image: '/Docme Logo 1.png',
      mediaType: 'image',
      cta: { label: 'Contact Support', url: '/contact' },
      status: 'Published',
      order: existingCount + 1,
      lastModified: new Date().toISOString().split('T')[0],
    }),
  },
}

const pageMetaMap: Record<string, { title: string; route: string; description: string }> = {
  home: {
    title: 'Home Page Sections',
    route: '/',
    description: 'Hero video banner, trusted partner brands, impact numbers, our story, bento grid, and product showcase.',
  },
  about: {
    title: 'About Us Page Sections',
    route: '/about',
    description: 'Digital ecosystems vision story, leadership team directory, interactive polygon video, and key milestone stats.',
  },
  service: {
    title: 'Services Page Sections',
    route: '/services',
    description: 'Service hero introduction, 8 enterprise service capabilities (Academic Management, Administration, HR, Finance, Transport, Communication, Analytics, Cloud), and SLA guarantees.',
  },
  portfolio: {
    title: 'Portfolio Projects',
    route: '/portfolio',
    description: 'All 4 verified portfolio showcase items: Teacher App, School Dairy, BM Canteen, and Smart Dashboard.',
  },
  contact: {
    title: 'Contact Page Sections',
    route: '/contact',
    description: 'Contact header, direct client inquiry form, global innovation center map, and FAQ accordion sections.',
  },
}

function PagesManagementContent() {
  const searchParams = useSearchParams()
  const pageParam = searchParams.get('page')
  const activePageKey =
    pageParam && pageMetaMap[pageParam.toLowerCase()]
      ? pageParam.toLowerCase()
      : 'home'

  // Local storage persisted sections or default
  const [sections, setSections] = useState<SectionItem[]>(initialSectionsData)
  const [selectedPageFilter, setSelectedPageFilter] = useState<string>(activePageKey)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<SectionItem | null>(null)
  const [drawerTab, setDrawerTab] = useState<'content' | 'preview'>('content')
  const [sectionToDelete, setSectionToDelete] = useState<SectionItem | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const webUrl = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3002'

  // Portfolio Inner Section Modal state
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false)
  const [portfolioModalSection, setPortfolioModalSection] = useState<SectionItem | null>(null)
  const [portfolioModalMode, setPortfolioModalMode] = useState<'view' | 'edit'>('view')

  const handleOpenPortfolioSection = (sec: SectionItem, mode: 'view' | 'edit' = 'view') => {
    setPortfolioModalSection(sec)
    setPortfolioModalMode(mode)
    setIsPortfolioModalOpen(true)
  }

  // Services Showcase Studio Modal state (Section 6: 3 services preview/edit)
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)
  const [serviceModalSection, setServiceModalSection] = useState<SectionItem | null>(null)
  const [serviceModalMode, setServiceModalMode] = useState<'view' | 'edit'>('view')

  const handleOpenServiceSection = (sec: SectionItem, mode: 'view' | 'edit' = 'view') => {
    setServiceModalSection(sec)
    setServiceModalMode(mode)
    setIsServiceModalOpen(true)
  }

  // Product Showcase Studio Modal state (Section 7: BM One Studio)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [productModalSection, setProductModalSection] = useState<SectionItem | null>(null)
  const [productModalMode, setProductModalMode] = useState<'view' | 'edit'>('view')

  const handleOpenProductSection = (sec: SectionItem, mode: 'view' | 'edit' = 'view') => {
    setProductModalSection(sec)
    setProductModalMode(mode)
    setIsProductModalOpen(true)
  }

  // Sync from URL if changed - separate page only
  useEffect(() => {
    if (pageParam && pageMetaMap[pageParam.toLowerCase()]) {
      setSelectedPageFilter(pageParam.toLowerCase())
    } else {
      setSelectedPageFilter('home')
    }
  }, [pageParam])

  // Load from localStorage or sync fresh defaults from /api/sections
  useEffect(() => {
    let isMounted = true

    const loadSections = async () => {
      const sanitize = (list: SectionItem[]) =>
        list
          .filter(
            (s) =>
              s &&
              s.key !== 'hero_1793333300938' &&
              s.id !== 'sec-home-hero-1793333300938'
          )
          .map((s) => {
            if (s.id === 'sec-home-services' || s.key === 'services_preview') {
              const { galleryImages, ...rest } = s
              return rest
            }
            return s
          })

      // 1. Initial immediate paint from localStorage
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          setSections(sanitize(JSON.parse(saved)))
        }
      } catch {
        // ignore
      }

      // 2. Fetch fresh synchronized data from server API
      try {
        const res = await fetch('/api/sections')
        if (res.ok) {
          const remoteData: SectionItem[] = await res.json()
          if (isMounted && Array.isArray(remoteData) && remoteData.length > 0) {
            const merged = initialSectionsData.map((init) => {
              const found = remoteData.find((r) => r.id === init.id)
              return found ? { ...init, ...found } : init
            })
            const custom = remoteData.filter(
              (r) => !initialSectionsData.some((init) => init.id === r.id)
            )
            const completeList = sanitize([...merged, ...custom])
            setSections(completeList)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(completeList))
          }
        }
      } catch {
        // network or server fallback
      }
    }

    loadSections()
    return () => {
      isMounted = false
    }
  }, [])

  // Save to localStorage helper & sync to live website via API
  const handleSaveSection = async (updated: SectionItem) => {
    setSections((prev) => {
      const exists = prev.some((s) => s.id === updated.id)
      let nextList: SectionItem[]
      if (exists) {
        nextList = prev.map((s) => (s.id === updated.id ? updated : s))
      } else {
        nextList = [updated, ...prev]
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList))
      } catch {
        // storage ignored
      }
      return nextList
    })

    // Sync to CMS API
    try {
      await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      })
    } catch {
      // ignore
    }

    // Also sync directly to Web API on port 3002 for instant live reflect
    try {
      const webUrl = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3002'
      await fetch(`${webUrl}/api/sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      })
    } catch {
      // ignore
    }
  }

  // Quick 1-click toggle for section status (Published vs Draft) directly from card
  const handleToggleStatus = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    let updatedSec: SectionItem | undefined

    setSections((prev) => {
      const nextList = prev.map((s) => {
        if (s.id === id) {
          const nextStatus: SectionItem['status'] =
            s.status === 'Published' ? 'Draft' : 'Published'
          updatedSec = {
            ...s,
            status: nextStatus,
            lastModified: new Date().toISOString().split('T')[0],
          }
          return updatedSec
        }
        return s
      })
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList))
      } catch {
        // storage ignored
      }
      return nextList
    })

    if (updatedSec) {
      try {
        await fetch('/api/sections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedSec),
        })
      } catch {
        // ignore
      }
      try {
        const webUrl = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3002'
        await fetch(`${webUrl}/api/sections`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedSec),
        })
      } catch {
        // ignore
      }
    }
  }

  // Delete section handler
  const handleDeleteSection = async (id: string) => {
    let nextList: SectionItem[] = []
    setSections((prev) => {
      nextList = prev.filter((s) => s.id !== id)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList))
      } catch {
        // storage ignored
      }
      return nextList
    })

    if (activeSection?.id === id) {
      setIsDrawerOpen(false)
      setActiveSection(null)
    }

    try {
      await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nextList),
      })
    } catch {
      // ignore
    }

    try {
      const webUrl = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3002'
      await fetch(`${webUrl}/api/sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nextList),
      })
    } catch {
      // ignore
    }
  }

  // Filtered sections: Strictly for current page only (no merging across pages)
  const filteredSections = useMemo(() => {
    return sections.filter((sec) => {
      // Must match separate page only
      if (sec.pageKey !== selectedPageFilter) {
        return false
      }
      // Status filter: only 'published' or 'draft' (removed unused 'in review')
      if (statusFilter !== 'all') {
        const isPub = sec.status === 'Published'
        if (statusFilter === 'published' && !isPub) return false
        if (statusFilter === 'draft' && isPub) return false
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = (sec.title || '').toLowerCase().includes(q)
        const matchHeading = (sec.heading || '').toLowerCase().includes(q)
        const matchDesc = (sec.description || '').toLowerCase().includes(q)
        const matchKey = (sec.key || '').toLowerCase().includes(q)
        if (!matchTitle && !matchHeading && !matchDesc && !matchKey) {
          return false
        }
      }
      return true
    })
  }, [sections, selectedPageFilter, statusFilter, searchQuery])

  const currentPageMeta = pageMetaMap[selectedPageFilter] || pageMetaMap['home']
  const publishedCount = filteredSections.filter((s) => s.status === 'Published').length
  const draftCount = filteredSections.filter((s) => s.status === 'Draft').length
  const mediaCount = filteredSections.filter((s) => s.image).length

  // Separate action handler tailored for each of the 5 screens
  const handleScreenAction = () => {
    const config = screenActionConfigs[selectedPageFilter] || screenActionConfigs['home']

    // Create fresh screen-tailored section item and open editor
    const newItem = config.createItem(filteredSections.length)
    if (selectedPageFilter === 'portfolio') {
      handleOpenPortfolioSection(newItem, 'edit')
      return
    }
    setActiveSection(newItem)
    setDrawerTab('content')
    setIsDrawerOpen(true)
  }

  const currentActionConfig = screenActionConfigs[selectedPageFilter] || screenActionConfigs['home']
  const ActionButtonIcon = currentActionConfig.buttonIcon

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full pb-12">
      {/* ================= Top Banner / Page Header ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs text-slate-500 font-medium">Page Sections Management</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {currentPageMeta.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            {currentPageMeta.description}
          </p>
        </div>

        {/* 5 Distinct Screen Action Buttons (Home: Add Hero, About: Add Team, Service: Add Service, Portfolio: Add Project, Contact: Add FAQ) */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={handleScreenAction}
            title={currentActionConfig.actionHint}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <ActionButtonIcon className={`w-4 h-4 ${currentActionConfig.iconColor}`} />
            <span>{currentActionConfig.buttonLabel}</span>
          </button>
        </div>
      </div>

      {/* ================= KPI Summary Strip ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500">Total Sections</span>
            <Layers className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{filteredSections.length}</p>
          <span className="text-[11px] text-slate-400">Website layout blocks</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500">Live on Website</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-700">{publishedCount}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Visible to visitors</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500">Hidden (Draft)</span>
            <EyeOff className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-700">{draftCount}</p>
          <span className="text-[11px] text-amber-600 font-medium">Hidden from site</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500">Media Assets</span>
            <ImageIcon className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{mediaCount}</p>
          <span className="text-[11px] text-slate-400">Videos &amp; photography</span>
        </div>
      </div>

      {/* ================= Search & View Controls ================= */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 sm:p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search section heading, text copy, or key..."
              className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Status Selector - Only Website-supported states */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
              className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
            >
              <option value="all">All Website Sections ({filteredSections.length})</option>
              <option value="published">Live on Website Only ({publishedCount})</option>
              <option value="draft">Hidden / Draft Only ({draftCount})</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
                  }`}
                title="Visual Section Cards"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
                  }`}
                title="Compact Table List"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SECTION-WISE VISUAL CARDS GRID ================= */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSections.map((sec, index) => {
            const isLive = sec.status === 'Published'
            const isPortfolioSec = sec.pageKey === 'portfolio'
            const isCaseStudySec = sec.pageKey === 'portfolio' || sec.key === 'bento_grid' || sec.id === 'sec-home-bento'
            const isServiceSec = sec.key === 'services_preview' || sec.id === 'sec-home-services'
            const isProductSec = sec.key === 'product_showcase' || sec.id === 'sec-home-product'
            return (
              <div
                key={sec.id}
                onClick={() => {
                  if (isCaseStudySec) {
                    handleOpenPortfolioSection(sec, 'view')
                  } else if (isServiceSec) {
                    handleOpenServiceSection(sec, 'view')
                  } else if (isProductSec) {
                    handleOpenProductSection(sec, 'view')
                  }
                }}
                className={`group bg-white border border-slate-200/90 rounded-2xl shadow-xs transition-all duration-300 flex flex-col overflow-hidden ${isCaseStudySec || isServiceSec || isProductSec
                  ? 'cursor-pointer hover:border-indigo-400 hover:shadow-lg hover:ring-2 hover:ring-indigo-400/20'
                  : 'hover:shadow-md hover:border-slate-300'
                  }`}
              >
                {/* Media Preview Box */}
                <div className="relative h-48 w-full bg-slate-950 overflow-hidden shrink-0">
                  {sec.mediaType === 'video' ? (
                    <video
                      key={sec.image}
                      src={sec.image}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <img
                      src={sec.image}
                      alt={sec.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        ; (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80'
                      }}
                    />
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-auto">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white border border-white/20">
                      Section {index + 1}
                    </span>

                    {/* Quick 1-click status toggle */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleStatus(sec.id, e)}
                      title={isLive ? 'Click to hide this section from website' : 'Click to publish live on website'}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-md shadow-xs flex items-center gap-1 transition-all active:scale-95 ${isLive
                        ? 'bg-emerald-600/90 hover:bg-emerald-600 text-white'
                        : 'bg-amber-600/90 hover:bg-amber-600 text-white'
                        }`}
                    >
                      {isLive ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-white" />
                          <span>Live</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3 text-white" />
                          <span>Hidden</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Bottom Media Label */}
                  <div className="absolute bottom-2 left-3 flex items-center text-[10px] text-white/80 pointer-events-none">
                    <span className="uppercase font-mono bg-black/50 px-1.5 py-0.5 rounded">
                      {sec.mediaType}
                    </span>
                  </div>
                </div>

                {/* Portfolio Click-to-Explore Interactive Banner */}
                {isPortfolioSec && (
                  <div className="bg-emerald-50/80 border-b border-emerald-100 px-4 py-1.5 text-[11px] text-emerald-800 font-medium flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Click to view inner section &amp; media</span>
                    </span>
                    <span className="text-emerald-700 font-bold flex items-center gap-0.5 text-[10px]">
                      <span>Open Studio</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                )}

                {/* Text Content Area */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                        {sec.title}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" title="Connected to website" />
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                      {sec.heading}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {sec.description}
                    </p>
                  </div>

                  {/* Sub-Services / Key Features Pill Strip */}
                  {sec.features && sec.features.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700">
                          Sub-Services &amp; Capabilities
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {sec.features.length} items
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {sec.features.slice(0, 3).map((f, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200/60 truncate max-w-[200px]"
                            title={f}
                          >
                            • {f}
                          </span>
                        ))}
                        {sec.features.length > 3 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold">
                            +{sec.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Product Showcase preview strip */}
                  {isProductSec && (
                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 flex items-center gap-1">
                          <Monitor className="w-2.5 h-2.5" /> Interactive Showcase
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {(sec.productFeatures && sec.productFeatures.length) || 6} Modules • 3 Stats
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(sec.stats || [
                          { value: '50+', label: 'Schools' },
                          { value: '99.9%', label: 'Uptime' },
                          { value: '24/7', label: 'Support' },
                        ]).map((st, sidx) => (
                          <div key={sidx} className="rounded-lg border border-slate-200/90 bg-indigo-50/50 p-1.5 text-center">
                            <p className="text-[10px] font-bold text-indigo-950 truncate leading-tight">{st.value}</p>
                            <span className="text-[8px] font-medium text-slate-500 truncate block">
                              {st.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3 Featured Landing Page Services preview strip */}
                  {isServiceSec && sec.featuredServices && sec.featuredServices.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> 3 Landing Page Services
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          Active on Home
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {sec.featuredServices.map((fs, idx) => (
                          <div key={fs.id || idx} className="rounded-lg border border-slate-200/90 bg-slate-50 p-1.5 overflow-hidden">
                            <p className="text-[10px] font-bold text-slate-800 truncate leading-tight">{fs.title}</p>
                            <span className="text-[8px] font-medium text-emerald-700 bg-emerald-100/70 px-1 py-0.2 rounded inline-block truncate mt-0.5">
                              {fs.tag}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Multi-asset gallery strip */}
                  {sec.galleryImages && sec.galleryImages.length > 0 && sec.key !== 'services_preview' && sec.id !== 'sec-home-services' && (
                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                          Website Assets
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {sec.galleryImages.length} images
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:h-1">
                        {sec.galleryImages.slice(0, 5).map((img, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-lg border border-slate-200 overflow-hidden bg-slate-900 shrink-0 shadow-2xs"
                            title={img}
                          >
                            <img
                              src={img}
                              alt=""
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                ; (e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=400&q=80'
                              }}
                            />
                          </div>
                        ))}
                        {sec.galleryImages.length > 5 && (
                          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0">
                            +{sec.galleryImages.length - 5}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Card Actions Footer - Section-Wise Configuration Button */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (isCaseStudySec) {
                            handleOpenPortfolioSection(sec, 'view')
                          } else if (isServiceSec) {
                            handleOpenServiceSection(sec, 'view')
                          } else if (isProductSec) {
                            handleOpenProductSection(sec, 'view')
                          } else {
                            setActiveSection(sec)
                            setDrawerTab('preview')
                            setIsDrawerOpen(true)
                          }
                        }}
                        title={
                          isCaseStudySec
                            ? 'Preview full project details'
                            : isServiceSec
                              ? 'Preview & customize 3 featured services'
                              : isProductSec
                                ? 'Preview interactive product showcase'
                                : 'Preview section details in side drawer'
                        }
                        className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-3 py-1.5 rounded-xl transition-colors border border-slate-200/80 shadow-2xs cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>
                          {isPortfolioSec
                            ? 'View Inner Section'
                            : isServiceSec
                              ? 'Preview Services'
                              : isProductSec
                                ? 'Preview Showcase'
                                : 'Preview'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSectionToDelete(sec)
                          setIsDeleteModalOpen(true)
                        }}
                        title="Delete this section"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200/80 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (isCaseStudySec) {
                          handleOpenPortfolioSection(sec, 'edit')
                        } else if (isServiceSec) {
                          handleOpenServiceSection(sec, 'edit')
                        } else if (isProductSec) {
                          handleOpenProductSection(sec, 'edit')
                        } else {
                          setActiveSection(sec)
                          setDrawerTab('content')
                          setIsDrawerOpen(true)
                        }
                      }}
                      className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-indigo-300" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ================= DETAILED TABLE VIEW ================= */}
      {viewMode === 'table' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm min-w-[700px]">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Media Preview</th>
                  <th className="py-3 px-4">Section &amp; Key</th>
                  <th className="py-3 px-4">Headline &amp; Body Copy</th>
                  <th className="py-3 px-4">Live Visibility</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredSections.map((sec) => {
                  const isLive = sec.status === 'Published'
                  const isPortfolioSec = sec.pageKey === 'portfolio'
                  const isCaseStudySec = sec.pageKey === 'portfolio' || sec.key === 'bento_grid' || sec.id === 'sec-home-bento'
                  const isServiceSec = sec.key === 'services_preview' || sec.id === 'sec-home-services'
                  const isProductSec = sec.key === 'product_showcase' || sec.id === 'sec-home-product'
                  return (
                    <tr key={sec.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Media Thumbnail */}
                      <td className="py-3 px-4 sm:px-6 w-24">
                        <div className="w-16 h-12 rounded-lg bg-slate-900 overflow-hidden relative border border-slate-200">
                          {sec.mediaType === 'video' ? (
                            <video
                              key={sec.image}
                              src={sec.image}
                              muted
                              playsInline
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src={sec.image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      </td>

                      {/* Section & Key */}
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-900">{sec.title}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            {sec.key}
                          </span>
                        </div>
                      </td>

                      {/* Headline & Body */}
                      <td className="py-3 px-4 max-w-sm">
                        <p className="font-medium text-slate-900 truncate">{sec.heading}</p>
                        <p className="text-xs text-slate-500 line-clamp-1">{sec.description}</p>
                        {sec.features && sec.features.length > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-[9px] font-bold uppercase text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                              {sec.features.length} Sub-Services
                            </span>
                            <span className="text-[10px] text-slate-400 truncate max-w-[200px]">
                              {sec.features.join(', ')}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Status with 1-click toggle */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={(e) => handleToggleStatus(sec.id, e)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all active:scale-95 ${isLive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                            }`}
                        >
                          {isLive ? '✓ Live on Website' : '⚠ Hidden (Draft)'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (isCaseStudySec) {
                                handleOpenPortfolioSection(sec, 'view')
                              } else if (isServiceSec) {
                                handleOpenServiceSection(sec, 'view')
                              } else if (isProductSec) {
                                handleOpenProductSection(sec, 'view')
                              } else {
                                setActiveSection(sec)
                                setDrawerTab('preview')
                                setIsDrawerOpen(true)
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                            title={
                              isCaseStudySec
                                ? "Preview full project details"
                                : isServiceSec
                                  ? "Preview & customize 3 featured services"
                                  : isProductSec
                                    ? "Preview interactive product showcase"
                                    : "Preview section details in side drawer"
                            }
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSectionToDelete(sec)
                              setIsDeleteModalOpen(true)
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title={`Delete ${sec.title}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (isCaseStudySec) {
                                handleOpenPortfolioSection(sec, 'edit')
                              } else if (isServiceSec) {
                                handleOpenServiceSection(sec, 'edit')
                              } else if (isProductSec) {
                                handleOpenProductSection(sec, 'edit')
                              } else {
                                setActiveSection(sec)
                                setDrawerTab('content')
                                setIsDrawerOpen(true)
                              }
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
                            title={`Edit ${sec.title}`}
                          >
                            <Edit3 className="w-3.5 h-3.5 text-indigo-300" />
                            <span>Edit</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredSections.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto">
          <Layers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No sections found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search query or status filter to see the website sections.
          </p>
        </div>
      )}

      {/* About Page Gallery Notice: Dedicated Media Library */}
      {activePageKey === 'about' && (
        <div className="bg-gradient-to-r from-sky-50/70 via-indigo-50/40 to-slate-50 border border-sky-100/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-sky-200/60 flex items-center justify-center text-sky-600 shrink-0">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-bold text-slate-900">About Page Visual Gallery</h4>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 border border-sky-200">
                  Managed in Media Library
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                The high-resolution curated gallery items and lightboxes for the About page are managed in the <strong>Media Library</strong>.
              </p>
            </div>
          </div>
          <Link
            href="/media"
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-all shrink-0 active:scale-95"
          >
            <span>Manage Gallery</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Home Page Insights / Blog Notice: Dedicated Blogs */}
      {activePageKey === 'home' && (
        <div className="bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-slate-50 border border-emerald-100/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-emerald-200/60 flex items-center justify-center text-emerald-600 shrink-0">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-bold text-slate-900">Homepage Articles &amp; Insights</h4>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                  Managed in Blogs
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                The homepage Latest Insights &amp; Articles are managed in the dedicated <strong>Blogs</strong> section.
              </p>
            </div>
          </div>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-all shrink-0 active:scale-95"
          >
            <span>Manage Blogs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Side Drawer Modal for Section Content & Image Editing */}
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        section={activeSection}
        initialTab={drawerTab}
        onSave={handleSaveSection}
        onDelete={handleDeleteSection}
      />

      {/* Portfolio Inner Section Modal for Preview, Content & Media Editing */}
      <PortfolioInnerSectionModal
        isOpen={isPortfolioModalOpen}
        onClose={() => setIsPortfolioModalOpen(false)}
        section={portfolioModalSection}
        initialMode={portfolioModalMode}
        onSave={handleSaveSection}
        allSections={sections}
      />

      {/* Services Showcase Inner Section Modal for Preview & Edit of 3 Featured Services */}
      <ServiceInnerSectionModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        section={serviceModalSection}
        initialMode={serviceModalMode}
        onSave={handleSaveSection}
        allSections={sections}
      />

      {/* Product Showcase Inner Section Modal (Section 7: BM One Studio) */}
      <ProductShowcaseModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        section={productModalSection}
        initialMode={productModalMode}
        onSave={handleSaveSection}
        allSections={sections}
      />

      {/* Delete Section Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete this Section?"
        description={`Are you sure you want to delete "${sectionToDelete?.heading || sectionToDelete?.title || sectionToDelete?.key || 'this section'}"? This will permanently remove the section from the page.`}
        confirmLabel="Delete Section"
        cancelLabel="Keep Section"
        isDestructive={true}
        onConfirm={() => {
          if (sectionToDelete?.id) {
            handleDeleteSection(sectionToDelete.id)
          }
          setIsDeleteModalOpen(false)
          setSectionToDelete(null)
        }}
        onCancel={() => {
          setIsDeleteModalOpen(false)
          setSectionToDelete(null)
        }}
      />
    </div>
  )
}

export default function PagesManagementPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-400">Loading website sections...</div>}>
      <PagesManagementContent />
    </Suspense>
  )
}
