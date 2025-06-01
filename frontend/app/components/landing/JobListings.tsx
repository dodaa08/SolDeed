"use client";
import { useEffect, useState, useRef } from 'react';
import { useJobs, UseJobsResult } from '@/app/hooks/useJobs';
import { JobCard } from '../jobs/JobCard';
import { ConnectWalletBanner } from '../jobs/ConnectWalletBanner';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from "next-themes";
import { useSupabaseUser } from '@/app/hooks/useSupabaseUser';
import toast from 'react-hot-toast';

interface JobListingsProps {
  jobsState: UseJobsResult;
}


export default function JobListings({ jobsState }: JobListingsProps) {
  const router = useRouter(); 
  const [mounted, setMounted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Track if this is the initial page load
  const isInitialMount = useRef(true);
  
  // Track if we've shown the message in this session
  const hasShownMessage = useRef(false);
  
  // Get wallet connection from Solana wallet adapter
  const { connected } = useWallet();

  // Theme handling
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  const { 
    jobs, 
    filteredJobs,
    isLoading,
    isConnected, 
    walletAddress,
    handleConnect,
  } = jobsState;

  // Pagination state
  const [page, setPage] = useState(1);
  const jobsPerPage = 10;

  // Sort jobs oldest to newest (newest at the end)
  const sortedJobs = jobs && jobs.length > 0
    ? [...jobs].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    : [];

  const totalPages = Math.ceil(sortedJobs.length / jobsPerPage);
  const paginatedJobs = sortedJobs.slice((page - 1) * jobsPerPage, page * jobsPerPage);

  // Mount the component client-side to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Conditional styling based on theme
  const sectionBgClass = mounted && isDark ? "bg-black/95" : "bg-white";
  const headingTextClass = mounted && isDark ? "text-gray-100" : "text-gray-900";
  const subTextClass = mounted && isDark ? "text-gray-400" : "text-gray-500";
  const connectedBadgeClass = mounted && isDark 
    ? "bg-gray-800 text-gray-300" 
    : "bg-gray-100 text-gray-800";
  const viewMoreBtnClass = mounted && (isDark && isConnected)
    ? "bg-gray-700 text-white hover:bg-gray-600"
    : mounted && (isDark && !isConnected)
      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
      : mounted && isConnected
        ? "bg-blue-600 text-white hover:bg-blue-700"
        : "bg-gray-100 text-gray-800 hover:bg-gray-200";
  const noJobsClass = mounted && isDark ? "text-gray-400 text-center h-screen" : "text-gray-500 text-center h-screen";

  // Format wallet address for display
  const formatWalletAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // Navigate to jobs page
  const viewMoreJobs = () => {
    router.push('/jobs');
  };
  
  // Custom connect function that also triggers success message
  const handleConnectWallet = async () => {
    await handleConnect();
    
    // Mark that we should show the message after connection
    hasShownMessage.current = false;
  };

  // Show success message only on fresh connection
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    // If this is page load and already connected, don't show message
    if (isInitialMount.current && connected) {
      isInitialMount.current = false;
      hasShownMessage.current = true; // Skip showing message
      return;
    }
    
    // No longer initial mount
    isInitialMount.current = false;
    
    if (connected && !hasShownMessage.current) {
      // Show success message after connecting
      timer = setTimeout(() => {
        setShowSuccess(true);
        
        // Hide message after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
        
        // Mark that we've shown the message
        hasShownMessage.current = true;
      }, 500);
    } else if (!connected) {
      // Reset when disconnected
      setShowSuccess(false);
      hasShownMessage.current = false;
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [connected]);

  const user = useSupabaseUser();

  const handleViewAllJobs = () => {
    if (!user || !isConnected) {
      toast.error('You must be signed in and connected to your wallet to view jobs.');
      return;
    }
    router.push('/jobs');
  };

  return (
    <div id="job-listings" className={`${sectionBgClass} py-10`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className={`text-2xl md:text-3xl font-bold ${headingTextClass}`}>
              Featured Jobs
            </h2>
            <p className={subTextClass + " mt-1"}>
              Find your dream job in blockchain and web3
            </p>
          </div>
          
          {isConnected && walletAddress && (
            <div className={`text-sm ${connectedBadgeClass} py-1 px-3 rounded-full`}>
              Connected: {formatWalletAddress(walletAddress)}
            </div>
          )}
        </div>

        {/* Connect Wallet Banner - ConnectWalletBanner component should handle dark mode itself */}
        {!isConnected && (
          <ConnectWalletBanner 
            totalJobs={sortedJobs.length} 
            onConnect={handleConnectWallet}
            isDark={mounted && isDark}
          />
        )}

        {/* Wallet connected notification */}
        {isConnected && showSuccess && (
          <div className={`${mounted && isDark ? 'bg-green-900 border-green-800' : 'bg-green-50 border-green-200'} border rounded-lg p-4 mb-8 animate-fadeIn`}>
            <div className={`flex items-center ${mounted && isDark ? 'text-green-400' : 'text-green-800'}`}>
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="font-medium">
                Wallet connected. You now have access to all job listings.
              </p>
            </div>
          </div>
        )}

        {/* Display job count */}
        <div className={`mb-6 text-sm ${subTextClass}`}>
          Showing {paginatedJobs.length} of {sortedJobs.length} jobs (Page {page} of {totalPages})
        </div>

        {/* Jobs Grid */}
        <div className="space-y-4">
          {isLoading ? (
            // Loading skeleton for jobs
            Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className={`${mounted && isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-5 shadow-sm animate-pulse`}>
                <div className="flex flex-col md:flex-row items-start md:items-center">
                  <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-4">
                    <div className={`w-12 h-12 ${mounted && isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full`}></div>
                  </div>
                  <div className="flex-1">
                    <div className={`h-6 ${mounted && isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded w-3/4 mb-2`}></div>
                    <div className={`h-4 ${mounted && isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/2 mb-2`}></div>
                    <div className={`h-4 ${mounted && isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/3`}></div>
                  </div>
                  <div className="flex flex-col items-end mt-4 md:mt-0 self-stretch justify-between">
                    <div className={`h-4 ${mounted && isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded w-20 mb-2`}></div>
                    <div className={`h-8 ${mounted && isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded w-24`}></div>
                  </div>
                </div>
              </div>
            ))  
          ) : paginatedJobs.length > 0 ? (
            paginatedJobs.map(job => (
              <JobCard key={job.id} job={job} isDark={mounted && isDark} />
            ))
          ) : (
            <div className={`text-center py-10  ${noJobsClass}`}>
              No jobs available at this time.
            </div>
          )}
        </div>

        {/* Pagination Controls */}
       

        {/* View More Button */}
        {sortedJobs.length > 10 && (
          <div className="mt-8 text-center">
            <button 
              onClick={handleViewAllJobs}
              className={`px-8 py-3 rounded-lg font-medium cursor-pointer ${viewMoreBtnClass} transition-colors flex items-center justify-center mx-auto`}
            >
              View All Jobs
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {/* Add animation styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
} 