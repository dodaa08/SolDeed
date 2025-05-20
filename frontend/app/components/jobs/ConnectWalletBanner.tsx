"use client";
import WalletConnectButton from '../WalletProvider/WalletConnectbtn';

interface ConnectWalletBannerProps {
  totalJobs: number;
  onConnect: () => void;
}

export function ConnectWalletBanner({ totalJobs, onConnect }: ConnectWalletBannerProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex flex-col md:flex-row justify-between items-center">
      <div className="flex-1 mb-4 md:mb-0">
        <h3 className="text-lg font-semibold text-blue-900">Connect your wallet to see all job listings</h3>
        <p className="text-blue-700">Browse over {totalJobs}+ blockchain jobs on the Solana network</p>
      </div>
      {/* <div onClick={onConnect}>
        <WalletConnectButton />
      </div> */}
    </div>
  );
} 