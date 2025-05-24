"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect, KeyboardEvent, useMemo } from 'react';
import { useJobs, UseJobsResult } from '@/app/hooks/useJobs';
import { useRouter } from 'next/navigation';
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


interface HeroProps {
    jobsState: UseJobsResult;
}


export default function Hero({ jobsState }: HeroProps) {
    const [mounted, setMounted] = useState(false);
    const { systemTheme, theme, setTheme } = useTheme();
    const currentTheme = theme === 'system' ? systemTheme : theme;
    const isDark = currentTheme === 'dark';
    
    const { allJobs = [], searchJobs, searchTitle, searchLocation } = jobsState;
    const [searchTerm, setSearchTerm] = useState('');
    const [locationTerm, setLocationTerm] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
    const [selectedLocationSuggestionIndex, setSelectedLocationSuggestionIndex] = useState(-1);
    
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const locationSuggestionsRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const locationInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    
    // Apply debounce to search terms
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const debouncedLocationTerm = useDebounce(locationTerm, 300);
    
    // Mount component on client-side and initialize
    useEffect(() => {
        setMounted(true);
        
        if (allJobs?.length) {
            console.log(`Found ${allJobs.length} jobs for suggestions`);
        }
    }, [allJobs]);

    // Sync search terms from useJobs hook
    useEffect(() => {
        if (searchTitle !== searchTerm) {
            setSearchTerm(searchTitle);
        }
        if (searchLocation !== locationTerm) {
            setLocationTerm(searchLocation);
        }
    }, [searchTitle, searchLocation]);
    
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
                .filter(job => job.organization && typeof job.organization.company_name === "string" && job.organization.company_name.toLowerCase().includes(term))
                .map(job => job.organization.company_name);
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
                inputRef.current && !inputRef.current.contains(event.target as Node) &&
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
    
    // Handle search submission
    const handleSearch = () => {
        setIsSearching(true);
        searchJobs(searchTerm, locationTerm);
        setShowSuggestions(false);
        setShowLocationSuggestions(false);
        
        setTimeout(() => {
            const listingsSection = document.getElementById('job-listings');
            if (listingsSection) {
                listingsSection.classList.add('search-highlight');
                listingsSection.scrollIntoView({ behavior: 'smooth' });
                
                setTimeout(() => {
                    setIsSearching(false);
                    listingsSection.classList.remove('search-highlight');
                }, 1500);
            } else {
                setIsSearching(false);
            }
        }, 100);
    };
    
    // Handle job suggestion click
    const handleSuggestionClick = (suggestion: string) => {
        setSearchTerm(suggestion);
        setShowSuggestions(false);
        
        setTimeout(() => {
            handleSearch();
        }, 10);
    };
    
    // Handle location suggestion click
    const handleLocationSuggestionClick = (suggestion: string) => {
        setLocationTerm(suggestion);
        setShowLocationSuggestions(false);
        
        setTimeout(() => {
            handleSearch();
        }, 10);
    };
    
    // Redirect to jobs page
    const redirectToJobsPage = () => {
        if (searchTerm || locationTerm) {
            searchJobs(searchTerm, locationTerm);
        }
        router.push('/jobs');
    };

    // Theme-based styling
    const heroBackgroundClass = mounted && isDark 
        ? "bg-black/95" 
        : "bg-gradient-to-br from-white via-blue-50 to-white";
    
    const headingTextClass = mounted && isDark
        ? "text-gray-100" 
        : "text-gray-900";
        
    const accentTextClass = mounted && isDark
        ? "text-blue-400"
        : "text-blue-600";
        
    const paragraphTextClass = mounted && isDark
        ? "text-gray-300" 
        : "text-gray-600";
        
    const inputBgClass = mounted && isDark
        ? "bg-gray-700 border-gray-700 text-gray-100 placeholder-gray-500"
        : "bg-white text-gray-900 placeholder-gray-500";
        
    const suggestionsBgClass = mounted && isDark
        ? "bg-black/120 border-gray-700"
        : "bg-white border-gray-200";
        
    const suggestionItemClass = mounted && isDark
        ? "hover:bg-gray-700 text-gray-200"
        : "hover:bg-blue-50 text-gray-800";
    
    const selectedSuggestionClass = mounted && isDark
        ? "bg-gray-700"
        : "bg-blue-50";
        
    const searchButtonClass = mounted && isDark
        ? "bg-blue-500  hover:bg-gray-600/90 text-white"
        : "bg-blue-600 hover:bg-blue-700 text-white";
        
    const linkClass = mounted && isDark
        ? "text-blue-400 hover:text-blue-300"
        : "text-blue-600 hover:text-blue-800";

    return (
        <div className={`${heroBackgroundClass} py-8 md:py-12 w-full`}>
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {/* Simple Header */}
                <div className="text-center mb-8">
                    <h1 className={`text-2xl md:text-5xl font-bold ${headingTextClass} leading-tight mb-4`}>
                        <span className="">Blockchain</span> Careers on <span className={accentTextClass}>Solana</span>
                    </h1>
                    <p className={`text-lg md:text-xl ${paragraphTextClass} max-w-3xl mx-auto`}>
                        The first Web3 job platform built on Solana. Connecting talent with opportunities in the blockchain ecosystem.
                    </p>
                </div>

                {/* Search Bar - Prominent */}
                <div className={`relative w-full shadow-xl rounded-xl overflow-hidden max-w-5xl mx-auto mb-4 ${mounted && isDark ? 'shadow-gray-900' : ''}`}>
                    <div className="md:flex">
                        <div className="flex-1">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    ref={inputRef}
                                    id="job-search-input"
                                    type="text"
                                    className={`block w-full pl-14 pr-4 py-5 text-lg border-none focus:ring-0 focus:outline-none ${inputBgClass}`}
                                    placeholder="Job title, keywords, or company"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setShowSuggestions(true);
                                    }}
                                    onFocus={() => setShowSuggestions(true)}
                                    onKeyDown={handleSearchKeyDown}
                                    autoComplete="off"
                                />
                                
                                {/* Remove the individual job suggestions dropdown */}
                            </div>
                        </div>
                        <div className="md:w-52 md:border-l border-gray-500">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    ref={locationInputRef}
                                    id="location-input"
                                    type="text"
                                    className={`block w-full pl-14 pr-4 py-5 text-lg border-none md:border-l border-gray-200  focus:outline-none ${inputBgClass}`}
                                    placeholder="Location"
                                    value={locationTerm}
                                    onChange={(e) => {
                                        setLocationTerm(e.target.value);
                                        setShowLocationSuggestions(true);
                                    }}
                                    onFocus={() => setShowLocationSuggestions(true)}
                                    onKeyDown={handleLocationKeyDown}
                                    autoComplete="off"
                                />
                                
                                {/* Remove the individual location suggestions dropdown */}
                            </div>
                        </div>
                        <button 
                            onClick={handleSearch}
                            disabled={isSearching}
                            className={`w-full md:w-auto px-10 py-4 text-lg font-medium ${searchButtonClass} transition-colors focus:outline-none`}
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
                
                {/* Add Combined Suggestions Panel */}
                {(showSuggestions && suggestions.length > 0) || (showLocationSuggestions && locationSuggestions.length > 0) ? (
                    <div 
                        ref={suggestionsRef}
                        className={`relative z-50 w-full mt-1 mb-6 rounded-lg shadow-lg border max-w-5xl mx-auto ${suggestionsBgClass}`}
                    >
                        {showSuggestions && suggestions.length > 0 && (
                            <div>
                                <h4 className={`px-4 py-2 text-sm font-medium ${mounted && isDark ? "text-gray-300" : "text-gray-500"} border-b border-${mounted && isDark ? "gray-700" : "gray-200"}`}>
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
                            <div className={showSuggestions && suggestions.length > 0 ? `border-t border-${mounted && isDark ? "gray-700" : "gray-200"}` : ""}>
                                <h4 className={`px-4 py-2 text-sm font-medium ${mounted && isDark ? "text-gray-300" : "text-gray-500"} ${showSuggestions && suggestions.length > 0 ? "" : `border-b border-${mounted && isDark ? "gray-700" : "gray-200"}`}`}>
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
                
                <div className="text-center">
                    <button 
                        onClick={redirectToJobsPage}
                        className={`font-medium ${linkClass}`}
                    >
                        Advanced Search on Jobs Page →
                    </button>
                </div>
            </div>
            
            {/* Add search highlight animation */}
            <style jsx global>{`
                @keyframes searchHighlight {
                    0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5); }
                    70% { box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
                }
                
                .search-highlight {
                    animation: searchHighlight 1.5s ease-in-out;
                }
            `}</style>
        </div>
    );
}