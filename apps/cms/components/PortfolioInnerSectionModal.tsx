'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { createPortal } from 'react-dom'
import {
  X,
  Eye,
  Edit3,
  Image as ImageIcon,
  Sparkles,
  Plus,
  Trash2,
  ExternalLink,
  ArrowRight,
  Check,
  Crop,
  RefreshCw,
  UploadCloud,
  Layers,
  Globe,
  Smartphone,
  Monitor,
  CheckCircle2,
  ChevronRight,
  ZoomIn,
  FileText,
  Tag,
  Calendar,
  User,
  Sliders,
  Maximize2,
  ChevronLeft,
} from 'lucide-react'
import ImageCropModal from './ImageCropModal'
import { SectionItem, ProjectFeature, ProjectScreenshot, PortfolioProjectDetails, initialSectionsData } from '@/lib/sectionsData'

interface PortfolioInnerSectionModalProps {
  isOpen: boolean
  onClose: () => void
  section: SectionItem | null
  initialMode?: 'view' | 'edit'
  onSave?: (updatedSection: SectionItem) => void
  allSections?: SectionItem[]
}

// Fallback seed data if section doesn't have projectDetails yet
function getInitialDetails(section: SectionItem | null): PortfolioProjectDetails {
  if (!section) return {}
  if (section.projectDetails) return JSON.parse(JSON.stringify(section.projectDetails))

  // Seed intelligent defaults based on section key
  const sKey = section.key || ''
  if (sKey.includes('teacher') || sKey.includes('class') || sKey.includes('bento')) {
    return {
      overview:
        section.description ||
        'Teacher App is a mobile-first school management app that puts attendance tracking, student monitoring, leave approvals, and parent communication right in the hands of teachers.',
      client: 'Docme',
      year: '2024',
      role: 'Product Design & Dev',
      tags: ['MOBILE APP', 'MANAGEMENT'],
      platforms: ['iOS', 'Android'],
      features: [
        {
          title: 'Attendance at a tap',
          description:
            'Mark present, absent, or late for every student in seconds. Real-time sync means the office always has the latest data without a single paper register.',
          image: '/assets/Teacher app/014.png',
          imageAlt: 'Teacher App attendance tracking screen',
          reverse: false,
        },
        {
          title: 'Parent communication & call logs',
          description:
            'Log parent phone calls, follow up on student progress or fee updates, and track outcomes seamlessly with instant call history records.',
          image: '/assets/Teacher app/015.png',
          imageAlt: 'Teacher App call reports and communication logs',
          reverse: true,
        },
      ],
      screenshots: [
        { src: '/assets/Teacher app/011.png', alt: 'Teacher App Parent Messaging & Class Feed' },
        { src: '/assets/Teacher app/012.png', alt: 'Teacher App Student Clinic & Movement Tracking' },
        { src: '/assets/Teacher app/013.png', alt: 'Teacher App Leave Requests & Approval Workflow' },
        { src: '/assets/Teacher app/015.png', alt: 'Teacher App Parent Call Reports & Communication Log' },
      ],
      ctaTitle: 'Experience Teacher App by yourself',
      ctaSubtitle: 'School management reimagined for the mobile era.',
      ctaLink: 'docme.in/class-control',
    }
  }

  if (sKey.includes('dairy')) {
    return {
      overview:
        section.description ||
        'School Dairy brings together homework, grades, notices, and event calendars into a single intuitive app for students and parents — reducing friction and keeping everyone informed.',
      client: 'Docme',
      year: '2024',
      role: 'UI / UX Design & Dev',
      tags: ['STUDENT PORTAL', 'WEB DESIGN'],
      platforms: ['iOS', 'Android', 'Web'],
      features: [
        {
          title: 'Your academic life, organised',
          description:
            'Assignments, exam schedules, and result cards all in one place. Students never miss a deadline and parents always know what is coming next.',
          image: '/assets/School dairy/05.png',
          imageAlt: 'School Dairy academic view',
          reverse: false,
        },
        {
          title: 'Campus life beyond the classroom',
          description:
            'Event announcements, club activities, and school notices flow into a single feed so students stay connected to campus life even when off-site.',
          image: '/assets/School dairy/04.png',
          imageAlt: 'School Dairy campus feed',
          reverse: true,
        },
      ],
      screenshots: [
        { src: '/assets/School dairy/01.png', alt: 'School Dairy Chat and Discussions' },
        { src: '/assets/School dairy/02.png', alt: 'School Dairy Fee Payment Details' },
        { src: '/assets/School dairy/03.png', alt: 'School Dairy Digital Wallet and Transactions' },
        { src: '/assets/School dairy/04.png', alt: 'School Dairy Bus Tracking and Route Details' },
      ],
      ctaTitle: 'Experience School Dairy by yourself',
      ctaSubtitle: 'The student companion built for modern campuses.',
      ctaLink: 'docme.in/school-dairy',
    }
  }

  if (sKey.includes('canteen')) {
    return {
      overview:
        section.description ||
        'BM Canteen digitises the entire cafeteria workflow — from student pre-ordering to kitchen fulfillment and end-of-day financial reporting — eliminating queues and cash handling.',
      client: 'Docme',
      year: '2023',
      role: 'Product Design & Development',
      tags: ['MANAGEMENT', 'DEVELOPMENT'],
      platforms: ['iOS', 'Android', 'Web'],
      features: [
        {
          title: 'Order before you arrive',
          description:
            'Students pre-order from a digital menu each morning. The kitchen sees a live queue, reduces waste, and has meals ready exactly when students arrive.',
          image: '/assets/Canteen/mobile app.png',
          imageAlt: 'BM Canteen order screen',
          reverse: false,
        },
        {
          title: 'Sales insights that drive better menus',
          description:
            'Daily, weekly, and monthly reports surface the most popular items, peak hours, and revenue trends so canteen managers can plan smarter.',
          image: '/assets/Canteen/website.png',
          imageAlt: 'BM Canteen analytics',
          reverse: true,
        },
      ],
      screenshots: [
        { src: '/assets/Canteen/01.png', alt: 'Menu and Ordering Screen' },
        { src: '/assets/Canteen/02.png', alt: 'Sales Dashboard' },
        { src: '/assets/Canteen/03.png', alt: 'Order History and Fulfillment' },
        { src: '/assets/Canteen/website.png', alt: 'Canteen Analytics Portal' },
      ],
      ctaTitle: 'Experience BM Canteen by yourself',
      ctaSubtitle: 'Zero queues. Smarter kitchens. Happier students.',
      ctaLink: 'docme.in/bm-canteen',
    }
  }

  // Generic fallback (e.g. Smart Dashboard or new project)
  return {
    overview:
      section.description ||
      'Unified cross-platform system engineered for multi-tenant scalability, mobile responsiveness, and high-volume real-time sync.',
    client: 'Docme',
    year: '2024',
    role: section.type || 'Data Visualisation & UI Design',
    tags: ['ANALYTICS', 'WEB DESIGN'],
    platforms: ['Web', 'Desktop'],
    features: [
      {
        title: 'Financial clarity in one view',
        description:
          'Fee collection rates, outstanding balances, and monthly revenue curves are presented in clean, scannable charts — no spreadsheet wrangling required.',
        image: section.image || '/assets/Feature/dash.jpg',
        imageAlt: 'Financial clarity view',
        reverse: false,
      },
      {
        title: 'Performance trends across every grade',
        description:
          'Compare class averages, spot declining cohorts early, and celebrate high-performing teachers — all with drill-down detail available in two clicks.',
        image: '/assets/Feature/School Dairy V2.1 1.jpg',
        imageAlt: 'Performance view',
        reverse: true,
      },
    ],
    screenshots: (section.galleryImages || [
      '/assets/Feature/dash.jpg',
      '/assets/Feature/dash1.jpg',
      '/assets/Feature/BM One.jpg',
    ]).map((src) => ({ src, alt: 'Project Screenshot' })),
    ctaTitle: `Experience ${section.title || 'this project'} by yourself`,
    ctaSubtitle: 'Data-driven decisions for modern institutions.',
    ctaLink: section.pageSlug || 'docme.in',
  }
}

