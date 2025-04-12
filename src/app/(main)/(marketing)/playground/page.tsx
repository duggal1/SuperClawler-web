// app/page.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';


import { Loader2, AlertTriangle, FileText, Clock, List, Eye, EyeOff } from 'lucide-react'; // Added KeyRound, Eye, EyeOff
import MarkdownRenderer from '@/components/markdown/editor';
import { AuroraText } from '@/components/magicui/aurora-text';

// --- Updated Types to match Rust response ---
interface RequestParams {
    query: string;
    requested_max_urls?: number | null;
    used_max_urls: number;
    requested_firecrawl_depth?: number | null;
    used_firecrawl_depth: number;
    requested_crawl_depth?: number | null;
    used_crawl_depth: number;
    requested_time_limit?: number | null;
    used_time_limit: number;
}

interface TimingInfo {
  firecrawl_api_seconds: number;
  mdx_crawler_seconds: number;
  total_seconds: number;
  // Optional: Keep urls_per_second if it's still calculated or remove
  // urls_per_second?: number;
  params: RequestParams; // Nested parameters
}

interface CrawlResult {
  message: string;
  processed_initial_urls: string[]; // Updated name
  original_urls_from_firecrawl: string[]; // Updated name
  mdx_files: [string, string][];
  timings: TimingInfo; // Updated structure
  logs: string[];
}

