/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/page.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';


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
  processed_mdx_url_count: number;
  initial_urls_from_firecrawl: string[];
  mdx_files: [string, string][];
  timings: TimingInfo;
  params: RequestParams;
}

interface ApiError {
  error: string;
  logs?: string[];
  timings?: Partial<Omit<TimingInfo, 'params'>> & { params?: Partial<RequestParams> };
}
// --- End Updated Types ---


const API_URL =  'http://localhost:8080'; 

export default function Home() {
  // --- State ---
  const [query, setQuery] = useState<string>('latest advancements in ai');
  const [maxUrls, setMaxUrls] = useState<number>(10);
  const [firecrawlDepth, setFirecrawlDepth] = useState<number>(1);
  const [crawlDepth, setCrawlDepth] = useState<number>(1);
  const [timeLimit, setTimeLimit] = useState<number>(300);
  // --- NEW State for API Key ---
  const [firecrawlApiKey, setFirecrawlApiKey] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  // --- End NEW State ---

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [result, setResult] = useState<CrawlResult | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedMdxIndex, setSelectedMdxIndex] = useState<number>(0);

  const logsEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // --- Effects ---
  useEffect(() => {
    // No auto-scrolling behavior
  }, [logs]);

  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  // --- Handlers ---
  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);
    setLogs([]);
    setSelectedMdxIndex(0);

    eventSourceRef.current?.close();

    const requestBody: {
        query: string;
        max_urls: number;
        max_depth: number;
        crawl_depth: number;
        time_limit: number;
        firecrawl_api_key?: string;
    } = {
      query,
      max_urls: maxUrls,
      max_depth: firecrawlDepth,
      crawl_depth: crawlDepth,
      time_limit: timeLimit,
    };

    if (firecrawlApiKey.trim() !== '') {
        requestBody.firecrawl_api_key = firecrawlApiKey.trim();
    }

    const url = `${API_URL}/supercrawler`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream'
        },
        body: JSON.stringify(requestBody),
    }).then(response => {
        if (!response.ok) {
            return response.json().then(errData => {
                throw new Error(errData.error || `HTTP error! status: ${response.status}`);
            }).catch(() => {
                throw new Error(`HTTP error! status: ${response.status}`);
            });
        }
        if (!response.body) {
            throw new Error("Response body is null");
        }

        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
        let buffer = '';

        function push() {
            reader.read().then(({ done, value }) => {
                if (done) {
                    console.log('Stream complete');
                    if (!result && !error) {
                        setError({ error: "Stream ended without completion data." });
                    }
                    setIsLoading(false);
                    return;
                }

                buffer += value;
                let boundary = buffer.indexOf('\n\n');

                while (boundary !== -1) {
                    const chunk = buffer.substring(0, boundary);
                    buffer = buffer.substring(boundary + 2);

                    const lines = chunk.split('\n');
                    let eventType = 'message';
                    let eventData = '';

                    lines.forEach(line => {
                        if (line.startsWith('event: ')) {
                            eventType = line.substring(7).trim();
                        } else if (line.startsWith('data: ')) {
                            eventData += line.substring(6).trim() + '\n';
                        }
                    });

                    eventData = eventData.trim();

                    if (eventData) {
                        if (eventType === 'log') {
                            setLogs(prev => [...prev, eventData]);
                        } else if (eventType === 'completion') {
                            try {
                                const parsedData: CrawlResult = JSON.parse(eventData);
                                setResult(parsedData);
                                if (parsedData.mdx_files && parsedData.mdx_files.length > 0) {
                                    setSelectedMdxIndex(0);
                                }
                                setError(null);
                            } catch (e) {
                                console.error("Failed to parse completion data:", e, eventData);
                                setError({ error: "Failed to parse final results from stream." });
                            }
                            setIsLoading(false);
                            reader.cancel();
                            return;
                        } else if (eventType === 'error') {
                            try {
                                const parsedError: ApiError = JSON.parse(eventData);
                                setError(parsedError);
                            } catch (e) {
                                console.error("Failed to parse error data:", e, eventData);
                                setError({ error: eventData || "Received an unnamed error from stream." });
                            }
                            setIsLoading(false);
                            reader.cancel();
                            return;
                        }
                    }

                    boundary = buffer.indexOf('\n\n');
                }
                push();
            }).catch(err => {
                console.error('Stream reading error:', err);
                setError({ error: `Stream reading failed: ${err.message}` });
                setIsLoading(false);
            });
        }
        push();

    }).catch(err => {
        console.error('Fetch/SSE Error:', err);
        setError({
            error: err instanceof Error ? err.message : 'An unknown network error occurred',
            logs: ['Network request failed. Is the Rust API running and CORS configured?'],
        });
        setIsLoading(false);
    });

  }, [query, maxUrls, firecrawlDepth, crawlDepth, timeLimit, firecrawlApiKey, result, error]);

  const getCurrentLogs = () => logs;
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
                    min="1"
                    max="5"
                    value={firecrawlDepth}
                    onChange={(e) => setFirecrawlDepth(parseInt(e.target.value, 10))}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Firecrawl&apos;s link follow depth (1-5)
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
                    min="150"
                    max="600"
                    step="10"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(parseInt(e.target.value, 10))}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Max execution time (150-600s)
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
          {(isLoading || error || logs.length > 0 || result) && (
            <div className="backdrop-blur-xl bg-white/80 dark:bg-black/80 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl p-8 transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Results</h2>
              
              {/* Loading Indicator during stream */}
              {isLoading && !result && !error && (
                  <div className="flex justify-center items-center py-6 text-gray-500 dark:text-gray-400">
                      <Loader2 className="w-6 h-6 animate-spin mr-3" />
                      <span>Receiving stream...</span>
                  </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 mb-6 p-4 border border-red-200 dark:border-red-800 rounded-md">
                  <div className="flex items-center">
                    <AlertTriangle className="mr-2 w-5 h-5 text-red-500 dark:text-red-400" />
                    <h3 className="font-medium text-red-800 dark:text-red-200 text-lg">Error</h3>
                  </div>
                  <p className="mt-2 text-red-700 dark:text-red-300 text-sm">{error.error}</p>
                   {/* Optionally display logs that came with the error */}
                   {error.logs && error.logs.length > 0 && (
                       <div className="mt-3 border-t border-red-200 dark:border-red-700 pt-2">
                           <p className="text-xs text-red-600 dark:text-red-400 font-mono">{error.logs.join('\n')}</p>
                       </div>
                   )}
                </div>
              )}

              {/* Timing Info */}
              {result?.timings && (
                <div className="bg-blue-50 dark:bg-blue-900/30 mb-6 p-4 border border-blue-200 dark:border-blue-800 rounded-md">
                  <div className="flex items-center mb-2">
                    <Clock className="mr-2 w-5 h-5 text-blue-600 dark:text-blue-400"/>
                    <h3 className="font-medium text-blue-800 dark:text-blue-200 text-lg">Timings & Parameters</h3>
                  </div>
                  <div className="gap-x-4 gap-y-2 grid grid-cols-2 md:grid-cols-3 text-blue-700 dark:text-blue-300 text-sm">
                    {/* Top level timings */}
                    {result.timings.total_seconds != null && <span className="font-semibold">Total: {result.timings.total_seconds.toFixed(2)}s</span>}
                    {result.timings.firecrawl_api_seconds != null && <span>Firecrawl API: {result.timings.firecrawl_api_seconds.toFixed(2)}s</span>}
                    {result.timings.mdx_crawler_seconds != null && <span>MDX Crawler: {result.timings.mdx_crawler_seconds.toFixed(2)}s</span>}

                    {/* Display used params from result.params */}
                    {result.params && (
                        <>
                         {result.params.used_max_urls != null && (
                           <span>Used Max URLs: {result.params.used_max_urls}</span>
                         )}
                         {result.params.used_firecrawl_depth != null && (
                           <span>Used Firecrawl Depth: {result.params.used_firecrawl_depth}</span>
                         )}
                         {result.params.used_crawl_depth != null && (
                           <span>Used MDX Depth: {result.params.used_crawl_depth}</span>
                         )}
                         {result.params.used_time_limit != null && (
                           <span>Used Time Limit: {result.params.used_time_limit}s</span>
                         )}
                        </>
                    )}
                  </div>
                </div>
              )}

              {/* Logs Display */}
              {(logs.length > 0) && (
                <div className="mb-6">
                  <h3 className="flex items-center mb-2 font-medium text-lg">
                    <List className="mr-2 w-5 h-5"/> Logs ({logs.length})
                  </h3>
                  <div 
                    className="bg-gray-50 dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded h-64 overflow-y-auto font-mono text-xs"
                  >
                    {logs.map((log, index) => (
                      <p key={index} className={`whitespace-pre-wrap ${log.startsWith('[ERROR]') || log.startsWith('❌') ? 'text-red-600 dark:text-red-400' : log.startsWith('[WARN]') || log.startsWith('⚠️') ? 'text-yellow-600 dark:text-yellow-400' : log.startsWith('[INFO]') || log.startsWith('✅') ? 'text-green-600 dark:text-green-400': 'text-gray-600 dark:text-gray-300'}`}>
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
                        className="w-full md:w-1/2 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
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