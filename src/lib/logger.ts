/**
 * Logger Utility
 * Provides conditional logging based on environment
 * Only logs in development mode to keep production console clean
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  /**
   * Log info messages (only in development)
   */
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log('[INFO]', ...args);
    }
  },

  /**
   * Log warning messages (only in development)
   */
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn('[WARN]', ...args);
    }
  },

  /**
   * Log error messages (always logged, even in production)
   */
  error: (...args: unknown[]) => {
    console.error('[ERROR]', ...args);
  },

  /**
   * Log debug messages (only in development)
   */
  debug: (...args: unknown[]) => {
    if (isDevelopment) {
      console.debug('[DEBUG]', ...args);
    }
  },

  /**
   * Group logs together (only in development)
   */
  group: (label: string, callback: () => void) => {
    if (isDevelopment) {
      console.group(label);
      callback();
      console.groupEnd();
    }
  },

  /**
   * Log with custom prefix and emoji (only in development)
   */
  custom: (emoji: string, prefix: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.log(`${emoji} [${prefix}]`, ...args);
    }
  },

  /**
   * Payment specific logger
   */
  payment: {
    info: (message: string, data?: unknown) => {
      if (isDevelopment) {
        console.log('💳 [PAYMENT]', message, data || '');
      }
    },
    success: (message: string, data?: unknown) => {
      if (isDevelopment) {
        console.log('✅ [PAYMENT SUCCESS]', message, data || '');
      }
    },
    error: (message: string, error?: unknown) => {
      console.error('❌ [PAYMENT ERROR]', message, error || '');
    },
  },

  /**
   * API specific logger
   */
  api: {
    request: (method: string, url: string, data?: unknown) => {
      if (isDevelopment) {
        console.log(`🌐 [API ${method}]`, url, data || '');
      }
    },
    response: (method: string, url: string, data?: unknown) => {
      if (isDevelopment) {
        console.log(`✅ [API ${method}]`, url, data || '');
      }
    },
    error: (method: string, url: string, error?: unknown) => {
      console.error(`❌ [API ${method}]`, url, error || '');
    },
  },

  /**
   * Component lifecycle logger
   */
  component: {
    mount: (componentName: string) => {
      if (isDevelopment) {
        console.log(`🔧 [MOUNT]`, componentName);
      }
    },
    unmount: (componentName: string) => {
      if (isDevelopment) {
        console.log(`🔧 [UNMOUNT]`, componentName);
      }
    },
    render: (componentName: string, props?: unknown) => {
      if (isDevelopment) {
        console.log(`🎨 [RENDER]`, componentName, props || '');
      }
    },
  },
};

/**
 * Create a scoped logger for a specific module/component
 */
export const createScopedLogger = (scope: string) => ({
  info: (...args: unknown[]) => logger.info(`[${scope}]`, ...args),
  warn: (...args: unknown[]) => logger.warn(`[${scope}]`, ...args),
  error: (...args: unknown[]) => logger.error(`[${scope}]`, ...args),
  debug: (...args: unknown[]) => logger.debug(`[${scope}]`, ...args),
});

export default logger;