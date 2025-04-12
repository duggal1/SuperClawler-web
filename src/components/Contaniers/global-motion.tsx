"use client";

import { motion } from 'framer-motion';
import React from 'react'; // Import React if not already globally available

interface AnimationContainerProps {
    children: React.ReactNode;
    delay?: number;
    reverse?: boolean;
    className?: string;
    // Add optional props for more control if needed later
    yOffset?: number; // Control the starting distance
    stiffness?: number; // Fine-tune spring stiffness
    damping?: number;  // Fine-tune spring damping
    mass?: number;     // Fine-tune spring mass (weight)
};

const AnimationContainer = ({
    children,
    className,
    reverse,
    delay = 0, // Default delay to 0 if not provided
    yOffset = 50, // Increase the initial offset for a more noticeable travel
    stiffness = 60, // **Drastically lower stiffness** for slower, smoother spring
    damping = 18, // Adjust damping to complement low stiffness (prevents excessive oscillation but allows smooth overshoot)
    mass = 1.5, // Add a bit of mass for a weightier, more "felt" movement
}: AnimationContainerProps) => {

    const variants = {
        hidden: {
            opacity: 0,
            y: reverse ? -yOffset : yOffset,
            // Optional: Add a subtle scale down for extra depth
            // scale: 0.98
        },
        visible: {
            opacity: 1,
            y: 0,
            // Optional: Animate scale back to 1
            // scale: 1,
            transition: {
                type: 'spring', // THE KEY: Use physics-based animation
                stiffness: stiffness, // **Extremely important:** Lower = Softer, Slower, Smoother
                damping: damping,     // **Extremely important:** Controls how quickly the spring settles. Balance with stiffness.
                mass: mass,           // Influences the "weight" and momentum. Higher mass = slower acceleration/deceleration.
                delay: delay,         // Apply the delay here within the transition definition
                // Optional: You could even give opacity its own transition if needed
                // opacity: { duration: 0.5, ease: "easeIn", delay: delay } // Example: Faster fade-in
            }
        }
    };

    return (
        <motion.div
            className={className}
            initial="hidden" // Reference the variant name
            whileInView="visible" // Reference the variant name
            viewport={{ once: false, amount: 0.2 }} // Trigger when 20% is visible, re-animate each time
            variants={variants} // Use the defined variants
        >
            {children}
        </motion.div>
    )
};

export default AnimationContainer;