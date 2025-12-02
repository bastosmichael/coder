// Performance monitoring utilities

export interface PerformanceMetrics {
  duration: number
  timestamp: number
  operation: string
  metadata?: Record<string, any>
}

const performanceMetrics: PerformanceMetrics[] = []
const MAX_METRICS = 1000

export function measurePerformance<T>(
  operation: string,
  fn: () => T | Promise<T>,
  metadata?: Record<string, any>
): T | Promise<T> {
  const start = performance.now()
  
  const logMetric = (duration: number) => {
    const metric: PerformanceMetrics = {
      duration,
      timestamp: Date.now(),
      operation,
      metadata
    }
    
    performanceMetrics.push(metric)
    
    // Keep only the last MAX_METRICS entries
    if (performanceMetrics.length > MAX_METRICS) {
      performanceMetrics.shift()
    }
    
    // Log slow operations in development
    if (process.env.NODE_ENV === 'development' && duration > 1000) {
      console.warn(`Slow operation detected: ${operation} took ${duration.toFixed(2)}ms`, metadata)
    }
  }

  try {
    const result = fn()
    
    // Handle both sync and async functions
    if (result instanceof Promise) {
      return result.finally(() => {
        logMetric(performance.now() - start)
      }) as T
    } else {
      logMetric(performance.now() - start)
      return result
    }
  } catch (error) {
    logMetric(performance.now() - start)
    throw error
  }
}

export function getPerformanceMetrics(): PerformanceMetrics[] {
  return [...performanceMetrics]
}

export function clearPerformanceMetrics(): void {
  performanceMetrics.length = 0
}

export function getSlowOperations(threshold = 1000): PerformanceMetrics[] {
  return performanceMetrics.filter(metric => metric.duration > threshold)
}

export function getAverageTime(operation: string): number {
  const operationMetrics = performanceMetrics.filter(m => m.operation === operation)
  if (operationMetrics.length === 0) return 0
  
  const total = operationMetrics.reduce((sum, metric) => sum + metric.duration, 0)
  return total / operationMetrics.length
}

// React hook for performance monitoring
export function usePerformanceMonitor(operation: string, metadata?: Record<string, any>) {
  const startTime = performance.now()
  
  return () => {
    const duration = performance.now() - startTime
    const metric: PerformanceMetrics = {
      duration,
      timestamp: Date.now(),
      operation,
      metadata
    }
    
    performanceMetrics.push(metric)
    
    if (performanceMetrics.length > MAX_METRICS) {
      performanceMetrics.shift()
    }
  }
}