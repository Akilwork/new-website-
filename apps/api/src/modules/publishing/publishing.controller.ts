import { Request, Response } from 'express'
import { PublishingService } from './publishing.service.js'
import { validatePublishInput } from './publishing.schema.js'
import { successResponse, errorResponse } from '../../utils/response.js'

const publishingService = new PublishingService()

export class PublishingController {
  async list(req: Request, res: Response) {
    try {
      const pageId = req.query.pageId as string | undefined
      const versions = await publishingService.listVersions(pageId)
      return successResponse(res, { versions })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to retrieve publishing versions'
      return errorResponse(res, message, 500)
    }
  }

  async publish(req: Request, res: Response) {
    try {
      const validation = validatePublishInput(req.body)
      if (!validation.isValid || !validation.data) {
        return errorResponse(res, validation.error || 'Invalid publishing input', 400)
      }
      const author = req.session?.user?.name || 'Admin User'
      const version = await publishingService.createVersion(validation.data, author)
      return successResponse(res, { version }, 'Publishing action recorded', 201)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to record publish action'
      return errorResponse(res, message, 400)
    }
  }
}
