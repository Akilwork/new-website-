import { Router } from 'express'
import { MediaController } from './media.controller.js'
import { requireAuth, requireRole } from '../../middleware/auth.middleware.js'

export const mediaRouter = Router()
const controller = new MediaController()

mediaRouter.get('/', (req, res) => controller.list(req, res))
mediaRouter.post('/', requireAuth, requireRole(['ADMIN', 'CONTENT_MANAGER']), (req, res) => controller.uploadMetadata(req, res))
