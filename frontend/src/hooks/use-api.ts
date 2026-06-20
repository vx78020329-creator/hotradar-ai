"use client";

import { useQuery } from "@tanstack/react-query";
import { mockEvents, mockTrends, mockCompanies, mockReports } from "@/lib/mock-data";

export function useEvents(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["events", params],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 500));
      let events = [...mockEvents];
      if (params?.category) {
        events = events.filter((e) => e.category === params.category);
      }
      if (params?.status) {
        events = events.filter((e) => e.status === params.status);
      }
      if (params?.sortBy === "heat") {
        events.sort((a, b) => b.heatScore - a.heatScore);
      }
      return events;
    },
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return mockEvents.find((e) => e.id === id) || null;
    },
  });
}

export function useTrends() {
  return useQuery({
    queryKey: ["trends"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      return mockTrends;
    },
  });
}

export function useTrend(id: string) {
  return useQuery({
    queryKey: ["trend", id],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return mockTrends.find((t) => t.id === id) || null;
    },
  });
}

export function useCompanies() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      return mockCompanies;
    },
  });
}

export function useCompany(id: string) {
  return useQuery({
    queryKey: ["company", id],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return mockCompanies.find((c) => c.id === id) || null;
    },
  });
}

export function useReports() {
  return useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      return mockReports;
    },
  });
}

export function useReport(id: string) {
  return useQuery({
    queryKey: ["report", id],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return mockReports.find((r) => r.id === id) || null;
    },
  });
}

export function useSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      const q = query.toLowerCase();
      const events = mockEvents.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.titleZh.includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
      );
      const companies = mockCompanies.filter(
        (c) => c.name.toLowerCase().includes(q) || c.nameZh.includes(q)
      );
      return { events, companies, reports: [] as typeof mockReports };
    },
    enabled: query.length > 0,
  });
}
