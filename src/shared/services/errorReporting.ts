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
