export interface CreateUserInput {
  email: string
  name: string
  role: 'ADMIN' | 'CONTENT_MANAGER'
}

export function validateUserInput(body: unknown): { isValid: boolean; error?: string; data?: CreateUserInput } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid payload' }
  }
  const { email, name, role } = body as Record<string, unknown>
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return { isValid: false, error: 'Valid email is required' }
  }
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Name is required' }
  }
  if (role !== 'ADMIN' && role !== 'CONTENT_MANAGER') {
    return { isValid: false, error: 'Role must be ADMIN or CONTENT_MANAGER' }
  }
  return { isValid: true, data: { email, name, role } }
}
