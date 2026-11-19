import { Request, Response } from 'express'
import { SectionsService } from './sections.service.js'
import { validateSectionInput } from './sections.schema.js'
import { successResponse, errorResponse } from '../../utils/response.js'

const sectionsService = new SectionsService()

export class SectionsController {
  async list(req: Request, res: Response) {
    try {
      const pageId = req.query.pageId as string | undefined
      const sections = await sectionsService.listSections(pageId)
      return successResponse(res, { sections })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to retrieve sections'
      return errorResponse(res, message, 500)
    }
  }

  async getByKey(req: Request, res: Response) {
    try {
      const section = await sectionsService.getSectionByKey(req.params.key)
      if (!section) {
        return errorResponse(res, 'Section not found', 404)
      }
      return successResponse(res, { section })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to retrieve section'
      return errorResponse(res, message, 500)
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { content } = req.body
      if (!content || typeof content !== 'object') {
        return errorResponse(res, 'Valid content object is required', 400)
      }
      const updated = await sectionsService.updateSection(req.params.key, content)
      return successResponse(res, { section: updated }, 'Section updated successfully')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update section'
      return errorResponse(res, message, 400)
    }
  }

  async create(req: Request, res: Response) {
    try {
      const validation = validateSectionInput(req.body)
      if (!validation.isValid || !validation.data) {
        return errorResponse(res, validation.error || 'Invalid section input', 400)
      }
      const created = await sectionsService.createSection(validation.data)
      return successResponse(res, { section: created }, 'Section created successfully', 201)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create section'
      return errorResponse(res, message, 400)
    }
  }
}
