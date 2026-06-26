export type SiteStatus = 'up' | 'down' | 'unknown';

export interface Site {
  id: number;
  user_id: number;
  name: string;
  url: string;
  check_interval_minutes: number;
  is_active: boolean;
  status: SiteStatus;
  last_checked_at: string | null;
  logs_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateSiteRequest {
  name: string;
  url: string;
  check_interval_minutes?: number;
  is_active?: boolean;
}

export type UpdateSiteRequest = Partial<CreateSiteRequest>;
