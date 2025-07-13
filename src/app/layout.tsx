import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import AuthGate from "@/components/AuthGate";
import { AppThemeProvider } from "@/contexts/ThemeProvider";
import LayoutWrapper from "@/components/LayoutWrapper";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ✅ Load Material Icons */}
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <AppThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthGate>
            <div className="flex flex-col min-h-screen dark:text-white">
              <LayoutWrapper isFormLogin={false}>
                {children}
              </LayoutWrapper>
            </div>
          </AuthGate>
        </AppThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
