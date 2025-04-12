import { FOOTER_LINKS } from "./constant";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import AnimationContainer from "../Contaniers/global-motion";
import { Particles } from "../magicui/particles";
import { AuroraText } from "../magicui/aurora-text";


const Footer = () => {
    return (
        <footer className="w-full py-8 border-t mt-10 border-gray-200  dark:border-gray-900 relative">
            <AnimationContainer delay={0.3}>
                <div className="container mx-auto relative flex flex-col md:flex-row justify-between pb-20 overflow-hidden">
                    <Particles
                        className="absolute inset-0 w-full -z-10"
                        quantity={40}
                        ease={10}
                        color="#d4d4d8"
                        refresh
                    />
                    <div className="flex flex-col items-start max-w-[240px]">
                        <div className="flex items-center gap-2">
                            <Link href="/" aria-label="SuperCrawler Home" className="flex items-center gap-2">
                                <Image
                                    src="/icons/super-crawler-logo.png"
                                    alt="Super Crawler Logo"
                                    width={32}
                                    height={32}
                                    priority 
                                    className="h-8 w-auto"
                                />
                                <span className="text-xl  font-serif font-semibold ">
                                    <AuroraText>
                                        SuperCrawler
                                    </AuroraText>
                                </span>
                            </Link>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4">
                            Empower your business with our AI crawl support.
                        </p>
                        <Button className="mt-6">
                            <Link href="/app">
                                Start for free
                            </Link>
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 w-full max-w-2xl mt-12 md:mt-0">
                        {FOOTER_LINKS?.map((section, index) => (
                            <div key={index} className="flex flex-col gap-3">
                                <h4 className="text-sm font-semibold">
                                    {section.title}
                                </h4>
                                <ul className="space-y-2 w-full">
                                    {section.links.map((link, index) => (
                                        <li key={index}>
                                            <Link 
                                                href={link.href} 
                                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </AnimationContainer>
            <AnimationContainer delay={0.3}>
            <div className=" w-full border-t border-gray-200  dark:border-gray-900 relative">
  
             <div className=" py-8">
                    <p className="text-sm text-muted-foreground mt-10  justify-center items-center flex">
                        &copy; {new Date().getFullYear()} SuperCrawler All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link href="#" className="p-1">
                        
                        </Link>
                        <Link href="#" className="p-1">
                          
                        </Link>
                        <Link href="#" className="p-1">
                         
                        </Link>
                    </div>
                    </div>
                </div>
            </AnimationContainer>
        </footer>
    )
};

export default Footer;