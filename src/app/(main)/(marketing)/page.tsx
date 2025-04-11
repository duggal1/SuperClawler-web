/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback, ChangeEvent, ReactNode } from 'react';
import { useTheme } from 'next-themes';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import matter from 'gray-matter';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015, github } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import {
  Code, Moon, Sun, Copy, Check, Github, ExternalLink, 
  Terminal, CheckCircle2, Lightbulb, AlertTriangle, Loader2,
  Globe, Eye, BookOpen, Zap, Download, FileCode, Server, TableIcon,
  Sparkles, ArrowRight, Hash, Quote, List, ListOrdered, Image, Table, Link2,
  Layers,
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import type { ComponentPropsWithoutRef } from 'react';

// --- Interfaces ---
interface CrawlResponse {
  message: string;
  logs: string[];
  mdx_files: Array<[string, string]>;
}

interface LanguageDefinition {
  name: string;
  icon: ReactNode;
  code: string;
  highlightLang: string;
  iconClasses?: string;
}

interface RenderedMdxItem {
  url: string;
  mdxSource: MDXRemoteSerializeResult<Record<string, unknown>, Record<string, unknown>>;
  frontmatter: Record<string, unknown>;
}

// --- Custom MDX Components Type ---
type MDXComponentsType = {
  [key: string]: React.ComponentType<any>;
};

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

// --- Motion Components ---
interface MotionContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
  animation?: "fadeIn" | "fadeInUp" | "stagger";
}

