
"use client";

// import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { Notion, Supabase, OpenAI, Shopify, Zapier, Stripe } from '@/components/motion-primitives/logos';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import AnimationContainer from './Contaniers/global-motion';
export default function SuperCrawlerSection() {
   
    return (
        <AnimationContainer delay={0.3}>
        <section className="bg-white dark:bg-black font-serif text-neutral-900 dark:text-neutral-100">
                  <div className="py-24 md:py-32">
                      <div className="mx-auto px-6 max-w-6xl">
                      <div className="text-center">
  <h2 className="font-serif font-black text-4xl md:text-5xl lg:text-6xl text-balance !leading-tight">
    Crawl your dream{' '}
    <span className="inline-block relative">
      <span className="bottom-0 absolute inset-x-0 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-full h-1 decoration-wavy underline"></span>
      <span className="relative">domains</span>
    </span>{' '}
    in seconds.
  </h2>
  <p className="mx-auto mt-6 max-w-3xl font-serif text-neutral-600 dark:text-neutral-400 text-lg md:text-xl">
  Super Crawler is built for extreme scalability and enterprise demands.
  Experience the fastest, most reliable web crawling solution.
  </p>
</div>


        
                     {/* --- Grid using FeatureCard with ORIGINAL LOGOS --- */}
                     <div className="gap-8 grid sm:grid-cols-2 lg:grid-cols-3 mt-16">
                         <FeatureCard
                             title="Blazing Fast Crawling"
                             description="Utilizes optimized, parallel processing for sub-second domain crawls. Speed is not a feature, it's the standard."
                         >
                             {/* Use original logo */}
                             <Notion className="size-10" />
                         </FeatureCard>
        
                         <FeatureCard
                             title="Extreme Scalability"
                             description="Designed with a distributed architecture to handle millions of pages effortlessly. Scales with your needs."
                         >
                              {/* Use original logo */}
                             <Supabase className="size-10" />
                         </FeatureCard>
        
                         <FeatureCard
                             title="AI-Powered Extraction"
                             description="Leverages advanced AI models to intelligently identify and extract structured data, even from complex sites."
                         >
                              {/* Use original logo */}
                             <OpenAI className="size-10" />
                         </FeatureCard>
        
                         <FeatureCard
                             title="Developer-Friendly API"
                             description="Integrate crawling seamlessly into your workflows with our robust and well-documented REST API."
                         >
                              {/* Use original logo */}
                             <Shopify className="size-10" />
                         </FeatureCard>
        
                         <FeatureCard
                             title="Robust Error Handling"
                             description="Intelligent retries, proxy management, and CAPTCHA handling ensure maximum data acquisition success."
                         >
                              {/* Use original logo */}
                             <Zapier className="size-10" />
                         </FeatureCard>
        
                         <FeatureCard
                             title="Real-time Monitoring"
                             description="Detailed dashboards and alerts provide full visibility into crawl progress, performance, and costs."
                         >
                              {/* Use original logo */}
                             <Stripe className="size-15" />
                         </FeatureCard>
                     </div>
        
                     {/* Optional: Add a general call to action */}
                     <div className="mt-20 text-center">
                         {/* <Button size="lg" asChild className="group px-8 py-3 font-serif text-base">
                             <Link href="/#get-started">
                                 Start Crawling Now
                                 <ChevronRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1 duration-300" />
                             </Link>
                         </Button> */}
                     </div>
        
                 </div>
             </div>
              </section>
              </AnimationContainer>
          )
       
  
}


// --- UPDATED Reusable Feature Card Component ---

const FeatureCard: React.FC<{ title: string; description: string; children: React.ReactNode; link?: string }> = ({
    title,
    description,
    children: logo, // Renamed for clarity
    link = '#'
}) => {
    return (
        // Apply GlowingEffect wrapper here
        // Pass className with rounding and height to GlowingEffect itself
        <GlowingEffect
            className="rounded-xl h-full" // Apply rounding and height here
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
            borderWidth={1.5}
            movementDuration={0.8}
            // variant can be used if you want the white border option too
        >
            {/* Card component is now a direct child of GlowingEffect */}
            {/* Remove relative and h-full from Card, it's handled by GlowingEffect's wrapper */}
            {/* Keep overflow-hidden on Card if its content might exceed bounds */}
            <Card className="flex flex-col bg-neutral-50/50 dark:bg-neutral-950/30 shadow-sm dark:shadow-neutral-900/50 p-6 border border-neutral-200/80 hover:border-neutral-300 dark:border-neutral-800/80 dark:hover:border-neutral-700 h-full overflow-hidden transition-all duration-300">
                 {/* Logo */}
                <div className="mb-4 text-neutral-600 dark:text-neutral-300">
                    {logo}
                </div>

                {/* Text Content */}
                <div className="flex-grow space-y-2 mb-4">
                    <h3 className="font-medium text-neutral-900 dark:text-neutral-100 text-lg">{title}</h3>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">{description}</p>
                </div>

                {/* Link */}
                <div className="mt-auto pt-4">
                    <Link href={link} className="group inline-flex items-center font-medium text-sky-600 hover:text-sky-800 dark:hover:text-sky-300 dark:text-sky-400 text-sm transition-colors">
                        Learn More
                        <ChevronRight className="opacity-70 ml-1 !size-4 transition-transform group-hover:translate-x-1 duration-300" />
                    </Link>
                </div>
            </Card>
        </GlowingEffect>
    );
}