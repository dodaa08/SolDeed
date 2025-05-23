import { useEffect, useState } from "react";
import { supabase } from "@/app/utils/supabaseClient";

export function useSupabaseJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setJobs(data || []);
      setLoading(false);
    }
    fetchJobs();
  }, []);

  return { jobs, loading };
} 