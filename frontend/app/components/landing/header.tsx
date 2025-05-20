"use client";
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
    const [isConnected, setIsConnected] = useState(false);

    const handleConnectWallet = () => {
        // Wallet connection logic will go here
        setIsConnected(!isConnected);
    };

    return (
        <header className="bg-white shadow-sm py-4 px-6 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center space-x-1">
                    <div className="flex items-center">
                        <div className="h-10 w-10 text-center px-5 py-2 relative flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-xl">Sol </div>
                        <span className="ml-1 text-xl font-semibold text-blue-600">Deed</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                        Home
                    </Link>
                    <Link href="/browse-jobs" className="text-gray-700 hover:text-blue-600 font-medium">
                        Browse Jobs
                    </Link>
                    <Link href="/company-reviews" className="text-gray-700 hover:text-blue-600 font-medium">
                        Company Reviews
                    </Link>
                    <Link href="/salary-guide" className="text-gray-700 hover:text-blue-600 font-medium">
                        Salary Guide
                    </Link>
                    <Link href="/post-job" className="text-gray-700 hover:text-blue-600 font-medium">
                        Post a Job
                    </Link>
                </nav>

                {/* Wallet connect button */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleConnectWallet}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            isConnected 
                                ? 'bg-green-100 text-green-700 border border-green-300' 
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                    >
                        {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
                    </button>

                    {/* Mobile menu button - hidden on desktop */}
                    <button className="md:hidden text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
}