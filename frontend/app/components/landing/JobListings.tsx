"use client";
import Link from 'next/link';
import { useState } from 'react';

// Component for company logo with fallback
interface CompanyLogoProps {
  company: string;
}

const CompanyLogo = ({ company }: CompanyLogoProps) => {
  // Use colored backgrounds with initials as logos
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((word: string) => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const bgColors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
    'bg-red-500', 'bg-yellow-500', 'bg-pink-500'
  ];
  
  const randomBgColor = bgColors[company.length % bgColors.length];

  return (
    <div className="w-10 h-10 rounded-md overflow-hidden flex items-center justify-center">
      <div className={`w-full h-full ${randomBgColor} text-white flex items-center justify-center font-bold text-lg`}>
        {getInitials(company)}
      </div>
    </div>
  );
};

// Sample job data
const SAMPLE_JOBS = [
  {
    id: 1,
    title: "Solana Smart Contract Developer",
    company: "DeFinance Labs",
    location: "Remote",
    salary: "$120k - $160k",
    type: "Full-time",
    posted: "2 days ago"
  },
  {
    id: 2,
    title: "Blockchain Frontend Engineer",
    company: "SolWallet",
    location: "New York, USA",
    salary: "$100k - $130k",
    type: "Full-time",
    posted: "1 week ago"
  },
  {
    id: 3,
    title: "Solana Program Manager",
    company: "DeFi Protocol",
    location: "San Francisco, USA",
    salary: "$140k - $180k",
    type: "Full-time",
    posted: "3 days ago"
  },
  {
    id: 4,
    title: "Rust Developer",
    company: "SolanaDAO",
    location: "Remote",
    salary: "$110k - $150k",
    type: "Contract",
    posted: "Just now"
  },
  {
    id: 5,
    title: "Web3 UX/UI Designer",
    company: "NFT Marketplace",
    location: "London, UK",
    salary: "$90k - $120k",
    type: "Full-time",
    posted: "2 weeks ago"
  },
  {
    id: 6,
    title: "Solana Ecosystem Analyst",
    company: "Crypto Research Firm",
    location: "Singapore",
    salary: "$80k - $110k",
    type: "Full-time",
    posted: "5 days ago"
  },
  {
    id: 7,
    title: "Technical Writer - Blockchain",
    company: "SolDocs",
    location: "Remote",
    salary: "$70k - $90k",
    type: "Part-time",
    posted: "1 week ago"
  },
  {
    id: 8,
    title: "dApp Product Manager",
    company: "MetaVerse Inc",
    location: "Berlin, Germany",
    salary: "$120k - $150k",
    type: "Full-time",
    posted: "3 days ago"
  },
  {
    id: 9,
    title: "Blockchain Security Engineer",
    company: "SecureChain",
    location: "Remote",
    salary: "$130k - $180k",
    type: "Full-time",
    posted: "2 days ago"
  },
  {
    id: 10,
    title: "Community Manager - Solana Projects",
    company: "SolCommunity",
    location: "Remote",
    salary: "$60k - $80k",
    type: "Full-time",
    posted: "4 days ago"
  },
];

export default function JobListings() {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnectWallet = () => {
    // This would be replaced with actual wallet connection logic
    setIsConnected(!isConnected);
  };

  return (
    <div className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Jobs</h2>
          <div className="text-sm text-gray-500">Showing 10 of 1,298 jobs</div>
        </div>

        {/* Connect Wallet Banner */}
        {!isConnected && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex-1 mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-blue-900">Connect your wallet to see all job listings</h3>
              <p className="text-blue-700">Browse over 1,000+ blockchain jobs on the Solana network</p>
            </div>
            
          </div>
        )}

        {/* Jobs Listing */}
        <div className="space-y-4">
          {SAMPLE_JOBS.map(job => (
            <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row items-start md:items-center">
                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-4">
                  <CompanyLogo company={job.company} />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="text-gray-700">{job.company}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-700">{job.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">{job.type}</span>
                    <span className="px-2 py-1 bg-green-50 text-green-700 rounded">{job.salary}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end mt-4 md:mt-0 self-stretch justify-between w-full md:w-auto">
                  <span className="text-sm text-gray-500 mb-2 md:mb-4">Posted {job.posted}</span>
                  <button className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors text-sm font-medium">
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="mt-8 text-center">
          <button 
            onClick={handleConnectWallet}
            className={`px-8 py-3 rounded-lg font-medium ${
              isConnected 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            } transition-colors`}
          >
            {isConnected ? 'View More Jobs' : 'Connect Wallet to View More'}
          </button>
        </div>
      </div>
    </div>
  );
} 