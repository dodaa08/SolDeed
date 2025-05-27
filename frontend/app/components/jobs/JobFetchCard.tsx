"use client";
import { useEffect, useState } from "react";
import { Job } from "@/app/types/Job";
import { CompanyLogo } from "./CompanyLogo";
import { JobTag } from "./JobTag";
import {
  formatRelativeTime,
  formatCompensation,
  formatSeniority,
  formatWorkMode
} from '@/app/utils/formatters';
import { useWallet } from '@solana/wallet-adapter-react';
import { TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';


interface JobFetchCardProps {
  jobId: string;
  isDark?: boolean;
  userId?: string;
}

export function JobFetchCard({ jobId, isDark = false, userId }: JobFetchCardProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { publicKey } = useWallet();

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

  const handleDelete = async () => {
    // Custom toast confirmation
    const confirmed = await new Promise<boolean>((resolve) => {
      toast((t) => (
        <span>
          Are you sure you want to delete this job?
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => { toast.dismiss(t.id); resolve(true); }}
              className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 text-xs"
            >
              Delete
            </button>
            <button
              onClick={() => { toast.dismiss(t.id); resolve(false); }}
              className="px-3 py-1 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 text-xs"
            >
              Cancel
            </button>
          </div>
        </span>
      ), { duration: 10000 });
    });
    if (!confirmed) return;
    const res = await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Job deleted!');
      setJob(null);
    } else {
      const data = await res.json();
      toast.error('Failed to delete job: ' + (data.error || 'Unknown error'));
    }
  };

  if (loading) return (
    <div className={`border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow ${isDark ? 'bg-black/120 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex flex-col md:flex-row items-start md:items-center animate-pulse">
        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-4">
          <div className="w-10 h-10 rounded-md bg-gray-300 dark:bg-gray-700" />
        </div>
        <div className="flex-1 w-full">
          <div className="h-5 w-1/2 mb-2 rounded bg-gray-300 dark:bg-gray-700" />
          <div className="flex gap-2 mb-2">
            <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-800" />
          </div>
          <div className="flex gap-2">
            <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-12 rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
        <div className="flex flex-col items-end mt-4 md:mt-0 w-full md:w-auto">
          <div className="h-4 w-20 mb-2 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-8 w-24 rounded bg-gray-300 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  );
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!job) return <div>No job found.</div>;

  const companyName = job.company_name;
  const logoUrl = job.logo || '';

  const cardBgClass = isDark
    ? 'bg-black/120 border-gray-700'
    : 'bg-white border-gray-200';

  const titleClass = isDark
    ? 'text-gray-100'
    : 'text-gray-900';

  const companyClass = isDark ? 'text-gray-300' : 'text-gray-700';
  const locationClass = isDark ? 'text-gray-300' : 'text-gray-700';
  const dividerClass = isDark ? 'text-gray-600' : 'text-gray-500';
  const postedClass = isDark ? 'text-gray-400' : 'text-gray-500';

  const applyBtnClass = isDark
    ? 'bg-gray-700 border border-gray-500 text-blue-400 hover:bg-gray-600'
    : 'bg-white border border-blue-600 text-blue-600 hover:bg-blue-50';

  const isOwner = userId && job && job.user_id && userId === job.user_id;

  return (
    <div className={`border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow ${cardBgClass} relative`}>
      {/* Delete icon button for owner, top-left */}
      {job && isOwner && (
        <button
          onClick={handleDelete}
          className="absolute top-3 left-0 p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-800 transition-colors"
          title="Delete Job"
          aria-label="Delete Job"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      )}
      <div className="flex flex-col md:flex-row items-start md:items-center">
        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-4">
          <CompanyLogo company={companyName} logoUrl={logoUrl} />
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-semibold mb-1 ${titleClass}`}>{job.position}</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className={companyClass}>{companyName}</span>
            <span className={dividerClass}>•</span>
            <span className={locationClass}>{job.location || 'Location not specified'}</span>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            {Array.isArray(job.tags)
              ? job.tags.map((tag: string, idx: number) => (
                  <JobTag key={idx} text={tag} type="blue" isDark={isDark} />
                ))
              : typeof job.tags === 'string' && job.tags.split(',').map((tag: string, idx: number) => (
                  <JobTag key={idx} text={tag.trim()} type="blue" isDark={isDark} />
                ))}
            <JobTag text="Competitive" type="green" isDark={isDark} />
          </div>
        </div>
        <div className="flex flex-col items-end mt-4 md:mt-0 self-stretch justify-between w-full md:w-auto">
          <span className={`text-sm mb-2 md:mb-4 ${postedClass}`}>
            Posted {job.created_at ? formatRelativeTime(new Date(job.created_at).getTime()) : 'Unknown'}
          </span>
          <a href={job.apply_url} target="_blank" rel="noopener noreferrer">
            <button className={`px-4 py-2 rounded transition-colors text-sm font-medium ${applyBtnClass}`}>
              Apply Now
            </button>
          </a>
        </div>
      </div>
    </div>
  );
} 