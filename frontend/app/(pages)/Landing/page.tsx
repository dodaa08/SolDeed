import Header from "@/app/components/landing/header";
import Hero from "@/app/components/landing/Hero";
import JobListings from "@/app/components/landing/JobListings";

export default function LandingPage(){
    return (
        <div className="bg-white min-h-screen w-full">
              {/* <div>
                <Header />
              </div> */}
              <div>
                <Hero />
              </div>
              <div>
                <JobListings />
              </div>
        </div>
    )
}