const MotionContainer: React.FC<MotionContainerProps> = ({ 
  children, 
  className = "", 
  delay = 0,
  yOffset = 20,
  animation = "fadeInUp"
}) => {
  let initialProps = {};
  let animateProps = {};
  let variantsProps = {};
  
  switch(animation) {
    case "fadeIn":
      initialProps = { opacity: 0 };
      animateProps = { opacity: 1 };
      break;
    case "fadeInUp":
      initialProps = { opacity: 0, y: yOffset };
      animateProps = { opacity: 1, y: 0 };
      break;
    case "stagger":
      variantsProps = staggerContainer;
      initialProps = "hidden";
      animateProps = "visible";
      break;
  }
  
  return (
    <motion.div
      initial={initialProps}
      animate={animateProps}
      variants={Object.keys(variantsProps).length > 0 ? variantsProps : undefined}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// --- Constants ---
const languages: LanguageDefinition[] = [
  // JavaScript
  {
    name: "JavaScript",
    icon: <Code className="text-[#F7DF1E]" />,
    code: `// Example API request with JavaScript
fetch('https://api.example.com/mdx-converter', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://example.com/page-to-convert',
    options: { includeImages: true }
  })
})
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
})
.then(data => {
  console.log('Success:', data);
  // Process MDX files here
})
.catch(error => {
  console.error('Error:', error);
});`,
    highlightLang: 'javascript'
  },
  // TypeScript
  {
    name: "TypeScript",
    icon: <Code className="text-[#3178C6]" />,
    code: `// Example API request with TypeScript
interface RequestData {
  url: string;
  options?: {
    includeImages?: boolean;
  }
}

interface ResponseData {
  message: string;
  logs: string[];
  mdx_files: Array<[string, string]>; // [url, mdxContent]
}

async function convertToMdx(data: RequestData): Promise<ResponseData> {
  try {
    const response = await fetch('https://api.example.com/mdx-converter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(\`HTTP error! Status: \${response.status}\`);
    }
    
    return await response.json() as ResponseData;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Usage
convertToMdx({
  url: 'https://example.com/page-to-convert',
  options: { includeImages: true }
})
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));`,
    highlightLang: 'typescript'
  },
  // Node.js
  {
    name: "Node.js",
    icon: <Server className="text-[#68A063]" />,
    code: `// Example API request with Node.js
// Uses native fetch in Node.js 18+
async function convertWebpageToMdx(targetUrl) {
  try {
    const response = await fetch('https://api.example.com/mdx-converter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: targetUrl,
        options: { includeImages: true }
      })
    });

    if (!response.ok) {
      throw new Error(\`HTTP error! Status: \${response.status}\`);
    }

    const data = await response.json();
    
    // Validate response structure
    if (!data.mdx_files || !Array.isArray(data.mdx_files)) {
      throw new Error('Invalid response format');
    }
    
    return data;
  } catch (error) {
    console.error('Failed to convert webpage:', error);
    throw error;
  }
}

// Usage
convertWebpageToMdx('https://example.com/page-to-convert')
  .then(result => {
    console.log('Conversion successful!');
    console.log(\`Generated \${result.mdx_files.length} MDX files\`);
  })
  .catch(err => console.error('Conversion failed:', err));`,
    highlightLang: 'javascript'
  },
  // Python
  {
    name: "Python",
    icon: <Code className="text-[#3776AB]" />,
    code: `# Example API request with Python
import requests
import json

def convert_webpage_to_mdx(target_url, include_images=True):
    """
    Convert a webpage to MDX format via API
    
    Args:
        target_url (str): The URL of the webpage to convert
        include_images (bool): Whether to include images in the output
        
    Returns:
        dict: The API response with MDX content
    """
    api_url = "https://api.example.com/mdx-converter"
    
    payload = {
        "url": target_url,
        "options": {"includeImages": include_images}
    }
    
    try:
        response = requests.post(
            api_url,
            headers={"Content-Type": "application/json"},
            data=json.dumps(payload)
        )
        
        # Raise an exception for HTTP errors
        response.raise_for_status()
        
        result = response.json()
        
        # Validate response format
        if not result.get("mdx_files") or not isinstance(result["mdx_files"], list):
            raise ValueError("Invalid response format")
            
        return result
        
    except requests.exceptions.RequestException as e:
        print(f"API request failed: {e}")
        raise
    except (json.JSONDecodeError, ValueError) as e:
        print(f"Failed to process response: {e}")
        raise

# Usage example
if __name__ == "__main__":
    try:
        result = convert_webpage_to_mdx("https://example.com/page-to-convert")
        print(f"Successfully converted! Generated {len(result['mdx_files'])} MDX files")
    except Exception as e:
        print(f"Conversion failed: {e}")`,
    highlightLang: 'python'
  },
  // Go
  {
    name: "Go",
    icon: <Code className="text-[#00ADD8]" />,
    code: `// Example API request with Go
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

// Response structure for the MDX conversion API
type ConversionResponse struct {
	Message  string     \`json:"message"\`
	Logs     []string   \`json:"logs"\`
	MdxFiles [][2]string \`json:"mdx_files"\` // [url, mdxContent]
}

// RequestOptions defines configuration options for the conversion
type RequestOptions struct {
	IncludeImages bool \`json:"includeImages"\`
}

// RequestBody is the structure sent to the API
type RequestBody struct {
	URL     string        \`json:"url"\`
	Options RequestOptions \`json:"options"\`
}

func convertWebpageToMdx(targetURL string) (*ConversionResponse, error) {
	apiURL := "https://api.example.com/mdx-converter"
	
	// Prepare request body
	reqBody := RequestBody{
		URL: targetURL,
		Options: RequestOptions{
			IncludeImages: true,
		},
	}
	
	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}
	
	// Create and send request
	req, err := http.NewRequest("POST", apiURL, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}
	
	req.Header.Set("Content-Type", "application/json")
	
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()
	
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API returned non-OK status: %s", resp.Status)
	}
	
	// Read and parse response
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}
	
	var result ConversionResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, fmt.Errorf("failed to unmarshal response: %w", err)
	}
	
	return &result, nil
}

func main() {
	targetURL := "https://example.com/page-to-convert"
	
	result, err := convertWebpageToMdx(targetURL)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}
	
	fmt.Println("Conversion successful!")
	fmt.Printf("Generated %d MDX files\n", len(result.MdxFiles))
}`,
    highlightLang: 'go'
  }
];

// --- Custom MDX Components with Extreme Modern Styling (LIGHT MODE - CORRECTED) ---
// Renamed to lightMdxComponents and ensuring only light styles are present
const lightMdxComponents: MDXComponentsType = {
  h1: (props: ComponentPropsWithoutRef<'h1'>) => (
    <div className="group relative mb-14 mt-16">
      <span className="absolute -left-8 top-3 hidden h-10 w-1.5 transform bg-gradient-to-b from-indigo-500 to-purple-500 opacity-80 transition-opacity duration-300 lg:block" />
      <h1
        // Use explicit light mode color, remove dark variant
        className="font-serif scroll-m-20 text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-4"
        {...props}
      />
      <div className="h-0.5 w-28 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-4" />
    </div>
  ),
  h2: (props: ComponentPropsWithoutRef<'h2'>) => (
    <div className="group relative mb-10 mt-14">
      <span className="absolute -left-6 top-2 hidden h-8 w-1 transform bg-gradient-to-b from-indigo-400 to-purple-400 opacity-70 transition-opacity duration-300 lg:block" />
      <h2
        // Use explicit light mode color, remove dark variant
        className="font-serif scroll-m-20 pb-1 text-3xl font-semibold tracking-tight text-gray-900 first:mt-0"
        {...props}
      />
      <div className="h-0.5 w-20 bg-gradient-to-r from-indigo-400/80 to-purple-400/80 rounded-full mt-3" />
    </div>
  ),
  h3: (props: ComponentPropsWithoutRef<'h3'>) => (
    <h3
      // Use explicit light mode color, remove dark variant
      className="font-serif scroll-m-20 text-2xl font-semibold tracking-tight text-gray-900 mt-12 mb-5"
      {...props}
    />
  ),
  h4: (props: ComponentPropsWithoutRef<'h4'>) => (
    <h4
      // Use explicit light mode color, remove dark variant
      className="font-serif scroll-m-20 text-xl font-semibold tracking-tight text-gray-900 mt-10 mb-4"
      {...props}
    />
  ),
  p: (props: ComponentPropsWithoutRef<'p'>) => (
    <p
      // Use explicit light mode color, remove dark variant
      className="font-serif leading-8 [&:not(:first-child)]:mt-6 text-gray-900 text-lg"
      {...props}
    />
  ),
  a: (props: ComponentPropsWithoutRef<'a'>) => (
    <a
      // Use explicit light mode colors, remove dark variants
      className="font-serif inline-flex items-center gap-1 font-medium text-indigo-600 underline underline-offset-4 decoration-indigo-500/40 hover:text-indigo-700 hover:decoration-indigo-600/60 transition-all"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {props.children}
      <ExternalLink className="w-3.5 h-3.5 opacity-80 shrink-0" />
    </a>
  ),
  ul: (props: ComponentPropsWithoutRef<'ul'>) => (
    <ul
      // Use explicit light mode colors, remove dark variants
      className="font-serif my-6 ml-6 list-disc [&>li]:mt-3 text-gray-900 marker:text-indigo-500 space-y-3"
      {...props}
    />
  ),
  ol: (props: ComponentPropsWithoutRef<'ol'>) => (
    <ol
      // Use explicit light mode colors, remove dark variants
      className="font-serif my-6 ml-6 list-decimal [&>li]:mt-3 text-gray-900 marker:text-indigo-500 space-y-3"
      {...props}
    />
  ),
  li: (props: ComponentPropsWithoutRef<'li'>) => (
    <li
      // Use explicit light mode color, remove dark variant
      className="font-serif text-lg leading-relaxed pl-2 text-gray-900"
      {...props}
    />
  ),
  code: (props: ComponentPropsWithoutRef<'code'>) => (
    <code
      // Use explicit light mode colors, remove dark variants
      className="relative rounded-md bg-gray-50 px-[0.45rem] py-[0.2rem] font-mono text-sm font-medium text-indigo-700 border border-gray-200 shadow-sm"
      {...props}
    />
  ),
  pre: (props: ComponentPropsWithoutRef<'pre'>) => (
    <div className="relative my-10 group">
      <div className="absolute -inset-x-4 -inset-y-3 z-0 rounded-xl bg-gray-50/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute right-3 top-3 z-20">
        <button className="p-1.5 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors backdrop-blur-sm border border-gray-200 shadow-sm">
          <Copy className="w-4 h-4" />
        </button>
      </div>
      <div className="relative z-10 rounded-lg overflow-hidden shadow-lg border border-gray-200">
        <div className="h-8 bg-white flex items-center space-x-1.5 px-4 border-b border-gray-200">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
        </div>
        <pre
          // Use explicit light mode colors, remove dark variants
          className="overflow-x-auto py-4 px-5 text-[0.9rem] leading-relaxed bg-white text-gray-900"
          {...props}
        />
      </div>
    </div>
  ),
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote
      // Use explicit light mode colors, remove dark variants
      className="mt-8 mb-8 bg-gray-50 pl-6 pr-4 py-5 italic text-lg text-gray-900 font-serif rounded-r-lg shadow-md border border-l-4 border-l-indigo-500 border-gray-100"
      {...props}
    />
  ),
  img: (props: ComponentPropsWithoutRef<'img'>) => { // Keep img as is
    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const img = e.currentTarget;
      img.onerror = null;
      img.src = "https://cdn.dribbble.com/userupload/8726277/file/still-90096ae0b20436af7d475737af5b86e5.gif?resize=400x0";
      img.classList.add("fallback-image");
    };
    return (
      <figure className="my-12 relative group">
        <div className="absolute -inset-2.5 bg-indigo-50/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
        <img
          className="rounded-xl overflow-hidden shadow-lg border border-gray-200 w-full object-cover hover:shadow-indigo-100/50 transition-all duration-300 transform group-hover:scale-[1.01]"
          loading="lazy"
          alt={props.alt || 'Image'}
          onError={handleError}
          {...props}
        />
        {props.alt && (
          <figcaption className="mt-4 text-center text-sm text-gray-700 italic font-serif">
            {props.alt}
          </figcaption>
        )}
      </figure>
    );
  },
  hr: (props: ComponentPropsWithoutRef<'hr'>) => ( // Keep hr as is
    <div className="my-16 text-center">
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-300 opacity-80 mx-1.5"></span>
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-300 opacity-80 mx-1.5"></span>
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-300 opacity-80 mx-1.5"></span>
    </div>
  ),
  table: (props: ComponentPropsWithoutRef<'table'>) => ( // Keep table wrapper as is
    <div className="my-10 overflow-hidden rounded-xl shadow-lg border border-gray-200">
      <div className="overflow-x-auto">
        <table
          className="w-full border-collapse font-serif text-sm"
          {...props}
        />
      </div>
    </div>
  ),
  thead: (props: ComponentPropsWithoutRef<'thead'>) => (
    <thead
      // Use explicit light mode colors, remove dark variant
      className="bg-gray-50 font-serif text-gray-900"
      {...props}
    />
  ),
  tbody: (props: ComponentPropsWithoutRef<'tbody'>) => (
    <tbody
      // Use explicit light mode colors, remove dark variant
      className="divide-y divide-gray-100 font-serif text-gray-900 bg-white"
      {...props}
    />
  ),
  tr: (props: ComponentPropsWithoutRef<'tr'>) => (
    <tr
      // Use explicit light mode hover, remove dark variant
      className="hover:bg-gray-50 transition-colors font-serif"
      {...props}
    />
  ),
  th: (props: ComponentPropsWithoutRef<'th'>) => (
    <th
      // Use explicit light mode color, remove dark variant
      className="px-5 py-3.5 text-left font-semibold text-gray-900 font-serif tracking-wide"
      {...props}
    />
  ),
  td: (props: ComponentPropsWithoutRef<'td'>) => (
    <td
      // Use explicit light mode color, remove dark variant
      className="px-5 py-3.5 text-gray-900 align-top font-serif"
      {...props}
    />
  ),
  // Custom components - Ensure only light mode styles
  Note: ({ children }: { children: ReactNode }) => (
    <div className="my-8 p-6 rounded-xl bg-blue-50 border border-blue-200 text-gray-900 font-serif shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-12 -translate-y-12 bg-blue-400/10 rounded-full blur-3xl pointer-events-none opacity-70" />
      <div className="flex gap-4 relative z-10">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-base font-semibold mb-1.5 text-blue-700 uppercase tracking-wider">Note</h4>
          <div className="text-lg leading-relaxed text-gray-900">{children}</div>
        </div>
      </div>
    </div>
  ),
  Warning: ({ children }: { children: ReactNode }) => (
    <div className="my-8 p-6 rounded-xl bg-amber-50 border border-amber-200 text-gray-900 font-serif shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-12 -translate-y-12 bg-amber-400/10 rounded-full blur-3xl pointer-events-none opacity-70" />
      <div className="flex gap-4 relative z-10">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shadow-inner">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-base font-semibold mb-1.5 text-amber-700 uppercase tracking-wider">Warning</h4>
          <div className="text-lg leading-relaxed text-gray-900">{children}</div>
        </div>
      </div>
    </div>
  ),
  MDXFeature: ({ title, icon, children }: { title: string; icon: string; children: ReactNode }) => (
    <div className="p-6 rounded-xl border border-gray-100 bg-white shadow-md hover:shadow-lg hover:shadow-indigo-100/40 transition-all duration-300 group transform hover:-translate-y-1">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-200/80 flex items-center justify-center text-indigo-600 shadow-inner group-hover:scale-105 transition-transform">
          {icon === 'heading' && <Hash className="w-5 h-5" />}
          {icon === 'text' && <Quote className="w-5 h-5" />}
          {icon === 'list' && <List className="w-5 h-5" />}
          {icon === 'orderedList' && <ListOrdered className="w-5 h-5" />}
          {icon === 'image' && <Image className="w-5 h-5" />}
          {icon === 'table' && <Table className="w-5 h-5" />}
          {icon === 'link' && <Link2 className="w-5 h-5" />}
          {icon === 'code' && <Code className="w-5 h-5" />}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 font-serif">{title}</h3>
      </div>
      <div className="text-gray-900 font-serif text-base leading-relaxed">
        {children}
      </div>
    </div>
  ),
};

