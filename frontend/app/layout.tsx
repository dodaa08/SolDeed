"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppWalletProvider from "./components/WalletProvider/AppWalletProvider";
import Header from "./components/landing/header";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <AppWalletProvider>
              <Header />
              <main className="flex-grow">{children}</main>
            </AppWalletProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
