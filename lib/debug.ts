// lib/debug.ts

type LogLevel = 'verbose' | 'info' | 'warn' | 'error';

class DebugManager {
  private isEnabled: boolean;

  constructor() {
    // You can toggle this via environment variables or a localStorage key
    this.isEnabled = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';
  }

  private format(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
  }

  log(level: LogLevel, message: string, data?: any) {
    if (!this.isEnabled) return;

    const formatted = this.format(level, message, data);

    switch (level) {
      case 'verbose':
        console.debug(formatted, data || '');
        break;
      case 'info':
        console.info(formatted, data || '');
        break;
      case 'warn':
        console.warn(formatted, data || '');
        break;
      case 'error':
        console.error(formatted, data || '');
        break;
    }
  }

  // Helper methods for cleaner calling
  verbose(msg: string, data?: any) { this.log('verbose', msg, data); }
  info(msg: string, data?: any) { this.log('info', msg, data); }
  warn(msg: string, data?: any) { this.log('warn', msg, data); }
  error(msg: string, data?: any) { this.log('error', msg, data); }
}

export const debug = new DebugManager();