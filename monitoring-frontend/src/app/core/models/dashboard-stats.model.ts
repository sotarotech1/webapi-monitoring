export interface DashboardStats {
  total_sites: number;
  sites_up: number;
  sites_down: number;
  sites_unknown: number;
  active_sites: number;
  uptime_percent: number | null;
}
