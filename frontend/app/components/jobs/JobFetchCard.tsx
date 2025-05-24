"use client";
import { useEffect, useState } from "react";
import { Job } from "@/app/types/Job";
import { CompanyLogo } from "./CompanyLogo";
import { JobTag } from "./JobTag";

interface JobFetchCardProps {
  jobId: string;
  isDark?: boolean;
}

export function JobFetchCard({ jobId, isDark = false }: JobFetchCardProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJob() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/jobs/${jobId}`);  
        if (!res.ok) throw new Error("Failed to fetch job");
        const data = await res.json();
        setJob(data.job);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [jobId]);

  if (loading) return <div>Loading job...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!job) return <div>No job found.</div>;

  return (
    <div className="border rounded-lg p-5 shadow-sm">
      <div className="flex items-center mb-2">
        <CompanyLogo company={job.company_name || 'Unknown'} logoUrl={job.logo || undefined} />
        <div className="ml-4">
          <h3 className="text-lg font-semibold">{job.position}</h3>
          <div className="text-gray-500">{job.company_name}</div>
        </div>
      </div>
      <div className="mb-2">
        <span className="text-gray-700">{job.location || "Location not specified"}</span>
      </div>
      <div className="mb-2">
        <JobTag text={job.primary_tag} type="blue" isDark={isDark} />
      </div>
      <div className="mb-2">
        <span>{job.job_description}</span>
      </div>
      <a href={job.apply_url} target="_blank" rel="noopener noreferrer">
        <button className="mt-2 px-4 py-2 rounded bg-blue-600 text-white">Apply Now</button>
      </a>
    </div>
  );
} 