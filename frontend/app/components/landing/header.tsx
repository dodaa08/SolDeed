"use client"
    
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from "next-themes";
import WalletConnectbtn from '../WalletProvider/WalletConnectbtn';
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { useSupabaseUser } from "@/app/hooks/useSupabaseUser";
import { supabase } from "@/app/utils/supabaseClient";
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';


function getProfileColor(nameOrEmail: string) {
  // Use a palette of nice colors
  const colors = [
    'bg-blue-600', 'bg-purple-600', 'bg-pink-500', 'bg-green-600', 'bg-yellow-500', 'bg-red-500', 'bg-indigo-600', 'bg-teal-500', 'bg-orange-500', 'bg-cyan-600'
  ];
  let hash = 0;
  for (let i = 0; i < nameOrEmail.length; i++) {
    hash = nameOrEmail.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = colors[Math.abs(hash) % colors.length];
  return color;
}

function ProfileDropdown({ user, onSignOut }: { user: any; onSignOut: any }) {
  const [open, setOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const name = user?.user_metadata?.name || user?.email?.split('@')[0] || '';
  const avatar = user?.user_metadata?.avatar_url;
  const email = user?.email;
  const colorClass = getProfileColor(name || email || 'U');

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2  rounded-full "
      >
        {avatar && !imageError ? (
          <img
            src={avatar}
            alt={name}
            className="w-10 h-10 cursor-pointer rounded-full object-cover border-2 border-black shadow-sm"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className={`w-10 cursor-pointer h-10 flex items-center justify-center rounded-full font-bold text-white text-lg ${colorClass} border-2 border-black shadow-sm`}>
            {name?.[0]?.toUpperCase()}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border rounded-xl shadow-xl z-50 p-5 flex flex-col gap-4">
          <div className="flex items-center gap-4 mb-2">
            {avatar && !imageError ? (
              <img
                src={avatar}
                alt={name}
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className={`w-14 h-14 flex items-center justify-center rounded-full font-bold text-white text-3xl ${colorClass} border-2 border-white shadow`}>
                {name?.[0]?.toUpperCase()}
              </span>
            )}
            <div className="flex flex-col gap-1">
              <div className="font-semibold text-base text-gray-900">{name}</div>
              <div className="text-xs text-gray-500">{email}</div>
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="w-max px-5 flex justify-center py-1 ml-12 border border-red-500 cursor-pointer text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors duration-200"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );    
}

export default function Header() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const user = useSupabaseUser();
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <>
        <header className="bg-white dark:bg-black/120 backdrop-blur-sm border-b border-gray-800 py-4 px-6 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold text-gray-700 dark:font-semibold dark:bg-gradient-to-r dark:bg-gray-100 dark:bg-clip-text dark:text-transparent">
                            SolDeed
                        </h1>
                    </div>
                </Link>

                {/* Center Navigation */}
                <div className="hidden md:flex items-center justify-center space-x-8">
                    <Link href="/jobs" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer font-medium transition-colors">
                        Jobs
                    </Link>
                    <button
                        onClick={() => {
                            if (!user) {
                                toast.error('Please sign in to post a job!');
                            } else {
                                router.push('/post');
                            }
                        }}
                        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer font-medium transition-colors"
                    >
                        Post a Job
                    </button>
                </div>

                {/* Right Section */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => theme === "dark" ? setTheme("light") : setTheme("dark")}
                        className="p-2 rounded-lg text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors text-xl"
                    >
                        {theme === "dark" ? <MdOutlineLightMode /> : <MdOutlineDarkMode />}
                    </button>
                    { user ? (
                        <>
                            <WalletConnectbtn />
                            <ProfileDropdown user={user} onSignOut={async () => { await supabase.auth.signOut(); }} />
                        </>
                    ) : (
                        <>
                            <Link href="/auth/signin" className="py-2 px-5 rounded-lg font-semibold border-2 border-gray-600 dark:border-gray-700 text-black dark:text-gray-300 hover:bg-gray-900 transition duration-300 text-sm">
                                Sign In
                            </Link>
                            <Link href="/auth/signup" className="py-2 px-5 rounded-lg border-2 border-gray-500 dark:border-gray-700 bg-gray-500 dark:bg-gray-700 text-white font-semibold transition duration-300 text-sm hover:bg-gray-900">
                                Create Account
                            </Link>
                        </>
                    )}
                    {/* Mobile menu button - hidden on desktop */}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={toggleMobileMenu}
                    className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Mobile Navigation Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden mt-4 py-2 border-t border-gray-200 dark:border-gray-800 bg-white/30 dark:bg-black/30">
                    <nav className="flex flex-col space-y-1">
                        <Link href="/jobs" 
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-lg mx-2">
                            Browse Jobs
                        </Link>
                        <button
                            onClick={() => {
                                if (!user) {
                                    toast.error('Please sign in to post a job!');
                                } else {
                                    router.push('/post');
                                }
                            }}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-lg mx-2"
                        >
                            Post a Job
                        </button>
                        { user ? (
                            <ProfileDropdown user={user} onSignOut={async () => { await supabase.auth.signOut(); }} />
                        ) : (
                            <>
                                <Link href="/auth/signin" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm mx-2 mt-2">
                                    Sign In
                                </Link>
                                <Link href="/auth/signup" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm mx-2 mt-2">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
        <Toaster position="top-center" />
        </>
    );
}