interface ApiError {
  error: string;
  logs: string[];
  timings?: Partial<Omit<TimingInfo, 'params'>> & { params?: Partial<RequestParams> }; // Allow partial timings on error
}
// --- End Updated Types ---


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function Home() {
  // --- State ---
  const [query, setQuery] = useState<string>('latest advancements in ai');
  const [maxUrls, setMaxUrls] = useState<number>(10);
  const [firecrawlDepth, setFirecrawlDepth] = useState<number>(1);
  const [crawlDepth, setCrawlDepth] = useState<number>(2);
  const [timeLimit, setTimeLimit] = useState<number>(180);
  // --- NEW State for API Key ---
  const [firecrawlApiKey, setFirecrawlApiKey] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  // --- End NEW State ---

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [result, setResult] = useState<CrawlResult | null>(null);
  const [selectedMdxIndex, setSelectedMdxIndex] = useState<number>(0);

  const logsEndRef = useRef<HTMLDivElement>(null);

  // --- Effects ---
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [result?.logs, error?.logs]);

  // --- Handlers ---
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);
    setSelectedMdxIndex(0);

    // --- Updated Request Body ---
    const requestBody: {
        query: string;
        max_urls: number;
        max_depth: number;
        crawl_depth: number;
        time_limit: number;
        firecrawl_api_key?: string; // Make it optional here
    } = {
      query,
      max_urls: maxUrls,
      max_depth: firecrawlDepth,
      crawl_depth: crawlDepth,
      time_limit: timeLimit,
    };

    // Only include the API key if it's provided
    if (firecrawlApiKey.trim() !== '') {
        requestBody.firecrawl_api_key = firecrawlApiKey.trim();
    }
    // --- End Updated Request Body ---

    try {
      const response = await fetch(`${API_URL}/supercrawler`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data as ApiError);
        console.error('API Error:', data);
      } else {
        setResult(data as CrawlResult);
        console.log('API Success:', data);
        if (data.mdx_files && data.mdx_files.length > 0) {
            setSelectedMdxIndex(0);
        }
      }
    } catch (err) {
      console.error('Fetch Error:', err);
      setError({
        error: err instanceof Error ? err.message : 'An unknown network error occurred',
        logs: ['Network request failed. Is the Rust API running?'],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLogs = () => result?.logs || error?.logs || [];
  const getCurrentTimings = () => result?.timings || error?.timings;
  const selectedMdxContent = result?.mdx_files?.[selectedMdxIndex]?.[1] ?? '';
  const selectedMdxFilename = result?.mdx_files?.[selectedMdxIndex]?.[0] ?? '';

  // --- Render ---
  return (
    <main className="relative min-h-screen bg-white dark:bg-black font-serif">

      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 dark:from-black dark:to-black/90 pointer-events-none" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center space-y-4 mb-16 mt-16 text-6xl md:text-6xl sm:text-3xl font-black font-serif leading-tight tracking-tight ">               
        <AuroraText>
            Super Crawler Playground
          </AuroraText>  
          <p className="text-gray-600 dark:text-gray-300 text-xl max-w-2xl font-medium  mx-auto">
            Discover and analyze content across the web with our advanced crawler
          </p>
        </div>

        <div className="space-y-8">
          <form onSubmit={handleSubmit} className="backdrop-blur-xl bg-white/80 dark:bg-black/80 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl p-8 transition-all duration-300 hover:shadow-3xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Crawler Configuration
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Query Input - Full Width */}
              <div className="col-span-full">
                <label htmlFor="query" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Research Query
                </label>
                <input
                  type="text"
                  id="query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., latest advancements in quantum computing"
                />
              </div>

              {/* Other Inputs */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="maxUrls" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max URLs (Firecrawl)
                  </label>
                  <input
                    type="number"
                    id="maxUrls"
                    min="5"
                    max="120"
                    value={maxUrls}
                    onChange={(e) => setMaxUrls(parseInt(e.target.value, 10))}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Source URLs Firecrawl finds (5-120)
                  </p>
                </div>
                
                <div>
                  <label htmlFor="firecrawlDepth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Firecrawl Depth
                  </label>
                  <input
                    type="number"
                    id="firecrawlDepth"
                    min="0"
                    max="5"
                    value={firecrawlDepth}
                    onChange={(e) => setFirecrawlDepth(parseInt(e.target.value, 10))}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Firecrawl&apos;s link follow depth (0-5)
                  </p>
                </div>

                <div>
                  <label htmlFor="crawlDepth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    MDX Crawl Depth
                  </label>
                  <input
                    type="number"
                    id="crawlDepth"
                    min="0"
                    max="5"
                    value={crawlDepth}
                    onChange={(e) => setCrawlDepth(parseInt(e.target.value, 10))}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Our crawler&apos;s link follow depth (0-5)
                  </p>
                </div>

                <div>
                  <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time Limit (seconds)
                  </label>
                  <input
                    type="number"
                    id="timeLimit"
                    min="30"
                    max="600"
                    step="10"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(parseInt(e.target.value, 10))}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Max execution time (30-600s)
                  </p>
                </div>
              </div>

              {/* API Key Input with Modern Design */}
              <div className="col-span-full mt-8">
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Firecrawl API Key
                </label>
                <div className="relative group">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    id="apiKey"
                    value={firecrawlApiKey}
                    onChange={(e) => setFirecrawlApiKey(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 pr-12"
                    placeholder="fc-..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-10 flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-medium text-lg shadow-lg hover:shadow-xl disabled:opacity-50 transition-all duration-300 transform hover:-translate-y-1 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center space-x-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Start Super Crawl</span>
                )}
              </button>
            </div>
          </form>

          {/* Results Section */}
          {(isLoading || error || result) && (
            <div className="backdrop-blur-xl bg-white/80 dark:bg-black/80 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl p-8 transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Results</h2>
              
              {/* Error Display */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 mb-6 p-4 border border-red-200 dark:border-red-800 rounded-md">
                  <div className="flex items-center">
                    <AlertTriangle className="mr-2 w-5 h-5 text-red-500 dark:text-red-400" />
                    <h3 className="font-medium text-red-800 dark:text-red-200 text-lg">Error</h3>
                  </div>
                  <p className="mt-2 text-red-700 dark:text-red-300 text-sm">{error.error}</p>
                </div>
              )}

              {/* Timing Info */}
              {getCurrentTimings() && (
                <div className="bg-blue-50 dark:bg-blue-900/30 mb-6 p-4 border border-blue-200 dark:border-blue-800 rounded-md">
                  <div className="flex items-center mb-2">
                    <Clock className="mr-2 w-5 h-5 text-blue-600 dark:text-blue-400"/>
                    <h3 className="font-medium text-blue-800 dark:text-blue-200 text-lg">Timings & Parameters</h3>
                  </div>
                  <div className="gap-x-4 gap-y-2 grid grid-cols-2 md:grid-cols-3 text-blue-700 dark:text-blue-300 text-sm">
                    {/* Top level timings */}
                    {getCurrentTimings()?.total_seconds != null && <span className="font-semibold">Total: {getCurrentTimings()?.total_seconds?.toFixed(2)}s</span>}
                    {getCurrentTimings()?.firecrawl_api_seconds != null && <span>Firecrawl API: {getCurrentTimings()?.firecrawl_api_seconds?.toFixed(2)}s</span>}
                    {getCurrentTimings()?.mdx_crawler_seconds != null && <span>MDX Crawler: {getCurrentTimings()?.mdx_crawler_seconds?.toFixed(2)}s</span>}

                    {/* Nested Params - show what was actually used */}
                    {(() => {
                      const params = getCurrentTimings()?.params;
                      if (!params) return null;
                      return (
                        <>
                          {params.used_max_urls != null && (
                            <span>Used Max URLs: {params.used_max_urls}</span>
                          )}
                          {params.used_firecrawl_depth != null && (
                            <span>Used Firecrawl Depth: {params.used_firecrawl_depth}</span>
                          )}
                          {params.used_crawl_depth != null && (
                            <span>Used MDX Depth: {params.used_crawl_depth}</span>
                          )}
                          {params.used_time_limit != null && (
                            <span>Used Time Limit: {params.used_time_limit}s</span>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Logs Display */}
              {getCurrentLogs().length > 0 && (
                <div className="mb-6">
                  <h3 className="flex items-center mb-2 font-medium text-lg">
                    <List className="mr-2 w-5 h-5"/> Logs ({getCurrentLogs().length})
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 border border-subtle-light dark:border-subtle-dark rounded h-64 overflow-y-auto font-mono text-xs">
                    {getCurrentLogs().map((log, index) => (
                      <p key={index} className={`whitespace-pre-wrap ${log.startsWith('❌') || log.includes('Error') ? 'text-red-600 dark:text-red-400' : log.startsWith('⚠️') || log.includes('Warning') ? 'text-yellow-600 dark:text-yellow-400' : log.startsWith('✅') || log.includes('Success') ? 'text-green-600 dark:text-green-400': 'text-gray-600 dark:text-gray-300'}`}>
                        {log}
                      </p>
                    ))}
                    <div ref={logsEndRef} />
                  </div>
                </div>
              )}

              {/* MDX Output */}
              {result && result.mdx_files && result.mdx_files.length > 0 && (
                <div>
                  <h3 className="flex items-center mb-3 font-medium text-lg">
                    <FileText className="mr-2 w-5 h-5"/> Generated MDX ({result.mdx_files.length} files)
                  </h3>
                  {/* File Selector */}
                  {result.mdx_files.length > 1 && (
                    <div className="mb-4">
                      <label htmlFor="mdx-select" className="block mb-1 font-medium text-sm">Select MDX File:</label>
                      <select
                        id="mdx-select"
                        value={selectedMdxIndex}
                        onChange={(e) => setSelectedMdxIndex(parseInt(e.target.value))}
                        className="bg-background-light dark:bg-gray-800 shadow-sm px-3 py-2 border border-subtle-light dark:border-subtle-dark rounded-md focus:outline-none focus:ring-2 w-full md:w-1/2 text-foreground-light dark:text-foreground-dark focus:ring-accent-light dark:focus:ring-accent-dark"
                      >
                        {result.mdx_files.map(([filename], index) => (
                          <option key={index} value={index}>
                            {filename || `File ${index + 1}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <p className="mb-2 text-gray-600 dark:text-gray-400 text-sm">Displaying: <code className='text-xs'>{selectedMdxFilename || 'Selected File'}</code></p>
                  <MarkdownRenderer content={selectedMdxContent} />
                </div>
              )}
              {result && (!result.mdx_files || result.mdx_files.length === 0) && (
                <p className="mt-4 text-gray-500 dark:text-gray-400 text-center italic">No MDX files were generated or returned.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}