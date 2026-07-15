import { useQuery } from "@tanstack/react-query";

export interface PlatformStats {
  farmers: string;
  loansDisbursed: string;
  counties: string;
  satisfaction: string;
}

async function fetchPlatformStats(): Promise<PlatformStats> {
  const res = await fetch("/api/platform-stats");
  if (!res.ok) {
    throw new Error(`Failed to fetch platform stats: ${res.status}`);
  }
  return res.json();
}

export function usePlatformStats() {
  return useQuery({
    queryKey: ["platform-stats"],
    queryFn: fetchPlatformStats,
    staleTime: 5 * 60 * 1000, // 5 minutes — these numbers don't need to be second-fresh
    retry: 1,
  });
}