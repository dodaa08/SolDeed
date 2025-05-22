"use client";
import { useState, useEffect } from 'react';
import WalletConnectButton from '../WalletProvider/WalletConnectbtn';

interface ConnectWalletBannerProps {
  totalJobs: number;
  onConnect: () => void;
  isDark?: boolean;
}

export function ConnectWalletBanner({ totalJobs, onConnect, isDark = false }: ConnectWalletBannerProps) {
  const [mounted, setMounted] = useState(false);

  // Mount the component client-side to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Conditional styling for dark mode - only applied after component is mounted
  const bannerClass = mounted && isDark 
    ? "bg-blue-900/30 border-blue-800 rounded-lg p-4 mb-8 flex flex-col md:flex-row justify-between items-center"
    : "bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex flex-col md:flex-row justify-between items-center";
  
  const titleClass = mounted && isDark ? "text-lg font-semibold text-blue-300" : "text-lg font-semibold text-blue-900";
  const textClass = mounted && isDark ? "text-blue-400" : "text-blue-700";

  return (
    <div className={bannerClass}>
      <div className="flex-1 mb-4 md:mb-0">
        <h3 className={titleClass}>Connect your wallet to see all job listings</h3>
        <p className={textClass}>Browse over {totalJobs}+ blockchain jobs on the Solana network</p>
      </div>
      <div onClick={onConnect}>
        <WalletConnectButton />
      </div>
    </div>
  );
} 