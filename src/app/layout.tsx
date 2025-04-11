import type { Metadata } from "next";

import { ThemeProvider } from "@/app/providers/theme-provider";
import "./globals.css";

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
        <div className="min-h-screen bg-background  text-gray-900 dark:text-white">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
