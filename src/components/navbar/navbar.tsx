'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Sun, Moon } from 'lucide-react'; // Removed Github from here
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

// --- New GitHub SVG Component ---
const GitHubIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 128 128"
        id="github"
        className={cn("h-5 w-5", className)} // Apply base size + incoming classes
        // Use fill="currentColor" and let text color control it, OR use invert for simplicity
        // Using invert here as it's simpler for the provided SVG structure
    >
        <g fill="#181616" className="dark:invert"> {/* Apply dark:invert here */}
            <path
                fillRule="evenodd"
                d="M64 5.103c-33.347 0-60.388 27.035-60.388 60.388 0 26.682 17.303 49.317 41.297 57.303 3.017.56 4.125-1.31 4.125-2.905 0-1.44-.056-6.197-.082-11.243-16.8 3.653-20.345-7.125-20.345-7.125-2.747-6.98-6.705-8.836-6.705-8.836-5.48-3.748.413-3.67.413-3.67 6.063.425 9.257 6.223 9.257 6.223 5.386 9.23 14.127 6.562 17.573 5.02.542-3.903 2.107-6.568 3.834-8.076-13.413-1.525-27.514-6.704-27.514-29.843 0-6.593 2.36-11.98 6.223-16.21-.628-1.52-2.695-7.662.584-15.98 0 0 5.07-1.623 16.61 6.19C53.7 35 58.867 34.327 64 34.304c5.13.023 10.3.694 15.127 2.033 11.526-7.813 16.59-6.19 16.59-6.19 3.287 8.317 1.22 14.46.593 15.98 3.872 4.23 6.215 9.617 6.215 16.21 0 23.194-14.127 28.3-27.574 29.796 2.167 1.874 4.097 5.55 4.097 11.183 0 8.08-.07 14.583-.07 16.572 0 1.607 1.088 3.49 4.148 2.897 23.98-7.994 41.263-30.622 41.263-57.294C124.388 32.14 97.35 5.104 64 5.104z"
                clipRule="evenodd"
            ></path>
            {/* Included the small paths too just in case, though they might be invisible */}
            <path d="M26.484 91.806c-.133.3-.605.39-1.035.185-.44-.196-.685-.605-.543-.906.13-.31.603-.395 1.04-.188.44.197.69.61.537.91zm-.743-.55M28.93 94.535c-.287.267-.85.143-1.232-.28-.396-.42-.47-.983-.177-1.254.298-.266.844-.14 1.24.28.394.426.472.984.17 1.255zm-.575-.618M31.312 98.012c-.37.258-.976.017-1.35-.52-.37-.538-.37-1.183.01-1.44.373-.258.97-.025 1.35.507.368.545.368 1.19-.01 1.452zm0 0M34.573 101.373c-.33.365-1.036.267-1.552-.23-.527-.487-.674-1.18-.343-1.544.336-.366 1.045-.264 1.564.23.527.486.686 1.18.333 1.543zm0 0M39.073 103.324c-.147.473-.825.688-1.51.486-.683-.207-1.13-.76-.99-1.238.14-.477.823-.7 1.512-.485.683.206 1.13.756.988 1.237zm0 0M44.016 103.685c.017.498-.563.91-1.28.92-.723.017-1.308-.387-1.315-.877 0-.503.568-.91 1.29-.924.717-.013 1.306.387 1.306.88zm0 0M48.614 102.903c.086.485-.413.984-1.126 1.117-.7.13-1.35-.172-1.44-.653-.086-.498.422-.997 1.122-1.126.714-.123 1.354.17 1.444.663zm0 0"></path>
        </g>
    </svg>
);

