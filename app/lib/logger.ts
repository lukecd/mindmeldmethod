interface LogMetadata {
  userId?: string
  unitId?: number
  [key: string]: any
}

class Logger {
  private formatMetadata(metadata: LogMetadata): string {
    return Object.entries(metadata)
      .map(([key, value]) => `${key}=${value}`)
      .join(' | ')
  }

  info(message: string, metadata: LogMetadata = {}) {
    console.log(`ℹ️ [INFO] ${message} | ${this.formatMetadata(metadata)}`)
  }

  error(message: string, error: any, metadata: LogMetadata = {}) {
    console.error(
      `❌ [ERROR] ${message} | ${this.formatMetadata(metadata)}`,
      '\nError details:',
      error
    )
  }

  success(message: string, metadata: LogMetadata = {}) {
    console.log(`✅ [SUCCESS] ${message} | ${this.formatMetadata(metadata)}`)
  }

  warning(message: string, metadata: LogMetadata = {}) {
    console.warn(`⚠️ [WARNING] ${message} | ${this.formatMetadata(metadata)}`)
  }
}

export const logger = new Logger() 