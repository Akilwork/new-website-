import { Router } from 'express'
import { PublishingController } from './publishing.controller.js'
import { requireAuth, requireRole } from '../../middleware/auth.middleware.js'

export const publishingRouter = Router()
const controller = new PublishingController()

publishingRouter.get('/', requireAuth, (req, res) => controller.list(req, res))
publishingRouter.post('/', requireAuth, requireRole(['ADMIN', 'CONTENT_MANAGER']), (req, res) => controller.publish(req, res))
