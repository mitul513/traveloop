import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Traveloop — Multi-City Travel Planner",
  description:
    "Plan seamless multi-city adventures with Traveloop. Organize stops, activities, budgets, and packing lists in one beautiful interface.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">
        {/* Animated gradient atmosphere */}
        <div className="bg-travel-atmosphere" />

        {/* Wave decoration at bottom */}
        <div className="fixed bottom-0 left-0 right-0 z-0 pointer-events-none opacity-[0.03]">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60C240 120 480 0 720 60C960 120 1200 0 1440 60V120H0V60Z" fill="url(#wave-grad)" />
            <defs>
              <linearGradient id="wave-grad" x1="0" y1="60" x2="1440" y2="60">
                <stop stopColor="#06b6d4" />
                <stop offset="0.5" stopColor="#f97316" />
                <stop offset="1" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
