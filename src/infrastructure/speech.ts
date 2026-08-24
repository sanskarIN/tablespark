import { logger } from './logger';

type SpeechSynthesisCapability = Pick<SpeechSynthesis, 'cancel' | 'speak'>;

function getSpeechSynthesis(): SpeechSynthesisCapability | null {
  if (typeof window === 'undefined') return null;

  const candidate = Reflect.get(window, 'speechSynthesis') as unknown;
  if (
    typeof candidate !== 'object' ||
    candidate === null ||
    !('cancel' in candidate) ||
    typeof candidate.cancel !== 'function' ||
    !('speak' in candidate) ||
    typeof candidate.speak !== 'function'
  ) {
    return null;
  }

  return candidate as SpeechSynthesisCapability;
}

export function canSpeak(): boolean {
  return getSpeechSynthesis() !== null && typeof SpeechSynthesisUtterance === 'function';
}

export function speak(text: string): boolean {
  const synthesis = getSpeechSynthesis();
  if (synthesis === null || typeof SpeechSynthesisUtterance !== 'function') return false;

  try {
    synthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    synthesis.speak(utterance);
    return true;
  } catch {
    logger.warn('speech_synthesis_failed');
    return false;
  }
}
