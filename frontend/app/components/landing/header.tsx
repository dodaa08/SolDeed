"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from "next-themes";
import WalletConnectbtn from '../WalletProvider/WalletConnectbtn';
import { MdOutlineDarkMode } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";




export default function Header() {
    const [mounted, setMounted] = useState(false);
    const { systemTheme, theme, setTheme } = useTheme();
    const currentTheme = theme === 'system' ? systemTheme : theme;
    const isDark = currentTheme === 'dark';

    const [isConnected, setIsConnected] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Mount the component client-side to prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const handleConnectWallet = () => {
        // Wallet connection logic will go here
        setIsConnected(!isConnected);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    // Conditional styles based on theme
    const headerStyles = mounted && isDark 
        ? "bg-gray-900 shadow-sm py-4 px-6 sticky top-0 z-50" 
        : "bg-white shadow-sm py-4 px-6 sticky top-0 z-50";

    const navLinkStyles = mounted && isDark
        ? "text-gray-300 hover:text-blue-400 font-medium"
        : "text-gray-700 hover:text-blue-600 font-medium";

    const toggleBtnStyles = mounted && isDark
        ? "bg-gray-100  hover:bg-gray-300 text-gray-800 px-3 py-1 text-xl rounded-lg transition-all duration-100"
        : "bg-gray-400 hover:bg-gray-600 text-white px-3 py-1 text-xl rounded-lg transition-all duration-100";

    const logoTextStyles = mounted && isDark
        ? "ml-1 text-xl font-semibold text-blue-400"
        : "ml-1 text-xl font-semibold text-blue-600";

    return (
        <header className={headerStyles}>
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link href="/">
                <div className="cursor-pointer flex items-center space-x-1">
                    <div className="flex items-center">
                        <div className="h-10 w-10 text-center px-5 py-2 relative flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-xl">Sol </div>
                        <span className={logoTextStyles}>Deed</span>
                    </div>
                </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    <Link href="/" className={navLinkStyles}>
                        Home
                    </Link>
                    <Link href="/jobs" className={navLinkStyles}>
                        Browse Jobs
                    </Link>
                    <div className={navLinkStyles + " cursor-pointer"}>
                        Company Reviews
                    </div>
                    <div className={navLinkStyles + " cursor-pointer"}>
                        Salary Guide
                    </div>
                    <div className={navLinkStyles + " cursor-pointer"}>
                        Post a Job
                    </div>

                    <button
            onClick={() => theme == "dark"? setTheme('light'): setTheme("dark")}
            className={toggleBtnStyles}>
            {mounted && isDark ? <MdOutlineLightMode /> : <MdOutlineDarkMode />}
        </button>
                </nav>

                {/* Wallet connect button and mobile menu toggle */}
                <div className="flex items-center space-x-4">
                    <WalletConnectbtn />
                    {/* Mobile menu button - hidden on desktop */}
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden mt-4 py-2 border-t border-gray-100">
                    <nav className="flex flex-col space-y-3">
                        <Link href="/" className={mounted && isDark ? "px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-blue-400 font-medium" : "px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium"}>
                            Home
                        </Link>
                        <Link href="/jobs" className={mounted && isDark ? "px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-blue-400 font-medium" : "px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium"}>
                            Browse Jobs
                        </Link>
                        <Link href="/company-reviews" className={mounted && isDark ? "px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-blue-400 font-medium" : "px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium"}>
                            Company Reviews
                        </Link>
                        <Link href="/salary-guide" className={mounted && isDark ? "px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-blue-400 font-medium" : "px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium"}>
                            Salary Guide
                        </Link>
                        <Link href="/post-job" className={mounted && isDark ? "px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-blue-400 font-medium" : "px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium"}>
                            Post a Job
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}