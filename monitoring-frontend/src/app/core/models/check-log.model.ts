export interface CheckLog {
  id: number;
  site_id: number;
  status_code: number | null;
  response_time_ms: number | null;
  is_online: boolean;
  error_message: string | null;
  checked_at: string;
}
