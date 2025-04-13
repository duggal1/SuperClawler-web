import type { Metadata } from "next";
import { ThemeProvider } from "@/app/providers/theme-provider";
import "./globals.css";
import {Navbar} from "@/components/navbar/navbar";
import Footer from "@/components/Footer/footer";
import Script from "next/script";

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
      <head>
        <Script id="theme-switcher" strategy="beforeInteractive">
          {`
            if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('dark')
            } else {
              document.documentElement.classList.remove('dark')
            }
          `}
        </Script>
      </head>
      <body className="antialiased font-serif min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <Navbar/>
          <div className="min-h-screen bg-background text-gray-900 dark:text-white">{children}</div>
          <Footer/>
        </ThemeProvider>
      </body>
    </html>
  );
}