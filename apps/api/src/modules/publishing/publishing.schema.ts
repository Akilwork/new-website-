export interface PublishVersionInput {
  pageId: string
  changelog?: string
  status: 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED'
}

export function validatePublishInput(body: unknown): { isValid: boolean; error?: string; data?: PublishVersionInput } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid payload' }
  }
  const { pageId, changelog, status } = body as Record<string, unknown>
  if (!pageId || typeof pageId !== 'string') {
    return { isValid: false, error: 'pageId is required' }
  }
  if (status !== 'DRAFT' && status !== 'IN_REVIEW' && status !== 'PUBLISHED') {
    return { isValid: false, error: 'status must be DRAFT, IN_REVIEW, or PUBLISHED' }
  }

  return {
    isValid: true,
    data: {
      pageId,
      changelog: typeof changelog === 'string' ? changelog : undefined,
      status,
    },
  }
}