// --- Custom MDX Components (DARK MODE - FULL DEFINITION) ---
const darkMdxComponents: MDXComponentsType = {
  h1: (props: ComponentPropsWithoutRef<'h1'>) => (
    <div className="group relative mb-14 mt-16">
      <span className="absolute -left-8 top-3 hidden h-10 w-1.5 transform bg-gradient-to-b from-indigo-500 to-purple-500 opacity-80 transition-opacity duration-300 lg:block" />
      <h1
        className="font-serif scroll-m-20 text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4" 
        {...props}
      />
      <div className="h-0.5 w-28 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-4" />
    </div>
  ),
  h2: (props: ComponentPropsWithoutRef<'h2'>) => (
    <div className="group relative mb-10 mt-14">
      <span className="absolute -left-6 top-2 hidden h-8 w-1 transform bg-gradient-to-b from-indigo-400 to-purple-400 opacity-70 transition-opacity duration-300 lg:block" />
      <h2
        className="font-serif scroll-m-20 pb-1 text-3xl font-semibold tracking-tight text-white first:mt-0"
        {...props}
      />
      <div className="h-0.5 w-20 bg-gradient-to-r from-indigo-400/80 to-purple-400/80 rounded-full mt-3" />
    </div>
  ),
  h3: (props: ComponentPropsWithoutRef<'h3'>) => (
    <h3
      className="font-serif scroll-m-20 text-2xl font-semibold tracking-tight text-white mt-12 mb-5"
      {...props}
    />
  ),
  h4: (props: ComponentPropsWithoutRef<'h4'>) => (
    <h4
      className="font-serif scroll-m-20 text-xl font-semibold tracking-tight text-white mt-10 mb-4"
      {...props}
    />
  ),
  p: (props: ComponentPropsWithoutRef<'p'>) => (
    <p
      className="font-serif leading-8 [&:not(:first-child)]:mt-6 text-gray-300 text-lg"
      {...props}
    />
  ),
  a: (props: ComponentPropsWithoutRef<'a'>) => (
    <a
      className="font-serif inline-flex items-center gap-1 font-medium text-indigo-400 underline underline-offset-4 decoration-indigo-400/40 hover:text-indigo-300 hover:decoration-indigo-400/60 transition-all"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {props.children}
      <ExternalLink className="w-3.5 h-3.5 opacity-80 shrink-0" />
    </a>
  ),
  ul: (props: ComponentPropsWithoutRef<'ul'>) => (
    <ul
      className="font-serif my-6 ml-6 list-disc [&>li]:mt-3 text-gray-300 marker:text-indigo-400 space-y-3"
      {...props}
    />
  ),
  ol: (props: ComponentPropsWithoutRef<'ol'>) => (
    <ol
      className="font-serif my-6 ml-6 list-decimal [&>li]:mt-3 text-gray-300 marker:text-indigo-400 space-y-3"
      {...props}
    />
  ),
  li: (props: ComponentPropsWithoutRef<'li'>) => (
    <li
      className="font-serif text-lg leading-relaxed pl-2 text-gray-300"
      {...props}
    />
  ),
  code: (props: ComponentPropsWithoutRef<'code'>) => (
    <code
      className="relative rounded-md bg-gray-900/90 px-[0.45rem] py-[0.2rem] font-mono text-sm font-medium text-indigo-300 border border-gray-800/90 shadow-sm"
      {...props}
    />
  ),
  pre: (props: ComponentPropsWithoutRef<'pre'>) => (
    <div className="relative my-10 group">
      <div className="absolute -inset-x-4 -inset-y-3 z-0 rounded-xl bg-indigo-950/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute right-3 top-3 z-20">
        <button className="p-1.5 rounded-lg bg-black/90 text-gray-300 hover:bg-gray-900/90 transition-colors backdrop-blur-sm border border-gray-800/80 shadow-sm">
          <Copy className="w-4 h-4" />
        </button>
      </div>
      <div className="relative z-10 rounded-lg overflow-hidden shadow-lg border border-gray-800/90">
        <div className="h-8 bg-black/90 flex items-center space-x-1.5 px-4 border-b border-gray-800/90">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
        </div>
        <pre
          className="overflow-x-auto py-4 px-5 text-[0.9rem] leading-relaxed bg-black text-gray-100"
          {...props}
        />
      </div>
    </div>
  ),
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote
      className="mt-8 mb-8 bg-indigo-950/5 pl-6 pr-4 py-5 italic text-lg text-gray-200 font-serif rounded-r-lg shadow-md border border-l-4 border-l-indigo-400 border-gray-900/90"
      {...props}
    />
  ),
  img: (props: ComponentPropsWithoutRef<'img'>) => { // Using light version's img logic, adding dark border/shadow
    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const img = e.currentTarget;
      img.onerror = null;
      img.src = "https://cdn.dribbble.com/userupload/8726277/file/still-90096ae0b20436af7d475737af5b86e5.gif?resize=400x0";
      img.classList.add("fallback-image");
    };
    return (
      <figure className="my-12 relative group">
        <div className="absolute -inset-2.5 bg-indigo-900/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
        <img
          className="rounded-xl overflow-hidden shadow-lg border border-gray-800/80 w-full object-cover hover:shadow-indigo-900/20 transition-all duration-300 transform group-hover:scale-[1.01]" // Adjusted border/shadow for dark
          loading="lazy"
          alt={props.alt || 'Image'}
          onError={handleError}
          {...props}
        />
        {props.alt && (
          <figcaption className="mt-4 text-center text-sm text-gray-400 italic font-serif"> {/* Adjusted text color */}
            {props.alt}
          </figcaption>
        )}
      </figure>
    );
  },
  hr: (props: ComponentPropsWithoutRef<'hr'>) => ( // Use dark mode dot color
    <div className="my-16 text-center">
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-700 opacity-80 mx-1.5"></span>
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-700 opacity-80 mx-1.5"></span>
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-700 opacity-80 mx-1.5"></span>
    </div>
  ),
  table: (props: ComponentPropsWithoutRef<'table'>) => ( // Adjust wrapper border
    <div className="my-10 overflow-hidden rounded-xl shadow-lg border border-gray-800/90">
      <div className="overflow-x-auto">
        <table
          className="w-full border-collapse font-serif text-sm"
          {...props}
        />
      </div>
    </div>
  ),
  thead: (props: ComponentPropsWithoutRef<'thead'>) => (
    <thead
      className="bg-gray-900/70 font-serif text-white"
      {...props}
    />
  ),
  tbody: (props: ComponentPropsWithoutRef<'tbody'>) => (
    <tbody
      className="divide-y divide-gray-800/80 font-serif text-gray-300 bg-black/70"
      {...props}
    />
  ),
  tr: (props: ComponentPropsWithoutRef<'tr'>) => (
    <tr
      className="hover:bg-gray-900/70 transition-colors font-serif"
      {...props}
    />
  ),
  th: (props: ComponentPropsWithoutRef<'th'>) => (
    <th
      className="px-5 py-3.5 text-left font-semibold text-white font-serif tracking-wide"
      {...props}
    />
  ),
  td: (props: ComponentPropsWithoutRef<'td'>) => (
    <td
      className="px-5 py-3.5 text-gray-200 align-top font-serif"
      {...props}
    />
  ),
  // Custom components - Dark mode styles
  Note: ({ children }: { children: ReactNode }) => (
    <div className="my-8 p-6 rounded-xl bg-blue-950/10 border border-blue-900/40 text-blue-200 font-serif shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-12 -translate-y-12 bg-blue-500/10 rounded-full blur-3xl pointer-events-none opacity-70" />
      <div className="flex gap-4 relative z-10">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-300 shadow-inner">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-base font-semibold mb-1.5 text-blue-100 uppercase tracking-wider">Note</h4>
          <div className="text-lg leading-relaxed text-blue-200/90">{children}</div>
        </div>
      </div>
    </div>
  ),
  Warning: ({ children }: { children: ReactNode }) => (
    <div className="my-8 p-6 rounded-xl bg-amber-950/10 border border-amber-900/40 text-amber-100 font-serif shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-12 -translate-y-12 bg-amber-500/10 rounded-full blur-3xl pointer-events-none opacity-70" />
      <div className="flex gap-4 relative z-10">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-900/50 flex items-center justify-center text-amber-300 shadow-inner">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-base font-semibold mb-1.5 text-amber-100 uppercase tracking-wider">Warning</h4>
          <div className="text-lg leading-relaxed text-amber-200/90">{children}</div>
        </div>
      </div>
    </div>
  ),
  MDXFeature: ({ title, icon, children }: { title: string; icon: string; children: ReactNode }) => (
    <div className="p-6 rounded-xl border border-gray-800/80 bg-black/90 shadow-md hover:shadow-lg hover:shadow-indigo-950/20 transition-all duration-300 group transform hover:-translate-y-1">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-900/50 to-indigo-800/40 flex items-center justify-center text-indigo-300 shadow-inner group-hover:scale-105 transition-transform">
          {icon === 'heading' && <Hash className="w-5 h-5" />}
          {icon === 'text' && <Quote className="w-5 h-5" />}
          {icon === 'list' && <List className="w-5 h-5" />}
          {icon === 'orderedList' && <ListOrdered className="w-5 h-5" />}
          {icon === 'image' && <Image className="w-5 h-5" />}
          {icon === 'table' && <Table className="w-5 h-5" />}
          {icon === 'link' && <Link2 className="w-5 h-5" />}
          {icon === 'code' && <Code className="w-5 h-5" />}
        </div>
        <h3 className="text-lg font-semibold text-white font-serif">{title}</h3>
      </div>
      <div className="text-gray-300 font-serif text-base leading-relaxed">
        {children}
      </div>
    </div>
  ),
};

