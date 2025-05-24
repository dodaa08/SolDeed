"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export default function SignInPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (isSignUp && !name) {
      setError("Name is required for sign up.");
      return;
    }
    const res = await signIn("credentials", {
      redirect: false,
      name,
      email,
      wallet_address: walletAddress,
      isSignUp: isSignUp ? "true" : "false",
    });
    if (res?.error) {
      setError(res.error);
    } else if (res?.ok) {
      if (isSignUp) {
        setSuccess("Sign up successful! You can now sign in.");
        setName("");
        setEmail("");
        setWalletAddress("");
        setIsSignUp(false);
      } else {
        router.push("/");
      }
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen transition-colors duration-300 ${isDark ? "bg-black/95" : "bg-gradient-to-br from-white via-blue-50 to-white"}`}>
      <div className={`w-full max-w-md p-8 rounded-xl shadow-lg border transition-colors duration-300 ${isDark ? "bg-black/80 border-gray-800 text-white" : "bg-white border-gray-200 text-black"}`}>
        <h2 className={`text-3xl font-bold mb-6 text-center ${isDark ? "text-gray-100" : "text-gray-900"}`}>
          {isSignUp ? "Sign Up" : "Sign In"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp && (
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className={`w-full border rounded px-3 py-2 focus:outline-none transition-colors duration-200 ${isDark ? "bg-gray-900 border-gray-700 text-white placeholder-gray-400" : "bg-gray-100 border-gray-300 text-black placeholder-gray-500"}`}
                placeholder="Your Name"
                required={isSignUp}
              />
            </div>
          )}
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
            <label className="block mb-1 font-medium">Wallet Address</label>
            <input
              type="text"
              value={walletAddress}
              onChange={e => setWalletAddress(e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none transition-colors duration-200 ${isDark ? "bg-gray-900 border-gray-700 text-white placeholder-gray-400" : "bg-gray-100 border-gray-300 text-black placeholder-gray-500"}`}
              placeholder="Your Wallet Address"
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-500 text-sm">{success}</div>}
          <button
            type="submit"
            className={`w-full py-2 cursor-pointer rounded font-semibold transition-colors duration-200 ${isDark ? "bg-blue-700 hover:bg-blue-800 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            className={`font-medium transition-colors duration-200 ${isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"}`}
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
              setSuccess("");
            }}
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
} 