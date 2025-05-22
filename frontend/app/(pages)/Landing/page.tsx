"use client";
import Header from "@/app/components/landing/header";
import Hero from "@/app/components/landing/Hero";
import JobListings from "@/app/components/landing/JobListings";
import { useJobs } from '@/app/hooks/useJobs';

export default function LandingPage(){
    // Lift up the useJobs hook to share state between Hero and JobListings
    const jobsState = useJobs();
    
    return (
        <div className="bg-white min-h-screen w-full">
              {/* <div>
                <Header />
              </div> */}
              <div>
                <Hero jobsState={jobsState} />
              </div>
              <div>
                <JobListings jobsState={jobsState} />
              </div>
        </div>
    )
}