import { PublishVersionInput } from './publishing.schema.js'

export interface ContentVersionModel {
  id: string
  pageId: string
  versionNumber: number
  status: 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED' | 'ARCHIVED'
  author: string
  changelog?: string
  publishedAt?: string
  createdAt: string
}

const mockVersions: ContentVersionModel[] = [
  {
    id: 'ver-home-1',
    pageId: 'page-home',
    versionNumber: 1,
    status: 'PUBLISHED',
    author: 'Admin',
    changelog: 'Initial baseline publication of DocMe website',
    publishedAt: '2026-10-15T10:00:00.000Z',
    createdAt: '2026-10-15T09:00:00.000Z',
  },
  {
    id: 'ver-about-2',
    pageId: 'page-about',
    versionNumber: 2,
    status: 'PUBLISHED',
    author: 'Akil',
    changelog: 'GSAP count animation for stats section and video parallax clip reduction',
    publishedAt: '2026-10-16T08:30:00.000Z',
    createdAt: '2026-10-16T08:00:00.000Z',
  },
]

export class PublishingService {
  async listVersions(pageId?: string): Promise<ContentVersionModel[]> {
    if (pageId) {
      return mockVersions.filter((v) => v.pageId === pageId)
    }
    return mockVersions
  }

  async createVersion(input: PublishVersionInput, authorName = 'Editor'): Promise<ContentVersionModel> {
    const existing = mockVersions.filter((v) => v.pageId === input.pageId)
    const nextVersion = existing.length + 1

    const version: ContentVersionModel = {
      id: `ver-${Date.now()}`,
      pageId: input.pageId,
      versionNumber: nextVersion,
      status: input.status,
      author: authorName,
      changelog: input.changelog,
      publishedAt: input.status === 'PUBLISHED' ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
    }
    mockVersions.push(version)
    return version
  }
}
