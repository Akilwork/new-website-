import { Router } from 'express'
import { SectionsController } from './sections.controller.js'
import { requireAuth, requireRole } from '../../middleware/auth.middleware.js'

export const sectionsRouter = Router()
const controller = new SectionsController()

// Public read routes for website frontends
sectionsRouter.get('/', (req, res) => controller.list(req, res))
sectionsRouter.get('/:key', (req, res) => controller.getByKey(req, res))

// Protected update routes for CMS admin
sectionsRouter.patch('/:key', requireAuth, requireRole(['ADMIN', 'CONTENT_MANAGER']), (req, res) => controller.update(req, res))
sectionsRouter.post('/', requireAuth, requireRole(['ADMIN']), (req, res) => controller.create(req, res))
