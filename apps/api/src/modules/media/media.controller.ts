import { Request, Response } from 'express'
import { MediaService } from './media.service.js'
import { validateMediaMeta } from './media.schema.js'
import { successResponse, errorResponse } from '../../utils/response.js'

const mediaService = new MediaService()

export class MediaController {
  async list(req: Request, res: Response) {
    try {
      const media = await mediaService.listMedia()
      return successResponse(res, { media })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to retrieve media'
      return errorResponse(res, message, 500)
    }
  }

  async uploadMetadata(req: Request, res: Response) {
    try {
      const validation = validateMediaMeta(req.body)
      if (!validation.isValid || !validation.data) {
        return errorResponse(res, validation.error || 'Invalid media metadata', 400)
      }
      const asset = await mediaService.registerMedia(validation.data)
      return successResponse(res, { asset }, 'Media metadata registered', 201)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to register media'
      return errorResponse(res, message, 400)
    }
  }
}
