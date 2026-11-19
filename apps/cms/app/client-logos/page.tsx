'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  Building2,
  Plus,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  Search,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  X,
  ExternalLink,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Sliders,
  Layers,
  Globe,
  Sun,
  Moon,
  Info,
} from 'lucide-react'
import {
  ClientLogoItem,
  initialClientLogos,
  availablePresetLogos,
} from '@/lib/clientLogosData'
import { SectionItem } from '@/lib/sectionsData'
import ConfirmModal from '@/components/ConfirmModal'

const STORAGE_KEY_CLIENT_LOGOS = 'docme_cms_client_logos_v2'
const STORAGE_KEY_SECTIONS = 'docme_cms_sections_v10'

export default function ClientLogosPage() {
  const [logos, setLogos] = useState<ClientLogoItem[]>(initialClientLogos)
  const [sectionHeading, setSectionHeading] = useState('Innovative Companies That Trust Us')
  const [sectionDescription, setSectionDescription] = useState(
    'Powering premier educational networks, medical centers, and enterprise organizations across 15+ countries with mission-critical systems.'
  )
  const [sectionStatus, setSectionStatus] = useState<'Published' | 'Draft'>('Published')
  
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'Published' | 'Draft'>('all')
  const [previewBg, setPreviewBg] = useState<'dark' | 'light' | 'checkered'>('dark')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLogo, setEditingLogo] = useState<ClientLogoItem | null>(null)
  const [isSectionConfigOpen, setIsSectionConfigOpen] = useState(false)
  const [logoToDelete, setLogoToDelete] = useState<{ id: string; name: string } | null>(null)

  // Form State
  const [formName, setFormName] = useState('')
  const [formLogo, setFormLogo] = useState('')
  const [formCategory, setFormCategory] = useState('Enterprise')
  const [formWebsite, setFormWebsite] = useState('')
  const [formStatus, setFormStatus] = useState<'Published' | 'Draft'>('Published')

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3200)
  }

  // Handle Escape key to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (logoToDelete) setLogoToDelete(null)
        else if (isModalOpen) setIsModalOpen(false)
        else if (isSectionConfigOpen) setIsSectionConfigOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [logoToDelete, isModalOpen, isSectionConfigOpen])

  // Load from localStorage or sync from /api/sections
  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      // 1. Initial immediate paint from localStorage
      try {
        const storedLogos = localStorage.getItem(STORAGE_KEY_CLIENT_LOGOS)
        if (storedLogos) {
          const parsed = JSON.parse(storedLogos)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setLogos(parsed)
          }
        }
      } catch {
        // ignore
      }

      // 2. Fetch fresh synchronized section data from server API
      try {
        const res = await fetch('/api/sections')
        if (res.ok) {
          const sections: SectionItem[] = await res.json()
          if (isMounted && Array.isArray(sections)) {
            const brandsSection = sections.find(
              (s) => s.key === 'trusted_brands' || s.id === 'sec-home-brands'
            )
            if (brandsSection) {
              if (brandsSection.heading) setSectionHeading(brandsSection.heading)
              if (brandsSection.description) setSectionDescription(brandsSection.description)
              if (brandsSection.status) setSectionStatus(brandsSection.status as 'Published' | 'Draft')

              // If galleryImages exist and we don't have stored custom logos yet, populate
              if (brandsSection.galleryImages && brandsSection.galleryImages.length > 0) {
                const storedLogos = localStorage.getItem(STORAGE_KEY_CLIENT_LOGOS)
                if (!storedLogos) {
                  const mapped: ClientLogoItem[] = brandsSection.galleryImages.map((img, idx) => {
                    const preset = availablePresetLogos.find((p) => p.path === img)
                    const cleanName = preset
                      ? preset.name.replace(/\s*\(.*?\)/, '')
                      : `Partner Company ${idx + 1}`
                    return {
                      id: `logo-${idx + 1}`,
                      name: cleanName,
                      logo: img,
                      category: 'Partner',
                      status: 'Published',
                      order: idx + 1,
                    }
                  })
                  setLogos(mapped)
                  localStorage.setItem(STORAGE_KEY_CLIENT_LOGOS, JSON.stringify(mapped))
                }
              }
            }
          }
        }
      } catch {
        // fallback to defaults
      }
    }

    loadData()
    return () => {
      isMounted = false
    }
  }, [])

  // Sync to API and website sections
  const syncToLiveSite = async (
    currentLogos: ClientLogoItem[],
    heading: string = sectionHeading,
    description: string = sectionDescription,
    secStatus: 'Published' | 'Draft' = sectionStatus
  ) => {
    setIsSyncing(true)
    try {
      // Filter published logos in ordered sequence
      const publishedLogos = currentLogos
        .filter((l) => l.status === 'Published')
        .sort((a, b) => a.order - b.order)
        .map((l) => l.logo)

      const updatedSection = {
        id: 'sec-home-brands',
        pageKey: 'home',
        pageTitle: 'Home',
        pageSlug: '/',
        key: 'trusted_brands',
        title: 'Trusted Partners & Brands',
        type: 'Partners & Logos',
        heading,
        description,
        image: publishedLogos[0] || '/assets/companies/image 711.png',
        mediaType: 'logos',
        galleryImages: publishedLogos,
        status: secStatus,
        order: 2,
        lastModified: new Date().toISOString().split('T')[0],
      }

      // Update CMS storage
      localStorage.setItem(STORAGE_KEY_CLIENT_LOGOS, JSON.stringify(currentLogos))

      // Also update general sections storage
      try {
        const sectionsRaw = localStorage.getItem(STORAGE_KEY_SECTIONS)
        if (sectionsRaw) {
          const list: SectionItem[] = JSON.parse(sectionsRaw)
          const nextList = list.map((s) => (s.id === updatedSection.id ? { ...s, ...updatedSection } : s))
          localStorage.setItem(STORAGE_KEY_SECTIONS, JSON.stringify(nextList))
        }
      } catch {
        // ignore
      }

      // Post to /api/sections
      const res = await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSection),
      })

      if (res.ok) {
        showToast('Successfully synced client logos to live website!')
      } else {
        showToast('Saved locally. Backend sync response received.')
      }
    } catch {
      showToast('Saved locally in browser cache.')
    } finally {
      setIsSyncing(false)
    }
  }

  // Filter and search
  const filteredLogos = useMemo(() => {
    return logos
      .filter((item) => {
        const matchesSearch =
          !searchQuery.trim() ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
          item.logo.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === 'all' || item.status === statusFilter

        return matchesSearch && matchesStatus
      })
      .sort((a, b) => a.order - b.order)
  }, [logos, searchQuery, statusFilter])

  // Open modal to add new
  const handleAddNew = () => {
    setEditingLogo(null)
    setFormName('')
    setFormLogo(availablePresetLogos[0].path)
    setFormCategory('Enterprise')
    setFormWebsite('')
    setFormStatus('Published')
    setIsModalOpen(true)
  }

  // Open modal to edit
  const handleEdit = (item: ClientLogoItem) => {
    setEditingLogo(item)
    setFormName(item.name)
    setFormLogo(item.logo)
    setFormCategory(item.category || 'Enterprise')
    setFormWebsite(item.website || '')
    setFormStatus(item.status)
    setIsModalOpen(true)
  }

  // Save form
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim() || !formLogo.trim()) {
      showToast('Please provide both a name and a logo image path.')
      return
    }

    let nextList: ClientLogoItem[]

    if (editingLogo) {
      nextList = logos.map((l) =>
        l.id === editingLogo.id
          ? {
              ...l,
              name: formName.trim(),
              logo: formLogo.trim(),
              category: formCategory.trim(),
              website: formWebsite.trim(),
              status: formStatus,
            }
          : l
      )
    } else {
      const newItem: ClientLogoItem = {
        id: `logo-${Date.now()}`,
        name: formName.trim(),
        logo: formLogo.trim(),
        category: formCategory.trim(),
        website: formWebsite.trim(),
        status: formStatus,
        order: logos.length + 1,
      }
      nextList = [...logos, newItem]
    }

    setLogos(nextList)
    setIsModalOpen(false)
    await syncToLiveSite(nextList)
  }

  // Toggle status
  const handleToggleStatus = async (id: string) => {
    const nextList = logos.map((l) => {
      if (l.id === id) {
        return {
          ...l,
          status: (l.status === 'Published' ? 'Draft' : 'Published') as 'Published' | 'Draft',
        }
      }
      return l
    })
    setLogos(nextList)
    await syncToLiveSite(nextList)
  }

  // Delete logo
  const handleDelete = (id: string, name: string) => {
    setLogoToDelete({ id, name })
  }

  const confirmDeleteLogo = async () => {
    if (!logoToDelete) return
    const { id, name } = logoToDelete
    const nextList = logos
      .filter((l) => l.id !== id)
      .map((item, idx) => ({ ...item, order: idx + 1 }))
    setLogos(nextList)
    setLogoToDelete(null)
    await syncToLiveSite(nextList)
    showToast(`Removed "${name}" from client logos.`)
  }

  // Move position
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= filteredLogos.length) return

    const itemA = filteredLogos[index]
    const itemB = filteredLogos[targetIndex]

    const nextList = logos.map((l) => {
      if (l.id === itemA.id) return { ...l, order: itemB.order }
      if (l.id === itemB.id) return { ...l, order: itemA.order }
      return l
    })

    setLogos(nextList)
    await syncToLiveSite(nextList)
  }

  // Copy logo URL
  const handleCopy = (path: string, id: string) => {
    navigator.clipboard.writeText(path)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
    showToast('Logo path copied to clipboard!')
  }

  // Save section settings modal
  const handleSaveSectionSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSectionConfigOpen(false)
    await syncToLiveSite(logos, sectionHeading, sectionDescription, sectionStatus)
    showToast('Section settings updated and synced!')
  }

  const publishedCount = logos.filter((l) => l.status === 'Published').length
  const draftCount = logos.filter((l) => l.status === 'Draft').length

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 border border-zinc-700 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Client Logos &amp; Partners
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Manage corporate partner brands, badges, and the live infinite marquee on the website.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Section Settings Button */}
          <button
            type="button"
            onClick={() => setIsSectionConfigOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span>Section Settings</span>
          </button>

          {/* Sync Button */}
          <button
            type="button"
            disabled={isSyncing}
            onClick={() => syncToLiveSite(logos)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync to Live Site'}</span>
          </button>

          {/* Add New Button */}
          <button
            type="button"
            onClick={handleAddNew}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Client Logo</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Logos</p>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl font-bold text-slate-900">{logos.length}</span>
            <span className="text-[11px] font-medium text-slate-500">partners</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Published</p>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl font-bold text-emerald-600">{publishedCount}</span>
            <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
              Active on Site
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Draft / Hidden</p>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl font-bold text-amber-600">{draftCount}</span>
            <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
              Hidden
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Marquee Status</p>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-sm font-bold text-slate-900 truncate">
              {sectionStatus === 'Published' ? 'Live Infinite Loop' : 'Section Paused'}
            </span>
            <span className={`w-2 h-2 rounded-full shrink-0 ${sectionStatus === 'Published' ? 'bg-emerald-500 animate-ping' : 'bg-amber-400'}`} />
          </div>
        </div>
      </div>


      {/* Control Bar: Search, Filters, Contrast Mode */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company name, category, or path..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Right: Status Filters + Contrast Toggle */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Status Buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200/70 text-xs font-medium">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-md transition-all ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({logos.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('Published')}
              className={`px-3 py-1 rounded-md transition-all ${
                statusFilter === 'Published'
                  ? 'bg-white text-emerald-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Published ({publishedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('Draft')}
              className={`px-3 py-1 rounded-md transition-all ${
                statusFilter === 'Draft'
                  ? 'bg-white text-amber-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Draft ({draftCount})
            </button>
          </div>

          {/* Contrast Mode Toggle */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 text-xs text-slate-500">
            <span className="hidden sm:inline text-[11px] font-medium">Card Background:</span>
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
              <button
                type="button"
                onClick={() => setPreviewBg('dark')}
                title="Dark Background"
                className={`p-1.5 rounded-md transition-colors ${
                  previewBg === 'dark' ? 'bg-zinc-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewBg('light')}
                title="Light Background"
                className={`p-1.5 rounded-md transition-colors ${
                  previewBg === 'light' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewBg('checkered')}
                title="Checkered Transparency"
                className={`p-1.5 rounded-md transition-colors ${
                  previewBg === 'checkered' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Logos Grid */}
      {filteredLogos.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center max-w-lg mx-auto">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No client logos found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            {searchQuery
              ? `No partner logos matched "${searchQuery}". Try a different keyword.`
              : 'Get started by adding your first client or partner brand logo.'}
          </p>
          <button
            type="button"
            onClick={handleAddNew}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Logo</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredLogos.map((item, index) => {
            const isFirst = index === 0
            const isLast = index === filteredLogos.length - 1

            return (
              <div
                key={item.id}
                className="group bg-white border border-slate-200/80 hover:border-indigo-300 hover:shadow-md rounded-xl overflow-hidden transition-all flex flex-col justify-between"
              >
                {/* Header info */}
                <div className="p-3.5 border-b border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-[11px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      #{item.order}
                    </span>
                    <span className="font-semibold text-slate-800 truncate" title={item.name}>
                      {item.name}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${
                      item.status === 'Published'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Logo Image Preview Container with Contrast Background */}
                <div
                  className={`relative h-36 flex items-center justify-center p-6 transition-colors ${
                    previewBg === 'dark'
                      ? 'bg-zinc-950 text-white'
                      : previewBg === 'light'
                      ? 'bg-slate-50 text-slate-900'
                      : 'bg-zinc-100 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:12px_12px]'
                  }`}
                >
                  <img
                    src={item.logo}
                    alt={item.name}
                    className="max-h-20 max-w-[85%] object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Details Footer */}
                <div className="p-3.5 bg-slate-50/70 border-t border-slate-100 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="truncate" title={item.category || 'Partner'}>
                      {item.category || 'Partner Brand'}
                    </span>
                    {item.website && (
                      <a
                        href={item.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
                      >
                        <Globe className="w-3 h-3" />
                        <span className="truncate max-w-[100px]">Link</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                    {/* Reorder Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={isFirst}
                        onClick={() => handleMove(index, 'up')}
                        title="Move left / up"
                        className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={isLast}
                        onClick={() => handleMove(index, 'down')}
                        title="Move right / down"
                        className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy(item.logo, item.id)}
                        title="Copy logo path"
                        className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Action buttons: Toggle Status, Edit, Delete */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item.id)}
                        title={item.status === 'Published' ? 'Hide / Draft' : 'Publish to Live Site'}
                        className={`p-1.5 rounded-md transition-colors ${
                          item.status === 'Published'
                            ? 'text-emerald-700 hover:bg-emerald-100'
                            : 'text-amber-700 hover:bg-amber-100'
                        }`}
                      >
                        {item.status === 'Published' ? (
                          <Eye className="w-3.5 h-3.5" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        title="Edit details"
                        className="p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, item.name)}
                        title="Delete logo"
                        className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add / Edit Client Logo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  {editingLogo ? 'Edit Client Logo' : 'Add New Client Logo'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveModal} className="p-6 space-y-4">
              {/* Partner Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company / Partner Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Techno Alliance, NIMS Group, Loyaltri"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              {/* Logo Path */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Logo Asset Path or Image URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formLogo}
                  onChange={(e) => setFormLogo(e.target.value)}
                  placeholder="/assets/companies/1.png"
                  className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              {/* Quick Preset Selector */}
              <div>
                <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Select from Existing Company Logos:
                </span>
                <div className="grid grid-cols-5 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-lg border border-slate-200">
                  {availablePresetLogos.map((preset) => {
                    const isSelected = formLogo === preset.path
                    return (
                      <button
                        key={preset.path}
                        type="button"
                        onClick={() => {
                          setFormLogo(preset.path)
                          if (!formName) {
                            setFormName(preset.name.replace(/\s*\(.*?\)/, ''))
                          }
                        }}
                        title={preset.name}
                        className={`h-14 p-1.5 rounded-lg flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-500/20'
                            : 'bg-zinc-900 border-zinc-700 hover:border-slate-400'
                        }`}
                      >
                        <img
                          src={preset.path}
                          alt={preset.name}
                          className="max-h-8 max-w-full object-contain"
                        />
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Live Preview of Selected Logo */}
              {formLogo && (
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-center min-h-[70px]">
                  <img
                    src={formLogo}
                    alt="Preview"
                    className="max-h-12 object-contain"
                    onError={(e) => {
                      ;(e.target as HTMLElement).style.display = 'none'
                    }}
                  />
                </div>
              )}

              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Industry / Category
                  </label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="e.g. Technology, Education, Healthcare"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as 'Published' | 'Draft')}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white"
                  >
                    <option value="Published">Published (Active on site)</option>
                    <option value="Draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Website URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Partner Website URL <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="url"
                  value={formWebsite}
                  onChange={(e) => setFormWebsite(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm"
                >
                  {editingLogo ? 'Save Changes' : 'Add Logo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Section Settings Modal */}
      {isSectionConfigOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Trusted Companies Section Settings
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSectionConfigOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSectionSettings} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section Heading / Title
                </label>
                <input
                  type="text"
                  required
                  value={sectionHeading}
                  onChange={(e) => setSectionHeading(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Displayed right above the scrolling marquee on the homepage.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description / Subtitle
                </label>
                <textarea
                  rows={3}
                  value={sectionDescription}
                  onChange={(e) => setSectionDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section Visibility on Website
                </label>
                <select
                  value={sectionStatus}
                  onChange={(e) => setSectionStatus(e.target.value as 'Published' | 'Draft')}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white"
                >
                  <option value="Published">Published (Visible on Live Website)</option>
                  <option value="Draft">Draft (Hidden from Live Website)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSectionConfigOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
                >
                  Save &amp; Sync
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Logo Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(logoToDelete)}
        title="Remove Client Logo?"
        description={`Are you sure you want to remove "${logoToDelete?.name || ''}" from partner logos? This change will immediately remove it from the live website marquee upon sync.`}
        confirmLabel="Remove Logo"
        cancelLabel="Keep Logo"
        isDestructive={true}
        onConfirm={confirmDeleteLogo}
        onCancel={() => setLogoToDelete(null)}
      />
    </div>
  )
}
