'use client'

import { useState, useEffect, useCallback } from 'react'
import { SectionItem, initialSectionsData } from './sectionsData'

export function useSections() {
  const [sections, setSections] = useState<SectionItem[]>(initialSectionsData)
  const [isLoading, setIsLoading] = useState(true)

  const fetchSections = useCallback(async () => {
    try {
      const res = await fetch('/api/sections', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          setSections(data)
        }
      }
    } catch (e) {
      // fallback to current state
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSections()

    // Periodically sync so changes made in CMS tab immediately reflect on the website
    const interval = setInterval(() => {
      fetchSections()
    }, 2500)

    // Also sync on window focus
    const onFocus = () => fetchSections()
    window.addEventListener('focus', onFocus)

    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', onFocus)
    }
  }, [fetchSections])

  const getSection = useCallback(
    (keyOrId: string, pageKey?: string): SectionItem | undefined => {
      return sections.find(
        (s) =>
          (s.key === keyOrId || s.id === keyOrId) &&
          (!pageKey || s.pageKey === pageKey)
      )
    },
    [sections]
  )

  return {
    sections,
    isLoading,
    getSection,
    refetch: fetchSections,
  }
}
