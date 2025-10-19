const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5100/api/v1'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

type RequestOptions = {
  method?: HttpMethod
  body?: unknown
  query?: Record<string, string | number | undefined>
}

const buildUrl = (path: string, query?: RequestOptions['query']) => {
  const url = new URL(`${API_BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`)
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    })
  }
  return url.toString()
}

export const apiClient = async <T>(path: string, options: RequestOptions = {}) => {
  const { method = 'GET', body, query } = options
  const response = await fetch(buildUrl(path, query), {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const contentType = response.headers.get('Content-Type') ?? ''
  const isJson = contentType.includes('application/json')
  const payload = isJson ? await response.json() : null

  if (!response.ok) {
    const error = new Error(
      (payload && payload.message) || 'Permintaan ke server gagal diproses',
    )
    throw Object.assign(error, { payload, status: response.status })
  }

  return payload as T
}

export const getApiBaseUrl = () => API_BASE_URL
