"use client";
import { type Job } from '@/app/hooks/useJobs';
import { CompanyLogo } from './CompanyLogo';
import { JobTag } from './JobTag';
import { formatRelativeTime, formatCompensation, formatSeniority, formatWorkMode } from '@/app/utils/formatters';

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <div className={`bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow ${
      job.highlighted ? 'border-blue-300 bg-blue-50/30 ring-1 ring-blue-300' : 'border-gray-200'
    }`}>
      <div className="flex flex-col md:flex-row items-start md:items-center">
        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-4">
          <CompanyLogo 
            company={job.organization.name} 
            logoUrl={job.organization.logo_url}
          />
        </div>
        
        <div className="flex-1">
          <h3 className={`text-lg font-semibold mb-1 ${
            job.highlighted ? 'text-blue-800' : 'text-gray-900'
          }`}>
            {job.title}
            {job.highlighted && (
              <span className="inline-flex items-center ml-2 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                Match
              </span>
            )}
          </h3>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="text-gray-700">{job.organization.name}</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-700">
              {job.locations && job.locations.length > 0 
                ? job.locations[0] 
                : (job.work_mode === 'remote' ? 'Remote' : 'Location not specified')}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            {job.seniority && (
              <JobTag 
                text={formatSeniority(job.seniority)} 
                type="blue" 
              />
            )}
            {job.work_mode && (
              <JobTag 
                text={formatWorkMode(job.work_mode)} 
                type="blue" 
              />
            )}
            <JobTag text={formatCompensation(job)} type="green" />
          </div>
        </div>
        
        <div className="flex flex-col items-end mt-4 md:mt-0 self-stretch justify-between w-full md:w-auto">
          <span className="text-sm text-gray-500 mb-2 md:mb-4">Posted {formatRelativeTime(job.created_at)}</span>
          <a href={job.url} target="_blank" rel="noopener noreferrer">
            <button className={`px-4 py-2 rounded hover:bg-blue-50 transition-colors text-sm font-medium ${
              job.highlighted 
                ? 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-600' 
                : 'bg-white border border-blue-600 text-blue-600'
            }`}>
              Apply Now
            </button>
          </a>
        </div>
      </div>
    </div>
  );
} 