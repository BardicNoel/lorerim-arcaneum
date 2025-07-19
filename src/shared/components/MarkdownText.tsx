import React from 'react'
import ReactMarkdown from 'react-markdown'
import { cn } from '@/lib/utils'

interface MarkdownTextProps {
  children: string
  className?: string
  components?: React.ComponentProps<typeof ReactMarkdown>['components']
}

export function MarkdownText({
  children,
  className,
  components,
}: MarkdownTextProps) {
  const defaultComponents = {
    // Customize paragraph styling
    p: ({ children, ...props }: any) => (
      <p className="text-sm text-muted-foreground leading-relaxed" {...props}>
        {children}
      </p>
    ),
    // Customize strong/bold styling - this handles ***text*** patterns
    strong: ({ children, ...props }: any) => (
      <strong
        className="font-semibold text-foreground bg-primary/10 px-1 py-0.5 rounded"
        {...props}
      >
        {children}
      </strong>
    ),
    // Customize emphasis/italic styling
    em: ({ children, ...props }: any) => (
      <em className="italic text-foreground" {...props}>
        {children}
      </em>
    ),
    // Customize code styling
    code: ({ children, ...props }: any) => (
      <code
        className="bg-muted px-1 py-0.5 rounded text-xs font-mono"
        {...props}
      >
        {children}
      </code>
    ),
    // Customize inline code styling
    inlineCode: ({ children, ...props }: any) => (
      <code
        className="bg-muted px-1 py-0.5 rounded text-xs font-mono"
        {...props}
      >
        {children}
      </code>
    ),
    // Customize list styling
    ul: ({ children, ...props }: any) => (
      <ul
        className="list-disc list-inside space-y-1 text-sm text-muted-foreground"
        {...props}
      >
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: any) => (
      <ol
        className="list-decimal list-inside space-y-1 text-sm text-muted-foreground"
        {...props}
      >
        {children}
      </ol>
    ),
    li: ({ children, ...props }: any) => (
      <li className="leading-relaxed" {...props}>
        {children}
      </li>
    ),
  }

  return (
    <div className={cn('prose prose-sm max-w-none', className)}>
      <ReactMarkdown
        components={{
          ...defaultComponents,
          ...components,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
