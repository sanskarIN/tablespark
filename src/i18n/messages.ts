import { copy } from './en';
import { learningCopy } from './learning';
import { pwaCopy } from './pwa';
import { shortcutCopy } from './shortcuts';
import type { WidenMessages } from './types';

export const englishMessages = {
  copy,
  learning: learningCopy,
  pwa: pwaCopy,
  shortcuts: shortcutCopy,
} as const;

export type MessageCatalog = WidenMessages<typeof englishMessages>;
