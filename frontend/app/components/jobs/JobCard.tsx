"use client";
import { type Job } from '@/app/hooks/useJobs';
import { CompanyLogo } from './CompanyLogo';
import { JobTag } from './JobTag';
import { formatRelativeTime, formatCompensation, formatSeniority, formatWorkMode } from '@/app/utils/formatters';

interface JobCardProps {
  job: Job;
  isDark?: boolean;
}

export function JobCard({ job, isDark = false }: JobCardProps) {
  // Define conditional card styles based on theme
  const cardBgClass = isDark
    ? job.highlighted 
      ? 'bg-blue-900/30 border-blue-700 ring-1 ring-blue-700'
      : 'bg-gray-800 border-gray-700'
    : job.highlighted 
      ? 'bg-blue-50/30 border-blue-300 ring-1 ring-blue-300' 
      : 'bg-white border-gray-200';
  
  const titleClass = isDark
    ? job.highlighted
      ? 'text-blue-300'
      : 'text-gray-100'
    : job.highlighted
      ? 'text-blue-800'
      : 'text-gray-900';
  
  const highlightBadgeClass = isDark
    ? 'bg-blue-900 text-blue-300'
    : 'bg-blue-100 text-blue-800';
    
  const companyClass = isDark ? 'text-gray-300' : 'text-gray-700';
  const locationClass = isDark ? 'text-gray-300' : 'text-gray-700';
  const dividerClass = isDark ? 'text-gray-600' : 'text-gray-500';
  const postedClass = isDark ? 'text-gray-400' : 'text-gray-500';
  
  const applyBtnClass = isDark
    ? job.highlighted
      ? 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-600'
      : 'bg-gray-700 border border-blue-500 text-blue-400 hover:bg-gray-600'
    : job.highlighted
      ? 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-600'
      : 'bg-white border border-blue-600 text-blue-600 hover:bg-blue-50';

  return (
    <div className={`border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow ${cardBgClass}`}>
      <div className="flex flex-col md:flex-row items-start md:items-center">
        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-4">
          <CompanyLogo 
            company={job.organization.name} 
            logoUrl={job.organization.logo_url}
          />
        </div>
        
        <div className="flex-1">
          <h3 className={`text-lg font-semibold mb-1 ${titleClass}`}>
            {job.title}
            {job.highlighted && (
              <span className={`inline-flex items-center ml-2 px-2 py-0.5 rounded text-xs font-medium ${highlightBadgeClass}`}>
                Match
              </span>
            )}
          </h3>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className={companyClass}>{job.organization.name}</span>
            <span className={dividerClass}>•</span>
            <span className={locationClass}>
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
                isDark={isDark}
              />
            )}
            {job.work_mode && (
              <JobTag 
                text={formatWorkMode(job.work_mode)} 
                type="blue"
                isDark={isDark}
              />
            )}
            <JobTag text={formatCompensation(job)} type="green" isDark={isDark} />
          </div>
        </div>
        
        <div className="flex flex-col items-end mt-4 md:mt-0 self-stretch justify-between w-full md:w-auto">
          <span className={`text-sm mb-2 md:mb-4 ${postedClass}`}>Posted {formatRelativeTime(job.created_at)}</span>
          <a href={job.url} target="_blank" rel="noopener noreferrer">
            <button className={`px-4 py-2 rounded transition-colors text-sm font-medium ${applyBtnClass}`}>
              Apply Now
            </button>
          </a>
        </div>
      </div>
    </div>
  );
} 