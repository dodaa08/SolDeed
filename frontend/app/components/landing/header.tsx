"use client";
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import WalletConnectbtn from '../WalletProvider/WalletConnectbtn';


export default function Header() {
    const [isConnected, setIsConnected] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleConnectWallet = () => {
        // Wallet connection logic will go here
        setIsConnected(!isConnected);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <header className="bg-white shadow-sm py-4 px-6 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link href="/">
                <div className="cursor-pointer flex items-center space-x-1">
                    <div className="flex items-center">
                        <div className="h-10 w-10 text-center px-5 py-2 relative flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-xl">Sol </div>
                        <span className="ml-1 text-xl font-semibold text-blue-600">Deed</span>
                    </div>
                </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                        Home
                    </Link>
                    <Link href="/jobs" className="text-gray-700 hover:text-blue-600 font-medium">
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

                {/* Wallet connect button and mobile menu toggle */}
                <div className="flex items-center space-x-4">
                    <WalletConnectbtn />

                    {/* Mobile menu button - hidden on desktop */}
                    <button 
                        onClick={toggleMobileMenu}
                        className="md:hidden text-gray-700 focus:outline-none"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden mt-4 py-2 border-t border-gray-100">
                    <nav className="flex flex-col space-y-3">
                        <Link href="/" className="px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium">
                            Home
                        </Link>
                        <Link href="/jobs" className="px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium">
                            Browse Jobs
                        </Link>
                        <Link href="/company-reviews" className="px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium">
                            Company Reviews
                        </Link>
                        <Link href="/salary-guide" className="px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium">
                            Salary Guide
                        </Link>
                        <Link href="/post-job" className="px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium">
                            Post a Job
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}