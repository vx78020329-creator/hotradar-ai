"use client";

import { useQuery } from "@tanstack/react-query";

const API_BASE = "https://aihot-v2-production.up.railway.app/api";

// Generic fetch helper
async function apiFetch<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  return json.data ?? json;
}

// ---- Events ----
export function useEvents(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["events", params],
    queryFn: async () => {
      const qs = new URLSearchParams(params || {});
      const json = await fetch(`${API_BASE}/events?${qs}`).then(r => r.json());
      return json.data || [];
    },
    refetchInterval: 120000, // auto-refresh every 2 min
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const json = await fetch(`${API_BASE}/events/${id}`).then(r => r.json());
      return json.data || json;
    },
    enabled: !!id,
  });
}

// ---- Reports ----
export function useReports() {
  return useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const json = await fetch(`${API_BASE}/reports`).then(r => r.json());
      return json.data || [];
    },
    refetchInterval: 120000,
  });
}

export function useReport(id: string) {
  return useQuery({
    queryKey: ["report", id],
    queryFn: async () => {
      const json = await fetch(`${API_BASE}/reports/${id}`).then(r => r.json());
      return json.data || json;
    },
    enabled: !!id,
  });
}

// ---- Trends ----
export function useTrends() {
  return useQuery({
    queryKey: ["trends"],
    queryFn: async () => {
      const json = await fetch(`${API_BASE}/trends`).then(r => r.json());
      return json.data || [];
    },
    refetchInterval: 120000,
  });
}

export function useTrend(id: string) {
  return useQuery({
    queryKey: ["trend", id],
    queryFn: async () => {
      const json = await fetch(`${API_BASE}/trends/${id}`).then(r => r.json());
      return json.data || json;
    },
    enabled: !!id,
  });
}

// ---- Companies ----
export function useCompanies() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const json = await fetch(`${API_BASE}/companies`).then(r => r.json());
      return json.data || [];
    },
  });
}

export function useCompany(id: string) {
  return useQuery({
    queryKey: ["company", id],
    queryFn: async () => {
      const json = await fetch(`${API_BASE}/companies/${id}`).then(r => r.json());
      return json.data || json;
    },
    enabled: !!id,
  });
}

// ---- Search ----
export function useSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      const json = await fetch(`${API_BASE}/events?limit=50`).then(r => r.json());
      const events = (json.data || []).filter((e: any) =>
        e.title?.toLowerCase().includes(query.toLowerCase()) ||
        e.summary?.toLowerCase().includes(query.toLowerCase()) ||
        e.category?.toLowerCase().includes(query.toLowerCase())
      );
      return { events, companies: [], reports: [] };
    },
    enabled: query.length > 0,
  });
}
