export interface MediaUploadMeta {
  originalName: string
  mimeType: string
  size: number
  altText?: string
}

export function validateMediaMeta(body: unknown): { isValid: boolean; error?: string; data?: MediaUploadMeta } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid payload' }
  }
  const { originalName, mimeType, size, altText } = body as Record<string, unknown>
  if (!originalName || typeof originalName !== 'string') {
    return { isValid: false, error: 'originalName is required' }
  }
  if (!mimeType || typeof mimeType !== 'string') {
    return { isValid: false, error: 'mimeType is required' }
  }
  if (!size || typeof size !== 'number') {
    return { isValid: false, error: 'Valid size is required' }
  }

  return {
    isValid: true,
    data: {
      originalName,
      mimeType,
      size,
      altText: typeof altText === 'string' ? altText : undefined,
    },
  }
}
