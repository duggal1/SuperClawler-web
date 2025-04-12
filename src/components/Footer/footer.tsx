import { FOOTER_LINKS } from "./constant";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import AnimationContainer from "../Contaniers/global-motion";
import { Particles } from "../magicui/particles";


const Footer = () => {
    return (
        <footer className="w-full py-10 relative">
            <AnimationContainer delay={0.3}>
                <div className="relative flex flex-col md:flex-row justify-between pb-40 overflow-hidden footer">
                    <Particles
                        className="absolute inset-0 w-full -z-10"
                        quantity={40}
                        ease={10}
                        color="#d4d4d8"
                        refresh
                    />
                    <div className="flex flex-col items-start max-w-48">
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
                        </Link>
                            <span className="text-xl font-medium">
                              SuperClawler
                            </span>
                        </div>
                        <p className="text-base max-w mt-4">
                            Empower your business with our AI crawl support.
                        </p>
                        <Button className="mt-8">
                            <Link href="/app">
                                Start for free
                            </Link>
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-lg mt-10 md:mt-0">
                        {FOOTER_LINKS?.map((section, index) => (
                            <div key={index} className="flex flex-col gap-4">
                                <h4 className="text-sm font-medium">
                                    {section.title}
                                </h4>
                                <ul className="space-y-4 w-full">
                                    {section.links.map((link, index) => (
                                        <li key={index} className="text-sm text-muted-foreground hover:text-foreground transition-all w-full">
                                            <Link href={link.href} className="w-full">
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
                <div className="pt-10 flex items-center justify-between relative">
                    <p className="text-sm text-secondary-foreground">
                        &copy; {new Date().getFullYear()} Luro. All rights reserved.
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
            
            </AnimationContainer>
        </footer>
    )
};

export default Footer