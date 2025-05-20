"use client";

import { useState, useEffect, useRef } from 'react';
import { useJobs } from '@/app/hooks/useJobs';
import { JobCard } from '@/app/components/jobs/JobCard';
import { ConnectWalletBanner } from '@/app/components/jobs/ConnectWalletBanner';
import { useWallet } from '@solana/wallet-adapter-react';

export default function JobsPage() {
    const [showConnectMessage, setShowConnectMessage] = useState(false);
    const [searchTitle, setSearchTitle] = useState('');
    const [searchLocation, setSearchLocation] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [jobsPerPage] = useState(10);
    const { connected } = useWallet();
    const searchInputRef = useRef<HTMLInputElement>(null);
    
    const { 
        jobs,
        filteredJobs,
        isLoading,
        error,
        searchJobs: searchJobsHook,
        searchTitle: hookSearchTitle,
        searchLocation: hookSearchLocation,
        clearSearch,
        isSearching,
        walletAddress,
        handleConnect,
        isConnected
    } = useJobs();
    
    // Calculate pagination
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
    
    // Show preview of total pages even when not connected
    const visibleTotalPages = isConnected ? totalPages : Math.min(3, totalPages);
    
    // Get current jobs for pagination
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    
    // If connected, show jobs from current page, otherwise only show first page
    const currentJobs = isConnected
        ? filteredJobs.slice(indexOfFirstJob, indexOfLastJob)
        : filteredJobs.slice(0, jobsPerPage);
    
    // Page navigation handlers
    const goToNextPage = () => {
        if (isConnected && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            // Scroll to top of job list
            window.scrollTo({ top: 500, behavior: 'smooth' });
        }
    };
    
    const goToPreviousPage = () => {
        if (isConnected && currentPage > 1) {
            setCurrentPage(currentPage - 1);
            // Scroll to top of job list
            window.scrollTo({ top: 500, behavior: 'smooth' });
        }
    };
    
    const goToPage = (page: number) => {
        if (isConnected && page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            // Scroll to top of job list
            window.scrollTo({ top: 500, behavior: 'smooth' });
        }
    };
    
    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5; // Show up to 5 page numbers
        
        if (totalPages <= maxPagesToShow) {
            // If we have 5 or fewer pages, show all
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Always show first page
            pageNumbers.push(1);
            
            // Calculate start and end page numbers
            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);
            
            // Adjust if we're near the start
            if (currentPage <= 3) {
                endPage = 4;
            }
            
            // Adjust if we're near the end
            if (currentPage >= totalPages - 2) {
                startPage = totalPages - 3;
            }
            
            // Add ellipsis before middle pages if needed
            if (startPage > 2) {
                pageNumbers.push('...');
            }
            
            // Add middle pages
            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }
            
            // Add ellipsis after middle pages if needed
            if (endPage < totalPages - 1) {
                pageNumbers.push('...');
            }
            
            // Always show last page
            pageNumbers.push(totalPages);
        }
        
        return pageNumbers;
    };
    
    // Generate preview page numbers for non-connected users
    const getPreviewPageNumbers = () => {
        const pageNumbers = [];
        
        // Always show first page
        pageNumbers.push(1);
        
        // Show a preview of first few pages
        if (totalPages > 1) {
            pageNumbers.push(2);
        }
        
        // If there are more pages, show ellipsis and last page
        if (totalPages > 2) {
            pageNumbers.push('...');
            if (totalPages > 3) {
                pageNumbers.push(totalPages);
            }
        }
        
        return pageNumbers;
    };
    
    // Show connect message only after page has loaded and user is not connected
    useEffect(() => {
        if (!connected) {
            setShowConnectMessage(true);
            setCurrentPage(1); // Reset to first page when disconnected
        } else {
            setShowConnectMessage(false);
        }
    }, [connected]);
    
    // Reset pagination when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [hookSearchTitle, hookSearchLocation]);
    
    // Handle search
    const handleSearch = () => {
        searchJobsHook(searchTitle, searchLocation);
    };
    
    // Handle clearing all filters
    const handleClearFilters = () => {
        setSearchTitle('');
        setSearchLocation('');
        clearSearch();
        setCurrentPage(1);
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    };
    
    // On component mount, check if there are search parameters already set in useJobs
    useEffect(() => {
        if (hookSearchTitle) {
            setSearchTitle(hookSearchTitle);
        }
        if (hookSearchLocation) {
            setSearchLocation(hookSearchLocation);
        }
    }, []);

    return (
        <main className="bg-white min-h-screen">
            {/* Page Header */}
            <div className="bg-blue-50 py-12">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        All Job Listings
                    </h1>
                    <p className="text-lg text-gray-700 max-w-3xl mb-8">
                        Browse through all available blockchain job listings. Connect your Solana wallet to unlock all job opportunities.
                    </p>
                    
                    {/* Search Bar */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
                        <div className="md:flex">
                            <div className="flex-1">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        className="block w-full pl-12 pr-4 py-4 border-none focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-500"
                                        placeholder="Job title, keywords, or company"
                                        value={searchTitle}
                                        onChange={(e) => setSearchTitle(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                </div>
                            </div>
                            <div className="md:w-64 md:border-l border-gray-200">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-12 pr-4 py-4 border-none focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-500"
                                        placeholder="Location"
                                        value={searchLocation}
                                        onChange={(e) => setSearchLocation(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                </div>
                            </div>
                            <button 
                                onClick={handleSearch}
                                className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors focus:outline-none cursor-pointer"
                                disabled={isSearching}
                            >
                                {isSearching ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Searching...
                                    </span>
                                ) : (
                                    'Search Jobs'
                                )}
                            </button>
                        </div>
                    </div>
                    
                    {/* Active Filters */}
                    {(hookSearchTitle || hookSearchLocation) && (
                        <div className="mt-4 flex items-center">
                            <span className="text-sm font-medium text-gray-700 mr-2">
                                Active filters:
                            </span>
                            {hookSearchTitle && (
                                <div className="bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700 flex items-center mr-2">
                                    <span>Title: {hookSearchTitle}</span>
                                    <button 
                                        onClick={handleClearFilters}
                                        className="ml-2 text-gray-500 hover:text-gray-700"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                            {hookSearchLocation && (
                                <div className="bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700 flex items-center mr-2">
                                    <span>Location: {hookSearchLocation}</span>
                                    <button 
                                        onClick={handleClearFilters}
                                        className="ml-2 text-gray-500 hover:text-gray-700"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
                {/* Stats */}
                <div className="flex flex-wrap justify-between items-center mb-8">
                    <div className="text-gray-700 font-medium">
                        {isConnected ? (
                            <>
                                Showing {indexOfFirstJob + 1}-{Math.min(indexOfLastJob, filteredJobs.length)} of {filteredJobs.length} jobs
                                {(hookSearchTitle || hookSearchLocation) && <span className="ml-1">(filtered)</span>}
                            </>
                        ) : (
                            <>
                                Showing {Math.min(jobsPerPage, filteredJobs.length)} of {filteredJobs.length} jobs
                                {!isConnected && filteredJobs.length > jobsPerPage && (
                                    <span className="ml-1 text-gray-500 font-normal">
                                        (connect wallet to view all {filteredJobs.length} jobs)
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {isConnected && (
                            <div className="bg-green-50 text-green-800 px-4 py-2 rounded-full text-sm font-medium flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                Wallet Connected
                                {walletAddress && (
                                    <span className="ml-2 text-xs bg-green-100 px-2 py-1 rounded-md">
                                        {`${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`}
                                    </span>
                                )}
                            </div>
                        )}
                        
                        {!isConnected && (
                            <button
                                onClick={handleConnect}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                                Connect Wallet
                            </button>
                        )}
                    </div>
                </div>
                
                {/* Pagination controls - top */}
                {filteredJobs.length > jobsPerPage && (
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={goToPreviousPage}
                                disabled={currentPage === 1 || !isConnected}
                                className={`p-2 rounded-md ${
                                    currentPage === 1 || !isConnected
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'text-blue-600 hover:bg-blue-50'
                                }`}
                                aria-label="Previous page"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            
                            {/* For connected users - show full pagination */}
                            {isConnected && (
                                <div className="hidden md:flex items-center gap-1">
                                    {getPageNumbers().map((page, index) => (
                                        typeof page === 'number' ? (
                                            <button
                                                key={index}
                                                onClick={() => goToPage(page)}
                                                className={`w-8 h-8 flex items-center justify-center rounded-md ${
                                                    currentPage === page
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-gray-700 hover:bg-blue-50'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ) : (
                                            <span key={index} className="px-1">
                                                {page}
                                            </span>
                                        )
                                    ))}
                                </div>
                            )}
                            
                            {/* For non-connected users - show preview pagination with locks */}
                            {!isConnected && filteredJobs.length > jobsPerPage && (
                                <div className="hidden md:flex items-center gap-1">
                                    {getPreviewPageNumbers().map((page, index) => (
                                        typeof page === 'number' ? (
                                            <div key={index} className="relative">
                                                <button
                                                    className={`w-8 h-8 flex items-center justify-center rounded-md ${
                                                        page === 1
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    }`}
                                                    disabled={page !== 1}
                                                >
                                                    {page}
                                                </button>
                                                {page !== 1 && (
                                                    <div className="absolute -top-1 -right-1 bg-gray-200 rounded-full p-0.5">
                                                        <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <span key={index} className="px-1">
                                                {page}
                                            </span>
                                        )
                                    ))}
                                </div>
                            )}
                            
                            <span className="text-gray-700 font-medium px-2 py-1 md:hidden">
                                {isConnected ? `Page ${currentPage} of ${totalPages}` : 'Page 1 of 1'}
                            </span>
                            
                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages || !isConnected}
                                className={`p-2 rounded-md ${
                                    currentPage === totalPages || !isConnected
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'text-blue-600 hover:bg-blue-50'
                                }`}
                                aria-label="Next page"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                        
                        {!isConnected && filteredJobs.length > jobsPerPage && (
                            <button
                                onClick={handleConnect}
                                className="text-sm text-blue-600 font-medium hover:text-blue-800 flex items-center"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Unlock all pages
                            </button>
                        )}
                    </div>
                )}
                
                {/* Connect wallet banner - only show when not connected */}
                {showConnectMessage && !isConnected && !(hookSearchTitle || hookSearchLocation) && (
                    <div className="mb-8">
                        <ConnectWalletBanner 
                            totalJobs={filteredJobs.length}
                            onConnect={handleConnect}
                        />
                    </div>
                )}
                
                {/* Jobs grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 gap-6">
                        {/* Loading skeleton */}
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm animate-pulse">
                                <div className="flex flex-col md:flex-row items-start md:items-center">
                                    <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-4">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                    </div>
                                    <div className="flex flex-col items-end mt-4 md:mt-0 self-stretch justify-between">
                                        <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                                        <div className="h-8 bg-gray-200 rounded w-24"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : currentJobs.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {currentJobs.map(job => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-gray-50 rounded-lg">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No jobs found</h3>
                        <p className="mt-1 text-sm text-gray-500">We couldn't find any jobs matching your criteria.</p>
                        {(hookSearchTitle || hookSearchLocation) && (
                            <div className="mt-6">
                                <button
                                    onClick={handleClearFilters}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                >
                                    Clear search filters
                                </button>
                            </div>
                        )}
                    </div>
                )}
                
                {/* Pagination controls - bottom */}
                {filteredJobs.length > jobsPerPage && (
                    <div className="flex justify-between items-center mt-8">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={goToPreviousPage}
                                disabled={currentPage === 1 || !isConnected}
                                className={`p-2 rounded-md ${
                                    currentPage === 1 || !isConnected
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'text-blue-600 hover:bg-blue-50'
                                }`}
                                aria-label="Previous page"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            
                            {/* For connected users - show full pagination */}
                            {isConnected && (
                                <div className="hidden md:flex items-center gap-1">
                                    {getPageNumbers().map((page, index) => (
                                        typeof page === 'number' ? (
                                            <button
                                                key={index}
                                                onClick={() => goToPage(page)}
                                                className={`w-8 h-8 flex items-center justify-center rounded-md ${
                                                    currentPage === page
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-gray-700 hover:bg-blue-50'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ) : (
                                            <span key={index} className="px-1">
                                                {page}
                                            </span>
                                        )
                                    ))}
                                </div>
                            )}
                            
                            {/* For non-connected users - show preview pagination with locks */}
                            {!isConnected && filteredJobs.length > jobsPerPage && (
                                <div className="hidden md:flex items-center gap-1">
                                    {getPreviewPageNumbers().map((page, index) => (
                                        typeof page === 'number' ? (
                                            <div key={index} className="relative">
                                                <button
                                                    className={`w-8 h-8 flex items-center justify-center rounded-md ${
                                                        page === 1
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    }`}
                                                    disabled={page !== 1}
                                                >
                                                    {page}
                                                </button>
                                                {page !== 1 && (
                                                    <div className="absolute -top-1 -right-1 bg-gray-200 rounded-full p-0.5">
                                                        <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <span key={index} className="px-1">
                                                {page}
                                            </span>
                                        )
                                    ))}
                                </div>
                            )}
                            
                            <span className="text-gray-700 font-medium px-2 py-1 md:hidden">
                                {isConnected ? `Page ${currentPage} of ${totalPages}` : 'Page 1 of 1'}
                            </span>
                            
                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages || !isConnected}
                                className={`p-2 rounded-md ${
                                    currentPage === totalPages || !isConnected
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'text-blue-600 hover:bg-blue-50'
                                }`}
                                aria-label="Next page"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                        
                        {!isConnected && filteredJobs.length > jobsPerPage && (
                            <div>
                                <button
                                    onClick={handleConnect}
                                    className="inline-flex items-center px-4 py-2 border border-blue-300 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 focus:outline-none text-sm font-medium"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Unlock all pages
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}