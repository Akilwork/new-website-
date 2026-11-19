import { Response } from 'express'

export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
  error?: string
  meta?: Record<string, unknown>
}

export function successResponse<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
  meta?: Record<string, unknown>
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  })
}

export function errorResponse(
  res: Response,
  error: string,
  statusCode = 400,
  details?: unknown
) {
  return res.status(statusCode).json({
    success: false,
    error,
    details,
  })
}
