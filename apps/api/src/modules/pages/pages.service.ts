import { CreatePageInput } from './pages.schema.js'

export interface PageModel {
  id: string
  slug: string
  title: string
  description?: string
  isPublished: boolean
  sectionsCount: number
  updatedAt: string
}

const mockPages: PageModel[] = [
  {
    id: 'page-home',
    slug: '/',
    title: 'Home',
    description: 'DocMe Corporate Website Homepage',
    isPublished: true,
    sectionsCount: 12,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'page-about',
    slug: '/about',
    title: 'About Us',
    description: 'About DocMe company history, leadership, and stats',
    isPublished: true,
    sectionsCount: 8,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'page-services',
    slug: '/services',
    title: 'Services',
    description: 'DocMe educational management modules and solutions',
    isPublished: true,
    sectionsCount: 4,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'page-portfolio',
    slug: '/portfolio',
    title: 'Portfolio',
    description: 'School deployments and partner impact studies',
    isPublished: true,
    sectionsCount: 6,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'page-contact',
    slug: '/contact',
    title: 'Contact',
    description: 'Reach out to DocMe specialists',
    isPublished: true,
    sectionsCount: 4,
    updatedAt: new Date().toISOString(),
  },
]

export class PagesService {
  async listPages(): Promise<PageModel[]> {
    return mockPages
  }

  async getPageBySlug(slug: string): Promise<PageModel | null> {
    return mockPages.find((p) => p.slug === slug) || null
  }

  async createPage(input: CreatePageInput): Promise<PageModel> {
    const existing = mockPages.find((p) => p.slug === input.slug)
    if (existing) {
      throw new Error(`Page with slug "${input.slug}" already exists`)
    }

    const page: PageModel = {
      id: `page-${Date.now()}`,
      slug: input.slug,
      title: input.title,
      description: input.description,
      isPublished: Boolean(input.isPublished),
      sectionsCount: 0,
      updatedAt: new Date().toISOString(),
    }
    mockPages.push(page)
    return page
  }
}
