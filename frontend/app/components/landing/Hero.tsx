"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useJobs, UseJobsResult } from '@/app/hooks/useJobs';
import { useRouter } from 'next/navigation';
import { useTheme } from "next-themes";

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
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const locationSuggestionsRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const locationInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    
    // Mount component on client-side to prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Sync the search terms from the useJobs hook when they change
    useEffect(() => {
        if (searchTitle !== searchTerm) {
            setSearchTerm(searchTitle);
        }
        if (searchLocation !== locationTerm) {
            setLocationTerm(searchLocation);
        }
    }, [searchTitle, searchLocation]);
    
    // Generate suggestions based on search term
    useEffect(() => {
        if (!searchTerm || searchTerm.length < 2 || !allJobs?.length) {
            setSuggestions([]);
            return;
        }
        
        const term = searchTerm.toLowerCase().trim();
        
        try {
            // Extract titles and companies that match
            const matchingTitles = allJobs
                .filter(job => job.title.toLowerCase().includes(term))
                .map(job => job.title);
                
            const matchingCompanies = allJobs
                .filter(job => job.organization.name.toLowerCase().includes(term))
                .map(job => job.organization.name);
            
            // Combine and remove duplicates
            const allSuggestions = Array.from(new Set([
                ...matchingTitles,
                ...matchingCompanies
            ]));
            
            // Sort by relevance (starts with term first)
            const sortedSuggestions = allSuggestions.sort((a, b) => {
                const aStartsWith = a.toLowerCase().startsWith(term) ? -1 : 0;
                const bStartsWith = b.toLowerCase().startsWith(term) ? -1 : 0;
                return aStartsWith - bStartsWith;
            });
            
            // Limit to 8 suggestions
            setSuggestions(sortedSuggestions.slice(0, 8));
        } catch (error) {
            console.error("Error generating suggestions:", error);
            setSuggestions([]);
        }
    }, [searchTerm, allJobs]);

    // Generate location suggestions based on location term
    useEffect(() => {
        if (!locationTerm || locationTerm.length < 2 || !allJobs?.length) {
            setLocationSuggestions([]);
            return;
        }
        
        const term = locationTerm.toLowerCase().trim();
        
        try {
            // Extract locations that match
            const allLocations = allJobs
                .flatMap(job => job.locations || [])
                .filter(Boolean);
                
            // Filter and remove duplicates
            const matchingLocations = Array.from(new Set(
                allLocations.filter(loc => 
                    loc.toLowerCase().includes(term)
                )
            ));
            
            // Sort by relevance (starts with term first)
            const sortedLocations = matchingLocations.sort((a, b) => {
                const aStartsWith = a.toLowerCase().startsWith(term) ? -1 : 0;
                const bStartsWith = b.toLowerCase().startsWith(term) ? -1 : 0;
                return aStartsWith - bStartsWith;
            });
            
            // Limit to 8 suggestions
            setLocationSuggestions(sortedLocations.slice(0, 8));
        } catch (error) {
            console.error("Error generating location suggestions:", error);
            setLocationSuggestions([]);
        }
    }, [locationTerm, allJobs]);
    
    // Handle clicks outside suggestions
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            // Job suggestions
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
                inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
            
            // Location suggestions
            if (locationSuggestionsRef.current && !locationSuggestionsRef.current.contains(event.target as Node) &&
                locationInputRef.current && !locationInputRef.current.contains(event.target as Node)) {
                setShowLocationSuggestions(false);
            }
        }
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    const handleSearch = () => {
        // Show searching indicator
        setIsSearching(true);
        
        // Perform search with separate title and location
        searchJobs(searchTerm, locationTerm);
        
        // Hide suggestions
        setShowSuggestions(false);
        setShowLocationSuggestions(false);
        
        // Scroll to job listings section with a smooth effect
        setTimeout(() => {
            const listingsSection = document.getElementById('job-listings');
            if (listingsSection) {
                // Add highlighted class to job listings section temporarily
                listingsSection.classList.add('search-highlight');
                
                // Scroll to the job listings
                listingsSection.scrollIntoView({ behavior: 'smooth' });
                
                // Remove the highlight after animation
                setTimeout(() => {
                    setIsSearching(false);
                    listingsSection.classList.remove('search-highlight');
                }, 1500);
            } else {
                setIsSearching(false);
            }
        }, 100);
    };
    
    const handleSuggestionClick = (suggestion: string) => {
        // Set the search term and immediately perform search
        setSearchTerm(suggestion);
        setShowSuggestions(false);
        
        // Small delay to ensure state updates before search
        setTimeout(() => {
            handleSearch();
        }, 10);
    };
    
    const handleLocationSuggestionClick = (suggestion: string) => {
        // Set the location term and immediately perform search
        setLocationTerm(suggestion);
        setShowLocationSuggestions(false);
        
        // Small delay to ensure state updates before search
        setTimeout(() => {
            handleSearch();
        }, 10);
    };
    
    // Redirect to jobs page with search params
    const redirectToJobsPage = () => {
        if (searchTerm || locationTerm) {
            // First perform the search to update the state
            searchJobs(searchTerm, locationTerm);
            
            // Then navigate to the jobs page
            router.push('/jobs');
        } else {
            router.push('/jobs');
        }
    };

    // Conditional styling based on theme
    const heroBackgroundClass = mounted && isDark 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
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
        ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
        : "bg-white text-gray-900 placeholder-gray-500";
        
    const suggestionsBgClass = mounted && isDark
        ? "bg-gray-800 border-gray-700"
        : "bg-white border-gray-200";
        
    const suggestionItemClass = mounted && isDark
        ? "hover:bg-gray-700 text-gray-200"
        : "hover:bg-blue-50 text-gray-800";
        
    const searchButtonClass = mounted && isDark
        ? "bg-blue-500 hover:bg-blue-600 text-white"
        : "bg-blue-600 hover:bg-blue-700 text-white";
        
    const linkClass = mounted && isDark
        ? "text-blue-400 hover:text-blue-300"
        : "text-blue-600 hover:text-blue-800";

    return (
        <div className={`${heroBackgroundClass} py-8 md:py-12 w-full`}>
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {/* Simple Header */}
                <div className="text-center mb-8">
                    <h1 className={`text-3xl md:text-5xl font-bold ${headingTextClass} leading-tight mb-4`}>
                        <span className={accentTextClass}>Blockchain</span> Careers on <span className={accentTextClass}>Solana</span>
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
                                    type="text"
                                    className={`block w-full pl-14 pr-4 py-5 text-lg border-none focus:ring-0 focus:outline-none ${inputBgClass}`}
                                    placeholder="Job title, keywords, or company"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setShowSuggestions(e.target.value.length >= 2);
                                    }}
                                    onFocus={() => setShowSuggestions(searchTerm.length >= 2)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                
                                {/* Suggestions dropdown */}
                                {showSuggestions && suggestions.length > 0 && (
                                    <div 
                                        ref={suggestionsRef}
                                        className={`absolute z-50 w-full left-0 top-full mt-1 rounded-md shadow-lg border max-h-80 overflow-y-auto ${suggestionsBgClass}`}
                                    >
                                        <ul className="py-1">
                                            {suggestions.map((suggestion, index) => (
                                                <li 
                                                    key={index}
                                                    className={`px-4 py-2 cursor-pointer flex items-center ${suggestionItemClass}`}
                                                    onClick={() => handleSuggestionClick(suggestion)}
                                                >
                                                    <svg className="h-4 w-4 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>{suggestion}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="md:w-52 md:border-l border-gray-200">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    ref={locationInputRef}
                                    type="text"
                                    className={`block w-full pl-14 pr-4 py-5 text-lg border-none md:border-l border-gray-200 focus:ring-0 focus:outline-none ${inputBgClass}`}
                                    placeholder="Location"
                                    value={locationTerm}
                                    onChange={(e) => {
                                        setLocationTerm(e.target.value);
                                        setShowLocationSuggestions(e.target.value.length >= 2);
                                    }}
                                    onFocus={() => setShowLocationSuggestions(locationTerm.length >= 2)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                
                                {/* Location suggestions dropdown */}
                                {showLocationSuggestions && locationSuggestions.length > 0 && (
                                    <div 
                                        ref={locationSuggestionsRef}
                                        className={`absolute z-50 w-full left-0 top-full mt-1 rounded-md shadow-lg border max-h-80 overflow-y-auto ${suggestionsBgClass}`}
                                    >
                                        <ul className="py-1">
                                            {locationSuggestions.map((suggestion, index) => (
                                                <li 
                                                    key={index}
                                                    className={`px-4 py-2 cursor-pointer flex items-center ${suggestionItemClass}`}
                                                    onClick={() => handleLocationSuggestionClick(suggestion)}
                                                >
                                                    <svg className="h-4 w-4 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>{suggestion}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
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