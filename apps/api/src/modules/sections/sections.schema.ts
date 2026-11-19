export interface CreateSectionInput {
  pageId: string
  key: string
  name: string
  type: string
  order?: number
  content: Record<string, unknown>
}

export function validateSectionInput(body: unknown): { isValid: boolean; error?: string; data?: CreateSectionInput } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid payload' }
  }
  const { pageId, key, name, type, order, content } = body as Record<string, unknown>
  if (!pageId || typeof pageId !== 'string') {
    return { isValid: false, error: 'pageId is required' }
  }
  if (!key || typeof key !== 'string') {
    return { isValid: false, error: 'key is required (e.g. about_video)' }
  }
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'name is required' }
  }
  if (!type || typeof type !== 'string') {
    return { isValid: false, error: 'type is required' }
  }
  if (!content || typeof content !== 'object') {
    return { isValid: false, error: 'content object is required' }
  }

  return {
    isValid: true,
    data: {
      pageId,
      key,
      name,
      type,
      order: typeof order === 'number' ? order : 0,
      content: content as Record<string, unknown>,
    },
  }
}
