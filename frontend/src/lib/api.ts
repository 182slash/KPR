const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/v1';

interface FetchOptions extends RequestInit {
  token?: string;
}

class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, ...rest } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...rest.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...rest,
    headers,
  });

  if (!response.ok) {
    let message = `HTTP error ${response.status}`;
    try {
      const errBody = await response.json();
      message = errBody.message ?? message;
    } catch {}
    throw new ApiError(message, response.status);
  }

  // Handle 204 No Content
  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}

// --- Albums ---
export const albumsApi = {
  list: () => apiFetch<{ data: import('@/types').Album[] }>('/albums'),
  get: (slug: string) => apiFetch<{ data: import('@/types').Album }>(`/albums/${slug}`),
};

// --- Events ---
export const eventsApi = {
  list: (params?: { upcoming?: boolean; city?: string; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.upcoming) qs.set('upcoming', 'true');
    if (params?.city) qs.set('city', params.city);
    if (params?.limit) qs.set('limit', String(params.limit));
    const q = qs.toString();
    return apiFetch<{ data: import('@/types').Event[] }>(`/events${q ? `?${q}` : ''}`);
  },
  get: (id: string) => apiFetch<{ data: import('@/types').Event }>(`/events/${id}`),
};

// --- Products ---
export const productsApi = {
  list: (params?: { category?: string; featured?: boolean }) => {
    const qs = new URLSearchParams();
    if (params?.category) qs.set('category', params.category);
    if (params?.featured) qs.set('featured', 'true');
    const q = qs.toString();
    return apiFetch<{ data: import('@/types').Product[] }>(`/products${q ? `?${q}` : ''}`);
  },
  get: (slug: string) => apiFetch<{ data: import('@/types').Product }>(`/products/${slug}`),
};

// --- Orders ---
export const ordersApi = {
  create: (payload: import('@/types').CreateOrderPayload) =>
    apiFetch<{ data: import('@/types').Order }>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

// --- Media ---
export const mediaApi = {
  list: (type?: 'photo' | 'video') => {
    const q = type ? `?type=${type}` : '';
    return apiFetch<{ data: import('@/types').Media[] }>(`/media${q}`);
  },
};

// --- Contact ---
export const contactApi = {
  submit: (data: import('@/types').ContactFormData) =>
    apiFetch<{ message: string }>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export { apiFetch, ApiError };
