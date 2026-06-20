const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Network error" }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  events: {
    list: (params?: Record<string, string>) =>
      fetchApi(`/events?${new URLSearchParams(params || {})}`),
    get: (id: string) => fetchApi(`/events/${id}`),
    search: (q: string) => fetchApi(`/events/search?q=${encodeURIComponent(q)}`),
  },
  trends: {
    list: (params?: Record<string, string>) =>
      fetchApi(`/trends?${new URLSearchParams(params || {})}`),
    get: (id: string) => fetchApi(`/trends/${id}`),
  },
  companies: {
    list: (params?: Record<string, string>) =>
      fetchApi(`/companies?${new URLSearchParams(params || {})}`),
    get: (id: string) => fetchApi(`/companies/${id}`),
  },
  reports: {
    list: (params?: Record<string, string>) =>
      fetchApi(`/reports?${new URLSearchParams(params || {})}`),
    get: (id: string) => fetchApi(`/reports/${id}`),
  },
  insights: {
    list: () => fetchApi("/insights"),
  },
  search: {
    query: (params: Record<string, string>) =>
      fetchApi(`/search?${new URLSearchParams(params)}`),
  },
  dashboard: {
    stats: () => fetchApi("/dashboard/stats"),
    following: () => fetchApi("/dashboard/following"),
    bookmarks: () => fetchApi("/dashboard/bookmarks"),
  },
  admin: {
    stats: () => fetchApi("/admin/stats"),
    sources: () => fetchApi("/admin/sources"),
    agents: () => fetchApi("/admin/agents"),
    users: () => fetchApi("/admin/users"),
    logs: () => fetchApi("/admin/logs"),
  },
  auth: {
    login: (email: string, password: string) =>
      fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    register: (data: { email: string; password: string; name: string }) =>
      fetchApi("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
};
