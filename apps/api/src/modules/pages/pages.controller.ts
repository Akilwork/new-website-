import { Request, Response } from 'express'
import { PagesService } from './pages.service.js'
import { validatePageInput } from './pages.schema.js'
import { successResponse, errorResponse } from '../../utils/response.js'

const pagesService = new PagesService()

export class PagesController {
  async list(req: Request, res: Response) {
    try {
      const pages = await pagesService.listPages()
      return successResponse(res, { pages }, 'Pages retrieved successfully')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to retrieve pages'
      return errorResponse(res, message, 500)
    }
  }

  async getBySlug(req: Request, res: Response) {
    try {
      const slug = (req.query.slug as string) || req.params.slug
      const page = await pagesService.getPageBySlug(slug)
      if (!page) {
        return errorResponse(res, 'Page not found', 404)
      }
      return successResponse(res, { page })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to retrieve page'
      return errorResponse(res, message, 500)
    }
  }

  async create(req: Request, res: Response) {
    try {
      const validation = validatePageInput(req.body)
      if (!validation.isValid || !validation.data) {
        return errorResponse(res, validation.error || 'Invalid page input', 400)
      }

      const page = await pagesService.createPage(validation.data)
      return successResponse(res, { page }, 'Page created successfully', 201)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create page'
      return errorResponse(res, message, 400)
    }
  }
}
