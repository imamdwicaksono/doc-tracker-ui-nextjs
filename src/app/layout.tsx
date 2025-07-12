import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { SpeedInsights } from "@vercel/speed-insights/next"
import AuthGate from "@/components/AuthGate";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Document Tracking Web App",
  description: "A web application for tracking document workflows",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthGate>
          <LayoutWrapper isFormLogin={false}>{children}</LayoutWrapper>
        </AuthGate>
        
        <SpeedInsights/>
      </body>
    </html>
  );
}
