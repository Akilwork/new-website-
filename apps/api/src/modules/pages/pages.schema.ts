export interface CreatePageInput {
  slug: string
  title: string
  description?: string
  isPublished?: boolean
}

export function validatePageInput(body: unknown): { isValid: boolean; error?: string; data?: CreatePageInput } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid payload' }
  }
  const { slug, title, description, isPublished } = body as Record<string, unknown>
  if (!slug || typeof slug !== 'string' || !slug.startsWith('/')) {
    return { isValid: false, error: 'Slug must start with a forward slash (e.g. /about)' }
  }
  if (!title || typeof title !== 'string') {
    return { isValid: false, error: 'Title is required' }
  }
  return {
    isValid: true,
    data: {
      slug,
      title,
      description: typeof description === 'string' ? description : undefined,
      isPublished: Boolean(isPublished),
    },
  }
}
