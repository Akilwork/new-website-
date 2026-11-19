'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  Newspaper,
  Plus,
  Eye,
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
  Calendar,
  Clock,
  User,
  ArrowRight,
  RefreshCw,
  FileText,
} from 'lucide-react'
import { BlogPost, initialBlogsData } from '@/lib/blogsData'
import ConfirmModal from '@/components/ConfirmModal'

const STORAGE_KEY_BLOGS = 'docme_cms_blogs_v1'

export default function BlogsManagementPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogsData)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'Published' | 'Draft'>('all')
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null)
  const [previewBlog, setPreviewBlog] = useState<BlogPost | null>(null)
  const [blogToDelete, setBlogToDelete] = useState<{ id: number; title: string } | null>(null)
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false)

  // Form State
  const [formTitle, setFormTitle] = useState('')
  const [formCategory, setFormCategory] = useState('Blog')
  const [formReadTime, setFormReadTime] = useState('15min read')
  const [formDate, setFormDate] = useState('')
  const [formAuthor, setFormAuthor] = useState('DocMe Engineering')
  const [formImage, setFormImage] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formStatus, setFormStatus] = useState<'Published' | 'Draft'>('Published')

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BLOGS)
      if (stored) {
        setBlogs(JSON.parse(stored))
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

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (blogToDelete) setBlogToDelete(null)
        else if (isResetConfirmOpen) setIsResetConfirmOpen(false)
        else if (previewBlog) setPreviewBlog(null)
        else if (isModalOpen) setIsModalOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [blogToDelete, isResetConfirmOpen, previewBlog, isModalOpen])

  // Filter blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch =
        !searchQuery.trim() ||
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus =
        statusFilter === 'all' || blog.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [blogs, searchQuery, statusFilter])

  // Open modal to add new
  const handleAddNew = () => {
    setEditingBlog(null)
    setFormTitle('')
    setFormCategory('Blog')
    setFormReadTime('15min read')
    const today = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    setFormDate(today)
    setFormAuthor('DocMe Editorial')
    setFormImage('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80')
    setFormDescription('')
    setFormStatus('Published')
    setIsModalOpen(true)
  }

  // Open modal to edit
  const handleEdit = (blog: BlogPost) => {
    setEditingBlog(blog)
    setFormTitle(blog.title)
    setFormCategory(blog.category)
    setFormReadTime(blog.readTime)
    setFormDate(blog.date)
    setFormAuthor(blog.author)
    setFormImage(blog.image)
    setFormDescription(blog.description)
    setFormStatus(blog.status)
    setIsModalOpen(true)
  }

  // Save blog
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle.trim()) {
      alert('Please provide an article title.')
      return
    }

    if (editingBlog) {
      const updated = blogs.map((b) =>
        b.id === editingBlog.id
          ? {
              ...b,
              title: formTitle.trim(),
              category: formCategory.trim() || 'Blog',
              readTime: formReadTime.trim() || '15min read',
              date: formDate.trim(),
              author: formAuthor.trim() || 'DocMe Editorial',
              image: formImage.trim(),
              description: formDescription.trim(),
              status: formStatus,
            }
          : b
      )
      setBlogs(updated)
      localStorage.setItem(STORAGE_KEY_BLOGS, JSON.stringify(updated))
      showToast(`Updated "${formTitle.slice(0, 32)}..."`)
    } else {
      const newPost: BlogPost = {
        id: Date.now(),
        title: formTitle.trim(),
        category: formCategory.trim() || 'Blog',
        readTime: formReadTime.trim() || '15min read',
        date: formDate.trim() || 'Recent',
        author: formAuthor.trim() || 'DocMe Editorial',
        image:
          formImage.trim() ||
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
        description: formDescription.trim(),
        status: formStatus,
        order: blogs.length + 1,
      }
      const updated = [newPost, ...blogs]
      setBlogs(updated)
      localStorage.setItem(STORAGE_KEY_BLOGS, JSON.stringify(updated))
      showToast(`Created new article "${newPost.title.slice(0, 32)}..."`)
    }

    setIsModalOpen(false)
  }

  // Delete blog
  const handleDelete = (id: number, title: string) => {
    setBlogToDelete({ id, title })
  }

  const confirmDeleteBlog = () => {
    if (!blogToDelete) return
    const { id } = blogToDelete
    const updated = blogs.filter((b) => b.id !== id)
    setBlogs(updated)
    localStorage.setItem(STORAGE_KEY_BLOGS, JSON.stringify(updated))
    setBlogToDelete(null)
    showToast('Article deleted successfully.')
  }

  // Reset to default
  const handleResetDefaults = () => {
    setIsResetConfirmOpen(true)
  }

  const confirmResetDefaults = () => {
    setBlogs(initialBlogsData)
    localStorage.setItem(STORAGE_KEY_BLOGS, JSON.stringify(initialBlogsData))
    setIsResetConfirmOpen(false)
    showToast('Reset to default blog articles.')
  }

  // Copy Image Link
  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    showToast('Image URL copied to clipboard')
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700/80 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Blogs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage thought leadership articles, case studies, and homepage insight cards.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetDefaults}
            title="Reset to default website articles"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 bg-white hover:text-slate-900 hover:bg-slate-50 border border-slate-200 shadow-2xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            type="button"
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Blog Post</span>
          </button>
        </div>
      </div>

      {/* ================= SEARCH & STATUS FILTER TOOLBAR ================= */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 sm:p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blogs by title, category, description, or author..."
            className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 self-start md:self-auto shrink-0 bg-slate-100 p-1 rounded-xl border border-slate-200/60">
          {(['all', 'Published', 'Draft'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === status
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {status === 'all' ? 'All Posts' : status}
            </button>
          ))}
        </div>
      </div>

      {/* ================= BLOG CARDS GRID ================= */}
      {filteredBlogs.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto">
          <Newspaper className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No blog posts found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search query or status filter, or create your first blog post.
          </p>
          <button
            type="button"
            onClick={handleAddNew}
            className="mt-4 inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Article</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
            >
              {/* Card Image Banner */}
              <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
                  }}
                />

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-md border shadow-xs ${
                      blog.status === 'Published'
                        ? 'bg-emerald-500/90 text-white border-emerald-400/40'
                        : 'bg-amber-500/90 text-white border-amber-400/40'
                    }`}
                  >
                    {blog.status}
                  </span>
                </div>

                {/* Copy Image Button */}
                <button
                  type="button"
                  onClick={() => handleCopyLink(blog.image)}
                  title="Copy image URL"
                  className="absolute top-3 right-3 p-2 rounded-lg bg-black/60 hover:bg-black text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {copiedUrl === blog.image ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  {/* Meta row: Category, Read time, Date */}
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {blog.category}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {blog.readTime}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-slate-400">{blog.date}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 line-clamp-2 leading-snug group-hover:text-slate-800 transition-colors">
                    {blog.title}
                  </h3>

                  {/* Description / Excerpt */}
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {blog.description}
                  </p>
                </div>

                {/* Author row */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 truncate">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{blog.author}</span>
                  </span>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewBlog(blog)}
                    className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg transition-colors border border-slate-200/60 shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Preview</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleEdit(blog)}
                      className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs transition-all active:scale-95"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(blog.id, blog.title)}
                      title="Delete blog post"
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= ADD / EDIT BLOG MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                  <Newspaper className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    {editingBlog ? 'Edit Blog Article' : 'Create New Blog Article'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingBlog
                      ? 'Update content, meta tags, and live publication status'
                      : 'Add an insightful post to your website blog library'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g., Comprehensive Digital Solutions for Institutional Management"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium"
                />
              </div>

              {/* 2-col Row: Category & Read Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="e.g., Blog, Innovation, Case Study"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Estimated Read Time
                  </label>
                  <input
                    type="text"
                    value={formReadTime}
                    onChange={(e) => setFormReadTime(e.target.value)}
                    placeholder="e.g., 15min read, 5min read"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
                  />
                </div>
              </div>

              {/* 2-col Row: Date & Author */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Publication Date
                  </label>
                  <input
                    type="text"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    placeholder="e.g., November 30, 2023"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Author / Team
                  </label>
                  <input
                    type="text"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    placeholder="e.g., DocMe Engineering"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
                  />
                </div>
              </div>

              {/* Image URL & Thumbnail Preview */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Featured Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
                  />
                  {formImage && (
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shrink-0">
                      <img
                        src={formImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Description / Summary */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Summary / Excerpt
                </label>
                <textarea
                  rows={4}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Comprehensive digital solutions designed to transform every aspect of institutional management..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all leading-relaxed"
                />
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Publishing Status
                </label>
                <div className="flex items-center gap-3">
                  <label
                    className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      formStatus === 'Published'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="Published"
                      checked={formStatus === 'Published'}
                      onChange={() => setFormStatus('Published')}
                      className="hidden"
                    />
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs">Published</span>
                  </label>

                  <label
                    className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      formStatus === 'Draft'
                        ? 'bg-amber-50 border-amber-300 text-amber-800 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="Draft"
                      checked={formStatus === 'Draft'}
                      onChange={() => setFormStatus('Draft')}
                      className="hidden"
                    />
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span className="text-xs">Draft</span>
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-5 py-2 rounded-xl shadow-xs transition-all active:scale-95"
                >
                  {editingBlog ? 'Save Changes' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= PREVIEW MODAL ================= */}
      {previewBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-950 text-white rounded-3xl shadow-2xl border border-white/10 max-w-2xl w-full overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
              <span className="text-xs font-mono text-zinc-400">Live Website Preview</span>
              <button
                type="button"
                onClick={() => setPreviewBlog(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content styled exactly like InsightSection.tsx */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-lg">
                <img
                  src={previewBlog.image}
                  alt={previewBlog.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Meta row */}
              <div className="flex items-center justify-between text-xs sm:text-sm text-zinc-400">
                <div>
                  <span className="text-white font-semibold">{previewBlog.category}</span>
                  <span className="mx-2">•</span>
                  <span>{previewBlog.readTime}</span>
                </div>
                <div>{previewBlog.date}</div>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                {previewBlog.title}
              </h2>

              {/* Description */}
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-serif">
                {previewBlog.description}
              </p>

              {/* Author footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
                <span>By {previewBlog.author}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    previewBlog.status === 'Published'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {previewBlog.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(blogToDelete)}
        title="Delete Blog Article?"
        description={`Are you sure you want to permanently delete "${blogToDelete?.title || ''}"? This action cannot be undone.`}
        confirmLabel="Delete Article"
        cancelLabel="Keep Article"
        isDestructive={true}
        onConfirm={confirmDeleteBlog}
        onCancel={() => setBlogToDelete(null)}
      />

      {/* Reset Defaults Confirmation Modal */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title="Reset All Blog Articles?"
        description="Are you sure you want to reset all blog articles to the original website default data? Any custom articles or edits you made will be replaced."
        confirmLabel="Reset to Defaults"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={confirmResetDefaults}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </div>
  )
}
