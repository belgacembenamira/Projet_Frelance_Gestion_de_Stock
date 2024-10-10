"use client";
import React, { useRef } from "react";
import { Inter } from "next/font/google"; // Google Fonts
import { usePathname } from "next/navigation"; // Hook to get current path
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Sidebar from "./components/Sidebar/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Using useRef to ensure the QueryClient is created only once
  const queryClientRef = useRef(new QueryClient());

  return (
    <html lang="fr">
      <body className={inter.className}>
        <QueryClientProvider client={queryClientRef.current}>
          <Sidebar />
          {/* Wrapper for margin adjustment when Sidebar is present */}
          <div style={{ marginLeft: '260px', padding: '20px' }}>
            {children}
          </div>
        </QueryClientProvider>
      </body>
    </html>
  );
}
