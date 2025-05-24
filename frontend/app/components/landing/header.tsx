"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from "next-themes";
import WalletConnectbtn from '../WalletProvider/WalletConnectbtn';
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
    const [mounted, setMounted] = useState(false);
    const { systemTheme, theme, setTheme } = useTheme();
    const currentTheme = theme === 'system' ? systemTheme : theme;
    const isDark = currentTheme === 'dark';
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { data: session, status } = useSession();

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <header className={mounted && isDark ? "bg-black/120 backdrop-blur-sm border-b border-gray-800 py-4 px-6 sticky top-0 z-50" : "bg-white backdrop-blur-sm shadow-sm py-4 px-6 sticky top-0 z-50"}>
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <div className="flex items-center">
                        <h1 className={mounted && isDark 
                            ? 'text-2xl font-semibold bg-gradient-to-r bg-gray-100 bg-clip-text text-transparent' 
                            : 'text-2xl font-bold text-gray-700'
                        }>
                            SolDeed
                        </h1>
                    </div>
                </Link>

                {/* Center Navigation */}
                <div className="hidden md:flex items-center justify-center space-x-8">
                    <Link href="/jobs" className={mounted && isDark 
                        ? "text-gray-300 hover:text-blue-400 font-medium transition-colors" 
                        : "text-gray-700 hover:text-blue-600 font-medium transition-colors"}>
                        Jobs
                    </Link>
                    <Link href="/post" className={mounted && isDark 
                        ? "text-gray-300 hover:text-blue-400 font-medium transition-colors" 
                        : "text-gray-700 hover:text-blue-600 font-medium transition-colors"}>
                        Post a Job
                    </Link>
                </div>

                {/* Right Section */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => theme == "dark" ? setTheme('light') : setTheme("dark")}
                        className={mounted && isDark 
                            ? "p-2 rounded-lg text-gray-400 hover:text-white transition-colors text-xl" 
                            : "p-2 rounded-lg text-gray-600 hover:text-gray-900 transition-colors text-xl"}>
                        {mounted && isDark ? <MdOutlineLightMode /> : <MdOutlineDarkMode />}
                    </button>
                    <WalletConnectbtn />
                    {status === "loading" ? null : session?.user ? (
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-700 dark:text-gray-200">{session.user.name || session.user.email}</span>
                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="px-5  py-2 border-2 border-gray-700 text-white rounded hover:bg-red-600 text-sm"
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link href="/auth/signin" className="py-2 px-5 rounded-lg border-2 border-gray-700 hover:bg-gray-900 transition duration-300 text-sm">
                                Sign In
                            </Link>
                            <Link href="/auth/signup" className="py-2 px-5 rounded-lg border-2 border-gray-700 hover:bg-gray-900 transition duration-300 text-sm">
                                Create Account
                            </Link>
                        </>
                    )}
                    {/* Mobile menu button - hidden on desktop */}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={toggleMobileMenu}
                    className={`md:hidden p-2 rounded-lg ${
                        mounted && isDark 
                            ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    } transition-colors`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Mobile Navigation Menu */}
            {mobileMenuOpen && (
                <div className={`md:hidden mt-4 py-2 border-t ${
                    mounted && isDark ? 'border-gray-800 bg-black/30' : 'border-gray-200 bg-white/30'
                }`}>
                    <nav className="flex flex-col space-y-1">
                        <Link href="/jobs" 
                            className={`px-4 py-2 ${
                                mounted && isDark 
                                    ? "text-gray-300 hover:bg-gray-800/50 hover:text-blue-400" 
                                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                            } font-medium rounded-lg mx-2`}>
                            Browse Jobs
                        </Link>
                        <Link href="/post" 
                            className={`px-4 py-2 ${
                                mounted && isDark 
                                    ? "text-gray-300 hover:bg-gray-800/50 hover:text-blue-400" 
                                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                            } font-medium rounded-lg mx-2`}>
                            Post a Job
                        </Link>
                        {status === "loading" ? null : session?.user ? (
                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm mx-2 mt-2"
                            >
                                Sign Out
                            </button>
                        ) : (
                            <>
                                <Link href="/auth/signin" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm mx-2 mt-2">
                                    Sign In
                                </Link>
                                <Link href="/auth/signup" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm mx-2 mt-2">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}