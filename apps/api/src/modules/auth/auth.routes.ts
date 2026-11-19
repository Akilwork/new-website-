import { Router } from 'express'
import { AuthController } from './auth.controller.js'
import { requireAuth } from '../../middleware/auth.middleware.js'

export const authRouter = Router()
const controller = new AuthController()

authRouter.post('/login', (req, res) => controller.login(req, res))
authRouter.post('/logout', requireAuth, (req, res) => controller.logout(req, res))
authRouter.get('/me', requireAuth, (req, res) => controller.getCurrentUser(req, res))
