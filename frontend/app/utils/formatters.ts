"use client";
import { Job } from '@/app/hooks/useJobs';

// Format compensation data
export const formatCompensation = (job: Job): string => {
  if (!job.compensation_amount_min_cents && !job.compensation_amount_max_cents) {
    return 'Competitive';
  }
  
  const formatSalary = (cents: number | null): string => {
    if (!cents) return '';
    const amount = cents / 100;
    return amount >= 1000 ? `$${Math.floor(amount/1000)}k` : `$${amount}`;
  };
  
  const min = formatSalary(job.compensation_amount_min_cents);
  const max = formatSalary(job.compensation_amount_max_cents);
  
  if (min && max) return `${min} - ${max}`;
  if (min) return `From ${min}`;
  if (max) return `Up to ${max}`;
  
  return 'Competitive';
};

// Format relative time
export const formatRelativeTime = (timestamp: number): string => {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;
  
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  if (diff < 2592000) return `${Math.floor(diff / 604800)} weeks ago`;
  
  return `${Math.floor(diff / 2592000)} months ago`;
};

// Format seniority level
export const formatSeniority = (seniority: string | null): string => {
  if (!seniority) return '';
  
  return seniority
    .split('_')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Format work mode
export const formatWorkMode = (workMode: string | null): string => {
  if (!workMode) return '';
  
  switch(workMode) {
    case 'remote': return 'Remote';
    case 'on_site': return 'On-site';
    case 'hybrid': return 'Hybrid';
    default: return workMode;
  }
}; 