import { Request, Response, NextFunction } from 'express'
import { errorResponse } from '../utils/response.js'

export function notFoundHandler(req: Request, res: Response) {
  return errorResponse(res, `Route not found: ${req.method} ${req.originalUrl}`, 404)
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error('Unhandled API Error:', err)
  const statusCode = (err as { status?: number }).status || 500
  return errorResponse(
    res,
    process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    statusCode,
    process.env.NODE_ENV === 'production' ? undefined : err.stack
  )
}
