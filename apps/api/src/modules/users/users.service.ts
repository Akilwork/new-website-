import { CreateUserInput } from './users.schema.js'

export interface UserModel {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'CONTENT_MANAGER'
  isActive: boolean
  createdAt: string
}

// In-memory mock with initial default users
const mockUsers: UserModel[] = [
  {
    id: 'user-admin-1',
    email: 'admin@docme.com',
    name: 'System Administrator',
    role: 'ADMIN',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-content-2',
    email: 'content@docme.com',
    name: 'Content Manager',
    role: 'CONTENT_MANAGER',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
]

export class UsersService {
  async listUsers(): Promise<UserModel[]> {
    return mockUsers
  }

  async createUser(input: CreateUserInput): Promise<UserModel> {
    const newUser: UserModel = {
      id: `user-${Date.now()}`,
      email: input.email,
      name: input.name,
      role: input.role,
      isActive: true,
      createdAt: new Date().toISOString(),
    }
    mockUsers.push(newUser)
    return newUser
  }

  async getUserById(id: string): Promise<UserModel | null> {
    return mockUsers.find((u) => u.id === id) || null
  }
}
