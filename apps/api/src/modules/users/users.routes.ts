import { Router } from 'express'
import { UsersController } from './users.controller.js'
import { requireAuth, requireRole } from '../../middleware/auth.middleware.js'

export const usersRouter = Router()
const controller = new UsersController()

usersRouter.get('/', requireAuth, (req, res) => controller.list(req, res))
usersRouter.get('/:id', requireAuth, (req, res) => controller.getById(req, res))
usersRouter.post('/', requireAuth, requireRole(['ADMIN']), (req, res) => controller.create(req, res))
