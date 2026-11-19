import { MediaUploadMeta } from './media.schema.js'

export interface MediaAssetModel {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  altText?: string
  createdAt: string
}

const mockMedia: MediaAssetModel[] = [
  {
    id: 'media-1',
    filename: 'Docme_Logo_1.png',
    originalName: 'Docme Logo 1.png',
    mimeType: 'image/png',
    size: 43617,
    url: '/assets/Docme Logo 1.png',
    altText: 'DocMe Corporate Logo',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'media-2',
    filename: 'Hero_Section.mp4',
    originalName: 'Hero Section.mp4',
    mimeType: 'video/mp4',
    size: 21810000,
    url: '/assets/Hero Section.mp4',
    altText: 'Hero Section Video Loop',
    createdAt: new Date().toISOString(),
  },
]

export class MediaService {
  async listMedia(): Promise<MediaAssetModel[]> {
    return mockMedia
  }

  async registerMedia(meta: MediaUploadMeta): Promise<MediaAssetModel> {
    const asset: MediaAssetModel = {
      id: `media-${Date.now()}`,
      filename: `${Date.now()}-${meta.originalName.replace(/\s+/g, '_')}`,
      originalName: meta.originalName,
      mimeType: meta.mimeType,
      size: meta.size,
      url: `/uploads/${meta.originalName}`,
      altText: meta.altText,
      createdAt: new Date().toISOString(),
    }
    mockMedia.push(asset)
    return asset
  }
}
