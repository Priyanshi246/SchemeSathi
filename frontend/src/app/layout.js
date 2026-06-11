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

export const metadata = {
  title: "SchemeSathi AI — Your AI Welfare Officer",
  description: "Discover government welfare schemes, check your eligibility dynamically, analyze document readiness with OCR, and access application guides through autonomous agents.",
  keywords: "government schemes, eligibility check, AI welfare officer, myScheme, Indian welfare, scholarship guides",
  authors: [{ name: "SchemeSathi Team" }]
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
