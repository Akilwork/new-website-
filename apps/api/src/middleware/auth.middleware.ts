import { Request, Response, NextFunction } from 'express'
import { errorResponse } from '../utils/response.js'

export interface AuthSessionUser {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'CONTENT_MANAGER'
}

declare module 'express-session' {
  interface SessionData {
    user?: AuthSessionUser
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session || !req.session.user) {
    return errorResponse(res, 'Unauthorized: Active session required', 401)
  }
  next()
}

export function requireRole(allowedRoles: ('ADMIN' | 'CONTENT_MANAGER')[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session || !req.session.user) {
      return errorResponse(res, 'Unauthorized: Active session required', 401)
    }

    if (!allowedRoles.includes(req.session.user.role)) {
      return errorResponse(res, 'Forbidden: Insufficient privileges', 403)
    }

    next()
  }
}
