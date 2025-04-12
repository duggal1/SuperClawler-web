import type { Metadata } from "next";

import { ThemeProvider } from "@/app/providers/theme-provider";
import "./globals.css";
import {Navbar} from "@/components/navbar/navbar";
import Footer from "@/components/Footer/footer";

export const metadata: Metadata = {
  title: "MDX Converter | Transform Web Content to MDX",
  description: "Convert web content to beautiful MDX format instantly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-serif min-h-screen">
        <ThemeProvider>
        <Navbar/>
        <div className="min-h-screen bg-background  text-gray-900 dark:text-white">{children}</div>
        <Footer/>
        </ThemeProvider>
      </body>
    </html>
  );
}
