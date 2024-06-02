import "./globals.css";
import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";
import GoogleOAuthProvider from "@/provider/google-oauth-provider";
import Sidebar from "@/components/common/sidebar/sidebar";
import { Toaster } from "@/components/ui/toaster";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
        suppressHydrationWarning={true}
      >
        <GoogleOAuthProvider>
          <div className="overflow-hidden max-h-screen flex rounded-lg border bg-background shadow-lg">
            <Sidebar />
            {children}
            <Toaster />
          </div>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
