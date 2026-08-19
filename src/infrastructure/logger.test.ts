import { afterEach, describe, expect, it, vi } from 'vitest';
import { logger } from './logger';

describe('structured logger', () => {
  afterEach(() => vi.restoreAllMocks());

  it('redacts fields whose names indicate sensitive data', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    logger.warn('test_event', {
      email: 'learner@example.com',
      token: 'not-a-real-token',
      attempts: 4,
    });

    expect(warn).toHaveBeenCalledWith(
      '[TableSpark]',
      expect.objectContaining({
        event: 'test_event',
        email: '[REDACTED]',
        token: '[REDACTED]',
        attempts: 4,
      }),
    );
  });

  it('redacts sensitive values even when the field name is generic', () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    logger.info('test_event', { detail: 'learner@example.com' });

    expect(info).toHaveBeenCalledWith(
      '[TableSpark]',
      expect.objectContaining({ detail: '[REDACTED]' }),
    );
  });

  it('keeps ordinary structured values intact', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    logger.error('test_event', { errorType: 'RangeError', count: 2, recoverable: true });

    expect(error).toHaveBeenCalledWith(
      '[TableSpark]',
      expect.objectContaining({ errorType: 'RangeError', count: 2, recoverable: true }),
    );
  });
});
