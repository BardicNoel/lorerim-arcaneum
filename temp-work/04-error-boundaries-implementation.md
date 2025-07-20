# Unit of Work: Error Boundaries Implementation

## 📋 Overview

Implement comprehensive error boundaries and error handling throughout the birthsigns feature to prevent application crashes and provide graceful degradation.

## 🎯 Objective

Create a robust error handling system that catches and handles errors gracefully, provides meaningful error messages to users, and maintains application stability.

## 📊 Current Issues

- **No error boundaries** for component rendering errors
- **Basic error handling** in data fetching (just console.error)
- **No retry mechanisms** for failed requests
- **No fallback UI** for error states
- **No error reporting** or logging
- **Poor user experience** when errors occur

## 🔧 Proposed Changes

### 1. Create Generic Error Boundary Component

#### `src/shared/components/generic/ErrorBoundary.tsx`

```typescript
import React, { Component, type ReactNode } from 'react'
import { Button } from '@/shared/ui/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  resetKey?: string | number
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo })

    // Log error
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Call custom error handler
    this.props.onError?.(error, errorInfo)

    // TODO: Send to error reporting service
    // reportError(error, errorInfo)
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, error: undefined, errorInfo: undefined })
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">
            An unexpected error occurred. Please try again.
          </p>
          <Button onClick={this.handleRetry} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm text-muted-foreground">
                Error Details (Development)
              </summary>
              <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
```

### 2. Create Data Fetching Error Handler

#### `src/shared/hooks/useDataFetching.ts`

```typescript
import { useState, useCallback, useEffect } from 'react'

interface UseDataFetchingOptions<T> {
  url: string
  retryCount?: number
  retryDelay?: number
  onError?: (error: Error) => void
  transform?: (data: any) => T
}

interface UseDataFetchingState<T> {
  data: T | null
  loading: boolean
  error: Error | null
  retryCount: number
}

export function useDataFetching<T>({
  url,
  retryCount: maxRetries = 3,
  retryDelay = 1000,
  onError,
  transform,
}: UseDataFetchingOptions<T>) {
  const [state, setState] = useState<UseDataFetchingState<T>>({
    data: null,
    loading: true,
    error: null,
    retryCount: 0,
  })

  const fetchData = useCallback(
    async (isRetry = false) => {
      try {
        setState(prev => ({
          ...prev,
          loading: true,
          error: null,
          retryCount: isRetry ? prev.retryCount + 1 : 0,
        }))

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const rawData = await response.json()
        const data = transform ? transform(rawData) : rawData

        setState(prev => ({
          ...prev,
          data,
          loading: false,
          error: null,
        }))
      } catch (error) {
        const errorObj =
          error instanceof Error ? error : new Error('Unknown error')

        setState(prev => ({
          ...prev,
          loading: false,
          error: errorObj,
        }))

        onError?.(errorObj)

        // Auto-retry logic
        if (state.retryCount < maxRetries) {
          setTimeout(
            () => {
              fetchData(true)
            },
            retryDelay * (state.retryCount + 1)
          )
        }
      }
    },
    [url, maxRetries, retryDelay, onError, transform, state.retryCount]
  )

  const retry = useCallback(() => {
    fetchData(true)
  }, [fetchData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    ...state,
    retry,
    refetch: () => fetchData(false),
  }
}
```

### 3. Create Birthsign-Specific Error Components

#### `src/features/birthsigns/components/BirthsignErrorFallback.tsx`

```typescript
import React from 'react'
import { Button } from '@/shared/ui/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface BirthsignErrorFallbackProps {
  error?: Error
  retry?: () => void
  title?: string
  message?: string
}

export function BirthsignErrorFallback({
  error,
  retry,
  title = 'Failed to load birthsigns',
  message = 'There was a problem loading the birthsign data. Please try again.',
}: BirthsignErrorFallbackProps) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground mb-6">{message}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {retry && (
            <Button onClick={retry} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground">
              Error Details (Development)
            </summary>
            <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}
```

### 4. Create Error Reporting Service

#### `src/shared/services/errorReporting.ts`

