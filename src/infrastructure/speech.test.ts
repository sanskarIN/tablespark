import { afterEach, describe, expect, it, vi } from 'vitest';
import { canSpeak, speak } from './speech';

class FakeUtterance {
  public rate = 1;
  public pitch = 1;

  public constructor(public readonly text: string) {}
}

describe('speech synthesis adapter', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('reports unavailable speech support without throwing', () => {
    vi.stubGlobal('speechSynthesis', undefined);
    vi.stubGlobal('SpeechSynthesisUtterance', undefined);
    expect(canSpeak()).toBe(false);
    expect(speak('2 times 2')).toBe(false);
  });

  it('speaks through supported browser APIs', () => {
    const cancel = vi.fn();
    const speakUtterance = vi.fn();
    vi.stubGlobal('speechSynthesis', { cancel, speak: speakUtterance });
    vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance);

    expect(canSpeak()).toBe(true);
    expect(speak('7 times 8')).toBe(true);
    expect(cancel).toHaveBeenCalledOnce();
    expect(speakUtterance).toHaveBeenCalledOnce();
  });

  it('turns browser speech failures into a safe false result', () => {
    vi.stubGlobal('speechSynthesis', {
      cancel: () => {
        throw new Error('Browser speech failure');
      },
      speak: vi.fn(),
    });
    vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance);

    expect(speak('3 times 4')).toBe(false);
  });
});
