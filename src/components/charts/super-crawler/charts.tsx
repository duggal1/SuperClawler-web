"use client"

import { useState, useEffect } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Rocket, ArrowUpRight, Globe } from "lucide-react"
import { motion } from 'framer-motion'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"

// --- Updated Data for Super Crawler ---
const chartData = [
  { time: 0, crawled: 0 },
  { time: 0.4, crawled: 1 },
  { time: 1.0, crawled: 100 },
  { time: 2.5, crawled: 500 },
  { time: 5.0, crawled: 1000 },
]

// --- Updated Chart Configuration ---
const chartConfig = {
  crawled: {
    label: "Websites Crawled",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function ChartSuperCrawler() {
  // Animated data points for initial motion
  const [displayData, setDisplayData] = useState([{ time: 0, crawled: 0 }])

  // Animation trigger states
  const [chartVisible, setChartVisible] = useState(false)
  const [dataAnimating, setDataAnimating] = useState(false)

  // Handle initial animations sequence
  useEffect(() => {
    // Step 1: Show component
    const visibilityTimer = setTimeout(() => {
      setChartVisible(true)
    }, 300)

    // Step 2: Begin data animation
    const dataTimer = setTimeout(() => {
      setDataAnimating(true)

      // Step 3: Animate data points sequentially
      let currentIndex = 0
      const dataInterval = setInterval(() => {
        if (currentIndex < chartData.length) {
          setDisplayData(chartData.slice(0, currentIndex + 1))
          currentIndex++
        } else {
          clearInterval(dataInterval)
        }
      }, 400)

      return () => clearInterval(dataInterval)
    }, 800)

    return () => {
      clearTimeout(visibilityTimer)
      clearTimeout(dataTimer)
    }
  }, [])

  // Particle animation - made slightly more subtle
  const particles = Array.from({ length: 6 }).map((_, i) => ({ // Reduced count
    id: i,
    x: Math.random() * 85 + 7.5, // Adjusted range slightly
    delay: Math.random() * 6, // Slightly longer delay range
    size: Math.random() * 2.5 + 0.8, // Adjusted size
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mx-auto max-w-5xl"
    >
      {/* Card Styling: Removed font-serif, simplified background/shadow, added border */}
      <Card className="border border-border/30 rounded-xl shadow-lg bg-card overflow-hidden relative">
        {/* Subtle Background Glow */}
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-primary/5 blur-3xl rounded-full opacity-60" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-chart-1/5 blur-3xl rounded-full opacity-50" />

        <CardHeader className="pb-3 pt-5 px-6 relative z-10"> {/* Adjusted padding */}
          <div className="flex justify-between items-start"> {/* Align items start */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {/* Title: Adjusted font weight and size */}
                <CardTitle className="text-2xl tracking-tight flex items-center gap-2.5 font-semibold">
                  <span className="relative">
                    Super Crawler
                    <motion.span
                      className="absolute -top-1.5 -right-1.5 text-primary/80" // Adjusted position/color
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.4, duration: 0.4, ease: "backOut" }}
                    >
                    
                    </motion.span>
                  </span>
                  {/* Badge: Simplified animation, adjusted style */}
                  <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary font-medium text-xs py-0.5 px-2 backdrop-blur-sm">
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 mr-1.5 bg-primary"></span>
                    Real-time
                  </Badge>
                </CardTitle>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                {/* Description: Adjusted margin */}
                <CardDescription className="text-sm mt-1.5 text-foreground/70">
                  Performance: Time Elapsed vs. Websites Processed
                </CardDescription>
              </motion.div>
            </div>
            <motion.div
              initial={{ scale: 0, opacity: 0, rotate: -20 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ delay: 0.9, duration: 0.6, type: "spring", stiffness: 150 }}
              className="bg-primary/10 p-2.5 rounded-lg" // Adjusted padding/rounding
            >
              <Globe className="h-5 w-5 text-primary" /> {/* Slightly smaller */}
            </motion.div>
          </div>
        </CardHeader>

        {/* Content: Adjusted padding */}
        <CardContent className="pt-2 pb-4 px-6">
          {/* Chart Area: Removed extra background divs */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: chartVisible ? 1 : 0, scale: chartVisible ? 1 : 0.98 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            className="relative" // Removed mb-2
          >
            {/* Floating particles effect - more subtle */}
            {particles.map(particle => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full bg-primary/40 pointer-events-none" // Adjusted opacity
                style={{ width: `${particle.size}px`, height: `${particle.size}px` }} // Use style for size
                initial={{
                  x: `${particle.x}%`,
                  y: "105%", // Start slightly lower
                  opacity: 0,
                }}
                animate={{
                  y: "-15%", // Go higher
                  opacity: [0, 0.6, 0.6, 0], // Fade in/out
                  scale: [1, 1.1, 1], // Subtle pulse
                }}
                transition={{
                  delay: particle.delay,
                  duration: 10, // Longer duration
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear",
                }}
              />
            ))}

            <ChartContainer config={chartConfig} className="h-96 w-full relative z-10 pt-2"> {/* Ensure z-index */}
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  accessibilityLayer
                  data={displayData}
                  margin={{
                    left: 15,
                    right: 25,
                    top: 20,
                    bottom: 10,
                  }}
                >
                  <defs>
                    {/* Using chart-1 color directly now */}
                    <linearGradient id="fillCrawled" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.7} />
                      <stop offset="75%" stopColor="hsl(var(--chart-1))" stopOpacity={0.05} />
                      <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                    </linearGradient>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3.5" result="blur" /> {/* Slightly smaller blur */}
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="hsl(var(--chart-1))" floodOpacity="0.15"/> {/* Subtle shadow */}
                    </filter>
                  </defs>

                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 6" // Adjusted dash pattern
                    stroke="hsl(var(--border))" // Use border color
                    strokeOpacity={0.4} // More subtle
                  />

                  <XAxis
                    dataKey="time"
                    type="number"
                    domain={[0, 5.5]}
                    ticks={[0, 1, 2, 3, 4, 5]}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    tickFormatter={(value) => `${value}s`}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />

                  <YAxis
                    type="number"
                    domain={[0, 1100]}
                    ticks={[0, 250, 500, 750, 1000]}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    width={45}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    tickFormatter={(value) => value.toLocaleString()}
                  />

                  <ChartTooltip
                    cursor={false} // Keep cursor off for clean look
                    content={
                      <ChartTooltipContent
                        indicator="dot"
                        formatter={(value) => `${value.toLocaleString()} sites`}
                        labelFormatter={(value) => `Time: ${value}s`}
                        className="backdrop-blur-md bg-background/80 border border-border/30 shadow-lg rounded-lg text-xs" // Refined tooltip style
                      />
                    }
                  />

                  <Area
                    dataKey="crawled"
                    type="monotoneX"
                    fill="url(#fillCrawled)"
                    stroke="hsl(var(--chart-1))" // Use HSL variable
                    strokeWidth={2.5} // Slightly thinner line
                    isAnimationActive={true}
                    animationDuration={1000}
                    animationEasing="ease-out"
                    filter="url(#glow)"
                    dot={{
                      r: 3.5,
                      strokeWidth: 1.5,
                      fill: "hsl(var(--background))", // Use HSL variable
                      stroke: "hsl(var(--chart-1))", // Use HSL variable
                      filter: "url(#shadow)",
                    }}
                    activeDot={{
                      r: 5, // Slightly smaller active dot
                      strokeWidth: 2,
                      stroke: "hsl(var(--chart-1))", // Use HSL variable
                      fill: "hsl(var(--background))", // Use HSL variable
                      filter: "url(#shadow)",
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </motion.div>

          {/* Bottom Section: Adjusted spacing and styles */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: dataAnimating ? 1 : 0, y: dataAnimating ? 0 : 10 }}
            transition={{ delay: 2.2, duration: 0.5 }}
            className="mt-4 flex justify-between items-center" // Removed px-1
          >
            {/* Live Monitoring Badge: Simplified */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="inline-flex w-2 h-2 bg-primary/70 rounded-full"></span>
              Live monitoring
            </div>

            {/* View Analytics Button: Refined style */}
            <motion.div
              className="text-xs font-medium flex items-center gap-1 text-primary hover:text-primary/80 transition-colors cursor-pointer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              View Analytics <ArrowUpRight className="h-3.5 w-3.5" />
            </motion.div>
          </motion.div>
        </CardContent>

        {/* Footer: Simplified and adjusted padding */}
        <CardFooter className="pt-3 pb-4 px-6 border-t border-border/30">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: dataAnimating ? 1 : 0 }}
            transition={{ delay: 2.4, duration: 0.5 }}
            className="flex w-full justify-between items-center"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <Rocket className="h-3.5 w-3.5" /> {/* Smaller icon */}
              {/* Text: Adjusted font weight */}
              <span className="text-xs">
                Cloud-optimized performance
              </span>
            </div>

            {/* Simplified loading indicator */}
            <motion.div
              className="flex items-center gap-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.8, duration: 0.5 }}
            >
              {[1, 2, 3].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-primary/40"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 2.9 + i * 0.15, duration: 0.4, type: "spring", stiffness: 200 }}
                />
              ))}
            </motion.div>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}