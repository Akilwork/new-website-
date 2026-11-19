import { Router } from 'express'
import { PagesController } from './pages.controller.js'
import { requireAuth, requireRole } from '../../middleware/auth.middleware.js'

export const pagesRouter = Router()
const controller = new PagesController()

// Public route to fetch published page structure
pagesRouter.get('/', (req, res) => controller.list(req, res))
pagesRouter.get('/:slug', (req, res) => controller.getBySlug(req, res))

// Protected route to create new pages
pagesRouter.post('/', requireAuth, requireRole(['ADMIN', 'CONTENT_MANAGER']), (req, res) => controller.create(req, res))
