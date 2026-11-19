import { CreateSectionInput } from './sections.schema.js'

export interface SectionModel {
  id: string
  pageId: string
  key: string
  name: string
  type: string
  order: number
  content: Record<string, unknown>
  updatedAt: string
}

const mockSections: SectionModel[] = [
  {
    id: 'section-about-video',
    pageId: 'page-about',
    key: 'about_video',
    name: 'About Video Showcase',
    type: 'VIDEO_PARALLAX',
    order: 4,
    content: {
      clipStart: 15,
      scale: 1.1,
      height: '125vh',
      videoUrl: '/assets/Our Story/klawsklaws_pindown.io_1780641670.mp4',
    },
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'section-about-stats',
    pageId: 'page-about',
    key: 'about_stats',
    name: 'About Live Stats Section',
    type: 'STATS_COUNTER',
    order: 5,
    content: {
      stats: [
        { value: 2950, suffix: '+', label: 'Active Member' },
        { value: 25, suffix: '+', label: 'Years of Experience' },
        { value: 2, suffix: '', label: 'Branch Location' },
      ],
    },
    updatedAt: new Date().toISOString(),
  },
]

export class SectionsService {
  async listSections(pageId?: string): Promise<SectionModel[]> {
    if (pageId) {
      return mockSections.filter((s) => s.pageId === pageId)
    }
    return mockSections
  }

  async getSectionByKey(key: string): Promise<SectionModel | null> {
    return mockSections.find((s) => s.key === key) || null
  }

  async updateSection(key: string, content: Record<string, unknown>): Promise<SectionModel> {
    const section = mockSections.find((s) => s.key === key)
    if (!section) {
      throw new Error(`Section "${key}" not found`)
    }
    section.content = { ...section.content, ...content }
    section.updatedAt = new Date().toISOString()
    return section
  }

  async createSection(input: CreateSectionInput): Promise<SectionModel> {
    const section: SectionModel = {
      id: `section-${Date.now()}`,
      pageId: input.pageId,
      key: input.key,
      name: input.name,
      type: input.type,
      order: input.order || 0,
      content: input.content,
      updatedAt: new Date().toISOString(),
    }
    mockSections.push(section)
    return section
  }
}
