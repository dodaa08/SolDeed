"use client";
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
    return (
        <div className="bg-gradient-to-br from-white via-blue-50 to-white py-8 md:py-12 w-full">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {/* Simple Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                        <span className="text-blue-600">Blockchain</span> Careers on <span className="text-blue-600">Solana</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                        The first Web3 job platform built on Solana. Connecting talent with opportunities in the blockchain ecosystem.
                    </p>
                </div>

                {/* Search Bar - Prominent */}
                <div className="relative w-full shadow-xl rounded-xl overflow-hidden max-w-5xl mx-auto mb-4">
                    <div className="md:flex">
                        <div className="flex-1">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-14 pr-4 py-5 text-lg border-none focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-500"
                                    placeholder="Job title, keywords, or company"
                                />
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
                                    type="text"
                                    className="block w-full pl-14 pr-4 py-5 text-lg border-none md:border-l border-gray-200 focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-500"
                                    placeholder="Location"
                                />
                            </div>
                        </div>
                        <button className="w-full md:w-auto px-10 py-4 bg-blue-600 text-white text-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none cursor-pointer">
                            Search Jobs
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}