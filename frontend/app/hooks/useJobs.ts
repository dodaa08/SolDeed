"use client";
import { useState, useEffect, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import jobsData from '@/app/data/all_jobs.json';

export interface Job {
  id: number;
  title: string;
  slug: string;
  url: string;
  created_at: number;
  work_mode: string | null;
  seniority: string | null;
  compensation_amount_min_cents: number | null;
  compensation_amount_max_cents: number | null;
  compensation_currency: string | null;
  locations: string[];
  organization: {
    company_name: string;
    logo: string;
    id: number;
    head_count: number;
    industry_tags: string[];
  };
  highlighted?: boolean; // New field for search highlights
}

export interface UseJobsResult {
  jobs: Job[];
  allJobs: Job[]; // All jobs for search suggestions
  isLoading: boolean;
  error: Error | null;
  searchJobs: (title: string, location?: string) => void;
  searchTitle: string;
  searchLocation: string;
  filteredJobs: Job[];
  clearSearch: () => void;
  isSearching: boolean;
  walletAddress: string | null;
  handleConnect: () => void;
  isConnected: boolean;
}

export function useJobs(): UseJobsResult {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTitle, setSearchTitle] = useState<string>('');
  const [searchLocation, setSearchLocation] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  
  const { publicKey, wallet, connect, connected } = useWallet();
  const walletAddress = publicKey?.toString() || null;
  const isConnected = connected && !!walletAddress;

  // Function to get all jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Simulate API call with a timeout
        setTimeout(() => {
          setJobs(jobsData as unknown as Job[]);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs based on search criteria
  const filteredJobs = useMemo(() => {
    if (!searchTitle && !searchLocation) return jobs;
    
    return jobs.filter((job) => {
      const titleMatch = searchTitle 
        ? job.title.toLowerCase().includes(searchTitle.toLowerCase()) || 
          job.organization.company_name.toLowerCase().includes(searchTitle.toLowerCase())
        : true;
      
      const locationMatch = searchLocation 
        ? job.locations && job.locations.some(loc => loc && loc.toLowerCase().includes(searchLocation.toLowerCase()))
        : true;
      
      // If both search parameters are provided, both must match
      if (searchTitle && searchLocation) {
        return titleMatch && locationMatch;
      }
      
      // If only one search parameter is provided, match on that one
      if (searchTitle) return titleMatch;
      if (searchLocation) return locationMatch;
      
      return true;
    });
  }, [jobs, searchTitle, searchLocation]);

  // Function to handle job search
  const searchJobs = (title: string, location?: string) => {
    setIsSearching(true);
    
    // If single query contains both title and location
    if (title && !location && title.includes(' ')) {
      const terms = title.split(' ');
      
      // Try to identify if any terms might be locations
      const possibleLocations = terms.filter(term => 
        jobs.some(job => job.locations && job.locations.some(loc => 
          loc && loc.toLowerCase().includes(term.toLowerCase())
        ))
      );
      
      if (possibleLocations.length > 0) {
        // Use the first possible location term and the rest as title
        const locationTerm = possibleLocations[0];
        const titleTerms = terms.filter(term => term !== locationTerm);
        
        setSearchLocation(locationTerm);
        setSearchTitle(titleTerms.join(' '));
      } else {
        // No location found, use entire query as title
        setSearchTitle(title);
        setSearchLocation(location || '');
      }
    } else {
      // Normal case with separate title and location
      setSearchTitle(title);
      setSearchLocation(location || '');
    }
    
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  // Function to clear search
  const clearSearch = () => {
    setSearchTitle('');
    setSearchLocation('');
    setIsSearching(false);
  };

  // Function to handle wallet connection
  const handleConnect = async () => {
    if (wallet) {
      try {
        await connect();
      } catch (error) {
        console.error("Connection error:", error);
      }
    }
  };

  return {
    jobs: filteredJobs.slice(0, isConnected ? filteredJobs.length : 10),
    allJobs: jobs, // Make all jobs available for search suggestions
    isLoading,
    error,
    searchJobs,
    searchTitle,
    searchLocation,
    filteredJobs,
    clearSearch,
    isSearching,
    walletAddress,
    handleConnect,
    isConnected
  };
} 