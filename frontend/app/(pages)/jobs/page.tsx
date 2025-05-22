"use client";

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { useJobs } from '@/app/hooks/useJobs';
import { JobCard } from '@/app/components/jobs/JobCard';
import { ConnectWalletBanner } from '@/app/components/jobs/ConnectWalletBanner';
import { useWallet } from '@solana/wallet-adapter-react';
import { useTheme } from "next-themes";

// Simple debounce function
const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
  
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
  
    return debouncedValue;
};

export default function JobsPage() {
    const [showConnectMessage, setShowConnectMessage] = useState(false);
    const [searchTitle, setSearchTitle] = useState('');
    const [searchLocation, setSearchLocation] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
    const [selectedLocationSuggestionIndex, setSelectedLocationSuggestionIndex] = useState(-1);
    const [currentPage, setCurrentPage] = useState(1);
    const [jobsPerPage] = useState(10);
    const { connected } = useWallet();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const locationInputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const locationSuggestionsRef = useRef<HTMLDivElement>(null);
    
    // Apply debounce to search terms
    const debouncedSearchTerm = useDebounce(searchTitle, 300);
    const debouncedLocationTerm = useDebounce(searchLocation, 300);
    
    // Theme handling
    const { systemTheme, theme } = useTheme();
    const currentTheme = theme === 'system' ? systemTheme : theme;
    const isDark = currentTheme === 'dark';
    
    const { 
        jobs,
        filteredJobs,
        allJobs,
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
    
    // Conditional styling based on theme
    const mainBgClass = isDark ? "bg-gray-900" : "bg-white";
    const headerBgClass = isDark ? "bg-gray-900" : "bg-blue-50";
    const headingTextClass = isDark ? "text-gray-100" : "text-gray-900";
    const paragraphTextClass = isDark ? "text-gray-300" : "text-gray-700";
    const statsTextClass = isDark ? "text-gray-300" : "text-gray-700";
    const statsDimTextClass = isDark ? "text-gray-500" : "text-gray-500";
    const searchBgClass = isDark ? "bg-gray-800" : "bg-white";
    const searchInputClass = isDark ? "text-gray-100 placeholder-gray-500" : "text-gray-900 placeholder-gray-500";
    const searchIconClass = isDark ? "text-gray-500" : "text-gray-400";
    const buttonClass = isDark ? "bg-blue-700 hover:bg-blue-800" : "bg-blue-600 hover:bg-blue-700";
    const filterTagClass = isDark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700";
    const filterIconClass = isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700";
    const paginationActiveClass = isDark ? "bg-blue-700 text-white" : "bg-blue-600 text-white";
    const paginationInactiveClass = isDark ? "text-gray-400 hover:bg-gray-800" : "text-gray-700 hover:bg-blue-50";
    const paginationDisabledClass = isDark ? "text-gray-700 cursor-not-allowed" : "text-gray-300 cursor-not-allowed";
    const paginationPreviewClass = isDark ? "bg-gray-800 text-gray-500" : "bg-gray-100 text-gray-400";
    const suggestionsBgClass = isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
    const suggestionItemClass = isDark ? "hover:bg-gray-700 text-gray-200" : "hover:bg-blue-50 text-gray-800";
    const selectedSuggestionClass = isDark ? "bg-gray-700" : "bg-blue-50";
    
    // Generate job suggestions based on debounced search term
    useEffect(() => {
        if (!debouncedSearchTerm || !allJobs?.length) {
            setSuggestions([]);
            return;
        }
        
        const term = debouncedSearchTerm.toLowerCase().trim();
        
        try {
            // Get suggestions from jobs that match the search term
            const jobSuggestions = [];
            
            // Add matching job titles
            const matchingTitles = allJobs
                .filter(job => job.title.toLowerCase().includes(term))
                .map(job => job.title);
            jobSuggestions.push(...matchingTitles);
            
            // Add matching company names
            const matchingCompanies = allJobs
                .filter(job => job.organization.name.toLowerCase().includes(term))
                .map(job => job.organization.name);
            jobSuggestions.push(...matchingCompanies);
            
            // Remove duplicates and sort
            const uniqueSuggestions = Array.from(new Set(jobSuggestions));
            const sortedSuggestions = uniqueSuggestions.sort((a, b) => {
                // Prioritize results that start with the search term
                const aStartsWith = a.toLowerCase().startsWith(term) ? -1 : 0;
                const bStartsWith = b.toLowerCase().startsWith(term) ? -1 : 0;
                return aStartsWith - bStartsWith;
            });
            
            // Reset selected index when suggestions change
            setSelectedSuggestionIndex(-1);
            setSuggestions(sortedSuggestions.slice(0, 8));
        } catch (error) {
            console.error("Error generating job suggestions:", error);
            setSuggestions([]);
        }
    }, [debouncedSearchTerm, allJobs]);
    
    // Generate location suggestions based on debounced location term
    useEffect(() => {
        if (!debouncedLocationTerm || !allJobs?.length) {
            setLocationSuggestions([]);
            return;
        }
        
        const term = debouncedLocationTerm.toLowerCase().trim();
        
        try {
            // Extract all locations from jobs
            const allLocations = allJobs
                .flatMap(job => job.locations || [])
                .filter(Boolean);
            
            // Filter locations that match the search term
            const matchingLocations = Array.from(new Set(
                allLocations.filter(loc => 
                    loc.toLowerCase().includes(term)
                )
            ));
            
            // Sort by relevance
            const sortedLocations = matchingLocations.sort((a, b) => {
                const aStartsWith = a.toLowerCase().startsWith(term) ? -1 : 0;
                const bStartsWith = b.toLowerCase().startsWith(term) ? -1 : 0;
                return aStartsWith - bStartsWith;
            });
            
            let finalSuggestions = sortedLocations.slice(0, 10);

            // If no job locations found, add some sample locations
            if (sortedLocations.length === 0) {
                const sampleLocations = [
                    "New York, NY",
                    "San Francisco, CA",
                    "Remote",
                    "London, UK",
                    "Berlin, Germany",
                    "Bangalore, India",
                    "Singapore",
                    "Tokyo, Japan"
                ].filter(loc => loc.toLowerCase().includes(term));
                
                finalSuggestions = sampleLocations.slice(0, 10);
            }
            
            // Reset selected index when suggestions change
            setSelectedLocationSuggestionIndex(-1);
            setLocationSuggestions(finalSuggestions);
        } catch (error) {
            console.error("Error generating location suggestions:", error);
            setLocationSuggestions([]);
        }
    }, [debouncedLocationTerm, allJobs]);
    
    // Handle clicks outside suggestion dropdowns
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
                searchInputRef.current && !searchInputRef.current.contains(event.target as Node) &&
                locationInputRef.current && !locationInputRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
                setShowLocationSuggestions(false);
            }
        }
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    // Handle keyboard navigation for job search suggestions
    const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        // Handle Enter key
        if (e.key === 'Enter') {
            if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < suggestions.length) {
                // If a suggestion is selected, use that
                handleSuggestionClick(suggestions[selectedSuggestionIndex]);
            } else {
                // Otherwise just search with current input
                handleSearch();
            }
            return;
        }
        
        // Handle arrow keys for navigation
        if (showSuggestions && suggestions.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedSuggestionIndex(prev => 
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
            } else if (e.key === 'Escape') {
                setShowSuggestions(false);
            }
        }
    };
    
    // Handle keyboard navigation for location suggestions
    const handleLocationKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        // Handle Enter key
        if (e.key === 'Enter') {
            if (selectedLocationSuggestionIndex >= 0 && selectedLocationSuggestionIndex < locationSuggestions.length) {
                // If a suggestion is selected, use that
                handleLocationSuggestionClick(locationSuggestions[selectedLocationSuggestionIndex]);
            } else {
                // Otherwise just search with current input
                handleSearch();
            }
            return;
        }
        
        // Handle arrow keys for navigation
        if (showLocationSuggestions && locationSuggestions.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedLocationSuggestionIndex(prev => 
                    prev < locationSuggestions.length - 1 ? prev + 1 : prev
                );
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedLocationSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
            } else if (e.key === 'Escape') {
                setShowLocationSuggestions(false);
            }
        }
    };

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
        setShowSuggestions(false);
        setShowLocationSuggestions(false);
    };

    // Handle suggestion click
    const handleSuggestionClick = (suggestion: string) => {
        setSearchTitle(suggestion);
        setShowSuggestions(false);
        setTimeout(() => {
            handleSearch();
        }, 10);
    };
    
    // Handle location suggestion click
    const handleLocationSuggestionClick = (suggestion: string) => {
        setSearchLocation(suggestion);
        setShowLocationSuggestions(false);
        setTimeout(() => {
            handleSearch();
        }, 10);
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
        <main className={mainBgClass + " min-h-screen"}>
            {/* Page Header */}
            <div className={headerBgClass + " py-12"}>
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <h1 className={`text-3xl md:text-4xl font-bold ${headingTextClass} mb-4`}>
                        All Job Listings
                    </h1>
                    <p className={`text-lg ${paragraphTextClass} max-w-3xl mb-8`}>
                        Browse through all available blockchain job listings. Connect your Solana wallet to unlock all job opportunities.
                    </p>
                    
                    {/* Search Bar */}
                    <div className={`${searchBgClass} rounded-lg shadow-md overflow-hidden mb-4`}>
                        <div className="md:flex">
                            <div className="flex-1">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className={`h-5 w-5 ${searchIconClass}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        className={`block w-full pl-12 pr-4 py-4 border-none focus:ring-0 focus:outline-none ${searchInputClass}`}
                                        placeholder="Job title, keywords, or company"
                                        value={searchTitle}
                                        onChange={(e) => {
                                            setSearchTitle(e.target.value);
                                            setShowSuggestions(true);
                                        }}
                                        onFocus={() => setShowSuggestions(true)}
                                        onKeyDown={handleSearchKeyDown}
                                        autoComplete="off"
                                    />
                                </div>
                            </div>
                            <div className="md:w-64 md:border-l border-gray-200">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className={`h-5 w-5 ${searchIconClass}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        ref={locationInputRef}
                                        type="text"
                                        className={`block w-full pl-12 pr-4 py-4 border-none focus:ring-0 focus:outline-none ${searchInputClass}`}
                                        placeholder="Location"
                                        value={searchLocation}
                                        onChange={(e) => {
                                            setSearchLocation(e.target.value);
                                            setShowLocationSuggestions(true);
                                        }}
                                        onFocus={() => setShowLocationSuggestions(true)}
                                        onKeyDown={handleLocationKeyDown}
                                        autoComplete="off"
                                    />
                                </div>
                            </div>
                            <button 
                                onClick={handleSearch}
                                className={`w-full md:w-auto px-8 py-4 ${buttonClass} text-white font-medium transition-colors focus:outline-none cursor-pointer`}
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
                    
                    {/* Suggestions Panel above the jobs list */}
                    {(showSuggestions && suggestions.length > 0) || (showLocationSuggestions && locationSuggestions.length > 0) ? (
                        <div 
                            ref={suggestionsRef}
                            className={`relative z-50 w-full mt-1 mb-4 rounded-lg shadow-lg border ${suggestionsBgClass}`}
                        >
                            {showSuggestions && suggestions.length > 0 && (
                                <div>
                                    <h4 className={`px-4 py-2 text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-500"} border-b border-${isDark ? "gray-700" : "gray-200"}`}>
                                        Job Suggestions
                                    </h4>
                                    <ul className="py-2">
                                        {suggestions.map((suggestion, index) => (
                                            <li 
                                                key={index}
                                                className={`px-5 py-3 cursor-pointer flex items-center ${index === selectedSuggestionIndex ? selectedSuggestionClass : ''} ${suggestionItemClass}`}
                                                onClick={() => handleSuggestionClick(suggestion)}
                                                onMouseEnter={() => setSelectedSuggestionIndex(index)}
                                            >
                                                <svg className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                                </svg>
                                                <span className="font-medium">{suggestion}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            
                            {showLocationSuggestions && locationSuggestions.length > 0 && (
                                <div className={showSuggestions && suggestions.length > 0 ? `border-t border-${isDark ? "gray-700" : "gray-200"}` : ""}>
                                    <h4 className={`px-4 py-2 text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-500"} ${showSuggestions && suggestions.length > 0 ? "" : `border-b border-${isDark ? "gray-700" : "gray-200"}`}`}>
                                        Location Suggestions
                                    </h4>
                                    <ul className="py-2">
                                        {locationSuggestions.map((suggestion, index) => (
                                            <li 
                                                key={index}
                                                className={`px-5 py-3 cursor-pointer flex items-center ${index === selectedLocationSuggestionIndex ? selectedSuggestionClass : ''} ${suggestionItemClass}`}
                                                onClick={() => handleLocationSuggestionClick(suggestion)}
                                                onMouseEnter={() => setSelectedLocationSuggestionIndex(index)}
                                            >
                                                <svg className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                </svg>
                                                <span className="font-medium">{suggestion}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : null}
                    
                    {/* Active Filters */}
                    {(hookSearchTitle || hookSearchLocation) && (
                        <div className="mt-4 flex items-center">
                            <span className={`text-sm font-medium ${paragraphTextClass} mr-2`}>
                                Active filters:
                            </span>
                            {hookSearchTitle && (
                                <div className={`${filterTagClass} rounded-full px-3 py-1 text-sm flex items-center mr-2`}>
                                    <span>Title: {hookSearchTitle}</span>
                                    <button 
                                        onClick={handleClearFilters}
                                        className={`ml-2 ${filterIconClass}`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                            {hookSearchLocation && (
                                <div className={`${filterTagClass} rounded-full px-3 py-1 text-sm flex items-center mr-2`}>
                                    <span>Location: {hookSearchLocation}</span>
                                    <button 
                                        onClick={handleClearFilters}
                                        className={`ml-2 ${filterIconClass}`}
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
                    <div className={`font-medium ${statsTextClass}`}>
                        {isConnected ? (
                            <>
                                Showing {indexOfFirstJob + 1}-{Math.min(indexOfLastJob, filteredJobs.length)} of {filteredJobs.length} jobs
                                {(hookSearchTitle || hookSearchLocation) && <span className="ml-1">(filtered)</span>}
                            </>
                        ) : (
                            <>
                                Showing {Math.min(jobsPerPage, filteredJobs.length)} of {filteredJobs.length} jobs
                                {!isConnected && filteredJobs.length > jobsPerPage && (
                                    <span className={`ml-1 font-normal ${statsDimTextClass}`}>
                                        (connect wallet to view all {filteredJobs.length} jobs)
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {isConnected && (
                            <div className={`${isDark ? "bg-green-900 text-green-300" : "bg-green-50 text-green-800"} px-4 py-2 rounded-full text-sm font-medium flex items-center`}>
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                Wallet Connected
                                {walletAddress && (
                                    <span className={`ml-2 text-xs ${isDark ? "bg-green-800" : "bg-green-100"} px-2 py-1 rounded-md`}>
                                        {`${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`}
                                    </span>
                                )}
                            </div>
                        )}
                        
                        {!isConnected && (
                            <button
                                onClick={handleConnect}
                                className={`${buttonClass} text-white px-4 py-2 rounded-md text-sm font-medium transition-colors`}
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
                                        ? paginationDisabledClass
                                        : isDark ? "text-blue-400 hover:bg-gray-800" : "text-blue-600 hover:bg-blue-50"
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
                                                        ? paginationActiveClass
                                                        : paginationInactiveClass
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
                                                            ? paginationActiveClass
                                                            : paginationPreviewClass + " cursor-not-allowed"
                                                    }`}
                                                    disabled={page !== 1}
                                                >
                                                    {page}
                                                </button>
                                                {page !== 1 && (
                                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center">
                                                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <span key={index} className={`px-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                                                {page}
                                            </span>
                                        )
                                    ))}
                                </div>
                            )}
                            
                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages || !isConnected}
                                className={`p-2 rounded-md ${
                                    currentPage === totalPages || !isConnected
                                        ? paginationDisabledClass
                                        : isDark ? "text-blue-400 hover:bg-gray-800" : "text-blue-600 hover:bg-blue-50"
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
                                className={`text-sm ${isDark ? "text-blue-400" : "text-blue-600"} font-medium flex items-center`}
                            >
                                Connect wallet to access all pages
                                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}
                
                {/* Show wallet connect message for non-connected users */}
                {showConnectMessage && !isConnected && (
                    <ConnectWalletBanner 
                        totalJobs={filteredJobs.length} 
                        onConnect={handleConnect}
                        isDark={isDark}
                    />
                )}

                {/* Jobs Grid */}
                {isLoading ? (
                    // Loading skeleton
                    <div className="space-y-6 mt-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-5 shadow-sm animate-pulse`}>
                                <div className="flex flex-col md:flex-row items-start md:items-center">
                                    <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-4">
                                        <div className={`w-12 h-12 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full`}></div>
                                    </div>
                                    <div className="flex-1">
                                        <div className={`h-6 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded w-3/4 mb-2`}></div>
                                        <div className={`h-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/2 mb-2`}></div>
                                        <div className={`h-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/3`}></div>
                                    </div>
                                    <div className="flex flex-col items-end mt-4 md:mt-0 self-stretch justify-between">
                                        <div className={`h-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded w-20 mb-2`}></div>
                                        <div className={`h-8 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded w-24`}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : currentJobs.length > 0 ? (
                    <div className="space-y-6 mt-6">
                        {currentJobs.map(job => (
                            <JobCard key={job.id} job={job} isDark={isDark} />
                        ))}
                    </div>
                ) : (
                    <div className={`text-center py-16 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        <svg className={`mx-auto h-12 w-12 ${isDark ? "text-gray-600" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className={`mt-4 text-lg font-medium ${isDark ? "text-gray-300" : "text-gray-900"}`}>No jobs found</h3>
                        <p className="mt-2 text-sm">
                            {hookSearchTitle || hookSearchLocation 
                                ? 'Try adjusting your search filters or clear them to see all available jobs.' 
                                : 'There are currently no job listings available.'}
                        </p>
                        {(hookSearchTitle || hookSearchLocation) && (
                            <button
                                onClick={handleClearFilters}
                                className={`mt-4 px-4 py-2 ${buttonClass} text-white rounded-md font-medium`}
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}
                
                {/* Pagination controls - bottom (for connected users only) */}
                {isConnected && filteredJobs.length > jobsPerPage && (
                    <div className="flex justify-between items-center mt-8">
                        <div className={`font-medium ${statsTextClass}`}>
                            Page {currentPage} of {totalPages}
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <button
                                onClick={goToPreviousPage}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-md ${
                                    currentPage === 1 
                                        ? paginationDisabledClass 
                                        : isDark ? "text-blue-400 hover:bg-gray-800" : "text-blue-600 hover:bg-blue-50"
                                }`}
                                aria-label="Previous page"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            
                            <div className="hidden md:flex items-center gap-1">
                                {getPageNumbers().map((page, index) => (
                                    typeof page === 'number' ? (
                                        <button
                                            key={index}
                                            onClick={() => goToPage(page)}
                                            className={`w-8 h-8 flex items-center justify-center rounded-md ${
                                                currentPage === page 
                                                    ? paginationActiveClass 
                                                    : paginationInactiveClass
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
                            
                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-md ${
                                    currentPage === totalPages 
                                        ? paginationDisabledClass 
                                        : isDark ? "text-blue-400 hover:bg-gray-800" : "text-blue-600 hover:bg-blue-50"
                                }`}
                                aria-label="Next page"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}