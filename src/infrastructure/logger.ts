type LogLevel = 'info' | 'warn' | 'error';

type SafeFields = Readonly<Record<string, string | number | boolean | null>>;

const SENSITIVE_KEY = /token|secret|password|authorization|cookie|email|name/i;
const SENSITIVE_VALUE =
  /(?:[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|gh[pousr]_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|sk_live_[0-9A-Za-z]{16,}|-----BEGIN\s+(?:RSA\s+|EC\s+|OPENSSH\s+)?PRIVATE KEY-----)/i;

function sanitizeValue(key: string, value: string | number | boolean | null) {
  if (SENSITIVE_KEY.test(key)) return '[REDACTED]';
  if (typeof value === 'string' && SENSITIVE_VALUE.test(value)) return '[REDACTED]';
  return value;
}

function redact(fields: SafeFields): SafeFields {
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, sanitizeValue(key, value)]),
  );
}

function write(level: LogLevel, event: string, fields: SafeFields = {}): void {
  const payload = { event, ...redact(fields), timestamp: new Date().toISOString() };
  if (level === 'error') console.error('[TableSpark]', payload);
  else if (level === 'warn') console.warn('[TableSpark]', payload);
  else console.info('[TableSpark]', payload);
}

export const logger = {
  info: (event: string, fields?: SafeFields) => write('info', event, fields),
  warn: (event: string, fields?: SafeFields) => write('warn', event, fields),
  error: (event: string, fields?: SafeFields) => write('error', event, fields),
} as const;
