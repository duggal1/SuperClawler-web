import { SVGProps } from 'react';

export default function Gemini(props: SVGProps<SVGSVGElement>) {
    return (
        // 1. Add viewBox: Defines the internal coordinate system (0,0 to 512,512).
        // 2. Remove fixed width/height: Let props/CSS control the final rendered size.
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512" // <-- Use the original design dimensions for viewBox
            {...props} // Spread props (like className="size-10") here
        >
            {/* 3. Make rect fill the viewBox */}
            <rect
                width="100%" // Fills the viewBox width
                height="100%" // Fills the viewBox height
                fill="#f60"  // Orange background
                rx="15%" // Rounded corners relative to the rect size
            />
            {/* 4. Path coordinates are now relative to the 512x512 viewBox */}
            <path
                d="M126 113h49l81 164 81-165h49L274 314v134h-42V314z"
                fill="#fff" // White shape
            />
        </svg>
    );
}