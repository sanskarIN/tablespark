export const learningCopy = {
  settings: {
    recordsHeading: 'Learning records',
    historyRetention: 'Session history retention',
    historyOption: (count: number) => `Keep latest ${count} sessions per profile`,
    historyHelp:
      'Reducing retention removes older local session summaries immediately. Individual question attempts are not stored in session history.',
    goalHeading: 'Optional mastery goal',
    masteredFactsGoal: 'Mastered facts goal',
    goalPlaceholder: 'No goal',
    goalHelp:
      'This goal has no deadline, streak, penalty, or notification pressure. It is only a local progress target for the active profile.',
    clearGoal: 'Clear goal',
  },
  progress: {
    goalHeading: 'Mastery goal',
    noGoal: 'No optional mastery goal is set for this profile.',
    goalProgress: (mastered: number, target: number) => `${mastered} of ${target} mastered facts`,
    goalComplete: 'Goal reached. You can keep practicing or choose a new target whenever you want.',
    recentSessions: 'Recent sessions',
    noSessions: 'No session summaries yet. Finish a practice drill to add one.',
    generated: 'Generated drill',
    mistakeReview: 'Mistake review',
    timed: 'Timed',
    untimed: 'Untimed',
    sessionScore: (correct: number, total: number) => `${correct}/${total} correct`,
    sessionDuration: (seconds: number) => `${seconds}s`,
    sessionSeed: (seed: number) => `Seed ${seed}`,
    retainedSessions: (current: number, limit: number) =>
      `${current} saved locally · retention limit ${limit}`,
  },
} as const;
