'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  Upload,
  HardDrive,
  Image as ImageIcon,
  MapPin,
  Plus,
  Eye,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  X,
  ExternalLink,
  Copy,
  Check,
  Video,
  FileText,
  Maximize2,
  RefreshCw,
  FolderGit2,
  Layers,
} from 'lucide-react'
import {
  GalleryItem,
  GallerySectionConfig,
  initialGalleryItems,
  initialGallerySectionConfig,
} from '@/lib/galleryData'
import ConfirmModal from '@/components/ConfirmModal'

const STORAGE_KEY_ITEMS = 'docme_cms_gallery_items_v2'
const STORAGE_KEY_CONFIG = 'docme_cms_gallery_config_v2'



export default function MediaLibraryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(initialGalleryItems)
  const [sectionConfig, setSectionConfig] = useState<GallerySectionConfig>(initialGallerySectionConfig)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'Published' | 'Draft'>('all')
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Modals state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null)
  const [isLiveGalleryPreviewOpen, setIsLiveGalleryPreviewOpen] = useState(false)
  const [previewActiveIndex, setPreviewActiveIndex] = useState(0)
  const [itemToDelete, setItemToDelete] = useState<{ id: number; title: string } | null>(null)

  // Item Form State
  const [formTitle, setFormTitle] = useState('')
  const [formLocation, setFormLocation] = useState('')
  const [formCountry, setFormCountry] = useState('')
  const [formImage, setFormImage] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formStatus, setFormStatus] = useState<'Published' | 'Draft'>('Published')

  // Config Form State
  const [configHeading, setConfigHeading] = useState('')
  const [configTitle, setConfigTitle] = useState('')
  const [configDescription, setConfigDescription] = useState('')
  const [configBadge, setConfigBadge] = useState('')
  const [configStatus, setConfigStatus] = useState<'Published' | 'Draft'>('Published')

  // Load from localStorage
  useEffect(() => {
    try {
      const storedItems = localStorage.getItem(STORAGE_KEY_ITEMS)
      if (storedItems) {
        setGalleryItems(JSON.parse(storedItems))
      }
      const storedConfig = localStorage.getItem(STORAGE_KEY_CONFIG)
      if (storedConfig) {
        setSectionConfig(JSON.parse(storedConfig))
      }
    } catch {
      // ignore
    }
  }, [])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3200)
  }

  // Handle Escape key to close open modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (itemToDelete) setItemToDelete(null)
        else if (lightboxItem) setLightboxItem(null)
        else if (isLiveGalleryPreviewOpen) setIsLiveGalleryPreviewOpen(false)
        else if (isItemModalOpen) setIsItemModalOpen(false)
        else if (isConfigModalOpen) setIsConfigModalOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [itemToDelete, lightboxItem, isLiveGalleryPreviewOpen, isItemModalOpen, isConfigModalOpen])

  // Filtered gallery items
  const filteredGallery = useMemo(() => {
    return galleryItems.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.country || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description || '').toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus =
        statusFilter === 'all' || item.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [galleryItems, searchQuery, statusFilter])

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingItem(null)
    setFormTitle('')
    setFormLocation('')
    setFormCountry('')
    setFormImage('')
    setFormDescription('')
    setFormStatus('Published')
    setIsItemModalOpen(true)
  }

  // Open Edit Modal
  const handleOpenEditModal = (item: GalleryItem) => {
    setEditingItem(item)
    setFormTitle(item.title)
    setFormLocation(item.location)
    setFormCountry(item.country)
    setFormImage(item.image)
    setFormDescription(item.description)
    setFormStatus(item.status)
    setIsItemModalOpen(true)
  }

  // Save Item (Add or Update)
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle.trim() || !formImage.trim()) {
      alert('Please fill in both a title and an image URL.')
      return
    }

    let updated: GalleryItem[]
    if (editingItem) {
      updated = galleryItems.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              title: formTitle.trim(),
              location: formLocation.trim(),
              country: formCountry.trim(),
              image: formImage.trim(),
              description: formDescription.trim(),
              status: formStatus,
            }
          : item
      )
      showToast(`Updated "${formTitle.trim()}" in About gallery!`)
    } else {
      const newItem: GalleryItem = {
        id: Date.now(),
        title: formTitle.trim(),
        location: formLocation.trim(),
        country: formCountry.trim(),
        image: formImage.trim(),
        description: formDescription.trim(),
        status: formStatus,
        order: galleryItems.length + 1,
      }
      updated = [...galleryItems, newItem]
      showToast(`Added "${formTitle.trim()}" to About gallery!`)
    }

    setGalleryItems(updated)
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(updated))
    setIsItemModalOpen(false)
  }

  // Delete Item
  const handleDeleteItem = (id: number, title: string) => {
    setItemToDelete({ id, title })
  }

  const confirmDeleteItem = () => {
    if (!itemToDelete) return
    const { id, title } = itemToDelete
    const updated = galleryItems.filter((i) => i.id !== id)
    setGalleryItems(updated)
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(updated))
    setItemToDelete(null)
    showToast(`Removed "${title}" from gallery.`)
  }

  // Reorder Item
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= galleryItems.length) return

    const newItems = [...galleryItems]
    const temp = newItems[index]
    newItems[index] = newItems[targetIndex]
    newItems[targetIndex] = temp

    // re-assign orders
    const reordered = newItems.map((item, idx) => ({ ...item, order: idx + 1 }))
    setGalleryItems(reordered)
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(reordered))
    showToast('Gallery order updated.')
  }

  // Open Section Settings Modal
  const handleOpenConfigModal = () => {
    setConfigHeading(sectionConfig.heading)
    setConfigTitle(sectionConfig.sectionTitle)
    setConfigDescription(sectionConfig.description)
    setConfigBadge(sectionConfig.badgeText)
    setConfigStatus(sectionConfig.status)
    setIsConfigModalOpen(true)
  }

  // Save Section Settings
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault()
    const updated: GallerySectionConfig = {
      ...sectionConfig,
      heading: configHeading.trim(),
      sectionTitle: configTitle.trim(),
      description: configDescription.trim(),
      badgeText: configBadge.trim(),
      status: configStatus,
      lastModified: new Date().toISOString().split('T')[0],
    }
    setSectionConfig(updated)
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(updated))
    setIsConfigModalOpen(false)
    showToast('About Gallery Section settings saved successfully!')
  }

  // Quick Toggle Section Status
  const handleToggleSectionStatus = () => {
    const updated: GallerySectionConfig = {
      ...sectionConfig,
      status: sectionConfig.status === 'Published' ? 'Draft' : 'Published',
      lastModified: new Date().toISOString().split('T')[0],
    }
    setSectionConfig(updated)
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(updated))
    showToast(`Gallery Section status set to ${updated.status}`)
  }

  // Copy URL to clipboard
  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    setTimeout(() => setCopiedUrl(null), 2000)
    showToast('Media asset URL copied to clipboard!')
  }

  // Countries count
  const countriesCount = useMemo(() => {
    const set = new Set(galleryItems.map((i) => i.country).filter(Boolean))
    return set.size
  }, [galleryItems])

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 text-xs sm:text-sm animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs shrink-0">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Media &amp; Gallery Library
              </h1>
              <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-full">
                Website Media
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage visual destinations, high-resolution photography, and interactive media assets showcased across the website.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-xl shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Gallery Image</span>
          </button>
        </div>
      </div>

      {/* ================= GALLERY IMAGES CONTENT ================= */}
      <div className="space-y-6">

          {/* Controls: Search, Filter, Add */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search destinations, locations, countries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
                />
              </div>

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                {(['all', 'Published', 'Draft'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                      statusFilter === st
                        ? 'bg-white text-slate-900 font-semibold shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {st === 'all' ? 'All' : st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Destinations Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredGallery.map((item, index) => (
              <div
                key={item.id}
                className="group bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Image Card Top */}
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85'
                      }}
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white border border-white/20">
                        #{index + 1}
                      </span>

                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-md ${
                          item.status === 'Published'
                            ? 'bg-emerald-500/90 text-white'
                            : 'bg-amber-500/90 text-white'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>


                    {/* Quick Lightbox Button */}
                    <button
                      type="button"
                      onClick={() => setLightboxItem(item)}
                      title="View Full Resolution"
                      className="absolute top-2.5 right-12 w-6 h-6 rounded-md bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Maximize2 className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-3.5">
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="px-3.5 pb-3.5 pt-2 border-t border-slate-100 flex items-center justify-end gap-1.5">

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(item)}
                      className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id, item.title)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Destination"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredGallery.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto">
              <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-800">No destinations found</h3>
              <p className="text-xs text-slate-500 mt-1">
                Try adjusting your search query or add a new gallery image.
              </p>
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="mt-4 inline-flex items-center gap-1.5 bg-slate-900 text-white text-xs font-medium px-3.5 py-2 rounded-xl"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Destination</span>
              </button>
            </div>
          )}
        </div>

      {/* ================= MODAL 1: ADD / EDIT GALLERY ITEM ================= */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingItem ? 'Edit Gallery Destination' : 'Add New Gallery Destination'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  This destination will appear in the About page visual media gallery carousel.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsItemModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveItem} className="p-5 space-y-4 overflow-y-auto flex-1">
              {/* Destination Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Destination Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lions Binkert Trial"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                />
              </div>

              {/* Location & Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City / Region
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vancouver BC"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Canada"
                    value={formCountry}
                    onChange={(e) => setFormCountry(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                  />
                </div>
              </div>

              {/* Image URL & Preset Selection */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    High-Res Photo URL *
                  </label>
                  <span className="text-[10px] text-slate-400">Direct image link (Unsplash or CDN)</span>
                </div>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 font-mono text-xs"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Story / Description
                </label>
                <textarea
                  rows={3}
                  placeholder="An iconic alpine trek with breathtaking summit views overlooking..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Publication Status
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as 'Published' | 'Draft')}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                >
                  <option value="Published">Published (Visible on About Page)</option>
                  <option value="Draft">Draft (Hidden)</option>
                </select>
              </div>

              {/* Form Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-all active:scale-95"
                >
                  {editingItem ? 'Save Changes' : 'Add to Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: EDIT SECTION SETTINGS ================= */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">About Gallery Section Settings</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update the headline, subtitle, and live display settings for the About page.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsConfigModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section Headline (Shown on Website) *
                </label>
                <input
                  type="text"
                  required
                  value={configHeading}
                  onChange={(e) => setConfigHeading(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Badge Pill Text
                </label>
                <input
                  type="text"
                  value={configBadge}
                  onChange={(e) => setConfigBadge(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section Description / Subtitle
                </label>
                <textarea
                  rows={3}
                  value={configDescription}
                  onChange={(e) => setConfigDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section Status
                </label>
                <select
                  value={configStatus}
                  onChange={(e) => setConfigStatus(e.target.value as 'Published' | 'Draft')}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                >
                  <option value="Published">Published (Active on About Page)</option>
                  <option value="Draft">Draft (Disabled / Hidden)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsConfigModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-all active:scale-95"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: SINGLE IMAGE LIGHTBOX ================= */}
      {lightboxItem && (
        <div
          onClick={() => setLightboxItem(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl relative"
          >
            <div className="relative aspect-video w-full bg-black">
              <img
                src={lightboxItem.image}
                alt={lightboxItem.title}
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={() => setLightboxItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 text-white space-y-2">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold">
                <MapPin className="w-4 h-4" />
                <span>
                  {lightboxItem.location}, {lightboxItem.country}
                </span>
              </div>
              <h3 className="text-xl font-bold">{lightboxItem.title}</h3>
              <p className="text-sm text-zinc-300 leading-relaxed">{lightboxItem.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: LIVE INTERACTIVE ABOUT GALLERY PREVIEW ================= */}
      {isLiveGalleryPreviewOpen && galleryItems.length > 0 && (
        <div
          onClick={() => setIsLiveGalleryPreviewOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[92vh]"
          >
            {/* Top Bar */}
            <div className="px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  {sectionConfig.badgeText}
                </span>
                <span className="text-sm font-semibold text-white">
                  About Page Live Gallery Simulator
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsLiveGalleryPreviewOpen(false)}
                className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Carousel Display */}
            <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center min-h-[380px] sm:min-h-[460px]">
              {galleryItems[previewActiveIndex] && (
                <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-10">
                  <img
                    src={galleryItems[previewActiveIndex].image}
                    alt={galleryItems[previewActiveIndex].title}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35 pointer-events-none" />

                  {/* Header in Preview */}
                  <div className="relative z-10 flex items-center justify-between text-white">
                    <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/20">
                      Destination {previewActiveIndex + 1} of {galleryItems.length}
                    </span>
                    <span className="text-xs text-zinc-300 font-mono">
                      {galleryItems[previewActiveIndex].status}
                    </span>
                  </div>

                  {/* Bottom Caption in Preview */}
                  <div className="relative z-10 space-y-2 max-w-2xl text-white">
                    <div className="flex items-center gap-2 text-sky-300 text-xs sm:text-sm font-semibold">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>
                        {galleryItems[previewActiveIndex].location},{' '}
                        {galleryItems[previewActiveIndex].country}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                      {galleryItems[previewActiveIndex].title}
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-200 line-clamp-3 leading-relaxed">
                      {galleryItems[previewActiveIndex].description}
                    </p>
                  </div>

                  {/* Prev / Next Carousel Controls */}
                  <button
                    type="button"
                    onClick={() =>
                      setPreviewActiveIndex((prev) =>
                        prev === 0 ? galleryItems.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all active:scale-95"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setPreviewActiveIndex((prev) =>
                        prev === galleryItems.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all active:scale-95"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2.5 overflow-x-auto">
              {galleryItems.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPreviewActiveIndex(idx)}
                  className={`relative shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    previewActiveIndex === idx
                      ? 'border-sky-400 scale-105 shadow-md'
                      : 'border-zinc-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 text-[9px] font-mono text-white bg-black/70 px-1 rounded">
                    #{idx + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Delete Item Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(itemToDelete)}
        title="Remove Gallery Image?"
        description={`Are you sure you want to remove "${itemToDelete?.title || ''}" from the visual gallery library?`}
        confirmLabel="Remove Image"
        cancelLabel="Keep Image"
        isDestructive={true}
        onConfirm={confirmDeleteItem}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  )
}
