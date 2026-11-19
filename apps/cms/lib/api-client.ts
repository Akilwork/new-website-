const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      credentials: 'include',
    })

    const data = await res.json()
    if (!res.ok) {
      return { error: data.message || 'API request failed' }
    }
    return { data }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Network error'
    return { error: message }
  }
}
