/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// components/MarkdownRenderer.tsx
"use client";

import React from 'react';
import ReactMarkdown, { Components, ExtraProps } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';
import Image from 'next/image';

import type PrismTheme  from 'react-syntax-highlighter';
import type { ClassAttributes, HTMLAttributes, ReactNode } from 'react';

interface MarkdownRendererProps {
  content: string;
  domain?: string; // Add domain prop
}

// Define explicit types for props
type CodeProps = ClassAttributes<HTMLElement> & HTMLAttributes<HTMLElement> & ExtraProps & {
  inline?: boolean;
  className?: string;
};

type HeadingProps = ClassAttributes<HTMLHeadingElement> & HTMLAttributes<HTMLHeadingElement> & ExtraProps & {
  level?: number;
};

type ImgProps = ClassAttributes<HTMLImageElement> & HTMLAttributes<HTMLImageElement> & ExtraProps & {
  alt?: string;
  src?: string;
  title?: string;
  width?: number | string;
  height?: number | string;
};

type LinkProps = ClassAttributes<HTMLAnchorElement> & HTMLAttributes<HTMLAnchorElement> & ExtraProps & {
  href?: string;
  title?: string;
};

type ListElementProps = ClassAttributes<HTMLLIElement> & HTMLAttributes<HTMLLIElement> & ExtraProps & {
  checked?: boolean | null;
  index?: number;
  ordered?: boolean;
};