// --- Menu Items ---
const menuItems = [
    { name: 'Playground', href: '/playground' },
    { name: 'Solution', href: '#solution' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#about' },
];

// --- Navbar Component ---
export const Navbar = () => {
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [isScrolled, setIsScrolled] = React.useState(false);
    const { theme, setTheme } = useTheme();

    // --- Scroll Handling Effect ---
    React.useEffect(() => {
        const handleScroll = () => {
            // Trigger slightly earlier for a smoother transition feel
            setIsScrolled(window.scrollY > 20);
        };
        // Use passive listener for better scroll performance
        window.addEventListener('scroll', handleScroll, { passive: true });
        // Initial check
        handleScroll();
        // Cleanup listener
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // --- Theme Change Effect ---
    React.useEffect(() => {
        // Close mobile menu if theme changes
        setMenuOpen(false);
    }, [theme]);

    // --- Toggles ---
    const toggleMenu = () => setMenuOpen(!menuOpen);
    const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

    // --- Render ---
    return (
        <header className="fixed top-0 left-0 z-50 w-full">
            {/* Outer container: Controls padding & max-width */}
            <div
                className={cn(
                    'relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out',
                    // Add top padding when NOT scrolled to push content down, remove when scrolled
                    isScrolled ? 'py-0' : 'pt-4' // Slightly more initial padding
                )}
            >
                {/* Inner container: Handles background, border, blur, height, and rounds corners */}
                <nav
                    className={cn(
                        'relative flex h-16 items-center justify-between transition-all duration-300 ease-in-out', // Smooth height/style transitions
                        isScrolled
                            ? 'rounded-2xl border border-neutral-200/70 bg-white/75 shadow-sm backdrop-blur-xl dark:border-neutral-800/60 dark:bg-neutral-900/75' // More rounded, slightly more transparent, stronger blur
                            : 'border-transparent bg-transparent', // Fully transparent when not scrolled
                        'px-4 md:px-6' // Internal padding
                    )}
                >
                    {/* Left Section: Logo */}
                    <div className="flex flex-shrink-0 items-center">
                        <Link href="/" aria-label="SuperCrawler Home" className="flex items-center gap-2">
                            <Image
                                // UPDATE PATH HERE if needed
                                src="/icons/super-crawler-logo.png"
                                alt="Super Crawler Logo"
                                width={32}
                                height={32}
                                priority // Load logo quickly
                                className="h-8 w-auto"
                            />
                             <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100"> {/* Bold Name */}
                                SuperCrawler
                             </span>
                        </Link>
                    </div>

                    {/* Center Section: Desktop Navigation Links */}
                    <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:gap-x-6 xl:gap-x-8"> {/* Slightly adjusted gap */}
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm font-medium text-neutral-600 transition-colors duration-200 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Right Section: Icons & Actions */}
                    <div className="flex items-center gap-x-2 sm:gap-x-3">
                        {/* Theme Toggle Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Toggle theme"
                            onClick={toggleTheme}
                            className="text-neutral-500 transition-colors duration-200 hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                        >
                            <Sun className="h-5 w-5 scale-100 transform transition-all duration-300 dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-5 w-5 scale-0 transform transition-all duration-300 dark:rotate-0 dark:scale-100" />
                        </Button>

                        {/* GitHub Link Button */}
                         <Button
                            variant="ghost"
                            size="icon"
                            aria-label="GitHub Repository"
                            asChild // Use asChild to make the button behave like the anchor tag
                            className="text-neutral-500 transition-colors duration-200 hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                         >
                            <a
                                href="https://github.com/yourusername/your-repo" // <-- ***** UPDATE THIS GITHUB LINK *****
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                               {/* Use the custom GitHubIcon component */}
                               <GitHubIcon />
                            </a>
                        </Button>


                        {/* Desktop Action Buttons */}
                        <div className="hidden lg:flex lg:items-center lg:gap-x-2">
                            <Button variant="ghost" size="sm" asChild className="text-neutral-600 transition-colors duration-200 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800">
                                <Link href="/login">Login</Link>
                            </Button>
                            {/* Primary Action Button */}
                            <Button
                                variant="default"
                                size="sm"
                                asChild
                                // Slightly refined colors for modern feel
                                className="bg-neutral-900 text-white transition-colors duration-200 hover:bg-neutral-700 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                            >
                                <Link href="/signup">Sign Up</Link>
                            </Button>
                        </div>

                        {/* Mobile Menu Toggle Button */}
                        <div className="lg:hidden">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleMenu}
                                aria-label={menuOpen ? 'Close Menu' : 'Open Menu'}
                                aria-expanded={menuOpen}
                                className="text-neutral-500 transition-colors duration-200 hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                            >
                                {/* Smoother Animated Menu/X Icon */}
                                <div className="relative h-6 w-6">
                                    <Menu
                                        className={cn(
                                            'absolute inset-0 h-6 w-6 transform transition-transform duration-300 ease-in-out',
                                            // Rotate out smoothly
                                            menuOpen ? 'rotate-90 scale-90 opacity-0' : 'rotate-0 scale-100 opacity-100'
                                        )}
                                        strokeWidth={2}
                                    />
                                    <X
                                        className={cn(
                                            'absolute inset-0 h-6 w-6 transform transition-transform duration-300 ease-in-out',
                                             // Rotate in smoothly
                                            menuOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-90 opacity-0'
                                        )}
                                        strokeWidth={2}
                                    />
                                </div>
                            </Button>
                        </div>
                    </div>
                </nav>

                {/* Mobile Menu Panel - Enhanced Animation & Styling */}
                <div
                    className={cn(
                        'absolute inset-x-0 top-full z-40 origin-top transform transition-[opacity,transform] duration-300 ease-in-out lg:hidden', // Specify transition properties
                        menuOpen
                            ? 'translate-y-0 scale-y-100 opacity-100'
                            // Start slightly higher and fade/scale in
                            : '-translate-y-3 scale-y-95 opacity-0 pointer-events-none'
                    )}
                >
                    {/* Panel Styling */}
                    <div className="mt-2 rounded-xl border border-neutral-200/80 bg-white shadow-xl ring-1 ring-black/5 dark:border-neutral-800/70 dark:bg-neutral-900 dark:shadow-2xl">
                        {/* Mobile Menu Links */}
                        <div className="space-y-1 p-4">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMenuOpen(false)} // Close on click
                                    className="block rounded-lg px-3 py-2 text-base font-medium text-neutral-700 transition-colors duration-200 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                        {/* Mobile Action Buttons Area */}
                        <div className="border-t border-neutral-200 px-4 py-4 dark:border-neutral-800">
                            <div className="flex flex-col gap-y-3"> {/* Use gap for spacing */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    className="w-full justify-center transition-colors duration-200 dark:border-neutral-700 dark:hover:bg-neutral-800"
                                >
                                    <Link href="/login" onClick={() => setMenuOpen(false)}>Login</Link>
                                </Button>
                                <Button
                                    variant="default"
                                    size="sm"
                                    asChild
                                    className="w-full justify-center bg-neutral-900 text-white transition-colors duration-200 hover:bg-neutral-700 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                                >
                                    <Link href="/signup" onClick={() => setMenuOpen(false)}>Sign Up</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};