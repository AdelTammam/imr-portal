/*
 * app/layout.tsx
 * Date: August 2026
 * Description: Root layout for the IMR portal.
 *   Inputs:  Children React nodes from each page.
 *   Processing: Wraps the entire app with the SessionProvider so auth
 *     state is accessible from any client component. Sets metadata and
 *     applies the cinema dark theme globally.
 *   Outputs: Full HTML document shell with navbar, main content, footer.
 */

import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/app/components/Providers";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title:       "IMR — Internet Movies Rental",
  description: "The Internet Movies Rental Company movie database portal.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ colorScheme: "dark" }}>
      <body className="flex flex-col min-h-screen">
        <Providers>
          <NavBar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
