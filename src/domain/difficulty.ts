export type DifficultyLevel = 'starter' | 'foundation' | 'builder' | 'fluency' | 'challenge';

export interface DifficultyPreset {
  readonly label: string;
  readonly description: string;
  readonly min: number;
  readonly max: number;
  readonly count: number;
}

export const difficultyPresets: Readonly<Record<DifficultyLevel, DifficultyPreset>> = {
  starter: {
    label: 'Starter',
    description: 'Facts from 0 to 5 with a short session.',
    min: 0,
    max: 5,
    count: 10,
  },
  foundation: {
    label: 'Foundation',
    description: 'Build confidence with facts from 0 to 10.',
    min: 0,
    max: 10,
    count: 15,
  },
  builder: {
    label: 'Builder',
    description: 'Core classroom facts from 2 to 12.',
    min: 2,
    max: 12,
    count: 20,
  },
  fluency: {
    label: 'Fluency',
    description: 'Strengthen speed and recall through factors up to 15.',
    min: 2,
    max: 15,
    count: 25,
  },
  challenge: {
    label: 'Challenge',
    description: 'Extend fluency through factors up to 20.',
    min: 2,
    max: 20,
    count: 30,
  },
} as const;
