import { Request, Response } from 'express'
import { AuthService } from './auth.service.js'
import { validateLoginInput } from './auth.schema.js'
import { successResponse, errorResponse } from '../../utils/response.js'

const authService = new AuthService()

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const validation = validateLoginInput(req.body)
      if (!validation.isValid || !validation.data) {
        return errorResponse(res, validation.error || 'Invalid credentials input', 400)
      }

      const user = await authService.login(validation.data)
      req.session.user = user

      return successResponse(res, { user }, 'Login successful')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed'
      return errorResponse(res, message, 401)
    }
  }

  async logout(req: Request, res: Response) {
    req.session.destroy((err) => {
      if (err) {
        return errorResponse(res, 'Failed to logout cleanly', 500)
      }
      res.clearCookie('connect.sid')
      return successResponse(res, null, 'Logged out successfully')
    })
  }

  async getCurrentUser(req: Request, res: Response) {
    if (!req.session || !req.session.user) {
      return errorResponse(res, 'No active session', 401)
    }
    return successResponse(res, { user: req.session.user }, 'Session active')
  }
}