export default function PortfolioInnerSectionModal({
  isOpen,
  onClose,
  section,
  initialMode = 'view',
  onSave,
  allSections,
}: PortfolioInnerSectionModalProps) {
  const [mounted, setMounted] = useState(false)
  const [mode, setMode] = useState<'view' | 'edit'>(initialMode)
  const [activeTab, setActiveTab] = useState<'all' | 'overview' | 'features' | 'gallery' | 'cta'>('all')

  // Case Studies list for Bento Grid / Portfolio
  const caseStudies = useMemo(() => {
    if (allSections && allSections.length > 0) {
      const fromSections = allSections.filter((s) => s.pageKey === 'portfolio')
      if (fromSections.length > 0) return fromSections
    }
    return initialSectionsData.filter((s) => s.pageKey === 'portfolio')
  }, [allSections])

  const [activeProject, setActiveProject] = useState<SectionItem | null>(null)

  // Form State
  const [title, setTitle] = useState('')
  const [heading, setHeading] = useState('')
  const [description, setDescription] = useState('')
  const [heroImage, setHeroImage] = useState('')
  const [status, setStatus] = useState<'Published' | 'Draft'>('Published')
  const [pageSlug, setPageSlug] = useState('')

  // Inner Details State
  const [overview, setOverview] = useState('')
  const [client, setClient] = useState('Docme')
  const [year, setYear] = useState('2024')
  const [role, setRole] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [platforms, setPlatforms] = useState<string[]>([])
  const [features, setFeatures] = useState<ProjectFeature[]>([])
  const [screenshots, setScreenshots] = useState<ProjectScreenshot[]>([])
  const [ctaTitle, setCtaTitle] = useState('')
  const [ctaSubtitle, setCtaSubtitle] = useState('')
  const [ctaLink, setCtaLink] = useState('')

  // Image Upload & Crop State
  const [cropTargetImage, setCropTargetImage] = useState<string>('')
  const [cropTargetField, setCropTargetField] = useState<{ type: 'hero' | 'feature'; index?: number }>({ type: 'hero' })
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Zoom lightbox state for screenshots
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null)

  // New Screenshot input
  const [newScreenshotUrl, setNewScreenshotUrl] = useState('')
  const [newScreenshotAlt, setNewScreenshotAlt] = useState('')

  // Toast
  const [showSavedToast, setShowSavedToast] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const heroFileInputRef = useRef<HTMLInputElement>(null)
  const featureFileInputRef = useRef<HTMLInputElement>(null)
  const [activeFeatureUploadIndex, setActiveFeatureUploadIndex] = useState<number | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Lock background scroll when modal is open
  useEffect(() => {
    if (typeof document === 'undefined') return

    const mainEl = document.querySelector('main')
    const originalBodyOverflow = document.body.style.overflow
    const originalHtmlOverflow = document.documentElement.style.overflow
    const originalMainOverflow = mainEl ? mainEl.style.overflow : ''

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      if (mainEl) {
        mainEl.style.overflow = 'hidden'
      }
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      if (mainEl) {
        mainEl.style.overflow = ''
      }
    }

    return () => {
      document.body.style.overflow = originalBodyOverflow
      document.documentElement.style.overflow = originalHtmlOverflow
      if (mainEl) {
        mainEl.style.overflow = originalMainOverflow
      }
    }
  }, [isOpen])

  const populateFromSection = (target: SectionItem) => {
    setTitle(target.title || '')
    setHeading(target.heading || target.title || '')
    setDescription(target.description || '')
    setHeroImage(target.image || '')
    setStatus(target.status === 'Draft' ? 'Draft' : 'Published')
    setPageSlug(target.pageSlug || '')

    const details = getInitialDetails(target)
    setOverview(details.overview || target.description || '')
    setClient(details.client || 'Docme')
    setYear(details.year || '2024')
    setRole(details.role || target.type || 'Product Design & Dev')
    setTagsInput((details.tags || ['MOBILE APP', 'MANAGEMENT']).join(', '))
    setPlatforms(details.platforms || ['iOS', 'Android'])
    setFeatures(details.features ? [...details.features] : [])
    setScreenshots(
      details.screenshots && details.screenshots.length > 0
        ? [...details.screenshots]
        : (target.galleryImages || []).map((src) => ({ src, alt: target.title }))
    )
    setCtaTitle(details.ctaTitle || `Experience ${target.title} by yourself`)
    setCtaSubtitle(details.ctaSubtitle || 'School management reimagined for the mobile era.')
    setCtaLink(details.ctaLink || target.cta?.url || target.pageSlug || 'docme.in')
  }

  useEffect(() => {
    if (section) {
      let target = section
      if (section.key === 'bento_grid' || section.id === 'sec-home-bento') {
        const first = caseStudies.find((p: SectionItem) => p.id === 'sec-port-teacher-app') || caseStudies[0]
        if (first) target = first
      }
      setActiveProject(target)
      populateFromSection(target)
    }
    if (isOpen) {
      setMode(initialMode)
      setActiveTab('all')
    }
  }, [section, isOpen, initialMode, caseStudies])

  const handleSelectCaseStudy = (proj: SectionItem) => {
    setActiveProject(proj)
    populateFromSection(proj)
  }

  // Crop Completed
  const handleCropComplete = async (croppedDataUrl: string, croppedBlob?: Blob) => {
    if (cropTargetField.type === 'hero') {
      setHeroImage(croppedDataUrl)
    } else if (cropTargetField.type === 'feature' && cropTargetField.index !== undefined) {
      const idx = cropTargetField.index
      setFeatures((prev) =>
        prev.map((f, i) => (i === idx ? { ...f, image: croppedDataUrl } : f))
      )
    }

    if (croppedBlob) {
      try {
        const file = new File([croppedBlob], `portfolio-crop-${Date.now()}.jpg`, { type: 'image/jpeg' })
        const payload = new FormData()
        payload.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: payload })
        if (res.ok) {
          const data = await res.json()
          if (data.url) {
            if (cropTargetField.type === 'hero') {
              setHeroImage(data.url)
            } else if (cropTargetField.type === 'feature' && cropTargetField.index !== undefined) {
              const idx = cropTargetField.index
              setFeatures((prev) =>
                prev.map((f, i) => (i === idx ? { ...f, image: data.url } : f))
              )
            }
          }
        }
      } catch (err) {
        console.warn('Background upload sync warning:', err)
      }
    }
  }

  // Upload handler for Hero or Feature Image
  const handleUploadFile = async (file: File, target: 'hero' | 'feature', featureIndex?: number) => {
    if (!file) return
    setIsUploading(true)
    setUploadProgress(25)

    const preview = URL.createObjectURL(file)
    if (target === 'hero') {
      setHeroImage(preview)
      setCropTargetField({ type: 'hero' })
      setCropTargetImage(preview)
      setIsCropModalOpen(true)
    } else if (target === 'feature' && featureIndex !== undefined) {
      setFeatures((prev) =>
        prev.map((f, i) => (i === featureIndex ? { ...f, image: preview } : f))
      )
      setCropTargetField({ type: 'feature', index: featureIndex })
      setCropTargetImage(preview)
      setIsCropModalOpen(true)
    }

    try {
      const payload = new FormData()
      payload.append('file', file)
      setUploadProgress(60)

      const res = await fetch('/api/upload', { method: 'POST', body: payload })
      setUploadProgress(90)
      if (res.ok) {
        const data = await res.json()
        if (data.url) {
          if (target === 'hero') {
            setHeroImage(data.url)
          } else if (target === 'feature' && featureIndex !== undefined) {
            setFeatures((prev) =>
              prev.map((f, i) => (i === featureIndex ? { ...f, image: data.url } : f))
            )
          }
        }
      }
    } catch {
      // optimistic retain
    } finally {
      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
      }, 400)
    }
  }

  // Feature Add / Remove / Update
  const handleAddFeature = () => {
    const newFeat: ProjectFeature = {
      title: 'New Feature Highlight',
      description: 'Describe this capability and how it enhances the user experience.',
      image: '/assets/Teacher app/014.png',
      imageAlt: 'Feature Screenshot',
      reverse: features.length % 2 === 1,
    }
    setFeatures([...features, newFeat])
  }

  const handleUpdateFeature = (index: number, key: keyof ProjectFeature, value: any) => {
    setFeatures((prev) =>
      prev.map((feat, i) => (i === index ? { ...feat, [key]: value } : feat))
    )
  }

  const handleRemoveFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index))
  }

  // Screenshots Add / Remove
  const handleAddScreenshot = () => {
    if (!newScreenshotUrl.trim()) return
    const nextList: ProjectScreenshot[] = [
      ...screenshots,
      { src: newScreenshotUrl.trim(), alt: newScreenshotAlt.trim() || `${title} Screenshot` },
    ]
    setScreenshots(nextList)
    setNewScreenshotUrl('')
    setNewScreenshotAlt('')
  }

  const handleRemoveScreenshot = (index: number) => {
    setScreenshots((prev) => prev.filter((_, i) => i !== index))
  }

  // Toggle platform pill
  const togglePlatform = (plat: string) => {
    if (platforms.includes(plat)) {
      setPlatforms(platforms.filter((p) => p !== plat))
    } else {
      setPlatforms([...platforms, plat])
    }
  }

  // Save changes
  const handleSave = async () => {
    const target = activeProject || section
    if (!target) return
    setIsSaving(true)

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim().toUpperCase())
      .filter(Boolean)

    const updatedProjectDetails: PortfolioProjectDetails = {
      overview,
      client,
      year,
      role,
      tags: parsedTags.length > 0 ? parsedTags : ['MOBILE APP', 'MANAGEMENT'],
      platforms,
      features,
      screenshots,
      ctaTitle,
      ctaSubtitle,
      ctaLink,
    }

    const updatedSection: SectionItem = {
      ...target,
      title: title || target.title,
      heading: heading || target.heading,
      description: description || overview || target.description,
      image: heroImage || target.image,
      status: status,
      galleryImages: screenshots.map((s) => s.src),
      stats: platforms.length > 0 ? [
        { value: platforms.join(' & '), label: 'Platforms' },
        { value: 'Real-time', label: 'Cloud Sync' },
        { value: year || '2024', label: 'Release' },
      ] : target.stats,
      cta: {
        label: 'View Project Details',
        url: pageSlug || target.pageSlug,
      },
      projectDetails: updatedProjectDetails,
      lastModified: new Date().toISOString().split('T')[0],
    }

    try {
      if (onSave) {
        onSave(updatedSection)
        if (section && (section.key === 'bento_grid' || section.id === 'sec-home-bento')) {
          onSave({
            ...section,
            projectDetails: updatedProjectDetails,
            lastModified: new Date().toISOString().split('T')[0],
          })
        }
      }
      setShowSavedToast(true)
      setTimeout(() => {
        setShowSavedToast(false)
        setMode('view')
      }, 1000)
    } finally {
      setIsSaving(false)
    }
  }

  const webUrl = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3002'
  const targetSlug = pageSlug || activeProject?.pageSlug || section?.pageSlug || '/portfolio'
  const liveUrl = `${webUrl}${targetSlug.startsWith('/') ? targetSlug : '/' + targetSlug}`

  if (!mounted || !isOpen || !section) return null

  const tagsList = tagsInput
    .split(',')
    .map((t) => t.trim().toUpperCase())
    .filter(Boolean)

  const isCaseStudySection = section.key === 'bento_grid' || section.id === 'sec-home-bento' || section.pageKey === 'portfolio'

  return createPortal(
    <>
      {/* Dimmed Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 z-[99] touch-none ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        onWheel={(e) => e.preventDefault()}
        onTouchMove={(e) => e.preventDefault()}
      />

      {/* Side Sheet Drawer (Full-Height: Top to Bottom, 100% Viewport Docked) */}
      <div
        className={`fixed inset-y-0 right-0 z-[100] h-screen max-h-screen w-full max-w-[880px] bg-white border-l border-slate-200 shadow-2xl flex flex-col overflow-hidden overscroll-contain transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none invisible'
        }`}
      >
          
          {/* ================= Top Bar Header ================= */}
          <div className="px-5 sm:px-7 py-4 border-b border-slate-200 bg-white shrink-0 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-sm shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                  {heading || title || activeProject?.title || section.title}
                </h2>
              </div>
            </div>

            {/* Mode Switcher Tabs + Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* View / Edit Mode Switcher */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setMode('view')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    mode === 'view'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  <span>View Project Details</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('edit')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    mode === 'edit'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Edit Content &amp; Media</span>
                </button>
              </div>



              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5 stroke-[2]" />
              </button>
            </div>
          </div>



          {/* ================= MODAL BODY ================= */}
          <div className="flex-1 overflow-y-auto bg-slate-50/60 p-4 sm:p-6 md:p-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
            
            {/* ============================================================== */}
            {/* VIEW MODE: High-fidelity Inner Project Page Presentation      */}
            {/* ============================================================== */}
            {mode === 'view' && (
              <div className="max-w-4xl mx-auto space-y-8">
                
                {/* 1. Project Hero Header Card */}
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs relative overflow-hidden">
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight">
                      {heading || title}
                    </h2>
                    {description && (
                      <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                        {description}
                      </p>
                    )}
                  </div>

                  {/* Main Project Mockup Image Card */}
                  <div className="mt-8 rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200/80 p-4 sm:p-8 flex items-center justify-center border border-slate-200 overflow-hidden relative group">
                    <img
                      src={heroImage}
                      alt={title}
                      className="max-h-[380px] w-auto object-contain drop-shadow-2xl rounded-xl group-hover:scale-[1.02] transition-transform duration-500"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80'
                      }}
                    />
                    
                  </div>
                </div>

                {/* 2. Inner Section: Project Overview */}
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                      <FileText className="w-4 h-4" />
                      <span>Inner Section · Executive Overview</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setMode('edit')}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                      Edit copy →
                    </button>
                  </div>
                  <div className="pl-4 border-l-4 border-indigo-500 py-1">
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                      {overview || description}
                    </p>
                  </div>
                </div>

                {/* 3. Inner Section: Core Features (Side-by-Side Images & Content) */}
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" />
                        <span>Inner Section · Product Features ({features.length})</span>
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">
                        In-Depth Feature Walkthroughs
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMode('edit')}
                      className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold inline-flex items-center gap-1"
                    >
                      <span>Edit Features</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-8">
                    {features.map((feat, idx) => (
                      <div
                        key={idx}
                        className={`grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 items-center p-5 rounded-2xl bg-slate-50 border border-slate-200/80 ${
                          feat.reverse ? 'md:flex-row-reverse' : ''
                        }`}
                      >
                        <div className={`space-y-3 ${feat.reverse ? 'md:order-2' : ''}`}>
                          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                            Feature {idx + 1}
                          </span>
                          <h4 className="text-base sm:text-lg font-bold text-slate-900">
                            {feat.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {feat.description}
                          </p>
                        </div>

                        <div className={`flex items-center justify-center ${feat.reverse ? 'md:order-1' : ''}`}>
                          <div className="relative group max-w-sm rounded-xl overflow-hidden bg-white p-3 border border-slate-200 shadow-sm">
                            <img
                              src={feat.image}
                              alt={feat.imageAlt || feat.title}
                              className="w-auto max-h-56 mx-auto object-contain drop-shadow-md rounded group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=400&q=80'
                              }}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => setLightboxImage({ src: feat.image, alt: feat.title })}
                                className="p-2 rounded-lg bg-white/90 text-slate-900 hover:bg-white text-xs font-semibold shadow-xs"
                                title="Zoom image"
                              >
                                <ZoomIn className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Inner Section: Website Assets & Screenshots Gallery */}
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4" />
                        <span>Inner Section · High-Res Screenshots &amp; Mobile Views</span>
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">
                        Gallery Assets ({screenshots.length} Images)
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMode('edit')}
                      className="text-xs text-purple-700 hover:text-purple-900 font-semibold"
                    >
                      Manage Assets →
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {screenshots.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => setLightboxImage(item)}
                        className="group relative rounded-xl border border-slate-200 bg-slate-900 overflow-hidden cursor-pointer shadow-xs aspect-[4/5] flex flex-col justify-end"
                      >
                        <img
                          src={item.src}
                          alt={item.alt}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=400&q=80'
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                        <div className="relative p-2.5 z-10">
                          <p className="text-[11px] font-semibold text-white truncate drop-shadow-xs">
                            {item.alt || `Screenshot ${idx + 1}`}
                          </p>
                          <span className="text-[9px] font-mono text-white/70">Click to expand</span>
                        </div>
                        <div className="absolute top-2 right-2 p-1 rounded-md bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <ZoomIn className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>


              </div>
            )}

            {/* ============================================================== */}
            {/* EDIT MODE: Full Content & Image Management Studio               */}
            {/* ============================================================== */}
            {mode === 'edit' && (
              <div className="max-w-4xl mx-auto space-y-6">
                
                {/* 1. Project Identity & Metadata */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-indigo-600" />
                      <span>Project Identity &amp; Status</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      key: {section.key}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Project Headline (Shown in Card &amp; Header)
                      </label>
                      <input
                        type="text"
                        value={heading}
                        onChange={(e) => setHeading(e.target.value)}
                        className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white"
                        placeholder="e.g. Teacher App"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Category Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white"
                        placeholder="e.g. MOBILE APP, MANAGEMENT"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Publication Status
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as 'Published' | 'Draft')}
                        className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white"
                      >
                        <option value="Published">Published (Live on Website)</option>
                        <option value="Draft">Draft (Hidden)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. Main Hero Project Image (Mockup) */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-emerald-600" />
                      <span>Main Project Hero Mockup Image</span>
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    {/* Thumbnail preview */}
                    <div className="w-40 h-28 rounded-xl bg-slate-900 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 shadow-inner relative group">
                      <img
                        src={heroImage}
                        alt="Hero preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=400&q=80'
                        }}
                      />
                    </div>

                    {/* Image controls */}
                    <div className="flex-1 space-y-3 w-full">
                      <button
                        type="button"
                        onClick={() => heroFileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
                      >
                        <UploadCloud className="w-4 h-4" />
                        <span>Upload New Image</span>
                      </button>
                    </div>
                  </div>

                  <input
                    ref={heroFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) handleUploadFile(f, 'hero')
                    }}
                    className="hidden"
                  />
                </div>

                {/* 3. Inner Section: Project Overview Copy */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-sky-600" />
                      <span>Inner Section 1 · Executive Overview Narrative</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {overview.length} chars
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Detailed Project Overview (Rendered on Inner Page)
                    </label>
                    <textarea
                      rows={4}
                      value={overview}
                      onChange={(e) => setOverview(e.target.value)}
                      className="w-full text-xs sm:text-sm leading-relaxed p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white resize-y"
                      placeholder="Comprehensive overview explaining product goals, operational impact, and school ecosystem integration..."
                    />
                  </div>
                </div>

                {/* 4. Inner Section: Product Features List (Images + Content) */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>Inner Section 2 · Key Product Features ({features.length})</span>
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Each feature pair has side-by-side title, description, and high-res screen mockup.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Feature</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">
                              {idx + 1}
                            </span>
                            <span>Feature Block #{idx + 1}</span>
                          </span>

                          <div className="flex items-center gap-2">
                            <label className="text-[11px] text-slate-500 flex items-center gap-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={feat.reverse || false}
                                onChange={(e) => handleUpdateFeature(idx, 'reverse', e.target.checked)}
                                className="rounded text-indigo-600"
                              />
                              <span>Reverse layout</span>
                            </label>

                            <button
                              type="button"
                              onClick={() => handleRemoveFeature(idx)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                              title="Delete feature"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2 space-y-2">
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                                Feature Title
                              </label>
                              <input
                                type="text"
                                value={feat.title}
                                onChange={(e) => handleUpdateFeature(idx, 'title', e.target.value)}
                                className="w-full text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                                placeholder="e.g. Attendance at a tap"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                                Feature Description
                              </label>
                              <textarea
                                rows={2}
                                value={feat.description}
                                onChange={(e) => handleUpdateFeature(idx, 'description', e.target.value)}
                                className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                                placeholder="Details about this feature..."
                              />
                            </div>
                          </div>

                          {/* Feature Image */}
                          <div className="space-y-1.5">
                            <label className="block text-[11px] font-semibold text-slate-600">
                              Feature Screen Mockup
                            </label>
                            <div className="h-20 rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center p-1 relative group">
                              <img
                                src={feat.image}
                                alt={feat.title}
                                className="max-h-full max-w-full object-contain"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveFeatureUploadIndex(idx)
                                    featureFileInputRef.current?.click()
                                  }}
                                  className="p-1 rounded bg-white text-slate-800 text-[10px] font-semibold"
                                  title="Replace image"
                                >
                                  <RefreshCw className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCropTargetField({ type: 'feature', index: idx })
                                    setCropTargetImage(feat.image)
                                    setIsCropModalOpen(true)
                                  }}
                                  className="p-1 rounded bg-white text-slate-800 text-[10px] font-semibold"
                                  title="Crop image"
                                >
                                  <Crop className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            <input
                              type="text"
                              value={feat.image}
                              onChange={(e) => handleUpdateFeature(idx, 'image', e.target.value)}
                              className="w-full text-[10px] font-mono px-2 py-1 rounded border border-slate-200 bg-white"
                              placeholder="/assets/Teacher app/014.png"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <input
                    ref={featureFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f && activeFeatureUploadIndex !== null) {
                        handleUploadFile(f, 'feature', activeFeatureUploadIndex)
                      }
                    }}
                    className="hidden"
                  />
                </div>

                {/* 5. Inner Section: Screenshots Gallery */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-purple-600" />
                      <span>Inner Section 3 · Screenshots &amp; Assets Gallery ({screenshots.length})</span>
                    </span>
                    <span className="text-[11px] text-slate-400">
                      High-resolution mobile screens
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {screenshots.map((item, idx) => (
                      <div
                        key={idx}
                        className="group relative rounded-xl border border-slate-200 bg-slate-900 overflow-hidden aspect-[4/5]"
                      >
                        <img
                          src={item.src}
                          alt={item.alt}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveScreenshot(idx)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                          title="Remove screenshot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="absolute inset-x-0 bottom-0 bg-black/70 p-1.5">
                          <input
                            type="text"
                            value={item.alt}
                            onChange={(e) => {
                              const val = e.target.value
                              setScreenshots((prev) =>
                                prev.map((s, i) => (i === idx ? { ...s, alt: val } : s))
                              )
                            }}
                            className="w-full text-[10px] text-white bg-transparent border-b border-white/20 focus:outline-none focus:border-white px-0.5"
                            placeholder="Caption..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>


                </div>


              </div>
            )}
          </div>

        {/* Drawer Bottom Actions */}
        <div className="shrink-0 px-5 sm:px-6 py-4 border-t border-slate-200/90 bg-white flex items-center justify-between gap-3 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {showSavedToast && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Saved &amp; Updated!</span>
              </span>
            )}

            {mode === 'view' ? (
              <button
                type="button"
                onClick={() => setMode('edit')}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-indigo-300" />
                <span>Edit Content &amp; Media</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                {isSaving ? (
                  <span>Syncing...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Save &amp; Update Website</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Screenshot Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="max-w-4xl max-h-[90vh] bg-transparent flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={lightboxImage.src}
                alt={lightboxImage.alt}
                className="max-h-[80vh] w-auto rounded-2xl shadow-2xl object-contain border border-white/20"
              />
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-white text-xs font-semibold mt-3 text-center drop-shadow">
              {lightboxImage.alt}
            </p>
          </div>
        </div>
      )}

      {/* Image Crop Modal Integration */}
      <ImageCropModal
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        imageSrc={cropTargetImage}
        onCropComplete={handleCropComplete}
      />
    </>,
    document.body
  )
}
