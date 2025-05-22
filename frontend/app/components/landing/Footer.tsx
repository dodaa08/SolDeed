"use client";
import Link from 'next/link';
import { useTheme } from "next-themes";

export default function Footer() {
  // Theme handling
  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';
  
  // Conditional styling
  const footerBgClass = isDark ? "bg-gray-900 border-gray-800" : "bg-gray-50 border-gray-200";
  const logoTextClass = isDark ? "text-blue-400" : "text-blue-600";
  const descriptionClass = isDark ? "text-gray-400" : "text-gray-600";
  const sectionTitleClass = isDark ? "text-gray-300" : "text-gray-900";
  const linkClass = isDark ? "text-gray-400 hover:text-blue-400" : "text-gray-600 hover:text-blue-600";
  const socialIconClass = isDark ? "text-gray-500 hover:text-blue-400" : "text-gray-400 hover:text-blue-500";
  const copyrightClass = isDark ? "text-gray-500" : "text-gray-500";
  const footerLinkClass = isDark ? "text-gray-500 hover:text-blue-400" : "text-gray-500 hover:text-blue-600";
  const borderClass = isDark ? "border-gray-800" : "border-gray-200";

  return (
    <footer className={`${footerBgClass} border-t py-12`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and slogan */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 text-center px-5 py-2 relative flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-xl">Sol</div>
              <span className={`ml-1 text-xl font-semibold ${logoTextClass}`}>Deed</span>
            </div>
            <p className={`mb-4 ${descriptionClass}`}>
              Connecting blockchain talent with innovative projects on Solana.
            </p>
            <div className="flex space-x-4">
              <a href="#" className={socialIconClass}>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className={socialIconClass}>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className={socialIconClass}>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className="col-span-1">
            <h3 className={`text-sm font-semibold ${sectionTitleClass} tracking-wider uppercase mb-4`}>
              Job Seekers
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/jobs" className={linkClass}>
                  Browse All Jobs
                </Link>
              </li>
              <li>
                <Link href="/jobs" className={linkClass}>
                  Remote Jobs
                </Link>
              </li>
              <li>
                <Link href="/jobs" className={linkClass}>
                  Developer Jobs
                </Link>
              </li>
              <li>
                <Link href="/jobs" className={linkClass}>
                  Marketing Jobs
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className={`text-sm font-semibold ${sectionTitleClass} tracking-wider uppercase mb-4`}>
              Employers
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/post-job" className={linkClass}>
                  Post a Job
                </Link>
              </li>
              <li>
                <Link href="#" className={linkClass}>
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className={linkClass}>
                  Employer Resources
                </Link>
              </li>
              <li>
                <Link href="#" className={linkClass}>
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className={`text-sm font-semibold ${sectionTitleClass} tracking-wider uppercase mb-4`}>
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className={linkClass}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className={linkClass}>
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className={linkClass}>
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className={linkClass}>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className={`mt-12 pt-8 border-t ${borderClass} flex flex-col md:flex-row justify-between items-center`}>
          <p className={`text-sm ${copyrightClass}`}>
            &copy; {new Date().getFullYear()} SolDeed. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className={`text-sm ${footerLinkClass}`}>
              Terms of Service
            </Link>
            <Link href="#" className={`text-sm ${footerLinkClass}`}>
              Privacy Policy
            </Link>
            <Link href="#" className={`text-sm ${footerLinkClass}`}>
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 