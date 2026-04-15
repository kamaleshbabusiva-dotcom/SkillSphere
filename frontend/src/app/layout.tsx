import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillSphere AI | Workforce Transformation OS",
  description: "Enterprise-grade skill intelligence and workforce transformation platform.",
};

import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import AuthGuard from "@/components/AuthGuard";
import ConditionalNavbar from "@/components/ConditionalNavbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#050505] text-white">
        <LanguageProvider>
          <AuthProvider>
            <AuthGuard>
              <ConditionalNavbar />
              <main className="flex-grow">
                {children}
              </main>
              <footer className="border-t border-white/5 py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
                  © 2026 SkillSphere AI. Proprietary Intelligence System.
                </div>
              </footer>
            </AuthGuard>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
