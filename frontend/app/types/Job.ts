export interface Job {
  id?: string;
  created_at: string;
  position: string;
  company_name: string;
  job_description: string;
  type: string;
  primary_tag: string;
  location: string;
  apply_url: string;
  logo?: string | null;
  user_id?: string;
} 