import { Request, Response } from 'express'
import { UsersService } from './users.service.js'
import { validateUserInput } from './users.schema.js'
import { successResponse, errorResponse } from '../../utils/response.js'

const usersService = new UsersService()

export class UsersController {
  async list(req: Request, res: Response) {
    try {
      const users = await usersService.listUsers()
      return successResponse(res, { users }, 'Users retrieved successfully')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to retrieve users'
      return errorResponse(res, message, 500)
    }
  }

  async create(req: Request, res: Response) {
    try {
      const validation = validateUserInput(req.body)
      if (!validation.isValid || !validation.data) {
        return errorResponse(res, validation.error || 'Invalid user input', 400)
      }

      const user = await usersService.createUser(validation.data)
      return successResponse(res, { user }, 'User created successfully', 201)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create user'
      return errorResponse(res, message, 500)
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const user = await usersService.getUserById(req.params.id)
      if (!user) {
        return errorResponse(res, 'User not found', 404)
      }
      return successResponse(res, { user })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to retrieve user'
      return errorResponse(res, message, 500)
    }
  }
}
