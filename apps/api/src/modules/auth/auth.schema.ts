export interface LoginInput {
  email: string
  password: string
}

export function validateLoginInput(body: unknown): { isValid: boolean; error?: string; data?: LoginInput } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid payload' }
  }
  const { email, password } = body as Record<string, unknown>
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return { isValid: false, error: 'Valid email is required' }
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters' }
  }
  return { isValid: true, data: { email, password } }
}
