import { Gemini, Replit, MagicUI, VSCodium, MediaWiki, GooglePaLM } from '@/components/logos';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { InfiniteSlider } from '@/components/motion-primitives/infinite-slider';
import Image from 'next/image';

export default function IntegrationsSection() {
    return (
        <section>
            {/* --- Changed Background for Light/Dark Mode --- */}
            <div className="bg-white dark:bg-black py-24 md:py-32">
                <div className="mx-auto max-w-5xl px-6">
                    {/* --- Kept Masking Effect, Removed Grid Background for Cleaner Look --- */}
                    <div className="group relative mx-auto max-w-[22rem] items-center justify-between space-y-6 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] sm:max-w-md">
                        {/* --- Grid background div removed --- */}
                        {/* 
                        <div
                            role="presentation"
                            className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:32px_32px] opacity-50"></div> 
                        */}

                        <div>
                            <InfiniteSlider
                                gap={24}
                                speed={20}
                                speedOnHover={10}>
                                {/* --- Integration Cards use updated component below --- */}
                                <IntegrationCard><VSCodium /></IntegrationCard>
                                <IntegrationCard><MediaWiki /></IntegrationCard>
                                <IntegrationCard><GooglePaLM /></IntegrationCard>
                                <IntegrationCard><Gemini /></IntegrationCard>
                                <IntegrationCard><Replit /></IntegrationCard>
                                <IntegrationCard><MagicUI /></IntegrationCard>
                            </InfiniteSlider>
                        </div>

                        <div>
                            <InfiniteSlider
                                gap={24}
                                speed={20}
                                speedOnHover={10}
                                reverse>
                                <IntegrationCard><Gemini /></IntegrationCard>
                                <IntegrationCard><Replit /></IntegrationCard>
                                <IntegrationCard><MediaWiki /></IntegrationCard>
                                <IntegrationCard><MagicUI /></IntegrationCard>
                                <IntegrationCard><VSCodium /></IntegrationCard>
                                <IntegrationCard><GooglePaLM /></IntegrationCard>
                            </InfiniteSlider>
                        </div>
                        <div>
                            <InfiniteSlider
                                gap={24}
                                speed={20}
                                speedOnHover={10}>
                                <IntegrationCard><Replit /></IntegrationCard>
                                <IntegrationCard><MagicUI /></IntegrationCard>
                                <IntegrationCard><Gemini /></IntegrationCard>
                                <IntegrationCard><VSCodium /></IntegrationCard>
                                <IntegrationCard><MediaWiki /></IntegrationCard>
                                <IntegrationCard><GooglePaLM /></IntegrationCard>
                            </InfiniteSlider>
                        </div>
                        <div className="absolute inset-0 m-auto flex size-fit items-center justify-center">
  <Image
    src="/icons/supercrawler-new.png" // Assuming '/icons/' is correct relative to public folder
    alt="Super-crawler"
    width={64} // Crucial: Make width and height equal for a square base
    height={24} // Crucial: Make width and height equal for a square base
    className="rounded-full object-cover shadow-lg" // Use rounded-full + object-cover
    // Removed mask-circle as rounded-full should be sufficient.
    // If mask-circle is from a specific library (like DaisyUI) and needed,
    // ensure it's configured correctly, but usually rounded-full is enough.
  />
</div>
                    </div>

                    {/* --- Added font-serif, Adjusted text colors for contrast --- */}
                    <div className="mx-auto mt-16 max-w-lg space-y-6 text-center font-serif">
  <h2 className="text-balance text-3xl font-semibold text-black dark:text-white md:text-4xl">
    Trusted by teams at leading companies
  </h2>
  <p className="text-neutral-600 dark:text-neutral-400">
    Join top businesses that rely on our platform to power their workflows and deliver at scale.
  </p>
</div>

<div className="flex justify-center item-center mt-6">
                        <Button
                            variant="outline"
                            size="sm"
                             // --- Explicit colors for outline button on white/black bg ---
                            className="border-neutral-300 text-black hover:bg-neutral-100 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-900 font-serif" // Added font-serif here too
                            asChild>
                            <Link href="#">Get Started</Link>
                        </Button>
                        </div>
                    </div>
                </div>
           
        </section>
    )
}

// --- Updated Integration Card Styling for Contrast and Cleanliness ---
const IntegrationCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    // Removed unused props: isCenter, position
    return (
        <div className={cn(
            'relative z-20 flex size-12 items-center justify-center rounded-full border',
            // --- Light Mode: Light gray bg, slightly darker border ---
            'bg-neutral-100 border-neutral-200',
            // --- Dark Mode: Dark gray bg, slightly lighter border ---
            'dark:bg-neutral-900 dark:border-neutral-800',
            className
        )}>
            {/* --- Simplified inner div, icon size controlled by parent --- */}
            <div className="flex items-center justify-center *:size-5">
                {children}
            </div>
        </div>
    )
}