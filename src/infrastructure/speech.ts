import { logger } from './logger';

export function canSpeak(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.speechSynthesis?.cancel === 'function' &&
    typeof window.speechSynthesis?.speak === 'function' &&
    typeof SpeechSynthesisUtterance === 'function'
  );
}

export function speak(text: string): boolean {
  if (!canSpeak()) return false;

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    logger.warn('speech_synthesis_failed');
    return false;
  }
}
