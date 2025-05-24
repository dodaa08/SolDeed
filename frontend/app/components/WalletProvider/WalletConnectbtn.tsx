"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { PublicKey } from "@solana/web3.js";

// Dynamically import the WalletMultiButton with SSR disabled to prevent hydration errors
const WalletMultiButton = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

// Button style options
const buttonStyle = {
//   backgroundColor: "#3d49ea", // Blue color
  color: "white",
  fontWeight: "600",
  borderRadius: "8px",
  border: "none",
  padding: "12px 20px",
  fontSize: "14px",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "#2a36d1", // Darker blue on hover
  }
};

export default function WalletConnectButton() {
  // Add client-side only state to ensure component only renders in the browser
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[180px] h-[40px] bg-gray-200 rounded animate-pulse"></div>;
  }
  
  return (
    <main className="flex items-center justify-center">
      <div className="wallet-button-wrapper">
        <WalletMultiButton 
          style={buttonStyle}
          className="custom-wallet-btn" 
        />
      </div>
      
      {/* Custom CSS for deeper styling */}
      <style jsx global>{`
        /* Modal backdrop */
        .wallet-adapter-modal-backdrop {
          background-color: rgba(0, 0, 0, 0.7) !important;
        }
        
        /* Modal container */
        .wallet-adapter-modal-wrapper {
          background-color: #333333 !important;
          color: white !important;
          border-radius: 12px !important;
        }
        
        /* Modal title */
        .wallet-adapter-modal-title {
          color: white !important;
        }
        
        /* Modal button */
        .wallet-adapter-modal-button-close {
          background-color: #333333 !important;
        }
        
        /* Override the default wallet button styles */
        .wallet-adapter-button {
          background-color:rgb(51, 56, 63) !important;
          transition: all 0.2s ease !important;
        }
        
        .wallet-adapter-button:hover {
          background-color: #333333 !important;
        }
        
        .wallet-adapter-button:not([disabled]):hover {
          background-color: #333333 !important;
        }
        
        /* For the dropdown items */
        .wallet-adapter-dropdown-list {
          background-color: #000000 !important;
          border: none !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5) !important;
          padding: 4px 0 !important;
          width: 280px !important;
        }
        
        .wallet-adapter-dropdown-list-item {
          color: #ffffff !important;
          border-radius: 0 !important;
          font-weight: 500 !important;
          padding: 14px 16px !important;
          opacity: 0.9 !important;
          height: 54px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          font-size: 14px !important;
        }
        
        .wallet-adapter-dropdown-list-item:hover {
          background-color: #222222 !important;
          opacity: 1 !important;
        }
        
        /* Wallet item images */
        .wallet-adapter-dropdown-list-item img,
        .wallet-adapter-dropdown-list-item svg {
          width: 28px !important;
          height: 28px !important;
          margin-right: 12px !important;
          border-radius: 6px !important;
          object-fit: contain !important;
          flex-shrink: 0 !important;
        }
        
        /* Status indicator (Detected) */
        .wallet-adapter-dropdown-list-item span:last-child:not(:only-child) {
          position: absolute !important;
          right: 16px !important;
          color: rgba(255, 255, 255, 0.6) !important;
          font-size: 12px !important;
          font-weight: 400 !important;
        }
        
        /* First and last items for rounded corners */
        .wallet-adapter-dropdown-list-item:first-child {
          border-top-left-radius: 8px !important;
          border-top-right-radius: 8px !important;
        }
        
        .wallet-adapter-dropdown-list-item:last-child {
          border-bottom-left-radius: 8px !important;
          border-bottom-right-radius: 8px !important;
        }
        
        /* Ensure all wallet items are consistently displayed */
        .wallet-adapter-dropdown-list-item > * {
          display: flex !important;
          align-items: center !important;
          flex: 1 !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
        }
        
        /* "More options" button styling */
        .wallet-adapter-modal-list-more {
          background-color: transparent !important;
          color: white !important;
          border-top: 1px solid #333333 !important;
        }
        
        .wallet-adapter-modal-list-more > button {
          color: white !important;
          background-color: transparent !important;
        }
        
        .wallet-adapter-modal-list-more > button:hover {
          background-color: #222222 !important;
        }
        
        /* Modal content styling */
        .wallet-adapter-modal-middle-button {
          background-color: #333333 !important;
          color: white !important;
        }
      `}</style>
    </main>
  );
}