```typescript
export interface ErrorReport {
  error: Error
  errorInfo?: React.ErrorInfo
  componentStack?: string
  userAgent?: string
  timestamp: Date
  url: string
  userId?: string
}

class ErrorReportingService {
  private queue: ErrorReport[] = []
  private isProcessing = false

  async reportError(
    error: Error,
    errorInfo?: React.ErrorInfo,
    componentStack?: string
  ) {
    const errorReport: ErrorReport = {
      error,
      errorInfo,
      componentStack,
      userAgent: navigator.userAgent,
      timestamp: new Date(),
      url: window.location.href,
      userId: this.getUserId(),
    }

    this.queue.push(errorReport)
    await this.processQueue()
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return

    this.isProcessing = true

    try {
      while (this.queue.length > 0) {
        const report = this.queue.shift()
        if (report) {
          await this.sendErrorReport(report)
        }
      }
    } catch (error) {
      console.error('Failed to process error reports:', error)
    } finally {
      this.isProcessing = false
    }
  }

  private async sendErrorReport(report: ErrorReport) {
    // TODO: Implement actual error reporting service integration
    // For now, just log to console
    console.error('Error Report:', report)

    // Example: Send to external service
    // await fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(report),
    // })
  }

  private getUserId(): string | undefined {
    // TODO: Get from auth context or localStorage
    return undefined
  }
}

export const errorReporting = new ErrorReportingService()
```

### 5. Update Birthsigns Components with Error Handling

#### `src/features/birthsigns/pages/AccordionBirthsignsPage.tsx`

```typescript
import { ErrorBoundary } from '@/shared/components/generic/ErrorBoundary'
import { useDataFetching } from '@/shared/hooks/useDataFetching'
import { BirthsignErrorFallback } from '../components/BirthsignErrorFallback'
import { errorReporting } from '@/shared/services/errorReporting'

export function AccordionBirthsignsPage() {
  const {
    data: birthsigns = [],
    loading,
    error,
    retry,
  } = useDataFetching<Birthsign[]>({
    url: `${import.meta.env.BASE_URL}data/birthsigns.json`,
    retryCount: 3,
    retryDelay: 1000,
    onError: (error) => {
      errorReporting.reportError(error)
    },
  })

  if (error) {
    return (
      <BirthsignErrorFallback
        error={error}
        retry={retry}
        title="Failed to load birthsigns"
        message="There was a problem loading the birthsign data. Please try again."
      />
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading birthsigns...</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary
      fallback={<BirthsignErrorFallback />}
      onError={(error, errorInfo) => {
        errorReporting.reportError(error, errorInfo)
      }}
    >
      {/* Existing component content */}
    </ErrorBoundary>
  )
}
```

### 6. Create Error Boundary Wrapper for Individual Components

#### `src/features/birthsigns/components/BirthsignAccordionWithErrorBoundary.tsx`

```typescript
import React from 'react'
import { ErrorBoundary } from '@/shared/components/generic/ErrorBoundary'
import { BirthsignAccordion } from './BirthsignAccordion'
import type { BirthsignAccordionProps } from './BirthsignAccordion'

export function BirthsignAccordionWithErrorBoundary(props: BirthsignAccordionProps) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 border rounded-lg bg-muted/30">
          <p className="text-sm text-muted-foreground">
            Failed to load birthsign details
          </p>
        </div>
      }
    >
      <BirthsignAccordion {...props} />
    </ErrorBoundary>
  )
}
```

## 📁 Files to Create/Modify

### New Files

- `src/shared/components/generic/ErrorBoundary.tsx`
- `src/shared/hooks/useDataFetching.ts`
- `src/features/birthsigns/components/BirthsignErrorFallback.tsx`
- `src/shared/services/errorReporting.ts`
- `src/features/birthsigns/components/BirthsignAccordionWithErrorBoundary.tsx`

### Modified Files

- `src/features/birthsigns/pages/AccordionBirthsignsPage.tsx` - Use error handling
- `src/shared/components/generic/index.ts` - Export ErrorBoundary
- `src/features/birthsigns/components/index.ts` - Export error components

## 🧪 Testing Strategy

- Unit tests for error boundary component
- Integration tests for error scenarios
- Error reporting service tests
- Retry mechanism tests
- Fallback UI tests

## 📈 Benefits

- **Stability**: Prevents application crashes
- **User Experience**: Graceful error handling with retry options
- **Debugging**: Better error reporting and logging
- **Reliability**: Auto-retry mechanisms for transient failures
- **Maintainability**: Centralized error handling logic

## ⚠️ Risks

- **Performance**: Error boundaries add overhead
- **Complexity**: Error handling logic can be complex
- **False Positives**: Over-aggressive error catching
- **User Confusion**: Poor error messages

## 🎯 Success Criteria

- [ ] Error boundaries implemented for all components
- [ ] Data fetching errors handled gracefully
- [ ] Retry mechanisms working
- [ ] Error reporting service functional
- [ ] No application crashes on component errors
- [ ] Meaningful error messages for users
- [ ] Unit tests for all error handling

## 📅 Estimated Effort

- **Development**: 2 days
- **Testing**: 1 day
- **Total**: 3 days
