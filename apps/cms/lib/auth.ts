export interface CmsUser {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'CONTENT_MANAGER'
}

export interface SessionState {
  user: CmsUser | null
  isAuthenticated: boolean
}
