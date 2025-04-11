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
  Code, Moon, Sun, Copy, Check, ExternalLink, 
  Terminal, CheckCircle2, Lightbulb, AlertTriangle, Loader2,
  Globe, Eye, BookOpen, Zap, Download, FileCode, Server, TableIcon,
  Sparkles, ArrowRight, Hash, Quote, List, ListOrdered, Image, Table, Link2,
  Layers,
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import type { ComponentPropsWithoutRef } from 'react';
import Spline from '@splinetool/react-spline/next';
import { SplineScene } from '@/components/ui/splite';
import IntegrationsSection from '@/components/integrations-7';
import SuperCrawlers from '@/components/integrations-1';
import  ChartSuperCrawler  from '@/components/charts/super-crawler/charts';

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
    <div className="group relative mt-16 mb-14">
      <span className="hidden lg:block top-3 -left-8 absolute bg-gradient-to-b from-indigo-500 to-purple-500 opacity-80 w-1.5 h-10 transition-opacity duration-300 transform" />
      <h1
        // Use explicit light mode color, remove dark variant
        className="mb-4 font-serif font-extrabold text-gray-900 text-4xl sm:text-5xl tracking-tight scroll-m-20"
        {...props}
      />
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 mt-4 rounded-full w-28 h-0.5" />
    </div>
  ),
  h2: (props: ComponentPropsWithoutRef<'h2'>) => (
    <div className="group relative mt-14 mb-10">
      <span className="hidden lg:block top-2 -left-6 absolute bg-gradient-to-b from-indigo-400 to-purple-400 opacity-70 w-1 h-8 transition-opacity duration-300 transform" />
      <h2
        // Use explicit light mode color, remove dark variant
        className="first:mt-0 pb-1 font-serif font-semibold text-gray-900 text-3xl tracking-tight scroll-m-20"
        {...props}
      />
      <div className="bg-gradient-to-r from-indigo-400/80 to-purple-400/80 mt-3 rounded-full w-20 h-0.5" />
    </div>
  ),
  h3: (props: ComponentPropsWithoutRef<'h3'>) => (
    <h3
      // Use explicit light mode color, remove dark variant
      className="mt-12 mb-5 font-serif font-semibold text-gray-900 text-2xl tracking-tight scroll-m-20"
      {...props}
    />
  ),
  h4: (props: ComponentPropsWithoutRef<'h4'>) => (
    <h4
      // Use explicit light mode color, remove dark variant
      className="mt-10 mb-4 font-serif font-semibold text-gray-900 text-xl tracking-tight scroll-m-20"
      {...props}
    />
  ),
  p: (props: ComponentPropsWithoutRef<'p'>) => (
    <p
      // Use explicit light mode color, remove dark variant
      className="[&:not(:first-child)]:mt-6 font-serif text-gray-900 text-lg leading-8"
      {...props}
    />
  ),
  a: (props: ComponentPropsWithoutRef<'a'>) => (
    <a
      // Use explicit light mode colors, remove dark variants
      className="inline-flex items-center gap-1 font-serif font-medium text-indigo-600 hover:text-indigo-700 decoration-indigo-500/40 hover:decoration-indigo-600/60 underline underline-offset-4 transition-all"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {props.children}
      <ExternalLink className="opacity-80 w-3.5 h-3.5 shrink-0" />
    </a>
  ),
  ul: (props: ComponentPropsWithoutRef<'ul'>) => (
    <ul
      // Use explicit light mode colors, remove dark variants
      className="space-y-3 my-6 [&>li]:mt-3 ml-6 font-serif text-gray-900 marker:text-indigo-500 list-disc"
      {...props}
    />
  ),
  ol: (props: ComponentPropsWithoutRef<'ol'>) => (
    <ol
      // Use explicit light mode colors, remove dark variants
      className="space-y-3 my-6 [&>li]:mt-3 ml-6 font-serif text-gray-900 marker:text-indigo-500 list-decimal"
      {...props}
    />
  ),
  li: (props: ComponentPropsWithoutRef<'li'>) => (
    <li
      // Use explicit light mode color, remove dark variant
      className="pl-2 font-serif text-gray-900 text-lg leading-relaxed"
      {...props}
    />
  ),
  code: (props: ComponentPropsWithoutRef<'code'>) => (
    <code
      // Use explicit light mode colors, remove dark variants
      className="relative bg-gray-50 shadow-sm px-[0.45rem] py-[0.2rem] border border-gray-200 rounded-md font-mono font-medium text-indigo-700 text-sm"
      {...props}
    />
  ),
  pre: (props: ComponentPropsWithoutRef<'pre'>) => (
    <div className="group relative my-10">
      <div className="z-0 absolute -inset-x-4 -inset-y-3 bg-gray-50/90 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />
      <div className="top-3 right-3 z-20 absolute">
        <button className="bg-white hover:bg-gray-50 shadow-sm backdrop-blur-sm p-1.5 border border-gray-200 rounded-lg text-gray-700 transition-colors">
          <Copy className="w-4 h-4" />
        </button>
      </div>
      <div className="z-10 relative shadow-lg border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex items-center space-x-1.5 bg-white px-4 border-gray-200 border-b h-8">
          <div className="bg-red-400 rounded-full w-2.5 h-2.5"></div>
          <div className="bg-amber-400 rounded-full w-2.5 h-2.5"></div>
          <div className="bg-green-400 rounded-full w-2.5 h-2.5"></div>
        </div>
        <pre
          // Use explicit light mode colors, remove dark variants
          className="bg-white px-5 py-4 overflow-x-auto text-[0.9rem] text-gray-900 leading-relaxed"
          {...props}
        />
      </div>
    </div>
  ),
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote
      // Use explicit light mode colors, remove dark variants
      className="bg-gray-50 shadow-md mt-8 mb-8 py-5 pr-4 pl-6 border border-gray-100 border-l-4 border-l-indigo-500 rounded-r-lg font-serif text-gray-900 text-lg italic"
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
      <figure className="group relative my-12">
        <div className="-z-10 absolute -inset-2.5 bg-indigo-50/30 opacity-0 group-hover:opacity-100 blur-sm rounded-xl transition-opacity duration-300"></div>
        <img
          className="shadow-lg hover:shadow-indigo-100/50 border border-gray-200 rounded-xl w-full object-cover overflow-hidden group-hover:scale-[1.01] transition-all duration-300 transform"
          loading="lazy"
          alt={props.alt || 'Image'}
          onError={handleError}
          {...props}
        />
        {props.alt && (
          <figcaption className="mt-4 font-serif text-gray-700 text-sm text-center italic">
            {props.alt}
          </figcaption>
        )}
      </figure>
    );
  },
  hr: (props: ComponentPropsWithoutRef<'hr'>) => ( // Keep hr as is
    <div className="my-16 text-center">
      <span className="inline-block bg-gray-300 opacity-80 mx-1.5 rounded-full w-1.5 h-1.5"></span>
      <span className="inline-block bg-gray-300 opacity-80 mx-1.5 rounded-full w-1.5 h-1.5"></span>
      <span className="inline-block bg-gray-300 opacity-80 mx-1.5 rounded-full w-1.5 h-1.5"></span>
    </div>
  ),
  table: (props: ComponentPropsWithoutRef<'table'>) => ( // Keep table wrapper as is
    <div className="shadow-lg my-10 border border-gray-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table
          className="w-full font-serif text-sm border-collapse"
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
      className="bg-white divide-y divide-gray-100 font-serif text-gray-900"
      {...props}
    />
  ),
  tr: (props: ComponentPropsWithoutRef<'tr'>) => (
    <tr
      // Use explicit light mode hover, remove dark variant
      className="hover:bg-gray-50 font-serif transition-colors"
      {...props}
    />
  ),
  th: (props: ComponentPropsWithoutRef<'th'>) => (
    <th
      // Use explicit light mode color, remove dark variant
      className="px-5 py-3.5 font-serif font-semibold text-gray-900 text-left tracking-wide"
      {...props}
    />
  ),
  td: (props: ComponentPropsWithoutRef<'td'>) => (
    <td
      // Use explicit light mode color, remove dark variant
      className="px-5 py-3.5 font-serif text-gray-900 align-top"
      {...props}
    />
  ),
  // Custom components - Ensure only light mode styles
  Note: ({ children }: { children: ReactNode }) => (
    <div className="relative bg-blue-50 shadow-lg my-8 p-6 border border-blue-200 rounded-xl overflow-hidden font-serif text-gray-900">
      <div className="top-0 right-0 absolute bg-blue-400/10 opacity-70 blur-3xl rounded-full w-32 h-32 -translate-y-12 translate-x-12 pointer-events-none transform" />
      <div className="z-10 relative flex gap-4">
        <div className="flex flex-shrink-0 justify-center items-center bg-blue-100 shadow-inner rounded-full w-10 h-10 text-blue-600">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h4 className="mb-1.5 font-semibold text-blue-700 text-base uppercase tracking-wider">Note</h4>
          <div className="text-gray-900 text-lg leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  ),
  Warning: ({ children }: { children: ReactNode }) => (
    <div className="relative bg-amber-50 shadow-lg my-8 p-6 border border-amber-200 rounded-xl overflow-hidden font-serif text-gray-900">
      <div className="top-0 right-0 absolute bg-amber-400/10 opacity-70 blur-3xl rounded-full w-32 h-32 -translate-y-12 translate-x-12 pointer-events-none transform" />
      <div className="z-10 relative flex gap-4">
        <div className="flex flex-shrink-0 justify-center items-center bg-amber-100 shadow-inner rounded-full w-10 h-10 text-amber-600">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="mb-1.5 font-semibold text-amber-700 text-base uppercase tracking-wider">Warning</h4>
          <div className="text-gray-900 text-lg leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  ),
  MDXFeature: ({ title, icon, children }: { title: string; icon: string; children: ReactNode }) => (
    <div className="group bg-white shadow-md hover:shadow-indigo-100/40 hover:shadow-lg p-6 border border-gray-100 rounded-xl transition-all hover:-translate-y-1 duration-300 transform">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex justify-center items-center bg-gradient-to-br from-indigo-100 to-indigo-200/80 shadow-inner rounded-lg w-10 h-10 text-indigo-600 group-hover:scale-105 transition-transform">
          {icon === 'heading' && <Hash className="w-5 h-5" />}
          {icon === 'text' && <Quote className="w-5 h-5" />}
          {icon === 'list' && <List className="w-5 h-5" />}
          {icon === 'orderedList' && <ListOrdered className="w-5 h-5" />}
          {icon === 'image' && <Image className="w-5 h-5" />}
          {icon === 'table' && <Table className="w-5 h-5" />}
          {icon === 'link' && <Link2 className="w-5 h-5" />}
          {icon === 'code' && <Code className="w-5 h-5" />}
        </div>
        <h3 className="font-serif font-semibold text-gray-900 text-lg">{title}</h3>
      </div>
      <div className="font-serif text-gray-900 text-base leading-relaxed">
        {children}
      </div>
    </div>
  ),
};

// --- Custom MDX Components (DARK MODE - FULL DEFINITION) ---
const darkMdxComponents: MDXComponentsType = {
  h1: (props: ComponentPropsWithoutRef<'h1'>) => (
    <div className="group relative mt-16 mb-14">
      <span className="hidden lg:block top-3 -left-8 absolute bg-gradient-to-b from-indigo-500 to-purple-500 opacity-80 w-1.5 h-10 transition-opacity duration-300 transform" />
      <h1
        className="mb-4 font-serif font-extrabold text-white text-4xl sm:text-5xl tracking-tight scroll-m-20" 
        {...props}
      />
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 mt-4 rounded-full w-28 h-0.5" />
    </div>
  ),
  h2: (props: ComponentPropsWithoutRef<'h2'>) => (
    <div className="group relative mt-14 mb-10">
      <span className="hidden lg:block top-2 -left-6 absolute bg-gradient-to-b from-indigo-400 to-purple-400 opacity-70 w-1 h-8 transition-opacity duration-300 transform" />
      <h2
        className="first:mt-0 pb-1 font-serif font-semibold text-white text-3xl tracking-tight scroll-m-20"
        {...props}
      />
      <div className="bg-gradient-to-r from-indigo-400/80 to-purple-400/80 mt-3 rounded-full w-20 h-0.5" />
    </div>
  ),
  h3: (props: ComponentPropsWithoutRef<'h3'>) => (
    <h3
      className="mt-12 mb-5 font-serif font-semibold text-white text-2xl tracking-tight scroll-m-20"
      {...props}
    />
  ),
  h4: (props: ComponentPropsWithoutRef<'h4'>) => (
    <h4
      className="mt-10 mb-4 font-serif font-semibold text-white text-xl tracking-tight scroll-m-20"
      {...props}
    />
  ),
  p: (props: ComponentPropsWithoutRef<'p'>) => (
    <p
      className="[&:not(:first-child)]:mt-6 font-serif text-gray-300 text-lg leading-8"
      {...props}
    />
  ),
  a: (props: ComponentPropsWithoutRef<'a'>) => (
    <a
      className="inline-flex items-center gap-1 font-serif font-medium text-indigo-400 hover:text-indigo-300 decoration-indigo-400/40 hover:decoration-indigo-400/60 underline underline-offset-4 transition-all"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {props.children}
      <ExternalLink className="opacity-80 w-3.5 h-3.5 shrink-0" />
    </a>
  ),
  ul: (props: ComponentPropsWithoutRef<'ul'>) => (
    <ul
      className="space-y-3 my-6 [&>li]:mt-3 ml-6 font-serif text-gray-300 marker:text-indigo-400 list-disc"
      {...props}
    />
  ),
  ol: (props: ComponentPropsWithoutRef<'ol'>) => (
    <ol
      className="space-y-3 my-6 [&>li]:mt-3 ml-6 font-serif text-gray-300 marker:text-indigo-400 list-decimal"
      {...props}
    />
  ),
  li: (props: ComponentPropsWithoutRef<'li'>) => (
    <li
      className="pl-2 font-serif text-gray-300 text-lg leading-relaxed"
      {...props}
    />
  ),
  code: (props: ComponentPropsWithoutRef<'code'>) => (
    <code
      className="relative bg-gray-900/90 shadow-sm px-[0.45rem] py-[0.2rem] border border-gray-800/90 rounded-md font-mono font-medium text-indigo-300 text-sm"
      {...props}
    />
  ),
  pre: (props: ComponentPropsWithoutRef<'pre'>) => (
    <div className="group relative my-10">
      <div className="z-0 absolute -inset-x-4 -inset-y-3 bg-indigo-950/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />
      <div className="top-3 right-3 z-20 absolute">
        <button className="bg-black/90 hover:bg-gray-900/90 shadow-sm backdrop-blur-sm p-1.5 border border-gray-800/80 rounded-lg text-gray-300 transition-colors">
          <Copy className="w-4 h-4" />
        </button>
      </div>
      <div className="z-10 relative shadow-lg border border-gray-800/90 rounded-lg overflow-hidden">
        <div className="flex items-center space-x-1.5 bg-black/90 px-4 border-gray-800/90 border-b h-8">
          <div className="bg-red-500 rounded-full w-2.5 h-2.5"></div>
          <div className="bg-amber-500 rounded-full w-2.5 h-2.5"></div>
          <div className="bg-green-500 rounded-full w-2.5 h-2.5"></div>
        </div>
        <pre
          className="bg-black px-5 py-4 overflow-x-auto text-[0.9rem] text-gray-100 leading-relaxed"
          {...props}
        />
      </div>
    </div>
  ),
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote
      className="bg-indigo-950/5 shadow-md mt-8 mb-8 py-5 pr-4 pl-6 border border-gray-900/90 border-l-4 border-l-indigo-400 rounded-r-lg font-serif text-gray-200 text-lg italic"
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
      <figure className="group relative my-12">
        <div className="-z-10 absolute -inset-2.5 bg-indigo-900/5 opacity-0 group-hover:opacity-100 blur-sm rounded-xl transition-opacity duration-300"></div>
        <img
          className="shadow-lg hover:shadow-indigo-900/20 border border-gray-800/80 rounded-xl w-full object-cover overflow-hidden group-hover:scale-[1.01] transition-all duration-300 transform" // Adjusted border/shadow for dark
          loading="lazy"
          alt={props.alt || 'Image'}
          onError={handleError}
          {...props}
        />
        {props.alt && (
          <figcaption className="mt-4 font-serif text-gray-400 text-sm text-center italic"> {/* Adjusted text color */}
            {props.alt}
          </figcaption>
        )}
      </figure>
    );
  },
  hr: (props: ComponentPropsWithoutRef<'hr'>) => ( // Use dark mode dot color
    <div className="my-16 text-center">
      <span className="inline-block bg-indigo-700 opacity-80 mx-1.5 rounded-full w-1.5 h-1.5"></span>
      <span className="inline-block bg-indigo-700 opacity-80 mx-1.5 rounded-full w-1.5 h-1.5"></span>
      <span className="inline-block bg-indigo-700 opacity-80 mx-1.5 rounded-full w-1.5 h-1.5"></span>
    </div>
  ),
  table: (props: ComponentPropsWithoutRef<'table'>) => ( // Adjust wrapper border
    <div className="shadow-lg my-10 border border-gray-800/90 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table
          className="w-full font-serif text-sm border-collapse"
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
      className="bg-black/70 divide-y divide-gray-800/80 font-serif text-gray-300"
      {...props}
    />
  ),
  tr: (props: ComponentPropsWithoutRef<'tr'>) => (
    <tr
      className="hover:bg-gray-900/70 font-serif transition-colors"
      {...props}
    />
  ),
  th: (props: ComponentPropsWithoutRef<'th'>) => (
    <th
      className="px-5 py-3.5 font-serif font-semibold text-white text-left tracking-wide"
      {...props}
    />
  ),
  td: (props: ComponentPropsWithoutRef<'td'>) => (
    <td
      className="px-5 py-3.5 font-serif text-gray-200 align-top"
      {...props}
    />
  ),
  // Custom components - Dark mode styles
  Note: ({ children }: { children: ReactNode }) => (
    <div className="relative bg-blue-950/10 shadow-lg my-8 p-6 border border-blue-900/40 rounded-xl overflow-hidden font-serif text-blue-200">
      <div className="top-0 right-0 absolute bg-blue-500/10 opacity-70 blur-3xl rounded-full w-32 h-32 -translate-y-12 translate-x-12 pointer-events-none transform" />
      <div className="z-10 relative flex gap-4">
        <div className="flex flex-shrink-0 justify-center items-center bg-blue-900/50 shadow-inner rounded-full w-10 h-10 text-blue-300">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h4 className="mb-1.5 font-semibold text-blue-100 text-base uppercase tracking-wider">Note</h4>
          <div className="text-blue-200/90 text-lg leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  ),
  Warning: ({ children }: { children: ReactNode }) => (
    <div className="relative bg-amber-950/10 shadow-lg my-8 p-6 border border-amber-900/40 rounded-xl overflow-hidden font-serif text-amber-100">
      <div className="top-0 right-0 absolute bg-amber-500/10 opacity-70 blur-3xl rounded-full w-32 h-32 -translate-y-12 translate-x-12 pointer-events-none transform" />
      <div className="z-10 relative flex gap-4">
        <div className="flex flex-shrink-0 justify-center items-center bg-amber-900/50 shadow-inner rounded-full w-10 h-10 text-amber-300">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="mb-1.5 font-semibold text-amber-100 text-base uppercase tracking-wider">Warning</h4>
          <div className="text-amber-200/90 text-lg leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  ),
  MDXFeature: ({ title, icon, children }: { title: string; icon: string; children: ReactNode }) => (
    <div className="group bg-black/90 shadow-md hover:shadow-indigo-950/20 hover:shadow-lg p-6 border border-gray-800/80 rounded-xl transition-all hover:-translate-y-1 duration-300 transform">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex justify-center items-center bg-gradient-to-br from-indigo-900/50 to-indigo-800/40 shadow-inner rounded-lg w-10 h-10 text-indigo-300 group-hover:scale-105 transition-transform">
          {icon === 'heading' && <Hash className="w-5 h-5" />}
          {icon === 'text' && <Quote className="w-5 h-5" />}
          {icon === 'list' && <List className="w-5 h-5" />}
          {icon === 'orderedList' && <ListOrdered className="w-5 h-5" />}
          {icon === 'image' && <Image className="w-5 h-5" />}
          {icon === 'table' && <Table className="w-5 h-5" />}
          {icon === 'link' && <Link2 className="w-5 h-5" />}
          {icon === 'code' && <Code className="w-5 h-5" />}
        </div>
        <h3 className="font-serif font-semibold text-white text-lg">{title}</h3>
      </div>
      <div className="font-serif text-gray-300 text-base leading-relaxed">
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
    <main>
      
    <div className={`min-h-screen font-serif antialiased transition-colors duration-300 ${isDarkMode ? 'dark bg-black' : 'light bg-white'}`}>
      <div className={`fixed inset-0 z-[-1] ${isDarkMode ? 'bg-gradient-to-br from-black via-purple-950/5 to-blue-950/10 opacity-90' : 'bg-white'}`} />

      <header className={`sticky top-0 z-40 w-full backdrop-blur-lg border-b ${isDarkMode ? 'bg-black/70 border-gray-800/50' : 'bg-white/90 border-gray-100'}`}>
        <MotionContainer
          animation="fadeInUp"
          className="flex justify-between items-center mx-auto px-6 h-20 container"
        >
          <div className="flex items-center gap-3">
            <div className="flex justify-center items-center bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/20 shadow-lg rounded-lg w-10 h-10">
              <FileCode className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif text-xl tracking-tight">
              <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>MDX</span>
              <span className="font-medium text-indigo-600 dark:text-indigo-400">Converter</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`p-2.5 rounded-full group relative overflow-hidden focus:outline-none transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
            >
             <div className="z-10 relative">
  {isDarkMode ? (
    <span className="text-2xl"> ☀️</span>
  ) : (
    <span className="text-2xl">🌙</span>
  )}
</div>
            </button>
            <a
              href="https://github.com/yourusername/mdx-converter"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Repository"
              className={`p-2.5 rounded-full focus:outline-none transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
            >
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" id="github" className="w-8 h-8">
  <path fill={isDarkMode ? "#ffffff" : "#00020c"} fillRule="evenodd" d="m60,12c0-4.42-3.58-8-8-8H12c-4.42,0-8,3.58-8,8v40c0,4.42,3.58,8,8,8h40c4.42,0,8-3.58,8-8V12h0Z"></path>
  <path fill={isDarkMode ? "#00020c" : "#ffffff"} fillRule="evenodd" d="m26.73,47.67c0,1.1-.01,2.3-.01,3.4,0,.26-.13.51-.34.67-.21.16-.49.2-.74.13-8.4-2.7-14.49-10.58-14.49-19.87,0-11.51,9.34-20.85,20.85-20.85s20.85,9.34,20.85,20.85c0,9.28-6.08,17.15-14.46,19.85-.25.08-.53.03-.74-.13-.21-.16-.34-.4-.34-.67-.02-2.45-.03-5.34-.03-6.65s-1.28-2.39-1.28-2.39c0,0,9.45-1.16,9.45-9.34,0-5.19-2.06-6.94-2.06-6.94.44-1.86.38-3.63-.1-5.31-.07-.24-.31-.4-.56-.38-2.01.18-3.85.91-5.52,2.24,0,0-2.95-.81-5.2-.81h0c-2.25,0-5.2.81-5.2.81-1.67-1.32-3.52-2.06-5.52-2.24-.25-.02-.49.14-.56.38-.48,1.68-.54,3.45-.11,5.31,0,0-2.05,1.75-2.05,6.94,0,8.18,9.45,9.34,9.45,9.34,0,0-1.28,1.08-1.28,2.39v.3c-.72.26-1.7.5-2.8.43-2.99-.2-3.39-3.42-4.62-3.94-.9-.38-1.78-.43-2.45-.37-.2.02-.36.16-.41.35-.05.19.02.39.18.51.81.55,1.89,1.33,2.19,1.9.81,1.52,2.06,3.93,3.67,4.19,1.96.32,3.36.13,4.25-.12h0Z"></path>
</svg>
            </a>
          </div>
        </MotionContainer>
      </header>

      <main className="mx-auto px-6 py-12 sm:py-20 max-w-7xl container">
    

        <MotionContainer
          animation="stagger"
          className="mb-20 sm:mb-32 text-center relative" // Parent needs to be relative
        >
             {/* Spline Container - Make it absolute and behind */}
             <div className="absolute inset-0 z-0">
           <SplineScene 
             // Conditionally set the scene based on the theme
             scene={isDarkMode 
               ? "https://prod.spline.design/vsaphMWTFpDw8RsO/scene.splinecode" // Dark mode scene
               : "https://prod.spline.design/a-X-XpK4S2NGpwdR/scene.splinecode" // Light mode scene
             }
             className="w-full h-full" // Ensure it fills the container
           />
           </div>
         
          {/* Text Content Container 1 - Make it relative and on top */}
          <MotionContainer
            animation="fadeInUp"
            className={`relative z-10 inline-block mb-4 px-4 py-2 rounded-full font-medium text-sm ${isDarkMode ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-50 text-indigo-700'}`}
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Web-to-MDX Conversion Tool
            </span>
          </MotionContainer>

          {/* Text Content Container 2 - Make it relative and on top */}
          <MotionContainer
            animation="fadeInUp"
            className={`relative z-10 text-4xl sm:text-5xl md:text-6xl font-bold block mb-6 font-serif tracking-tight max-w-4xl mx-auto leading-tight ${isDarkMode ? 'text-white' : 'text-gray-950'}`}
          >
     From URL to  <span className="bg-gradient-to-r dark:from-pink-500 dark:to-cyan-400  from-indigo-600 to-purple-600 bg-clip-text text-transparent">NO BS</span>
     <br/> LLM-Ready Markdown in Seconds.
            <span className="block bg-clip-text bg-gradient-to-r from-indigo-600 dark:from-indigo-400 via-purple-600 to-blue-500 dark:to-purple-400 text-transparent"> </span>
          </MotionContainer>

          {/* Text Content Container 3 - Make it relative and on top */}
          <MotionContainer
            animation="fadeInUp"
            className={`relative z-10 text-xl md:text-2xl max-w-3xl mx-auto mb-10 leading-relaxed font-serif ${isDarkMode ? 'text-gray-50' : 'text-gray-700'}`}
          >
          Crawl and scrape 1000+ websites in under 2 minutes with our Rust crawler, Built for speed, low latency, and extreme scalability.
          </MotionContainer>

          {/* Text Content Container 4 - Make it relative and on top */}
          <MotionContainer
            animation="fadeInUp"
            className="relative z-10 flex flex-wrap justify-center gap-4 mb-10"
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

          {/* Divider - Make it relative and on top */}
          <MotionContainer
            animation="fadeIn"
            delay={0.4}
            className="relative z-10 mx-auto max-w-md" // Added relative z-10 here too
          >
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 opacity-70 mx-auto mb-8 rounded-full w-36 h-1.5" />
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

            <div className="space-y-6 p-8">
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

              <div className="items-end gap-4 grid grid-cols-1 md:grid-cols-4">
                <div className="space-y-2 md:col-span-1">
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
              className="flex flex-col justify-center items-center py-20 text-center"
            >
              <div className="relative mb-6 w-20 h-20">
                <div className="absolute inset-0 border-indigo-500 border-t-4 rounded-full animate-spin"></div>
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
                      <div className="bg-gray-50 dark:bg-gray-900/70 shadow-inner p-5 rounded-xl max-h-80 overflow-y-auto font-mono text-gray-700 dark:text-gray-300 text-sm leading-relaxed scrollbar-thin">
                        {crawlData.logs.map((log, i) => (
                          <div key={i} className="flex mb-1.5 last:mb-0">
                            <span className="flex-shrink-0 mr-2 text-indigo-500 dark:text-indigo-400 select-none">$</span>
                            <span className="flex-grow break-words">{log}</span>
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
                   <div className="bg-gradient-to-r from-indigo-500 to-purple-500 opacity-70 mx-auto mt-5 rounded-full w-24 h-0.5" />
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
                          {/* Item Header: URL and Metadata */}
                          <div className={`p-6 border-b ${ isDarkMode ? 'border-gray-800/90 bg-gradient-to-b from-black to-gray-950/70' : 'border-gray-100 bg-gradient-to-b from-white to-gray-50/70'}`}>
                            {/* Source URL (Keep as is) */}
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
                                className="flex items-center gap-1.5 font-serif font-medium text-indigo-600 hover:text-indigo-700 dark:hover:text-indigo-300 dark:text-indigo-400 text-base hover:underline break-all transition-colors"
                              >
                                {item.url}
                                <ExternalLink className="opacity-70 w-3.5 h-3.5 shrink-0" />
                              </a>
                            </div>

                          {/* Frontmatter (Metadata) - Conditional Rendering */}
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`w-6 h-6 rounded-md flex items-center justify-center shadow-sm ${ isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700' }`}>
                                  <TableIcon className="w-3.5 h-3.5" />
                                </div>
                                <span className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Metadata</span>
                              </div>
                            {Object.keys(item.frontmatter).length > 0 ? (
                              // Render the metadata table if frontmatter is not empty
                                  <div className={`rounded-lg border p-4 max-h-48 overflow-y-auto scrollbar-thin text-xs font-mono ${ isDarkMode ? 'bg-black/50 border-gray-800 scrollbar-thumb-gray-700' : 'bg-white/80 border-gray-100 scrollbar-thumb-gray-200' }`}>
                                    <pre className="break-all whitespace-pre-wrap">
                                      {JSON.stringify(item.frontmatter, null, 2)}
                                    </pre>
                                  </div>
                            ) : (
                              // Render "Not Found" message if frontmatter is empty
                              <div className={`rounded-lg border border-dashed p-4 text-center ${ isDarkMode ? 'bg-black/30 border-gray-700/80 text-gray-500' : 'bg-white/60 border-gray-200/90 text-gray-400' }`}>
                                <span className="font-serif text-sm italic">🤷‍♂️ No metadata (title, description, etc.) found on this page.</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* MDX Content Body (Keep as is) */}
                        <div className={`px-6 sm:px-8 md:px-10 py-10 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
                           <div className="max-w-none mdx-content"> 
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
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 dark:from-indigo-900/20 to-purple-100 dark:to-purple-900/20 opacity-60 dark:opacity-30 blur-lg rounded-full"></div>
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
                <div className="top-3 right-3 z-10 absolute flex space-x-2">
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
      <SuperCrawlers/>
<div className="-mt-16">
     <IntegrationsSection/>
     </div>
<ChartSuperCrawler/>

      <AnimatePresence>
        {showCopySnackbar && (
          <MotionContainer
            animation="fadeInUp"
            yOffset={50}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl text-sm font-medium shadow-lg border flex items-center gap-2 z-50 ${isDarkMode ? 'bg-black text-white border-gray-800' : 'bg-white text-gray-900 border-gray-100'}`}
          >
            <CheckCircle2 className="w-4 h-4 text-green-500 dark:text-emerald-600" />
            Code copied to clipboard!
          </MotionContainer>
        )}
      </AnimatePresence>
    </div>
    </main>
  );
}