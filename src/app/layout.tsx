import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import BurgerMenu from "@/components/BurgerMenu";
import LogoutButton from "@/components/auth/LogoutButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Document Tracking Web App",
  description: "A web application for tracking document workflows",
};

const web_url = process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <header className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-300 sm:hidden">
          <Link href={`${web_url}/`} className="text-lg font-semibold text-blue-600">
            Document Tracking
          </Link>
          <BurgerMenu />
        </header>
        

        {/* Desktop Navbar */}
        <nav className="items-center justify-between hidden p-4 bg-gray-100 border-b border-gray-300 sm:flex">
          <Link href={`${web_url}/`} className="text-lg font-semibold text-blue-600">
            Document Tracking
          </Link>
          <div className="flex items-center space-x-4">
            <Link href={`${web_url}/`} className="font-semibold text-blue-600">🏠 Home</Link>
            <Link href={`${web_url}/trackers/create`} className="font-semibold text-blue-600">➕ Create Tracker</Link>
            <Link href={`${web_url}/trackers`} className="font-semibold text-blue-600">📍 Trackers</Link>
            <LogoutButton className='font-semibold text-blue-600' />
          </div>
        </nav>
        
        {children}

        {/* Footer navigation links */}
        {/* Mobile Navbar */}
        <nav className="fixed bottom-0 left-0 z-10 flex justify-around w-full py-2 text-sm bg-gray-100 border-t border-gray-300 sm:hidden">
          
          <Link href={`${web_url}/trackers/create`} className="flex flex-col items-center text-blue-600">
            <span>➕</span><span>Create</span>
          </Link>
          <Link href={`${web_url}`} className="flex flex-col items-center text-blue-600">
            <span>🏠</span><span>Home</span>
          </Link>
          <Link href={`${web_url}/trackers`} className="flex flex-col items-center text-blue-600">
            <span>📍</span><span>Track</span>
          </Link>

          
        </nav>
      
        


      </body>
    </html>
  );
}




