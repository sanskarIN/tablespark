type LogLevel = 'info' | 'warn' | 'error';

type SafeFields = Readonly<Record<string, string | number | boolean | null>>;

const SECRET_KEY = /token|secret|password|authorization|cookie|email|name/i;

function redact(fields: SafeFields): SafeFields {
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [
      key,
      SECRET_KEY.test(key) ? '[REDACTED]' : value,
    ]),
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
