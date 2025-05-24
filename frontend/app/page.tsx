"use client"
import LandingPage from "./(pages)/Landing/page"
import Footer from './components/landing/Footer'
import { SessionProvider } from "next-auth/react"

export default function(){
  return (
    
    <div>
      <LandingPage />
      <Footer />
    </div>
  
  ) 
}