type TableCellProps = ClassAttributes<HTMLTableCellElement> & HTMLAttributes<HTMLTableCellElement> & ExtraProps & {
  isHeader?: boolean;
  style?: React.CSSProperties;
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, domain }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  const codeSyntaxTheme = isDarkMode ? vscDarkPlus : oneLight;

  // Add fallback content check
  if (!content || content.trim() === '') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
        <Image
          src="https://studio.uxpincdn.com/studio/wp-content/uploads/2023/03/404-page-best-practice-1024x512.png.webp"
          alt="No content found"
          width={800}
          height={400}
          className="rounded-xl shadow-2xl"
        />
        <div className="font-serif text-xl text-gray-600 dark:text-gray-300">
          <p>No content found for {domain || 'this page'}.</p>
          <p className="text-sm mt-2 text-gray-500">
            This might be due to:
            <ul className="list-disc list-inside mt-2">
              <li>Private domain access restrictions</li>
              <li>Strong anti-scraping protections</li>
              <li>HTML parsing or MDX formatting issues</li>
            </ul>
          </p>
        </div>
      </div>
    );
  }

  const components: Components = {
    // Ultra-modern paragraph styling
    p: ({ children, ...props }) => (
      <p className="text-lg font-serif leading-relaxed tracking-wide text-gray-800 dark:text-gray-200 my-6" {...props}>
        {children}
      </p>
    ),

    // Modernized headings with refined typography
    h1: ({ children, ...props }: HeadingProps) => (
      <h1 className="font-serif text-4xl lg:text-5xl font-medium tracking-tight text-gray-900 dark:text-white mt-12 mb-8" {...props}>
        {children}
      </h1>
    ),

    h2: ({ children, ...props }: HeadingProps) => (
      <h2 className="font-serif text-3xl lg:text-4xl font-medium tracking-tight text-gray-800 dark:text-gray-100 mt-10 mb-6" {...props}>
        {children}
      </h2>
    ),

    h3: ({ children, ...props }: HeadingProps) => (
      <h3 className="font-serif text-2xl lg:text-3xl font-medium text-gray-700 dark:text-gray-200 mt-8 mb-4" {...props}>
        {children}
      </h3>
    ),

    h4: ({ children, ...props }: HeadingProps) => (
      <h4 className="font-serif text-xl lg:text-2xl font-medium text-gray-600 dark:text-gray-300 mt-6 mb-3" {...props}>
        {children}
      </h4>
    ),

    // Ultra-modern code blocks
    code({ node, inline, className, children, ...props }: CodeProps) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : undefined;

      if (!inline) {
        return (
          <div className="relative my-8 rounded-xl overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 px-4 py-2 text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-bl-xl">
              {language || 'text'}
            </div>
            <SyntaxHighlighter
              style={codeSyntaxTheme}
              language={language}
              PreTag="div"
              className="!bg-white/90 dark:!bg-black/90 !rounded-xl !shadow-xl dark:!shadow-2xl backdrop-blur-sm"
              customStyle={{
                padding: '2.5rem 2rem 2rem',
                margin: '0',
                backgroundColor: isDarkMode ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)',
                fontSize: '0.95em',
                lineHeight: '1.75',
              }}
              {...(props as any)}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          </div>
        );
      }

      return (
        <code className="font-mono bg-gray-100/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 rounded-md px-2 py-1 text-sm backdrop-blur-sm" {...props}>
          {children}
        </code>
      );
    },

    // Modern image presentation
    img: ({ src, alt, title, ...props }: ImgProps) => {
      const imageSrc = src || 'https://studio.uxpincdn.com/studio/wp-content/uploads/2023/03/404-page-best-practice-1024x512.png.webp';
      const imageAlt = alt || 'Content image';
      
      return (
        <figure className="my-10">
          <div className="overflow-hidden rounded-xl shadow-2xl transition-all duration-300 hover:shadow-3xl">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={800}
              height={500}
              className="w-full h-auto hover:scale-105 transition-transform duration-500"
              unoptimized={imageSrc?.startsWith('http')}
              onError={(e: any) => {
                e.target.src = 'https://studio.uxpincdn.com/studio/wp-content/uploads/2023/03/404-page-best-practice-1024x512.png.webp';
              }}
              {...(props as any)}
            />
          </div>
          {imageAlt && (
            <figcaption className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4 font-serif italic">
              {imageAlt}
            </figcaption>
          )}
        </figure>
      );
    },

    // Sleek link styling
    a: ({ children, href, ...props }: LinkProps) => (
      <a
        href={href}
        className="text-blue-600 dark:text-blue-400 font-serif no-underline hover:underline decoration-2 underline-offset-4 transition-all duration-200"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {children}
      </a>
    ),

    // Modern table design
    table: ({ children, ...props }) => (
      <div className="my-8 overflow-x-auto">
        <table className="w-full border-collapse font-serif" {...props}>
          {children}
        </table>
      </div>
    ),

    thead: ({ children, ...props }) => (
      <thead className="border-b-2 border-gray-200 dark:border-gray-700" {...props}>
        {children}
      </thead>
    ),

    th: ({ children, ...props }: TableCellProps) => (
      <th className="py-4 px-6 text-left font-serif font-medium text-gray-800 dark:text-gray-200" {...props}>
        {children}
      </th>
    ),

    td: ({ children, ...props }: TableCellProps) => (
      <td className="py-4 px-6 font-serif text-gray-600 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800" {...props}>
        {children}
      </td>
    ),

    // Refined blockquote
    blockquote: ({ children, ...props }) => (
      <blockquote className="border-l-4 border-gray-200 dark:border-gray-700 pl-6 my-8 italic font-serif text-gray-700 dark:text-gray-300" {...props}>
        {children}
      </blockquote>
    ),

    // Modern list styling
    ul: ({ children, ...props }) => (
      <ul className="list-disc pl-6 my-6 space-y-2 font-serif text-gray-700 dark:text-gray-300" {...props}>
        {children}
      </ul>
    ),

    ol: ({ children, ...props }) => (
      <ol className="list-decimal pl-6 my-6 space-y-2 font-serif text-gray-700 dark:text-gray-300" {...props}>
        {children}
      </ol>
    ),

    li: ({ children, ...props }: ListElementProps) => (
      <li className="font-serif leading-relaxed" {...props}>
        {children}
      </li>
    ),

    // Refined horizontal rule
    hr: ({ ...props }) => (
      <hr className="my-12 border-0 border-t border-gray-200 dark:border-gray-800" {...props} />
    ),

    // Enhanced emphasis elements
    strong: ({ children, ...props }) => (
      <strong className="font-semibold text-gray-900 dark:text-white" {...props}>
        {children}
      </strong>
    ),

    em: ({ children, ...props }) => (
      <em className="font-serif italic text-gray-800 dark:text-gray-200" {...props}>
        {children}
      </em>
    ),
  };

  return (
    <div className="w-full font-serif prose-lg lg:prose-xl dark:prose-invert prose-headings:font-serif prose-p:font-serif prose-blockquote:font-serif prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-pre:bg-white/90 dark:prose-pre:bg-black/90 max-w-none backdrop-blur-sm">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;