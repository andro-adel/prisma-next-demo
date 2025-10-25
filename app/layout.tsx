import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"; // React Query Provider

// 🧩 Fonts setup
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 🧠 Metadata (SEO)
export const metadata: Metadata = {
  title: "Next Prisma Blog",
  description: "Modern full-stack blog app using Next.js + Prisma + React Query",
};

// 🧩 Root Layout
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={ `${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground` }
      >
        {/* ✅ Global React Query Provider */ }
        <Providers>
          <div className="flex-1 flex flex-col">{ children }</div>
        </Providers>
      </body>
    </html>
  );
}