// --- Main Component ---
export default function Home() {
  const [targetUrls, setTargetUrls] = useState('https://vercel.com/docs\nhttps://nextjs.org/docs');
  const [apiUrl, setApiUrl] = useState('http://127.0.0.1:8080/crawl');
  const [maxDepth, setMaxDepth] = useState<number>(0);
  const [selectedLangIndex, setSelectedLangIndex] = useState(0);
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlData, setCrawlData] = useState<CrawlResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showCopySnackbar, setShowCopySnackbar] = useState(false);
  const [renderedMdx, setRenderedMdx] = useState<RenderedMdxItem[]>([]);

  const { setTheme, resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  
  // --- Select MDX components based on theme ---
  const componentsToUse = isDarkMode ? darkMdxComponents : lightMdxComponents;
  
  // Force light mode text coloring on mount
  useEffect(() => {
    if (resolvedTheme === 'light' || !resolvedTheme) {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [resolvedTheme]);

  const toggleTheme = useCallback(() => {
    setTheme(isDarkMode ? 'light' : 'dark');
  }, [isDarkMode, setTheme]);

  const copyCodeToClipboard = useCallback(() => {
    if (navigator.clipboard && languages[selectedLangIndex]) {
      navigator.clipboard.writeText(languages[selectedLangIndex].code)
        .then(() => {
          setCopiedCode(true);
          setShowCopySnackbar(true);
          const timer = setTimeout(() => {
            setCopiedCode(false);
          }, 2000);
           const snackbarTimer = setTimeout(() => {
               setShowCopySnackbar(false);
           }, 2500);
          return () => { clearTimeout(timer); clearTimeout(snackbarTimer); };
        })
        .catch(err => console.error("Failed to copy code:", err));
    }
  }, [selectedLangIndex]);

  const handleTabChange = useCallback((index: number) => {
    setSelectedLangIndex(index);
  }, []);

  const handleTargetUrlsChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
    setTargetUrls(event.target.value);
  }, []);

  const handleApiUrlChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setApiUrl(event.target.value);
  }, []);

  const handleMaxDepthChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const depth = parseInt(event.target.value, 10);
    setMaxDepth(isNaN(depth) || depth < 0 ? 0 : depth);
  }, []);

  useEffect(() => {
    const processMdx = async () => {
        if (!crawlData?.mdx_files?.length) {
            setRenderedMdx([]);
            return;
        }
        setError(null);

        try {
            const processed = await Promise.all(
                crawlData.mdx_files.map(async ([url, mdxContent]): Promise<RenderedMdxItem | null> => {
                    if (typeof mdxContent !== 'string' || mdxContent.trim() === '') {
                        console.warn(`Skipping empty or invalid MDX content for ${url}`);
                        return null;
                    }
                    try {
                        const { content, data: frontmatter } = matter(mdxContent);
                        const mdxSource = await serialize(content, { parseFrontmatter: false });
                        return { url, mdxSource, frontmatter: frontmatter || {} };
                    } catch (serializeError) {
                        console.error(`Error processing MDX for ${url}:`, serializeError);
                        setError((prev) => (prev ? `${prev}\n` : '') + `Failed to process MDX for ${url}. Check console for details.`);
                        return null;
                    }
                })
            );
            setRenderedMdx(processed.filter((item): item is RenderedMdxItem => item !== null));
        } catch (err) {
            console.error("Error during MDX processing batch:", err);
            setError('An unexpected error occurred while processing the MDX results.');
        }
    };

    if (crawlData) {
        processMdx();
    } else {
        setRenderedMdx([]);
    }
  }, [crawlData]);

  const startCrawl = useCallback(async () => {
    setIsCrawling(true);
    setError(null);
    setCrawlData(null);
    setRenderedMdx([]);

    let effectiveApiUrl = apiUrl.trim();
    const urlsToCrawl = targetUrls
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0);

    if (!effectiveApiUrl) {
        setError('API Endpoint URL cannot be empty.');
        setIsCrawling(false);
        return;
    }
    if (urlsToCrawl.length === 0) {
        setError('Please enter at least one Target URL to crawl.');
        setIsCrawling(false);
        return;
    }
    if (maxDepth < 0) {
        setError('Max Depth cannot be negative.');
        setIsCrawling(false);
        return;
    }

    effectiveApiUrl = (!effectiveApiUrl.startsWith('http://') && !effectiveApiUrl.startsWith('https://'))
        ? `http://${effectiveApiUrl}`
        : effectiveApiUrl;

    const formattedUrls = urlsToCrawl.map(url =>
        (!url.startsWith('http://') && !url.startsWith('https://')) ? `https://${url}` : url
    );

    console.log(`Starting crawl via API: ${effectiveApiUrl}`);
    console.log(`Domains: ${formattedUrls.join(', ')}`);
    console.log(`Max Depth: ${maxDepth}`);

    try {
      const response = await fetch(effectiveApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
          domains: formattedUrls,
          max_depth: maxDepth
        }),
      });

      const responseBodyText = await response.text();

      if (!response.ok) {
        let errorDetail = responseBodyText;
        try {
          const errorJson = JSON.parse(responseBodyText);
          errorDetail = errorJson.detail || errorJson.message || responseBodyText;
        } catch { /* Ignore parsing error, use raw text */ }
        throw new Error(`API Request Failed: ${response.status} ${response.statusText}. ${errorDetail}`);
      }

      let data: unknown;
      try {
          data = JSON.parse(responseBodyText);
      } catch (parseError) {
          console.error("Failed to parse API response JSON:", parseError);
          console.log("Raw response body:", responseBodyText);
          throw new Error("Received invalid JSON response from the API.");
      }

      const isValidResponse = (res: any): res is CrawlResponse =>
          typeof res?.message === 'string' &&
          Array.isArray(res?.logs) &&
          Array.isArray(res?.mdx_files) &&
          res.mdx_files.every((file: any) => Array.isArray(file) && file.length === 2 && typeof file[0] === 'string' && typeof file[1] === 'string');

      if (!isValidResponse(data)) {
          console.error("Invalid API response structure:", data);
          throw new Error("Received data structure from API does not match expected format.");
      }

      setCrawlData(data);

    } catch (err) {
      console.error("API Call or Processing Error:", err);
      const message = err instanceof Error ? err.message : 'An unknown error occurred. Check browser console for details.';
      setError(message);
    } finally {
      setIsCrawling(false);
    }
  }, [apiUrl, targetUrls, maxDepth]);

  const syntaxHighlighterStyle = isDarkMode ? vs2015 : github;

  return (
    <div className={`min-h-screen font-serif antialiased transition-colors duration-300 ${isDarkMode ? 'dark bg-black' : 'light bg-white'}`}>
      <div className={`fixed inset-0 z-[-1] ${isDarkMode ? 'bg-gradient-to-br from-black via-purple-950/5 to-blue-950/10 opacity-90' : 'bg-white'}`} />

      <header className={`sticky top-0 z-40 w-full backdrop-blur-lg border-b ${isDarkMode ? 'bg-black/70 border-gray-800/50' : 'bg-white/90 border-gray-100'}`}>
        <MotionContainer
          animation="fadeInUp"
          className="container mx-auto px-6 h-20 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <FileCode className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-serif tracking-tight">
              <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>MDX</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">Converter</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`p-2.5 rounded-full group relative overflow-hidden focus:outline-none transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <div className="relative z-10">
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </div>
            </button>
            <a
              href="https://github.com/yourusername/mdx-converter"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Repository"
              className={`p-2.5 rounded-full focus:outline-none transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </MotionContainer>
      </header>

      <main className="container mx-auto px-6 py-12 sm:py-20 max-w-7xl">

        <MotionContainer
          animation="stagger"
          className="mb-20 sm:mb-32 text-center"
        >
          <MotionContainer
            animation="fadeInUp"
            className={`inline-block mb-4 px-4 py-2 rounded-full font-medium text-sm ${isDarkMode ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-50 text-indigo-700'}`}
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Web-to-MDX Conversion Tool
            </span>
          </MotionContainer>

          <MotionContainer
            animation="fadeInUp"
            className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-6 font-serif tracking-tight max-w-4xl mx-auto leading-tight ${isDarkMode ? 'text-white' : 'text-gray-950'}`}
          >
            Transform Web Content into
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent"> Beautiful MDX</span>
          </MotionContainer>

          <MotionContainer
            animation="fadeInUp"
            className={`text-xl md:text-2xl max-w-3xl mx-auto mb-10 leading-relaxed font-serif ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
          >
            Paste a URL, hit crawl, and get beautifully formatted MDX instantly. Perfect for documentation, blogs, and content migration.
          </MotionContainer>

          <MotionContainer
            animation="fadeInUp"
            className="flex flex-wrap justify-center gap-4 mb-10"
          >
            {[
              { icon: <Zap className="w-4 h-4" />, text: "Lightning Fast" },
              { icon: <Eye className="w-4 h-4" />, text: "Beautiful Results" },
              { icon: <Globe className="w-4 h-4" />, text: "Works with Any Site" },
              { icon: <BookOpen className="w-4 h-4" />, text: "Perfect for Docs" }
            ].map((feature, index) => (
              <div key={index}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-md border ${isDarkMode ? 'bg-gray-900/80 shadow-black/20 border-gray-800' : 'bg-white shadow-gray-100/70 border-gray-100'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-indigo-900/40 text-indigo-300' : 'bg-indigo-50 text-indigo-700'}`}>
                  {feature.icon}
                </div>
                <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-900'} font-medium`}>{feature.text}</span>
              </div>
            ))}
          </MotionContainer>

          <MotionContainer
            animation="fadeIn"
            delay={0.4}
            className="max-w-md mx-auto"
          >
            <div className="h-1.5 w-36 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto mb-8 opacity-70" />
          </MotionContainer>
        </MotionContainer>

        <MotionContainer
          animation="fadeInUp"
          delay={0.2}
          className="mb-20"
        >
          <div className= {`rounded-2xl shadow-xl border overflow-hidden ${isDarkMode ? 'bg-black shadow-indigo-950/20 border-gray-800/70' : 'bg-white shadow-indigo-100/80 border-gray-100'}`}>
            <div className={`border-b p-8 pb-6 ${isDarkMode ? 'border-gray-800/70' : 'border-gray-100'}`}>
              <h2 className={`text-2xl font-bold mb-2 font-serif flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-indigo-900/40 text-indigo-300' : 'bg-indigo-50 text-indigo-700'}`}>
                  <Zap className="w-4 h-4" />
                </div>
                Convert Your Web Content
              </h2>
              <p className={`font-serif text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Enter API endpoint, target URLs (one per line), and crawl depth.
              </p>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label htmlFor="apiUrlInput" className={`text-sm font-medium mb-1.5 flex items-center gap-1.5 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  <Server className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                  API Endpoint
                </label>
                <div className="relative">
                  <input
                    type="url"
                    id="apiUrlInput"
                    value={apiUrl}
                    onChange={handleApiUrlChange}
                    placeholder="e.g., http://localhost:8080/crawl"
                    className={`w-full px-4 py-3.5 rounded-xl border focus:ring-2 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition duration-200 font-serif shadow-sm placeholder:text-gray-400/80 dark:placeholder:text-gray-500/80 ${isDarkMode ? 'border-gray-700 bg-black focus:ring-indigo-400/40 text-white' : 'border-gray-200 bg-white focus:ring-indigo-500/50 text-gray-900'}`}
                    disabled={isCrawling}
                  />
                </div>
                <p className={`text-sm pl-1 font-serif ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>The URL of your running Web-to-MDX crawler service.</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="targetUrlsInput" className={`text-sm font-medium mb-1.5 flex items-center gap-1.5 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  <List className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                  Target URLs (one per line)
                </label>
                <textarea
                  id="targetUrlsInput"
                  rows={4}
                  value={targetUrls}
                  onChange={handleTargetUrlsChange}
                  placeholder="e.g., https://docs.example.com&#10;https://blog.example.com/article"
                  className={`w-full px-4 py-3.5 rounded-xl border focus:ring-2 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition duration-200 font-serif shadow-sm placeholder:text-gray-400/80 dark:placeholder:text-gray-500/80 resize-y ${isDarkMode ? 'border-gray-700 bg-black focus:ring-indigo-400/40 text-white' : 'border-gray-200 bg-white focus:ring-indigo-500/50 text-gray-900'}`}
                  disabled={isCrawling}
                />
                <p className={`text-sm pl-1 font-serif ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Enter the starting URLs for crawling.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="md:col-span-1 space-y-2">
                   <label htmlFor="maxDepthInput" className={`text-sm font-medium mb-1.5 flex items-center gap-1.5 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                     <Layers className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                     Max Depth
                   </label>
                   <input
                     type="number"
                     id="maxDepthInput"
                     value={maxDepth}
                     onChange={handleMaxDepthChange}
                     min="0"
                     placeholder="e.g., 0"
                     className={`w-full px-4 py-3.5 rounded-xl border focus:ring-2 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition duration-200 font-serif shadow-sm ${isDarkMode ? 'border-gray-700 bg-black focus:ring-indigo-400/40 text-white' : 'border-gray-200 bg-white focus:ring-indigo-500/50 text-gray-900'}`}
                     disabled={isCrawling}
                   />
                   <p className={`text-xs pl-1 font-serif ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>0 = only entered URLs.</p>
                </div>

                <div className="md:col-span-2"></div>

                <div className="md:col-span-1">
                  <button
                    onClick={startCrawl}
                    disabled={isCrawling}
                    className={`
                      w-full h-[51px] flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg
                      ${isCrawling
                        ? "bg-gray-400 dark:bg-gray-700 cursor-wait shadow-gray-200/10 dark:shadow-black/10"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-indigo-500/25 dark:shadow-indigo-800/20 hover:shadow-indigo-500/30 dark:hover:shadow-indigo-800/30 transform hover:-translate-y-0.5 active:translate-y-0"
                      }
                    `}
                  >
                    {isCrawling ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Working...</span>
                      </>
                    ) : (
                      <>
                        <span>Convert</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </MotionContainer>

        <AnimatePresence>
          {isCrawling && !error && !crawlData && (
            <MotionContainer
              animation="fadeIn"
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full border-t-4 border-indigo-500 animate-spin"></div>
                <div className={`absolute inset-3 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
                  <Loader2 className="w-8 h-8 text-indigo-500 animate-pulse" />
                </div>
              </div>
              <h3 className={`text-xl font-serif font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Processing Your Request
              </h3>
              <p className={`max-w-md font-serif ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Crawling URLs and converting content. This might take a while...
              </p>
            </MotionContainer>
          )}

          {error && (
            <MotionContainer
              animation="fadeInUp"
              className="mb-16"
            >
              <div className={`rounded-2xl p-6 shadow-xl border ${isDarkMode ? 'bg-black border-red-900/50 shadow-red-950/10' : 'bg-white border-red-100 shadow-red-100/20'}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-600'}`}>
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold mb-2 font-serif ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
                      An Error Occurred
                    </h3>
                    <div className={`p-4 rounded-xl font-mono text-sm whitespace-pre-wrap break-words max-h-64 overflow-y-auto ${isDarkMode ? 'bg-red-950/30 text-red-300' : 'bg-red-50/70 text-red-700'}`}>
                      {error}
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => setError(null)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors shadow-sm border ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700' : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-100'}`}
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </MotionContainer>
          )}

          {crawlData && (
            <MotionContainer
              animation="fadeIn"
              className="space-y-16 mb-20"
            >
              <MotionContainer
                animation="fadeInUp"
                delay={0.1}
                className="text-center"
              >
                <div className={`inline-block px-6 py-3 rounded-full font-medium text-base shadow-sm ${isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-700'}`}>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{crawlData.message}</span>
                  </div>
                </div>
              </MotionContainer>

              {crawlData.logs.length > 0 && (
                <MotionContainer
                  animation="fadeInUp"
                  delay={0.2}
                >
                  <div className={`rounded-2xl shadow-lg border overflow-hidden ${isDarkMode ? 'bg-gradient-to-br from-black via-gray-950 to-black shadow-indigo-950/10 border-gray-800/80' : 'bg-white shadow-indigo-100/30 border-gray-100'}`}>
                    <div className={`border-b p-6 ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                      <h3 className={`text-xl font-bold font-serif flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
                          <Terminal className="w-4 h-4" />
                        </div>
                        Crawler Logs
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="font-mono text-sm p-5 rounded-xl bg-gray-50 dark:bg-gray-900/70 text-gray-700 dark:text-gray-300 max-h-80 overflow-y-auto shadow-inner leading-relaxed scrollbar-thin">
                        {crawlData.logs.map((log, i) => (
                          <div key={i} className="flex mb-1.5 last:mb-0">
                            <span className="text-indigo-500 dark:text-indigo-400 mr-2 select-none flex-shrink-0">$</span>
                            <span className="break-words flex-grow">{log}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </MotionContainer>
              )}

              <MotionContainer
                animation="fadeInUp"
                delay={0.3}
              >
                <div className="mb-8 text-center">
                   <h2 className={`text-3xl font-bold font-serif mb-3 flex items-center justify-center gap-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${isDarkMode ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-800/50 shadow-indigo-950/20' : 'bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-indigo-100/50'}`}>
                       <FileCode className="w-5 h-5" />
                      </div>
                      Generated MDX Content
                   </h2>
                   <p className={`font-serif text-lg max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                     Below is the web content converted into MDX format, ready to use.
                   </p>
                   <div className="h-0.5 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto mt-5 opacity-70" />
                </div>

                {renderedMdx.length > 0 ? (
                  <div className="space-y-12">
                    {renderedMdx.map((item, index) => (
                      <MotionContainer
                        key={`${item.url}-${index}`}
                        animation="fadeInUp"
                        delay={0.4 + index * 0.15}
                        className={`rounded-2xl shadow-lg border overflow-hidden transition-all duration-300 ${
                          isDarkMode 
                            ? 'bg-black border-gray-800/90 shadow-indigo-950/10 hover:border-indigo-800/60 hover:shadow-indigo-950/20' 
                            : 'bg-white border-gray-100 shadow-indigo-100/20 hover:border-indigo-200/70 hover:shadow-indigo-100/40'
                        }`}
                      >
                        <div className={`p-6 border-b ${ isDarkMode ? 'border-gray-800/90 bg-gradient-to-b from-black to-gray-950/70' : 'border-gray-100 bg-gradient-to-b from-white to-gray-50/70'}`}>
                          <div className="mb-5">
                             <div className="flex items-center gap-2 mb-2">
                               <div className={`w-6 h-6 rounded-md flex items-center justify-center shadow-sm ${ isDarkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-50 text-indigo-700' }`}>
                                  <Globe className="w-3.5 h-3.5" />
                                </div>
                               <span className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Source URL</span>
                              </div>
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                               className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline font-medium font-serif flex items-center gap-1.5 break-all transition-colors text-base"
                              >
                                {item.url}
                                <ExternalLink className="w-3.5 h-3.5 opacity-70 shrink-0" />
                              </a>
                            </div>

                            {Object.keys(item.frontmatter).length > 0 && (
                              <div>
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`w-6 h-6 rounded-md flex items-center justify-center shadow-sm ${ isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700' }`}>
                                    <TableIcon className="w-3.5 h-3.5" />
                                  </div>
                                <span className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Metadata</span>
                                </div>
                              <div className={`rounded-lg border p-4 max-h-48 overflow-y-auto scrollbar-thin text-xs font-mono ${ isDarkMode ? 'bg-black/50 border-gray-800 scrollbar-thumb-gray-700' : 'bg-white/80 border-gray-100 scrollbar-thumb-gray-200' }`}>
                                <pre className="whitespace-pre-wrap break-all">
                                  {JSON.stringify(item.frontmatter, null, 2)}
                                </pre>
                                </div>
                              </div>
                            )}
                        </div>
                        
                        <div className={`px-6 sm:px-8 md:px-10 py-10 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
                           <div className="mdx-content max-w-none"> 
                              <MDXRemote
                                {...item.mdxSource}
                              components={componentsToUse}
                                scope={item.frontmatter}
                              />
                          </div>
                        </div>
                      </MotionContainer>
                    ))}
                  </div>
                ) : (
                  <MotionContainer
                    animation="fadeIn"
                    delay={0.4}
                    className={`text-center rounded-2xl shadow-lg border p-12 ${isDarkMode ? 'bg-black/80 shadow-indigo-950/10 border-gray-800' : 'bg-white shadow-indigo-100/30 border-gray-100'}`}
                  >
                      <div className="flex flex-col items-center py-10">
                        <div className={`relative w-20 h-20 mb-6 flex items-center justify-center`}>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 opacity-60 dark:opacity-30 blur-lg"></div>
                        <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center drop-shadow-sm border ${isDarkMode ? 'bg-gray-900 text-gray-400 border-gray-700' : 'bg-white text-gray-500 border-gray-100'}`}>
                            <FileCode className="w-8 h-8" />
                          </div>
                        </div>
                        <h3 className={`font-serif text-xl font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        No MDX Content Generated
                        </h3>
                        <p className={`font-serif text-center max-w-md ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        The crawl completed, but no MDX content was generated or processed successfully. Please check the logs or try adjusting your input parameters.
                        </p>
                          </div>
                  </MotionContainer>
                )}
              </MotionContainer>
            </MotionContainer>
          )}
        </AnimatePresence>

        <MotionContainer
          animation="fadeInUp"
          delay={0.3}
          className="mb-24"
        >
          <div className={`rounded-2xl shadow-xl border overflow-hidden ${isDarkMode ? 'bg-black shadow-indigo-950/20 border-gray-800/70' : 'bg-white shadow-indigo-100/70 border-gray-100'}`}>
            <div className={`p-8 border-b ${isDarkMode ? 'border-gray-800/70' : 'border-gray-100'}`}>
              <h2 className={`text-2xl font-bold mb-2 font-serif flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-indigo-900/40 text-indigo-300' : 'bg-indigo-50 text-indigo-700'}`}>
                  <Code className="w-4 h-4" />
                </div>
                API Integration Examples
              </h2>
              <p className={`font-serif text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Integrate the MDX converter into your projects with these code snippets
              </p>
            </div>

            <div className={`${isDarkMode ? 'bg-gray-900/50' : 'bg-white'} px-8 py-1`}>
              <div className={`flex overflow-x-auto scrollbar-thin space-x-1 sm:space-x-2 ${isDarkMode ? 'scrollbar-thumb-gray-700' : 'scrollbar-thumb-gray-200'}`}>
                {languages.map((lang, index) => (
                  <button
                    key={lang.name}
                    onClick={() => handleTabChange(index)}
                    className={`
                      flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-200
                      border-b-2 rounded-t focus:outline-none relative
                      ${selectedLangIndex === index
                        ? 'border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                        : `border-transparent hover:border-gray-300 ${isDarkMode ? 'text-gray-400 hover:text-gray-200 dark:hover:border-gray-600' : 'text-gray-500 hover:text-gray-700'}`
                      }
                    `}
                    aria-current={selectedLangIndex === index ? 'page' : undefined}
                    role="tab"
                  >
                    <span className={lang.iconClasses}>{lang.icon}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={`relative p-6 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
              <div className={`relative rounded-xl overflow-hidden shadow-sm border ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                <div className="absolute top-3 right-3 z-10 flex space-x-2">
                  <button
                    onClick={copyCodeToClipboard}
                    aria-label="Copy code snippet"
                    className={`p-1.5 rounded-lg backdrop-blur-sm shadow-sm transition-colors duration-200 ${isDarkMode ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <SyntaxHighlighter
                  language={languages[selectedLangIndex].highlightLang}
                  style={syntaxHighlighterStyle}
                  showLineNumbers
                  wrapLines={false}
                  lineNumberStyle={{ opacity: 0.4, userSelect: 'none', paddingRight: '1.5em', fontVariantNumeric: 'tabular-nums' }}
                  customStyle={{
                    margin: 0,
                    padding: '1.5rem',
                    borderRadius: '0.75rem',
                    backgroundColor: isDarkMode ? 'black' : 'white',
                    maxHeight: '500px',
                    overflow: 'auto',
                    fontSize: '0.875rem',
                    fontFamily: 'var(--font-mono)',
                    boxShadow: isDarkMode ? 'inset 0 1px 3px rgba(0,0,0,0.05)' : 'none',
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.875rem',
                      display: 'block'
                    }
                  }}
                  className={`font-mono leading-relaxed scrollbar-thin scrollbar-track-transparent ${isDarkMode ? 'scrollbar-thumb-gray-600' : 'scrollbar-thumb-gray-300'}`}
                >
                  {languages[selectedLangIndex].code}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </MotionContainer>
      </main>

      <footer className={`border-t backdrop-blur-lg ${isDarkMode ? 'border-gray-800 bg-black/50' : 'border-gray-100 bg-white/80'}`}>
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <FileCode className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-serif tracking-tight">
                <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>MDX</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-medium">Converter</span>
              </span>
            </div>

            <div className={`font-serif ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              &copy; {new Date().getFullYear()} MDX Converter · Powered by Rust & Next.js
            </div>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showCopySnackbar && (
          <MotionContainer
            animation="fadeInUp"
            yOffset={50}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl text-sm font-medium shadow-lg border flex items-center gap-2 z-50 ${isDarkMode ? 'bg-black text-white border-gray-800' : 'bg-white text-gray-900 border-gray-100'}`}
          >
            <CheckCircle2 className="w-4 h-4 text-green-500 dark:text-green-400" />
            Code copied to clipboard!
          </MotionContainer>
        )}
      </AnimatePresence>
    </div>
  );
}