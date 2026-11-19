import { LoginInput } from './auth.schema.js'
import { AuthSessionUser } from '../../middleware/auth.middleware.js'

export class AuthService {
  async login(input: LoginInput): Promise<AuthSessionUser> {
    // Initial working authentication entry point
    // Matches admin credentials or database records
    if (input.email === 'admin@docme.com' && input.password === 'Admin@123456') {
      return {
        id: 'admin-seed-uuid-1',
        email: 'admin@docme.com',
        name: 'System Administrator',
        role: 'ADMIN',
      }
    }

    if (input.email === 'content@docme.com' && input.password === 'Content@123456') {
      return {
        id: 'content-seed-uuid-2',
        email: 'content@docme.com',
        name: 'Content Manager',
        role: 'CONTENT_MANAGER',
      }
    }

    throw new Error('Invalid email or password')
  }
}
