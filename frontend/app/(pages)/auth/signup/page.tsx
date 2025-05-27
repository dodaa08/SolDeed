"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/utils/supabaseClient";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import useUser from "@/app/hooks/useUser";
import { useEffect } from "react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;  
  const isDark = currentTheme === "dark";
  const router = useRouter();
  const user = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);
  
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      setSuccess("Sign up successful! Please check your email to confirm your account, then sign in.");
      // setEmail("");
      // setPassword("");
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen transition-colors duration-300 ${isDark ? "bg-black/95" : "bg-gradient-to-br from-white via-blue-50 to-white"}`}>
      <div className={`w-full max-w-md p-8 rounded-xl shadow-lg border transition-colors duration-300 ${isDark ? "bg-black/80 border-gray-800 text-white" : "bg-white border-gray-200 text-black"}`}>
        <h2 className={`text-3xl font-bold mb-6 text-center ${isDark ? "text-gray-100" : "text-gray-900"}`}>Sign Up</h2>
        {/* OAuth Buttons */}
        <div className="flex flex-col gap-3 mb-6">
          <button
            onClick={async () => await supabase.auth.signInWithOAuth({ provider: 'google' })}
            className="flex items-center justify-center gap-3 px-6 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors min-w-[220px]"
            style={{ boxShadow: '0 1px 2px rgba(60,64,67,.08)' }}
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <g>
                <path fill="#4285F4" d="M24 9.5c3.54 0 6.73 1.22 9.23 3.23l6.9-6.9C36.68 2.36 30.7 0 24 0 14.82 0 6.73 5.1 2.69 12.44l8.06 6.26C12.5 13.13 17.81 9.5 24 9.5z"/>
                <path fill="#34A853" d="M46.1 24.5c0-1.64-.15-3.22-.43-4.74H24v9.01h12.44c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.13 46.1 31.3 46.1 24.5z"/>
                <path fill="#FBBC05" d="M10.75 28.7c-1.13-3.36-1.13-6.98 0-10.34l-8.06-6.26C.98 16.36 0 20.06 0 24c0 3.94.98 7.64 2.69 11.1l8.06-6.26z"/>
                <path fill="#EA4335" d="M24 48c6.7 0 12.68-2.36 17.13-6.44l-7.19-5.6c-2.01 1.35-4.6 2.14-7.44 2.14-6.19 0-11.5-3.63-13.25-8.7l-8.06 6.26C6.73 42.9 14.82 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </g>
            </svg>
            <span>Sign up with Google</span>
          </button>
          <button
            onClick={async () => await supabase.auth.signInWithOAuth({ provider: 'github' })}
            className="flex items-center justify-center gap-3 px-6 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors min-w-[220px]"
            style={{ boxShadow: '0 1px 2px rgba(60,64,67,.08)' }}
          >
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            <span>Sign up with GitHub</span>
          </button>
        </div>
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none transition-colors duration-200 ${isDark ? "bg-gray-900 border-gray-700 text-white placeholder-gray-400" : "bg-gray-100 border-gray-300 text-black placeholder-gray-500"}`}
              placeholder="you@email.com"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none transition-colors duration-200 ${isDark ? "bg-gray-900 border-gray-700 text-white placeholder-gray-400" : "bg-gray-100 border-gray-300 text-black placeholder-gray-500"}`}
              placeholder="Password"
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-500 text-sm">{success}</div>}
          <button
            type="submit"
            className={`w-full py-2 cursor-pointer rounded font-semibold transition-colors duration-200 ${isDark ? "bg-blue-700 hover:bg-blue-800 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/auth/signin" className={`font-medium transition-colors duration-200 ${isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"}`}>
            Already have an account? Sign In
          </Link>
        </div>
      </div>
    </div>
  );
} 